// UserProfileBio.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const UserProfileBio = ({ userId, currentUser, updateUserBio }) => {
  const [bio, setBio] = useState('');

  useEffect(() => {
    const loadBio = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}/bio`);

        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const bioData = snapshot.val();
            setBio(bioData);
          }
        });
      } catch (error) {
        console.error('Erro ao carregar a biografia do usuário:', error.message);
      }
    };

    loadBio();
  }, [userId]);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSaveBio = () => {
    updateUserBio(userId, bio);
  };

  return (
    <div className='user-bio-container'>
      <h2>Biografia</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder="Escreva sua biografia aqui..."
        value={bio}
        onChange={handleBioChange}
      />
      {currentUser.uid === userId && (
        <button onClick={handleSaveBio}>Salvar Biografia</button>
      )}
    </div>
  );
};

export default UserProfileBio;