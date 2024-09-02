// src/components/DesktopCommentsDialog.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { commentPanel } from "../../services/api";

const DesktopCommentsDialog = ({
  isOpen,
  closeDialog,
  panel,
  handleLike,
  refreshPanel,
}) => {
  const [newComment, setNewComment] = useState("");

  if (!panel) {
    return null;
  }

  // Ottieni l'ID dell'utente corrente dal localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentPanel(panel._id, { text: newComment });
      setNewComment(""); // Pulisce l'input dopo l'invio
      refreshPanel(); // Aggiorna il pannello per mostrare il nuovo commento
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-6xl h-[80vh] flex bg-black rounded-lg overflow-hidden">
          {/* Sezione immagine */}
          <div className="w-7/12 h-full bg-black flex items-center justify-center overflow-hidden">
            <img
              src={panel.panelImage}
              alt="Panel"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sezione commenti */}
          <div className="w-5/12 h-full flex flex-col">
            {/* Header con informazioni utente e descrizione */}
            <div className="p-4 border-b border-gray-700">
              <Link
                to={`/profile/${panel.user._id}`}
                className="font-semibold text-white hover:underline flex items-center mb-2"
              >
                <img
                  src={panel.user.profileImage || "/placeholder-avatar.jpg"}
                  alt={`${panel.user.name}'s avatar`}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold">{panel.user.nickname}</span>
              </Link>
              <p className="text-white ms-10">{panel.description}</p>
            </div>

            {/* Lista commenti */}
            <div className="flex-grow overflow-y-auto">
              <CommentList panel={panel} />
            </div>

            {/* Footer con like e form per nuovo commento */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center mb-4">
                <button onClick={() => handleLike(panel._id)} className="mr-4">
                  {panel.likes.includes(userData.id) ? (
                    <FaHeart className="text-red-500 text-2xl" />
                  ) : (
                    <FaRegHeart className="text-white text-2xl" />
                  )}
                </button>
                <p className="font-bold text-white">{panel.likes.length} likes</p>
              </div>

              {/* Form per aggiungere un nuovo commento */}
              <form
                onSubmit={handleSubmitComment}
                className="flex gap-1"
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Aggiungi un commento..."
                  className="w-full rounded bg-black text-white"
                />
                <button
                  type="submit"
                  className="p-4 bg-black text-white rounded border border-white/50 hover:bg-blue-600 hover:border-black transition-all duration-300 ease-linear"
                >
                  <FaRegComment />
                </button>
              </form>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DesktopCommentsDialog;