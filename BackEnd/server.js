import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import endpoints from 'express-list-endpoints';
import mangaRoutes from './routes/mangaRoutes.js';
import userRoutes from './routes/usersRoutes.js';  // Importa le nuove rotte utente
import authRoutes from './routes/authRoutes.js'
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from './middlewares/errorHandlers.js';
import { Strategy as Auth0Strategy } from 'passport-auth0';
import passport from 'passport';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connessione al database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso al database MongoDB'))
  .catch((err) => console.error('Errore di connessione al database:', err));

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

app.use(passport.initialize());

// Rotte
app.use('/api/auth', authRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/users', userRoutes);  // Aggiungi le rotte utente

// Middleware di gestione errori
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// Avvio del server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.table(
    endpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    }))
  );
});



