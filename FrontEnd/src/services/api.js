import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const api = axios.create({ baseURL: API_URL });

// Interceptor to add the authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth routes
export const auth0Callback = async (tokenData) => {
  const response = await api.post('/auth/auth0-callback', tokenData);
  localStorage.setItem("token", response.data.token);
  return response.data.user;
};

export const getPublicUserProfile = (userId) => api.get(`/users/public/${userId}`);

// User routes
export const getAllUsers = () => api.get('/users/public');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserProfile = (userId, userData) => api.patch(`/users/${userId}`, userData);
export const updateUserProfileImage = (userId, imageData) => {
  return api.patch(`/users/${userId}/profileImage`, imageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Manga routes
export const getAllManga = () => api.get('/manga');
export const getMangaById = (id) => api.get(`/manga/${id}`);
export const createManga = (mangaData) => api.post('/manga', mangaData);
export const updateManga = (id, mangaData) => api.patch(`/manga/${id}`, mangaData);
export const deleteManga = (id) => api.delete(`/manga/${id}`);
export const updateMangaCoverImage = (id, imageData) => api.patch(`/manga/${id}/coverImage`, imageData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// User's manga catalog routes
export const getUserManga = (userId) => api.get(`/users/${userId}/manga`);
export const addMangaToCatalog = (userId, mangaData) => {
  const formData = new FormData();
  Object.keys(mangaData).forEach(key => {
    if (key === 'genre') {
      mangaData[key].forEach(genre => formData.append('genre[]', genre));
    } else if (key === 'coverImage' && mangaData[key]) {
      formData.append(key, mangaData[key], mangaData[key].name);
    } else {
      formData.append(key, mangaData[key]);
    }
  });
  return api.post(`/users/${userId}/manga`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const removeMangaFromUserCatalog = (userId, mangaId) => api.delete(`/users/${userId}/manga/${mangaId}`);
export const getUserMangaProgress = async (userId, mangaId) => {
  try {
    const response = await api.get(`/users/${userId}/manga/${mangaId}`);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Se il manga non è trovato per l'utente, restituiamo un oggetto con valori predefiniti
      return { data: { currentChapter: 0, currentVolume: 0 } };
    }
    console.error('Error fetching user manga progress:', error);
    return { data: { currentChapter: 0, currentVolume: 0 } };
  }
};

export const updateUserMangaProgress = async (userId, mangaId, progressData) => {
  try {
    const response = await api.patch(`/users/${userId}/manga/${mangaId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating manga progress:', error);
    throw error;
  }
};
// Character routes
export const addCharacter = (mangaId, characterData) => {
  return api.post(`/manga/${mangaId}/characters`, characterData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateCharacter = (mangaId, characterId, characterData) => api.patch(`/manga/${mangaId}/characters/${characterId}`, characterData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Favorite panels routes
export const addFavoritePanel = (userId, panelData) => api.post(`/users/${userId}/favoritePanels`, panelData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateFavoritePanel = (userId, panelId, panelData) => api.patch(`/users/${userId}/favoritePanels/${panelId}`, panelData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteFavoritePanel = (userId, panelId) => api.delete(`/users/${userId}/favoritePanels/${panelId}`);
export const getPanelById = (userId, panelId) => api.get(`/users/${userId}/favoritePanels/${panelId}`);

// Nuove funzioni per i pannelli
// Aggiorniamo queste funzioni per assicurarci che gli URL siano corretti
export const likePanel = async (userId, panelId) => {
  try {
    const response = await api.post(`/users/${userId}/favoritePanels/${panelId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error in likePanel:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const commentPanel = (userId, panelId, commentData) => api.post(`/users/${userId}/favoritePanels/${panelId}/comment`, commentData);
export const updatePanel = (userId, panelId, panelData) => api.patch(`/users/${userId}/favoritePanels/${panelId}`, panelData);
export const deletePanel = (userId, panelId) => api.delete(`/users/${userId}/favoritePanels/${panelId}`);

// Message routes
export const sendMessage = (messageData) => api.post('/messages', messageData);
export const getConversations = () => api.get('/messages/conversations');
export const getConversationMessages = (userId) => api.get(`/messages/${userId}`);

export default api;