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
import InfiniteCharacterScroll from "../components/singleManga/InfiniteCharacterScroll";

export default function SingleManga() {
  // Estrae l'ID del manga dall'URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Stati per gestire i dati del manga e il progresso dell'utente
  const [manga, setManga] = useState(null);
  const [userProgress, setUserProgress] = useState({
    currentChapter: 0,
    currentVolume: 0,
    readingStatus: "to-read",
  });

  // Altri stati per gestire vari aspetti del componente
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Nuovo stato per tracciare se il manga è nella collezione dell'utente
  const [isInUserCollection, setIsInUserCollection] = useState(false);


  // Effetto per caricare i dati del manga e il progresso dell'utente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          setUserId(userData.id);

          const mangaResponse = await getMangaById(id);
          setManga(mangaResponse.data);

          setIsCurrentUser(userData.id === mangaResponse.data.createdBy);
          setIsOwner(userData.id === mangaResponse.data.createdBy);

          // Verifica se il manga è nella collezione dell'utente
          const userMangaResponse = await getUserMangaProgress(userData.id, id);
          setIsInUserCollection(!!userMangaResponse.data);

          if (userMangaResponse.data) {
            setUserProgress({
              currentChapter: userMangaResponse.data.currentChapter || 0,
              currentVolume: userMangaResponse.data.currentVolume || 0,
              readingStatus: userMangaResponse.data.readingStatus || "to-read",
            });
          } else {
            setUserProgress({
              currentChapter: 0,
              currentVolume: 0,
              readingStatus: "to-read",
            });
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
  }, [id]);

  // Gestore per l'aggiornamento del progresso di lettura
  const handleProgressChange = async (type, value) => {
    const newProgress = { ...userProgress, [type]: value };

    // Determina il nuovo stato di lettura
    let newReadingStatus;
    if (
      value === 0 &&
      (type === "currentChapter"
        ? userProgress.currentVolume
        : newProgress.currentVolume) === 0
    ) {
      newReadingStatus = "to-read";
    } else if (
      value >= manga.chapters ||
      (type === "currentVolume" && value >= manga.volumes)
    ) {
      newReadingStatus = "completed";
    } else {
      newReadingStatus = "reading";
    }

    const updatedProgress = { ...newProgress, readingStatus: newReadingStatus };

    setUserProgress(updatedProgress);
    try {
      await updateUserMangaProgress(userId, manga._id, updatedProgress);
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
        className="rounded-lg overflow-hidden shadow-lg "
      >
        <div className="md:flex">
          {/* Immagine del manga */}
          <div className="md:w-1/3">
            <img
              className="w-full h-full object-contain"
              src={manga.coverImage}
              alt={manga.title}
            />
          </div>

          {/* Dettagli del manga */}
          <div className="md:w-2/3 p-8">
            {/* Titolo e autore */}
            <h1 className="text-3xl font-bold text-white mb-2">
              {manga.title}
            </h1>
            <p className="text-xl text-gray-400 mb-4">by {manga.author}</p>

            {/* Descrizione */}
            <p className="text-white mb-6">{manga.description}</p>

            {/* Informazioni aggiuntive */}
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <span className="font-semibold">Demographics:</span>{" "}
                {manga.demographics}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {manga.status}
              </div>
              <div>
                <span className="font-semibold">Volumes:</span> {manga.volumes}
              </div>
              <div>
                <span className="font-semibold">Chapters:</span>{" "}
                {manga.chapters}
              </div>
              <div>
                <span className="font-semibold">Publication Year:</span>{" "}
                {manga.publicationYear}
              </div>
            </div>

            {/* Generi */}
            <div className="mt-6">
              {manga.genre.map((genre, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sezione dei personaggi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Characters</h2>
        <InfiniteCharacterScroll characters={manga.characters} />
      </motion.div>
      
      {/* Reading Progress section */}
      {/* Reading Progress section */}
      {(isCurrentUser || (manga.isDefault && isInUserCollection)) && (
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
