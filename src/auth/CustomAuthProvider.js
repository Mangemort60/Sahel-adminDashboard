import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Importer les fonctions Firestore
import Cookies from 'js-cookie';

import { auth } from './../../firebaseConfig';

// Initialiser Firestore
const db = getFirestore();

const CustomAuthProvider = {
  login: async ({ username, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      if (user) {
        // Récupérer le document de l'utilisateur depuis Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userRoles = userDocSnap.data().role; // Supposons que c'est un tableau
          if (userRoles === 'admin') {
            // L'utilisateur a le rôle "admin"
            const token = await user.getIdToken();
            Cookies.set('token', token, { expires: 7 });
            return Promise.resolve();
          } else {
            // L'utilisateur n'a pas le rôle "admin"
            await signOut(auth);
            throw new Error('Accès refusé. Vous devez être un administrateur.');
          }
        } else {
          // Le document de l'utilisateur n'existe pas dans Firestore
          await signOut(auth);
          throw new Error('Document utilisateur non trouvé.');
        }
      }
    } catch (error) {
      console.error("Erreur d'authentification : ", error);
      throw error; // Propager l'erreur pour la gérer plus loin
    }
  },
  logout: () => {
    Cookies.remove('token');
    return signOut(auth);
  },
  checkAuth: async () => {
    const token = Cookies.get('token');

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
  getPermissions: () => Promise.resolve(),
};

export default CustomAuthProvider;
