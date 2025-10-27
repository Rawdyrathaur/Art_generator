// Image Processing Service - Client-side image transformations
class ImageProcessor {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  // Initialize canvas for processing
  initCanvas(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    return this.canvas;
  }

  // Load image from data URL
  loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  // Apply artistic filters based on tool and style
  async processImage(dataUrl, toolType, style = 'default', intensity = 7, customPrompt = '') {
    try {
      const img = await this.loadImage(dataUrl);
      const canvas = this.initCanvas(img.width, img.height);
      const ctx = this.ctx;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Apply transformations based on tool type
      switch (toolType) {
        case 'photo-to-art':
          return await this.applyPhotoToArt(canvas, ctx, img, style, intensity, customPrompt);
        case 'style-transfer':
          return await this.applyStyleTransfer(canvas, ctx, img, style, intensity);
        case 'background-remove':
          return await this.applyBackgroundRemove(canvas, ctx, img, style, intensity);
        case 'color-enhance':
          return await this.applyColorEnhance(canvas, ctx, img, style, intensity);
        case 'vintage-filter':
          return await this.applyVintageFilter(canvas, ctx, img, style, intensity);
        case 'sketch-maker':
          return await this.applySketchMaker(canvas, ctx, img, style, intensity);
        default:
          return dataUrl;
      }
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    }
  }

  // Photo to Art transformation
  async applyPhotoToArt(canvas, ctx, img, style, intensity, customPrompt) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply artistic effects based on style
    switch (style) {
      case 'oil-painting':
        this.applyOilPaintingEffect(data, intensity);
        break;
      case 'watercolor':
        this.applyWatercolorEffect(data, intensity);
        break;
      case 'impressionist':
        this.applyImpressionistEffect(data, intensity);
        break;
      case 'abstract':
        this.applyAbstractEffect(data, intensity);
        break;
      case 'digital-art':
        this.applyDigitalArtEffect(data, intensity);
        break;
      default:
        this.applyGeneralArtisticEffect(data, intensity);
    }

    // Apply custom prompt effects if provided
    if (customPrompt) {
      this.applyPromptBasedEffects(data, customPrompt, intensity);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Style Transfer transformation
  async applyStyleTransfer(canvas, ctx, img, style, intensity) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (style) {
      case 'van-gogh':
        this.applyVanGoghStyle(data, intensity);
        break;
      case 'picasso':
        this.applyPicassoStyle(data, intensity);
        break;
      case 'monet':
        this.applyMonetStyle(data, intensity);
        break;
      case 'da-vinci':
        this.applyDaVinciStyle(data, intensity);
        break;
      case 'hokusai':
        this.applyHokusaiStyle(data, intensity);
        break;
      default:
        this.applyGeneralStyleTransfer(data, intensity);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Vintage Filter transformation
  async applyVintageFilter(canvas, ctx, img, style, intensity) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (style) {
      case '1950s':
        this.apply1950sStyle(data, intensity);
        break;
      case '1970s':
        this.apply1970sStyle(data, intensity);
        break;
      case 'sepia':
        this.applySepiaEffect(data, intensity);
        break;
      case 'film-grain':
        this.applyFilmGrainEffect(data, intensity);
        break;
      default:
        this.applyVintageEffect(data, intensity);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Sketch Maker transformation
  async applySketchMaker(canvas, ctx, img, style, intensity) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (style) {
      case 'charcoal':
        this.applyCharcoalEffect(data, intensity);
        break;
      case 'pen-ink':
        this.applyPenInkEffect(data, intensity);
        break;
      case 'line-art':
        this.applyLineArtEffect(data, intensity);
        break;
      default:
        this.applyPencilSketchEffect(data, intensity);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Color Enhancement
  async applyColorEnhance(canvas, ctx, img, style, intensity) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (style) {
      case 'vibrant':
        this.applyVibrantColors(data, intensity);
        break;
      case 'natural':
        this.applyNaturalEnhancement(data, intensity);
        break;
      case 'cinematic':
        this.applyCinematicGrading(data, intensity);
        break;
      default:
        this.applyAutoEnhancement(data, intensity);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Background Remove (simplified)
  async applyBackgroundRemove(canvas, ctx, img, style, intensity) {
    // For demo purposes, apply an edge detection filter
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    this.applyEdgeDetection(data, intensity);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  // Artistic Effects Implementation
  applyOilPaintingEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Apply oil painting texture effect
      data[i] = Math.min(255, data[i] * (1 + factor * 0.3)); // R
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.2)); // G
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.4)); // B
      
      // Add texture variation
      const noise = (Math.random() - 0.5) * factor * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  applyWatercolorEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Soft, flowing watercolor effect
      const softness = factor * 0.8;
      data[i] = data[i] * (1 - softness) + 200 * softness; // R
      data[i + 1] = data[i + 1] * (1 - softness) + 220 * softness; // G
      data[i + 2] = data[i + 2] * (1 - softness) + 240 * softness; // B
    }
  }

  applyVanGoghStyle(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Van Gogh style with swirling colors
      const swirl = Math.sin(i * 0.01) * factor * 30;
      data[i] = Math.max(0, Math.min(255, data[i] + swirl)); // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + swirl * 0.8)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + swirl * 1.2)); // B
    }
  }

  applySepiaEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Sepia transformation
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      data[i] = Math.min(255, r * (1 - factor) + tr * factor);
      data[i + 1] = Math.min(255, g * (1 - factor) + tg * factor);
      data[i + 2] = Math.min(255, b * (1 - factor) + tb * factor);
    }
  }

  applyPencilSketchEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale first
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      
      // Apply sketch effect
      const sketch = 255 - gray;
      const final = gray * (1 - factor) + sketch * factor * 0.5;
      
      data[i] = final;
      data[i + 1] = final;
      data[i + 2] = final;
    }
  }

  applyVibrantColors(data, intensity) {
    const factor = 1 + (intensity / 10) * 0.5;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor); // R
      data[i + 1] = Math.min(255, data[i + 1] * factor); // G
      data[i + 2] = Math.min(255, data[i + 2] * factor); // B
    }
  }

  applyPromptBasedEffects(data, prompt, intensity) {
    const factor = intensity / 10;
    const lowerPrompt = prompt.toLowerCase();

    // Apply effects based on prompt keywords
    if (lowerPrompt.includes('warm') || lowerPrompt.includes('orange') || lowerPrompt.includes('red')) {
      this.applyWarmTone(data, factor);
    }
    if (lowerPrompt.includes('cool') || lowerPrompt.includes('blue') || lowerPrompt.includes('cold')) {
      this.applyCoolTone(data, factor);
    }
    if (lowerPrompt.includes('bright') || lowerPrompt.includes('vibrant')) {
      this.applyBrightness(data, factor);
    }
    if (lowerPrompt.includes('dark') || lowerPrompt.includes('moody')) {
      this.applyDarkness(data, factor);
    }
    if (lowerPrompt.includes('vintage') || lowerPrompt.includes('old')) {
      this.applySepiaEffect(data, factor * 5);
    }
  }

  applyWarmTone(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor * 0.2)); // R
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1)); // G
    }
  }

  applyCoolTone(data, factor) {
    for (let i = 0; i < data.length; i += 4) {
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.2)); // B
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1)); // G
    }
  }

  applyBrightness(data, factor) {
    const brightness = factor * 30;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + brightness); // R
      data[i + 1] = Math.min(255, data[i + 1] + brightness); // G
      data[i + 2] = Math.min(255, data[i + 2] + brightness); // B
    }
  }

  applyDarkness(data, factor) {
    const darkness = factor * 0.7;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (1 - darkness); // R
      data[i + 1] = data[i + 1] * (1 - darkness); // G
      data[i + 2] = data[i + 2] * (1 - darkness); // B
    }
  }

  // Fallback general effects
  applyGeneralArtisticEffect(data, intensity) {
    this.applyOilPaintingEffect(data, intensity);
  }

  applyGeneralStyleTransfer(data, intensity) {
    this.applyVanGoghStyle(data, intensity);
  }

  applyVintageEffect(data, intensity) {
    this.applySepiaEffect(data, intensity);
  }

  applyAutoEnhancement(data, intensity) {
    this.applyVibrantColors(data, intensity);
  }

  applyEdgeDetection(data, intensity) {
    // Simple edge detection for background removal demo
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const edge = gray > 128 ? 255 : 0;
      const blend = gray * (1 - factor) + edge * factor;
      
      data[i] = blend;
      data[i + 1] = blend;
      data[i + 2] = blend;
    }
  }

  // Additional style implementations
  applyImpressionistEffect(data, intensity) {
    this.applyOilPaintingEffect(data, intensity * 0.8);
  }

  applyAbstractEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const wave = Math.sin(i * 0.005) * factor * 50;
      data[i] = Math.max(0, Math.min(255, data[i] + wave));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + wave * 1.2));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + wave * 0.8));
    }
  }

  applyDigitalArtEffect(data, intensity) {
    this.applyVibrantColors(data, intensity);
  }

  applyPicassoStyle(data, intensity) {
    // Cubist-inspired color shifts
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const shift = (i % 12) * factor * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + shift));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] - shift * 0.5));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + shift * 1.5));
    }
  }

  applyMonetStyle(data, intensity) {
    this.applyWatercolorEffect(data, intensity);
  }

  applyDaVinciStyle(data, intensity) {
    // Renaissance-style warm tones
    this.applyWarmTone(data, intensity / 10);
  }

  applyHokusaiStyle(data, intensity) {
    // Japanese woodblock print style
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Posterize effect
      data[i] = Math.floor(data[i] / 64) * 64 * (1 + factor);
      data[i + 1] = Math.floor(data[i + 1] / 64) * 64 * (1 + factor);
      data[i + 2] = Math.floor(data[i + 2] / 64) * 64 * (1 + factor);
    }
  }

  apply1950sStyle(data, intensity) {
    // Mid-century color palette
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor * 0.3)); // Warm reds
      data[i + 1] = Math.min(255, data[i + 1] * (1 - factor * 0.1)); // Slightly reduce green
      data[i + 2] = Math.min(255, data[i + 2] * (1 - factor * 0.2)); // Reduce blue
    }
  }

  apply1970sStyle(data, intensity) {
    // Retro 70s orange and brown tones
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor * 0.4)); // Orange boost
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.2)); // Yellow boost
      data[i + 2] = Math.min(255, data[i + 2] * (1 - factor * 0.3)); // Reduce blue
    }
  }

  applyFilmGrainEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * factor * 40;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
  }

  applyCharcoalEffect(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const charcoal = gray < 128 ? gray * 0.5 : 255 - (255 - gray) * 0.3;
      const final = gray * (1 - factor) + charcoal * factor;
      
      data[i] = final;
      data[i + 1] = final;
      data[i + 2] = final;
    }
  }

  applyPenInkEffect(data, intensity) {
    this.applyPencilSketchEffect(data, intensity);
    // Add high contrast
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] > 128 ? Math.min(255, data[i] * (1 + factor)) : Math.max(0, data[i] * (1 - factor));
      data[i + 1] = data[i + 1] > 128 ? Math.min(255, data[i + 1] * (1 + factor)) : Math.max(0, data[i + 1] * (1 - factor));
      data[i + 2] = data[i + 2] > 128 ? Math.min(255, data[i + 2] * (1 + factor)) : Math.max(0, data[i + 2] * (1 - factor));
    }
  }

  applyLineArtEffect(data, intensity) {
    // High contrast line art
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const line = gray > 120 ? 255 : 0;
      const final = gray * (1 - factor) + line * factor;
      
      data[i] = final;
      data[i + 1] = final;
      data[i + 2] = final;
    }
  }

  applyNaturalEnhancement(data, intensity) {
    const factor = intensity / 20; // More subtle
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor));
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor));
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor));
    }
  }

  applyCinematicGrading(data, intensity) {
    const factor = intensity / 10;
    for (let i = 0; i < data.length; i += 4) {
      // Orange and teal color grading
      data[i] = Math.min(255, data[i] * (1 + factor * 0.2)); // Orange boost
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1)); // Slight green
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.3)); // Teal boost
    }
  }
}

export default new ImageProcessor();