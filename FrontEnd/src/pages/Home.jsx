// Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getAllPanels, getFollowedPanels, likePanel } from "../services/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

const Home = () => {
  // Stati per gestire i pannelli, errori, caricamento e paginazione
  const [panels, setPanels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFollowed, setShowFollowed] = useState(false);

  // Ottieni l'ID dell'utente corrente dal localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Funzione per recuperare i pannelli
  const fetchPanels = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);

    try {
      // Ottieni l'ID dell'utente corrente dal localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentUserId = userData?.id;

      // Chiamata API per ottenere i pannelli (tutti o solo quelli seguiti)
      const response = await (showFollowed ? getFollowedPanels : getAllPanels)(
        10,
        panels.length
      );
      const newPanels = response.data;

      if (newPanels.length === 0) {
        setHasMore(false);
      } else {
        // Aggiorna i pannelli garantendo l'unicità e impostando lo stato di like
        // All'interno della funzione fetchPanels

        // Aggiorna i pannelli garantendo l'unicità e impostando lo stato di like
        setPanels((prevPanels) => {
          const uniquePanels = [...prevPanels, ...newPanels].reduce(
            (acc, panel) => {
              if (!acc.some((p) => p._id === panel._id)) {
                // Verifica se panel.likes è un array prima di usare includes
                panel.isLiked = Array.isArray(panel.likes)
                  ? panel.likes.includes(currentUserId)
                  : panel.likes === currentUserId; // Se non è un array, confronta direttamente

                // Assicurati che panel.likes sia sempre un array
                panel.likes = Array.isArray(panel.likes)
                  ? panel.likes
                  : [panel.likes].filter(Boolean);

                acc.push(panel);
              }
              return acc;
            },
            []
          );
          return uniquePanels;
        });
      }
    } catch (error) {
      console.error("Errore nel recupero dei pannelli:", error);
      setError(
        error.response?.data?.message ||
          "Errore nel caricamento dei pannelli. Riprova più tardi."
      );
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, panels.length, showFollowed]);

  // Effetto per ricaricare i pannelli quando si cambia tra "Tutti" e "Seguiti"
  useEffect(() => {
    setPanels([]);
    setHasMore(true);
    fetchPanels();
  }, [showFollowed]);

  // Gestione dello scroll infinito
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchPanels();
    }
  }, [fetchPanels]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Gestione del like
  const handleLike = async (panelId) => {
    try {
      const response = await likePanel(panelId);
      if (response) {
        setPanels(prevPanels =>
          prevPanels.map(panel =>
            panel._id === response.panelId
              ? { 
                  ...panel, 
                  likes: response.likes,
                  isLiked: response.isLiked
                }
              : panel
          )
        );
      }
    } catch (error) {
      console.error("Errore nel mettere like al pannello:", error);
    }
  };
  
  console.log(panels);

  return (
    <div className="container mx-auto px-0 py-8">
      {/* Tab per switch tra "Tutti i pannelli" e "Pannelli seguiti" */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowFollowed(false)}
          className={`mx-2 px-4 py-2 rounded-full ${
            !showFollowed
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setShowFollowed(true)}
          className={`mx-2 px-4 py-2 rounded-full ${
            showFollowed
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Followed
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Lista dei pannelli in stile Instagram */}
      <div className="space-y-8 w-full md:max-w-xl mx-auto">
        {panels.map((panel) => (
          <motion.div
            key={panel._id}
            className="bg-black rounded-none overflow-hidden shadow-lg border-b border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header del pannello con info utente */}
            <div className="flex items-center p-4">
              <img
                src={panel.user.profileImage || "/placeholder-avatar.jpg"}
                alt={`${panel.user.name}'s avatar`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Link
                to={`/profile/${panel.user._id}`}
                className="font-semibold text-white hover:underline"
              >
                {panel.user.nickname}
              </Link>
            </div>

            {/* Immagine del pannello */}
            <div className="w-full h-auto md:h-[600px] relative overflow-hidden">
              <img
                src={panel.panelImage}
                alt="Panel"
                className="w-full h-full object-contain border border-white/30"
              />
            </div>

            {/* Sezione interazioni (like, commenti) */}
            <div className="p-4">
              <div className="flex items-center mb-2">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={panel.isLiked ? "liked" : "unliked"}
                    onClick={() => handleLike(panel._id)}
                    className="mr-4"
                    whileTap={{ scale: 0.5 }}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {panel.isLiked ? (
                      <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                      <FaRegHeart className="text-white text-2xl" />
                    )}
                  </motion.button>
                </AnimatePresence>
                <Link to={`/panel/${panel._id}`}>
                  <FaRegComment className="text-2xl text-white" />
                </Link>
              </div>
              <p className="font-bold text-white">{panel.likes.length} likes</p>
              <p className="mt-1 text-white">
                <span className="font-semibold">{panel.user.nickname}</span>{" "}
                {panel.description}
              </p>
              <Link
                to={`/panel/${panel._id}`}
                className="text-gray-400 mt-1 block"
              >
                View all {panel.comments.length} comments
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && <p className="text-white mt-4 text-center">Loading...</p>}
      {!hasMore && (
        <p className="text-white mt-4 text-center">No more panels to load.</p>
      )}
    </div>
  );
};

export default Home;
