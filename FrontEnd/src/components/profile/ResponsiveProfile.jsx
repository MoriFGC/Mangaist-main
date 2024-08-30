import { motion } from "framer-motion";

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
          "px-4 py-1 bg-gray-500 rounded-md text-sm font-semibold text-white hover:bg-gray-600 transition-colors duration-300 w-full",
      };
    } else {
      return {
        text: "Follow",
        className:
          "px-4 py-1 bg-blue-500 rounded-md text-sm font-semibold text-white hover:bg-blue-600 transition-colors duration-300 w-full",
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
          {followButtonProps.text}
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
          <div className="absolute -bottom-7 mt-0">
            {isProfileOwner ? (
              <motion.button
                onClick={() => setIsUpdateDialogOpen(true)}
                className="px-4 py-1 bg-transparent border border-gray-400 rounded-md text-sm font-semibold text-white hover:border-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            ) : (
              renderFollowButton()
            )}
          </div>
        </div>
      </div>

      {/* layout per mobile */}
      <div className="md:hidden mb-8">
        <div className="flex items-center mb-4">
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
            className="w-full py-2 bg-gray-800 rounded-md text-sm font-semibold text-white hover:bg-gray-700 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Edit Profile
          </motion.button>
        ) : (
          renderFollowButton()
        )}
      </div>
    </>
  );
}
