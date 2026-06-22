import { useState, useEffect } from 'react';
import { Ghost, Moon, Sun, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light';
  });

  // Apply theme class when light mode state changes
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem('theme', newMode ? 'light' : 'dark');
  };

  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'reels', label: 'Reels', path: '/reels' },
    { id: 'posts', label: 'Posts', path: '/posts' },
  ];

  const handleNavClick = (item) => {
    setIsOpen(false);
    if (setActiveTab) {
      setActiveTab(item.id);
    }
    navigate(item.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar-container">
      <div className="navbar glass-card">
        {/* Left: Logo */}
        <div className="navbar-logo" onClick={() => handleNavClick(menuItems[0])}>
          <div className="logo-icon-wrapper">
            <Ghost className="logo-icon" size={26} />
          </div>
          <span className="logo-text">Ghost<span className="logo-highlight">Clip</span></span>
        </div>

        {/* Center Menu: Desktop */}
        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Theme toggle button"
          >
            {isLightMode ? <Sun size={20} className="theme-icon" /> : <Moon size={20} className="theme-icon" />}
          </button>
          
          {/* Hamburger Mobile Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-menu glass-card">
          <ul className="mobile-menu-list">
            {menuItems.map((item) => (
              <li key={item.id} className="mobile-menu-item">
                <button
                  className={`mobile-menu-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
