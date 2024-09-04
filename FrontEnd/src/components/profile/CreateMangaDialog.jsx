import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { addMangaToCatalog } from '../../services/api';
import { TiPlus } from "react-icons/ti";

const CreateMangaDialog = ({ isOpen, closeModal, onMangaCreation }) => {
  // Stato per i dati del manga
  const [mangaData, setMangaData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'ongoing', // Valore predefinito
    volumes: 0,
    chapters: 0,
    genre: [],
    coverImage: null,
    demographics: '',
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
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setMangaData({ ...mangaData, [name]: files[0] });
    } else if (type === 'checkbox') {
      const updatedGenres = checked
        ? [...mangaData.genre, value]
        : mangaData.genre.filter(genre => genre !== value);
      setMangaData({ ...mangaData, genre: updatedGenres });
    } else {
      setMangaData({ ...mangaData, [name]: value });
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
      Object.keys(mangaData).forEach(key => {
        if (key === 'genre') {
          mangaData[key].forEach(genre => formData.append('genre[]', genre));
        } else if (key === 'coverImage' && mangaData[key]) {
          formData.append(key, mangaData[key], mangaData[key].name);
        } else {
          formData.append(key, mangaData[key]);
        }
      });

      // Logging del FormData per debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Invio della richiesta al backend
      const response = await addMangaToCatalog(userId, formData);
      onMangaCreation(response.data);
      closeModal();
    } catch (error) {
      console.error('Error creating manga:', error);
      // Gestione dell'errore più dettagliata
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Aumentiamo la larghezza massima del pannello per desktop */}
        <Dialog.Panel className="w-full max-w-[95%] md:max-w-4xl rounded bg-black p-6 overflow-y-auto max-h-[90vh] border border-white/30">
          <Dialog.Title className="text-2xl font-bold leading-6 text-white mb-6">Add New Manga</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Utilizziamo un layout a griglia per organizzare i campi su desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titolo */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={mangaData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Autore */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-white mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  required
                  value={mangaData.author}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Descrizione - occupa due colonne su desktop */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={mangaData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-white mb-1">Status</label>
                <select
                  name="status"
                  id="status"
                  required
                  value={mangaData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Demographics */}
              <div>
                <label htmlFor="demographics" className="block text-sm font-medium text-white mb-1">Demographics</label>
                <select
                  name="demographics"
                  id="demographics"
                  value={mangaData.demographics}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select demographics</option>
                  <option value="Shonen">Shonen</option>
                  <option value="Seinen">Seinen</option>
                  <option value="Shoujo">Shoujo</option>
                  <option value="Josei">Josei</option>
                </select>
              </div>

              {/* Volumes */}
              <div>
                <label htmlFor="volumes" className="block text-sm font-medium text-white mb-1">Volumes</label>
                <input
                  type="number"
                  name="volumes"
                  id="volumes"
                  min="0"
                  value={mangaData.volumes}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Chapters */}
              <div>
                <label htmlFor="chapters" className="block text-sm font-medium text-white mb-1">Chapters</label>
                <input
                  type="number"
                  name="chapters"
                  id="chapters"
                  min="0"
                  value={mangaData.chapters}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Cover Image */}
              <div className="md:col-span-2">
                <label htmlFor="coverImage" className="block text-sm font-medium text-white mb-1">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  id="coverImage"
                  onChange={handleInputChange}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:text-black"
                />
              </div>

              {/* Genre - occupa due colonne su desktop */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Genre</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'].map((genre) => (
                    <div key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        id={genre}
                        name="genre"
                        value={genre}
                        checked={mangaData.genre.includes(genre)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={genre} className="ml-2 text-sm text-white">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pulsanti di azione */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-transparent hover:border-white  text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" flex items-center px-4 py-2 rounded-md border border-transparent bg-white text-sm font-semibold text-black hover:bg-black hover:text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <TiPlus /> Add Manga
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateMangaDialog;