import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Aggiungiamo useNavigate
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlinePlus, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import CreateMangaDialog from "../profile/CreateMangaDialog";
import CreatePanelDialog from "../profile/CreatePanelDialog";

const BottomNav = ({ userData, userManga, onNewContentCreated }) => {

  const navigate = useNavigate(); // Hook per la navigazione

  // Stati per gestire l'apertura dei dialoghi
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateMangaDialogOpen, setIsCreateMangaDialogOpen] = useState(false);
  const [isCreatePanelDialogOpen, setIsCreatePanelDialogOpen] = useState(false);

  // Funzione per gestire il click sul pulsante '+'
  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  // Funzione per chiudere il dialogo di scelta
  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  // Funzioni per gestire l'apertura dei dialoghi specifici
  const openCreateMangaDialog = () => {
    setIsCreateMangaDialogOpen(true);
    closeCreateDialog();
  };

  const openCreatePanelDialog = () => {
    setIsCreatePanelDialogOpen(true);
    closeCreateDialog();
  };

  // Gestori per la creazione di manga e pannelli
  const handleMangaCreation = (newManga) => {
    setIsCreateMangaDialogOpen(false);
    onNewContentCreated(); // Chiamiamo la funzione di callback
    navigate(`/manga/${newManga._id}`); // Navighiamo alla pagina del nuovo manga
  };


  const handlePanelCreation = (newPanel) => {
    setIsCreatePanelDialogOpen(false);
    onNewContentCreated(); // Chiamiamo la funzione di callback
    navigate(`/panel/${newPanel._id}`); // Navighiamo alla pagina del nuovo pannello
  };
  return (
    <>
      {/* Barra di navigazione mobile */}
      <nav className="md:hidden fixed -bottom-1 left-0 right-0 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg text-white p-4 border-t border-gray-700">
        <div className="flex justify-between items-center max-w-screen-sm mx-auto">
          <Link to="/home" className="text-2xl">
            <AiOutlineHome />
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateClick}
            className="bg-blue-500 rounded-full p-3 text-2xl shadow-lg"
          >
            <AiOutlinePlus />
          </motion.button>
          <Link to={`/profile/${userData?._id}`} className="text-2xl">
            <AiOutlineUser />
          </Link>
        </div>
      </nav>

      {/* Pulsante '+' per desktop */}
      <div className="hidden md:block fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateClick}
          className="bg-blue-500 text-white rounded-full p-4 text-3xl shadow-lg"
        >
          <AiOutlinePlus />
        </motion.button>
      </div>

      {/* Dialogo di scelta per la creazione */}
      <AnimatePresence>
        {isCreateDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeCreateDialog}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Cosa vuoi creare?</h2>
              <button
                onClick={openCreateMangaDialog}
                className="w-full bg-blue-500 text-white py-2 rounded mb-2"
              >
                Nuovo Manga
              </button>
              <button
                onClick={openCreatePanelDialog}
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                Nuovo Pannello
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialoghi per la creazione di manga e pannelli */}
      <CreateMangaDialog
        isOpen={isCreateMangaDialogOpen}
        closeModal={() => setIsCreateMangaDialogOpen(false)}
        onMangaCreation={handleMangaCreation}
      />
      <CreatePanelDialog
        isOpen={isCreatePanelDialogOpen}
        closeModal={() => setIsCreatePanelDialogOpen(false)}
        onPanelCreation={handlePanelCreation}
        userManga={userManga}
      />
    </>
  );
};

export default BottomNav;
