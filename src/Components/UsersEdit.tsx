import React from 'react';
import {
  DateInput,
  Edit,
  ListProps,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
} from 'react-admin';

import DownloadField from './Utils/DownloadField'; // Assurez-vous que le chemin est correct

const roleChoices = [
  { id: 'client', name: 'Client' },
  { id: 'agent', name: 'Agent' },
  // Ajoutez d'autres rôles selon vos besoins
];

export const UsersEdit = (props: ListProps) => (
  <Edit {...props} title="Edit User">
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <TextInput readOnly source="shortId" label="ShortID" />
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="name" label="Nom" />
      <TextInput source="email" label="Email" />
      <TextInput source="telephone" label="Téléphone" />
      <DateInput source="date_naissance" label="Date de naissance" />
      <TextInput source="nationalite" label="Nationalité" />
      <SelectInput source="role" label="Rôle" choices={roleChoices} />
      <DownloadField source="cvUrl" label="Télécharger CV" />
      <DownloadField source="cinUrl" label="Télécharger CIN" />
      <DownloadField source="ribUrl" label="Télécharger RIB" />
    </SimpleForm>
  </Edit>
);
