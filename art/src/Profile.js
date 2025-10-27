import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { getUserStats } from './utils/artworkUtils';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    artworks: 0,
    transformations: 0,
    dayStreak: 0
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Passionate artist creating stunning visuals with AI.',
    location: user?.location || '',
    website: user?.website || ''
  });

  // Load user statistics on component mount
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
      
      // Update form data with user profile data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Art enthusiast exploring the possibilities of AI creativity.',
        location: user.location || '',
        website: user.website || ''
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || 'Passionate artist creating stunning visuals with AI.',
      location: user?.location || 'New York, USA',
      website: user?.website || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=120&background=667eea&color=fff`;
                }}
              />
              <button className="avatar-edit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div className="membership-status">
              <div className="membership-badge" style={{ color: '#3B82F6' }}>
                <span className="badge-icon">⭐</span>
                <span>{user.membership}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://"
                  />
                </div>
                
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">Save Changes</button>
                  <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <div className="profile-name-section">
                  <h1 className="profile-name">{user.name}</h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="edit-profile-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Edit Profile
                  </button>
                </div>
                
                <p className="profile-bio">{formData.bio}</p>
                
                <div className="profile-meta">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{formData.location}</span>
                  </div>
                  
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  
                  {formData.website && (
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2"/>
                        <path d="m14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <a href={formData.website} target="_blank" rel="noopener noreferrer">
                        {formData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-info">
              <span className="stat-number">{userStats.artworks}</span>
              <span className="stat-label">Artworks Created</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-number">{userStats.transformations}</span>
              <span className="stat-label">Transformations</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-number">{userStats.dayStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-info">
              <span className="stat-number">{user.membership}</span>
              <span className="stat-label">Membership</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🎨</div>
            <div className="activity-content">
              <span className="activity-text">Created "Sunset Dreams" artwork</span>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-content">
              <span className="activity-text">Upgraded to Pro membership</span>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">🖼️</div>
            <div className="activity-content">
              <span className="activity-text">Applied Van Gogh style to portrait</span>
              <span className="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;