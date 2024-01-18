// ProfileImageUploader.jsx
import React, { useState } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, update } from 'firebase/database';

const ProfileImageUploader = ({ userId, onUploadSuccess }) => {
  const [newProfileImage, setNewProfileImage] = useState(null);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setNewProfileImage(file);
  };

  const saveProfileImageToStorage = async () => {
    try {
      const storage = getStorage();
      const storageReference = storageRef(storage, `profile_images/${userId}/${newProfileImage.name}`);
      await uploadBytes(storageReference, newProfileImage);
      const downloadURL = await getDownloadURL(storageReference);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao salvar imagem de perfil no Storage:', error.message);
      throw error;
    }
  };

  const updatePhotoURLInDatabase = async (downloadURL) => {
    try {
      const db = getDatabase();
      const userRef = dbRef(db, `users/${userId}`);
      await update(userRef, { photoURL: downloadURL });
    } catch (error) {
      console.error('Erro ao atualizar photoURL no banco de dados:', error.message);
      throw error;
    }
  };

  const handleProfileImageSubmit = async () => {
    if (!newProfileImage) {
      return;
    }

    try {
      const downloadURL = await saveProfileImageToStorage();
      await updatePhotoURLInDatabase(downloadURL);
      onUploadSuccess(downloadURL);
      setNewProfileImage(null);
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error.message);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleProfileImageChange} />
      <button onClick={handleProfileImageSubmit}>Alterar Foto de Perfil</button>
    </div>
  );
};

export default ProfileImageUploader;
