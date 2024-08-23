import express from 'express';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { authMiddleware, isAdmin, isAuthorizedForManga } from '../middlewares/authMiddlewares.js'

const router = express.Router();

router.get('/public', async (req, res) => {
  try {
    const users = await User.find()
      .select('name nickname profileImage profilePublic manga favoritePanels')
      .lean();
    
    const usersWithCounts = users.map(user => ({
      _id: user._id,
      name: user.name,
      nickname: user.nickname,
      profileImage: user.profileImage, // Aggiungi un'immagine predefinita se non è presente
      profilePublic: user.profilePublic,
      manga: user.profilePublic ? user.manga.length : null,
      favoritePanels: user.profilePublic ? user.favoritePanels.length : null
    }));

    res.json(usersWithCounts);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// In usersRoutes.js
router.get('/public/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email')
      .populate('manga.manga')
      .populate('favoritePanels');
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

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
    const user = await User.findOne({
      $or: [
        { _id: req.params.id },
        { authId: req.params.id }
      ]
    }).select('-password').populate('favoritePanels.manga');

    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({message: 'ID utente non valido'});
    }

    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }
    
    // Se il profilo non è pubblico e non è l'utente stesso che lo richiede, restituisci solo informazioni limitate
    if (!user.profilePublic && req.user && req.user.id !== user.id) {
      const limitedUser = {
        _id: user._id,
        name: user.name,
        nickname: user.nickname,
        profileImage: user.profileImage,
        profilePublic: user.profilePublic
      };
      return res.json(limitedUser);
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
    // Restituisci solo i dati necessari per la visualizzazione pubblica
    const publicMangaData = user.manga.map(item => ({
      _id: item.manga._id,
      title: item.manga.title,
      coverImage: item.manga.coverImage,
      author: item.manga.author
    }));
    res.json(publicMangaData);
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

    console.log('Received manga data:', req.body);
    console.log('Received file:', req.file);

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

    // Aggiungi l'ID dell'utente che sta creando il manga
    mangaData.createdBy = user._id;

    console.log('Processed manga data:', mangaData);

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
    res.status(500).json({message: error.message, stack: error.stack});
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
router.post('/:id/favoritePanels', authMiddleware, cloudinaryUploader.single('panelImage'), async (req, res) => {
  try {
    // Log dei dati ricevuti per debug
    console.log('Received panel data:', req.body);
    console.log('Received file:', req.file);

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    if (!req.file) {
      return res.status(400).json({message: 'Nessuna immagine fornita per il pannello'});
    }

    const newPanel = {
      panelImage: req.file.path,
      description: req.body.description,
      manga: req.body.manga,
      chapterNumber: req.body.chapterNumber,
      volumeNumber: req.body.volumeNumber,
      user: req.user._id
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
router.patch('/:userId/favoritePanels/:panelId', authMiddleware, cloudinaryUploader.single('panelImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    const panel = user.favoritePanels.id(req.params.panelId);
    if (!panel) {
      return res.status(404).json({message: 'Pannello preferito non trovato'});
    }

    // Verifica che l'utente autenticato sia il proprietario del pannello
    if (panel.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({message: 'Non autorizzato a modificare questo pannello'});
    }

    if (req.file) {
      panel.panelImage = req.file.path;
    }
    if (req.body.description) panel.description = req.body.description;
    if (req.body.chapterNumber) panel.chapterNumber = req.body.chapterNumber;
    if (req.body.volumeNumber) panel.volumeNumber = req.body.volumeNumber;

    await user.save();
    res.json(panel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET un pannello preferito specifico
router.get('/:userId/favoritePanels/:panelId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('favoritePanels.user', 'name nickname profileImage');
    
    if (!user) {
      return res.status(404).json({message: 'Utente non trovato'});
    }

    const panel = user.favoritePanels.id(req.params.panelId);
    if (!panel) {
      return res.status(404).json({message: 'Pannello preferito non trovato'});
    }

    res.json(panel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET un pannello specifico
router.get('/panels/:panelId', async (req, res) => {
  try {
    const users = await User.find({ 'favoritePanels._id': req.params.panelId })
      .select('favoritePanels.$')
      .populate('favoritePanels.user', 'name nickname profileImage');

    if (users.length === 0 || users[0].favoritePanels.length === 0) {
      return res.status(404).json({message: 'Pannello non trovato'});
    }

    const panel = users[0].favoritePanels[0];
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

// Modifica la route per i like
router.post('/panels/:panelId/like', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ 'favoritePanels._id': req.params.panelId });
    if (!user) {
      return res.status(404).json({message: 'Pannello non trovato'});
    }

    const panelIndex = user.favoritePanels.findIndex(p => p._id.toString() === req.params.panelId);
    const currentPanel = user.favoritePanels[panelIndex];

    const likeIndex = currentPanel.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      currentPanel.likes.splice(likeIndex, 1);
    } else {
      currentPanel.likes.push(req.user._id);
    }

    await user.save();

    // Popola i dati dell'utente
    await user.populate('favoritePanels.user', 'name nickname profileImage');

    res.json({ message: 'Like aggiornato con successo', panel: currentPanel });
  } catch (error) {
    console.error('Errore nel toggle del like:', error);
    res.status(500).json({message: error.message});
  }
});

router.post('/panels/:panelId/comment', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ 'favoritePanels._id': req.params.panelId });
    if (!user) {
      return res.status(404).json({message: 'Pannello non trovato'});
    }

    const panelIndex = user.favoritePanels.findIndex(p => p._id.toString() === req.params.panelId);
    const currentPanel = user.favoritePanels[panelIndex];

    const newComment = {
      user: req.user._id,
      text: req.body.text
    };

    currentPanel.comments.push(newComment);
    await user.save();

    // Popola i dati dell'utente
    await user.populate('favoritePanels.user', 'name nickname profileImage');
    await user.populate('favoritePanels.comments.user', 'name nickname profileImage');

    res.status(201).json({message: 'Commento aggiunto con successo', panel: currentPanel});
  } catch (error) {
    console.error('Errore nell\'aggiunta del commento:', error);
    res.status(500).json({message: error.message});
  }
});
export default router;