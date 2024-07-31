import express from 'express';
import Manga from '../models/Manga.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';

const router = express.Router();

// -------------------------- MANGA ----------------------------
// GET tutti i manga
router.get('/', async (req, res) => {
  try {
    const manga = await Manga.find();
    res.json(manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET manga per ID
router.get('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }
    res.json(manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// POST nuovo manga
router.post('/', async (req, res) => {
  try {
    const newManga = new Manga(req.body);
    const savedManga = await newManga.save();
    res.status(201).json(savedManga);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH aggiorna la cover image del manga
router.patch('/:id/coverImage', cloudinaryUploader.single('coverImage'), async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }

    if (req.file) {
      manga.coverImage = req.file.path; // Cloudinary restituisce l'URL dell'immagine in req.file.path
      await manga.save();
    } else {
      return res.status(400).json({message: 'Nessuna immagine fornita'});
    }

    res.json(manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// PATCH aggiorna parzialmente un manga esistente
router.patch('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }
    
    Object.keys(req.body).forEach((key) => {
      if (key in manga) {
        manga[key] = req.body[key];
      }
    });

    const updatedManga = await manga.save();
    res.json(updatedManga);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// DELETE manga
router.delete('/:id', async (req, res) => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);
    if (!deletedManga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }
    res.json({message: 'Manga eliminato con successo'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
//--------------------- FINE MANGA ------------------------------

//--------------------- CHARACTERS ------------------------------
// PATCH aggiorna l'immagine e/o il nome di un personaggio
router.patch('/:id/characters/:characterId', cloudinaryUploader.single('image'), async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }

    const character = manga.characters.id(req.params.characterId);
    if (!character) {
      return res.status(404).json({message: 'Personaggio non trovato'});
    }

    // Aggiorna l'immagine se fornita
    if (req.file) {
      character.image = req.file.path;
    }

    // Aggiorna il nome se fornito
    if (req.body.name) {
      character.name = req.body.name;
    }

    // Salva le modifiche solo se c'è stata almeno una modifica
    if (req.file || req.body.name) {
      await manga.save();
    } else {
      return res.status(400).json({message: 'Nessuna modifica fornita'});
    }

    res.json(manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// POST aggiungi un nuovo personaggio con immagine
router.post('/:id/characters', cloudinaryUploader.single('characterImage'), async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({message: 'Manga non trovato'});
    }

    const newCharacter = {
      name: req.body.name,
      image: req.file ? req.file.path : ''
    };

    manga.characters.push(newCharacter);
    await manga.save();

    res.status(201).json(manga);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



export default router;