import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);

  useEffect(() => {
    const fetchProfileAndManga = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          const profileData = await getUserById(userData.id);
          setProfile(profileData.data);

          const mangaData = await getUserManga(userData.id);
          setUserManga(mangaData.data.filter((item) => item.manga !== null));
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching profile or manga:", error);
      }
    };
    fetchProfileAndManga();
  }, []);

  if (!profile) {
    return <div className="text-white">Loading...</div>;
  }

 

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
          src={profile.profileImage || user?.picture}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <p className="text-lg">
          {profile.name} {profile.cognome}
        </p>
        <p className="text-gray-400">{profile.nickname}</p>
        <p className="text-gray-400">{profile.email}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Manga</h2>
          <Link to="/all-manga" className="text-blue-500 hover:underline">
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
              <Link to={`/manga/${manga.manga._id}`}>
                <img
                  src={manga.manga.coverImage}
                  alt={manga.manga.title}
                  className="w-full h-56 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-semibold text-center">{manga.manga.title}</p>
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
    </motion.div>
  );
};

export default Profile;