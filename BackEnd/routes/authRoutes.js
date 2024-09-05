import express from 'express';
import jwt from 'jsonwebtoken';
import { generateJWT } from '../utils/jwt.js';
import User from '../models/User.js';

const router = express.Router();

// Funzione per verificare se un'email è admin
const isAdminEmail = (email) => {
    if (!email) return false; // Se l'email non è disponibile, non è admin
    const adminEmail = process.env.ADMIN_EMAIL;
    return email.toLowerCase() === adminEmail.toLowerCase();
  };


router.post('/auth0-callback', async (req, res) => {
  try {
    const { id_token } = req.body;
    const decodedToken = jwt.decode(id_token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Token non valido' });
    }

    const userEmail = decodedToken.email || null;
    const isAdmin = isAdminEmail(userEmail);
    const userId = decodedToken.sub;

    const userInfo = {
      name: decodedToken.name || decodedToken.nickname,
      email: decodedToken.email,
      picture: decodedToken.picture
    };

    let user = await User.findOne({ authId: userId });
    if (!user) {
      // Creazione di un nuovo utente
      user = new User({
        authId: userId,
        email: userInfo.email,
        name: userInfo.name,
        role: isAdmin ? 'admin' : 'user',
        profileCompleted: false,
        authImage: userInfo.picture,
        profileImage: null  // Inizialmente null, verrà impostata quando l'utente caricherà un'immagine
      });
    } else {
      // Aggiornamento utente esistente
      if (userEmail && isAdminEmail(userEmail) && user.role !== 'admin') {
        user.role = 'admin';
      }
      user.authImage = userInfo.picture;  // Aggiorniamo sempre l'immagine di Auth0
      // Non tocchiamo profileImage qui
    }
    await user.save();

    const token = await generateJWT(user);

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        profileCompleted: user.profileCompleted,
        profileImage: user.profileImage || user.authImage  // Usiamo profileImage se esiste, altrimenti authImage
      } 
    });
  } catch (error) {
    console.error("Errore durante l'autenticazione:", error);
    res.status(500).json({ message: "Errore durante l'autenticazione", error: error.message });
  }
});

export default router;