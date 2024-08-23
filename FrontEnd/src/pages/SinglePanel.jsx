// Importazioni necessarie per il componente
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPanelById, likePanel, commentPanel, updatePanel, deletePanel } from "../services/api";
import { FaHeart, FaRegComment, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth0 } from "@auth0/auth0-react";

export default function SinglePanel() {
  // Estrae l'ID del pannello dai parametri dell'URL
  const { id } = useParams();
  // Hook per la navigazione programmatica
  const navigate = useNavigate();
  // Ottiene l'utente corrente da Auth0
  const { user: currentUser } = useAuth0();

  // Stati del componente
  const [panel, setPanel] = useState(null); // Dati del pannello
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [comment, setComment] = useState(''); // Testo del nuovo commento
  const [isEditing, setIsEditing] = useState(false); // Modalità di modifica
  const [editedDescription, setEditedDescription] = useState(''); // Descrizione modificata
  const [isOwner, setIsOwner] = useState(false); // Flag per il proprietario del pannello

  const [panelUser, setPanelUser] = useState(null);

  useEffect(() => {
    if (panel && panel.user) {
      setPanelUser(panel.user);
    }
  }, [panel]);

  useEffect(() => {
    console.log('Panel updated:', panel);
  }, [panel]);

  // Effetto per caricare i dati del pannello all'avvio del componente
  useEffect(() => {
    async function fetchPanel() {
      try {
        setLoading(true);
        // Recupera i dati del pannello dall'API
        const response = await getPanelById(id);
        setPanel(response.data);
        setEditedDescription(response.data.description);

        // Verifica se l'utente corrente è il proprietario del pannello
        const userData = JSON.parse(localStorage.getItem("userData"));
        setIsOwner(userData && userData.id === response.data.user._id);
      } catch (error) {
        console.error("Error fetching panel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPanel();
  }, [id]);

// Modifica la funzione handleLike
const handleLike = async () => {
  try {
    const response = await likePanel(panel._id);
    if (response && response.data && response.data.panel) {
      setPanel(prevPanel => ({
        ...prevPanel,
        ...response.data.panel,
        user: {
          ...prevPanel.user,
          ...response.data.panel.user
        }
      }));
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

const handleComment = async (e) => {
  e.preventDefault();
  try {
    if (comment.trim()) {
      const response = await commentPanel(panel._id, { text: comment });
      if (response && response.data && response.data.panel) {
        setPanel(prevPanel => ({
          ...prevPanel,
          ...response.data.panel,
          user: {
            ...prevPanel.user,
            ...response.data.panel.user
          }
        }));
        setComment('');
      }
    }
  } catch (error) {
    console.error("Error commenting on panel:", error);
  }
};

  // Gestisce la modifica della descrizione del pannello
  const handleEdit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.id) {
        await updatePanel(userData.id, panel._id, { description: editedDescription });
        // Aggiorna il pannello dopo la modifica
        const updatedPanel = await getPanelById(id);
        setPanel(updatedPanel.data);
        setIsEditing(false); // Esce dalla modalità di modifica
      }
    } catch (error) {
      console.error("Error updating panel:", error);
    }
  };

  // Gestisce l'eliminazione del pannello
  const handleDelete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.id) {
        await deletePanel(userData.id, panel._id);
        // Reindirizza l'utente al suo profilo dopo l'eliminazione
        navigate(`/profile/${userData.id}`);
      }
    } catch (error) {
      console.error("Error deleting panel:", error);
    }
  };

  // Rendering condizionale per lo stato di caricamento
  if (loading) return <div className="text-white">Loading...</div>;
  // Rendering condizionale se il pannello non è trovato
  if (!panel) return <div className="text-white">Panel not found</div>;

  // Rendering principale del componente
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto text-white p-4 border-b border-gray-800"
    >
      {/* Header con informazioni utente */}
      <div className="flex items-start mb-4">
        <img
          src={panel.user.profileImage || "/placeholder-avatar.jpg"}
          alt={`${panel.user.name}'s Avatar`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 className="font-bold">{panel.user.name}</h2>
          <p className="text-gray-400">@{panel.user.nickname}</p>
        </div>
      </div>

      {/* Descrizione del pannello (modalità modifica o visualizzazione) */}
      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded mb-2"
          />
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <p className="mb-4">{panel.description}</p>
      )}

      {/* Immagine del pannello */}
      <img
        src={panel.panelImage}
        alt={`Panel from ${panel.manga?.title}`}
        className="w-full rounded-lg mb-4"
      />

      {/* Informazioni sul manga */}
      <p className="text-gray-400 mb-4">
        From {panel.manga?.title}, Chapter {panel.chapterNumber}
      </p>

      {/* Pulsanti di interazione (like, commenti, modifica, elimina) */}
      <div className="flex justify-between text-gray-400">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          onClick={handleLike} 
          className="flex items-center"
        >
          <FaHeart className={`mr-2 ${panel.likes.includes(currentUser?.sub) ? 'text-red-500' : 'text-gray-400'}`} />
          <span>{panel.likes.length} Likes</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center">
          <FaRegComment className="mr-2" />
          <span>{panel.comments.length} Comments</span>
        </motion.button>
        {isOwner && (
          <>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsEditing(true)} className="flex items-center">
              <FaEdit className="mr-2" />
              <span>Edit</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} onClick={handleDelete} className="flex items-center">
              <FaTrash className="mr-2" />
              <span>Delete</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Form per aggiungere un commento */}
      <form onSubmit={handleComment} className="mt-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 bg-gray-800 rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Comment
        </button>
      </form>

      {/* Sezione commenti */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Comments</h3>
        {panel.comments.map((comment, index) => (
          <div key={index} className="mb-2">
            <p className="font-bold">{comment.user.name}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}