import { verifyJWT } from '../utils/jwt.js';
import User from '../models/User.js';  // Cambiato da Author a User

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

    req.user = user;  // Cambiato da author a user
    next();
  } catch (error) {
    res.status(401).send('Token non valido');
  }
};

// Middleware per verificare il ruolo admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {  // Cambiato da author a user
    next();
  } else {
    res.status(403).send('Accesso negato: richiesto ruolo admin');
  }
};
