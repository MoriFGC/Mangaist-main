import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDefaultManga, addMangaToCatalog, getUserManga } from '../services/api';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const Library = () => {
  const [defaultManga, setDefaultManga] = useState([]);
  const [userMangaIds, setUserMangaIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funzione per caricare i manga predefiniti e quelli dell'utente
    const fetchMangaData = async () => {
      try {
        const [defaultResponse, userResponse] = await Promise.all([
          getDefaultManga(),
          getUserManga(JSON.parse(localStorage.getItem('userData')).id)
        ]);

        setDefaultManga(defaultResponse.data);
        
        // Creiamo un Set con gli ID dei manga dell'utente per una ricerca efficiente
        const userMangaIdSet = new Set(userResponse.data.map(manga => manga._id));
        setUserMangaIds(userMangaIdSet);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaData();
  }, []);

  // Ordina i manga alfabeticamente
  const sortedManga = useMemo(() => {
    return [...defaultManga].sort((a, b) => a.title.localeCompare(b.title));
  }, [defaultManga]);

  const handleAddToCatalog = async (mangaId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.id) {
        console.error('Dati utente non trovati');
        alert('Errore: dati utente non trovati. Effettua nuovamente il login.');
        return;
      }
  
      await addMangaToCatalog(userData.id, { mangaId: mangaId });
      // Aggiorniamo lo stato locale per riflettere l'aggiunta
      setUserMangaIds(prev => new Set(prev).add(mangaId));
    } catch (error) {
      console.error('Errore nell\'aggiunta del manga alla collezione:', error);
      alert('Si è verificato un errore. Riprova più tardi.');
    }
  };

  if (loading) {
    return <div className="text-white">Caricamento...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Libreria Manga</h1>
      <div className="grid grid-cols-3 gap-2">
        {sortedManga.map((manga) => (
          <Link to={`/manga/${manga._id}`} key={manga._id}>
            <motion.div
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{ aspectRatio: "2/3" }}
            >
              <motion.img
                src={manga.coverImage}
                alt={manga.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-xs font-semibold text-white truncate">
                  {manga.title}
                </p>
              </div>
              {/* Indicatore se il manga è già nella collezione o pulsante per aggiungerlo */}
              {userMangaIds.has(manga._id) ? (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold p-1 rounded-full">
                  <FaCheck />
                </div>
              ) : (
                <motion.button
                  onClick={(e) => {
                    e.preventDefault(); // Previene la navigazione al click sul pulsante
                    handleAddToCatalog(manga._id);
                  }}
                  className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full hover:bg-blue-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Aggiungi
                </motion.button>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;