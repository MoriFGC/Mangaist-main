// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPanelById,
  likePanel,
  commentPanel,
  updatePanel,
  deletePanel,
} from "../services/api";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaEdit,
  FaTrash,
  FaPaperPlane,
} from "react-icons/fa";
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
  const [comment, setComment] = useState(""); // Testo del nuovo commento
  const [isEditing, setIsEditing] = useState(false); // Modalità di modifica
  const [editedDescription, setEditedDescription] = useState(""); // Descrizione modificata
  const [isOwner, setIsOwner] = useState(false); // Flag per il proprietario del pannello
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  const [panelUser, setPanelUser] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (panel && panel.user) {
      setPanelUser(panel.user);
    }
  }, [panel]);

  useEffect(() => {
    console.log("Panel updated:", panel);
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
  // Gestione del like con animazione
  const handleLike = async () => {
    try {
      const isLiked = panel.likes.includes(userData.id);
      const updatedLikes = isLiked
        ? panel.likes.filter((id) => id !== userData.id)
        : [...panel.likes, userData.id];

      // Aggiorna immediatamente lo stato locale
      setPanel((prevPanel) => ({
        ...prevPanel,
        likes: updatedLikes,
      }));

      // Chiama l'API per aggiornare il like sul server
      await likePanel(panel._id);
    } catch (error) {
      console.error("Error toggling like:", error);
      // In caso di errore, ripristina lo stato precedente
      setPanel((prevPanel) => ({
        ...prevPanel,
        likes: prevPanel.likes,
      }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (comment.trim()) {
        const response = await commentPanel(panel._id, { text: comment });
        if (response && response.data && response.data.panel) {
          const updatedPanel = await getPanelById(panel._id);
          setPanel(updatedPanel.data);
          setComment("");
        }
      }
    } catch (error) {
      console.error("Error commenting on panel:", error);
    }
  };

  // Gestisce la modifica della descrizione del pannello
  const handleEdit = async () => {
    if (isEditingDescription) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          await updatePanel(userData.id, panel._id, {
            description: editedDescription,
          });
          setPanel((prevPanel) => ({
            ...prevPanel,
            description: editedDescription,
          }));
          setIsEditingDescription(false);
        }
      } catch (error) {
        console.error("Error updating panel:", error);
      }
    } else {
      setIsEditingDescription(true);
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

  console.log(panel);

  // Rendering principale del componente
  return (
    <div className="flex justify-center items-center bg-black min-h-screen p-4 ">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-black rounded-lg overflow-hidden border border-gray-700">
        {/* Sezione immagine */}
        <div className="md:w-2/3 flex items-center justify-center p-4">
          <img
            src={panel.panelImage}
            alt={`Panel from ${panel.manga?.title}`}
            className="max-w-full max-h-[70vh] object-cover"
          />
        </div>

        {/* Sezione commenti e dettagli */}
        <div className="md:w-2/3 flex flex-col h-[70vh] bg-black border-s border-gray-700">
          {/* Header con informazioni utente */}
          <div className="p-4 border-b border-gray-700">
            <Link to={`/profile/${panel.user._id}`} className="flex items-center mb-2">
              <img
                src={panel.user.profileImage || "/placeholder-avatar.jpg"}
                alt={`${panel.user.name}'s Avatar`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-bold text-white">{panel.user.name}</h2>
                <p className="text-gray-400">@{panel.user.nickname}</p>
              </div>
            </Link>
            {isEditingDescription ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
            ) : (
              <p className="text-white mt-2">{panel.description}</p>
            )}
            <p className="text-gray-400 mt-2">
              From {panel.manga?.title}, Chapter {panel.chapterNumber}
            </p>
          </div>

            {/* Pulsanti di interazione */}
            <div className="flex justify-around p-4 border-b border-gray-700">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="flex items-center group" // Aggiungiamo la classe 'group'
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={
                      panel.likes.includes(userData.id) ? "liked" : "unliked"
                    }
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {panel.likes.includes(userData.id) ? (
                      <FaHeart className="mr-2 text-red-500" />
                    ) : (
                      <FaRegHeart className="mr-2 text-white group-hover:text-red-500" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className="text-white">{panel.likes.length}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center text-white group"
              >
                <FaRegComment className="mr-2 group-hover:text-blue-500" />
                <span>{panel.comments.length}</span>
              </motion.button>
              {isOwner && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEdit}
                    className="flex items-center text-white group"
                  >
                    <FaEdit className="mr-2 group-hover:text-emerald-500" />
                    <span>{isEditingDescription ? "Save" : "Edit"}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="flex items-center text-white group"
                  >
                    <FaTrash className="mr-2 group-hover:text-red-500" />
                    <span>Delete</span>
                  </motion.button>
                </>
              )}
            </div>

                      {/* Sezione commenti scrollabile */}
          <div className="flex-grow overflow-y-auto p-4 scrollbar-thin">
            {panel.comments.map((comment, index) => (
              <div key={index} className="mb-4 flex items-start">
                <Link to={`/profile/${comment.user._id}`}>
                  <img
                    src={comment.user.profileImage || "/placeholder-avatar.jpg"}
                    alt={`${comment.user.name}'s avatar`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${comment.user._id}`}
                    className="font-bold text-white hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form per aggiungere un commento */}
          <form onSubmit={handleComment} className="p-4 border-t border-gray-700  flex items-center relative">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 bg-black rounded-l text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="hover:text-blue-500 text-white p-3 rounded-r absolute end-5"
              >
                <FaPaperPlane />
              </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Nota: Questo componente SinglePanel rappresenta una pagina dettagliata per un singolo pannello di manga.
// Offre funzionalità come visualizzazione dell'immagine del pannello, informazioni sull'utente che l'ha caricato,
// la possibilità di mettere like, commentare, e per il proprietario, modificare la descrizione o eliminare il pannello.
// Il layout è responsive, dividendosi in due colonne su schermi più grandi: una per l'immagine e l'altra per i dettagli e le interazioni.
// Utilizza animazioni di Framer Motion per migliorare l'esperienza utente e React Router per la navigazione.
