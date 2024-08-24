// Componente Sidebar
export default function Sidebar  ({ userData, navItems, socialItems, location }){
    
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-5 flex flex-col">
      <div className="mb-8">
        <img src={logo} alt="logo" className="w-20 mx-auto" />
      </div>
      <div className="mb-8">
        {userData ? (
          <DropdownProfile userData={userData} />
        ) : (
          <LoginButton />
        )}
      </div>
      <nav className="flex-grow">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            icon={item.icon}
            name={item.name}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>
      <div className="mt-auto">
        <ul className="flex justify-between text-gray-400">
          {socialItems.map((item, index) => (
            <li key={index}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <item.icon className="text-2xl hover:text-white" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  };