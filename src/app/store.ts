// src/app/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from '../features/user/userSlice';

const persistConfig = {
  key: 'root', // La clé principale pour le stockage persistant
  storage, // Définir le mode de stockage (par défaut à localStorage)
  whitelist: ['user'], // Les noms des reducers que vous voulez persister
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  // other reducers can be added here
});

// Appliquer le middleware de persistance au reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Créer le store avec le reducer persisté
const store = configureStore({
  reducer: persistedReducer,
});

// Créer le persistor
const persistor = persistStore(store);

// Exporting types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Exporter store et persistor pour être utilisés dans l'application
export { persistor, store };
