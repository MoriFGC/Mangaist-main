import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";

export default function AllManga() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Manga Collection</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {userManga.map((manga, index) => (
          <motion.div
            key={manga.manga._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={`/manga/${manga.manga._id}`} className="block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={manga.manga.coverImage}
                  alt={manga.manga.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white truncate">{manga.manga.title}</h2>
                  <p className="text-sm text-gray-400">{manga.manga.author}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}