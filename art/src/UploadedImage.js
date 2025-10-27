import React, { useState, useRef } from 'react';
import './UploadedImage.css';

const UploadedImage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    setIsProcessing(true);
    // Simulate image processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Image processed successfully!');
    }, 2000);
  };

  const resetImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="uploaded-image-container">
      <div className="upload-section">
        <h2>Upload Your Image</h2>
        
        {!uploadedImage ? (
          <div 
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <p>Drop your image here or click to browse</p>
            <span>Supports JPG, PNG, GIF up to 10MB</span>
          </div>
        ) : (
          <div className="image-preview">
            <img src={uploadedImage} alt="Uploaded" />
            <div className="image-actions">
              <button 
                className="process-btn" 
                onClick={processImage}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process Image'}
              </button>
              <button className="reset-btn" onClick={resetImage}>
                Upload New
              </button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default UploadedImage;