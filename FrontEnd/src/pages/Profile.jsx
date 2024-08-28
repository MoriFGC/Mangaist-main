// Profile.jsx

// Importazioni necessarie per il componente
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";
import UpdateProfileDialog from "../components/profile/UpdateProfileDialog";
import { useAuth0 } from "@auth0/auth0-react";
import { FaCheckCircle, FaBookOpen, FaBook } from "react-icons/fa";
import { followUser, unfollowUser } from "../services/api";
import ResponsiveProfile from "../components/profile/ResponsiveProfile";
import { BsGrid3X3, BsBookmarks } from "react-icons/bs";

const Profile = ({ updateUserData }) => {
  // Estrae l'ID dall'URL
  const { id } = useParams();

  // Stati per gestire i dati del profilo e dei manga dell'utente
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);

  // Stati per gestire l'apertura dei vari dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateMangaDialogOpen, setIsCreateMangaDialogOpen] = useState(false);
  const [isCreatePanelDialogOpen, setIsCreatePanelDialogOpen] = useState(false);

  //stato per gestire i follow
  const [isFollowing, setIsFollowing] = useState(false);

    // Nuovo stato per tracciare la sezione attiva
    const [activeSection, setActiveSection] = useState('manga');

  // Utilizzo di Auth0 per l'autenticazione
  const {
    user: authUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth0();

  // Stato per gestire il caricamento dei dati
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per recuperare i dati del profilo e dei manga dell'utente
  const fetchProfileAndManga = useCallback(async () => {
    // Se l'autenticazione è in corso, non fare nulla
    if (authLoading) return;

    try {
      setIsLoading(true);
      // Recupera i dati dell'utente dal localStorage come fallback
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      // Usa l'ID dall'URL, o l'ID memorizzato, o 'me' come fallback
      const userId = id || storedUserData?.id || "me";

      // Recupera i dati del profilo
      const profileData = await getUserById(userId);
      setProfile(profileData.data);

      // Recupera i manga dell'utente
      const mangaData = await getUserManga(profileData.data._id);
      setUserManga(mangaData.data.filter((item) => item.manga !== null));
    } catch (error) {
      console.error("Error fetching profile or manga:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, authLoading]);

  // Effetto per caricare i dati del profilo e dei manga all'avvio del componente
  useEffect(() => {
    fetchProfileAndManga();
  }, [fetchProfileAndManga]);

  // Use effect per il follow
  useEffect(() => {
    if (profile && authUser && profile.followers) {
      setIsFollowing(profile.followers.includes(authUser.sub));
    }
  }, [profile, authUser]);

  // Gestore per l'aggiornamento del profilo
  const handleProfileUpdate = async (updatedProfile) => {
    setProfile(updatedProfile);
    // Aggiorna lo stato nel componente genitore
    updateUserData(updatedProfile);
    setIsUpdateDialogOpen(false);

    // Aggiorna il localStorage con i nuovi dati del profilo
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      storedUserData.profileImage = updatedProfile.profileImage;
      localStorage.setItem("userData", JSON.stringify(storedUserData));
    }

    await fetchProfileAndManga();
  };

  // Gestori per la creazione di nuovi manga e pannelli
  const handleMangaCreation = async (newManga) => {
    setIsCreateMangaDialogOpen(false);
    await fetchProfileAndManga();
  };

  const handlePanelCreation = async (newPanel) => {
    setIsCreatePanelDialogOpen(false);
    await fetchProfileAndManga();
  };

  // funzione per il follow
  // Funzione per gestire il follow/unfollow
  const handleFollowToggle = async () => {
    try {
      // Determiniamo quale funzione usare in base allo stato corrente
      const toggleFollow = isFollowing ? unfollowUser : followUser;

      // Chiamiamo la funzione appropriata
      await toggleFollow(profile._id);

      // Aggiorniamo lo stato locale
      setIsFollowing(!isFollowing);

      // Aggiorniamo il conteggio dei follower nel profilo
      setProfile((prevProfile) => ({
        ...prevProfile,
        followers: isFollowing
          ? prevProfile.followers.filter((id) => id !== authUser.sub)
          : [...prevProfile.followers, authUser.sub],
      }));
    } catch (error) {
      // Logghiamo l'errore per il debugging
      console.error("Errore nel seguire/smettere di seguire:", error);
      // Qui potresti anche mostrare un messaggio di errore all'utente
    }
  };

  // Aggiungi questa funzione prima del rendering del componente
  // Modifichiamo la funzione renderReadingStatusIcon per creare dei badge più visibili
  const renderReadingStatusIcon = (manga) => {
    let bgColor, textColor, icon, text;
    switch (manga.readingStatus) {
      case "completed":
        bgColor = "bg-green-500";
        textColor = "text-white";
        icon = <FaCheckCircle className="mr-1" />;
        text = "Completed";
        break;
      case "reading":
        bgColor = "bg-blue-500";
        textColor = "text-white";
        icon = <FaBookOpen className="mr-1" />;
        text = "Reading";
        break;
      case "to-read":
        bgColor = "bg-gray-500";
        textColor = "text-white";
        icon = <FaBook className="mr-1" />;
        text = "To Read";
        break;
      default:
        return null;
    }

    return (
      <div className={`absolute top-2 right-2 z-10 flex items-center ${bgColor} ${textColor} text-xs font-bold px-2 py-1 rounded-full`}>
        {icon}
        {text}
      </div>
    );
  };

  // Animazione per il fade-in degli elementi
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

    // Funzione per renderizzare il contenuto della sezione attiva
    const renderSectionContent = () => {
      if (activeSection === 'manga') {
        return (
          <div className="grid grid-cols-3 gap-2">
            {userManga.map((manga, index) => (
              <Link to={`/manga/${manga._id}`} key={index}>
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
                  {renderReadingStatusIcon(manga)}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs font-semibold text-white truncate">
                      {manga.title}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-3 gap-2">
            {profile.favoritePanels && profile.favoritePanels.map((panel, index) => (
              <Link to={`/panel/${panel._id}`} key={index}>
                <motion.div
                  className="relative overflow-hidden shadow-lg"
                  style={{ aspectRatio: "1/1" }} // Formato più verticale per i pannelli
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={panel.panelImage}
                    alt={`Panel from ${panel.manga?.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs font-semibold text-white truncate">
                      {panel.manga?.title} - Ch.{panel.chapterNumber}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        );
      }
    };

    console.log(userManga);

  // Mostra un indicatore di caricamento mentre i dati vengono recuperati
  // Modifichiamo il rendering per gestire meglio i casi di dati mancanti
  if (isLoading || authLoading) {
    return <div className="text-white">Loading...</div>;
  }

  // Se il profilo non è stato trovato, mostra un messaggio
  if (!profile) {
    return <div className="text-white">Profile not found</div>;
  }

  // Verifica se l'utente autenticato è il proprietario del profilo
  const isProfileOwner =
    isAuthenticated && authUser && authUser.sub === profile.authId;

  console.log(userManga);
  // Rendering del componente

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="text-white pb-20 md:pb-0 max-w-4xl mx-auto px-4"
    >
      {/* Sezione principale del profilo */}
      <ResponsiveProfile profile={profile}
      userManga={userManga}
      setIsUpdateDialogOpen={setIsUpdateDialogOpen}
      handleFollowToggle={handleFollowToggle}
      isFollowing={isFollowing}
      isProfileOwner={isProfileOwner} />


      {/* Sezione per le tab dei manga e dei pannelli */}
      <div className="flex justify-around border-t border-gray-700 mt-16 mb-2">
        <button
          className={`flex-1 py-4 flex justify-center items-center ${activeSection === 'manga' ? 'border-t-2 border-white' : ''}`}
          onClick={() => setActiveSection('manga')}
        >
          <BsGrid3X3 className="mr-2" /> Manga
        </button>
        <button
          className={`flex-1 py-4 flex justify-center items-center ${activeSection === 'panels' ? 'border-t-2 border-white' : ''}`}
          onClick={() => setActiveSection('panels')}
        >
          <BsBookmarks className="mr-2" /> Panels
        </button>
      </div>

      {/* Contenuto della sezione attiva */}
      {renderSectionContent()}

      {/* Dialog per l'aggiornamento del profilo */}
      {isProfileOwner && (
        <UpdateProfileDialog
          isOpen={isUpdateDialogOpen}
          closeModal={() => setIsUpdateDialogOpen(false)}
          user={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </motion.div>
  );
};

export default Profile;
