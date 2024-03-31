import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  ListProps,
  TextField,
} from 'react-admin';

export const ReservationList = (props: ListProps) => (
  <List {...props} title="Liste des réservations">
    <Datagrid rowClick="edit">
      <TextField source="shortId" label="shortID" />
      <TextField source="agent" label="Agent" />
      <TextField source="name" label="Nom" />
      <TextField source="bookingFormData.address" label="Adresse" />
      <TextField source="bookingFormData.city" label="Ville" />
      <EmailField source="email" label="Email" />
      <TextField source="bookingFormData.phone" label="Téléphone" />
      <DateField source="createdAt" label="Créé le" showTime />
      <TextField source="status" label="Statut" />
      <TextField source="formData.sizeRange" label="Surface" />
      <BooleanField source="formData.fruitBasketSelected" label="Panier de Fruits" />
      <TextField source="quote" label="Devis" />
      <TextField source="serviceDate" label="Date du Service" />
    </Datagrid>
  </List>
);
