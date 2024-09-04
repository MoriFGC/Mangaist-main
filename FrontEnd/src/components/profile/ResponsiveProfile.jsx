import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ResponsiveProfile({
  profile,
  userManga,
  setIsUpdateDialogOpen,
  handleFollowToggle,
  isFollowing,
  isProfileOwner,
  isAuthenticated,
}) {
  // Funzione per determinare il testo e lo stile del pulsante
  const getFollowButtonProps = () => {
    if (isFollowing) {
      return {
        text: "Unfollow",
        className:
          "px-4 py-1 mt-3 bg-black rounded-md text-sm font-semibold border border-white hover:border-transparent text-white hover:bg-white hover:text-black transition-colors duration-300 w-full lg:w-[150px]",
      };
    } else {
      return {
        text: "Follow",
        className:
          "px-4 py-1 mt-3 w-full lg:w-[150px] bg-white border border-transparent rounded-md text-sm font-semibold text-black hover:bg-black hover:text-white hover:border-white transition-colors duration-300",
      };
    }
  };

  const followButtonProps = getFollowButtonProps();

  // Renderizza il pulsante solo se l'utente è autenticato e non è il proprietario del profilo
  const renderFollowButton = () => {
    if (isAuthenticated && !isProfileOwner) {
      return (
        <motion.button
          onClick={handleFollowToggle}
          className={followButtonProps.className}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </motion.button>
      );
    }
    return null;
  };

  return (
    <>
      {/* Layout per dekstop */}
      <div className="hidden md:visible mb-8 md:flex flex-row items-start">
        {/* Immagine del profilo */}
        <motion.img
          src={profile.profileImage || profile.picture}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />

        {/* Informazioni del profilo */}
        <div className="flex-grow text-left relative">
          <h1 className="text-2xl font-bold mb-2">
            {profile.name} {profile.cognome}
          </h1>
          <p className="text-gray-400 mb-2">@{profile.nickname}</p>

          {/* Statistiche del profilo */}
          <div className="flex justify-start space-x-6 mb-2">
            <div>
              <span className="font-bold">{userManga?.length || 0}</span> manga
            </div>
            <div>
              <span className="font-bold">
                {profile.favoritePanels?.length || 0}
              </span>{" "}
              panels
            </div>
            <div>
              <span className="font-bold">
                {profile.followers?.length || 0}
              </span>{" "}
              followers
            </div>
          </div>

          {profile.description && (
            <p className="text-sm text-gray-300 mb-4">{profile.description}</p>
          )}

          {/* Pulsante Edit Profile/Follow - posizionamento diverso per mobile e desktop */}
          <div className="">
            {isProfileOwner ? (
              <motion.button
                onClick={() => setIsUpdateDialogOpen(true)}
                className="absolute top-0 right-0 mt-0 border border-transparent text-white p-2 rounded hover:border-white transition duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit size={20} />
              </motion.button>
            ) : (
              
              renderFollowButton() 
            )}
          </div>
        </div>
      </div>

      {/* layout per mobile */}
      <div className="md:hidden mb-8 relative">
        <div className="flex items-center mb-4 ">
          {/* Immagine del profilo */}
          <motion.img
            src={profile.profileImage || profile.picture}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-5"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          {/* Statistiche */}
          <div className="flex-grow">
            <div className="flex justify-between">
              <div className="text-center">
                <div className="font-bold">{userManga?.length || 0}</div>
                <div className="text-md text-gray-400">manga</div>
              </div>
              <div className="text-center">
                <div className="font-bold">
                  {profile.favoritePanels?.length || 0}
                </div>
                <div className="text-md text-gray-400">panels</div>
              </div>
              <div className="text-center">
                <div className="font-bold">
                  {profile.followers?.length || 0}
                </div>
                <div className="text-md text-gray-400">followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nome e cognome */}
        <h1 className="text-xl font-bold mb-1">
          {profile.name} {profile.cognome}
        </h1>

        {/* Nickname */}
        <p className="text-gray-400 text-sm mb-2">@{profile.nickname}</p>

        {/* Descrizione */}
        {profile.description && (
          <p className="text-sm text-gray-300 mb-3">{profile.description}</p>
        )}

        {/* Pulsante Edit Profile/Follow */}
        {isProfileOwner ? (
          <motion.button
            onClick={() => setIsUpdateDialogOpen(true)}
            className="absolute bottom-14 right-0 mt-0  text-white p-2 rounded transition duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEdit size={20}/>
          </motion.button>
        ) : (
          renderFollowButton()
        )}
      </div>
    </>
  );
}
