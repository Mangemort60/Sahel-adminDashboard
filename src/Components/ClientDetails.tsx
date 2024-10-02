import { Box } from '@mui/material';
import { TextInput } from 'react-admin';

import { Reservation } from '../utils/types';

interface ClientDetailsProps {
  contactInfo: Reservation['contactInfo'];
  reservationType: string;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  contactInfo,
  reservationType,
}) => {
  return (
    <>
      <p style={{ fontWeight: 'bolder' }}>Coordonnées du client</p>
      {reservationType === 'petit travaux' ? (
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="contactInfo.companyName" label="Nom de l'Entreprise" />
          <TextInput source="contactInfo.contactPerson" label="Personne de Contact" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="contactInfo.name" label="Nom" />
          <TextInput source="contactInfo.firstName" label="Prénom" />
        </Box>
      )}
      <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
        <TextInput source="contactInfo.phone" label="Téléphone" />
        <TextInput source="contactInfo.email" label="Email" />
      </Box>
      {reservationType !== 'petit travaux' && (
        <Box sx={{ display: 'flex', width: '50%', gap: '10px' }}>
          <TextInput source="contactInfo.address" label="Adresse" />
          <TextInput source="contactInfo.address2" label="Complément d'adresse" />
          <TextInput source="contactInfo.city" label="Ville" />
        </Box>
      )}
    </>
  );
};

export default ClientDetails;
