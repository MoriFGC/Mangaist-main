// Importa la libreria jsonwebtoken per gestire i JSON Web Tokens
import jwt from 'jsonwebtoken';

// Funzione per generare un token JWT
export const generateJWT = (user) => {
  return new Promise((resolve, reject) => 
    jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role  // Aggiungi il ruolo dell'utente al payload
      },
      process.env.JWT_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );
};

// Funzione per verificare un token JWT
export const verifyJWT = (token) => {
  // Restituisce una Promise per gestire l'operazione in modo asincrono
  return new Promise((resolve, reject) => 
    // Utilizza il metodo verify di jwt per decodificare e verificare il token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // Callback che gestisce il risultato dell'operazione
      if (err) reject(err);     // Se c'è un errore (es. token non valido), rifiuta la Promise
      else resolve(decoded);    // Altrimenti, risolve la Promise con il payload decodificato
    })
  );
};