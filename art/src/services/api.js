// API service for backend communication
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  }

  // Create headers with authentication
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.includeAuth !== false),
          ...options.headers,
        },
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async signup(userData) {
    return this.apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async login(credentials) {
    return this.apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  }

  async logout() {
    return this.apiCall('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.apiCall('/auth/me');
  }

  // Project endpoints
  async uploadImage(formData) {
    const token = this.getAuthToken();
    
    return fetch(`${this.baseURL}/projects/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Don't set Content-Type for FormData
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  async getUserProjects(page = 0, size = 10) {
    return this.apiCall(`/projects?page=${page}&size=${size}`);
  }

  async getProject(projectId) {
    return this.apiCall(`/projects/${projectId}`);
  }

  async processProject(projectId, processingOptions = {}) {
    return this.apiCall(`/projects/${projectId}/process`, {
      method: 'POST',
      body: JSON.stringify(processingOptions),
    });
  }

  async getProcessingStatus(projectId) {
    return this.apiCall(`/projects/${projectId}/status`);
  }

  async deleteProject(projectId) {
    return this.apiCall(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health', {
      includeAuth: false,
    });
  }

  // Check if backend is available
  async isBackendAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new ApiService();