import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { getUserById } from "../services/api";
import { Link } from "react-router-dom";

export default function AllPanels() {

  const { user } = useAuth0();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          const profileData = await getUserById(userData.id);
          setProfile(profileData.data);
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching profile or manga:", error);
      }
    };
    fetchProfile();
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
  )
}
