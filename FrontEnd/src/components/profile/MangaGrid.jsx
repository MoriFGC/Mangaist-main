// MangaGrid.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaSortAlphaDown, FaCheckCircle, FaBookOpen, FaBook } from 'react-icons/fa';

const MangaGrid = ({ manga }) => {
  // ----- STATO -----
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  // ----- FUNZIONI DI UTILITÀ -----
  // Funzione per ordinare i manga
  const sortManga = (mangaList) => {
    const sortOrder = { reading: 1, "to-read": 2, completed: 3 };
    return [...mangaList].sort((a, b) => {
      if (sortAlphabetically) {
        return a.title.localeCompare(b.title);
      } else {
        return sortOrder[a.readingStatus] - sortOrder[b.readingStatus];
      }
    });
  };

  // Filtra e ordina i manga
  const filteredAndSortedManga = sortManga(
    manga.filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Funzione per renderizzare l'icona dello stato di lettura
  const renderReadingStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "reading":
        return <FaBookOpen className="text-blue-500" />;
      case "to-read":
        return <FaBook className="text-gray-500" />;
      default:
        return null;
    }
  };

  // ----- RENDERING -----
  return (
    <div>
      {/* Barra di ricerca e ordinamento */}
      <div className="mb-4 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Cerca manga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded bg-black text-white"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => setSortAlphabetically(!sortAlphabetically)}
          className="ml-2 p-3 bg-black rounded hover:border hover:border-white transition-all duration-100 ease-linear"
        >
          <FaSortAlphaDown className={sortAlphabetically ? "text-blue-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Griglia dei manga */}
      <div className="grid grid-cols-3 gap-2">
        {filteredAndSortedManga.map((manga) => (
          <Link to={`/manga/${manga._id}`} key={manga._id}>
            <motion.div
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{ aspectRatio: "2/3" }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 z-10">
                {renderReadingStatusIcon(manga.readingStatus)}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-xs font-semibold text-white truncate">{manga.title}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MangaGrid;