import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LiveProcessingDemo.css';

const LiveProcessingDemo = () => {
  const [currentStyle, setCurrentStyle] = useState('Van Gogh');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const processingInterval = useRef(null);

  const styles = [
    { name: 'Van Gogh', color: '#FFD700', emoji: '🌻' },
    { name: 'Picasso', color: '#FF6B6B', emoji: '🎨' },
    { name: 'Watercolor', color: '#4ECDC4', emoji: '💧' }
  ];

  const demoImage = {
    original: 'https://images.unsplash.com/photo-1494790108755-2616c9c6cab8?w=250&h=250&fit=crop',
    transformed: {
      'Van Gogh': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=250&h=250&fit=crop',
      'Picasso': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=250&h=250&fit=crop',
      'Watercolor': 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=250&h=250&fit=crop'
    }
  };

  // No auto-rotation needed for single example

  // Auto-start processing every 5 seconds
  useEffect(() => {
    const autoProcessInterval = setInterval(() => {
      if (!isProcessing) {
        startProcessing();
      }
    }, 5000);

    return () => clearInterval(autoProcessInterval);
  }, [isProcessing]);

  // Start processing immediately when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startProcessing();
    }, 1000); // Start after 1 second

    return () => clearTimeout(timer);
  }, []);

  // Auto-cycle through styles every 15 seconds (3 processing cycles)
  useEffect(() => {
    const styleInterval = setInterval(() => {
      if (!isProcessing) {
        const currentIndex = styles.findIndex(s => s.name === currentStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        setCurrentStyle(styles[nextIndex].name);
      }
    }, 15000);

    return () => clearInterval(styleInterval);
  }, [currentStyle, isProcessing, styles]);

  const startProcessing = () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    setShowResult(false);

    // Simulate fast processing steps
    const steps = [
      { progress: 20, delay: 150, text: 'Analyzing image...' },
      { progress: 40, delay: 200, text: 'Loading AI model...' },
      { progress: 60, delay: 150, text: 'Applying style transfer...' },
      { progress: 80, delay: 200, text: 'Enhancing details...' },
      { progress: 100, delay: 150, text: 'Complete!' }
    ];

    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setTimeout(() => {
          setProgress(step.progress);
          
          if (step.progress === 100) {
            setTimeout(() => {
              setShowResult(true);
              setIsProcessing(false);
              
              // Auto-reset after showing result
              setTimeout(() => {
                setShowResult(false);
                setProgress(0);
              }, 2000);
            }, 200);
          } else {
            stepIndex++;
            processStep();
          }
        }, step.delay);
      }
    };

    processStep();
  };

  const handleStyleChange = (styleName) => {
    if (!isProcessing) {
      setCurrentStyle(styleName);
      setShowResult(false);
      setProgress(0);
    }
  };

  const currentImage = demoImage;
  const currentStyleData = styles.find(s => s.name === currentStyle);

  return (
    <section className="live-demo-section">
      <div className="demo-background">
        <div className="demo-pattern"></div>
        <div className="floating-code">
          <div className="code-snippet">AI.transform()</div>
          <div className="code-snippet">style.apply()</div>
          <div className="code-snippet">quality.enhance()</div>
        </div>
      </div>

      <div className="container">
        <div className="demo-content">
          <div className="demo-info" data-aos="fade-right">
            <div className="section-badge">
              <span>Live Demo</span>
              <div className="live-indicator"></div>
            </div>
            <h2 className="demo-title">
              Watch AI Transform
              <span className="highlight"> In Real-Time</span>
            </h2>
            <p className="demo-description">
              Experience the magic of our AI technology as it processes and transforms 
              images with professional precision. Click any style to see instant results!
            </p>
            
            <div className="demo-features">
              <div className="demo-feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Lightning Fast</strong>
                  <span>Average processing: 2.3 seconds</span>
                </div>
              </div>
              <div className="demo-feature">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <strong>Pixel Perfect</strong>
                  <span>Preserves image quality & details</span>
                </div>
              </div>
              <div className="demo-feature">
                <div className="feature-icon">🔄</div>
                <div className="feature-text">
                  <strong>Multiple Styles</strong>
                  <span>25+ artistic transformations</span>
                </div>
              </div>
            </div>

          </div>

          <div className="demo-visual" data-aos="fade-left">
            <div className="demo-container">
              <div className="demo-screen">
                <div className="demo-header">
                  <div className="demo-controls">
                    <div className="control-dot red"></div>
                    <div className="control-dot yellow"></div>
                    <div className="control-dot green"></div>
                  </div>
                  <div className="demo-title-bar">
                    Artify Studio - Live Processing
                    <div className="processing-status">
                      {isProcessing ? (
                        <span className="status-processing">● Processing</span>
                      ) : showResult ? (
                        <span className="status-complete">● Complete</span>
                      ) : (
                        <span className="status-ready">● Ready</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="demo-workspace">
                  <div className="demo-sidebar">
                    <div className="style-selector">
                      <div className="selector-title">AI Styles</div>
                      {styles.map((style) => (
                        <button
                          key={style.name}
                          onClick={() => handleStyleChange(style.name)}
                          className={`style-option ${currentStyle === style.name ? 'active' : ''}`}
                          style={{ '--style-color': style.color }}
                          disabled={isProcessing}
                        >
                          <span className="style-emoji">{style.emoji}</span>
                          <span className="style-name">{style.name}</span>
                          {currentStyle === style.name && (
                            <div className="style-indicator"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="demo-canvas">
                    <div className="image-comparison">
                      <div className="image-before">
                        <div className="image-label">Original</div>
                        <img 
                          src={currentImage.original} 
                          alt="Original" 
                          className="demo-image"
                        />
                      </div>
                      
                      <div className="transform-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      
                      <div className="image-after">
                        <div className="image-label">
                          {currentStyleData?.emoji} {currentStyle}
                        </div>
                        <div className="result-container">
                          <img 
                            src={currentImage.transformed[currentStyle]} 
                            alt="Transformed" 
                            className={`demo-image ${showResult ? 'show' : ''}`}
                          />
                          
                          {isProcessing && (
                            <div className="processing-overlay">
                              <div className="processing-grid">
                                {[...Array(16)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`grid-cell cell-${i}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                  ></div>
                                ))}
                              </div>
                              <div className="processing-progress">
                                <div 
                                  className="progress-bar" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                                <div className="progress-text">
                                  Processing... {progress}%
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveProcessingDemo;