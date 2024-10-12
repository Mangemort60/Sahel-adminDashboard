import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Cookies from 'js-cookie';

import { store } from '../app/store';
import { logout as logoutAction, setUserData } from '../features/user/userSlice';
import { auth } from './../../firebaseConfig';

// Initialiser Firestore
const db = getFirestore();

const CustomAuthProvider = {
  login: async ({ username, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { role, firstName } = userDocSnap.data();

          console.log('Role from Firestore:', role);

          // Vérifiez si le rôle est admin ou superAdmin
          if (role !== 'admin' && role !== 'superAdmin') {
            await signOut(auth);
            console.error('Unauthorized role:', role);
            throw new Error('Vous ne disposez pas des autorisations nécessaires.');
          }

          const token = await user.getIdToken();
          const email = user.email;

          // Stockez le rôle dans les cookies pour une utilisation ultérieure
          Cookies.set('role', role, { expires: 7 });

          // Dispatch Redux action to set user data in the global state
          store.dispatch(setUserData({ token, role, firstName, email }));

          return Promise.resolve();
        } else {
          await signOut(auth);
          throw new Error('Document utilisateur non trouvé.');
        }
      }
    } catch (error) {
      console.error("Erreur d'authentification : ", error);
      throw error;
    }
  },
  logout: () => {
    store.dispatch(logoutAction()); // Utilisez l'action de déconnexion Redux pour effacer l'état de l'utilisateur
    return signOut(auth);
  },
  checkAuth: async () => {
    const state = store.getState();
    const token = state.user.token;
    const role = Cookies.get('role');

    console.log('CheckAuth - token:', token, 'role:', role);

    if (token && (role === 'admin' || role === 'superAdmin')) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Non authentifié ou rôle non autorisé'));
    }
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = Cookies.get('role');
    console.log('GetPermissions - role:', role);
    if (role === 'admin' || role === 'superAdmin') {
      return Promise.resolve(role);
    } else {
      return Promise.reject(new Error('Rôle non autorisé'));
    }
  },
};

export default CustomAuthProvider;
