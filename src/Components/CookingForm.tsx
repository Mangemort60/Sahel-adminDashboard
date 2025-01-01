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
    <Box sx={{ width: '700px' }}>
      {/* Section 1: Détails du client */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
          Cuisine
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Coordonnées
        </Typography>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <TextInput readOnly source="name" label="Nom du client" fullWidth />
          <TextInput readOnly source="firstName" label="Prénom du client" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <TextInput readOnly source="email" label="Email du client" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput readOnly source="address" label="Adresse" fullWidth />
          <TextInput readOnly source="address2" label="Complément d'adresse" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput readOnly source="city" label="Ville" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
          <TextInput readOnly source="phone" label="Téléphone" fullWidth />
        </Box>
      </Box>

      {/* Section 2: Détails de la réservation */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Détails de la réservation
        </Typography>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="bookingStatus"
            label="Statut de la Réservation"
            choices={bookingStatusChoices}
            fullWidth
          />
          <TextInput source="quote" label="Devis (€)" fullWidth readOnly />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <TextInput source="serviceDate" label="Date du Service" fullWidth readOnly />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <SelectInput
            source="period"
            label="Période"
            choices={periodChoices}
            fullWidth
            readOnly
          />
          <TextInput
            source="numberOfPeople"
            label="Nombre de personnes"
            fullWidth
            readOnly
          />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
          <AgentSelect reservationId={reservationId} />
        </Box>
      </Box>

      {/* Section 3: Instructions spéciales et autres */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />

        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Instructions spéciales
        </Typography>

        <Box
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
        >
          {/* <BooleanInput source="chatStatus" label="Chat Actif" /> */}
          <TextInput
            multiline
            minRows={5}
            source="specialInstructions"
            label="Instructions spéciales"
            fullWidth
            sx={{ overflow: 'auto', maxHeight: '200px' }}
            readOnly
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CookingForm;
