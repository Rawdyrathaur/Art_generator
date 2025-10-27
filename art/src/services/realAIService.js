// Real AI API Integration Service
class RealAIService {
  constructor() {
    // API endpoints and configurations
    this.apis = {
      openai: {
        baseUrl: 'https://api.openai.com/v1',
        models: ['dall-e-3', 'dall-e-2']
      },
      stability: {
        baseUrl: 'https://api.stability.ai/v1',
        models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6']
      },
      huggingface: {
        baseUrl: 'https://api-inference.huggingface.co/models',
        models: [
          'runwayml/stable-diffusion-v1-5',
          'stabilityai/stable-diffusion-xl-base-1.0',
          'prompthero/openjourney',
          'nitrosocke/Arcane-Diffusion'
        ]
      },
      replicate: {
        baseUrl: 'https://api.replicate.com/v1',
        models: [
          'stability-ai/stable-diffusion',
          'rossjillian/controlnet',
          'jagilley/controlnet-scribble'
        ]
      }
    };

    // Check for API keys from environment or backend
    this.checkAPIConfiguration();
  }

  async checkAPIConfiguration() {
    try {
      // Try to get API keys from backend configuration
      const response = await fetch('/api/admin/config/ai-status', {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const config = await response.json();
        this.apiConfig = config.data;
        console.log('AI APIs configured:', this.apiConfig);
      }
    } catch (error) {
      console.log('Using fallback AI configuration');
      // Fallback to demo mode or default configuration
      this.apiConfig = {
        openai_configured: false,
        stability_configured: false,
        huggingface_configured: true, // HuggingFace has free tier
        processing_mode: 'DEMO'
      };
    }
  }

  getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  }

  // Main function to transform image using real AI APIs
  async transformImage(imageDataUrl, toolType, style, intensity, customPrompt) {
    console.log('🚀 Starting REAL AI transformation:', {
      tool: toolType,
      style: style,
      intensity: intensity,
      prompt: customPrompt
    });

    try {
      // Convert data URL to blob for API upload
      const imageBlob = await this.dataURLToBlob(imageDataUrl);
      
      // Build the AI prompt based on user inputs
      const aiPrompt = this.buildAIPrompt(toolType, style, intensity, customPrompt);
      
      console.log('📝 Generated AI prompt:', aiPrompt);

      // Try different AI services in order of preference
      const aiServices = this.getAvailableServices();
      
      for (const service of aiServices) {
        try {
          console.log(`🤖 Trying ${service} API...`);
          const result = await this.callAIService(service, imageBlob, aiPrompt, toolType, style, intensity);
          
          if (result && result.success) {
            console.log(`✅ ${service} transformation successful!`);
            return {
              success: true,
              transformedImageUrl: result.imageUrl,
              service: service,
              prompt: aiPrompt,
              processingTime: result.processingTime || 0
            };
          }
        } catch (serviceError) {
          console.warn(`❌ ${service} failed:`, serviceError.message);
          continue; // Try next service
        }
      }
      
      // If all real APIs fail, use enhanced demo mode
      console.log('🎭 All AI APIs unavailable, using enhanced demo mode');
      return await this.enhancedDemoMode(imageDataUrl, aiPrompt, toolType, style, intensity);
      
    } catch (error) {
      console.error('❌ AI transformation failed:', error);
      throw new Error('AI transformation failed: ' + error.message);
    }
  }

  // Convert data URL to blob for API upload
  async dataURLToBlob(dataURL) {
    const response = await fetch(dataURL);
    return await response.blob();
  }

  // Build intelligent AI prompt based on user selections
  buildAIPrompt(toolType, style, intensity, customPrompt) {
    let basePrompt = '';
    
    // Tool-specific prompt building
    switch (toolType) {
      case 'photo-to-art':
        basePrompt = this.getPhotoToArtPrompt(style, intensity);
        break;
      case 'style-transfer':
        basePrompt = this.getStyleTransferPrompt(style, intensity);
        break;
      case 'vintage-filter':
        basePrompt = this.getVintagePrompt(style, intensity);
        break;
      case 'sketch-maker':
        basePrompt = this.getSketchPrompt(style, intensity);
        break;
      case 'color-enhance':
        basePrompt = this.getColorEnhancePrompt(style, intensity);
        break;
      case 'background-remove':
        basePrompt = this.getBackgroundPrompt(style, intensity);
        break;
      default:
        basePrompt = 'artistic transformation, professional quality';
    }

    // Add custom prompt if provided
    if (customPrompt && customPrompt.trim()) {
      basePrompt += `, ${customPrompt.trim()}`;
    }

    // Add intensity-based qualifiers
    const intensityWords = this.getIntensityWords(intensity);
    basePrompt += `, ${intensityWords}`;

    // Add quality and style modifiers
    basePrompt += ', high quality, detailed, masterpiece, professional artwork';

    return basePrompt;
  }

  getPhotoToArtPrompt(style, intensity) {
    const stylePrompts = {
      'oil-painting': 'oil painting style, thick brushstrokes, rich textures, impasto technique',
      'watercolor': 'watercolor painting, soft edges, transparent layers, flowing colors',
      'impressionist': 'impressionist painting style, light brushstrokes, atmospheric, Monet-inspired',
      'abstract': 'abstract art style, geometric forms, bold colors, modern composition',
      'digital-art': 'digital art style, sharp details, vibrant colors, contemporary',
      'default': 'artistic painting, beautiful brushwork, classic art style'
    };
    return stylePrompts[style] || stylePrompts.default;
  }

  getStyleTransferPrompt(style, intensity) {
    const stylePrompts = {
      'van-gogh': 'in the style of Vincent van Gogh, swirling brushstrokes, post-impressionist, Starry Night style',
      'picasso': 'in the style of Pablo Picasso, cubist style, geometric forms, abstract faces',
      'monet': 'in the style of Claude Monet, impressionist, soft light, water lilies style',
      'da-vinci': 'in the style of Leonardo da Vinci, Renaissance style, sfumato technique, classical',
      'hokusai': 'in the style of Hokusai, Japanese woodblock print, wave patterns, traditional',
      'default': 'famous artist style, classical painting technique, masterful composition'
    };
    return stylePrompts[style] || stylePrompts.default;
  }

  getVintagePrompt(style, intensity) {
    const stylePrompts = {
      '1950s': 'vintage 1950s photography style, Kodachrome colors, mid-century aesthetic',
      '1970s': 'vintage 1970s style, retro colors, warm tones, film photography',
      'sepia': 'sepia tone photograph, vintage sepia effect, nostalgic brown tones',
      'film-grain': 'vintage film photography, grain texture, analog camera style',
      'default': 'vintage photography style, aged photo effect, nostalgic atmosphere'
    };
    return stylePrompts[style] || stylePrompts.default;
  }

  getSketchPrompt(style, intensity) {
    const stylePrompts = {
      'charcoal': 'charcoal drawing, dramatic shadows, artistic sketch, black and white',
      'pen-ink': 'pen and ink drawing, detailed linework, cross-hatching, precise lines',
      'line-art': 'clean line art, minimal lines, vector style, simple illustration',
      'default': 'pencil sketch, artistic drawing, detailed linework, grayscale'
    };
    return stylePrompts[style] || stylePrompts.default;
  }

  getColorEnhancePrompt(style, intensity) {
    const stylePrompts = {
      'vibrant': 'vibrant colors, saturated, bright and colorful, enhanced saturation',
      'natural': 'natural color enhancement, realistic colors, subtle improvement',
      'cinematic': 'cinematic color grading, movie-style colors, dramatic lighting',
      'default': 'color enhanced, improved saturation, better contrast'
    };
    return stylePrompts[style] || stylePrompts.default;
  }

  getBackgroundPrompt(style, intensity) {
    return 'clean background removal, transparent background, subject isolation, professional cutout';
  }

  getIntensityWords(intensity) {
    if (intensity <= 3) {
      return 'subtle, gentle, soft transformation';
    } else if (intensity <= 7) {
      return 'balanced, moderate, artistic transformation';
    } else {
      return 'dramatic, bold, striking transformation, highly stylized';
    }
  }

  // Get available AI services based on configuration
  getAvailableServices() {
    const services = [];
    
    // Always try HuggingFace first (has free tier)
    services.push('huggingface');
    
    if (this.apiConfig?.stability_configured) {
      services.push('stability');
    }
    
    if (this.apiConfig?.openai_configured) {
      services.push('openai');
    }
    
    // Add Replicate as fallback
    services.push('replicate');
    
    return services;
  }

  // Call specific AI service
  async callAIService(service, imageBlob, prompt, toolType, style, intensity) {
    const startTime = Date.now();
    
    switch (service) {
      case 'huggingface':
        return await this.callHuggingFaceAPI(imageBlob, prompt, toolType, startTime);
      case 'stability':
        return await this.callStabilityAPI(imageBlob, prompt, toolType, startTime);
      case 'openai':
        return await this.callOpenAIAPI(imageBlob, prompt, toolType, startTime);
      case 'replicate':
        return await this.callReplicateAPI(imageBlob, prompt, toolType, startTime);
      default:
        throw new Error(`Unknown AI service: ${service}`);
    }
  }

  // HuggingFace API Integration
  async callHuggingFaceAPI(imageBlob, prompt, toolType, startTime) {
    try {
      // Choose appropriate model based on tool type
      let modelUrl;
      if (toolType === 'style-transfer') {
        modelUrl = 'https://api-inference.huggingface.co/models/prompthero/openjourney';
      } else if (toolType === 'sketch-maker') {
        modelUrl = 'https://api-inference.huggingface.co/models/nitrosocke/Arcane-Diffusion';
      } else {
        modelUrl = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
      }

      // For image-to-image transformation
      const formData = new FormData();
      formData.append('inputs', prompt);
      
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY || 'hf_demo_key'}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      
      return {
        success: true,
        imageUrl: imageUrl,
        processingTime: (Date.now() - startTime) / 1000
      };
      
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw error;
    }
  }

  // Stability AI API Integration
  async callStabilityAPI(imageBlob, prompt, toolType, startTime) {
    try {
      const formData = new FormData();
      formData.append('init_image', imageBlob);
      formData.append('init_image_mode', 'IMAGE_STRENGTH');
      formData.append('image_strength', '0.35');
      formData.append('text_prompts[0][text]', prompt);
      formData.append('text_prompts[0][weight]', '1');
      formData.append('cfg_scale', '7');
      formData.append('samples', '1');
      formData.append('steps', '30');

      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_STABILITY_API_KEY || 'sk-demo-key'}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Stability AI error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.artifacts && result.artifacts.length > 0) {
        const imageData = result.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${imageData}`;
        
        return {
          success: true,
          imageUrl: imageUrl,
          processingTime: (Date.now() - startTime) / 1000
        };
      }
      
      throw new Error('No image generated by Stability AI');
      
    } catch (error) {
      console.error('Stability AI error:', error);
      throw error;
    }
  }

  // OpenAI DALL-E API Integration
  async callOpenAIAPI(imageBlob, prompt, toolType, startTime) {
    try {
      // DALL-E 3 doesn't support image-to-image directly
      // We use DALL-E 2 for variations or describe + generate approach
      
      const formData = new FormData();
      formData.append('image', imageBlob);
      formData.append('prompt', prompt);
      formData.append('n', '1');
      formData.append('size', '1024x1024');

      const response = await fetch('https://api.openai.com/v1/images/variations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-demo-key'}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        return {
          success: true,
          imageUrl: result.data[0].url,
          processingTime: (Date.now() - startTime) / 1000
        };
      }
      
      throw new Error('No image generated by OpenAI');
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // Replicate API Integration
  async callReplicateAPI(imageBlob, prompt, toolType, startTime) {
    try {
      // Convert blob to base64 for Replicate
      const base64Image = await this.blobToBase64(imageBlob);
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_REPLICATE_API_KEY || 'r8-demo-key'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
          input: {
            image: base64Image,
            prompt: prompt,
            num_inference_steps: 30,
            guidance_scale: 7.5,
            strength: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.status}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      const result = await this.pollReplicatePrediction(prediction.id);
      
      return {
        success: true,
        imageUrl: result.output[0],
        processingTime: (Date.now() - startTime) / 1000
      };
      
    } catch (error) {
      console.error('Replicate API error:', error);
      throw error;
    }
  }

  async pollReplicatePrediction(predictionId) {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_REPLICATE_API_KEY || 'r8-demo-key'}`
        }
      });
      
      const prediction = await response.json();
      
      if (prediction.status === 'succeeded') {
        return prediction;
      } else if (prediction.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }
    
    throw new Error('Replicate prediction timeout');
  }

  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Enhanced demo mode with better transformations when APIs are unavailable
  async enhancedDemoMode(imageDataUrl, prompt, toolType, style, intensity) {
    console.log('🎭 Using enhanced demo mode with AI-style processing');
    
    try {
      // Use our advanced image processor but with AI-style enhancements
      const AdvancedImageProcessor = (await import('./advancedImageProcessor.js')).default;
      
      const startTime = Date.now();
      const transformedUrl = await AdvancedImageProcessor.processImage(
        imageDataUrl, 
        toolType, 
        style, 
        intensity, 
        prompt
      );
      
      return {
        success: true,
        transformedImageUrl: transformedUrl,
        service: 'enhanced-demo',
        prompt: prompt,
        processingTime: (Date.now() - startTime) / 1000,
        isDemo: true
      };
      
    } catch (error) {
      throw new Error('Enhanced demo mode failed: ' + error.message);
    }
  }

  // Check if real AI APIs are available
  async checkAIAvailability() {
    const status = {
      openai: false,
      stability: false,
      huggingface: false,
      replicate: false
    };

    // Check each service
    try {
      // Quick health check for HuggingFace (most likely to work)
      const hfResponse = await fetch('https://huggingface.co/api/models/runwayml/stable-diffusion-v1-5', {
        method: 'HEAD',
        timeout: 5000
      });
      status.huggingface = hfResponse.ok;
    } catch (e) {
      console.log('HuggingFace unavailable');
    }

    return status;
  }
}

export default new RealAIService();