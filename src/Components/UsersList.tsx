import React from 'react';
import {
  CreateButton,
  Datagrid,
  Filter,
  List,
  SearchInput,
  SelectInput,
  TextField,
  TopToolbar,
} from 'react-admin';

const UserListActions = (props) => (
  <TopToolbar>
    <CreateButton {...props} label="Créer un agent" />
  </TopToolbar>
);

const UsersFilter = (props) => (
  <Filter {...props}>
    <SearchInput
      source="shortId"
      resettable
      alwaysOn
      placeholder="Recherche par ShortID"
    />
    <SelectInput
      source="role"
      label="Rôle"
      choices={[
        { id: 'agent', name: 'Agent' },
        { id: 'client', name: 'Client' },
        { id: 'admin', name: 'Admin' },
        // Ajoutez d'autres rôles selon votre application
      ]}
      alwaysOn
    />
    <SelectInput
      source="specificRole"
      label="Type"
      choices={[
        { id: 'ménage', name: 'Ménage' },
        { id: 'cuisine', name: 'Cuisine' },
        { id: 'gardiennage', name: 'Gardiennage' },
        // Ajoutez d'autres rôles selon votre application
      ]}
      alwaysOn
    />
  </Filter>
);

export const UsersList = (props: ListProps) => (
  <List
    {...props}
    filters={<UsersFilter />}
    title="Liste des utilisateurs"
    actions={<UserListActions />}
  >
    <Datagrid rowClick="edit">
      <TextField source="firstName" label="Prénom" />
      <TextField source="name" label="Nom" />
      <TextField source="email" label="Email" />
      <TextField source="shortId" label="ShortID" />
      <TextField source="role" label="Rôle" />
      <TextField source="specificRole" label="type" />
    </Datagrid>
  </List>
);
