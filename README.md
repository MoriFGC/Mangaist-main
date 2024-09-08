# Mangaist

Mangaist è una piattaforma social dedicata agli appassionati di manga, che permette agli utenti di tenere traccia dei loro manga preferiti, condividere pannelli, e interagire con altri fan.

## Caratteristiche Principali

- **Gestione della Libreria Manga**: Gli utenti possono aggiungere manga alla loro collezione personale, tenere traccia dei capitoli letti e del loro stato di lettura.
- **Condivisione di Pannelli**: Possibilità di caricare e condividere i pannelli preferiti dai manga.
- **Interazioni Sociali**: Gli utenti possono seguire altri utenti, mettere like e commentare i pannelli condivisi.
- **Profili Personalizzati**: Ogni utente ha un profilo personalizzabile con informazioni sulla propria collezione e attività.
- **Esplorazione**: Una sezione dedicata alla scoperta di nuovi manga e pannelli condivisi dalla community.

## Tecnologie Utilizzate

- **Frontend**:
  - React.js
  - Tailwind CSS per lo styling
  - Framer Motion per le animazioni
  - Auth0 per l'autenticazione

- **Backend**:
  - Node.js con Express.js
  - MongoDB per il database
  - Mongoose come ODM

- **Altre Tecnologie**:
  - Cloudinary per lo storage delle immagini
  - JWT per l'autenticazione lato server

## Installazione

1. Clona il repository:
   ```
   git clone https://github.com/tuousername/mangaist.git
   cd mangaist
   ```

2. Installa le dipendenze per il backend:
   ```
   cd backend
   npm install
   ```

3. Installa le dipendenze per il frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Crea un file `.env` nella cartella backend con le seguenti variabili:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AUTH0_DOMAIN=your_auth0_domain
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   AUTH0_CALLBACK_URL=http://localhost:3000/callback
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. Crea un file `.env` nella cartella frontend con le seguenti variabili:
   ```
   REACT_APP_AUTH0_DOMAIN=your_auth0_domain
   REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
   REACT_APP_API_URL=http://localhost:5001/api
   ```

## Avvio dell'Applicazione

1. Avvia il server backend:
   ```
   cd backend
   npm start
   ```

2. In un nuovo terminale, avvia l'applicazione frontend:
   ```
   cd frontend
   npm start
   ```

3. Apri il browser e visita `http://localhost:3000` per utilizzare l'applicazione.
 
## Contatti

Abd Elrahman Mohamed - abdulmoha@outlook.it

Link del Progetto: [https://github.com/tuousername/mangaist](https://github.com/tuousername/mangaist)

---

Realizzato con ❤️ da Abd Elrahman Mohamed