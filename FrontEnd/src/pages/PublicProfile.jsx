import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublicUserProfile } from '../services/api';

export default function PublicProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getPublicUserProfile(userId);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user) {
    return <div className="text-white">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-4">{user.name}'s Profile</h1>
      
      {/* Display user's manga */}
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Manga Collection</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {user.manga.map((mangaItem) => (
          <div key={mangaItem.manga._id} className="bg-gray-800 rounded-lg p-4">
            <img src={mangaItem.manga.coverImage} alt={mangaItem.manga.title} className="w-full h-48 object-cover rounded-lg mb-2" />
            <h3 className="text-white font-semibold">{mangaItem.manga.title}</h3>
          </div>
        ))}
      </div>

      {/* Display user's favorite panels */}
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Favorite Panels</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {user.favoritePanels.map((panel) => (
          <div key={panel._id} className="bg-gray-800 rounded-lg p-4">
            <img src={panel.panelImage} alt={`Panel from ${panel.manga?.title}`} className="w-full h-48 object-cover rounded-lg mb-2" />
            <p className="text-white">{panel.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}