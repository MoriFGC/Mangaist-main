import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { addMangaToCatalog } from '../../services/api';

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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Manga</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={mangaData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                name="author"
                id="author"
                required
                value={mangaData.author}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={mangaData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                id="status"
                required
                value={mangaData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="volumes" className="block text-sm font-medium text-gray-700">Volumes</label>
              <input
                type="number"
                name="volumes"
                id="volumes"
                min="0"
                value={mangaData.volumes}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="chapters" className="block text-sm font-medium text-gray-700">Chapters</label>
              <input
                type="number"
                name="chapters"
                id="chapters"
                min="0"
                value={mangaData.chapters}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <div className="mt-2 space-y-2">
                {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'].map((genre) => (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      id={genre}
                      name="genre"
                      value={genre}
                      checked={mangaData.genre.includes(genre)}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={genre} className="ml-2 block text-sm text-gray-900">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                onChange={handleInputChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
            </div>
            <div>
              <label htmlFor="demographics" className="block text-sm font-medium text-gray-700">Demographics</label>
              <select
                name="demographics"
                id="demographics"
                value={mangaData.demographics}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select demographics</option>
                <option value="Shonen">Shonen</option>
                <option value="Seinen">Seinen</option>
                <option value="Shoujo">Shoujo</option>
                <option value="Josei">Josei</option>
              </select>
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
                Add Manga
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateMangaDialog;