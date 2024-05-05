import React, { useState } from 'react';
import {
  Create,
  DateInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

import FileUploader from './Utils/FileUploader'; // Vérifiez que le chemin est correct

export const UserCreate = (props) => {
  const [cvUrl, setCvUrl] = useState('');
  const [cinUrl, setCinUrl] = useState('');
  const [ribUrl, setRibUrl] = useState('');
  // Fonction pour générer un shortID
  const generateShortID = () => {
    const randomPart = Math.floor(1000 + Math.random() * 9000); // De 1000 à 9999
    return `AG-${randomPart}`; // Préfixe AG- pour identifier facilement les agents
  };

  const transformData = (data) => ({
    ...data,
    role: 'agent',
    specificRole: data.specificRole,
    shortId: generateShortID(),
    cvUrl,
    cinUrl,
    ribUrl,
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
        <TextInput source="adresse" label="Adresse complète" validate={[required()]} />
        <TextInput source="telephone" label="Téléphone" validate={[required()]} />
        <TextInput source="email" label="Email" validate={[required()]} />
        <DateInput
          source="date_naissance"
          label="Date de naissance"
          validate={[required()]}
        />
        <TextInput
          source="lieu_naissance"
          label="Lieu de naissance"
          validate={[required()]}
        />
        <TextInput source="nationalite" label="Nationalité" validate={[required()]} />
        <TextInput source="cin_number" label="Numéro de la CIN" validate={[required()]} />
        <FileUploader source="cv" label="Upload CV" onUploadSuccess={setCvUrl} />
        <FileUploader source="cin" label="Upload CIN" onUploadSuccess={setCinUrl} />{' '}
        <FileUploader source="rib" label="Upload RIB" onUploadSuccess={setRibUrl} />{' '}
        {/* Champ pour uploader une CIN */}
        {/* <FileInput
          source="cin_file"
          label="Télécharger CIN"
          accept="application/pdf"
          placeholder={<p>Déposez le fichier PDF de la CIN ici</p>}
        >
          <FileField source="src" title="title" />
        </FileInput> */}
        {/* Champ pour uploader un CV */}
        {/* <FileInput
          source="cv_file"
          label="Télécharger CV"
          accept="application/pdf"
          placeholder={<p>Déposez le fichier PDF du CV ici</p>}
        >
          <FileField source="src" title="title" />
        </FileInput> */}
        <SelectInput
          source="status_verification"
          label="Statut de vérification"
          choices={[
            { id: 'Non vérifié', name: 'Non vérifié' },
            { id: 'Vérifié', name: 'Vérifié' },
          ]}
          validate={[required()]}
        />
        <SelectInput
          source="specificRole"
          label="Rôle spécifique"
          choices={[
            { id: 'ménage', name: 'Femme de ménage' },
            { id: 'cuisine', name: 'Cuisinière' },
            { id: 'gardiennage', name: 'Gardien' },
          ]}
          validate={[required()]}
        />{' '}
      </SimpleForm>
    </Create>
  );
};
