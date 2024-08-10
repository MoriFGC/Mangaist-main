import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, useAnimation } from "framer-motion";
import { getUserById, getUserManga } from "../services/api";
import { Link } from "react-router-dom";

const AutoScrollingList = ({ children, className }) => {
  const scrollRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShouldAnimate(scrollWidth > clientWidth);
    }
  }, [children]);

  useEffect(() => {
    if (shouldAnimate) {
      controls.start({
        x: [0, -scrollRef.current.scrollWidth / 2],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        },
      });
    }
  }, [shouldAnimate, controls]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        ref={scrollRef}
        className="flex"
        animate={controls}
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => shouldAnimate && controls.start({
          x: [controls.get("x"), -scrollRef.current.scrollWidth / 2],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          },
        })}
      >
        {children}
        {shouldAnimate && children} {/* Duplicate children for seamless loop */}
      </motion.div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [userManga, setUserManga] = useState([]);

  useEffect(() => {
    const fetchProfileAndManga = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
          const profileData = await getUserById(userData.id);
          setProfile(profileData.data);

          const mangaData = await getUserManga(userData.id);
          setUserManga(mangaData.data.filter((item) => item.manga !== null));
        } else {
          console.error("User data not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching profile or manga:", error);
      }
    };
    fetchProfileAndManga();
  }, []);

  if (!profile) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-white p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-8">
        <img
          src={profile.profileImage || user?.picture}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <p className="text-lg">
          {profile.name} {profile.cognome}
        </p>
        <p className="text-gray-400">{profile.nickname}</p>
        <p className="text-gray-400">{profile.email}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Manga</h2>
          <Link to="/all-manga" className="text-blue-500 hover:underline">
            View All Manga
          </Link>
        </div>
        <AutoScrollingList className="pb-4">
          {userManga.map((manga, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-40 mx-2"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/manga/${manga.manga._id}`}>
                <img
                  src={manga.manga.coverImage}
                  alt={manga.manga.title}
                  className="w-full h-56 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-semibold">{manga.manga.title}</p>
              </Link>
            </motion.div>
          ))}
        </AutoScrollingList>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Favorite Panels</h2>
          <Link to="/all-panels" className="text-blue-500 hover:underline">
            View All Panels
          </Link>
        </div>
        <AutoScrollingList className="pb-4">
          {profile.favoritePanels &&
            profile.favoritePanels.map((panel, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-40 mx-2"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/panel/${panel._id}`}>
                  <img
                    src={panel.panelImage}
                    alt={`Panel from ${panel.manga?.title}`}
                    className="w-full h-56 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-semibold">
                    {panel.manga?.title} - Ch.{panel.chapterNumber}
                  </p>
                </Link>
              </motion.div>
            ))}
        </AutoScrollingList>
      </div>
    </motion.div>
  );
};

export default Profile;