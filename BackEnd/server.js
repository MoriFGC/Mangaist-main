// Importazione delle dipendenze necessarie
import express from 'express';  // Framework web per Node.js
import mongoose from 'mongoose';  // ODM per MongoDB
import dotenv from 'dotenv';  // Per caricare variabili d'ambiente da file .env
import cors from 'cors';  // Middleware per abilitare CORS
import endpoints from 'express-list-endpoints';  // Utility per elencare gli endpoint dell'app

// Importazione delle route
import mangaRoutes from './routes/mangaRoutes.js';  // Route per la gestione dei manga
import userRoutes from './routes/usersRoutes.js';   // Route per la gestione degli utenti
import authRoutes from './routes/authRoutes.js';    // Route per l'autenticazione
import messageRoutes from './routes/messageRoutes.js';  // Route per la gestione dei messaggi

// Importazione dei middleware per la gestione degli errori
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from './middlewares/errorHandlers.js';

// Importazione delle dipendenze per Auth0
import { Strategy as Auth0Strategy } from 'passport-auth0';  // Strategia Auth0 per Passport
import passport from 'passport';  // Middleware di autenticazione per Node.js

// Caricamento delle variabili d'ambiente
dotenv.config();

// Creazione dell'istanza dell'applicazione Express
const app = express();

// Configurazione dei middleware
app.use(cors());  // Abilita CORS per tutte le richieste
app.use(express.json());  // Parsing del body delle richieste in formato JSON

// Connessione al database MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso al database MongoDB'))
  .catch((err) => console.error('Errore di connessione al database:', err));

// Configurazione della strategia Auth0
const auth0Strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);

// Inizializzazione di Passport
app.use(passport.initialize());

// Definizione delle route
app.use('/api/auth', authRoutes);      // Route per l'autenticazione
app.use('/api/manga', mangaRoutes);    // Route per la gestione dei manga
app.use('/api/users', userRoutes);     // Route per la gestione degli utenti
app.use('/api/messages', messageRoutes);  // Route per la gestione dei messaggi

// Configurazione dei middleware per la gestione degli errori
app.use(badRequestHandler);     // Gestione errori 400 Bad Request
app.use(unauthorizedHandler);   // Gestione errori 401 Unauthorized
app.use(notFoundHandler);       // Gestione errori 404 Not Found
app.use(genericErrorHandler);   // Gestione errori generici

// Definizione della porta del server
const PORT = process.env.PORT || 5001;

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  // Stampa una tabella con tutti gli endpoint dell'applicazione
  console.table(
    endpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    }))
  );
});