import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDataProvider, useGetOne, useNotify, useRedirect } from 'react-admin';

import getApiUrl from '../utils/getApiUrl';
import { Reservation, User } from '../utils/types';

export const useReservation = (id: string | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [chatStatus, setChatStatus] = useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const apiUrl = getApiUrl();

  const {
    data: reservation,
    isLoading,
    error,
  } = useGetOne<Reservation>('reservations', { id });

  // Marquer les messages comme lus par l'agent
  useEffect(() => {
    if (reservation) {
      setChatStatus(reservation.chatStatus);

      const markMessagesAsReadByAgent = async () => {
        try {
          await axios.put(`${apiUrl}/reservations/${id}/messages/read-by-agent`);
        } catch (error) {
          console.error('Error marking messages as read by agent:', error);
        }
      };

      markMessagesAsReadByAgent();
    }
  }, [id, reservation, apiUrl]);

  // Charger la liste des utilisateurs (agents)
  useEffect(() => {
    if (!isLoading && !error) {
      dataProvider
        .getList('users', {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'name', order: 'ASC' },
          filter: { role: 'agent' },
        })
        .then(({ data }) => setUsers(data as User[]))
        .catch(console.error)
        .finally(() => setLoadingUsers(false));
    }
  }, [dataProvider, isLoading, error]);

  // Gérer le changement du statut du chat
  const handleChatStatusChange = async () => {
    if (reservation) {
      try {
        const response = await axios.post(
          `${apiUrl}/reservations/${reservation.id}/toggleChatStatus`,
        );
        setChatStatus(response.data.chatStatus);
      } catch (error) {
        console.error('Error updating chat status:', error);
      }
    }
  };

  return {
    reservation,
    isLoading,
    error,
    notify,
    redirect,
    users,
    loadingUsers,
    chatStatus,
    handleChatStatusChange,
  };
};
