import { Box, Divider, Typography } from '@mui/material';
import {
  BooleanInput,
  DateInput,
  NumberInput,
  SelectInput,
  TextInput,
} from 'react-admin';
import { useParams } from 'react-router-dom';

import AgentSelect from './AgentSelect';

const CookingForm = () => {
  const { id: reservationId } = useParams<{ id: string }>();

  const periodChoices = [
    { id: 'journee', name: 'journée' },
    { id: 'soirMidi', name: 'soir/midi' },
  ];

  const bookingStatusChoices = [
    { id: 'confirmé', name: 'confirmé' },
    { id: 'à venir', name: 'à venir' },
    { id: 'annulé', name: 'annulé' },
    { id: 'terminé', name: 'terminé' },
  ];

  return (
    <Box sx={{ width: '70%' }}>
      {/* Section 1: Détails du client */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Cuisine
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

      {/* Section 2: Détails de la réservation */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Détails de la Réservation
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="bookingStatus"
            label="Statut de la Réservation"
            choices={bookingStatusChoices}
            fullWidth
          />
          <TextInput source="quote" label="Devis (€)" fullWidth />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <TextInput source="serviceDate" label="Date du Service" fullWidth />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="period"
            label="Période"
            choices={periodChoices}
            fullWidth
          />
          <TextInput source="numberOfPeople" label="Nombre de personnes" fullWidth />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <AgentSelect reservationId={reservationId} fullWidth />
        </Box>
      </Box>

      {/* Section 3: Instructions spéciales et autres */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Instructions Spéciales et Autres
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />

        <Box
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
        >
          <BooleanInput source="chatStatus" label="Chat Actif" />
          <TextInput
            multiline
            minRows={5}
            source="specialInstructions"
            label="Instructions spéciales"
            fullWidth
            sx={{ overflow: 'auto', maxHeight: '200px' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CookingForm;
