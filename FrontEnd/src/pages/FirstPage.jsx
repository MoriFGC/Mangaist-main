// Importazioni necessarie
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth0Callback } from "../services/api";
import Abdul from "../assets/Abdul.jpg";
import LoginButton from "../components/Nav&Footer/LoginButton";
import useTypingEffect from "../hooks/useTypingEffect"; // Importiamo il nostro custom hook

const FirstPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();

  const [startIntroTyping, setStartIntroTyping] = useState(false);

  const { displayedText: titleText, isComplete: isTitleComplete } =
    useTypingEffect("Welcome to Mangaist", 100);

  const { displayedText: introText, isComplete: isIntroComplete } = useTypingEffect(
    "Hi, I'm Abd Elrahman Mohamed and this is my Capstone Project.",
    50,
    startIntroTyping
  );

  const projectDetails = `
  I created Mangaist for manga enthusiasts like myself who often lose track of their reading progress. This site helps you:

  • Keep track of what you're currently reading
  • Manage your to-read list
  • Record completed manga
  • Save your favorite manga panels

  Key features:
  • Home: Explore a feed of manga panels shared by the community, similar to Instagram
  • Library: Discover new manga and add them to your collection
  • Social: Find and connect with other manga fans
  • Profile: Manage your reading list, favorite panels, and customize your profile

  The '+' button at the bottom right allows you to easily add new manga or panels to your collection.

  Start your manga journey with Mangaist today and never lose track of your reading again!
  `;
  
  useEffect(() => {
    if (isTitleComplete) {
      setStartIntroTyping(true);
    }
  }, [isTitleComplete]);

  // Effetto per controllare se il profilo dell'utente è completo
  useEffect(() => {
    async function checkProfileCompletion() {
      if (isAuthenticated && !isLoading) {
        try {
          const claims = await getIdTokenClaims();
          const userData = await auth0Callback({ id_token: claims.__raw });
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("userId", userData.id);

          if (!userData.profileCompleted) {
            navigate("/complete-profile");
          } else {
            window.location.href = "/home";
          }
        } catch (error) {
          console.error("Error checking profile completion:", error);
        }
      }
    }
    checkProfileCompletion();
  }, [isAuthenticated, getIdTokenClaims, navigate, isLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-black">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="w-full md:w-1/2 flex flex-col justify-center mb-8 md:mb-0 md:pr-8">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {titleText}
            {!isTitleComplete && (
              <span className="inline-block w-0.5 h-6 md:h-8 bg-white ml-1 animate-blink"></span>
            )}
          </motion.h1>
          {isTitleComplete && (
            <motion.p
              className="text-lg md:text-xl text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {introText}
              {!isIntroComplete && (
                <span className="inline-block w-0.5 h-5 md:h-6 bg-white ml-1 animate-blink"></span>
              )}
            </motion.p>
          )}
          {!isAuthenticated && (
            <motion.div
              className="flex justify-center md:justify-start mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <LoginButton />
            </motion.div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <motion.img
            src={Abdul}
            alt="Abd elrahman Mohamed"
            className="max-w-full max-h-[50vh] object-contain rounded-lg"
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </div>

      <motion.div
        className="w-full max-w-4xl text-sm md:text-base text-gray-300 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <p className="whitespace-pre-line">{projectDetails}</p>
      </motion.div>
    </div>
  );
};

export default FirstPage;
