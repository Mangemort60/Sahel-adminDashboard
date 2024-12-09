import axios from 'axios';
import React from 'react';
import { SaveButton, SimpleForm, TextInput, useNotify, useRedirect } from 'react-admin';

import getApiUrl from '../utils/getApiUrl';

const CreateAdminUser = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const apiUrl = getApiUrl();
  const handleCreateUser = async (data: any) => {
    const { name, firstName, email, password } = data;

    try {
      // Appeler l'API backend pour créer un utilisateur admin
      const response = await axios.post(`${apiUrl}/auth/register-admin`, {
        name,
        firstName,
        email,
        password,
      });

      notify('Utilisateur admin créé avec succès', { type: 'success' });
      redirect('/users'); // Redirection après la création
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      notify("Erreur lors de la création de l'utilisateur", { type: 'error' });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Créer un compte administrateur</h2>

      <SimpleForm onSubmit={handleCreateUser}>
        <TextInput source="name" label="Nom" />
        <TextInput source="firstName" label="Prénom" />
        <TextInput source="email" label="Email" />
        <TextInput source="password" label="Mot de passe" type="password" />
        <SaveButton />
      </SimpleForm>
    </div>
  );
};

export default CreateAdminUser;
