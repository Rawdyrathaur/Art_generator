// Advanced Image Processing Service - Creates dramatic artistic transformations
class AdvancedImageProcessor {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.tempCanvas = null;
    this.tempCtx = null;
  }

  // Initialize dual canvas system for advanced processing
  initCanvases(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');

    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = width;
    this.tempCanvas.height = height;
    this.tempCtx = this.tempCanvas.getContext('2d');

    return this.canvas;
  }

  // Load image with error handling
  loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  // Main processing function with dramatic transformations
  async processImage(dataUrl, toolType, style = 'default', intensity = 7, customPrompt = '') {
    try {
      const img = await this.loadImage(dataUrl);
      const canvas = this.initCanvases(img.width, img.height);
      
      // Draw original image
      this.ctx.drawImage(img, 0, 0);
      
      console.log(`Processing with: ${toolType}, style: ${style}, intensity: ${intensity}, prompt: "${customPrompt}"`);

      // Apply dramatic transformations based on tool type
      switch (toolType) {
        case 'photo-to-art':
          return await this.createPhotoToArt(img, style, intensity, customPrompt);
        case 'style-transfer':
          return await this.createStyleTransfer(img, style, intensity, customPrompt);
        case 'vintage-filter':
          return await this.createVintageFilter(img, style, intensity, customPrompt);
        case 'sketch-maker':
          return await this.createSketchArt(img, style, intensity, customPrompt);
        case 'color-enhance':
          return await this.createColorEnhancement(img, style, intensity, customPrompt);
        case 'background-remove':
          return await this.createBackgroundEffect(img, style, intensity, customPrompt);
        default:
          return await this.createPhotoToArt(img, 'default', intensity, customPrompt);
      }
    } catch (error) {
      console.error('Advanced image processing failed:', error);
      throw error;
    }
  }

  // Photo to Art - Creates painterly effects
  async createPhotoToArt(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply multiple layers of processing for dramatic effect
    switch (style) {
      case 'oil-painting':
        this.applyOilPaintingLayers(imageData, intensity);
        break;
      case 'watercolor':
        this.applyWatercolorLayers(imageData, intensity);
        break;
      case 'impressionist':
        this.applyImpressionistLayers(imageData, intensity);
        break;
      case 'abstract':
        this.applyAbstractLayers(imageData, intensity);
        break;
      case 'digital-art':
        this.applyDigitalArtLayers(imageData, intensity);
        break;
      default:
        this.applyUniversalArtisticLayers(imageData, intensity);
    }

    // Apply prompt-based enhancements
    this.applyPromptEnhancements(imageData, prompt, intensity);
    
    // Apply final artistic polish
    this.applyArtisticPolish(imageData, intensity);
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  // Style Transfer - Mimics famous artists
  async createStyleTransfer(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    switch (style) {
      case 'van-gogh':
        this.applyVanGoghTransformation(imageData, intensity);
        break;
      case 'picasso':
        this.applyPicassoTransformation(imageData, intensity);
        break;
      case 'monet':
        this.applyMonetTransformation(imageData, intensity);
        break;
      case 'da-vinci':
        this.applyDaVinciTransformation(imageData, intensity);
        break;
      case 'hokusai':
        this.applyHokusaiTransformation(imageData, intensity);
        break;
      default:
        this.applyModernArtistTransformation(imageData, intensity);
    }

    this.applyPromptEnhancements(imageData, prompt, intensity);
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  // Vintage Filter - Authentic retro looks
  async createVintageFilter(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    switch (style) {
      case '1950s':
        this.apply1950sAuthentic(imageData, intensity);
        break;
      case '1970s':
        this.apply1970sAuthentic(imageData, intensity);
        break;
      case 'sepia':
        this.applySepiaDeluxe(imageData, intensity);
        break;
      case 'film-grain':
        this.applyFilmGrainRealistic(imageData, intensity);
        break;
      default:
        this.applyClassicVintage(imageData, intensity);
    }

    this.applyPromptEnhancements(imageData, prompt, intensity);
    this.applyVintageFinishing(imageData, intensity);
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  // Sketch Maker - Realistic drawing effects
  async createSketchArt(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // First convert to grayscale base
    this.convertToGrayscaleBase(imageData);
    
    switch (style) {
      case 'charcoal':
        this.applyCharcoalRealistic(imageData, intensity);
        break;
      case 'pen-ink':
        this.applyPenInkDetailed(imageData, intensity);
        break;
      case 'line-art':
        this.applyLineArtPrecision(imageData, intensity);
        break;
      default:
        this.applyPencilSketchRealistic(imageData, intensity);
    }

    this.applyPromptEnhancements(imageData, prompt, intensity);
    this.applySketchFinishing(imageData, intensity);
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  // Color Enhancement - Professional photo editing
  async createColorEnhancement(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    switch (style) {
      case 'vibrant':
        this.applyVibrantEnhancement(imageData, intensity);
        break;
      case 'natural':
        this.applyNaturalEnhancement(imageData, intensity);
        break;
      case 'cinematic':
        this.applyCinematicGrading(imageData, intensity);
        break;
      default:
        this.applyAutoEnhancement(imageData, intensity);
    }

    this.applyPromptEnhancements(imageData, prompt, intensity);
    this.applyColorFinishing(imageData, intensity);
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  // Background Effect - Creative background manipulation
  async createBackgroundEffect(img, style, intensity, prompt) {
    this.ctx.drawImage(img, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply edge detection and background blur
    switch (style) {
      case 'soft-edge':
        this.applySoftEdgeBackground(imageData, intensity);
        break;
      case 'precise':
        this.applyPreciseBackground(imageData, intensity);
        break;
      default:
        this.applySmartBackground(imageData, intensity);
    }

    this.applyPromptEnhancements(imageData, prompt, intensity);
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/png');
  }

  // Advanced Oil Painting Effect
  applyOilPaintingLayers(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    const width = imageData.width;
    const height = imageData.height;

    // Create texture overlay
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Oil painting brush stroke effect
      const brushStroke = Math.sin(x * 0.05) * Math.cos(y * 0.05) * factor * 40;
      const oilTexture = Math.sin(x * 0.1 + y * 0.1) * factor * 25;
      
      // Apply thick paint texture
      data[i] = Math.max(0, Math.min(255, data[i] + brushStroke + oilTexture));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brushStroke * 0.8 + oilTexture));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brushStroke * 1.2 + oilTexture));
      
      // Add color richness
      const richness = 1 + factor * 0.4;
      data[i] = Math.min(255, data[i] * richness);
      data[i + 1] = Math.min(255, data[i + 1] * richness);
      data[i + 2] = Math.min(255, data[i + 2] * richness);
    }

    // Apply color blending for oil effect
    this.applyColorBlending(data, factor * 0.6);
  }

  // Advanced Watercolor Effect
  applyWatercolorLayers(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    const width = imageData.width;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Watercolor bleeding effect
      const bleeding = Math.sin(x * 0.03) * Math.sin(y * 0.03) * factor * 30;
      const transparency = 0.7 + factor * 0.2;
      
      // Apply watercolor wash
      const washR = 240 * (1 - transparency) + data[i] * transparency;
      const washG = 245 * (1 - transparency) + data[i + 1] * transparency;
      const washB = 250 * (1 - transparency) + data[i + 2] * transparency;
      
      data[i] = Math.max(0, Math.min(255, washR + bleeding));
      data[i + 1] = Math.max(0, Math.min(255, washG + bleeding * 0.9));
      data[i + 2] = Math.max(0, Math.min(255, washB + bleeding * 1.1));
      
      // Add paper texture
      const paperTexture = (Math.random() - 0.5) * factor * 15;
      data[i] = Math.max(0, Math.min(255, data[i] + paperTexture));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + paperTexture));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + paperTexture));
    }
  }

  // Van Gogh Transformation
  applyVanGoghTransformation(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    const width = imageData.width;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Swirling brush strokes
      const swirl = Math.sin(x * 0.02 + y * 0.02) * Math.cos(x * 0.015) * factor * 50;
      const impasto = Math.sin(x * 0.1) * Math.cos(y * 0.1) * factor * 30;
      
      // Van Gogh's bold color palette
      data[i] = Math.max(0, Math.min(255, data[i] * (1 + factor * 0.3) + swirl));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 + factor * 0.2) + swirl * 0.8));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 + factor * 0.4) + swirl * 1.2));
      
      // Add thick paint texture (impasto)
      data[i] = Math.max(0, Math.min(255, data[i] + impasto));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + impasto));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + impasto));
    }

    // Apply Van Gogh's characteristic color shifts
    this.applyVanGoghColors(data, factor);
  }

  // Picasso Cubist Transformation
  applyPicassoTransformation(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    const width = imageData.width;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Cubist fragmentation
      const segment = Math.floor(x / 20) + Math.floor(y / 20);
      const cubistShift = (segment % 3) * factor * 40;
      
      // Blue period influence
      if (factor > 0.5) {
        data[i] = Math.max(0, Math.min(255, data[i] * 0.7 + cubistShift));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * 0.8 + cubistShift));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * 1.3 + cubistShift));
      }
      
      // Geometric distortion
      const geometric = Math.floor(x / 15) * Math.floor(y / 15) * factor * 0.1;
      data[i] = Math.max(0, Math.min(255, data[i] + geometric));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] - geometric * 0.5));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + geometric * 1.5));
    }
  }

  // Authentic 1950s Look
  apply1950sAuthentic(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;

    for (let i = 0; i < data.length; i += 4) {
      // 1950s Kodachrome color palette
      const kodachromeR = data[i] * 1.1 + 10;
      const kodachromeG = data[i + 1] * 0.95 + 5;
      const kodachromeB = data[i + 2] * 0.85 - 5;
      
      data[i] = Math.max(0, Math.min(255, data[i] * (1 - factor) + kodachromeR * factor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 - factor) + kodachromeG * factor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 - factor) + kodachromeB * factor));
      
      // Add vintage fade
      const fade = factor * 20;
      data[i] = Math.min(255, data[i] + fade);
      data[i + 1] = Math.min(255, data[i + 1] + fade);
      data[i + 2] = Math.min(255, data[i + 2] + fade);
    }

    // Add film grain and vignette
    this.addFilmGrain(data, factor * 15);
    this.addVignette(imageData, factor);
  }

  // Realistic Charcoal Effect
  applyCharcoalRealistic(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    const width = imageData.width;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Get grayscale value
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      
      // Charcoal texture
      const charcoalTexture = Math.sin(x * 0.1) * Math.cos(y * 0.1) * factor * 20;
      const paperTexture = (Math.random() - 0.5) * factor * 25;
      
      // Charcoal effect - dark areas become very dark, light areas stay light
      let charcoalValue;
      if (gray < 60) {
        charcoalValue = gray * 0.3; // Very dark areas
      } else if (gray < 120) {
        charcoalValue = gray * 0.6; // Medium areas
      } else {
        charcoalValue = gray * 0.9 + 20; // Light areas
      }
      
      const final = charcoalValue + charcoalTexture + paperTexture;
      const result = Math.max(0, Math.min(255, final));
      
      data[i] = result;
      data[i + 1] = result;
      data[i + 2] = result;
    }

    // Add charcoal smudging effect
    this.applyCharcoalSmudging(data, imageData.width, factor);
  }

  // Enhanced Prompt Processing
  applyPromptEnhancements(imageData, prompt, intensity) {
    if (!prompt) return;
    
    const data = imageData.data;
    const factor = intensity / 10;
    const lowerPrompt = prompt.toLowerCase();

    // Color-based enhancements
    if (lowerPrompt.includes('warm') || lowerPrompt.includes('orange') || lowerPrompt.includes('sunset')) {
      this.applyWarmPalette(data, factor * 0.8);
    }
    
    if (lowerPrompt.includes('cool') || lowerPrompt.includes('blue') || lowerPrompt.includes('winter')) {
      this.applyCoolPalette(data, factor * 0.8);
    }
    
    if (lowerPrompt.includes('vibrant') || lowerPrompt.includes('colorful') || lowerPrompt.includes('bright')) {
      this.applySaturationBoost(data, factor * 1.2);
    }
    
    if (lowerPrompt.includes('dark') || lowerPrompt.includes('moody') || lowerPrompt.includes('dramatic')) {
      this.applyDramaticContrast(data, factor);
    }
    
    if (lowerPrompt.includes('dreamy') || lowerPrompt.includes('soft') || lowerPrompt.includes('ethereal')) {
      this.applyDreamyEffect(data, factor);
    }
    
    if (lowerPrompt.includes('vintage') || lowerPrompt.includes('retro') || lowerPrompt.includes('old')) {
      this.applyVintageBoost(data, factor);
    }

    // Style-based enhancements
    if (lowerPrompt.includes('impressionist') || lowerPrompt.includes('monet')) {
      this.applyImpressionistTouch(data, factor);
    }
    
    if (lowerPrompt.includes('abstract') || lowerPrompt.includes('modern')) {
      this.applyAbstractElements(data, factor);
    }
  }

  // Helper Functions for Enhanced Effects
  applyWarmPalette(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor * 0.3)); // Boost reds
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.2)); // Boost greens slightly
      data[i + 2] = Math.max(0, data[i + 2] * (1 - factor * 0.1)); // Reduce blues
    }
  }

  applyCoolPalette(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, data[i] * (1 - factor * 0.2)); // Reduce reds
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1)); // Boost greens slightly
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.4)); // Boost blues
    }
  }

  applySaturationBoost(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      data[i] = Math.max(0, Math.min(255, gray + (r - gray) * (1 + factor)));
      data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * (1 + factor)));
      data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * (1 + factor)));
    }
  }

  applyDramaticContrast(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast dramatically
      data[i] = data[i] > 128 ? Math.min(255, data[i] * (1 + factor * 0.5)) : Math.max(0, data[i] * (1 - factor * 0.3));
      data[i + 1] = data[i + 1] > 128 ? Math.min(255, data[i + 1] * (1 + factor * 0.5)) : Math.max(0, data[i + 1] * (1 - factor * 0.3));
      data[i + 2] = data[i + 2] > 128 ? Math.min(255, data[i + 2] * (1 + factor * 0.5)) : Math.max(0, data[i + 2] * (1 - factor * 0.3));
    }
  }

  applyDreamyEffect(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      // Soft, ethereal glow
      const glow = factor * 25;
      data[i] = Math.min(255, data[i] + glow);
      data[i + 1] = Math.min(255, data[i + 1] + glow);
      data[i + 2] = Math.min(255, data[i + 2] + glow);
      
      // Reduce contrast for dreamy effect
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const blend = factor * 0.3;
      data[i] = data[i] * (1 - blend) + avg * blend;
      data[i + 1] = data[i + 1] * (1 - blend) + avg * blend;
      data[i + 2] = data[i + 2] * (1 - blend) + avg * blend;
    }
  }

  // Add film grain
  addFilmGrain(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
  }

  // Add vignette effect
  addVignette(imageData, intensity) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const vignette = 1 - (distance / maxDistance) * intensity * 0.8;
      
      data[i] = Math.max(0, data[i] * vignette);
      data[i + 1] = Math.max(0, data[i + 1] * vignette);
      data[i + 2] = Math.max(0, data[i + 2] * vignette);
    }
  }

  // Additional helper methods for comprehensive transformations
  convertToGrayscaleBase(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  applyColorBlending(data, factor) {
    // Sophisticated color blending for oil painting effect
    for (let i = 0; i < data.length - 16; i += 4) {
      const blend = factor * 0.3;
      const nextR = data[i + 4] || data[i];
      const nextG = data[i + 5] || data[i + 1];
      const nextB = data[i + 6] || data[i + 2];
      
      data[i] = data[i] * (1 - blend) + nextR * blend;
      data[i + 1] = data[i + 1] * (1 - blend) + nextG * blend;
      data[i + 2] = data[i + 2] * (1 - blend) + nextB * blend;
    }
  }

  applyCharcoalSmudging(data, width, factor) {
    // Create smudging effect for charcoal
    const smudgeRadius = Math.floor(factor * 3);
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < factor * 0.1) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        // Smudge in random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * smudgeRadius;
        const newX = Math.floor(x + Math.cos(angle) * distance);
        const newY = Math.floor(y + Math.sin(angle) * distance);
        
        if (newX >= 0 && newX < width && newY >= 0) {
          const newIndex = (newY * width + newX) * 4;
          if (newIndex < data.length) {
            const avgGray = (data[i] + data[newIndex]) / 2;
            data[i] = data[i + 1] = data[i + 2] = avgGray;
            data[newIndex] = data[newIndex + 1] = data[newIndex + 2] = avgGray;
          }
        }
      }
    }
  }

  // Fallback methods for comprehensive coverage
  applyUniversalArtisticLayers(imageData, intensity) {
    this.applyOilPaintingLayers(imageData, intensity);
  }

  applyImpressionistLayers(imageData, intensity) {
    this.applyWatercolorLayers(imageData, intensity * 0.8);
    this.applyOilPaintingLayers(imageData, intensity * 0.6);
  }

  applyAbstractLayers(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    for (let i = 0; i < data.length; i += 4) {
      const wave = Math.sin(i * 0.001) * factor * 60;
      data[i] = Math.max(0, Math.min(255, data[i] + wave));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + wave * 1.2));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + wave * 0.8));
    }
  }

  applyDigitalArtLayers(imageData, intensity) {
    this.applySaturationBoost(imageData.data, intensity / 10);
    this.applyDramaticContrast(imageData.data, intensity / 15);
  }

  applyArtisticPolish(imageData, intensity) {
    this.addFilmGrain(imageData.data, intensity * 2);
  }

  applyVintageFinishing(imageData, intensity) {
    this.addVignette(imageData, intensity / 15);
  }

  applySketchFinishing(imageData, intensity) {
    this.addFilmGrain(imageData.data, intensity * 3);
  }

  applyColorFinishing(imageData, intensity) {
    // Final color polish
    const data = imageData.data;
    const factor = intensity / 20;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor));
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor));
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor));
    }
  }

  // Additional method stubs for complete coverage
  applyModernArtistTransformation(imageData, intensity) {
    this.applyVanGoghTransformation(imageData, intensity * 0.8);
  }

  applyMonetTransformation(imageData, intensity) {
    this.applyWatercolorLayers(imageData, intensity);
  }

  applyDaVinciTransformation(imageData, intensity) {
    this.applyWarmPalette(imageData.data, intensity / 15);
    this.applyOilPaintingLayers(imageData, intensity * 0.7);
  }

  applyHokusaiTransformation(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    // Woodblock print effect
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / 32) * 32 * (1 + factor * 0.2);
      data[i + 1] = Math.floor(data[i + 1] / 32) * 32 * (1 + factor * 0.2);
      data[i + 2] = Math.floor(data[i + 2] / 32) * 32 * (1 + factor * 0.2);
    }
  }

  apply1970sAuthentic(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor * 0.4)); // Orange boost
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.3)); // Yellow boost
      data[i + 2] = Math.max(0, data[i + 2] * (1 - factor * 0.2)); // Reduce blue
    }
  }

  applySepiaDeluxe(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      data[i] = Math.min(255, r * (1 - factor) + tr * factor);
      data[i + 1] = Math.min(255, g * (1 - factor) + tg * factor);
      data[i + 2] = Math.min(255, b * (1 - factor) + tb * factor);
    }
  }

  applyFilmGrainRealistic(imageData, intensity) {
    this.addFilmGrain(imageData.data, intensity * 8);
  }

  applyClassicVintage(imageData, intensity) {
    this.applySepiaDeluxe(imageData, intensity);
    this.addVignette(imageData, intensity / 12);
  }

  applyPencilSketchRealistic(imageData, intensity) {
    this.applyCharcoalRealistic(imageData, intensity * 0.7);
  }

  applyPenInkDetailed(imageData, intensity) {
    this.applyCharcoalRealistic(imageData, intensity);
    this.applyDramaticContrast(imageData.data, intensity / 8);
  }

  applyLineArtPrecision(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const line = gray > 120 - factor * 30 ? 255 : 0;
      
      data[i] = line;
      data[i + 1] = line;
      data[i + 2] = line;
    }
  }

  applyVibrantEnhancement(imageData, intensity) {
    this.applySaturationBoost(imageData.data, intensity / 6);
  }

  applyNaturalEnhancement(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 30;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor));
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor));
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor));
    }
  }

  applyCinematicGrading(imageData, intensity) {
    const data = imageData.data;
    const factor = intensity / 10;
    
    for (let i = 0; i < data.length; i += 4) {
      // Orange and teal color grading
      data[i] = Math.min(255, data[i] * (1 + factor * 0.25));
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1));
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.35));
    }
  }

  applyAutoEnhancement(imageData, intensity) {
    this.applyVibrantEnhancement(imageData, intensity);
    this.applyDramaticContrast(imageData.data, intensity / 20);
  }

  applySoftEdgeBackground(imageData, intensity) {
    this.addVignette(imageData, intensity / 8);
  }

  applyPreciseBackground(imageData, intensity) {
    this.applyDramaticContrast(imageData.data, intensity / 10);
  }

  applySmartBackground(imageData, intensity) {
    this.applySoftEdgeBackground(imageData, intensity);
  }

  applyVanGoghColors(data, factor) {
    // Apply Van Gogh's characteristic yellows and blues
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 1] > data[i] && data[i + 1] > data[i + 2]) {
        // Green areas become more yellow
        data[i] = Math.min(255, data[i] + factor * 40);
        data[i + 1] = Math.min(255, data[i + 1] + factor * 20);
      }
      if (data[i + 2] > data[i] && data[i + 2] > data[i + 1]) {
        // Blue areas become more intense
        data[i + 2] = Math.min(255, data[i + 2] + factor * 50);
      }
    }
  }

  applyVintageBoost(data, factor) {
    this.applySepiaDeluxe({data: data}, factor * 10);
  }

  applyImpressionistTouch(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      const softness = factor * 0.6;
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * (1 - softness) + avg * softness;
      data[i + 1] = data[i + 1] * (1 - softness) + avg * softness;
      data[i + 2] = data[i + 2] * (1 - softness) + avg * softness;
    }
  }

  applyAbstractElements(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      const wave = Math.sin(i * 0.005) * factor * 40;
      data[i] = Math.max(0, Math.min(255, data[i] + wave));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + wave * 1.3));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + wave * 0.7));
    }
  }
}

export default new AdvancedImageProcessor();