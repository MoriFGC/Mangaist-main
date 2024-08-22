import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { addFavoritePanel } from '../../services/api';

const CreatePanelDialog = ({ isOpen, closeModal, onPanelCreation, userManga }) => {
  // Stato per i dati del pannello
  const [panelData, setPanelData] = useState({
    description: '',
    manga: '',
    chapterNumber: 1,
    volumeNumber: 1,
    panelImage: null,
  });

  // Stato per l'ID dell'utente
  const [userId, setUserId] = useState(null);

  // Effetto per recuperare l'ID dell'utente dal localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.id) {
      setUserId(userData.id);
    }
  }, []);

  // Gestore per i cambiamenti negli input
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setPanelData({ ...panelData, [name]: files[0] });
    } else {
      setPanelData({ ...panelData, [name]: value });
    }
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      // Creazione di un nuovo FormData
      const formData = new FormData();

      // Aggiunta di tutti i campi al FormData
      Object.keys(panelData).forEach(key => {
        if (key === 'panelImage' && panelData[key]) {
          formData.append(key, panelData[key], panelData[key].name);
        } else {
          formData.append(key, panelData[key]);
        }
      });

      // Logging del FormData per debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

    // Invio della richiesta al backend
    const newPanel = await addFavoritePanel(userId, formData);
    onPanelCreation(newPanel);
    closeModal();
    } catch (error) {
      console.error('Error creating panel:', error);
      // Gestione dell'errore più dettagliata
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Panel</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={panelData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="manga" className="block text-sm font-medium text-gray-700">Manga</label>
              <select
                name="manga"
                id="manga"
                required
                value={panelData.manga}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a manga</option>
                {userManga.map((manga) => (
                  <option key={manga._id} value={manga._id}>{manga.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="chapterNumber" className="block text-sm font-medium text-gray-700">Chapter Number</label>
              <input
                type="number"
                name="chapterNumber"
                id="chapterNumber"
                min="1"
                value={panelData.chapterNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="volumeNumber" className="block text-sm font-medium text-gray-700">Volume Number</label>
              <input
                type="number"
                name="volumeNumber"
                id="volumeNumber"
                min="1"
                value={panelData.volumeNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="panelImage" className="block text-sm font-medium text-gray-700">Panel Image</label>
              <input
                type="file"
                name="panelImage"
                id="panelImage"
                required
                onChange={handleInputChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Add Panel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreatePanelDialog;