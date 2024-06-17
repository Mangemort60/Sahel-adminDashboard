import { z } from 'zod';

export const messageSchema = z.object({
  text: z
    .string()
    .nonempty({ message: 'Le texte ne peut pas être vide' })
    .min(1, { message: 'Le texte doit avoir au moins 1 caractères' }),
});
