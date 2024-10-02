import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

import { db } from '../../../firebaseConfig';

// Sauvegarde l'URL du devis dans la réservation correspondante dans Firestore
export const saveDevisInFirestore = async (
  reservationId: string,
  devisUrl: string,
  devisAmount: number,
) => {
  try {
    // Log des paramètres pour vérifier s'ils sont bien définis
    console.log('reservationId:', reservationId);
    console.log('devisUrl:', devisUrl);
    console.log('devisAmount:', devisAmount);

    if (!reservationId || !devisUrl || !devisAmount) {
      throw new Error('Les paramètres sont manquants ou invalides.');
    }

    // Référence au document Firestore
    const reservationRef = doc(db, 'reservations', reservationId);
    console.log('Référence Firestore créée:', reservationRef);

    // Objet devis à ajouter
    const devis = {
      url: devisUrl,
      amount: devisAmount,
      status: "en attente d'acceptation",
      createdAt: new Date().toISOString(),
    };

    // Mise à jour de Firestore avec l'objet devis
    await updateDoc(reservationRef, {
      devis: arrayUnion(devis), // Ajoute l'objet devis dans le tableau devis
      bookingStatus: 'devis envoyé', // Change le statut de la réservation
    });

    console.log('Devis sauvegardé avec succès dans Firestore.');
  } catch (error) {
    console.error('Erreur dans saveDevisInFirestore:', error);
    throw error;
  }
};
