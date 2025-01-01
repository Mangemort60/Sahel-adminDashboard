/* eslint-disable react/no-unescaped-entities */
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosAttach } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { z } from 'zod';

import { storage } from '../../firebaseConfig';
import { useAppSelector } from '../../src/app/hooks';
import { messageSchema } from '../schemas/messageSchema';
import getApiUrl from '../utils/getApiUrl';

interface ChatBoxProps {
  reservationId: string;
  sender: string;
  clientEmail: string;
}

interface Message {
  sender: string;
  clientEmail: string;
  text: string;
  role: string;
  attachments?: { url: string; type: string }[];
  created: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ reservationId, sender, clientEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Pour confirmer avant envoi
  const [openResultDialog, setOpenResultDialog] = useState(false); // Pour afficher le résultat
  const [resultMessage, setResultMessage] = useState(''); // Message de résultat

  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);

  const userRole = useAppSelector((state) => state.user.role);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${apiUrl}/admin/reservations/${reservationId}/messages`,
        );
        const messagesWithUrls = await Promise.all(
          response.data.map(async (message) => {
            if (message.attachments) {
              message.attachments = await Promise.all(
                message.attachments.map(async (attachment) => {
                  const url = await getDownloadURL(ref(storage, attachment.url));
                  return { url, type: attachment.type };
                }),
              );
            }
            return message;
          }),
        );
        setMessages(messagesWithUrls);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [apiUrl, reservationId]);

  type MessageData = z.infer<typeof messageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageData>({
    resolver: zodResolver(messageSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSendMessage = async () => {
    if (!pendingMessage) return;
    setIsSending(true);
    const formData = new FormData();
    formData.append('sender', pendingMessage.sender);
    formData.append('clientEmail', pendingMessage.clientEmail);
    formData.append('text', pendingMessage.text);
    formData.append('role', pendingMessage.role);
    formData.append('created', pendingMessage.created);
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      await axios.post<Message>(
        `${apiUrl}/reservations/${reservationId}/messages`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setMessages((prevMessages) => [...prevMessages, pendingMessage]);
      setResultMessage('Message envoyé avec succès.');
    } catch (error) {
      console.error('Error sending message:', error);
      setResultMessage('Échec de l’envoi du message. Veuillez réessayer.');
    } finally {
      setIsSending(false);
      setOpenDialog(false); // Ferme la boîte de dialogue avant l'envoi
      setOpenResultDialog(true); // Ouvre la boîte de dialogue pour le résultat
      setPendingMessage(null); // Réinitialise le message en attente
      reset();
      setSelectedFiles([]);
    }
  };

  const onSubmit = (data: MessageData) => {
    const newMessage: Message = {
      sender,
      text: data.text,
      clientEmail,
      role: userRole,
      created: new Date().toISOString(),
    };

    setPendingMessage(newMessage);
    setOpenDialog(true); // Ouvre la boîte de dialogue pour confirmer l'envoi
  };

  return (
    <Box
      mt={8}
      sx={{
        width: '720px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Liste des messages */}
      <Box component="ul" display="flex" flexDirection="column" p={0}>
        {messages.map((message, index) => (
          <Box
            component="li"
            key={index}
            display="flex"
            justifyContent={message.role === 'client' ? 'flex-end' : 'flex-start'}
            mb={2}
            width="80%"
          >
            <Paper
              elevation={3}
              sx={{
                maxWidth: '30%',
                p: 2,
                bgcolor: message.sender === sender ? 'primary.light' : 'grey.300',
                color: message.sender === sender ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
              {message.attachments?.map((attachment, i) =>
                attachment.type.startsWith('image/') ? (
                  <img
                    key={i}
                    src={attachment.url}
                    alt={`attachment-${i}`}
                    style={{ maxWidth: '100%' }}
                  />
                ) : (
                  <a key={i} href={attachment.url} download>
                    Télécharger le fichier
                  </a>
                ),
              )}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Formulaire pour écrire un message */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Box display="flex" mt={2} maxWidth="sm">
          <TextField
            {...register('text')}
            variant="outlined"
            fullWidth
            placeholder="Écrivez votre message ici..."
            error={!!errors.text}
            helperText={errors.text?.message as string}
            multiline
            rows={3}
            disabled={isSending}
          />
          <IconButton component="label" disabled={isSending}>
            <IoIosAttach fontSize={28} color="grey" />
            <input type="file" multiple hidden onChange={handleFileChange} />
          </IconButton>
          <IconButton type="submit" color="primary" disabled={isSending}>
            {isSending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <IoSend fontSize={28} />
            )}
          </IconButton>
        </Box>
        {selectedFiles.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2">Fichiers sélectionnés :</Typography>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </form>

      {/* Boîte de dialogue pour confirmer l'envoi */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer l'envoi</DialogTitle>
        <DialogContent>
          <DialogContentText>Voulez-vous vraiment envoyer ce message ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSendMessage} color="secondary" disabled={isSending}>
            {isSending ? <CircularProgress size={24} color="inherit" /> : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue pour afficher le résultat */}
      <Dialog open={openResultDialog} onClose={() => setOpenResultDialog(false)}>
        <DialogTitle>Résultat</DialogTitle>
        <DialogContent>
          <DialogContentText>{resultMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResultDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatBox;
