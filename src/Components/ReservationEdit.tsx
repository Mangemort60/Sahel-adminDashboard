import { Box } from '@mui/material';
import React from 'react';
import { Edit, SimpleForm } from 'react-admin';
import { useParams } from 'react-router-dom';

import { useReservation } from '../hooks/useReservation';
import ChatBox from './ChatBox';
import CookingForm from './CookingForm'; // Importation du nouveau formulaire pour cuisine
import MenageForm from './MenageForm';
import SmallRepairsForm from './SmallRepairsForm';

export const ReservationEdit: React.FC = (props) => {
  const { id } = useParams<{ id: string }>();
  const { reservation, isLoading, error, notify, redirect } = useReservation(id!);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    notify('Error fetching reservation', { type: 'warning' });
    redirect('list', 'reservations');
    return <div>Error loading reservation</div>;
  }

  return (
    <Edit {...props} title="Éditer Réservation">
      <Box>
        <SimpleForm>
          {/* Conditionner l'affichage des formulaires selon le type de réservation */}
          {reservation?.reservationType === 'petits-travaux' && <SmallRepairsForm />}
          {reservation?.reservationType === 'ménage' && <MenageForm />}
          {reservation?.reservationType === 'cuisine' && <CookingForm />}{' '}
          {/* Nouveau formulaire pour cuisine */}
          {/* Autres sections communes, comme l'agent et la messagerie */}
        </SimpleForm>
        {reservation && (
          <Box sx={{ margin: '1rem' }}>
            <Box sx={{ fontSize: '2rem', marginTop: '1rem' }}>Messagerie</Box>
            <ChatBox
              reservationId={reservation.id}
              sender="Admin"
              clientEmail={reservation.email}
            />
          </Box>
        )}
      </Box>
    </Edit>
  );
};
