import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserManga } from "../services/api";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaBookOpen, FaBook } from "react-icons/fa";

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


  const renderReadingStatusIcon = (manga) => {
    switch (manga.readingStatus) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" title="Completed" />;
      case 'reading':
        return <FaBookOpen className="text-blue-500" title="Reading" />;
      case 'to-read':
        return <FaBook className="text-gray-500" title="To Read" />;
      default:
        return null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manga Collection</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {userManga.map((mangaItem) => (
    <Link to={`/manga/${mangaItem._id}`} key={mangaItem._id} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
        <img
          src={mangaItem.coverImage}
          alt={mangaItem.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2">
          {renderReadingStatusIcon(mangaItem)}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white truncate">{mangaItem.title}</h2>
          <p className="text-sm text-gray-400">{mangaItem.author}</p>
          <p className="text-xs text-gray-500">
            Chapter: {mangaItem.currentChapter} / Volume: {mangaItem.currentVolume}
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
    </div>
  );
}