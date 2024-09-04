// Importazioni necessarie
import { useAuth0 } from "@auth0/auth0-react"  // Hook per l'autenticazione Auth0
import { useEffect } from "react";  // Hook per effetti collaterali
import { useNavigate } from 'react-router-dom';  // Hook per la navigazione
import { motion } from "framer-motion";  // Libreria per le animazioni
import { auth0Callback } from '../services/api';  // Funzione per gestire il callback di Auth0

const FirstPage = () => {
  // Hook per la navigazione programmatica
  const navigate = useNavigate();
  // Ottiene lo stato di autenticazione e una funzione per ottenere i claims del token
  const { isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();

  // Effetto per controllare se il profilo dell'utente è completo
  useEffect(() => {
    async function checkProfileCompletion() {
      // Esegui solo se l'utente è autenticato
      if (isAuthenticated && !isLoading) {
        try {
          // Ottiene i claims del token ID
          const claims = await getIdTokenClaims();
          // Invia il token ID al backend per la verifica e ottiene i dati dell'utente
          const userData = await auth0Callback({ id_token: claims.__raw });

          // Salva i dati dell'utente nel localStorage
          localStorage.setItem("userData", JSON.stringify(userData));

          // Salva l'ID dell'utente separatamente
          localStorage.setItem("userId", userData.id);
          console.log(userData);
          
          // Controlla se il profilo è completo
          if (!userData.profileCompleted) {
            // Se il profilo non è completo, reindirizza l'utente alla pagina di completamento
            navigate('/complete-profile');
          } else {
            // Se il profilo è completo, reindirizza alla home o a un'altra pagina appropriata
            window.location.href = '/home';
          }
        } catch (error) {
          console.error('Error checking profile completion:', error);
        }
      }
    }
    // Esegui la funzione di controllo
    checkProfileCompletion();
  }, [isAuthenticated, getIdTokenClaims, navigate, isLoading]);  // Dipendenze dell'effetto

  // Renderizza il contenuto della pagina
  return (
    <motion.div 
      // Animazioni di Framer Motion per l'entrata e l'uscita del componente
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to MangaApp</h1>
      <p className="text-xl mb-8">Your personal manga library and community</p>
      {/* Mostra il pulsante "Get Started" solo se l'utente non è autenticato */}
      {!isAuthenticated && (
        <button 
          onClick={() => navigate('/login')} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </button>
      )}
    </motion.div>
  );
};

export default FirstPage;

// Note aggiuntive:
// - Questo componente serve come pagina iniziale dell'applicazione.
// - Controlla lo stato di autenticazione dell'utente e reindirizza di conseguenza.
// - Se l'utente è autenticato ma il profilo non è completo, viene reindirizzato alla pagina di completamento del profilo.
// - Se l'utente è autenticato e il profilo è completo, viene reindirizzato alla home page.
// - Se l'utente non è autenticato, viene mostrato un pulsante per iniziare il processo di login.
// - La sincronizzazione dei dati dell'utente con il backend dovrebbe essere gestita in un componente di livello superiore o in un custom hook.