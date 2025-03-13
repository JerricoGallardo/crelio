import React, { useState, useRef, useEffect } from 'react';

const Header = ({ darkMode, setDarkMode, compactMode, setCompactMode }) => {
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  const toggleCompactMode = () => {
    setCompactMode(!compactMode);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-pencil-ruler"></i>
        <span>Crealio</span>
      </div>
      
      <nav className="nav-menu">
        <a href="#" className="active">Home</a>
        <a href="#templates">Templates</a>
        <a href="#about">About</a>
        <a href="#feedback">Feedback</a>
      </nav>

      <div className="user-profile">
        <div className="profile-trigger" onClick={toggleProfileMenu}>
          <img src="/img/profile-pic.jpg" alt="Profile" className="avatar" />
          <span className="username">Earl Pogi</span>
        </div>
        
        <div ref={menuRef} className={`profile-menu ${profileMenuVisible ? 'active' : ''}`} id="profileMenu">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-image-wrapper">
                <img src="/img/profile-pic.jpg" alt="Profile" className="large-avatar" />
              </div>
              <div className="user-info">
                <h4>Earl Pogi</h4>
                <p>earljoshua69@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="menu-items">
            <div className="menu-section">
              <h5 className="menu-label">Preferences</h5>
              <div className="menu-item">
                <i className="fas fa-moon"></i>
                <div>
                  <span>Dark Mode</span>
                  <small>Toggle theme</small>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="themeToggle" 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <a href="#" className="menu-item ripple" onClick={(e) => { e.preventDefault(); toggleCompactMode(); }}>
                <i className="fas fa-compress-alt"></i>
                <div>
                  <span>Compact Mode</span>
                  <small>Toggle compact layout</small>
                </div>
              </a>
            </div>

            <div className="divider"></div>
            
            <div className="menu-section">
              <a href="#" className="menu-item logout ripple">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;