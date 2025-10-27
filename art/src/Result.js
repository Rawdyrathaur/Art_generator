import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const { result, selectedTool, backendConnected, mode } = location.state || {};

  // Redirect if no result data
  if (!result) {
    navigate('/get-started');
    return null;
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = result.processedUrl || result.originalUrl;
      link.download = `artify-${selectedTool}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My AI Art Creation',
          text: `Check out my ${selectedTool} artwork created with Artify Studio!`,
          url: window.location.href
        });
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleCreateAnother = () => {
    navigate('/get-started');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const getToolDisplayName = (tool) => {
    const toolNames = {
      'photo-to-art': 'Photo to Art',
      'style-transfer': 'Style Transfer',
      'background-remove': 'Background Remover',
      'color-enhance': 'Color Enhancer',
      'vintage-filter': 'Vintage Filter',
      'sketch-maker': 'Sketch Maker'
    };
    return toolNames[tool] || tool;
  };

  return (
    <div className="result-container">
      <div className="result-content">
        {/* Header */}
        <div className="result-header">
          <button onClick={() => navigate('/get-started')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Upload
          </button>
          
          <div className="header-info">
            <h1>🎨 Your Masterpiece is Ready!</h1>
            <div className="creation-info">
              <span className="tool-name">{getToolDisplayName(selectedTool)}</span>
              {result.selectedStyle && result.selectedStyle !== 'default' && (
                <>
                  <span className="separator">•</span>
                  <span className="style-name">{result.selectedStyle.replace('-', ' ')}</span>
                </>
              )}
              <span className="separator">•</span>
              <span className="processing-time">
                {result.processingTime}s processing time
              </span>
              {result.intensity && result.intensity !== 7 && (
                <>
                  <span className="separator">•</span>
                  <span className="intensity-badge">Intensity: {result.intensity}/10</span>
                </>
              )}
              {result.aiService && (
                <>
                  <span className="separator">•</span>
                  <span className="ai-service-badge">
                    {result.aiService === 'openai' && '🤖 OpenAI DALL-E'}
                    {result.aiService === 'stability' && '🎨 Stability AI'}
                    {result.aiService === 'huggingface' && '🤗 HuggingFace'}
                    {result.aiService === 'replicate' && '🔄 Replicate'}
                    {result.aiService === 'enhanced-demo' && '🎭 Enhanced Demo'}
                  </span>
                </>
              )}
              {result.demo && !result.aiService && (
                <>
                  <span className="separator">•</span>
                  <span className="demo-badge">Demo Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="connection-status">
            {backendConnected ? (
              <span className="status-connected">🟢 Backend</span>
            ) : (
              <span className="status-demo">🟡 Demo</span>
            )}
          </div>
        </div>

        {/* Main Result Display */}
        <div className="result-display">
          <div className="image-comparison">
            {/* Original Image */}
            <div className="image-container original">
              <div className="image-wrapper">
                <img 
                  src={result.originalUrl} 
                  alt="Original" 
                  className="result-image"
                />
                <div className="image-overlay">
                  <span className="image-label">Original</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="transform-arrow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>

            {/* Processed Image */}
            <div className="image-container processed">
              <div className="image-wrapper">
                <img 
                  src={result.processedUrl || result.originalUrl} 
                  alt="Processed" 
                  className="result-image"
                />
                <div className="image-overlay">
                  <span className="image-label">AI Enhanced</span>
                  {!result.demo && (
                    <div className="quality-badge">HD Quality</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transformation Details */}
          {(result.customPrompt || result.selectedStyle !== 'default' || result.intensity !== 7) && (
            <div className="transformation-details">
              <h3>🎯 Transformation Applied</h3>
              <div className="details-grid">
                {result.selectedStyle && result.selectedStyle !== 'default' && (
                  <div className="detail-item">
                    <div className="detail-label">Artistic Style</div>
                    <div className="detail-value">{result.selectedStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  </div>
                )}
                {result.intensity && result.intensity !== 7 && (
                  <div className="detail-item">
                    <div className="detail-label">Transformation Intensity</div>
                    <div className="detail-value">
                      {result.intensity}/10 
                      <span className="intensity-desc">
                        {result.intensity <= 3 ? ' (Subtle)' : result.intensity <= 7 ? ' (Balanced)' : ' (Dramatic)'}
                      </span>
                    </div>
                  </div>
                )}
                {result.customPrompt && (
                  <div className="detail-item prompt-detail">
                    <div className="detail-label">Custom Prompt</div>
                    <div className="detail-value">"{result.customPrompt}"</div>
                  </div>
                )}
              </div>
              
              <div className="transformation-summary">
                <div className="summary-icon">✨</div>
                <div className="summary-text">
                  Your image has been transformed using advanced AI algorithms to create a unique artistic interpretation
                  {result.customPrompt ? ' based on your custom prompt' : ''}.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <button 
              onClick={handleDownload} 
              disabled={downloading}
              className="action-button primary"
            >
              {downloading ? (
                <>
                  <div className="spinner-small"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Download HD
                </>
              )}
            </button>

            <button 
              onClick={handleShare} 
              disabled={sharing}
              className="action-button secondary"
            >
              {sharing ? (
                <>
                  <div className="spinner-small"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Share
                </>
              )}
            </button>

            <button onClick={handleCreateAnother} className="action-button tertiary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create Another
            </button>
          </div>
        </div>

        {/* Result Stats */}
        <div className="result-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎨</div>
              <div className="stat-info">
                <h4>Style Applied</h4>
                <p>{getToolDisplayName(selectedTool)}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h4>Processing Time</h4>
                <p>{result.processingTime} seconds</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h4>Quality</h4>
                <p>{result.demo ? 'Demo Quality' : 'HD Quality'}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">🤖</div>
              <div className="stat-info">
                <h4>AI Engine</h4>
                <p>{backendConnected ? 'Server AI' : 'Demo Engine'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="additional-actions">
          <h3>What's Next?</h3>
          <div className="action-cards">
            <div className="action-card" onClick={handleCreateAnother}>
              <div className="card-icon">🎨</div>
              <h4>Create More Art</h4>
              <p>Transform another image with different styles</p>
            </div>

            {backendConnected && (
              <div className="action-card" onClick={handleViewDashboard}>
                <div className="card-icon">📁</div>
                <h4>View Gallery</h4>
                <p>See all your created artworks in one place</p>
              </div>
            )}

            <div className="action-card">
              <div className="card-icon">⚙️</div>
              <h4>Advanced Tools</h4>
              <p>Try more advanced AI tools and features</p>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {result.demo && (
          <div className="demo-notice">
            <div className="notice-icon">💡</div>
            <div className="notice-content">
              <h4>Demo Mode Active</h4>
              <p>
                You're using demo mode. Connect the backend for real AI processing, 
                higher quality results, and project management features.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;