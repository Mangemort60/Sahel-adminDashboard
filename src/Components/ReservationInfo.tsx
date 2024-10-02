import { Box, TextField } from '@mui/material';
import { BooleanInput, DateInput, NumberInput, SelectInput } from 'react-admin';

import { Reservation, StatusChoices } from '../utils/types'; // Créez un fichier `types.ts` pour ces types communs

interface ReservationInfoProps {
  reservation?: Reservation;
  dateFormatter: (v: string) => string | null;
  dateParser: (v: string) => string | null;
}

const ReservationInfo: React.FC<ReservationInfoProps> = ({
  reservation,
  dateFormatter,
  dateParser,
}) => (
  <>
    <p style={{ fontWeight: 'bolder' }}>Information sur la réservation</p>
    <SelectInput
      source="serviceStatus"
      label="Statut de la réservation"
      choices={StatusChoices}
    />
    <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', gap: '10px' }}>
      <NumberInput readOnly source="quote" label="Devis" />
      <span style={{ fontSize: '2.5rem', paddingBottom: '3px' }}>€</span>
    </Box>
    <DateInput
      readOnly
      source="serviceDate"
      label="Date du Service"
      format={dateFormatter}
      parse={dateParser}
    />
    {reservation?.reservationType === 'ménage' && (
      <>
        <BooleanInput source="formData.fruitBasketSelected" label="Panier de Fruits" />
        <BooleanInput source="keyReceived" label="Clés reçues" />
      </>
    )}
    {reservation?.specialInstructions && (
      <>
        <p>Instructions du client :</p>
        <TextField
          source="specialInstructions"
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
  </>
);

export default ReservationInfo;
