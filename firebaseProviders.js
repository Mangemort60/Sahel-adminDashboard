// src/firebaseProviders.js
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
  FirebaseRealTimeSaga,
} from 'react-admin-firebase';

import { firebaseConfig } from './firebaseConfig';

const options = {
  logging: true,
  watch: ['reservations'],
};

export const dataProvider = FirebaseDataProvider(firebaseConfig, options);
export const authProvider = FirebaseAuthProvider(firebaseConfig, options);
export const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);
