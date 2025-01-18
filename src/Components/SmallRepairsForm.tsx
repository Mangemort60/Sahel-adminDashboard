import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  BooleanInput,
  DateInput,
  SelectInput,
  TextField as RaTextField,
  TextInput,
  useDataProvider,
  useRecordContext,
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
  { id: 'terminé', name: 'Terminé' },
  { id: 'annulée', name: 'Annulé' },
  { id: 'à venir', name: 'A venir' },
];

const SmallRepairsForm = () => {
  const [selectedDevisFile, setSelectedDevisFile] = useState<File | null>(null);
  const [isDevisUploading, setIsDevisUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReportFile, setSelectedReportFile] = useState<File | null>(null);
  const [isReportUploading, setIsReportUploading] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [devisList, setDevisList] = useState<
    { createdAt: string; amount: number; paymentStatus: string }[]
  >([]);

  const { id } = useParams<{ id: string }>();
  const record = useRecordContext();
  const [bookingStatus, setBookingStatus] = useState(
    record?.bookingStatus || 'pré-demande',
  );

  if (!id) {
    return <p>Erreur : ID de la réservation est manquant.</p>;
  }

  // ✅ Ouvrir la boîte de dialogue
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // ✅ Fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ✅ Confirmer la pré-demande depuis la boîte de dialogue
  const handleConfirmPreRequest = async () => {
    setIsUpdatingStatus(true); // ✅ Verrouille l'UI immédiatement
    setBookingStatus('confirmé'); // ✅ Optimistic Update : verrouille l'UI
    try {
      await dataProvider.update('reservations', {
        id: record.id,
        data: {
          bookingStatus: 'confirmé',
          paymentStatus:
            record.paymentStatus !== 'en attente de paiement des frais de service'
              ? 'en attente de paiement des frais de service'
              : record.paymentStatus,
        },
        previousData: undefined,
      });
      setOpenDialog(false);
      setOpenSuccessDialog(true);
    } catch (error) {
      console.error('Erreur lors de la confirmation :', error);
      alert('Erreur lors de la confirmation.');
      setBookingStatus('pré-demande'); // ✅ Annulation en cas d'erreur
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const fetchDevis = async () => {
      if (!id) return;
      const db = getFirestore();
      const devisRef = collection(db, `reservations/${id}/devis`);
      try {
        const querySnapshot = await getDocs(devisRef);
        const devisData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Conversion directe de l'ISO string avec dayjs
          const createdAt = data.createdAt
            ? dayjs(data.createdAt).format('DD-MM-YYYY')
            : 'Date inconnue';

          return {
            createdAt,
            amount: data.amount ?? 0, // Valeur par défaut si absente
            paymentStatus: data.paymentStatus ?? 'inconnu',
          };
        });
        setDevisList(devisData);
      } catch (error) {
        console.error('Erreur lors de la récupération des devis :', error);
      }
    };

    fetchDevis();
  }, [id]);

  // ✅ Fermer la boîte de dialogue de succès
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleDevisFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedDevisFile(event.target.files[0]);
    }
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
    if (!selectedReportFile) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    try {
      setIsReportUploading(true);

      // Téléchargement du rapport sur le stockage Firebase
      const reportUrl = await uploadReport(selectedReportFile, id);
      await saveReportInFirestore(id, reportUrl);

      // Mise à jour automatique du statut à "terminé" dans Firestore
      await dataProvider.update('reservations', {
        id,
        data: { bookingStatus: 'terminé' },
        previousData: undefined,
      });

      alert('Rapport final uploadé avec succès et réservation marquée comme terminée.');
    } catch (error) {
      console.error("Erreur lors de l'upload du rapport final:", error);
      alert("Erreur lors de l'upload du rapport final.");
    } finally {
      setIsReportUploading(false);
      setSelectedReportFile(null);
    }
  };

  // ✅ Gère la désactivation si statut est confirmé
  const isConfirmed = record?.bookingStatus === 'confirmé';

  return (
    <Box sx={{ width: '700px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        Petites Réparations
      </Typography>

      {/* Section 1: Adresse */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Coordonnées
        </Typography>
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
          <Box
            sx={{
              display: 'inline-flex',
              width: '80%',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <TextInput source="name" label="Nom du client" fullWidth readOnly />
            <TextInput source="firstName" label="Prénom du client" fullWidth readOnly />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
            <TextInput source="email" label="Email du client" fullWidth readOnly />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="address" label="Adresse" fullWidth readOnly />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="city" label="Ville" fullWidth readOnly />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', gap: '10px', marginTop: '16px' }}>
            <TextInput source="phone" label="Téléphone" fullWidth readOnly />
          </Box>
        </Box>
      </Box>

      {/* Section 2: Urgence */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Détails des travaux
        </Typography>
        <SelectInput
          source="urgency"
          label="Niveau d'urgence"
          choices={urgencyChoices}
          fullWidth
          readOnly
        />
        {/* ✅ Statut avec désactivation conditionnelle */}
        {isConfirmed && (
          <Typography color="green">
            Le statut est confirmé et ne peut plus être modifié.
          </Typography>
        )}
        <SelectInput
          source="bookingStatus"
          label="Statut de la réservation"
          choices={bookingStatusChoices}
          optionText="name"
          optionValue="id"
          fullWidth
          value={bookingStatus}
          onChange={() => handleOpenDialog()} // ✅ Confirmation avant la mise à jour
          readOnly={bookingStatus !== 'pré-demande'} // ✅ Désactivation immédiate après confirmation
        />
        {/* ✅ Message informatif si confirmé */}
        <TextInput source="paymentStatus" label="Status de paiement" fullWidth readOnly />
        <TextInput
          source="workCategory"
          label="Catégorie de Travail"
          fullWidth
          readOnly
        />
        <TextInput
          source="workDescription"
          label="Description des travaux"
          multiline
          minRows={4}
          fullWidth
          readOnly
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Divider sx={{ marginBottom: '16px' }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
            gutterBottom
          >
            Période des travaux
          </Typography>
          <DateInput source="serviceStartDate" label="Entre le" />
          <DateInput source="serviceDates.endDate" label="Et le" />
        </Box>
      </Box>

      {/* Section Options Supplémentaires */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Options Supplémentaires
        </Typography>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
        >
          <BooleanInput source="keyReceived" label="Clés Reçues" />
          {/* <BooleanInput source="chatStatus" label="Chat Actif" /> */}
        </Box>
      </Box>

      {/* Section Devis */}
      <Box sx={{ marginBottom: '20px' }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Transmettre un Devis
        </Typography>
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
      <Box sx={{ width: '700px', marginY: 8 }}>
        <Divider sx={{ marginBottom: '16px' }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
        >
          Détails des Devis
        </Typography>

        {devisList.length > 0 ? (
          <TableContainer component={Box} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date de Création</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Montant (€)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Statut</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devisList.map((devis, index) => (
                  <TableRow key={index}>
                    <TableCell>{devis.createdAt}</TableCell>
                    <TableCell>{devis.amount} €</TableCell>
                    <TableCell>{devis.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Aucun devis disponible.</Typography>
        )}
      </Box>
      {/* Section Rapport Final */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' }}
          gutterBottom
        >
          Transmettre le rapport final
        </Typography>
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

      {/* ✅ Boîte de dialogue pour confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer la Pré-demande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir confirmer cette pré-demande ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleConfirmPreRequest} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Boîte de dialogue de confirmation réussie */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Confirmation Réussie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La pré-demande a été confirmée avec succès. Le statut est désormais
            verrouillé.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmallRepairsForm;
