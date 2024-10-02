import { Box, Divider, TextField, Typography } from '@mui/material';
import {
  BooleanInput,
  DateInput,
  FunctionField,
  NumberInput,
  SelectInput,
  TextInput,
} from 'react-admin';
import { useParams } from 'react-router-dom';

import AgentSelect from './AgentSelect';

const numberOfFloorsChoices = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
];

const sizeRangeChoices = [
  { id: 'lessThan40', name: 'moins de 40m²' },
  { id: 'from40to80', name: 'entre 40 et 80m²' },
  { id: 'from80to120', name: 'entre 80 et 120m²' },
  { id: 'moreThan120', name: 'plus de 120m²' },
];

const bookingStatusChoices = [
  { id: 'confirmé', name: 'confirmé' },
  { id: 'à venir', name: 'à venir' },
  { id: 'annulé', name: 'annulé' },
  { id: 'terminé', name: 'terminé' },
];

const MenageForm = () => {
  const { id: reservationId } = useParams<{ id: string }>();
  return (
    <Box sx={{ maxWidth: '70%' }}>
      {' '}
      {/* Conteneur principal plus large */}
      {/* Section 1: Adresse et Agent */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Ménage
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <TextInput source="name" label="Nom du client" fullWidth />
          <TextInput source="firstName" label="Prénom du client" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <TextInput source="email" label="Email du client" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput source="address" label="Adresse" fullWidth />
          <TextInput source="address2" label="Complément d'adresse" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput source="city" label="Ville" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput source="phone" label="Téléphone" fullWidth />
        </Box>
      </Box>
      {/* Section 3: Détails de la réservation */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Détails de la Réservation
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <FunctionField
            label="Présence du client"
            render={(record) =>
              record.beforeOrAfter === 'before' ? (
                <TextField label="Présence du client" value="non" />
              ) : (
                <TextField label="Présence du client" value="oui" />
              )
            }
          />
          <SelectInput
            source="bookingStatus"
            label="Statut de la Réservation"
            choices={bookingStatusChoices}
            fullWidth
          />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="numberOfFloors"
            label="Nombre d'étages"
            choices={numberOfFloorsChoices}
            fullWidth
          />
          <TextInput source="quote" label="Devis (€)" fullWidth />
          <TextInput source="serviceDate" label="Date du Service" fullWidth />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="sizeRange"
            label="Intervalle de taille (m²)"
            choices={sizeRangeChoices}
            fullWidth
          />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <AgentSelect reservationId={reservationId} fullWidth />
        </Box>
      </Box>
      {/* Section 4: Options supplémentaires */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Options Supplémentaires
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
        >
          <BooleanInput source="fruitBasketSelected" label="Panier de Fruits" />
          <BooleanInput source="keyReceived" label="Clés Reçues" />
          <BooleanInput source="chatStatus" label="Chat Actif" />
        </Box>
      </Box>
      {/* Section 5: Instructions spéciales */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Instructions Spéciales
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <TextInput
          multiline
          minRows={5}
          source="specialInstructions"
          label="Instructions spéciales"
          fullWidth
        />
      </Box>
      {/* Section 6: Suivi et Historique */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Suivi et Historique
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <DateInput
            source="lastupdate"
            label="Dernière mise à jour"
            size="medium"
            disabled
          />
          <TextInput source="updatedby" label="Mis à jour par" size="medium" disabled />
        </Box>
      </Box>
    </Box>
  );
};

export default MenageForm;
