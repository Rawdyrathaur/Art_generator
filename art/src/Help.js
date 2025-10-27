import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './Help.css';

const Help = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        {
          title: 'Creating Your First Artwork',
          content: 'Learn how to upload an image and apply AI transformations to create stunning artworks.',
          steps: [
            'Navigate to the "Get Started" page',
            'Upload your image by clicking "Choose Image" or dragging and dropping',
            'Select an AI style from our collection (Van Gogh, Picasso, Abstract, etc.)',
            'Click "Transform" and wait for the magic to happen',
            'Download or save your transformed artwork'
          ]
        },
        {
          title: 'Understanding AI Styles',
          content: 'Discover the different artistic styles available and how they transform your images.',
          steps: [
            'Browse through 25+ professional AI styles',
            'Preview style samples before applying',
            'Adjust style intensity for custom results',
            'Combine multiple styles for unique effects'
          ]
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: '👤',
      articles: [
        {
          title: 'Managing Your Profile',
          content: 'Customize your profile information and preferences.',
          steps: [
            'Go to Profile from the dropdown menu',
            'Edit your name, bio, location, and website',
            'Upload a custom avatar image',
            'Set your privacy preferences'
          ]
        },
        {
          title: 'Account Settings',
          content: 'Configure notifications, privacy, and AI preferences.',
          steps: [
            'Access Settings from the profile menu',
            'Customize notification preferences',
            'Set privacy and data sharing options',
            'Configure AI quality and auto-save settings'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Tools',
      icon: '🛠️',
      articles: [
        {
          title: 'Gallery Management',
          content: 'Organize and manage your AI-generated artworks.',
          steps: [
            'View all your creations in the Gallery',
            'Filter artworks by style, date, or status',
            'Sort by newest, oldest, or popularity',
            'Download or share your favorite pieces'
          ]
        },
        {
          title: 'Batch Processing',
          content: 'Process multiple images at once (Pro feature).',
          steps: [
            'Upload multiple images simultaneously',
            'Apply the same style to all images',
            'Monitor processing progress',
            'Download all results in a zip file'
          ]
        }
      ]
    },
    {
      id: 'membership',
      title: 'Membership & Billing',
      icon: '💎',
      articles: [
        {
          title: 'Subscription Plans',
          content: 'Understanding the different membership tiers and their benefits.',
          steps: [
            'Free: 10 transformations/month with basic styles',
            'Pro: Unlimited transformations with premium features',
            'Enterprise: Advanced features for teams and businesses',
            'Compare features and choose the right plan'
          ]
        },
        {
          title: 'Billing & Payments',
          content: 'Manage your subscription and billing information.',
          steps: [
            'View current plan and usage statistics',
            'Upgrade or downgrade your membership',
            'Access billing history and invoices',
            'Update payment methods'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      articles: [
        {
          title: 'Common Issues',
          content: 'Solutions to frequently encountered problems.',
          steps: [
            'Image upload fails: Check file size (max 10MB) and format (JPG, PNG)',
            'Processing takes too long: High-quality mode takes 2-5 minutes',
            'Style not applying: Ensure good internet connection and try again',
            'Login issues: Clear browser cache or try incognito mode'
          ]
        },
        {
          title: 'Performance Tips',
          content: 'Optimize your experience for best results.',
          steps: [
            'Use high-resolution images for better quality',
            'Ensure stable internet connection during processing',
            'Close other tabs to free up browser memory',
            'Try different browsers if issues persist'
          ]
        }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0 || searchQuery === '');

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="help-container">
      <div className="help-header">
        <h1 className="help-title">Help & Support</h1>
        <p className="help-subtitle">Find answers to your questions and learn how to make the most of Artify Studio</p>
        
        <div className="help-search">
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="help-content">
        <div className="help-sidebar">
          <nav className="help-nav">
            {filteredSections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.title}</span>
                <span className="nav-count">{section.articles.length}</span>
              </button>
            ))}
          </nav>
          
          {user && (
            <div className="help-contact">
              <h3>Need More Help?</h3>
              <p>Can't find what you're looking for?</p>
              <button className="contact-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Contact Support
              </button>
            </div>
          )}
        </div>

        <div className="help-main">
          {currentSection && (
            <>
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">{currentSection.icon}</span>
                  {currentSection.title}
                </h2>
              </div>

              <div className="articles-grid">
                {currentSection.articles.map((article, index) => (
                  <div key={index} className="article-card">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-content">{article.content}</p>
                    
                    <div className="article-steps">
                      {article.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="step-item">
                          <div className="step-number">{stepIndex + 1}</div>
                          <div className="step-text">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {searchQuery && filteredSections.every(s => s.articles.length === 0) && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No articles found</h3>
              <p>Try searching with different keywords or browse our help sections.</p>
            </div>
          )}
        </div>
      </div>

      {!user && (
        <div className="help-cta">
          <h2>Get the Most Out of Artify Studio</h2>
          <p>Sign up for a free account to access all features and personalized support.</p>
          <button className="cta-button">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Help;