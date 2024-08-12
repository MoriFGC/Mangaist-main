import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllUsers } from "../services/api";
import { FaLock } from "react-icons/fa";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("Users data:", response.data); // Aggiungi questo
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manga Enthusiasts</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {users.map((user) => (
          <motion.div
            key={user._id}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <Link to={`/user/${user._id}`}>
              <img
                src={user.profileImage}
                alt={`${user.name}'s avatar`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.jpg";
                }}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white truncate">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-400">@{user.nickname}</p>
                {user.profilePublic ? (
                  <>
                    <p className="text-sm text-gray-400 mt-2">
                      Manga: {user.manga}
                    </p>
                    <p className="text-sm text-gray-400">
                      Panels: {user.favoritePanels}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <FaLock className="mr-1" />
                    Private Profile
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
