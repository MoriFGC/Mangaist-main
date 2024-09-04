// Profile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById, getUserManga, followUser, unfollowUser } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import UpdateProfileDialog from "../components/profile/UpdateProfileDialog";
import ResponsiveProfile from "../components/profile/ResponsiveProfile";
import MangaGrid from "../components/profile/MangaGrid";
import PanelGrid from "../components/profile/PanelGrid";

const Profile = ({ updateUserData }) => {
  // ----- STATO -----
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("manga");
  const [isLoading, setIsLoading] = useState(true);

  // ----- HOOKS -----
  const { id } = useParams();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth0();

  // ----- FETCH DATI -----
  const fetchProfileData = useCallback(async () => {
    if (authLoading) return;
    
    setIsLoading(true);
    try {
      const profileData = await getUserById(id);
      setProfile(profileData.data);
  
      if (isAuthenticated && authUser) {
        // Usa l'ID del database invece del sub di Auth0
        const userId = localStorage.getItem('userId'); // Assumendo che tu stia memorizzando l'ID del database nel localStorage
        setIsFollowing(profileData.data.followers.includes(userId));
      }
  
      const mangaData = await getUserManga(profileData.data._id);
      setUserManga(mangaData.data.filter(item => item.manga !== null));
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, authUser, authLoading, isAuthenticated]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);
console.log(profile);

  // ----- GESTIONE FOLLOW/UNFOLLOW -----
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      console.log("Devi essere autenticato per seguire/smettere di seguire");
      return;
    }
  
    try {
      const userId = localStorage.getItem('userId'); // Usa l'ID del database
      const response = isFollowing 
        ? await unfollowUser(profile._id)
        : await followUser(profile._id);
  
      if (response.data.success) {
        setIsFollowing(!isFollowing);
        setProfile(prev => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter(id => id !== userId)
            : [...prev.followers, userId]
        }));
      }
    } catch (error) {
      console.error("Errore nel seguire/smettere di seguire:", error);
    }
  };

  // ----- AGGIORNAMENTO PROFILO -----
  const handleProfileUpdate = async (updatedProfile) => {
    setProfile(updatedProfile);
    updateUserData(updatedProfile);
    setIsUpdateDialogOpen(false);
    await fetchProfileData();
  };

  // ----- RENDERING CONDIZIONALE -----
  if (isLoading || authLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-white">Profile not found</div>;
  }

  const isProfileOwner = isAuthenticated && authUser && authUser.sub === profile.authId;

  // ----- RENDERING PRINCIPALE -----
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white pb-20 md:pb-0 max-w-4xl mx-auto px-4"
    >
      {/* Sezione principale del profilo */}
      <ResponsiveProfile
        profile={profile}
        userManga={userManga}
        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
        handleFollowToggle={handleFollowToggle}
        isFollowing={isFollowing}
        isProfileOwner={isProfileOwner}
        isAuthenticated={isAuthenticated}
      />

      {/* Tabs per Manga e Panels */}
      <div className="flex justify-around border-t border-gray-700 mt-16 mb-2">
        <button
          className={`flex-1 py-4 ${activeSection === "manga" ? "border-t-2 border-white" : ""}`}
          onClick={() => setActiveSection("manga")}
        >
          Manga
        </button>
        <button
          className={`flex-1 py-4 ${activeSection === "panels" ? "border-t-2 border-white" : ""}`}
          onClick={() => setActiveSection("panels")}
        >
          Panels
        </button>
      </div>

      {/* Contenuto della sezione attiva */}
      {activeSection === "manga" ? (
        <MangaGrid manga={userManga} />
      ) : (
        <PanelGrid panels={profile.favoritePanels} />
      )}

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