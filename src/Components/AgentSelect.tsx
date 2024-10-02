import React from 'react';
import { SelectInput } from 'react-admin';

import { useReservation } from '../hooks/useReservation'; // Importer votre hook personnalisé

interface AgentSelectProps {
  reservationId: string | undefined; // Passer l'ID de la réservation
}

const AgentSelect: React.FC<AgentSelectProps> = ({ reservationId }) => {
  // Utiliser le hook personnalisé pour récupérer les données de la réservation et les utilisateurs
  const { users, loadingUsers } = useReservation(reservationId);

  // Si les utilisateurs sont en cours de chargement, afficher un message de chargement
  if (loadingUsers) {
    return <p>Chargement des agents...</p>;
  }

  // Si la liste des utilisateurs est vide, afficher un message
  if (users.length === 0) {
    return <p>Aucun agent disponible.</p>;
  }

  // Si tout va bien, afficher le champ SelectInput pour les agents
  return (
    <>
      <p style={{ fontWeight: 'bolder' }}>Agent assigné :</p>
      <SelectInput
        source="agent"
        label="Agent"
        choices={users}
        optionText={(user: any) => `${user.firstName} ${user.name} (${user.shortId})`}
        optionValue="name"
      />
    </>
  );
};

export default AgentSelect;
