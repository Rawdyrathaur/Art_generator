// artworkUtils.js - Utility functions for managing user artworks

// Add a new artwork to user's gallery
export const addArtworkToGallery = (userEmail, artworkData) => {
  try {
    const userKey = userEmail.toLowerCase();
    const existingArtworks = JSON.parse(localStorage.getItem(`artworks_${userKey}`) || '[]');
    
    const newArtwork = {
      id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: artworkData.title || 'Untitled Artwork',
      style: artworkData.style || 'AI Style',
      originalImage: artworkData.originalImage,
      transformedImage: artworkData.transformedImage,
      createdAt: new Date().toISOString(),
      likes: 0,
      status: artworkData.status || 'completed',
      userId: artworkData.userId,
      userEmail: userEmail
    };
    
    const updatedArtworks = [newArtwork, ...existingArtworks];
    localStorage.setItem(`artworks_${userKey}`, JSON.stringify(updatedArtworks));
    
    // Also update user activity
    addUserActivity(userEmail, {
      type: 'artwork_created',
      artworkId: newArtwork.id,
      artworkTitle: newArtwork.title,
      style: newArtwork.style,
      date: new Date().toISOString()
    });
    
    return newArtwork;
  } catch (error) {
    console.error('Error adding artwork:', error);
    return null;
  }
};

// Get user's artworks
export const getUserArtworks = (userEmail) => {
  try {
    const userKey = userEmail.toLowerCase();
    return JSON.parse(localStorage.getItem(`artworks_${userKey}`) || '[]');
  } catch (error) {
    console.error('Error loading artworks:', error);
    return [];
  }
};

// Update artwork (e.g., add likes, change status)
export const updateArtwork = (userEmail, artworkId, updates) => {
  try {
    const userKey = userEmail.toLowerCase();
    const artworks = JSON.parse(localStorage.getItem(`artworks_${userKey}`) || '[]');
    
    const updatedArtworks = artworks.map(artwork => 
      artwork.id === artworkId ? { ...artwork, ...updates } : artwork
    );
    
    localStorage.setItem(`artworks_${userKey}`, JSON.stringify(updatedArtworks));
    return true;
  } catch (error) {
    console.error('Error updating artwork:', error);
    return false;
  }
};

// Delete artwork
export const deleteArtwork = (userEmail, artworkId) => {
  try {
    const userKey = userEmail.toLowerCase();
    const artworks = JSON.parse(localStorage.getItem(`artworks_${userKey}`) || '[]');
    
    const updatedArtworks = artworks.filter(artwork => artwork.id !== artworkId);
    localStorage.setItem(`artworks_${userKey}`, JSON.stringify(updatedArtworks));
    
    return true;
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return false;
  }
};

// Add user activity for tracking
export const addUserActivity = (userEmail, activityData) => {
  try {
    const userKey = userEmail.toLowerCase();
    const existingActivity = JSON.parse(localStorage.getItem(`activity_${userKey}`) || '[]');
    
    const newActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...activityData,
      date: activityData.date || new Date().toISOString()
    };
    
    const updatedActivity = [newActivity, ...existingActivity];
    localStorage.setItem(`activity_${userKey}`, JSON.stringify(updatedActivity));
    
    return newActivity;
  } catch (error) {
    console.error('Error adding user activity:', error);
    return null;
  }
};

// Get user activity
export const getUserActivity = (userEmail) => {
  try {
    const userKey = userEmail.toLowerCase();
    return JSON.parse(localStorage.getItem(`activity_${userKey}`) || '[]');
  } catch (error) {
    console.error('Error loading user activity:', error);
    return [];
  }
};

// Get user statistics
export const getUserStats = (userEmail) => {
  try {
    const artworks = getUserArtworks(userEmail);
    const activity = getUserActivity(userEmail);
    
    return {
      artworks: artworks.length,
      transformations: activity.filter(a => a.type === 'artwork_created').length,
      totalLikes: artworks.reduce((sum, artwork) => sum + (artwork.likes || 0), 0),
      stylesUsed: new Set(artworks.map(a => a.style)).size,
      lastActivity: activity.length > 0 ? activity[0].date : null
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      artworks: 0,
      transformations: 0,
      totalLikes: 0,
      stylesUsed: 0,
      lastActivity: null
    };
  }
};