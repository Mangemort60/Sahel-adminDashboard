import React, { useEffect, useState } from 'react';
import {
  BooleanInput,
  DateInput,
  Edit,
  EditProps,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
} from 'react-admin';

interface User {
  id: string | number; // Selon que votre id est une chaîne ou un nombre
  name: string;
  firstName: string;
  shortId: string;

  // Ajoutez d'autres champs nécessaires selon votre modèle de données
}

export const ReservationEdit: React.FC<EditProps> = (props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: { roles: ['agent'] },
      })
      .then(({ data }) => {
        const typedData = data as User[]; // Assurer que data est typée comme un tableau de User
        setUsers(
          typedData.map((user) => ({
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            shortId: user.shortId,
          })),
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [dataProvider]);

  return (
    <Edit {...props} title="Éditer Réservation">
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="name" label="Nom" />
        <TextInput source="bookingFormData.address" label="Adresse" />
        <TextInput source="bookingFormData.city" label="Ville" />
        <TextInput source="email" label="Email" />
        <TextInput source="bookingFormData.phone" label="Téléphone" />
        <DateInput source="createdAt" label="Créé le" />
        <TextInput source="status" label="Statut" />
        <NumberInput source="quote" label="Devis" />
        <DateInput source="serviceDate" label="Date du Service" />
        <BooleanInput source="formData.fruitBasketSelected" label="Panier de Fruits" />
        <SelectInput
          source="agent"
          label="Agent"
          choices={users}
          optionText={(user: User) => `${user.firstName} ${user.name} (${user.shortId})`}
          optionValue="name"
          // disabled={loading}
        />
        {/* Assurez-vous d'ajuster les champs selon votre modèle de données */}
      </SimpleForm>
    </Edit>
  );
};
