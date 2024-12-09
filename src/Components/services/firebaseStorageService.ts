import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// Upload d'un fichier dans Firebase Storage et retour de l'URL
export const uploadDevis = async (file: File, reservationId: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `devis/${reservationId}/${file.name}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optionnel : gérer la progression de l'upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload en cours: ${progress}%`);
      },
      (error) => {
        // Gestion des erreurs
        reject(error);
      },
      async () => {
        // Upload terminé, récupère l'URL du fichier
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL); // Retourne l'URL du fichier uploadé
      },
    );
  });
};

export const uploadReport = async (
  file: File,
  reservationId: string,
): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `reports/${reservationId}/${file.name}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload en cours: ${progress}%`);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      },
    );
  });
};
