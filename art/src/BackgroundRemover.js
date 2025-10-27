import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BackgroundRemover.css';

const BackgroundRemover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('automatic');
  const [precision, setPrecision] = useState(7);
  const [outputFormat, setOutputFormat] = useState('png');
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

  const removalMethods = [
    {
      id: 'automatic',
      name: 'AI Automatic',
      description: 'Advanced AI automatically detects and removes background',
      icon: '🤖',
      features: ['Smart edge detection', 'Hair & fur preservation', 'Ultra-fast processing']
    },
    {
      id: 'precise',
      name: 'Precision Mode',
      description: 'High-precision removal for complex subjects',
      icon: '🎯',
      features: ['Pixel-perfect edges', 'Complex object handling', 'Professional quality']
    },
    {
      id: 'soft-edge',
      name: 'Soft Edge',
      description: 'Gentle removal with smooth, feathered edges',
      icon: '🌟',
      features: ['Soft transitions', 'Natural blending', 'Portrait optimized']
    }
  ];

  const handleStartProcessing = () => {
    navigate('/process', {
      state: {
        image: uploadedImage,
        selectedTool: 'background-remove',
        selectedStyle: selectedMethod,
        customPrompt: `${selectedMethod} background removal with ${precision}/10 precision, output as ${outputFormat}`,
        intensity: precision,
        backendConnected: user?.backendConnected || false,
        mode: user?.backendConnected ? 'backend' : 'demo'
      }
    });
  };

  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="background-remover-container">
      <div className="background-remover-content">
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/get-started')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Upload
          </button>
          
          <div className="header-content">
            <h1 className="page-title">✂️ Professional Background Remover</h1>
            <p className="page-description">
              Remove backgrounds with AI precision and get perfect cutouts
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
              <h3>Original Image</h3>
              <p>{uploadedImage.name}</p>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div className="method-selection-section">
          <h2 className="section-title">Choose Removal Method</h2>
          <p className="section-description">
            Select the AI method that best fits your image type
          </p>
          
          <div className="methods-grid">
            {removalMethods.map(method => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              >
                <div className="method-icon">{method.icon}</div>
                <h3 className="method-name">{method.name}</h3>
                <p className="method-description">{method.description}</p>
                
                <div className="method-features">
                  {method.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {selectedMethod === method.id && (
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

        {/* Settings */}
        <div className="settings-section">
          <h2 className="section-title">Removal Settings</h2>
          
          <div className="settings-grid">
            <div className="setting-group">
              <label className="setting-label">
                🎯 Edge Precision
                <span className="setting-value">{precision}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value))}
                className="precision-slider"
              />
              <div className="slider-labels">
                <span>Soft</span>
                <span>Balanced</span>
                <span>Sharp</span>
              </div>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">📄 Output Format</label>
              <div className="format-options">
                <button
                  onClick={() => setOutputFormat('png')}
                  className={`format-button ${outputFormat === 'png' ? 'selected' : ''}`}
                >
                  PNG (Transparent)
                </button>
                <button
                  onClick={() => setOutputFormat('jpg')}
                  className={`format-button ${outputFormat === 'jpg' ? 'selected' : ''}`}
                >
                  JPG (White BG)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <div className="process-section">
          <div className="selected-summary">
            <h3>🎯 Background Removal Configuration</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Method:</span>
                <span className="summary-value">{removalMethods.find(m => m.id === selectedMethod)?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Precision:</span>
                <span className="summary-value">{precision}/10</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Output:</span>
                <span className="summary-value">{outputFormat.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStartProcessing}
            className="process-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Remove Background with AI
          </button>
          
          <div className="process-info">
            <span>✂️ Professional background removal</span>
            <span>⏱️ Processing time: 15-30 seconds</span>
            <span>🎯 Perfect edge detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;