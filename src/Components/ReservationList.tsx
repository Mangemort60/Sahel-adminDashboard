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
import { useRecordContext } from 'react-admin';

interface RecordWithFormData {
  formData: {
    sizeRange?: 'lessThan40' | 'from40to80' | 'from80to120' | 'moreThan120';
  };
}

const SizeRangeField = ({ source }: { source: string }) => {
  const record = useRecordContext<RecordWithFormData>();

  if (!record || !record.formData || record.formData.sizeRange === undefined) {
    return <span>Inconnu</span>; // Gérer le cas où sizeRange n'est pas disponible
  }

  const sizeRange = record.formData.sizeRange; // Maintenant de type explicite grâce à TypeScript

  const sizeRangeDescription = (sizeRange: string) => {
    switch (sizeRange) {
      case 'lessThan40':
        return 'Moins de 40m²';
      case 'from40to80':
        return 'Entre 40m² et 80m²';
      case 'from80to120':
        return 'Entre 80m² et 120m²';
      case 'moreThan120':
        return 'Plus de 120m²';
      default:
        return 'Taille inconnue';
    }
  };

  return <span>{sizeRangeDescription(sizeRange)}</span>;
};
const BookingStatusChoices = [
  { id: 'confirmée', name: 'Confirmée' },
  { id: 'en cours de traitement', name: 'En cours de traitement' },
  { id: 'terminée', name: 'Terminée' },
];
const ServiceStatusChoices = [
  { id: 'à venir', name: 'A venir' },
  { id: 'en cours', name: 'En cours' },
  { id: 'suspendue', name: 'Suspendue' },
  { id: 'terminée', name: 'Terminée' },
];

const ReservationFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      source="bookingStatus"
      label="Statut Réservation"
      choices={BookingStatusChoices}
      alwaysOn
    />
    <SelectInput
      source="serviceStatus"
      label="Statut prestation"
      choices={ServiceStatusChoices}
      alwaysOn
    />
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
      <TextField source="serviceDate" label="Date du Service" />
      <TextField source="bookingStatus" label="Statut réservation" />
      <TextField source="serviceStatus" label="Statut prestation" />
      <SizeRangeField source="formData.sizeRange" label="Surface" />
      <TextField source="formData.numberOfFloors" label="Etage(s)" />
      <BooleanField source="formData.fruitBasketSelected" label="Panier de Fruits" />
      <TextField source="quote" label="Devis" />
      <DateField source="createdAt" label="Créé le" showTime />
    </Datagrid>
  </List>
);
