import { verifyJWT } from '../utils/jwt.js';
import User from '../models/User.js'; 

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send('Token mancante');
    }

    const decoded = await verifyJWT(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).send('Utente non trovato');
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).send('Token non valido');
  }
};

// Middleware per verificare il ruolo admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {  
    next();
  } else {
    res.status(403).send('Accesso negato: richiesto ruolo admin');
  }
};


export const isAuthorizedForManga = async (req, res, next) => {
  try {
    const { userId, mangaId } = req.params;
    
    // Se l'utente è un admin, consenti l'accesso
    if (req.user.role === 'admin') {
      return next();
    }

    // Verifica se l'utente che fa la richiesta è lo stesso dell'URL
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Non sei autorizzato a modificare il catalogo di un altro utente' });
    }

    // Verifica se il manga appartiene all'utente
    const user = await User.findById(userId);
    const mangaBelongsToUser = user.manga.some(m => m.manga.toString() === mangaId);

    if (!mangaBelongsToUser) {
      return res.status(403).json({ message: 'Questo manga non appartiene al tuo catalogo' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};