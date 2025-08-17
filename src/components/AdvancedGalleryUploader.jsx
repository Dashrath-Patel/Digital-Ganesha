import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ImageKitService from '../services/ImageKitService';

const GALLERY_CATEGORIES = [
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    description: 'Grand celebration moments',
    icon: '🎭',
    gradient: 'from-red-900/60 to-amber-900/40'
  },
  {
    id: 'community-volunteers',
    name: 'Community Volunteers',
    description: 'Seva in action',
    icon: '🤝',
    gradient: 'from-amber-900/60 to-yellow-900/40'
  },
  {
    id: 'cultural-programs',
    name: 'Cultural Programs',
    description: 'Traditional performances',
    icon: '🎵',
    gradient: 'from-yellow-900/60 to-orange-900/40'
  }
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_PHOTOS_PER_CATEGORY = 20;

const AdvancedGalleryUploader = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [galleryStats, setGalleryStats] = useState({});
  const [existingPhotos, setExistingPhotos] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin || user?.email?.includes('admin');

  useEffect(() => {
    if (isAdmin) {
      loadGalleryStats();
    }
  }, [isAdmin]);

  const loadGalleryStats = async () => {
    try {
      const stats = {};
      const photos = {};
      
      for (const category of GALLERY_CATEGORIES) {
        const categoryData = await ImageKitService.getGalleryPhotos(category.id, {
          limit: MAX_PHOTOS_PER_CATEGORY
        });
        stats[category.id] = categoryData.total || 0;
        photos[category.id] = categoryData.photos || [];
      }
      
      setGalleryStats(stats);
      setExistingPhotos(photos);
    } catch (error) {
      console.error('Failed to load gallery stats:', error);
      showToast('Failed to load gallery statistics', 'error');
    }
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      errors.push('Only JPEG, JPG, and PNG formats are allowed');
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push('File size must be less than 5MB');
    }
    
    return errors;
  };

  const handleFileSelect = useCallback((selectedFiles) => {
    const validFiles = [];
    const errors = [];

    Array.from(selectedFiles).forEach((file, index) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        // Add preview URL
        const fileWithPreview = {
          ...file,
          id: `${Date.now()}-${index}`,
          preview: URL.createObjectURL(file)
        };
        validFiles.push(fileWithPreview);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      showToast(`Some files were rejected: ${errors.join('; ')}`, 'error');
    }

    setFiles(validFiles);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const removeFile = (fileId) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prevFiles.find(file => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  };

  const uploadFiles = async () => {
    if (!selectedCategory) {
      showToast('Please select a category', 'error');
      return;
    }

    if (files.length === 0) {
      showToast('Please select files to upload', 'error');
      return;
    }

    // Check category limit
    const currentCount = galleryStats[selectedCategory] || 0;
    if (currentCount + files.length > MAX_PHOTOS_PER_CATEGORY) {
      showToast(`Cannot upload ${files.length} files. Category limit is ${MAX_PHOTOS_PER_CATEGORY} photos. Current: ${currentCount}`, 'error');
      return;
    }

    setUploading(true);
    const category = GALLERY_CATEGORIES.find(cat => cat.id === selectedCategory);

    try {
      // Convert files to File objects for FormData
      const fileArray = files.map(file => file);
      
      // Update progress for all files
      files.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: { status: 'uploading', progress: 50 }
        }));
      });

      const result = await ImageKitService.uploadGalleryPhotos(fileArray, selectedCategory);

      // Update progress to success
      files.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: { status: 'success', progress: 100 }
        }));
        // Clean up preview URL
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      showToast(result.message || `Successfully uploaded ${result.data.total} photo(s) to ${category.name}`, 'success');
      
      // Reset form
      setFiles([]);
      setSelectedCategory('');
      setUploadProgress({});
      await loadGalleryStats(); // Refresh stats

    } catch (error) {
      console.error('Upload process failed:', error);
      
      // Update progress to error
      files.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: { status: 'error', progress: 0 }
        }));
      });
      
      showToast(error.message || 'Upload process failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (categoryId, photo) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await ImageKitService.deleteGalleryPhoto(photo.fileId);
      showToast('Photo deleted successfully', 'success');
      await loadGalleryStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to delete photo:', error);
      showToast(error.message || 'Failed to delete photo', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-gradient-to-r from-red-950/80 via-red-900/70 to-red-950/80 backdrop-blur-md rounded-2xl p-8 border-2 border-golden/40">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-golden mb-2">Admin Access Required</h3>
          <p className="text-golden-light">Only administrators can upload photos to the gallery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-gradient-to-r from-red-950/80 via-red-900/70 to-red-950/80 backdrop-blur-md rounded-2xl p-8 border-2 border-golden/40">
        <h3 className="text-2xl font-bold text-golden mb-6">Upload Photos to Gallery</h3>
        
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-golden font-semibold mb-3">Select Category</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-golden bg-golden/20 shadow-lg'
                    : 'border-golden/30 hover:border-golden/60 hover:bg-golden/10'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-golden font-semibold">{category.name}</div>
                <div className="text-golden-light text-sm">{category.description}</div>
                <div className="text-xs text-golden-light mt-2">
                  {galleryStats[category.id] || 0} / {MAX_PHOTOS_PER_CATEGORY} photos
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-golden bg-golden/20' 
              : 'border-golden/40 hover:border-golden/60'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="text-6xl mb-4">📸</div>
          <h4 className="text-xl font-semibold text-golden mb-2">
            Drag & Drop Photos Here
          </h4>
          <p className="text-golden-light mb-4">
            or <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-golden hover:text-golden-light underline"
            >
              click to browse
            </button>
          </p>
          <div className="text-sm text-golden-light">
            Supported formats: JPEG, JPG, PNG • Max size: 5MB per file
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-golden mb-4">
              Selected Files ({files.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {files.map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg border border-golden/30"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg truncate">
                    {file.name}
                  </div>
                  {/* Progress indicator */}
                  {uploadProgress[file.id] && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      {uploadProgress[file.id].status === 'uploading' && (
                        <div className="text-white text-sm">Uploading...</div>
                      )}
                      {uploadProgress[file.id].status === 'success' && (
                        <div className="text-green-400 text-sm">✓ Uploaded</div>
                      )}
                      {uploadProgress[file.id].status === 'error' && (
                        <div className="text-red-400 text-sm">✗ Failed</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={uploadFiles}
              disabled={uploading || !selectedCategory}
              className="bg-gradient-to-r from-golden to-golden-light text-red-950 px-8 py-3 rounded-full font-bold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Photo(s)`}
            </button>
          </div>
        )}
      </div>

      {/* Gallery Management */}
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20">
        <h3 className="text-xl font-bold text-golden mb-6">Gallery Management</h3>
        
        {GALLERY_CATEGORIES.map((category) => (
          <div key={category.id} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h4 className="font-semibold text-golden">{category.name}</h4>
                  <p className="text-sm text-golden-light">
                    {galleryStats[category.id] || 0} / {MAX_PHOTOS_PER_CATEGORY} photos
                  </p>
                </div>
              </div>
            </div>
            
            {existingPhotos[category.id] && existingPhotos[category.id].length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {existingPhotos[category.id].slice(0, 8).map((photo) => (
                  <div key={photo.fileId} className="relative group">
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.name}
                      className="w-full h-16 object-cover rounded border border-golden/30"
                    />
                    <button
                      onClick={() => deletePhoto(category.id, photo)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {existingPhotos[category.id].length > 8 && (
                  <div className="flex items-center justify-center h-16 bg-golden/20 rounded border border-golden/30 text-golden text-xs">
                    +{existingPhotos[category.id].length - 8} more
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedGalleryUploader;
