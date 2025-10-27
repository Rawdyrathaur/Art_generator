import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../utils/artworkUtils';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    artworks: 0,
    transformations: 0,
    dayStreak: 0
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load user statistics for gallery badge
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = () => {
    try {
      // Use utility function to get comprehensive user stats
      const stats = getUserStats(user.email);
      setUserStats({
        artworks: stats.artworks,
        transformations: stats.transformations,
        dayStreak: 0 // Can be calculated later based on activity patterns
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!user) return null;

  const formatMembershipBadge = (membership) => {
    const badges = {
      free: { label: 'Free', color: '#9CA3AF', icon: '🆓' },
      pro: { label: 'Pro', color: '#3B82F6', icon: '⭐' },
      premium: { label: 'Premium', color: '#F59E0B', icon: '👑' },
      enterprise: { label: 'Enterprise', color: '#10B981', icon: '🏢' }
    };
    return badges[membership] || badges.free;
  };

  const membershipInfo = formatMembershipBadge(user.membership);

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        className="profile-avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open profile menu"
      >
        <div className="avatar-container">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="avatar-image"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=40&background=667eea&color=fff`;
            }}
          />
          <div className="online-indicator"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown-menu">
          {/* User Info Header */}
          <div className="dropdown-header">
            <div className="user-avatar-large">
              <img 
                src={user.avatar} 
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=60&background=667eea&color=fff`;
                }}
              />
              <div className="membership-badge" style={{ color: membershipInfo.color }}>
                <span className="badge-icon">{membershipInfo.icon}</span>
                <span className="badge-text">{membershipInfo.label}</span>
              </div>
            </div>
            <div className="user-info">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <div className="join-date">
                Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>


          {/* Menu Items */}
          <div className="dropdown-menu-items">
            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/profile')}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">My Profile</span>
                <span className="item-subtitle">Edit profile & preferences</span>
              </div>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/gallery')}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">My Gallery</span>
                <span className="item-subtitle">View your artworks</span>
              </div>
              <div className="item-badge">{userStats.artworks}</div>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/membership')}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">Membership</span>
                <span className="item-subtitle">Upgrade or manage plan</span>
              </div>
              {user.membership === 'free' && (
                <div className="item-badge upgrade">Upgrade</div>
              )}
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/settings')}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v6M12 17v6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24" stroke="currentColor" strokeWidth="2"/>
                  <path d="M1 12h6M17 12h6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">Settings</span>
                <span className="item-subtitle">Preferences & privacy</span>
              </div>
            </button>

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item help-item"
              onClick={() => handleNavigation('/help')}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="17" r="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">Help & Support</span>
                <span className="item-subtitle">Get help or contact us</span>
              </div>
            </button>

            <button 
              className="dropdown-item logout-item"
              onClick={handleLogout}
            >
              <div className="item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="item-content">
                <span className="item-title">Sign Out</span>
                <span className="item-subtitle">Logout from your account</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;