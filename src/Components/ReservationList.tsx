import { Badge, Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  Filter,
  FunctionField,
  List,
  ListProps,
  SearchInput,
  SelectInput,
  TextField,
} from 'react-admin';
import { useRecordContext } from 'react-admin';
import { useDispatch, useSelector } from 'react-redux'; // Import correct

import { useAppSelector } from '../app/hooks';
import { setReservationType } from '../features/user/userSlice';
import getApiUrl from '../utils/getApiUrl';

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

const ReservationFilter = (props) => {
  const dispatch = useDispatch();

  const handleReservationTypeChange = (event) => {
    const selectedType = event.target.value;

    // Si la valeur sélectionnée est vide, on dispatch "all"
    if (!selectedType) {
      dispatch(setReservationType('all'));
    } else {
      dispatch(setReservationType(selectedType)); // Dispatcher la valeur sélectionnée normalement
    }
  };

  return (
    <Filter {...props}>
      <SelectInput
        source="bookingStatus"
        label="Statut Réservation"
        choices={[
          { id: 'confirmé', name: 'Confirmé' },
          { id: 'en cours de traitement', name: 'En cours de traitement' },
          { id: 'terminée', name: 'Terminée' },
        ]}
        alwaysOn
      />
      <SelectInput
        source="reservationType"
        label="Type de réservation"
        choices={[
          { id: 'ménage', name: 'Ménage' },
          { id: 'cuisine', name: 'Cuisine' },
          { id: 'petits-travaux', name: 'Petits-travaux' },
        ]}
        alwaysOn
        onChange={handleReservationTypeChange} // Appel de la fonction handleReservationTypeChange
      />
      <SelectInput
        source="serviceStatus"
        label="Statut prestation"
        choices={[
          { id: 'à venir', name: 'À venir' },
          { id: 'en cours', name: 'En cours' },
          { id: 'suspendue', name: 'Suspendue' },
          { id: 'terminée', name: 'Terminée' },
        ]}
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
};
// Interface pour un message
interface Message {
  reservationId: string;
  text: string;
  created: string;
  role: string;
  readByAgent: boolean;
}

type NewMessagesType = {
  [reservationId: string]: number;
};

export const ReservationList = (props: ListProps) => {
  const [newMessages, setNewMessages] = useState<NewMessagesType>({});
  const reservationType = useAppSelector((state) => state.user.reservationType); // Récupère la sélection du type de réservation depuis Redux
  const apiUrl = getApiUrl();
  useEffect(() => {
    const fetchNewMessages = async () => {
      try {
        const response = await axios.get<Message[]>(`${apiUrl}/new-messages`);
        const messages = response.data.reduce<NewMessagesType>((acc, message) => {
          if (!message.readByAgent && message.role === 'client') {
            // Vérifiez si le message n'a pas été lu
            if (!acc[message.reservationId]) {
              acc[message.reservationId] = 0;
            }
            acc[message.reservationId]++;
          }
          return acc;
        }, {});
        setNewMessages(messages);
        console.log('messages: ', messages);
      } catch (error) {
        console.error('Error fetching new messages:', error);
      }
    };

    fetchNewMessages();
    const interval = setInterval(fetchNewMessages, 10000); // Polling toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <List {...props} title="Liste des réservations" filters={<ReservationFilter />}>
      <Datagrid rowClick="edit">
        <TextField
          source="reservationType"
          label="Type"
          sx={{
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: 'auto',
            maxWidth: 80,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        />
        <FunctionField
          label="Messages"
          render={(record: { id: string }) => (
            <Badge
              sx={{ color: blue }}
              color={newMessages[record.id] > 0 ? 'secondary' : 'primary'}
              badgeContent={newMessages[record.id] > 0 ? newMessages[record.id] : 0}
            >
              <Box
                component="span"
                sx={{
                  color: newMessages[record.id] > 0 ? 'red' : 'green', // Changez la couleur ici
                }}
              >
                {newMessages[record.id] > 0 ? 'Nouveau' : 'Aucun'}
              </Box>
            </Badge>
          )}
        />{' '}
        <TextField source="bookingStatus" label="Statut réservation" />
        <TextField source="serviceStatus" label="Statut prestation" />
        <TextField readOnly source="shortId" label="shortID" />
        <TextField readOnly source="reservationShortId" label="ReservationShortID" />
        <TextField source="agent" label="Agent" />
        <TextField source="name" label="Nom" />
        {/* <TextField source="bookingFormData.address" label="Adresse" />
        <TextField source="bookingFormData.city" label="Ville" /> */}
        <EmailField source="email" label="Email" />
        <TextField source="bookingFormData.phone" label="Téléphone" />
        <TextField source="serviceDate" label="Date du Service" />
        {(reservationType === 'ménage' || reservationType === 'all') && (
          <TextField source="formData.sizeRange" label="Surface" />
        )}
        {(reservationType === 'ménage' || reservationType === 'all') && (
          <TextField source="formData.numberOfFloors" label="Étages" />
        )}
        {(reservationType === 'ménage' || reservationType === 'all') && (
          <BooleanField source="formData.fruitBasketSelected" label="Panier de fruits" />
        )}
        {(reservationType === 'ménage' || reservationType === 'all') && (
          <BooleanField source="keyReceived" label="Clés reçues" />
        )}
        <TextField source="quote" label="Devis" />
        <DateField source="createdAt" label="Créé le" showTime />
      </Datagrid>
    </List>
  );
};
