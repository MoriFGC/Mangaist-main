import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import endpoints from 'express-list-endpoints';
import mangaRoutes from './routes/mangaRoutes.js';
import userRoutes from './routes/usersRoutes.js';  // Importa le nuove rotte utente
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from './middlewares/errorHandlers.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connessione al database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso al database MongoDB'))
  .catch((err) => console.error('Errore di connessione al database:', err));

// Rotte
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


// const express = require('express');

// const { auth } = require('express-oauth2-jwt-bearer');


// const jwtCheck = auth({
//   audience: 'https://Mangaist',
//   issuerBaseURL: 'https://dev-6zpiulqlj7s17isb.eu.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

// // enforce on all endpoints
// app.use(jwtCheck);

// app.get('/authorized', function (req, res) {
//     res.send('Secured Resource');
// });
