// src/components/MobileCommentsSheet.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CommentList from './CommentList';
import { commentPanel } from '../../services/api';
import { FaPaperPlane } from 'react-icons/fa';

const MobileCommentsSheet = ({ isOpen, closeSheet, panel, refreshPanel }) => {
  const [newComment, setNewComment] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentPanel(panel._id, { text: newComment });
      setNewComment('');
      refreshPanel();
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-button-bg rounded-t-3xl shadow-lg h-[80vh] flex flex-col"
    >
      {/* Header fisso */}
      <div className="sticky top-0 bg-button-bg z-10 p-4">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-4 text-white text-center ">Comments</h3>
      </div>

      {/* Lista dei commenti scrollabile */}
      <div className="flex-grow overflow-y-auto px-4">
        <CommentList panel={panel} />
      </div>

      {/* Form per aggiungere un nuovo commento */}
      <form onSubmit={handleSubmitComment} className="sticky bottom-0 bg-button-bg p-4 flex items-center">
        <img
          src={userData?.profileImage || "/placeholder-avatar.jpg"}
          alt="Profile"
          className="w-8 h-8 rounded-full mr-2"
        />
        <div className="flex-grow relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Aggiungi un commento..."
            className="w-full p-2 pr-10 rounded-full bg-black text-white"
          />
          {newComment && (
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            >
              <FaPaperPlane />
            </button>
          )}
        </div>
      </form>

      {/* Pulsante di chiusura */}
      <button
        onClick={closeSheet}
        className="p-4 text-red-500/80 font-semibold"
      >
        Close
      </button>
    </motion.div>
  );
};

export default MobileCommentsSheet;