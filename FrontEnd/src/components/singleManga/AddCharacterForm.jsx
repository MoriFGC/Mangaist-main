import React, { useState } from "react";
import { motion } from "framer-motion";
import { addCharacter } from "../../services/api";

const AddCharacterForm = ({ mangaId, onCharacterAdded }) => {
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
      
      // Log del contenuto di FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const response = await addCharacter(mangaId, formData);
      console.log('Response:', response);
      setNewCharacter({ name: "", description: "", image: null });
      onCharacterAdded();
    } catch (error) {
      console.error("Error adding character:", error.response ? error.response.data : error.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Add New Character</h2>
      <form
        onSubmit={handleAddCharacter}
        className="bg-gray-700 rounded-lg p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-white mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={newCharacter.name}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, name: e.target.value })
            }
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={newCharacter.description}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, description: e.target.value })
            }
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-white mb-2">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image" // Aggiungi questo attributo name
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, image: e.target.files[0] })
            }
            className="w-full px-3 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Character
        </button>
      </form>
    </motion.div>
  );
};

export default AddCharacterForm;
