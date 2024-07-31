import express from 'express';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';

const router = express.Router();

// GET tutti gli utenti
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Esclude il campo password
    res.json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

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

// POST aggiungi manga al catalogo dell'utente
router.post('/:id/manga', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({message: 'Utente non trovato'});
      }
  
      let manga;
      if (req.body.mangaId) {
        // Se viene fornito un mangaId, aggiungi un manga esistente
        manga = await Manga.findById(req.body.mangaId);
        if (!manga) {
          return res.status(404).json({message: 'Manga non trovato'});
        }
      } else {
        // Se non viene fornito un mangaId, crea un nuovo manga personale
        manga = new Manga({
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          status: req.body.status,
          volumes: req.body.volumes,
          chapters: req.body.chapters,
          genre: req.body.genre,
          coverImage: req.body.coverImage,
          isDefault: false
        });
        await manga.save();
      }
  
      // Aggiungi il manga al catalogo dell'utente con lo stato di lettura fornito
      user.manga.push({
        manga: manga._id,
        readingStatus: req.body.readingStatus || 'to-read', // Usa lo stato fornito o il default
        currentChapter: req.body.currentChapter,
        currentVolume: req.body.currentVolume
      });
  
      const updatedUser = await user.save();
      res.status(201).json(updatedUser.manga[updatedUser.manga.length - 1]);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  });

// DELETE rimuovi manga dal catalogo dell'utente
router.delete('/:userId/manga/:mangaId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    user.manga = user.manga.filter(m => m._id.toString() !== req.params.mangaId);
    await user.save();
    res.json({message: 'Manga rimosso dal catalogo dell\'utente'});
  } catch (error) {
    res.status(400).json({message: error.message});
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