// src/features/user/userSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  role: string;
  firstName: string;
  reservationType: string;
  email: string;
}

// Définir l'état initial de l'utilisateur
const initialState: UserState = {
  token: '',
  role: '',
  firstName: '',
  reservationType: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{
        token: string;
        role: string;
        firstName: string;
        reservationType: string;
        email: string;
      }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
      state.reservationType = action.payload.reservationType;
      state.email = action.payload.email;
    },
    // Ajouter une action spécifique pour mettre à jour reservationType
    setReservationType: (state, action: PayloadAction<string>) => {
      state.reservationType = action.payload;
    },
    logout: (state) => {
      state.token = '';
      state.role = '';
      state.firstName = '';
      state.reservationType = '';
      state.email = '';
    },
  },
});

// Exporter la nouvelle action
export const { setUserData, logout, setReservationType } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
