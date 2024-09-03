import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaRegComment, FaPaperPlane } from "react-icons/fa";
import { commentPanel } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const DesktopCommentsDialog = ({
  isOpen,
  closeDialog,
  panel,
  handleLike,
  refreshPanel,
}) => {
  const [newComment, setNewComment] = useState("");
  const [localPanel, setLocalPanel] = useState(panel);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    setLocalPanel(panel);
  }, [panel]);

  if (!localPanel) return null;

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentPanel(localPanel._id, { text: newComment });
      setNewComment("");
      refreshPanel();
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
    }
  };

  const handleLocalLike = async () => {
    try {
      const updatedPanel = await handleLike(localPanel._id);
      setLocalPanel(updatedPanel);
    } catch (error) {
      console.error("Errore nell'aggiornamento del like:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 " aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 ">
        <Dialog.Panel className="w-full max-w-6xl h-[80vh] flex bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700">
          {/* Sezione immagine */}
          <div className="w-1/2 bg-black flex items-center justify-center p-4">
            <img
              src={localPanel.panelImage}
              alt="Panel"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Sezione commenti e dettagli */}
          <div className="w-1/2 flex flex-col overflow-hidden border-l border-gray-700">
            {/* Header con informazioni utente */}
            <div className="p-4 border-b border-gray-700">
              <Link
                to={`/profile/${localPanel.user._id}`}
                className="flex items-center mb-2"
              >
                <img
                  src={localPanel.user.profileImage || "/placeholder-avatar.jpg"}
                  alt={`${localPanel.user.name}'s Avatar`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="font-bold text-white">{localPanel.user.name}</h2>
                  <p className="text-gray-400">@{localPanel.user.nickname}</p>
                </div>
              </Link>
              <p className="text-white mt-2">{localPanel.description}</p>
              <p className="text-gray-400 mt-2">
                From {localPanel.manga?.title}, Chapter {localPanel.chapterNumber}
              </p>
            </div>

            {/* Pulsanti di interazione */}
            <div className="flex justify-around p-4 border-b border-gray-700">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLocalLike}
                className="flex items-center group"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={localPanel.likes.includes(userData.id) ? "liked" : "unliked"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {localPanel.likes.includes(userData.id) ? (
                      <FaHeart className="mr-2 text-red-500" />
                    ) : (
                      <FaRegHeart className="mr-2 text-white group-hover:text-red-500" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className="text-white">{localPanel.likes.length}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center text-white group"
              >
                <FaRegComment className="mr-2 group-hover:text-blue-500" />
                <span>{localPanel.comments.length}</span>
              </motion.button>
            </div>

            {/* Lista commenti */}
            <div className="flex-grow overflow-y-auto scrollbar-thin">
              <CommentList panel={localPanel} />
            </div>

            {/* Form per aggiungere un commento */}
            <form
              onSubmit={handleSubmitComment}
              className="p-4 border-t border-gray-700 flex items-center relative"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 bg-black rounded-l text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="hover:text-blue-500 text-white p-3 rounded-r absolute end-5"
              >
                <FaPaperPlane />
              </motion.button>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DesktopCommentsDialog;