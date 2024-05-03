import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useNotify } from 'react-admin';

const FileUploader = ({ source, label, onUploadSuccess }) => {
  const notify = useNotify();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `${source}/${file.name}`);

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
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
