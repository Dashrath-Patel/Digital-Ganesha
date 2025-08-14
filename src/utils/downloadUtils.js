/**
 * Utility functions for file downloads and optimizations
 */

/**
 * Specialized function for Google Drive file downloads
 * @param {string} url - Google Drive URL
 * @param {string} filename - Filename to save as
 * @param {object} callbacks - Success and error callbacks
 * @returns {Promise<boolean>} - Success status
 */
export const downloadGoogleDriveFile = async (url, filename, { onSuccess, onError } = {}) => {
  return new Promise((resolve) => {
    try {
      // For Google Drive, we'll use a direct approach without opening new tabs
      const link = document.createElement('a');
      
      // Ensure the URL is in the correct format for direct download
      let downloadUrl = url;
      if (url.includes('drive.google.com') && !url.includes('export=download')) {
        // Extract file ID and format for direct download
        const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      }
      
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      link.style.position = 'absolute';
      link.style.left = '-9999px';
      
      // Add a temporary attribute to force download
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      
      // Create a click event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      link.dispatchEvent(clickEvent);
      
      // Clean up immediately
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
      
      // Provide feedback
      setTimeout(() => {
        if (onSuccess) onSuccess();
        resolve(true);
      }, 200);
      
    } catch (error) {
      console.error('Google Drive download failed:', error);
      
      // Fallback to regular download function
      return downloadFile(url, filename, { onSuccess, onError }).then(resolve);
    }
  });
};

/**
 * Optimized file download function with retry mechanism
 * @param {string} url - The URL to download
 * @param {string} filename - The filename to save as
 * @param {function} onProgress - Optional progress callback
 * @param {function} onSuccess - Optional success callback
 * @param {function} onError - Optional error callback
 * @returns {Promise<boolean>} - Success status
 */
export const downloadFile = async (url, filename, { onProgress, onSuccess, onError } = {}) => {
  return new Promise((resolve) => {
    try {
      // Method 1: Direct download link (no new tab)
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      // Remove target="_blank" to avoid opening new tab
      link.rel = 'noopener noreferrer';
      
      // Ensure link is not visible
      link.style.display = 'none';
      link.style.position = 'absolute';
      link.style.left = '-9999px';
      
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up immediately
      document.body.removeChild(link);
      
      // Provide immediate feedback
      setTimeout(() => {
        if (onSuccess) onSuccess();
        resolve(true);
      }, 100);
      
    } catch (error) {
      console.error('Direct download failed:', error);
      
      // Method 2: Fallback using iframe (still no new tab)
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = url;
        
        document.body.appendChild(iframe);
        
        // Clean up after a short delay
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
          resolve(true);
        }, 500);
        
      } catch (fallbackError) {
        console.error('Iframe download failed:', fallbackError);
        
        // Method 3: Last resort - copy to clipboard with instructions
        try {
          navigator.clipboard.writeText(url);
          if (onError) {
            onError('Download blocked. Link copied to clipboard. Please paste in browser to download.');
          }
          resolve(false);
        } catch (clipboardError) {
          if (onError) {
            onError('Download failed. Please try again or contact support.');
          }
          resolve(false);
        }
      }
    }
  });
};

/**
 * Pre-load a file to improve download speed
 * @param {string} url - The URL to preload
 * @returns {Promise<boolean>} - Preload success status
 */
export const preloadFile = async (url) => {
  return new Promise((resolve) => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.onload = () => resolve(true);
      link.onerror = () => resolve(false);
      
      document.head.appendChild(link);
      
      // Remove after 5 seconds to clean up
      setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Preload failed:', error);
      resolve(false);
    }
  });
};

/**
 * Check if a file URL is accessible
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Accessibility status
 */
export const checkFileAccessibility = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok;
  } catch (error) {
    console.warn('Could not check file accessibility:', error);
    return true; // Assume accessible if check fails
  }
};

/**
 * Get file size from URL (if possible)
 * @param {string} url - The URL to check
 * @returns {Promise<number|null>} - File size in bytes or null
 */
export const getFileSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    console.warn('Could not get file size:', error);
    return null;
  }
};

/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  downloadFile,
  downloadGoogleDriveFile,
  preloadFile,
  checkFileAccessibility,
  getFileSize,
  formatFileSize
};
