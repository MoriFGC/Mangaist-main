import React, { useState } from 'react';
import { updateManga, updateMangaCoverImage } from '../../services/api';

const UpdateMangaForm = ({ manga, onUpdate }) => {
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
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedManga = await updateManga(manga._id, formData);
      if (coverImage) {
        const formData = new FormData();
        formData.append('coverImage', coverImage);
        await updateMangaCoverImage(manga._id, formData);
      }
      onUpdate(updatedManga.data);
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Update Manga</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-white mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-white mb-2">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-white mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white h-32"
          ></textarea>
        </div>

        <div>
          <label htmlFor="status" className="block text-white mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="demographics" className="block text-white mb-2">Demographics</label>
          <select
            id="demographics"
            name="demographics"
            value={formData.demographics}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="Shonen">Shonen</option>
            <option value="Seinen">Seinen</option>
            <option value="Shoujo">Shoujo</option>
            <option value="Josei">Josei</option>
          </select>
        </div>

        <div>
          <label htmlFor="volumes" className="block text-white mb-2">Volumes</label>
          <input
            type="number"
            id="volumes"
            name="volumes"
            value={formData.volumes}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label htmlFor="chapters" className="block text-white mb-2">Chapters</label>
          <input
            type="number"
            id="chapters"
            name="chapters"
            value={formData.chapters}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label htmlFor="publicationYear" className="block text-white mb-2">Publication Year</label>
          <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-white mb-2">Genre</label>
          <select
            multiple
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleGenreChange}
            className="w-full p-2 rounded bg-gray-700 text-white h-32"
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

        <div>
          <label htmlFor="coverImage" className="block text-white mb-2">Cover Image</label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleImageChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
      </div>

      <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Manga
      </button>
    </form>
  );
};

export default UpdateMangaForm;