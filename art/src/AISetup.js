import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from './services/api';
import './AISetup.css';

const AISetup = () => {
  const navigate = useNavigate();
  const [aiStatus, setAiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [setupGuide, setSetupGuide] = useState(null);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.backendConnected && user.token) {
        // Check backend AI status
        const response = await apiService.apiCall('/admin/config/ai-status');
        if (response.success) {
          setAiStatus(response.data);
        }
      } else {
        // Demo mode
        setAiStatus({
          processing_mode: 'DEMO',
          message: 'Connect backend for real AI processing options'
        });
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      setAiStatus({
        processing_mode: 'UNKNOWN',
        message: 'Could not check AI processing status'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSetupGuide = async () => {
    try {
      const response = await apiService.apiCall('/admin/config/setup-guide');
      if (response.success) {
        setSetupGuide(response.data);
        setShowSetupGuide(true);
      }
    } catch (error) {
      console.error('Failed to load setup guide:', error);
    }
  };

  const getStatusColor = (mode) => {
    switch (mode) {
      case 'REAL_AI': return '#4CAF50';
      case 'SIMULATION': return '#FF9800';
      case 'DEMO': return '#2196F3';
      case 'DISABLED': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (mode) => {
    switch (mode) {
      case 'REAL_AI': return '🤖';
      case 'SIMULATION': return '🎭';
      case 'DEMO': return '🎨';
      case 'DISABLED': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="ai-setup-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Checking AI processing status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-setup-container">
      <div className="ai-setup-content">
        {/* Header */}
        <div className="setup-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back
          </button>
          
          <div className="header-content">
            <h1>AI Processing Setup</h1>
            <p>Configure real AI processing for professional results</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="current-status">
          <div className="status-card">
            <div className="status-header">
              <div 
                className="status-icon"
                style={{ backgroundColor: getStatusColor(aiStatus?.processing_mode) }}
              >
                {getStatusIcon(aiStatus?.processing_mode)}
              </div>
              <div className="status-info">
                <h3>Current Status: {aiStatus?.processing_mode?.replace('_', ' ')}</h3>
                <p>{aiStatus?.message}</p>
              </div>
            </div>

            {aiStatus && (
              <div className="status-details">
                <div className="detail-grid">
                  <div className="detail-item priority-1">
                    <span className="detail-label">🥇 OpenAI (DALL-E 3 + GPT-4)</span>
                    <span className={`detail-status ${aiStatus.openai_configured ? 'configured' : 'not-configured'}`}>
                      {aiStatus.openai_configured ? '🚀 ULTIMATE QUALITY!' : '❌ Not Set'}
                    </span>
                  </div>
                  
                  <div className="detail-item priority-2">
                    <span className="detail-label">🥈 Stability AI (Stable Diffusion XL)</span>
                    <span className={`detail-status ${aiStatus.stability_configured ? 'configured' : 'not-configured'}`}>
                      {aiStatus.stability_configured ? '💎 PROFESSIONAL!' : '❌ Not Set'}
                    </span>
                  </div>
                  
                  <div className="detail-item priority-3">
                    <span className="detail-label">🥉 Hugging Face (Multi-Model)</span>
                    <span className={`detail-status ${aiStatus.huggingface_configured ? 'configured' : 'not-configured'}`}>
                      {aiStatus.huggingface_configured ? '⭐ EXCELLENT!' : '❌ Not Set'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🔄 Replicate API</span>
                    <span className={`detail-status ${aiStatus.replicate_configured ? 'configured' : 'not-configured'}`}>
                      {aiStatus.replicate_configured ? '✅ Backup Ready' : '⚪ Backup Option'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🎨 DeepAI</span>
                    <span className={`detail-status ${aiStatus.deepai_configured ? 'configured' : 'not-configured'}`}>
                      {aiStatus.deepai_configured ? '✅ Backup Ready' : '⚪ Backup Option'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🛡️ Fallback Mode</span>
                    <span className={`detail-status ${aiStatus.fallback_enabled ? 'enabled' : 'disabled'}`}>
                      {aiStatus.fallback_enabled ? '✅ Protected' : '❌ Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          {aiStatus?.processing_mode === 'REAL_AI' ? (
            <div className="success-card">
              <div className="card-icon success">🎉</div>
              <h3>ULTIMATE AI POWER ACTIVATED!</h3>
              <p>Your Art Generator is now powered by OpenAI DALL-E 3, Stability AI, and Hugging Face - the ultimate AI processing setup!</p>
              <div className="card-actions">
                <button onClick={() => navigate('/get-started')} className="primary-button">
                  Start Creating Art
                </button>
                <button onClick={checkAIStatus} className="secondary-button">
                  Refresh Status
                </button>
              </div>
            </div>
          ) : (
            <div className="setup-cards">
              <div className="setup-card recommended">
                <div className="card-badge">🎉 ALL APIS READY!</div>
                <div className="card-icon">🔥</div>
                <h3>ULTIMATE AI SETUP READY!</h3>
                <p>OpenAI, Stability AI, and Hugging Face are all pre-configured for maximum AI power!</p>
                <div className="card-features">
                  <span>🥇 OpenAI DALL-E 3 + GPT-4 Vision</span>
                  <span>🥈 Stability AI Stable Diffusion XL</span>
                  <span>🥉 Hugging Face Multi-Models</span>
                  <span>🛡️ Smart Fallback System</span>
                </div>
                <button onClick={loadSetupGuide} className="primary-button">
                  View All APIs Details
                </button>
              </div>

              <div className="setup-card">
                <div className="card-icon">🎭</div>
                <h3>Continue with Demo Mode</h3>
                <p>Use simulation processing for testing and demonstration</p>
                <div className="card-features">
                  <span>✅ No Setup Required</span>
                  <span>✅ Instant Processing</span>
                  <span>✅ Demo Quality</span>
                  <span>⚠️ Limited Features</span>
                </div>
                <button onClick={() => navigate('/get-started')} className="secondary-button">
                  Use Demo Mode
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Setup Guide Modal */}
        {showSetupGuide && setupGuide && (
          <div className="setup-modal-overlay" onClick={() => setShowSetupGuide(false)}>
            <div className="setup-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{setupGuide.title}</h2>
                <button onClick={() => setShowSetupGuide(false)} className="close-button">×</button>
              </div>
              
              <div className="modal-content">
                <p className="modal-description">{setupGuide.description}</p>
                
                {/* Quick Start */}
                <div className="quick-start-section">
                  <h3>{setupGuide.quick_start?.title}</h3>
                  <div className="setup-steps">
                    {setupGuide.quick_start?.steps?.map((step, index) => (
                      <div key={index} className="setup-step">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Providers */}
                <div className="api-providers">
                  <h3>Choose Your AI Provider</h3>
                  {Object.entries(setupGuide.apis || {}).map(([key, api]) => (
                    <div key={key} className="api-card">
                      <div className="api-header">
                        <h4>{api.name}</h4>
                        <div className="api-cost">{api.cost}</div>
                      </div>
                      <div className="api-features">
                        {api.features?.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                      <div className="api-setup">
                        {api.setup?.map((step, index) => (
                          <div key={index} className="setup-instruction">
                            {step}
                          </div>
                        ))}
                      </div>
                      <a href={api.website} target="_blank" rel="noopener noreferrer" className="api-link">
                        Visit {api.name} →
                      </a>
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button onClick={() => setShowSetupGuide(false)} className="primary-button">
                    Got It!
                  </button>
                  <button onClick={checkAIStatus} className="secondary-button">
                    Check Status Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <h3>Processing Modes Explained</h3>
          <div className="mode-explanations">
            <div className="mode-card">
              <div className="mode-icon real-ai">🤖</div>
              <div className="mode-info">
                <h4>Real AI Processing</h4>
                <p>Uses genuine neural networks from providers like Replicate, DeepAI, and Stability AI for professional-grade transformations.</p>
                <ul>
                  <li>Processing time: 30-120 seconds</li>
                  <li>Professional quality results</li>
                  <li>Multiple AI models available</li>
                  <li>Requires API key setup</li>
                </ul>
              </div>
            </div>

            <div className="mode-card">
              <div className="mode-icon simulation">🎭</div>
              <div className="mode-info">
                <h4>Simulation Mode</h4>
                <p>Provides instant demo processing for testing the application flow without real AI processing.</p>
                <ul>
                  <li>Processing time: 2-5 seconds</li>
                  <li>Demo quality (original image returned)</li>
                  <li>Perfect for testing and demos</li>
                  <li>No setup required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISetup;