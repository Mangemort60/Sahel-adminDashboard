import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import {
  BooleanInput,
  DateField,
  DateInput,
  DateTimeInput,
  SelectInput,
  TextInput,
  useDataProvider,
} from 'react-admin';
import { useParams } from 'react-router-dom';

import { uploadDevis, uploadReport } from './services/firebaseStorageService';
import {
  saveDevisInFirestore,
  saveReportInFirestore,
} from './services/reservationService';

export interface Reservation {
  id: string;
  reservationType: string;
  reservationShortId: string;
  city: string;
  address: string;
  serviceDate: string;
  serviceDates: [string];
  quote: number;
  email: string;
  name: string;
  shortId: string;
  amount: string;
  formData: {
    period: string;
    numberOfPeople: string;
    additionalDetails: string;
    sizeRange: string | undefined;
    numberOfFloors: string;
    beforeOrAfter: string;
    fruitBasketSelected: string;
  };
  status: string;
  bookingStatus: string;
  serviceStatus: string;
}

const urgencyChoices = [
  { id: 'immediate', name: 'Immédiate' },
  { id: 'dans les semaines à venir', name: 'Dans les semaines à venir' },
  { id: 'dans les mois à venir', name: 'Dans les mois à venir' },
];

const bookingStatusChoices = [
  { id: 'pré-demande', name: 'pré-demande' },
  { id: 'confirmé', name: 'confirmé' },
  { id: 'à venir', name: 'à venir' },
  { id: 'annulé', name: 'annulé' },
  { id: 'terminé', name: 'terminé' },
];

const SmallRepairsForm = () => {
  const [selectedDevisFile, setSelectedDevisFile] = useState<File | null>(null);
  const [isDevisUploading, setIsDevisUploading] = useState(false);

  const [selectedReportFile, setSelectedReportFile] = useState<File | null>(null);
  const [isReportUploading, setIsReportUploading] = useState(false);

  const [quoteAmount, setQuoteAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null); // Nouvel état pour le statut
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>Erreur : ID de la réservation est manquant.</p>;
  }

  const handleDevisFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedDevisFile(event.target.files[0]);
    }
  };

  const handleStatusChange = (newValue: string | null) => {
    setStatus(newValue); // Met à jour le statut
  };

  const handleReportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedReportFile(event.target.files[0]);
    }
  };

  const handleUploadDevis = async () => {
    if (!selectedDevisFile || quoteAmount === null) {
      alert('Veuillez sélectionner un fichier et entrer un montant de devis.');
      return;
    }

    try {
      setIsDevisUploading(true);
      const devisUrl = await uploadDevis(selectedDevisFile, id);
      await saveDevisInFirestore(id, devisUrl, quoteAmount);
      alert('Le devis a été uploadé avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'upload du devis:", error);
      alert("Erreur lors de l'upload du devis.");
    } finally {
      setIsDevisUploading(false);
      setSelectedDevisFile(null);
    }
  };

  // Ajoutez ceci dans votre composant
  const dataProvider = useDataProvider();

  const handleUploadReport = async () => {
    if (status !== 'terminé') {
      alert('Vous devez définir le statut sur "terminé" avant de confirmer l\'envoi.');
      return;
    }
    if (!selectedReportFile) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    try {
      setIsReportUploading(true);
      const reportUrl = await uploadReport(selectedReportFile, id);
      await saveReportInFirestore(id, reportUrl);

      await dataProvider.update('reservations', {
        id,
        data: { bookingStatus: 'terminé' },
        previousData: undefined,
      });
      alert('Rapport final uploadé avec succès.');

      setStatus('terminé');
    } catch (error) {
      console.error("Erreur lors de l'upload du rapport final:", error);
      alert("Erreur lors de l'upload du rapport final.");
    } finally {
      setIsReportUploading(false);
      setSelectedReportFile(null);
    }
  };

  return (
    <Box sx={{ width: '70%' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        Petites Réparations
      </Typography>

      {/* Section 1: Adresse */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'true',
            width: '100%',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <TextInput source="id" disabled />
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '16px' }}>
            <TextInput source="name" label="Nom du client" fullWidth />
            <TextInput source="firstName" label="Prénom du client" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
            <TextInput source="email" label="Email du client" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="address" label="Adresse" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="city" label="Ville" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="phone" label="Téléphone" fullWidth />
          </Box>
        </Box>
      </Box>

      {/* Section 2: Urgence */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Détails des travaux
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />
        <SelectInput
          source="urgency"
          label="Niveau d'urgence"
          choices={urgencyChoices}
          fullWidth
        />
        <SelectInput
          choices={bookingStatusChoices}
          source="bookingStatus"
          label="Status"
          fullWidth
          onChange={(e) => handleStatusChange(e.target.value)} // Capture les changements
        />

        <TextInput source="paymentStatus" label="Status de paiement" fullWidth />
        <TextInput source="workCategory" label="Catégorie de Travail" fullWidth />
        <TextInput
          source="workDescription"
          label="Description des travaux"
          multiline
          minRows={4}
          fullWidth
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" gutterBottom>
            Période des travaux
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <DateInput source="serviceDates.startDate" label="Entre le" />
          <DateInput source="serviceDates.endDate" label="Et le" />
        </Box>
      </Box>

      {/* Section Options Supplémentaires */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Options Supplémentaires
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
        >
          <BooleanInput source="keyReceived" label="Clés Reçues" />
          <BooleanInput source="chatStatus" label="Chat Actif" />
        </Box>
      </Box>

      {/* Section Devis */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Devis
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />
        {/* Section pour saisir le montant du devis */}
        <Box sx={{ marginBottom: '20px' }}>
          <TextField
            label="Montant du devis (€)"
            type="number"
            value={quoteAmount ?? ''}
            onChange={(e) => setQuoteAmount(parseFloat(e.target.value))}
            fullWidth
          />
        </Box>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={isDevisUploading}
          sx={{ marginRight: '20px' }}
        >
          {isDevisUploading ? 'Upload en cours...' : 'Uploader un devis'}
          <input type="file" hidden onChange={handleDevisFileChange} />
        </Button>
        {selectedDevisFile && (
          <Button
            variant="contained"
            onClick={handleUploadDevis}
            disabled={isDevisUploading}
          >
            {isDevisUploading ? 'Envoi...' : "Confirmer l'upload"}
          </Button>
        )}
      </Box>

      {/* Section Rapport Final */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Rapport Final
        </Typography>
        <Divider sx={{ marginBottom: '16px' }} />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={isReportUploading}
          sx={{ marginRight: '20px' }}
        >
          {isReportUploading ? 'Upload en cours...' : 'Uploader un rapport'}
          <input type="file" hidden onChange={handleReportFileChange} />
        </Button>
        {selectedReportFile && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUploadReport}
            disabled={isReportUploading}
          >
            {isReportUploading ? 'Envoi...' : "Confirmer l'upload"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SmallRepairsForm;
