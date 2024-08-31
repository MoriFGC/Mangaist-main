// Importiamo React e gli hooks necessari
import React, { useState, useEffect, useMemo } from "react";
// Importiamo Link per la navigazione
import { Link } from "react-router-dom";
// Importiamo motion da framer-motion per le animazioni
import { motion } from "framer-motion";
// Importiamo la funzione getAllUsers dal nostro servizio API
import { getAllUsers } from "../services/api";
// Importiamo le icone necessarie da react-icons
import { FaUser, FaBook, FaImage, FaSearch, FaSort } from "react-icons/fa";
import { Select } from "@headlessui/react";

// Definiamo il componente AllUsers
export default function AllUsers() {
  // Stato per memorizzare la lista degli utenti
  const [users, setUsers] = useState([]);
  // Stato per gestire il caricamento
  const [loading, setLoading] = useState(true);
  // Stato per la stringa di ricerca
  const [searchTerm, setSearchTerm] = useState('');
  // Stato per il criterio di ordinamento
  const [sortCriteria, setSortCriteria] = useState('name');
  
  // Effetto per caricare gli utenti all'avvio del componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("Users data:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Funzione per ordinare gli utenti
  const sortUsers = (users, criteria) => {
    return [...users].sort((a, b) => {
      switch (criteria) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'manga':
          return (b.manga || 0) - (a.manga || 0);
        case 'panels':
          return (b.favoritePanels || 0) - (a.favoritePanels || 0);
        case 'followers':
          return (b.followers?.length || 0) - (a.followers?.length || 0);
        default:
          return 0;
      }
    });
  };

  // Utilizziamo useMemo per memorizzare gli utenti filtrati e ordinati
  const filteredAndSortedUsers = useMemo(() => {
    return sortUsers(users, sortCriteria).filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm, sortCriteria]);

  // Mostra un loader mentre i dati vengono caricati
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  // Renderizza la griglia degli utenti
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manga Enthusiasts</h1>
      
      {/* Barra di ricerca e dropdown per i filtri */}
      <div className="flex mb-4">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 pl-10 rounded bg-transparent text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <Select
          className="p-2 rounded bg-transparent text-white focus:border-white focus-visible:ring-0"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option className="text-black" value="name">Nome</option>
          <option className="text-black" value="manga">Manga</option>
          <option className="text-black" value="panels">Panels</option>
          <option className="text-black" value="followers">Follower</option>
        </Select>
      </div>

      {/* Griglia degli utenti */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAndSortedUsers.map((user) => (
          // Usiamo Link per rendere l'intera card cliccabile e navigare al profilo dell'utente
          <Link to={`/profile/${user._id}`} key={user._id}>
            <motion.div
              className="relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              {/* Container per l'immagine del profilo */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
                {/* Overlay scuro con informazioni sull'utente */}
                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white">
                  <div className="flex items-center mb-2">
                    <FaUser className="mr-2" />
                    <span>{user.followers?.length || 0}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaBook className="mr-2" />
                    <span>{user.manga || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FaImage className="mr-2" />
                    <span>{user.favoritePanels || 0}</span>
                  </div>
                </div>
              </div>
              {/* Username sotto l'immagine */}
              <p className="text-sm text-white text-center mt-2">@{user.nickname}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}