import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StyleTransfer.css';

const StyleTransfer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedArtist, setSelectedArtist] = useState('van-gogh');
  const [customPrompt, setCustomPrompt] = useState('');
  const [intensity, setIntensity] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [user, setUser] = useState(null);

  const { uploadedImage } = location.state || {};

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!uploadedImage) {
      navigate('/get-started');
    }
  }, [uploadedImage, navigate]);

  const artistStyles = [
    {
      id: 'van-gogh',
      name: 'Vincent van Gogh',
      period: '1853-1890',
      style: 'Post-Impressionism',
      description: 'Swirling brushstrokes, bold colors, and emotional intensity',
      preview: 'https://picsum.photos/seed/vangogh/200/200',
      features: ['Swirling brushstrokes', 'Bold colors', 'Emotional intensity'],
      signature: 'Starry Night, Sunflowers, Self-portraits',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    },
    {
      id: 'picasso',
      name: 'Pablo Picasso',
      period: '1881-1973',
      style: 'Cubism',
      description: 'Geometric forms, fragmented perspectives, and abstract representation',
      preview: 'https://picsum.photos/seed/picasso/200/200',
      features: ['Geometric forms', 'Fragmented views', 'Abstract faces'],
      signature: 'Les Demoiselles d\'Avignon, Guernica, Blue Period',
      gradient: 'linear-gradient(135deg, #4169E1 0%, #8A2BE2 100%)'
    },
    {
      id: 'monet',
      name: 'Claude Monet',
      period: '1840-1926',
      style: 'Impressionism',
      description: 'Soft light, atmospheric effects, and plein air painting',
      preview: 'https://picsum.photos/seed/monet/200/200',
      features: ['Soft light', 'Atmospheric', 'Color harmony'],
      signature: 'Water Lilies, Impression Sunrise, Rouen Cathedral',
      gradient: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)'
    },
    {
      id: 'da-vinci',
      name: 'Leonardo da Vinci',
      period: '1452-1519',
      style: 'Renaissance',
      description: 'Perfect proportions, sfumato technique, and scientific observation',
      preview: 'https://picsum.photos/seed/davinci/200/200',
      features: ['Perfect proportions', 'Sfumato technique', 'Classical beauty'],
      signature: 'Mona Lisa, The Last Supper, Vitruvian Man',
      gradient: 'linear-gradient(135deg, #CD853F 0%, #DEB887 100%)'
    },
    {
      id: 'hokusai',
      name: 'Katsushika Hokusai',
      period: '1760-1849',
      style: 'Japanese Ukiyo-e',
      description: 'Traditional Japanese woodblock prints with flowing lines',
      preview: 'https://picsum.photos/seed/hokusai/200/200',
      features: ['Flowing lines', 'Traditional patterns', 'Wave motifs'],
      signature: 'The Great Wave, Mount Fuji series, Manga',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)'
    },
    {
      id: 'kandinsky',
      name: 'Wassily Kandinsky',
      period: '1866-1944',
      style: 'Abstract Expressionism',
      description: 'Pure abstraction, spiritual colors, and musical compositions',
      preview: 'https://picsum.photos/seed/kandinsky/200/200',
      features: ['Pure abstraction', 'Spiritual colors', 'Musical rhythm'],
      signature: 'Composition series, Blue Rider, Color studies',
      gradient: 'linear-gradient(135deg, #FF1493 0%, #00CED1 100%)'
    }
  ];

  const handleStartProcessing = () => {
    navigate('/process', {
      state: {
        image: uploadedImage,
        selectedTool: 'style-transfer',
        selectedStyle: selectedArtist,
        customPrompt: customPrompt,
        intensity: intensity,
        backendConnected: user?.backendConnected || false,
        mode: user?.backendConnected ? 'backend' : 'demo'
      }
    });
  };

  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="style-transfer-container">
      <div className="style-transfer-content">
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/get-started')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Upload
          </button>
          
          <div className="header-content">
            <h1 className="page-title">🖼️ Master Artist Style Transfer</h1>
            <p className="page-description">
              Transform your photo in the style of history's greatest artists
            </p>
          </div>
        </div>

        {/* Image Preview */}
        <div className="image-preview-section">
          <div className="uploaded-image-container">
            <img 
              src={uploadedImage.data_url} 
              alt="Uploaded" 
              className="uploaded-image"
            />
            <div className="image-info">
              <h3>Your Photo</h3>
              <p>{uploadedImage.name}</p>
              <div className="transform-arrow">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Artist Selection */}
        <div className="artist-selection-section">
          <h2 className="section-title">Choose Your Master Artist</h2>
          <p className="section-description">
            Select the legendary artist whose style you want to apply to your photo
          </p>
          
          <div className="artists-grid">
            {artistStyles.map(artist => (
              <div
                key={artist.id}
                onClick={() => setSelectedArtist(artist.id)}
                className={`artist-card ${selectedArtist === artist.id ? 'selected' : ''}`}
              >
                <div className="artist-preview" style={{ background: artist.gradient }}>
                  <img 
                    src={artist.preview} 
                    alt={artist.name}
                    className="artist-preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="artist-overlay">
                    <h3 className="artist-name">{artist.name}</h3>
                    <p className="artist-period">{artist.period}</p>
                  </div>
                </div>
                
                <div className="artist-details">
                  <div className="artist-style-badge">{artist.style}</div>
                  <p className="artist-description">{artist.description}</p>
                  
                  <div className="artist-features">
                    {artist.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="signature-works">
                    <span className="signature-label">Famous Works:</span>
                    <p className="signature-text">{artist.signature}</p>
                  </div>
                </div>
                
                {selectedArtist === artist.id && (
                  <div className="selected-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Prompt Section */}
        <div className="prompt-section">
          <h2 className="section-title">Artistic Direction</h2>
          <p className="section-description">
            Add specific instructions to guide the artistic transformation
          </p>
          
          <div className="prompt-input-container">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enhance the artistic transformation...

Examples:
• 'with dramatic lighting and deep shadows like Caravaggio'
• 'using the blue period color palette with melancholy mood'
• 'with thick impasto technique and visible brushstrokes'
• 'in the style of a museum masterpiece with gold frame'"
              className="prompt-textarea"
              rows={5}
              maxLength={500}
            />
            <div className="prompt-counter">
              {customPrompt.length}/500 characters
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="advanced-settings">
          <button 
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>🎨 Advanced Style Settings</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              className={`toggle-icon ${showAdvanced ? 'rotated' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          
          {showAdvanced && (
            <div className="advanced-panel">
              <div className="setting-group">
                <label className="setting-label">
                  🎭 Style Transfer Intensity
                  <span className="setting-value">{intensity}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="intensity-slider"
                />
                <div className="slider-labels">
                  <span>Subtle Influence</span>
                  <span>Moderate Style</span>
                  <span>Full Transformation</span>
                </div>
              </div>
              
              <div className="intensity-preview">
                {intensity <= 3 && (
                  <div className="intensity-desc subtle">
                    🎨 Subtle artistic influence - maintains photo realism with artistic touches
                  </div>
                )}
                {intensity > 3 && intensity <= 7 && (
                  <div className="intensity-desc balanced">
                    🖼️ Moderate style transfer - clear artistic style while keeping subject recognizable
                  </div>
                )}
                {intensity > 7 && (
                  <div className="intensity-desc dramatic">
                    🎭 Full artistic transformation - complete style immersion like a museum painting
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Process Button */}
        <div className="process-section">
          <div className="selected-summary">
            <h3>🎯 Your Style Transfer Configuration</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Master Artist:</span>
                <span className="summary-value">{artistStyles.find(a => a.id === selectedArtist)?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Art Style:</span>
                <span className="summary-value">{artistStyles.find(a => a.id === selectedArtist)?.style}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Intensity:</span>
                <span className="summary-value">{intensity}/10</span>
              </div>
              {customPrompt && (
                <div className="summary-item">
                  <span className="summary-label">Custom Direction:</span>
                  <span className="summary-value">"{customPrompt.substring(0, 50)}{customPrompt.length > 50 ? '...' : ''}"</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleStartProcessing}
            className="process-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Transform in {artistStyles.find(a => a.id === selectedArtist)?.name} Style
          </button>
          
          <div className="process-info">
            <span>🎨 Master artist style application</span>
            <span>⏱️ Processing time: 30-90 seconds</span>
            <span>🖼️ Museum-quality artistic transformation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleTransfer;