// artworkExample.js - Example of how to add artworks to user gallery

import { addArtworkToGallery, addUserActivity } from '../utils/artworkUtils';

// Example function to simulate creating an artwork
export const createExampleArtwork = (userEmail, userId) => {
  const exampleArtwork = {
    title: 'My Beautiful Creation',
    style: 'Van Gogh',
    originalImage: 'https://images.unsplash.com/photo-1494790108755-2616c9c6cab8?w=400&h=300&fit=crop',
    transformedImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    status: 'completed',
    userId: userId
  };

  // Add artwork to gallery
  const newArtwork = addArtworkToGallery(userEmail, exampleArtwork);
  
  if (newArtwork) {
    console.log('Artwork added successfully:', newArtwork);
    
    // You can also trigger a refresh of the gallery page if needed
    // window.location.reload(); // Only if necessary
    
    return newArtwork;
  } else {
    console.error('Failed to add artwork');
    return null;
  }
};

// Example of how to add user activity
export const trackUserAction = (userEmail, actionType, details) => {
  const activity = addUserActivity(userEmail, {
    type: actionType,
    details: details,
    timestamp: new Date().toISOString()
  });
  
  return activity;
};

// Usage examples:
/*
import { createExampleArtwork } from './examples/artworkExample';
import { useAuth } from './context/AuthContext';

// In your component:
const { user } = useAuth();

// When user creates an artwork:
const handleCreateArtwork = () => {
  const artwork = createExampleArtwork(user.email, user.id);
  if (artwork) {
    // Show success message
    alert('Artwork added to your gallery!');
  }
};
*/