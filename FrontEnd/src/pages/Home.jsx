// Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllPanels,
  getPanelById,
  likePanel,
  getFollowedUsers,
  getUserManga,
  getFollowedPanels,
} from "../services/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import DesktopCommentsDialog from "../components/home/DesktopCommentsDialog";
import MobileCommentsSheet from "../components/home/MobileCommentsSheet";
import FollowedUsers from "../components/home/FollowedUsers";
import ReadingManga from "../components/home/ReadingManga";
import { BsGlobe, BsPeople } from "react-icons/bs";
import PanelSkeleton from "../components/home/PanelSkeleton";

const Home = () => {
  // Stati per gestire i pannelli globali e seguiti
  const [globalPanels, setGlobalPanels] = useState([]);
  const [followedPanels, setFollowedPanels] = useState([]);

  // Stati per gestire errori, caricamento e paginazione
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Stati per la gestione dei commenti
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Stati per gli utenti seguiti e i manga in lettura
  const [followedUsers, setFollowedUsers] = useState([]);
  const [readingManga, setReadingManga] = useState([]);

  // Stato per determinare se il dispositivo è desktop
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Stato per la tab attiva (global o followed)
  const [activeTab, setActiveTab] = useState("global");

  // Ottieni l'ID dell'utente corrente dal localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Funzione per recuperare i pannelli (globali o seguiti)
  const fetchPanels = useCallback(async (isGlobal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await (isGlobal ? getAllPanels : getFollowedPanels)(
        10,
        0
      );
      const newPanels = response.data;

      // Ottieni l'ID dell'utente corrente dal localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentUserId = userData?.id;

      // Aggiorna lo stato di like per ogni pannello
      const updatedPanels = newPanels.map((panel) => ({
        ...panel,
        isLiked: Array.isArray(panel.likes)
          ? panel.likes.includes(currentUserId)
          : panel.likes === currentUserId,
      }));

      if (isGlobal) {
        setGlobalPanels(updatedPanels);
      } else {
        setFollowedPanels(updatedPanels);
      }
      setHasMore(newPanels.length === 10);
    } catch (error) {
      console.error("Errore nel recupero dei pannelli:", error);
      setError("Errore nel caricamento dei pannelli. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effetto per caricare i pannelli quando cambia la tab attiva
  useEffect(() => {
    fetchPanels(activeTab === "global");
  }, [activeTab, fetchPanels]);

  // Funzione per ottenere gli utenti seguiti e i manga in lettura
  const fetchUserData = useCallback(async () => {
    if (!isDesktop) return;

    try {
      const [usersResponse, mangaResponse] = await Promise.all([
        getFollowedUsers(userData.id),
        getUserManga(userData.id),
      ]);
      setFollowedUsers(usersResponse.data);
      setReadingManga(
        mangaResponse.data.filter((manga) => manga.readingStatus === "reading")
      );
    } catch (error) {
      console.error("Errore nel recupero dei dati dell'utente:", error);
    }
  }, [isDesktop, userData.id]);

  // Effetto per gestire il ridimensionamento della finestra e caricare i dati dell'utente
  useEffect(() => {
    fetchUserData();
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchUserData]);

  // Gestione del like

  const handleLike = async (panelId) => {
    try {
      const response = await likePanel(panelId);
      if (response) {
        const updatePanels = (panels) =>
          panels.map((panel) =>
            panel._id === response.panelId
              ? { ...panel, likes: response.likes, isLiked: response.isLiked }
              : panel
          );
        setGlobalPanels(updatePanels);
        setFollowedPanels(updatePanels);

        // Aggiorna anche il pannello selezionato se è quello che è stato modificato
        if (selectedPanel && selectedPanel._id === panelId) {
          setSelectedPanel((prev) => ({
            ...prev,
            likes: response.likes,
            isLiked: response.isLiked,
          }));
        }

        // Restituisci il pannello aggiornato
        return {
          ...selectedPanel,
          likes: response.likes,
          isLiked: response.isLiked,
        };
      }
    } catch (error) {
      console.error("Errore nel mettere like al pannello:", error);
    }
  };

  // Apertura dei commenti
  const openComments = async (panel) => {
    setIsCommentsOpen(true);
    try {
      const response = await getPanelById(panel._id);
      setSelectedPanel(response.data);
    } catch (error) {
      console.error("Error fetching panel details:", error);
      setSelectedPanel(null);
    }
  };

  // Chiusura dei commenti
  const closeComments = () => {
    setIsCommentsOpen(false);
    setSelectedPanel(null);
  };

  // Aggiornamento del pannello selezionato
  const refreshPanel = async () => {
    if (selectedPanel) {
      try {
        const response = await getPanelById(selectedPanel._id);
        setSelectedPanel(response.data);
      } catch (error) {
        console.error("Errore nel refresh del pannello:", error);
      }
    }
  };

  // Gestione del cambio di tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setHasMore(true);
  };

  // Selezione dei pannelli da visualizzare in base alla tab attiva
  const currentPanels = activeTab === "global" ? globalPanels : followedPanels;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab per scegliere tra Global e Followed */}
      <div className="flex justify-around border-b border-gray-700 mb-8">
        <button
          className={`flex-1 py-4 flex justify-center items-center ${
            activeTab === "global"
              ? "border-b-2 border-white text-white"
              : "text-gray-400 hover:text-blue-500"
          }`}
          onClick={() => handleTabChange("global")}
        >
          <BsGlobe className="mr-2" /> Global
        </button>
        <button
          className={`flex-1 py-4 flex justify-center items-center ${
            activeTab === "followed"
              ? "border-b-2 border-white text-white"
              : "text-gray-400 hover:text-blue-500"
          }`}
          onClick={() => handleTabChange("followed")}
        >
          <BsPeople className="mr-2" /> Followed
        </button>
      </div>

      {/* Layout principale con flex per desktop */}
      <div className="lg:flex lg:space-x-8">
        {/* Colonna principale con i pannelli */}
        <div className="lg:w-2/3">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="space-y-8">
            {loading
              ? // Mostra 3 skeletons mentre si carica
                Array(3)
                  .fill()
                  .map((_, index) => <PanelSkeleton key={index} />)
              : currentPanels.map((panel) => (
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
                        src={
                          panel.user.profileImage || "/placeholder-avatar.jpg"
                        }
                        alt={`${panel.user.name}'s avatar`}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <Link
                        to={`/profile/${panel.user._id}`}
                        className="font-semibold text-white hover:text-blue-500 hover:underline transition-all duration-200 ease-in"
                      >
                        {panel.user.nickname}
                      </Link>
                    </div>

                    {/* Immagine del pannello */}
                    <div className="w-full h-auto md:h-[600px] relative overflow-hidden">
                      <img
                        src={panel.panelImage}
                        alt="Panel"
                        className="w-full h-full object-contain"
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
                        <button onClick={() => openComments(panel)}>
                          <FaRegComment className="text-2xl text-white hover:text-blue-500" />
                        </button>
                      </div>
                      <p className="font-bold text-white">
                        {panel.likes.length} likes
                      </p>
                      <p className="mt-1 text-white">
                        <span className="font-semibold">
                          {panel.user.nickname}
                        </span>{" "}
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

          {!hasMore && (
            <p className="text-white mt-4 text-center">
              No more panels to load.
            </p>
          )}
        </div>

        {/* Colonna laterale per desktop */}
        {isDesktop && (
          <div className="lg:w-1/3 space-y-8">
            <FollowedUsers users={followedUsers} />
            <ReadingManga manga={readingManga} />
          </div>
        )}
      </div>

      {/* Rendering condizionale per i componenti di commenti */}
      {isDesktop ? (
        <DesktopCommentsDialog
          isOpen={isCommentsOpen}
          closeDialog={closeComments}
          panel={selectedPanel}
          handleLike={handleLike} // Passa la funzione handleLike aggiornata
          refreshPanel={refreshPanel}
        />
      ) : (
        <MobileCommentsSheet
          isOpen={isCommentsOpen}
          closeSheet={closeComments}
          panel={selectedPanel}
          refreshPanel={refreshPanel}
        />
      )}
    </div>
  );
};

export default Home;
