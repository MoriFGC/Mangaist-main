import React, { useState } from 'react';
import { removeMangaFromUserCatalog, deleteManga } from '../../services/api';

const DeleteMangaButton = ({ userId, mangaId, isDefault, onDelete }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      if (isDefault) {
        // Se è un manga predefinito, rimuovilo solo dal catalogo dell'utente
        await removeMangaFromUserCatalog(userId, mangaId);
      } else {
        // Se è un manga personale, eliminalo globalmente
        const response = await deleteManga(mangaId);
        console.log(response.data); // Questo mostrerà il numero di utenti aggiornati
      }
      onDelete();
    } catch (error) {
      console.error('Error removing manga:', error);
      if (error.response) {
        setError(`Failed to remove manga: ${error.response.data.message}`);
      } else {
        setError('Failed to remove manga. Please try again.');
      }
    }
  };

  return (
    <div className="mt-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {!isConfirming ? (
        <button
          onClick={() => setIsConfirming(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
        >
          Remove from My Catalog
        </button>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-white mb-4">Are you sure you want to remove this manga from your catalog?</p>
          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Confirm Remove
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteMangaButton;