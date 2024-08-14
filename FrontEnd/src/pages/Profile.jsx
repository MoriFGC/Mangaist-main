import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";
import UpdateProfileDialog from "../components/profile/UpdateProfileDialog";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { user: authUser, isAuthenticated } = useAuth0();

  const fetchProfileAndManga = useCallback(async () => {
    try {
      const profileData = await getUserById(id);
      setProfile(profileData.data);
      const mangaData = await getUserManga(id);
      setUserManga(mangaData.data.filter((item) => item.manga !== null));
    } catch (error) {
      console.error("Error fetching profile or manga:", error);
    }
  }, [id]);

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

  if (!profile) {
    return <div className="text-white">Loading...</div>;
  }
  console.log(profile);
 
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