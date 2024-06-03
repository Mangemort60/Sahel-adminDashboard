import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useNotify } from 'react-admin';

const FileUploader = ({ source, label, onUploadSuccess }) => {
  const notify = useNotify();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `${source}/${file.name}`);
    const maxFileSize = 5 * 1024 * 1024; // Limite de 5MB

    if (file.size > maxFileSize) {
      notify('Error: File size should not exceed 5MB', 'warning');
      return; // Arrêter l'exécution si le fichier est trop gros
    }

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUploadSuccess(url); // Appeler la fonction de rappel avec l'URL
      notify('File uploaded successfully', 'info');
    } catch (error) {
      notify('Error uploading file: ' + error.message, 'warning');
    }
  };

  return (
    <div className="mb-8">
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {label}
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
