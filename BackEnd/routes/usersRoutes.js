import express from 'express';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { authMiddleware, isAdmin, isAuthorizedForManga } from '../middlewares/authMiddlewares.js'

const router = express.Router();

// GET /users: Ottiene tutti gli utenti (solo per admin)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
      const users = await User.find().select('-password');
      res.json(users);
  } catch(err) {
      res.status(500).json({ message: err.message });
  }
});

// GET tutti gli utenti
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find().select('-password'); // Esclude il campo password
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// });

// GET utente per ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favoritePanels.manga');  // Popola il campo manga nei pannelli preferiti
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// PATCH aggiorna l'immagine del profilo dell'utente
router.patch('/:id/profileImage', cloudinaryUploader.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    if (req.file) {
      user.profileImage = req.file.path;
      await user.save();
    } else {
      return res.status(400).json({message: 'Nessuna immagine fornita'});
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



// POST nuovo utente
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password; // Rimuove la password dalla risposta
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});



// PATCH aggiorna parzialmente un utente esistente
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== 'password') { // Previene l'aggiornamento diretto della password
        user[key] = updates[key];
      }
    });

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// DELETE utente
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    res.json({message: 'Utente eliminato con successo'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



//------------------------ USER MANGA -----------------------------------------------

router.get('/:userId/manga/:mangaId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    const mangaProgress = user.manga.find(m => m.manga.toString() === req.params.mangaId);
    if (!mangaProgress) {
      return res.status(404).json({message: 'Manga non trovato per questo utente'});
    }
    res.json(mangaProgress);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET manga di uno specifico utente
router.get('/:id/manga', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('manga.manga');
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    res.json(user.manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// POST aggiungi manga al catalogo dell'utente

router.post('/:id/manga', cloudinaryUploader.single('coverImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    let mangaData = req.body;
    if (req.file) {
      mangaData.coverImage = req.file.path;
    }

    // Converti i campi necessari
    if (mangaData.volumes) mangaData.volumes = Number(mangaData.volumes);
    if (mangaData.chapters) mangaData.chapters = Number(mangaData.chapters);
    if (mangaData.publicationYear) mangaData.publicationYear = Number(mangaData.publicationYear);

    // Gestisci il campo genre
    if (mangaData['genre[]']) {
      mangaData.genre = Array.isArray(mangaData['genre[]']) ? mangaData['genre[]'] : [mangaData['genre[]']];
      delete mangaData['genre[]'];
    }

    const manga = new Manga(mangaData);
    await manga.save();

    user.manga.push({
      manga: manga._id,
      readingStatus: 'to-read',
      currentChapter: 0,
      currentVolume: 0
    });

    await user.save();

    res.status(201).json(manga);
  } catch (error) {
    console.error('Error adding manga:', error);
    res.status(500).json({message: error.message});
  }
});

// DELETE rimuovi manga dal catalogo dell'utente
router.delete('/:userId/manga/:mangaId', authMiddleware, isAuthorizedForManga, async (req, res) => {
  try {
    const { userId, mangaId } = req.params;
    
    // Rimuovi il manga dal catalogo dell'utente
    const updateResult = await User.updateOne(
      { _id: userId },
      { $pull: { manga: { manga: mangaId } } }
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: 'Manga non trovato nel catalogo dell\'utente' });
    }

    // Controlla se il manga è personale (non predefinito)
    const manga = await Manga.findById(mangaId);
    if (manga && !manga.isDefault) {
      // Se è un manga personale, eliminalo dalla collezione globale
      await Manga.findByIdAndDelete(mangaId);
      res.json({ message: 'Manga rimosso dal catalogo dell\'utente e dalla collezione globale' });
    } else {
      res.json({ message: 'Manga rimosso dal catalogo dell\'utente' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//PATCH

router.patch('/:userId/manga/:mangaId/progress', async (req, res) => {
  try {
    const { userId, mangaId } = req.params;
    const { currentChapter, currentVolume } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const mangaIndex = user.manga.findIndex(m => m.manga.toString() === mangaId);
    if (mangaIndex === -1) {
      return res.status(404).json({ message: 'Manga non trovato nel catalogo dell\'utente' });
    }

    user.manga[mangaIndex].currentChapter = currentChapter;
    user.manga[mangaIndex].currentVolume = currentVolume;

    await user.save();

    res.json(user.manga[mangaIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//-------------------------- USER PANEL ---------------------------

// POST aggiungi un pannello preferito
router.post('/:id/favoritePanels', cloudinaryUploader.single('panelImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    if (!req.file) {
      return res.status(400).json({message: 'Nessuna immagine fornita per il pannello'});
    }

    const newPanel = {
      panelImage: req.file.path,  // Cambiato da 'image' a 'panelImage'
      description: req.body.description,
      manga: req.body.manga  // Cambiato da 'mangaId' a 'manga'
    };

    user.favoritePanels.push(newPanel);
    await user.save();

    res.status(201).json(user.favoritePanels[user.favoritePanels.length - 1]);
  } catch (error) {
    console.error('Errore nel salvataggio del pannello:', error);
    res.status(500).json({message: error.message});
  }
});

// PATCH aggiorna un pannello preferito
router.patch('/:userId/favoritePanels/:panelId', cloudinaryUploader.single('panelImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    const panel = user.favoritePanels.id(req.params.panelId);
    if (!panel) {
      return res.status(404).json({message: 'Pannello preferito non trovato'});
    }

    if (req.file) {
      panel.image = req.file.path;
    }
    if (req.body.description) {
      panel.description = req.body.description;
    }
    if (req.body.mangaId) {
      panel.manga = req.body.mangaId;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(panel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// DELETE rimuovi un pannello preferito specifico
router.delete('/:userId/favoritePanels/:panelId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    // Trova l'indice del pannello preferito
    const panelIndex = user.favoritePanels.findIndex(
      panel => panel._id.toString() === req.params.panelId
    );

    if (panelIndex === -1) {
      return res.status(404).json({message: 'Pannello preferito non trovato'});
    }

    // Rimuovi il pannello dall'array
    user.favoritePanels.splice(panelIndex, 1);

    // Salva le modifiche
    await user.save();

    res.json({message: 'Pannello preferito rimosso con successo'});
  } catch (error) {
    console.error('Errore nella rimozione del pannello preferito:', error);
    res.status(500).json({message: error.message});
  }
});


export default router;