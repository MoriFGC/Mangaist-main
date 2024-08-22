import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";
import UpdateProfileDialog from "../components/profile/UpdateProfileDialog";
import { useAuth0 } from "@auth0/auth0-react";
import CreateMangaDialog from "../components/profile/CreateMangaDialog";
import CreatePanelDialog from "../components/profile/CreatePanelDialog";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth0();
  // Aggiungiamo uno stato per gestire il caricamento
  const [isLoading, setIsLoading] = useState(true);

  // Nuovi stati per controllare l'apertura dei dialog di creazione
  const [isCreateMangaDialogOpen, setIsCreateMangaDialogOpen] = useState(false);
  const [isCreatePanelDialogOpen, setIsCreatePanelDialogOpen] = useState(false);

  const fetchProfileAndManga = useCallback(async () => {
    // Verifichiamo se l'autenticazione è ancora in corso
    if (authLoading) return;

    try {
      setIsLoading(true);
      // Recuperiamo i dati dell'utente dal localStorage come fallback
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      // Usiamo l'id dal parametro, o l'id memorizzato, o 'me' come fallback
      const userId = id || storedUserData?.id || 'me';
      
      const profileData = await getUserById(userId);
      setProfile(profileData.data);
      
      const mangaData = await getUserManga(profileData.data._id);
      setUserManga(mangaData.data.filter((item) => item.manga !== null));
    } catch (error) {
      console.error("Error fetching profile or manga:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, authLoading]);

  useEffect(() => {
    fetchProfileAndManga();
  }, [fetchProfileAndManga]);

  const handleProfileUpdate = async (updatedProfile) => {
    setProfile(updatedProfile);
    setIsUpdateDialogOpen(false);
    
    // Aggiorna il localStorage con i nuovi dati del profilo
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      storedUserData.profileImage = updatedProfile.profileImage;
      localStorage.setItem("userData", JSON.stringify(storedUserData));
    }
  
    await fetchProfileAndManga();
  };

    // Funzioni per gestire la creazione di nuovi manga e pannelli
    const handleMangaCreation = async (newManga) => {
      // Implementare la logica per aggiungere il nuovo manga al profilo
      // e aggiornare lo stato userManga
      setIsCreateMangaDialogOpen(false);
      await fetchProfileAndManga(); // Ricarica i dati del profilo e dei manga
    };
  
    const handlePanelCreation = async (newPanel) => {
      // Implementare la logica per aggiungere il nuovo pannello al profilo
      // e aggiornare lo stato profile.favoritePanels
      setIsCreatePanelDialogOpen(false);
      await fetchProfileAndManga(); // Ricarica i dati del profilo
    };

  // Mostriamo un indicatore di caricamento mentre i dati vengono recuperati
  if (isLoading || authLoading) {
    return <div className="text-white">Loading...</div>;
  }

  // Se il profilo non è stato trovato dopo il caricamento, mostriamo un messaggio
  if (!profile) {
    return <div className="text-white">Profile not found</div>;
  }

  // Verifica se l'utente autenticato è il proprietario del profilo
  const isProfileOwner = isAuthenticated && authUser && authUser.sub === profile.authId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-white p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-8">
        <img
          src={profile.profileImage || profile.picture}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <p className="text-lg">
          {profile.name} {profile.cognome}
        </p>
        <p className="text-gray-400">{profile.nickname}</p>
        <p className="text-gray-400">{profile.email}</p>
        {isProfileOwner && (
          <button
            onClick={() => setIsUpdateDialogOpen(true)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Update Profile
          </button>
        )}
      </div>

      {isProfileOwner && (
        <div className="mt-4 space-x-2">
          <button
            onClick={() => setIsCreateMangaDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Manga
          </button>
          <button
            onClick={() => setIsCreatePanelDialogOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Panel
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Manga</h2>
          <Link to={`/all-manga/${profile._id}`} className="text-blue-500 hover:underline">
            View All Manga
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {userManga.map((manga, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <Link to={`/manga/${manga._id}`}>
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="w-full h-56 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-semibold text-center">{manga.title}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Favorite Panels</h2>
          <Link to="/all-panels" className="text-blue-500 hover:underline">
            View All Panels
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profile.favoritePanels &&
            profile.favoritePanels.map((panel, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <Link to={`/panel/${panel._id}`}>
                  <img
                    src={panel.panelImage}
                    alt={`Panel from ${panel.manga?.title}`}
                    className="w-full h-56 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-semibold text-center">
                    {panel.manga?.title} - Ch.{panel.chapterNumber}
                  </p>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>

      {isProfileOwner && (
        <>
        <UpdateProfileDialog
          isOpen={isUpdateDialogOpen}
          closeModal={() => setIsUpdateDialogOpen(false)}
          user={profile}
          onProfileUpdate={handleProfileUpdate}
        />
        <CreateMangaDialog
        isOpen={isCreateMangaDialogOpen}
        closeModal={() => setIsCreateMangaDialogOpen(false)}
        onMangaCreation={handleMangaCreation}
      />
      <CreatePanelDialog
        isOpen={isCreatePanelDialogOpen}
        closeModal={() => setIsCreatePanelDialogOpen(false)}
        onPanelCreation={handlePanelCreation}
        userManga={userManga} // Passa la lista dei manga dell'utente per selezionare a quale manga appartiene il pannello
      />
      </>
      )}

    </motion.div>
  );
};

export default Profile;