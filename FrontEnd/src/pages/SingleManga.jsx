import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMangaById, getUserMangaProgress } from '../services/api';
import AddCharacterForm from '../components/singleManga/AddCharacterForm';
import ProgressSelector from '../components/singleManga/ProgressSelector';
import UpdateMangaForm from '../components/singleManga/UpdateMangaForm';
import DeleteMangaButton from '../components/singleManga/DeleteMangaButton';

export default function SingleManga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [userProgress, setUserProgress] = useState({ currentChapter: 0, currentVolume: 0 });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.id) {
          setUserId(userData.id);
          
          const mangaResponse = await getMangaById(id);
          setManga(mangaResponse.data);

          const progressResponse = await getUserMangaProgress(userData.id, id);
          if (progressResponse.data) {
            setUserProgress({
              currentChapter: progressResponse.data.currentChapter || 0,
              currentVolume: progressResponse.data.currentVolume || 0
            });
          }

          console.log(userProgress);
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleMangaUpdate = (updatedManga) => {
    setManga(updatedManga);
  };

  const handleMangaDelete = () => {
    navigate('/profile');
  };

  const handleCharacterAdded = async () => {
    const response = await getMangaById(id);
    setManga(response.data);
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!manga) {
    return <div className="text-white">Manga not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      >
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={manga.coverImage} alt={manga.title} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{manga.demographics}</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-white">{manga.title}</h1>
            <p className="mt-2 text-gray-400">By {manga.author}</p>
            <p className="mt-2 text-white">{manga.description}</p>
            <div className="mt-4">
              <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                {manga.status}
              </span>
              {manga.genre.map((genre, index) => (
                <span key={index} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-white">Volumes: {manga.volumes}</p>
              <p className="text-white">Chapters: {manga.chapters}</p>
              <p className="text-white">Publication Year: {manga.publicationYear}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reading Progress section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 bg-gray-700 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Reading Progress</h2>
        <ProgressSelector 
          label="Current Chapter"
          current={userProgress.currentChapter}
          max={manga.chapters}
          onChange={(value) => setUserProgress(prev => ({ ...prev, currentChapter: value }))}
        />
        <ProgressSelector 
          label="Current Volume"
          current={userProgress.currentVolume}
          max={manga.volumes}
          onChange={(value) => setUserProgress(prev => ({ ...prev, currentVolume: value }))}
        />
      </motion.div>

            {/* Update Manga Form */}
            <UpdateMangaForm 
        manga={manga}
        onUpdate={handleMangaUpdate}
      />

      {/* Delete Manga Button */}
      <DeleteMangaButton 
        userId={userId}
        mangaId={manga._id}
        onDelete={handleMangaDelete}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Characters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {manga.characters.map((character, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 rounded-lg overflow-hidden shadow-lg"
            >
              <img src={character.image} alt={character.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{character.name}</h3>
                <p className="text-sm text-gray-400">{character.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AddCharacterForm mangaId={manga._id} onCharacterAdded={handleCharacterAdded} />
    </div>
  );
}