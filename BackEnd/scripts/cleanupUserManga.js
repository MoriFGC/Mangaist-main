import mongoose from 'mongoose';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica le variabili d'ambiente dal file .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI non definita nel file .env');
  process.exit(1);
}

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connesso al database MongoDB');
  } catch (err) {
    console.error('Errore di connessione al database:', err);
    process.exit(1);
  }
}

async function cleanupUserManga() {
  try {
    await connectToDatabase();

    const users = await User.find();
    for (let user of users) {
      const validManga = [];
      for (let mangaRef of user.manga) {
        const exists = await Manga.exists({ _id: mangaRef.manga });
        if (exists) {
          validManga.push(mangaRef);
        }
      }
      user.manga = validManga;
      await user.save();
    }
    console.log('Pulizia completata');
  } catch (error) {
    console.error('Errore durante la pulizia:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupUserManga();