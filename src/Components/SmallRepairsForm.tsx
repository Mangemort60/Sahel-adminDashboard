import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { BooleanInput, SelectInput, TextInput } from 'react-admin';
import { useParams } from 'react-router-dom';

import { uploadDevis } from './services/firebaseStorageService';
import { saveDevisInFirestore } from './services/reservationService';

export interface Reservation {
  id: string;
  reservationType: string;
  reservationShortId: string;
  city: string;
  address: string;
  serviceDate: string;
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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null); // État pour stocker le montant du devis

  const { id } = useParams<{ id: string }>();

  // Vérifie si l'id est undefined
  if (!id) {
    return <p>Erreur : ID de la réservation est manquant.</p>;
  }

  console.log('RESERVATION ID ', id);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadDevis = async () => {
    if (!selectedFile || quoteAmount === null) {
      alert('Veuillez sélectionner un fichier et entrer un montant de devis.');
      return;
    }

    try {
      setIsUploading(true);

      // Upload du fichier dans Firebase Storage
      const devisUrl = await uploadDevis(selectedFile, id);
      console.log('URL du fichier uploadé:', devisUrl);

      // Sauvegarde dans Firestore avec le montant du devis
      await saveDevisInFirestore(id, devisUrl, quoteAmount);

      alert('Le devis a été uploadé avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'upload du devis :", error);
      alert("Erreur lors de l'upload du devis.");
    } finally {
      setIsUploading(false);
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
        />
        <TextInput source="workCategory" label="Catégorie de Travail" fullWidth />

        <TextInput
          source="workDescription"
          label="Description des travaux"
          multiline
          minRows={4}
          fullWidth
        />
      </Box>
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
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
          >
            {isUploading ? 'Upload en cours...' : 'Uploader un devis'}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {selectedFile && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadDevis}
              disabled={isUploading}
              sx={{ marginTop: '10px' }}
            >
              {isUploading ? 'Envoi...' : "Confirmer l'upload"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SmallRepairsForm;
