// Componente MobileNav
const MobileNav = ({ userData, navItems, socialItems, location }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
    return (
      <header className="relative w-full bg-gray-900">
        <nav className="relative h-20 mx-auto max-w-7xl flex justify-between items-center px-4">
          <div className="order-1">
            {userData ? <DropdownProfile userData={userData} /> : <LoginButton />}
          </div>
          <div className="order-2 absolute left-1/2 transform -translate-x-1/2">
            <Link to='/home'>
              <img src={logo} alt="logo" className="w-20" />
            </Link>
          </div>
          <div className="order-3">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none w-6 h-6 relative"
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white absolute top-2"
              />
              <motion.div
                animate={isMenuOpen ? { rotate: -45 } : { rotate: 0 }}
                className="w-6 h-0.5 bg-white absolute bottom-2"
              />
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 overflow-hidden"
            >
              {navItems.map((item, index) => (
                <NavItem
                  key={index}
                  href={item.href}
                  icon={item.icon}
                  name={item.name}
                  isActive={location.pathname === item.href}
                  onClick={() => setIsMenuOpen(false)}
                />
              ))}
              <ul className="flex justify-center space-x-4 py-4">
                {socialItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <item.icon className="text-2xl text-gray-400 hover:text-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  };