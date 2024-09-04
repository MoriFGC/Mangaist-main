import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { removeMangaFromUserCatalog, deleteManga } from '../../services/api';

const DeleteMangaButton = ({ userId, mangaId, isDefault, onDelete, isOpen, onClose }) => {
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      if (isDefault) {
        await removeMangaFromUserCatalog(userId, mangaId);
      } else {
        const response = await deleteManga(mangaId);
        console.log(response.data);
      }
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error removing manga:', error);
      setError(error.response?.data?.message || 'Failed to remove manga. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg bg-black p-6 text-white border border-white/20">
          <DialogTitle className="text-lg font-medium mb-4">Confirm Deletion</DialogTitle>
          <p className="mb-4">Are you sure you want to remove this manga from your catalog?</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-button-bg rounded hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteMangaButton;