import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { addCharacter } from "../../services/api";
import { FaTimes } from "react-icons/fa";

const AddCharacterForm = ({ mangaId, isOpen, onClose, onCharacterAdded }) => {
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    image: null,
  });

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCharacter.name);
      formData.append('description', newCharacter.description);
      if (newCharacter.image) {
        formData.append('image', newCharacter.image, newCharacter.image.name);
      }
      
      const response = await addCharacter(mangaId, formData);
      console.log('Response:', response);
      setNewCharacter({ name: "", description: "", image: null });
      onCharacterAdded();
      onClose();
    } catch (error) {
      console.error("Error adding character:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black  p-6 text-left align-middle shadow-xl transition-all">
          <DialogTitle as="h3" className="text-lg font-medium leading-6 text-white mb-4">
            Add New Character
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-white/40"
          >
            <FaTimes />
          </button>
          <form onSubmit={handleAddCharacter}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                className="w-full px-3 py-2 text-white border border-transparent rounded-lg focus:outline-none focus:border-white bg-button-bg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                className="w-full px-3 py-2 text-white border border-transparent rounded-lg focus:outline-none focus:border-white bg-button-bg"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-white mb-2 ">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={(e) => setNewCharacter({ ...newCharacter, image: e.target.files[0] })}
                className="w-full px-3 py-2 text-white"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="border bg-white text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out font-bold py-2 px-4 rounded"
              >
                Add Character
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddCharacterForm;