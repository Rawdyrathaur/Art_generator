import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { getUserArtworks } from './utils/artworkUtils';
import './Gallery.css';

const Gallery = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user artworks from localStorage
  useEffect(() => {
    if (user) {
      loadUserArtworks();
    }
  }, [user]);

  const loadUserArtworks = async () => {
    try {
      setLoading(true);
      // Use utility function to get user artworks
      const artworks = getUserArtworks(user.email);
      setUserArtworks(artworks);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setUserArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All Artworks', count: userArtworks.length },
    { value: 'completed', label: 'Completed', count: userArtworks.filter(a => a.status === 'completed').length },
    { value: 'processing', label: 'Processing', count: userArtworks.filter(a => a.status === 'processing').length },
    { value: 'vangogh', label: 'Van Gogh', count: userArtworks.filter(a => a.style === 'Van Gogh').length },
    { value: 'picasso', label: 'Picasso', count: userArtworks.filter(a => a.style === 'Picasso').length }
  ];

  const filteredArtworks = userArtworks.filter(artwork => {
    if (filter === 'all') return true;
    if (filter === 'completed' || filter === 'processing') return artwork.status === filter;
    if (filter === 'vangogh') return artwork.style === 'Van Gogh';
    if (filter === 'picasso') return artwork.style === 'Picasso';
    return true;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular':
        return b.likes - a.likes;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="gallery-container">
        <div className="gallery-error">
          <h2>Please log in to view your gallery</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-loading">
          <div className="loading-spinner"></div>
          <h2>Loading your gallery...</h2>
          <p>Fetching your beautiful artworks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="gallery-title-section">
          <h1 className="gallery-title">My Gallery</h1>
          <p className="gallery-subtitle">Your AI-transformed masterpieces</p>
        </div>
        
        <div className="gallery-stats">
          <div className="stat-item">
            <span className="stat-number">{userArtworks.length}</span>
            <span className="stat-label">Total Artworks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userArtworks.reduce((sum, a) => sum + (a.likes || 0), 0)}</span>
            <span className="stat-label">Total Likes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(userArtworks.map(a => a.style)).size}</span>
            <span className="stat-label">Styles Used</span>
          </div>
        </div>
      </div>

      <div className="gallery-controls">
        <div className="gallery-filters">
          {filters.map(filterOption => (
            <button
              key={filterOption.value}
              className={`filter-btn ${filter === filterOption.value ? 'active' : ''}`}
              onClick={() => setFilter(filterOption.value)}
            >
              {filterOption.label}
              <span className="filter-count">{filterOption.count}</span>
            </button>
          ))}
        </div>
        
        <div className="gallery-sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <div className="gallery-grid">
        {sortedArtworks.map(artwork => (
          <div key={artwork.id} className="artwork-card">
            <div className="artwork-images">
              <div className="image-comparison">
                <div className="before-image">
                  <img src={artwork.originalImage} alt="Original" />
                  <div className="image-label">Original</div>
                </div>
                <div className="after-image">
                  <img src={artwork.transformedImage} alt="Transformed" />
                  <div className="image-label">Transformed</div>
                </div>
                <div className="comparison-divider">
                  <div className="divider-handle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {artwork.status === 'processing' && (
                <div className="processing-overlay">
                  <div className="processing-spinner"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
            
            <div className="artwork-info">
              <div className="artwork-header">
                <h3 className="artwork-title">{artwork.title}</h3>
                <div className="artwork-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="artwork-meta">
                <div className="style-badge">{artwork.style}</div>
                <div className="artwork-stats">
                  <div className="stat-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{artwork.likes}</span>
                  </div>
                  <div className="stat-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6M12 17v6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24" stroke="currentColor" strokeWidth="2"/>
                      <path d="M1 12h6M17 12h6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{formatDate(artwork.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {userArtworks.length === 0 ? (
        <div className="empty-gallery">
          <div className="empty-icon">🎨</div>
          <h3>Your gallery is empty</h3>
          <p>Start creating amazing AI artworks to see them here!</p>
          <div className="empty-actions">
            <button 
              className="create-artwork-btn primary"
              onClick={() => window.location.href = '/get-started'}
            >
              Create Your First Artwork
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              className="create-artwork-btn secondary"
              onClick={() => window.location.href = '/help'}
            >
              Learn How It Works
            </button>
          </div>
        </div>
      ) : sortedArtworks.length === 0 ? (
        <div className="empty-gallery">
          <div className="empty-icon">🔍</div>
          <h3>No artworks match your filters</h3>
          <p>Try adjusting your filters or create more artworks!</p>
          <button 
            className="create-artwork-btn primary"
            onClick={() => setFilter('all')}
          >
            Show All Artworks
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Gallery;