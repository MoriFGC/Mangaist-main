// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getMangaById,
  getUserMangaProgress,
  updateUserMangaProgress,
} from "../services/api";
import AddCharacterForm from "../components/singleManga/AddCharacterForm";
import ProgressSelector from "../components/singleManga/ProgressSelector";
import UpdateMangaForm from "../components/singleManga/UpdateMangaForm";
import DeleteMangaButton from "../components/singleManga/DeleteMangaButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function SingleManga() {
  // Estrae l'ID del manga dall'URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Stati per gestire i dati del manga e il progresso dell'utente
  const [manga, setManga] = useState(null);
  const [userProgress, setUserProgress] = useState({
    currentChapter: 0,
    currentVolume: 0,
  });
  
  // Altri stati per gestire vari aspetti del componente
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Effetto per caricare i dati del manga e il progresso dell'utente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          setUserId(userData.id);
          
          // PROBLEMA: Questa comparazione non è corretta
          // setIsCurrentUser(userData.id === id);
          // Il 'id' qui è l'ID del manga, non l'ID dell'utente
          // Dovremmo confrontare con l'ID del creatore del manga

          const mangaResponse = await getMangaById(id);
          setManga(mangaResponse.data);

          // CORREZIONE: Confrontiamo l'ID dell'utente con l'ID del creatore del manga
          setIsCurrentUser(userData.id === mangaResponse.data.createdBy);
          setIsOwner(userData.id === mangaResponse.data.createdBy);

          // Recuperiamo il progresso solo se l'utente è il proprietario
          if (userData.id === mangaResponse.data.createdBy) {
            try {
              const progressResponse = await getUserMangaProgress(
                userData.id,
                id
              );
              if (progressResponse.data) {
                setUserProgress({
                  currentChapter: progressResponse.data.currentChapter || 0,
                  currentVolume: progressResponse.data.currentVolume || 0,
                });
              }
            } catch (progressError) {
              console.log("User progress not found, setting default values");
              setUserProgress({
                currentChapter: 0,
                currentVolume: 0,
              });
            }
          }
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching manga data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]); // Rimuoviamo isCurrentUser dalle dipendenze per evitare loop
  // Gestore per l'aggiornamento del progresso di lettura
  const handleProgressChange = async (type, value) => {
    const newProgress = { ...userProgress, [type]: value };
    setUserProgress(newProgress);
    try {
      await updateUserMangaProgress(userId, manga._id, newProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Gestore per l'aggiornamento dei dati del manga
  const handleMangaUpdate = (updatedManga) => {
    setManga(updatedManga);
    setIsEditing(false);
  };

  // Gestore per l'eliminazione del manga
  const handleMangaDelete = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    navigate(`/profile/${userData.id}`);
  };

  // Gestore per l'aggiunta di un nuovo personaggio
  const handleCharacterAdded = async () => {
    const response = await getMangaById(id);
    setManga(response.data);
  };

  // Mostra un indicatore di caricamento mentre i dati vengono recuperati
  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  // Se il manga non è stato trovato, mostra un messaggio
  if (!manga) {
    return <div className="text-white">Manga not found</div>;
  }

  console.log(isCurrentUser);
  // Rendering del componente

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
            <img
              className="h-48 w-full object-cover md:w-48"
              src={manga.coverImage}
              alt={manga.title}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {manga.demographics}
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-white">
              {manga.title}
            </h1>
            <p className="mt-2 text-gray-400">By {manga.author}</p>
            <p className="mt-2 text-white">{manga.description}</p>
            <div className="mt-4">
              <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                {manga.status}
              </span>
              {manga.genre.map((genre, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-white">Volumes: {manga.volumes}</p>
              <p className="text-white">Chapters: {manga.chapters}</p>
              <p className="text-white">
                Publication Year: {manga.publicationYear}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reading Progress section */}
      {isCurrentUser ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-gray-700 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Reading Progress
          </h2>
          <ProgressSelector
            label="Chapters Read"
            current={userProgress.currentChapter}
            max={manga.chapters}
            onChange={(value) => handleProgressChange("currentChapter", value)}
          />
          <ProgressSelector
            label="Volumes Read"
            current={userProgress.currentVolume}
            max={manga.volumes}
            onChange={(value) => handleProgressChange("currentVolume", value)}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-gray-700 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Owner's Reading Progress
          </h2>
          <p className="text-white">
            Chapters Read: {userProgress.currentChapter} / {manga.chapters}
          </p>
          <p className="text-white">
            Volumes Read: {userProgress.currentVolume} / {manga.volumes}
          </p>
        </motion.div>
      )}

      {isOwner && (
        <>
          {isEditing ? (
            <UpdateMangaForm
              manga={manga}
              onUpdate={handleMangaUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Edit Manga
            </button>
          )}

          <DeleteMangaButton
            userId={userId}
            mangaId={manga._id}
            onDelete={handleMangaDelete}
          />

          <AddCharacterForm
            mangaId={manga._id}
            onCharacterAdded={handleCharacterAdded}
          />
        </>
      )}
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
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">
                  {character.name}
                </h3>
                <p className="text-sm text-gray-400">{character.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
