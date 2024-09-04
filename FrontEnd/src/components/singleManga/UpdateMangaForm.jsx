import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { updateManga, updateMangaCoverImage } from '../../services/api';
import { FaTimes } from "react-icons/fa";

const UpdateMangaForm = ({ manga, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: manga.title,
    author: manga.author,
    description: manga.description,
    status: manga.status,
    volumes: manga.volumes,
    chapters: manga.chapters,
    genre: manga.genre,
    demographics: manga.demographics,
    publicationYear: manga.publicationYear
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(manga.coverImage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    const { options } = e.target;
    const selectedGenres = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, genre: selectedGenres }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedManga = await updateManga(manga._id, formData);
      if (coverImage) {
        const imageFormData = new FormData();
        imageFormData.append('coverImage', coverImage);
        await updateMangaCoverImage(manga._id, imageFormData);
      }
      onUpdate(updatedManga.data);
      onClose();
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
          <DialogTitle as="h3" className="text-2xl font-bold text-white mb-4">
            Update Manga
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-white/40"
          >
            <FaTimes size={24} />
          </button>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-white mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg scrollbar-thin"
                ></textarea>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-white mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="demographics" className="block text-sm font-medium text-white mb-1">Demographics</label>
                <select
                  id="demographics"
                  name="demographics"
                  value={formData.demographics}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                >
                  <option value="Shonen">Shonen</option>
                  <option value="Seinen">Seinen</option>
                  <option value="Shoujo">Shoujo</option>
                  <option value="Josei">Josei</option>
                </select>
              </div>
              <div>
                <label htmlFor="volumes" className="block text-sm font-medium text-white mb-1">Volumes</label>
                <input
                  type="number"
                  id="volumes"
                  name="volumes"
                  value={formData.volumes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
              </div>
              <div>
                <label htmlFor="chapters" className="block text-sm font-medium text-white mb-1">Chapters</label>
                <input
                  type="number"
                  id="chapters"
                  name="chapters"
                  value={formData.chapters}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
              </div>
              <div>
                <label htmlFor="publicationYear" className="block text-sm font-medium text-white mb-1">Publication Year</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="genre" className="block text-sm font-medium text-white mb-1">Genre</label>
                <select
                  multiple
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleGenreChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg scrollbar-thin"
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
              </div>
              <div className="md:col-span-2">
                <label htmlFor="coverImage" className="block text-sm font-medium text-white mb-1">Cover Image</label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white  text-white bg-button-bg"
                />
                {previewImage && (
                  <img src={previewImage} alt="Cover preview" className="mt-2 w-32 h-48 object-cover rounded" />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold  bg-white text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Update Manga
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UpdateMangaForm;