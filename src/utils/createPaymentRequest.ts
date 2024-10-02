import axios from 'axios';

// Type pour les paramètres de la fonction createPaymentRequest
interface PaymentRequestParams {
  amount: string; // Montant en tant que chaîne
  email: string; // Email du client
  shortId: string; // Identifiant court de l'utilisateur
  name: string; // Nom du client
}

// Appel à l'API pour générer un lien de paiement et obtenir le client secret avec Axios
export const createPaymentRequest = async ({
  amount,
  email,
  shortId,
  name,
}: PaymentRequestParams) => {
  try {
    const response = await axios.post('/api/create-payment', {
      amount, // Montant en euros
      email, // Email du client
      shortId, // Identifiant court pour trouver l'utilisateur
      name, // Nom du client
    });

    const clientSecret = response.data.clientSecret;

    // Loguer le client secret pour vérifier
    console.log('Client secret reçu:', clientSecret);

    return clientSecret; // Retourne le client secret pour Stripe
  } catch (error) {
    console.error('Erreur lors de la création du paiement :', error);
  }
};
