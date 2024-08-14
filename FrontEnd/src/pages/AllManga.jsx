import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserManga } from "../services/api";
import { Link } from "react-router-dom";

export default function AllManga() {
  const { userId } = useParams();
  const [userManga, setUserManga] = useState([]);
console.log(userId);
  useEffect(() => {
    const fetchManga = async () => {
      try {
        const mangaData = await getUserManga(userId);
        setUserManga(mangaData.data);
      } catch (error) {
        console.error("Error fetching manga:", error);
      }
    };
    fetchManga();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manga Collection</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {userManga.map((manga) => (
          <Link to={`/manga/${manga._id}`} key={manga._id} className="block">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white truncate">{manga.title}</h2>
                <p className="text-sm text-gray-400">{manga.author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}