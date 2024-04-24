import React from 'react';
import { Create, required, SimpleForm, TextInput } from 'react-admin';

import { UsersList } from './UsersList';

export const UserCreate = (props) => {
  // Fonction pour générer un shortID
  const generateShortID = () => {
    const randomPart = Math.floor(1000 + Math.random() * 9000); // De 1000 à 9999
    return `AG-${randomPart}`; // Préfixe AG- pour identifier facilement les agents
  };

  const transformData = (data) => ({
    ...data,
    role: 'agent',
    shortId: generateShortID(),
  });

  return (
    <Create
      {...props}
      title="Créer un nouvel agent"
      transform={transformData}
      redirect="/users"
    >
      <SimpleForm>
        <TextInput source="name" label="Nom" validate={[required()]} />
        <TextInput source="firstName" label="Prénom" validate={[required()]} />
        <TextInput source="email" label="Email" validate={[required()]} />
        {/* Pas besoin d'ajouter le champ rôle ici car il est ajouté automatiquement */}
      </SimpleForm>
    </Create>
  );
};
