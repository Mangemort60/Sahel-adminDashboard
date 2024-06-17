import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB2T_IRsooIzycMWzkg97RTGQsNnGwY5Co',
  authDomain: 'sahel-26e16.firebaseapp.com',
  projectId: 'sahel-26e16',
  storageBucket: 'sahel-26e16.appspot.com',
  messagingSenderId: '27003834326',
  appId: '1:27003834326:web:7b84c54c0d3c359894de77',
  measurementId: 'G-FVM2SHPVP0',
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Accéder à l'authentification Firebase
const auth = getAuth(app);

// Initialiser Firestore
const db = getFirestore(app);

// Initialiser Firebase Storage
const storage = getStorage(app);

export { auth, db, storage };

export default firebaseConfig;
