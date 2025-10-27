import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    theme: user?.preferences?.theme || 'dark',
    language: 'en',
    timezone: 'UTC',
    
    // Notifications
    emailNotifications: user?.preferences?.notifications || true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    
    // Privacy
    profileVisibility: 'public',
    showActivity: true,
    dataSharing: false,
    analyticsOptOut: false,
    
    // AI Preferences
    autoSave: user?.preferences?.autoSave || true,
    qualityPreference: 'high',
    styleRecommendations: true,
    experimentalFeatures: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Update user preferences
      await updateProfile({
        preferences: {
          ...user.preferences,
          theme: settings.theme,
          notifications: settings.emailNotifications,
          autoSave: settings.autoSave
        }
      });
      
      // Here you would also save other settings to your backend
      console.log('Settings saved:', settings);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'ai', label: 'AI Preferences', icon: '🤖' }
  ];

  if (!user) {
    return (
      <div className="settings-container">
        <div className="settings-error">
          <h2>Please log in to access settings</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and privacy settings</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-main">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2 className="section-title">General Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">Theme</label>
                <p className="setting-description">Choose your preferred interface theme</p>
                <div className="setting-control">
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="setting-select"
                  >
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">Language</label>
                <p className="setting-description">Select your preferred language</p>
                <div className="setting-control">
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">Timezone</label>
                <p className="setting-description">Set your local timezone for accurate timestamps</p>
                <div className="setting-control">
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="setting-select"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Settings</h2>
              
              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Email Notifications</label>
                    <p className="setting-description">Receive important updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Push Notifications</label>
                    <p className="setting-description">Get real-time notifications in your browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Marketing Emails</label>
                    <p className="setting-description">Receive promotional content and feature updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.marketingEmails}
                      onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Weekly Digest</label>
                    <p className="setting-description">Get a summary of your weekly activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.weeklyDigest}
                      onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2 className="section-title">Privacy & Security</h2>
              
              <div className="setting-group">
                <label className="setting-label">Profile Visibility</label>
                <p className="setting-description">Control who can see your profile and artworks</p>
                <div className="setting-control">
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={settings.profileVisibility === 'public'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">Public</span>
                      <span className="radio-description">Anyone can view your profile</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="friends"
                        checked={settings.profileVisibility === 'friends'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">Friends Only</span>
                      <span className="radio-description">Only your friends can see your profile</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={settings.profileVisibility === 'private'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">Private</span>
                      <span className="radio-description">Only you can see your profile</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Show Activity Status</label>
                    <p className="setting-description">Let others see when you're active</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.showActivity}
                      onChange={(e) => handleSettingChange('showActivity', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Data Sharing</label>
                    <p className="setting-description">Allow sharing anonymized usage data to improve our service</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.dataSharing}
                      onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="settings-section">
              <h2 className="section-title">AI Preferences</h2>
              
              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Auto-Save Results</label>
                    <p className="setting-description">Automatically save generated artworks to your gallery</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">Quality Preference</label>
                <p className="setting-description">Choose default quality for AI transformations</p>
                <div className="setting-control">
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="qualityPreference"
                        value="standard"
                        checked={settings.qualityPreference === 'standard'}
                        onChange={(e) => handleSettingChange('qualityPreference', e.target.value)}
                      />
                      <span className="radio-label">Standard</span>
                      <span className="radio-description">Good quality, faster processing</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="qualityPreference"
                        value="high"
                        checked={settings.qualityPreference === 'high'}
                        onChange={(e) => handleSettingChange('qualityPreference', e.target.value)}
                      />
                      <span className="radio-label">High Quality</span>
                      <span className="radio-description">Best quality, longer processing time</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Style Recommendations</label>
                    <p className="setting-description">Get personalized style suggestions based on your preferences</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.styleRecommendations}
                      onChange={(e) => handleSettingChange('styleRecommendations', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label className="setting-label">Experimental Features</label>
                    <p className="setting-description">Access beta features and new AI models (may be unstable)</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.experimentalFeatures}
                      onChange={(e) => handleSettingChange('experimentalFeatures', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button 
              onClick={saveSettings} 
              disabled={isLoading}
              className="save-button"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;