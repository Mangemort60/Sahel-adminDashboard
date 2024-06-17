import { Box, Divider } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BooleanInput,
  DateInput,
  Edit,
  EditProps,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  useDataProvider,
  useGetOne,
  useNotify,
  useRedirect,
} from 'react-admin';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import getApiUrl from '../utils/getApiUrl';
import ChatBox from './ChatBox'; // Assurez-vous que le chemin est correct

interface User {
  id: string | number;
  name: string;
  firstName: string;
  shortId: string;
}

interface Reservation {
  id: string;
  createdAt: string;
  shortId: string;
  name: string;
  firstName: string;
  bookingFormData: {
    address: string;
    address2?: string;
    city: string;
    phone: string;
    specialInstructions?: string;
  };
  email: string;
  serviceStatus: string;
  quote: number;
  serviceDate: string;
  formData: {
    fruitBasketSelected: boolean;
  };
  keyReceived?: boolean;
  agent?: string;
}

const StatusChoices = [
  { id: 'à venir', name: 'à venir' },
  { id: 'en cours', name: 'en cours' },
  { id: 'suspendue', name: 'suspendue' },
  { id: 'terminée', name: 'terminée' },
];

export const ReservationEdit: React.FC<EditProps> = (props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider();
  const { id } = useParams<{ id: string }>();
  const notify = useNotify();
  const redirect = useRedirect();
  const apiUrl = getApiUrl();

  console.log(apiUrl);

  const {
    data: reservation,
    isLoading,
    error,
  } = useGetOne<Reservation>('reservations', { id });

  const adminName = useAppSelector((state) => state.user.firstName);

  useEffect(() => {
    const markMessagesAsReadByAgent = async () => {
      try {
        await axios.put(`${apiUrl}/reservations/${id}/messages/read-by-agent`);
        console.log('API URL', apiUrl);
      } catch (error) {
        console.error('Error marking messages as read by agent:', error);
      }
    };

    markMessagesAsReadByAgent();
  }, [id]);

  useEffect(() => {
    if (!isLoading && !error) {
      dataProvider
        .getList('users', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'name', order: 'ASC' },
          filter: { role: 'agent' },
        })
        .then(({ data }) => {
          const typedData = data as User[];
          setUsers(
            typedData.map((user) => ({
              id: user.id,
              name: user.name,
              firstName: user.firstName,
              shortId: user.shortId,
            })),
          );
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [dataProvider, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    notify('Error fetching reservation', { type: 'warning' });
    redirect('list', 'reservations');
    return <div>Error loading reservation</div>;
  }

  const dateFormatter = (v: string) => {
    if (!v) return null;
    const [day, month, year] = v.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const dateParser = (v: string) => {
    if (!v) return null;
    const [year, month, day] = v.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <Edit {...props} title="Éditer Réservation">
      <SimpleForm>
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput disabled source="id" />
          <DateInput readOnly source="createdAt" label="Créé le" />
          <TextInput readOnly source="shortId" label="ShortID" />
        </Box>
        <p style={{ fontWeight: 'bolder' }}>Coordonnées du client</p>
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="name" label="Nom" />
          <TextInput source="firstName" label="Prénom" />
        </Box>
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="bookingFormData.address" label="Adresse" />
          <TextInput source="bookingFormData.address2" label="Complément d'adresse" />
          <TextInput source="bookingFormData.city" label="Ville" />
        </Box>
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="email" label="Email" />
          <TextInput source="bookingFormData.phone" label="Téléphone" />
        </Box>
        <p style={{ fontWeight: 'bolder' }}>Information sur la réservation</p>
        <SelectInput
          source="serviceStatus"
          label="Statut de la réservation"
          choices={StatusChoices}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', gap: '10px' }}>
          <NumberInput readOnly source="quote" label="Devis" />{' '}
          <span style={{ fontSize: '2.5rem', paddingBottom: '3px' }}>€</span>
        </Box>
        <DateInput
          readOnly
          source="serviceDate"
          label="Date du Service"
          format={dateFormatter}
          parse={dateParser}
        />
        <BooleanInput source="formData.fruitBasketSelected" label="Panier de Fruits" />
        {reservation?.keyReceived !== undefined && (
          <BooleanInput source="keyReceived" label="Clés reçues" />
        )}
        {reservation?.bookingFormData.specialInstructions && (
          <>
            <p>Instructions du client :</p>
            <TextField
              source="bookingFormData.specialInstructions"
              label="Instructions du client"
              sx={{
                marginBottom: '2rem',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderBottom: '1px solid',
                maxWidth: '100%',
              }}
            />
          </>
        )}
        <p style={{ fontWeight: 'bolder' }}>Agent assigné :</p>
        <SelectInput
          source="agent"
          label="Agent"
          choices={users}
          optionText={(user: User) => `${user.firstName} ${user.name} (${user.shortId})`}
          optionValue="name"
        />
        <hr className="border 2px" />
        {/* Ajouter ChatBox ici */}
      </SimpleForm>

      <Divider style={{ marginTop: 34, fontSize: 28 }}>Messagerie</Divider>
      {reservation && <ChatBox reservationId={reservation.id} sender={adminName} />}
    </Edit>
  );
};
