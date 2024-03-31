import { Datagrid, Filter, List, ListProps, SearchInput, TextField } from 'react-admin';

const UsersFilter = (props) => (
  <Filter {...props}>
    <SearchInput
      source="shortId"
      resettable
      alwaysOn
      placeholder="Recherche par ShortID"
    />
  </Filter>
);

export const UsersList = (props: ListProps) => (
  <List {...props} filters={<UsersFilter />} title="Liste des utilisateurs">
    <Datagrid rowClick="edit">
      <TextField source="firstName" label="Prénom" />
      <TextField source="name" label="Nom" />
      <TextField source="email" label="Email" />
      <TextField source="shortId" label="ShortID" />
      <TextField source="role" label="Rôle" />
    </Datagrid>
  </List>
);
