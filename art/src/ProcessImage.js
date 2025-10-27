import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import realAIService from './services/realAIService';
import './ProcessImage.css';

const ProcessImage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('preparing');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Get data passed from GetStarted
  const { 
    project, 
    image, 
    selectedTool,
    selectedStyle,
    customPrompt,
    intensity,
    backendConnected, 
    mode 
  } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!project && !image) {
      navigate('/get-started');
      return;
    }

    // Start processing automatically
    startProcessing();
  }, []);

  const startProcessing = async () => {
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      if (mode === 'backend' && project) {
        await processWithBackend();
      } else {
        await processWithDemo();
      }
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  const processWithBackend = async () => {
    try {
      // Start processing
      setStatus('uploading');
      setProgress(20);

      // Trigger backend processing with options
      const processingOptions = {
        style: selectedStyle || 'default',
        intensity: intensity || 7,
        prompt: customPrompt || ''
      };
      
      const processResponse = await apiService.processProject(project.id, processingOptions);
      
      if (!processResponse.success) {
        throw new Error(processResponse.message || 'Processing failed');
      }

      setStatus('processing');
      setProgress(40);

      // Poll for processing status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await apiService.getProcessingStatus(project.id);
          
          if (statusResponse.success) {
            const projectData = statusResponse.data;
            setProgress(projectData.processingProgress || 50);

            if (projectData.status === 'COMPLETED') {
              clearInterval(pollInterval);
              setStatus('completed');
              setProgress(100);
              setResult({
                originalUrl: projectData.originalImageUrl,
                processedUrl: projectData.processedImageUrl,
                projectId: projectData.id,
                styleType: projectData.styleType,
                processingTime: projectData.processingTimeSeconds
              });
            } else if (projectData.status === 'FAILED') {
              clearInterval(pollInterval);
              throw new Error(projectData.errorMessage || 'Processing failed');
            }
          }
        } catch (pollError) {
          clearInterval(pollInterval);
          throw pollError;
        }
      }, 2000);

      // Cleanup interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (processing) {
          setError('Processing timeout');
          setStatus('failed');
        }
      }, 300000);

    } catch (error) {
      throw new Error('Backend processing failed: ' + error.message);
    }
  };

  const processWithDemo = async () => {
    try {
      // Real AI processing steps
      const steps = [
        { status: 'analyzing', progress: 5, message: 'Analyzing image with AI...' },
        { status: 'preparing', progress: 15, message: 'Connecting to AI services...' },
        { status: 'uploading', progress: 25, message: 'Uploading to AI servers...' },
        { status: 'ai-processing', progress: 40, message: 'AI is generating transformation...' },
        { status: 'applying-style', progress: 70, message: `Applying ${selectedStyle || 'artistic'} with AI...` },
        { status: 'enhancing', progress: 85, message: 'AI enhancing details...' },
        { status: 'downloading', progress: 95, message: 'Downloading AI result...' },
        { status: 'finalizing', progress: 98, message: 'Finalizing artwork...' }
      ];

      let aiResult = null;

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setStatus(step.status);
        setProgress(step.progress);
        
        console.log(`🤖 AI Processing: ${step.message}`);
        
        // Real processing happens at AI processing step
        if (step.status === 'ai-processing') {
          try {
            console.log('🚀 Starting REAL AI transformation with:', {
              tool: selectedTool,
              style: selectedStyle,
              intensity: intensity,
              prompt: customPrompt
            });
            
            // Call REAL AI service
            aiResult = await realAIService.transformImage(
              image.data_url,
              selectedTool,
              selectedStyle || 'default',
              intensity || 7,
              customPrompt || ''
            );
            
            console.log('✅ AI transformation result:', aiResult);
            
            if (!aiResult.success) {
              throw new Error('AI transformation failed');
            }
            
            // Continue with longer processing for dramatic effect
            await new Promise(resolve => setTimeout(resolve, 2000));
            
          } catch (aiError) {
            console.error('❌ AI processing error:', aiError);
            throw new Error('AI transformation failed: ' + aiError.message);
          }
        } else {
          // Simulate processing time for other steps
          await new Promise(resolve => 
            setTimeout(resolve, 500 + Math.random() * 1000)
          );
        }
      }

      // Final completion
      setStatus('completed');
      setProgress(100);
      
      // Set result with AI-transformed image
      setResult({
        originalUrl: image.data_url,
        processedUrl: aiResult.transformedImageUrl,
        styleType: selectedTool,
        selectedStyle: selectedStyle,
        customPrompt: customPrompt,
        intensity: intensity,
        aiService: aiResult.service,
        aiPrompt: aiResult.prompt,
        demo: aiResult.isDemo || false,
        processingTime: aiResult.processingTime || 0
      });

      console.log('🎉 AI transformation completed successfully!');

    } catch (error) {
      console.error('❌ AI processing failed:', error);
      throw new Error('AI transformation failed: ' + error.message);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    setResult(null);
    startProcessing();
  };

  const handleBackToUpload = () => {
    navigate('/get-started');
  };

  const handleViewResult = () => {
    navigate('/result', { 
      state: { 
        result,
        selectedTool,
        backendConnected,
        mode 
      } 
    });
  };

  if (!project && !image) {
    return null; // Will redirect
  }

  return (
    <div className="process-container">
      <div className="process-content">
        {/* Header */}
        <div className="process-header">
          <button onClick={handleBackToUpload} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Upload
          </button>
          <h1>Processing Your Art</h1>
          <div className="process-info-header">
            <div className="connection-status">
              {backendConnected ? (
                <span className="status-connected">🟢 Backend Processing</span>
              ) : (
                <span className="status-demo">🟡 Demo Mode</span>
              )}
            </div>
            <div className="processing-settings">
              <div className="setting-item">
                <span className="setting-label">Tool:</span>
                <span className="setting-value">{selectedTool}</span>
              </div>
              {selectedStyle && selectedStyle !== 'default' && (
                <div className="setting-item">
                  <span className="setting-label">Style:</span>
                  <span className="setting-value">{selectedStyle}</span>
                </div>
              )}
              {intensity && intensity !== 7 && (
                <div className="setting-item">
                  <span className="setting-label">Intensity:</span>
                  <span className="setting-value">{intensity}/10</span>
                </div>
              )}
              {customPrompt && (
                <div className="setting-item prompt-setting">
                  <span className="setting-label">Custom Prompt:</span>
                  <span className="setting-value">{customPrompt.length > 50 ? customPrompt.substring(0, 50) + '...' : customPrompt}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Processing Area */}
        <div className="processing-area">
          {/* Original Image */}
          <div className="image-preview">
            <img 
              src={project?.originalImageUrl || image?.data_url} 
              alt="Original" 
              className="original-image"
            />
            <div className="image-label">Original Image</div>
          </div>

          {/* Processing Status */}
          <div className="processing-status">
            {error ? (
              <div className="error-state">
                <div className="error-icon">❌</div>
                <h3>Processing Failed</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button onClick={handleTryAgain} className="retry-button">
                    Try Again
                  </button>
                  <button onClick={handleBackToUpload} className="back-button-alt">
                    Upload New Image
                  </button>
                </div>
              </div>
            ) : result ? (
              <div className="success-state">
                <div className="success-icon">✅</div>
                <h3>Processing Complete!</h3>
                <p>Your {selectedTool} artwork is ready</p>
                <div className="processing-info">
                  <span>Processing time: {result.processingTime}s</span>
                  {result.demo && <span>• Demo Mode</span>}
                </div>
                <button onClick={handleViewResult} className="view-result-button">
                  <span>View Result</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="processing-state">
                <div className="processing-animation">
                  <div className="spinner"></div>
                </div>
                <h3>Processing Your Image</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{progress}%</div>
                </div>
                <p className="status-message">
                  {status === 'analyzing' && '🔍 AI analyzing image structure and composition...'}
                  {status === 'preparing' && '🤖 Connecting to AI services (OpenAI, Stability AI, HuggingFace)...'}
                  {status === 'uploading' && '⬆️ Uploading image to AI servers...'}
                  {status === 'ai-processing' && '🧠 AI generating your transformation (this may take 30-90 seconds)...'}
                  {status === 'applying-style' && `🎨 AI applying ${selectedStyle || 'artistic'} style transformation...`}
                  {status === 'enhancing' && '✨ AI enhancing details with custom effects...'}
                  {status === 'downloading' && '⬇️ Downloading AI-generated artwork...'}
                  {status === 'finalizing' && '🎯 Finalizing your masterpiece...'}
                  {!status && '🚀 Starting real AI image processing...'}
                </p>
                {customPrompt && (
                  <div className="processing-prompt">
                    <div className="prompt-label">Custom Prompt:</div>
                    <div className="prompt-text">"{customPrompt}"</div>
                  </div>
                )}
                
                <div className="processing-tips">
                  <p>💡 <strong>Tip:</strong> Our AI analyzes your image's composition, lighting, and colors to create the perfect artistic transformation.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tool Info */}
        <div className="tool-info">
          <h4>Selected Tool: {selectedTool}</h4>
          <p>
            {selectedTool === 'photo-to-art' && 'Transforming your photo into a professional artwork with AI enhancement.'}
            {selectedTool === 'style-transfer' && 'Applying famous artistic styles while preserving your image\'s unique characteristics.'}
            {selectedTool === 'background-remove' && 'Intelligently removing the background while maintaining edge precision.'}
            {selectedTool === 'color-enhance' && 'Enhancing colors and vibrancy with professional-grade algorithms.'}
            {selectedTool === 'vintage-filter' && 'Adding nostalgic vintage effects with authentic film grain.'}
            {selectedTool === 'sketch-maker' && 'Converting your photo to a realistic pencil sketch artwork.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessImage;