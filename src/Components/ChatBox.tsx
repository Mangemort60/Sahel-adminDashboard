import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton, Paper, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosAttach } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { z } from 'zod';

import { auth, storage } from '../../firebaseConfig'; // Importez votre configuration Firebase
import { useAppSelector } from '../../src/app/hooks';
import { messageSchema } from '../schemas/messageSchema';
import getApiUrl from '../utils/getApiUrl';
interface ChatBoxProps {
  reservationId: string;
  sender: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ reservationId, sender }) => {
  //   const reservationId = useAppSelector((state) => state.ui.reservationId);
  //   const sender = useAppSelector((state) => state.user.name);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const userRole = useAppSelector((state) => state.user.role);
  const apiUrl = getApiUrl();

  interface Message {
    sender: string;
    text: string;
    role: string;
    attachments?: { url: string; type: string }[];
    created: string;
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${apiUrl}/reservations/${reservationId}/messages`,
        );

        const messagesWithUrls = await Promise.all(
          response.data.map(async (message) => {
            if (message.attachments && message.attachments.length > 0) {
              const attachmentsWithUrls = await Promise.all(
                message.attachments.map(async (attachment) => {
                  const fileRef = ref(storage, attachment.url);
                  const url = await getDownloadURL(fileRef);
                  return { url, type: attachment.type };
                }),
              );
              message.attachments = attachmentsWithUrls;
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
  }, [reservationId]);

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
      console.log(event.target.files);
    }
  };

  const onSubmit = async (data: MessageData) => {
    const formData = new FormData();
    formData.append('sender', sender);
    formData.append('text', data.text);
    formData.append('role', userRole);
    formData.append('created', new Date().toISOString());
    const apiUrl = getApiUrl();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post<Message>(
        `${apiUrl}/reservations/${reservationId}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const newMessage: Message = {
        sender,
        text: data.text,
        role: userRole,
        created: new Date().toISOString(),
        attachments: selectedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type,
        })),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      reset();
      alert('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <Box mt={8}>
      <Box
        component="ul"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        p={0}
      >
        {messages.map((message, index) => (
          <Box
            component="li"
            key={index}
            display="flex"
            justifyContent={message.role === 'client' ? 'flex-end' : 'flex-start'}
            mb={2}
            width="100%"
          >
            <Paper
              elevation={3}
              sx={{
                maxWidth: '75%',
                p: 2,
                bgcolor: message.sender === sender ? 'primary.light' : 'grey.300',
                color: message.sender === sender ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
              {message.attachments &&
                message.attachments.map((attachment, i) =>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" mt={2} maxWidth="sm">
          <TextField
            {...register('text')}
            variant="outlined"
            fullWidth
            placeholder="Ecrivez votre message ici..."
            error={!!errors.text}
            helperText={errors.text?.message as string}
            multiline
            rows={3}
          />
          <IconButton component="label">
            <IoIosAttach fontSize={28} color="grey" className="hover:cursor-pointer" />
            <input type="file" multiple hidden onChange={handleFileChange} />
          </IconButton>
          <IconButton type="submit" color="primary">
            <IoSend fontSize={28} />
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
        )}{' '}
      </form>
    </Box>
  );
};

export default ChatBox;
