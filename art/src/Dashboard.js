import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import apiService from './services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadProjects();
  }, [isAuthenticated, authLoading, navigate]);

  const loadProjects = async () => {
    try {
      if (user?.backendConnected && user?.token) {
        // Load from backend
        const response = await apiService.getUserProjects();
        if (response.success) {
          setProjects(response.data || []);
        } else {
          setError('Failed to load projects');
        }
      } else {
        // Demo mode - load from localStorage
        const demoProjects = JSON.parse(localStorage.getItem('demoProjects') || '[]');
        setProjects(demoProjects);
      }
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/get-started');
  };

  const handleProjectClick = (project) => {
    // Navigate to result page for completed projects
    if (project.status === 'COMPLETED' || project.demo) {
      navigate('/result', {
        state: {
          result: {
            originalUrl: project.originalImageUrl || project.originalUrl,
            processedUrl: project.processedImageUrl || project.processedUrl,
            styleType: project.styleType,
            processingTime: project.processingTimeSeconds || project.processingTime,
            demo: project.demo
          },
          selectedTool: project.styleType,
          backendConnected: user?.backendConnected || false,
          mode: project.demo ? 'demo' : 'backend'
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('demoProjects');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>My Art Gallery</h1>
            <p>Welcome back, {user?.name || 'Artist'}!</p>
          </div>
          
          <div className="header-right">
            <div className="connection-status">
              {user?.backendConnected ? (
                <span className="status-connected">🟢 Backend Connected</span>
              ) : (
                <span className="status-demo">🟡 Demo Mode</span>
              )}
            </div>
            
            <button onClick={handleCreateNew} className="create-new-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create New Art
            </button>
            
            <button onClick={handleLogout} className="logout-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {error ? (
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h3>Failed to Load Projects</h3>
            <p>{error}</p>
            <button onClick={loadProjects} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No Artworks Yet</h3>
            <p>Start creating your first AI artwork!</p>
            <button onClick={handleCreateNew} className="create-first-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create Your First Artwork
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div 
                key={project.id || index}
                className="project-card"
                onClick={() => handleProjectClick(project)}
              >
                <div className="project-image">
                  <img 
                    src={project.processedImageUrl || project.processedUrl || project.originalImageUrl || project.originalUrl} 
                    alt={project.name || `Artwork ${index + 1}`}
                  />
                  <div className="project-overlay">
                    <div className="project-actions">
                      <button className="view-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        View
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="project-info">
                  <h4>{project.name || `${project.styleType} Art`}</h4>
                  <div className="project-meta">
                    <span className="tool-badge">{project.styleType}</span>
                    <span className="date">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                  
                  <div className="project-status">
                    {project.status === 'COMPLETED' || project.demo ? (
                      <span className="status-complete">✅ Complete</span>
                    ) : project.status === 'PROCESSING' ? (
                      <span className="status-processing">🔄 Processing</span>
                    ) : project.status === 'FAILED' ? (
                      <span className="status-failed">❌ Failed</span>
                    ) : (
                      <span className="status-pending">⏳ Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {projects.length > 0 && (
          <div className="dashboard-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{projects.length}</div>
                <div className="stat-label">Total Artworks</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">
                  {projects.filter(p => p.status === 'COMPLETED' || p.demo).length}
                </div>
                <div className="stat-label">Completed</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">
                  {[...new Set(projects.map(p => p.styleType))].length}
                </div>
                <div className="stat-label">Styles Used</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">
                  {user?.backendConnected ? 'Unlimited' : 'Demo'}
                </div>
                <div className="stat-label">Mode</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;