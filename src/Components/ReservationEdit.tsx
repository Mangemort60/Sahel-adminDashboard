import dayjs from 'dayjs';
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

  const StatusChoices = [
    { id: 'à venir', name: 'à venir' },
    { id: 'en cours', name: 'en cours' },
    { id: 'suspendue', name: 'suspendue' },
    { id: 'terminée', name: 'terminée' },
  ];

  useEffect(() => {
    dataProvider
      .getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: { role: 'agent' },
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

  const dateFormatter = (v: string) => {
    if (!v) return null;
    const [day, month, year] = v.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Format ISO
  };

  const dateParser = (v: string) => {
    if (!v) return null;
    const [year, month, day] = v.split('-');
    return `${day}-${month}-${year}`; // Retour au format DD-MM-YYYY
  };

  return (
    <Edit {...props} title="Éditer Réservation">
      <SimpleForm>
        <TextInput disabled source="id" />
        <DateInput readOnly source="createdAt" label="Créé le" />
        <TextInput readOnly source="shortId" label="ShortID" />
        <TextInput source="name" label="Nom" />
        <TextInput source="bookingFormData.address" label="Adresse" />
        <TextInput source="bookingFormData.city" label="Ville" />
        <TextInput source="email" label="Email" />
        <TextInput source="bookingFormData.phone" label="Téléphone" />
        <SelectInput
          source="serviceStatus"
          label="Statut de la réservation"
          choices={StatusChoices}
        />
        <NumberInput source="quote" label="Devis" />
        <DateInput
          source="serviceDate"
          label="Date du Service"
          format={dateFormatter}
          parse={dateParser}
        />
        <BooleanInput source="formData.fruitBasketSelected" label="Panier de Fruits" />
        <BooleanInput source="keyReceived" label="Clés reçues" />
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
