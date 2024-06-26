// src/features/user/userSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  role: string;
  firstName: string;
}

// Définir l'état initial de l'utilisateur
const initialState: UserState = {
  token: '',
  role: '',
  firstName: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action pour définir les données de l'utilisateur
    setUserData: (
      state,
      action: PayloadAction<{ token: string; role: string; firstName: string }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
    },
    // Action pour effacer les données de l'utilisateur lors de la déconnexion
    logout: (state) => {
      state.token = '';
      state.role = '';
      state.firstName = '';
    },
  },
});

// Exporter les actions
export const { setUserData, logout } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
