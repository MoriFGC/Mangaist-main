import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import {
  getUserById,
  addMangaToCatalog,
  addFavoritePanel,
  addCharacter,
  getUserManga,
} from "../services/api";
import { Dialog } from "@headlessui/react";

const Profile = () => {
  const { user } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [isAddMangaModalOpen, setIsAddMangaModalOpen] = useState(false);
  const [isAddPanelModalOpen, setIsAddPanelModalOpen] = useState(false);
  const [isAddCharacterModalOpen, setIsAddCharacterModalOpen] = useState(false);
  const [userManga, setUserManga] = useState([]);
  const [userMangaList, setUserMangaList] = useState([]);

  const [newManga, setNewManga] = useState({
    title: "",
    author: "",
    description: "",
    status: "ongoing",
    volumes: 0,
    chapters: 0,
    genre: [],
    demographics: "",
    coverImage: null,
    publicationYear: "",
  });

  const [newPanel, setNewPanel] = useState({
    description: "",
    manga: "",
    chapterNumber: 0,
    volumeNumber: 0,
    panelImage: null,
  });

  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    image: null,
  });

  // get del profilo
  useEffect(() => {
    const fetchProfileAndManga = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          const profileData = await getUserById(userData.id);
          setProfile(profileData);

          const mangaData = await getUserManga(userData.id);
          setUserManga(mangaData.data);
          // Filtriamo i manga null prima di impostarli nello stato
          setUserMangaList(
            mangaData.data.filter((item) => item.manga !== null)
          );
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching profile or manga:", error);
      }
    };
    fetchProfileAndManga();
  }, []);

  // get del manga

  //post manga
  const handleAddManga = async (e) => {
    e.preventDefault();
    try {
      if (profile && profile.data._id) {
        const newMangaData = {
          ...newManga,
          publicationYear: new Date(newManga.publicationYear).getFullYear(),
          isDefault: false,
        };
        await addMangaToCatalog(profile.data._id, newMangaData);
        setIsAddMangaModalOpen(false);

        // Refresh manga data
        const updatedMangaData = await getUserManga(profile.data._id);
        setUserManga(updatedMangaData.data);

        // Reset the form
        setNewManga({
          title: "",
          author: "",
          description: "",
          status: "ongoing",
          volumes: 0,
          chapters: 0,
          genre: [],
          demographics: "",
          coverImage: null,
          publicationYear: "",
        });
      }
    } catch (error) {
      console.error("Error adding manga:", error);
      // You might want to show an error message to the user here
    }
  };

  //post pagina manga
  const handleAddPanel = async (e) => {
    e.preventDefault();
    try {
      if (profile && profile.data._id) {
        const formData = new FormData();
        Object.keys(newPanel).forEach((key) => {
          formData.append(key, newPanel[key]);
        });
        await addFavoritePanel(profile.data._id, formData);
        setIsAddPanelModalOpen(false);
        // Refresh profile data
        const updatedProfile = await getUserById(profile.data._id);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error adding panel:", error);
    }
  };

  // post personaggio
  const handleAddCharacter = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newCharacter).forEach((key) => {
        formData.append(key, newCharacter[key]);
      });
      // Note: You'll need to select a manga to add the character to
      const selectedMangaId = ""; // This should be set based on user selection
      await addCharacter(selectedMangaId, formData);
      setIsAddCharacterModalOpen(false);
      // Refresh profile data
      if (profile && profile.data._id) {
        const updatedProfile = await getUserById(profile.data._id);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  // gli handler
  const handleMangaInputChange = (e) => {
    const { name, value, type, files, selectedOptions } = e.target;
    if (type === "file") {
      setNewManga((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "genre") {
      const selectedGenres = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setNewManga((prev) => ({ ...prev, [name]: selectedGenres }));
    } else {
      setNewManga((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePanelInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewPanel((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleCharacterInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewCharacter((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  if (!profile) {
    return <div className="text-white">Loading...</div>;
  }

  const validUserMangaList = userMangaList.filter(item => item.manga !== null);
  console.log(userMangaList);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-white p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <img
          src={profile.profileImage || user?.picture}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <p>
          {profile.name} {profile.cognome}
        </p>
        <p>{profile.nickname}</p>
        <p>{profile.email}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">My Manga</h2>
        <button
          onClick={() => setIsAddMangaModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Manga
        </button>
        {userManga.map((manga, index) => (
          <div key={index} className="my-2">
            <img src={manga.manga?.coverImage} />
            <p>{manga.manga?.title}</p>
            <p>Status: {manga.readingStatus}</p>
            <p>Current Chapter: {manga.currentChapter}</p>
            <p>Current Volume: {manga.currentVolume}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Favorite Panels</h2>
        <button
          onClick={() => setIsAddPanelModalOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Panel
        </button>
        {profile.favoritePanels &&
          profile.favoritePanels.map((panel, index) => (
            <div key={index} className="my-2">
              <img
                src={panel.panelImage}
                alt="Panel"
                className="w-40 h-40 object-cover"
              />
              <p>{panel.description}</p>
              <p>Manga: {panel.manga?.title}</p>
              <p>Chapter: {panel.chapterNumber}</p>
              <p>Volume: {panel.volumeNumber}</p>
            </div>
          ))}
      </div>

      {/* Add Manga Modal */}
      <Dialog
        open={isAddMangaModalOpen}
        onClose={() => setIsAddMangaModalOpen(false)}
      >
        <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add New Manga
            </Dialog.Title>
            <form onSubmit={handleAddManga} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newManga.title}
                onChange={handleMangaInputChange}
                placeholder="Title"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="author"
                value={newManga.author}
                onChange={handleMangaInputChange}
                placeholder="Author"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newManga.description}
                onChange={handleMangaInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newManga.status}
                onChange={handleMangaInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="number"
                name="volumes"
                value={newManga.volumes}
                onChange={handleMangaInputChange}
                placeholder="Volumes"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="chapters"
                value={newManga.chapters}
                onChange={handleMangaInputChange}
                placeholder="Chapters"
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-600 mt-1">
                Hold Ctrl (Windows) or Command (Mac) to select multiple genres.
              </p>
              <select
                name="genre"
                multiple
                value={newManga.genre}
                onChange={handleMangaInputChange}
                className="w-full p-2 border rounded h-32"
              >
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Slice of Life">Slice of Life</option>
                <option value="Sports">Sports</option>
                <option value="Supernatural">Supernatural</option>
                <option value="Thriller">Thriller</option>
              </select>
              <select
                name="demographics"
                value={newManga.demographics}
                onChange={handleMangaInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Demographics</option>
                <option value="Shonen">Shonen</option>
                <option value="Seinen">Seinen</option>
                <option value="Shoujo">Shoujo</option>
                <option value="Josei">Josei</option>
              </select>
              <input
                type="date"
                name="publicationYear"
                value={newManga.publicationYear}
                onChange={handleMangaInputChange}
                placeholder="Publication Year"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="coverImage"
                onChange={handleMangaInputChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Manga
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Add Panel Modal */}
      <Dialog
        open={isAddPanelModalOpen}
        onClose={() => setIsAddPanelModalOpen(false)}
      >
        <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add New Panel
            </Dialog.Title>
            <form onSubmit={handleAddPanel} className="space-y-4">
              <input
                type="text"
                name="description"
                value={newPanel.description}
                onChange={handlePanelInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              {validUserMangaList.length > 0 ? (
                <select
                  name="manga"
                  value={newPanel.manga}
                  onChange={handlePanelInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a manga</option>
                  {validUserMangaList.map((item) => (
                    <option key={item.manga._id} value={item.manga._id}>
                      {item.manga.title}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500">
                  No valid manga in your collection. Please add a manga first.
                </p>
              )}
              <input
                type="number"
                name="chapterNumber"
                value={newPanel.chapterNumber}
                onChange={handlePanelInputChange}
                placeholder="Chapter Number"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="volumeNumber"
                value={newPanel.volumeNumber}
                onChange={handlePanelInputChange}
                placeholder="Volume Number"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="panelImage"
                onChange={handlePanelInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Panel
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Add Character Modal */}
      <Dialog
        open={isAddCharacterModalOpen}
        onClose={() => setIsAddCharacterModalOpen(false)}
      >
        <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add New Character
            </Dialog.Title>
            <form onSubmit={handleAddCharacter} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newCharacter.name}
                onChange={handleCharacterInputChange}
                placeholder="Character Name"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newCharacter.description}
                onChange={handleCharacterInputChange}
                placeholder="Character Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="image"
                onChange={handleCharacterInputChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                Add Character
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </Dialog>
    </motion.div>
  );
};

export default Profile;
