// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getMangaById,
  getUserMangaProgress,
  updateUserMangaProgress,
} from "../services/api";
import AddCharacterForm from "../components/singleManga/AddCharacterForm";
import ProgressSelector from "../components/singleManga/ProgressSelector";
import UpdateMangaForm from "../components/singleManga/UpdateMangaForm";
import DeleteMangaButton from "../components/singleManga/DeleteMangaButton";
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

  const [isAddCharacterDialogOpen, setIsAddCharacterDialogOpen] =
    useState(false);
  const [isEditMangaDialogOpen, setIsEditMangaDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    const newProgress = {
      ...userProgress,
      [type === "chapters" ? "currentChapter" : "currentVolume"]: value,
    };

    // Determina il nuovo stato di lettura
    let newReadingStatus;
    if (newProgress.currentChapter === 0 && newProgress.currentVolume === 0) {
      newReadingStatus = "to-read";
    } else if (
      newProgress.currentChapter >= manga.chapters ||
      newProgress.currentVolume >= manga.volumes
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
          <div className="md:w-2/3 p-8 relative">
            {isOwner && (
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-white p-2 rounded border border-transparent hover:border-red-500 hover:text-red-600 transition duration-300"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => setIsEditMangaDialogOpen(true)}
                  className="border border-transparent text-white p-2 rounded hover:border-white transition duration-300"
                  title="Edit Manga"
                >
                  <FaEdit size={20} />
                </button>
              </div>
            )}

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
                  className="inline-block bg-button-bg rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2"
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Characters</h2>
          {isOwner && (
            <button
              onClick={() => setIsAddCharacterDialogOpen(true)}
              className=" text-white px-4 py-2 rounded-lg border border-transparent hover:border-white transition duration-300 flex items-center"
            >
              <FaUserPlus className="mr-2 w-10" /> Add Character
            </button>
          )}
        </div>
        <InfiniteCharacterScroll characters={manga.characters} />
      </motion.div>
      {/* Reading Progress section */}
      {(isCurrentUser || (manga.isDefault && isInUserCollection)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Reading Progress
          </h2>
          <ProgressSelector
            current={{
              chapters: userProgress.currentChapter,
              volumes: userProgress.currentVolume,
            }}
            max={{
              chapters: manga.chapters,
              volumes: manga.volumes,
            }}
            onChange={(type, value) => handleProgressChange(type, value)}
          />
        </motion.div>
      )}

      {/* Dialog per aggiungere un personaggio */}
      <AddCharacterForm
        mangaId={manga._id}
        isOpen={isAddCharacterDialogOpen}
        onClose={() => setIsAddCharacterDialogOpen(false)}
        onCharacterAdded={() => {
          handleCharacterAdded();
          setIsAddCharacterDialogOpen(false);
        }}
      />

      {/* Dialog per modificare il manga */}
      <UpdateMangaForm
        manga={manga}
        isOpen={isEditMangaDialogOpen}
        onClose={() => setIsEditMangaDialogOpen(false)}
        onUpdate={(updatedManga) => {
          handleMangaUpdate(updatedManga);
          setIsEditMangaDialogOpen(false);
        }}
      />

      <DeleteMangaButton
        userId={userId}
        mangaId={manga._id}
        isDefault={manga.isDefault}
        onDelete={handleMangaDelete}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
