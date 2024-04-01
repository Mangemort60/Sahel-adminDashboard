import {
  DateInput,
  Edit,
  ListProps,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

const roleChoices = [
  { id: 'client', name: 'Client' },
  { id: 'agent', name: 'Agent' },

  // Ajoutez d'autres rôles selon vos besoins
];
export const UsersEdit = (props: ListProps) => (
  <Edit {...props} title="Liste des Users">
    <SimpleForm>
      <TextInput readOnly source="firstName" label="Prénom" />
      <TextInput readOnly source="name" label="Nom" />
      <TextInput readOnly source="shortId" label="ShortID" />
      <SelectInput source="role" label="Rôle" choices={roleChoices} />
    </SimpleForm>
  </Edit>
);
