import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Importer les fonctions Firestore
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
          const { role, firstName } = userDocSnap.data(); // Supposons que firstName soit aussi stocké
          const token = await user.getIdToken();

          // Dispatch Redux action to set user data in the global state
          store.dispatch(setUserData({ token, role, firstName }));

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

    // Vérifier si le jeton est présent et valide
    if (token) {
      // ... (vérification du jeton côté serveur, si nécessaire) ...
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Non authentifié'));
    }
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = Cookies.get('role'); // Récupérer le rôle depuis le cookie
    return Promise.resolve(role);
  },
};

export default CustomAuthProvider;
