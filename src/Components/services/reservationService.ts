import { addDoc, collection } from 'firebase/firestore';

import { db } from '../../../firebaseConfig';

// Sauvegarde l'URL du devis dans la réservation correspondante dans Firestore
export const saveDevisInFirestore = async (
  reservationId: string,
  devisUrl: string,
  devisAmount: number,
) => {
  try {
    if (!reservationId || !devisUrl || !devisAmount) {
      throw new Error('Les paramètres sont manquants ou invalides.');
    }

    // Référence à la sous-collection 'devis' de la réservation
    const devisCollectionRef = collection(db, 'reservations', reservationId, 'devis');

    // Objet devis à ajouter
    const devis = {
      url: devisUrl, // URL du devis PDF
      amount: devisAmount, // Montant du devis
      status: "en attente d'acceptation", // Statut initial du devis
      createdAt: new Date().toISOString(), // Date de création du devis
      paymentStatus: 'en attente de paiement', // Statut de paiement initial
      validUntil: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), // Date de validité (ici, 15 jours à partir de la création)
      expired: false, // Indique si le devis est expiré ou non
      notes: 'Ce devis expire après 15 jours.', // Notes pour information complémentaire
      createdBy: 'admin@example.com', // Identité de la personne qui a créé le devis (peut être dynamique)
    };

    // Ajout du devis dans la sous-collection 'devis'
    const docRef = await addDoc(devisCollectionRef, devis);

    console.log("Devis sauvegardé avec succès dans Firestore avec l'ID:", docRef.id);
  } catch (error) {
    console.error('Erreur dans saveDevisInFirestore:', error);
    throw error;
  }
};
