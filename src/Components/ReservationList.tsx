import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  Filter,
  List,
  ListProps,
  SearchInput,
  SelectInput,
  TextField,
} from 'react-admin';

const StatusChoices = [
  { id: 'confirmée', name: 'Confirmée' },
  { id: 'en cours de traitement', name: 'En cours de traitement' },
  { id: 'terminée', name: 'Terminée' },
];

const ReservationFilter = (props) => (
  <Filter {...props}>
    <SelectInput source="status" choices={StatusChoices} alwaysOn />
    <SearchInput
      source="shortId"
      resettable
      alwaysOn
      placeholder="Recherche par ShortID"
    />
  </Filter>
);

export const ReservationList = (props: ListProps) => (
  <List {...props} title="Liste des réservations" filters={<ReservationFilter />}>
    <Datagrid rowClick="edit">
      <TextField readOnly source="shortId" label="shortID" />
      <TextField source="agent" label="Agent" />
      <TextField source="name" label="Nom" />
      <TextField source="bookingFormData.address" label="Adresse" />
      <TextField source="bookingFormData.city" label="Ville" />
      <EmailField source="email" label="Email" />
      <TextField source="bookingFormData.phone" label="Téléphone" />
      <DateField source="serviceDate" label="Date du Service" />
      <TextField source="status" label="Statut" />
      <TextField source="formData.sizeRange" label="Surface" />
      <BooleanField source="formData.fruitBasketSelected" label="Panier de Fruits" />
      <TextField source="quote" label="Devis" />
      <DateField source="createdAt" label="Créé le" showTime />
    </Datagrid>
  </List>
);
