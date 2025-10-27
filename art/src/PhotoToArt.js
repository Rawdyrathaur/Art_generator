import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PhotoToArt.css';

const PhotoToArt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState('oil-painting');
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

  const artStyles = [
    {
      id: 'oil-painting',
      name: 'Oil Painting',
      description: 'Classic oil painting with thick brushstrokes and rich textures',
      preview: 'https://picsum.photos/seed/oil/200/200',
      features: ['Thick brushstrokes', 'Rich textures', 'Classical technique'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      description: 'Soft watercolor painting with transparent layers and flowing colors',
      preview: 'https://picsum.photos/seed/water/200/200',
      features: ['Transparent layers', 'Soft edges', 'Flowing colors'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'impressionist',
      name: 'Impressionist',
      description: 'Monet, Renoir inspired style with light brushstrokes and atmospheric effects',
      preview: 'https://picsum.photos/seed/impress/200/200',
      features: ['Light brushstrokes', 'Atmospheric', 'Color harmony'],
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 'abstract',
      name: 'Abstract Art',
      description: 'Modern abstract interpretation with geometric forms and bold colors',
      preview: 'https://picsum.photos/seed/abstract/200/200',
      features: ['Geometric forms', 'Bold colors', 'Modern style'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'digital-art',
      name: 'Digital Art',
      description: 'Contemporary digital artwork with sharp details and vibrant colors',
      preview: 'https://picsum.photos/seed/digital/200/200',
      features: ['Sharp details', 'Vibrant colors', 'Contemporary'],
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 'renaissance',
      name: 'Renaissance',
      description: 'Classical Renaissance style with detailed techniques and compositions',
      preview: 'https://picsum.photos/seed/renaissance/200/200',
      features: ['Classical technique', 'Detailed work', 'Historical style'],
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ];

  const handleStartProcessing = () => {
    navigate('/process', {
      state: {
        image: uploadedImage,
        selectedTool: 'photo-to-art',
        selectedStyle: selectedStyle,
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
    <div className="photo-to-art-container">
      <div className="photo-to-art-content">
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/get-started')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Upload
          </button>
          
          <div className="header-content">
            <h1 className="page-title">🎨 Photo to Art Studio</h1>
            <p className="page-description">
              Transform your photo into a beautiful artistic masterpiece
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
            </div>
          </div>
        </div>

        {/* Art Style Selection */}
        <div className="style-selection-section">
          <h2 className="section-title">Choose Your Art Style</h2>
          <p className="section-description">
            Select the artistic style you want to apply to your photo
          </p>
          
          <div className="art-styles-grid">
            {artStyles.map(style => (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`art-style-card ${selectedStyle === style.id ? 'selected' : ''}`}
              >
                <div className="style-preview" style={{ background: style.gradient }}>
                  <img 
                    src={style.preview} 
                    alt={style.name}
                    className="style-preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="style-overlay">
                    <h3 className="style-name">{style.name}</h3>
                  </div>
                </div>
                
                <div className="style-details">
                  <p className="style-description">{style.description}</p>
                  <div className="style-features">
                    {style.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedStyle === style.id && (
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
          <h2 className="section-title">Custom Art Direction</h2>
          <p className="section-description">
            Add specific instructions to personalize your artwork
          </p>
          
          <div className="prompt-input-container">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your artistic vision...

Examples:
• 'with dramatic lighting and deep shadows'
• 'in warm sunset colors with golden tones'
• 'with textured brushstrokes and vintage feel'
• 'bright and colorful with painterly effects'"
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
            <span>🎛️ Advanced Art Settings</span>
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
                  🎨 Artistic Intensity
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
                  <span>Subtle</span>
                  <span>Photorealistic</span>
                  <span>Highly Artistic</span>
                </div>
              </div>
              
              <div className="intensity-preview">
                {intensity <= 3 && (
                  <div className="intensity-desc subtle">
                    🎨 Subtle artistic effect - maintains photo realism with artistic touches
                  </div>
                )}
                {intensity > 3 && intensity <= 7 && (
                  <div className="intensity-desc balanced">
                    ⚖️ Balanced artistic transformation - recognizable but clearly artistic
                  </div>
                )}
                {intensity > 7 && (
                  <div className="intensity-desc dramatic">
                    🔥 Highly artistic - dramatic transformation into pure artwork
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Process Button */}
        <div className="process-section">
          <div className="selected-summary">
            <h3>🎯 Your Art Configuration</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Style:</span>
                <span className="summary-value">{artStyles.find(s => s.id === selectedStyle)?.name}</span>
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
            Start Creating Art Masterpiece
          </button>
          
          <div className="process-info">
            <span>⏱️ Processing time: 30-90 seconds with real AI</span>
            <span>🎨 Professional artistic transformation</span>
            <span>✨ AI-powered creative interpretation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoToArt;