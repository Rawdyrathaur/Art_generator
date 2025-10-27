// src/GetStarted.js - Modern Upload Interface

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { addArtworkToGallery } from './utils/artworkUtils';
import apiService from './services/api';
import './GetStarted.css';

function GetStarted() {
  const { user, isAuthenticated, loading } = useAuth();
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedTool, setSelectedTool] = useState('photo-to-art');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [intensity, setIntensity] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication and AI status on component mount
  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate('/login');
      return;
    }
    
    // Check AI status if backend is connected
    if (user?.backendConnected && user?.token) {
      checkAIStatus();
    }
  }, [isAuthenticated, loading, navigate, user]);

  const checkAIStatus = async () => {
    try {
      const response = await apiService.apiCall('/admin/config/ai-status');
      if (response.success) {
        setAiStatus(response.data);
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      setAiStatus({
        processing_mode: 'DEMO',
        message: 'Demo mode - AI status check failed'
      });
    }
  };

  // Demo function to add sample artwork to gallery
  const addDemoArtwork = () => {
    if (!user) return;

    const demoArtworks = [
      {
        title: 'Sunset Dreams',
        style: 'Van Gogh',
        originalImage: 'https://images.unsplash.com/photo-1494790108755-2616c9c6cab8?w=400&h=300&fit=crop',
        transformedImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        status: 'completed'
      },
      {
        title: 'Urban Portrait',
        style: 'Picasso',
        originalImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        transformedImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        status: 'completed'
      },
      {
        title: 'Nature\'s Beauty',
        style: 'Watercolor',
        originalImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        transformedImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=300&fit=crop',
        status: 'completed'
      }
    ];

    const randomArtwork = demoArtworks[Math.floor(Math.random() * demoArtworks.length)];
    
    const newArtwork = addArtworkToGallery(user.email, {
      ...randomArtwork,
      userId: user.id
    });

    if (newArtwork) {
      alert(`Demo artwork "${newArtwork.title}" added to your gallery! Check the Gallery page to see it.`);
    } else {
      alert('Failed to add demo artwork. Please try again.');
    }
  };



  const styleOptions = {
    'photo-to-art': [
      { id: 'default', name: 'Auto Style', description: 'Let AI choose the best artistic style' },
      { id: 'oil-painting', name: 'Oil Painting', description: 'Classic oil painting texture and brushstrokes' },
      { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor painting effect' },
      { id: 'impressionist', name: 'Impressionist', description: 'Monet, Renoir inspired impressionist style' },
      { id: 'abstract', name: 'Abstract Art', description: 'Modern abstract artistic interpretation' },
      { id: 'digital-art', name: 'Digital Art', description: 'Modern digital artwork style' }
    ],
    'style-transfer': [
      { id: 'default', name: 'Auto Style', description: 'AI will choose the best style transfer' },
      { id: 'van-gogh', name: 'Van Gogh', description: 'Starry Night, Sunflowers style' },
      { id: 'picasso', name: 'Picasso', description: 'Cubist and blue period styles' },
      { id: 'monet', name: 'Monet', description: 'Water lilies, impressionist garden scenes' },
      { id: 'da-vinci', name: 'Da Vinci', description: 'Renaissance master techniques' },
      { id: 'hokusai', name: 'Hokusai', description: 'Japanese woodblock print style' }
    ],
    'background-remove': [
      { id: 'default', name: 'Clean Removal', description: 'Professional background removal' },
      { id: 'soft-edge', name: 'Soft Edges', description: 'Gentle edge blending' },
      { id: 'precise', name: 'Precise Cut', description: 'Sharp, exact edges' }
    ],
    'color-enhance': [
      { id: 'default', name: 'Auto Enhance', description: 'AI-powered color enhancement' },
      { id: 'vibrant', name: 'Vibrant Colors', description: 'Boost saturation and vibrancy' },
      { id: 'natural', name: 'Natural Colors', description: 'Subtle, realistic enhancement' },
      { id: 'cinematic', name: 'Cinematic', description: 'Movie-grade color grading' }
    ],
    'vintage-filter': [
      { id: 'default', name: 'Classic Vintage', description: 'Timeless vintage look' },
      { id: '1950s', name: '1950s Style', description: 'Mid-century vintage aesthetic' },
      { id: '1970s', name: '1970s Style', description: 'Retro 70s color palette' },
      { id: 'sepia', name: 'Sepia Tone', description: 'Classic sepia brown tones' },
      { id: 'film-grain', name: 'Film Grain', description: 'Authentic film texture' }
    ],
    'sketch-maker': [
      { id: 'default', name: 'Pencil Sketch', description: 'Classic pencil drawing style' },
      { id: 'charcoal', name: 'Charcoal', description: 'Dark charcoal sketch effect' },
      { id: 'pen-ink', name: 'Pen & Ink', description: 'Detailed pen and ink drawing' },
      { id: 'line-art', name: 'Line Art', description: 'Clean vector-style line art' }
    ]
  };

  const tools = [
    {
      id: 'photo-to-art',
      name: 'Photo to Art',
      description: 'Transform photos into artistic masterpieces using DALL-E 3 + Stability AI',
      icon: '🎨',
      popular: true,
      features: ['OpenAI DALL-E 3', 'Stability AI XL', 'Ultra-high quality', 'Multiple art styles'],
      aiModels: ['OpenAI', 'Stability AI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/photo1/150/150',
        after: 'https://picsum.photos/seed/art1/150/150'
      },
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      previewText: 'Transform any photo into a beautiful artistic painting with professional AI models.'
    },
    {
      id: 'style-transfer',
      name: 'Style Transfer',
      description: 'Apply Van Gogh, Picasso styles with professional AI models',
      icon: '🖼️',
      popular: true,
      features: ['Famous artist styles', 'Stable Diffusion XL', 'Custom prompts', 'Style blending'],
      aiModels: ['OpenAI', 'Stability AI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/style1/150/150',
        after: 'https://picsum.photos/seed/styleart1/150/150'
      },
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      previewText: 'Apply famous art styles like Van Gogh, Picasso, and Monet to your photos.'
    },
    {
      id: 'background-remove',
      name: 'Background Remover',
      description: 'Professional background removal with Stability AI precision',
      icon: '✂️',
      popular: false,
      features: ['Stability AI masking', 'Perfect edge detection', 'Transparent PNG', 'Batch processing'],
      aiModels: ['Stability AI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/bg1/150/150',
        after: 'https://picsum.photos/seed/nobg1/150/150'
      },
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      previewText: 'Remove backgrounds with perfect edge detection and transparency.'
    },
    {
      id: 'color-enhance',
      name: 'Color Enhancer',
      description: 'AI-powered upscaling and color enhancement',
      icon: '🌈',
      popular: false,
      features: ['Stability AI upscale', '4K enhancement', 'Smart color correction', 'Detail preservation'],
      aiModels: ['Stability AI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/color1/150/150',
        after: 'https://picsum.photos/seed/enhanced1/150/150'
      },
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      previewText: 'Enhance colors, increase resolution, and improve image quality with AI.'
    },
    {
      id: 'vintage-filter',
      name: 'Vintage Filter',
      description: 'Create vintage effects with DALL-E 3 and Stable Diffusion',
      icon: '📸',
      popular: true,
      features: ['Film grain effects', 'Sepia processing', 'Retro AI styles', 'Professional quality'],
      aiModels: ['OpenAI', 'Stability AI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/vintage1/150/150',
        after: 'https://picsum.photos/seed/vintageold1/150/150'
      },
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      previewText: 'Add vintage film effects, sepia tones, and retro styling to your photos.'
    },
    {
      id: 'sketch-maker',
      name: 'Sketch Maker',
      description: 'Convert photos to pencil sketches with advanced AI',
      icon: '✏️',
      popular: false,
      features: ['Pencil AI textures', 'Line art generation', 'Adjustable details', 'Professional sketches'],
      aiModels: ['OpenAI', 'Hugging Face'],
      previewImages: {
        before: 'https://picsum.photos/seed/sketch1/150/150',
        after: 'https://picsum.photos/seed/pencil1/150/150'
      },
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      previewText: 'Convert photos into beautiful pencil sketches and line art drawings.'
    }
  ];

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValid;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      const fileId = Date.now() + Math.random();
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [fileId]: Math.min(currentProgress + 10, 100) };
        });
      }, 100);

      reader.onload = (e) => {
        const newImage = {
          id: fileId,
          file,
          data_url: e.target.result,
          name: file.name,
          size: file.size
        };
        
        setImages(prev => [...prev, newImage]);
        
        // Clear progress after upload
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 500);
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  // Remove image
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Process and navigate to tool-specific pages
  const handleContinue = async () => {
    if (images.length === 0) return;
    
    setUploadProgress(prev => ({ ...prev, uploading: true }));
    setError(null);
    
    try {
      // Navigate to specific tool page based on selection
      const uploadedImage = images[0];
      
      switch (selectedTool) {
        case 'photo-to-art':
          navigate('/photo-to-art', { 
            state: { uploadedImage } 
          });
          break;
        case 'style-transfer':
          navigate('/style-transfer', { 
            state: { uploadedImage } 
          });
          break;
        case 'background-remove':
          navigate('/background-remover', { 
            state: { uploadedImage } 
          });
          break;
        case 'color-enhance':
          navigate('/color-enhancer', { 
            state: { uploadedImage } 
          });
          break;
        case 'vintage-filter':
          navigate('/vintage-filter', { 
            state: { uploadedImage } 
          });
          break;
        case 'sketch-maker':
          navigate('/sketch-maker', { 
            state: { uploadedImage } 
          });
          break;
        default:
          // Fallback to old behavior if tool not recognized
          navigate('/process', { 
            state: { 
              image: images[0],
              selectedTool,
              selectedStyle,
              customPrompt,
              intensity,
              allImages: images,
              backendConnected: false,
              mode: 'demo'
            } 
          });
      }
      
    } catch (error) {
      console.error('Navigation failed:', error);
      setError('Failed to navigate to tool page');
    } finally {
      setUploadProgress(prev => ({ ...prev, uploading: false }));
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Don't render if user is not loaded yet
  if (!user) {
    return null; // Just return null instead of loading message
  }

  return (
    <div className="get-started-container">
      {/* Floating particles for visual appeal */}
      <div className="floating-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      <div className="get-started-content">
        {/* Header */}
        <div className="page-header">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
          
          <div className="header-content">
            <h1 className="page-title">Create Amazing Art</h1>
            <p className="page-description">
              Upload your photos and choose your preferred AI tool to get started
            </p>
          </div>
        </div>

        {/* Tool Selection */}
        <div className="tool-selection-section">
          <h2 className="section-title">Choose Your Tool</h2>
          
          
          <div className="tools-grid">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`tool-card ${selectedTool === tool.id ? 'selected' : ''}`}
                data-tool={tool.id}
              >
                {tool.popular && <div className="popular-badge">Popular</div>}
                <div className="tool-icon">{tool.icon}</div>
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-description">{tool.description}</p>
                
                {/* Tool Features */}
                <div className="tool-features">
                  {tool.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* AI Models */}
                <div className="ai-models">
                  <span className="ai-label">AI Models:</span>
                  {tool.aiModels.map((model, index) => (
                    <span key={index} className={`ai-badge ai-${model.toLowerCase().replace(' ', '-')}`}>
                      {model}
                    </span>
                  ))}
                </div>
                
                {selectedTool === tool.id && (
                  <div className="selected-indicator">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Section */}
        {selectedTool && (
          <div className="customization-section">
            <h2 className="section-title">Customize Your Art</h2>
            
            {/* Style Selection */}
            <div className="style-selection">
              <h3 className="customization-subtitle">Choose Art Style</h3>
              <div className="style-grid">
                {styleOptions[selectedTool]?.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
                  >
                    <div className="style-name">{style.name}</div>
                    <div className="style-description">{style.description}</div>
                    {selectedStyle === style.id && (
                      <div className="style-selected-indicator">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="prompt-section">
              <h3 className="customization-subtitle">Custom Prompt (Optional)</h3>
              <div className="prompt-input-container">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`Describe how you want your ${tools.find(t => t.id === selectedTool)?.name.toLowerCase()} to look... 
Examples:
• "in the style of Van Gogh with swirling brushstrokes"
• "vibrant colors with a dreamy, ethereal atmosphere"
• "dark moody tones with dramatic lighting"`}
                  className="prompt-textarea"
                  rows={4}
                  maxLength={500}
                />
                <div className="prompt-counter">
                  {customPrompt.length}/500 characters
                </div>
              </div>
              <div className="prompt-tips">
                <div className="prompt-tip">
                  💡 <strong>Tip:</strong> Be specific about colors, mood, and artistic style for best results
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="advanced-settings">
              <button 
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span>Advanced Settings</span>
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
                      Transformation Intensity
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
                      <span>Dramatic</span>
                    </div>
                  </div>
                  
                  <div className="intensity-preview">
                    {intensity <= 3 && (
                      <div className="intensity-desc subtle">
                        🎨 Subtle transformation - maintains original photo details
                      </div>
                    )}
                    {intensity > 3 && intensity <= 7 && (
                      <div className="intensity-desc balanced">
                        ⚖️ Balanced transformation - artistic but recognizable
                      </div>
                    )}
                    {intensity > 7 && (
                      <div className="intensity-desc dramatic">
                        🔥 Dramatic transformation - highly artistic interpretation
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="upload-title">Upload Your Photos</h2>
          <p className="upload-subtitle">Choose your images to transform into amazing artwork</p>
          
          {/* Drop Zone */}
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
            
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {isDragging ? (
              <div>
                <h3 className="upload-text">Drop your images here!</h3>
                <p className="upload-hint">Release to upload your files</p>
              </div>
            ) : (
              <div>
                <h3 className="upload-text">Drag & drop your images here</h3>
                <p className="upload-hint">or click to browse files</p>
                <button className="browse-button" type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Browse Files
                </button>
                <div className="file-formats">
                  <p>Supports: JPG, PNG, WebP • Max size: 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="image-grid">
              {images.map(image => (
                <div key={image.id} className="image-item">
                  <img 
                    src={image.data_url} 
                    alt={image.name}
                    className="image-preview"
                  />
                  <div className="image-info">
                    <h4 className="image-name">{image.name}</h4>
                    <p className="image-size">{formatFileSize(image.size)}</p>
                  </div>
                  
                  {uploadProgress[image.id] !== undefined && (
                    <div className="progress-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${uploadProgress[image.id]}%` }}
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeImage(image.id)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-display">
              <div className="error-icon">⚠️</div>
              <div className="error-message">{error}</div>
              <button 
                className="error-dismiss"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </div>
          )}

          {/* Process Button */}
          <div className="process-section">
            <button
              onClick={handleContinue}
              disabled={images.length === 0 || uploadProgress.uploading}
              className="process-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
{uploadProgress.uploading ? 'Processing...' : images.length > 0 ? `Start AI Processing` : 'Upload Images First'}
            </button>
            
            {/* Demo Button */}
            <button
              onClick={addDemoArtwork}
              className="demo-button"
              title="Add a sample artwork to your gallery for testing"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Add Demo Artwork
            </button>
            
            {images.length > 0 && (
              <div className="ready-status">
                <div className="status-icon">✨</div>
                <p>Ready to create amazing artwork with <strong>{tools.find(t => t.id === selectedTool)?.name}</strong></p>
                
                {/* AI Status Display */}
                {aiStatus && (
                  <div className="ai-status-display">
                    <div className="ai-mode-indicator">
                      {aiStatus.processing_mode === 'REAL_AI' ? (
                        <span className="ai-mode real-ai">🚀 ULTIMATE AI POWER ACTIVE</span>
                      ) : (
                        <span className="ai-mode demo">🎭 Demo Mode</span>
                      )}
                    </div>
                    
                    {aiStatus.processing_mode === 'REAL_AI' && (
                      <div className="active-providers">
                        <span className="providers-label">Active AI Providers:</span>
                        <div className="provider-badges">
                          {aiStatus.openai_configured && <span className="provider-badge openai">🥇 OpenAI DALL-E 3</span>}
                          {aiStatus.stability_configured && <span className="provider-badge stability">🥈 Stability AI XL</span>}
                          {aiStatus.huggingface_configured && <span className="provider-badge huggingface">🥉 Hugging Face</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="process-info">
                  <span>⏱️ Processing time: {aiStatus?.processing_mode === 'REAL_AI' ? '30-90 seconds' : '2-5 seconds'}</span>
                  <span>🎯 {aiStatus?.processing_mode === 'REAL_AI' ? 'Professional AI quality' : 'Demo quality'}</span>
                  {user && user.backendConnected ? (
                    <span style={{color: '#4CAF50'}}>🟢 Backend Connected</span>
                  ) : (
                    <span style={{color: '#FF9800'}}>🟡 Demo Mode Only</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <p className="tips-inline">
            💡 <strong>Pro Tips:</strong> Use high resolution images (1000px+) with good lighting for best results
          </p>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;