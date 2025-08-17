import React, { useState, useEffect, useCallback } from 'react';
import PhotoUploadService from '../services/PhotoUploadService';
import { useAuth } from '../contexts/AuthContext';

const GalleryViewer = ({ 
  category = '', 
  showUploader = false, 
  allowDelete = false,
  layout = 'grid', // 'grid', 'masonry', 'list'
  columns = 4, // Number of columns for grid layout
  showFilters = true,
  showPagination = true,
  itemsPerPage = 12,
  autoRefresh = false, // Auto refresh every 30 seconds
  autoRefreshInterval = 30000 // 30 seconds
}) => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'images', 'videos'
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For manual refresh
  const [lastRefresh, setLastRefresh] = useState(Date.now()); // Track last refresh time
  const [currentTime, setCurrentTime] = useState(Date.now()); // For real-time updates

  // Available categories
  const categories = [
    'All', 
    'Festivals', 
    'Community Events', 
    'Volunteers', 
    'Behind the Scenes',
    'Cultural Programs',
    'Decorations',
    'Food & Prasad',
    'Children Activities'
  ];

  // Load media with current filters
  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        limit: itemsPerPage,
        page: currentPage,
        type: 'image', // Only show images in gallery
        isPublic: true // Only show public images
      };

      // Apply category filter
      if (selectedCategory && selectedCategory !== 'All') {
        filters.category = selectedCategory;
      }

      // Apply search filter
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      const result = await PhotoUploadService.getMediaList(filters);
      
      if (result.success) {
        setMedia(result.data.media || []);
        setTotalPages(result.data.pagination?.pages || 1);
        setTotalItems(result.data.pagination?.total || 0);
        setLastRefresh(Date.now()); // Update last refresh time
      } else {
        throw new Error(result.error || 'Failed to load media');
      }
    } catch (err) {
      console.error('Error loading media:', err);
      setError(err.message);
      setMedia([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, searchTerm, itemsPerPage, refreshTrigger]);

  // Load media when filters change
  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Format last refresh time
  const formatLastRefresh = () => {
    const diff = currentTime - lastRefresh;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, autoRefreshInterval]);

  // Update current time every second for accurate "time ago" display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const handleImageClick = (imageItem) => {
    setSelectedImage(imageItem);
  };

  const handleDeleteMedia = async (mediaId, event) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await PhotoUploadService.deleteMedia(mediaId);
      if (result.success) {
        // Remove from current media list
        setMedia(prev => prev.filter(item => item._id !== mediaId));
        setTotalItems(prev => prev - 1);
        
        // Close modal if deleted image was selected
        if (selectedImage && selectedImage._id === mediaId) {
          setSelectedImage(null);
        }
        
        // Show success message
        console.log('Media deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete media');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Error deleting media: ' + error.message);
    }
  };

  const getOptimizedImageUrl = (url, width = 300, height = 300, quality = 80) => {
    if (!url) return '';
    
    // For now, return the original URL as ImageKit already provides optimized images
    // We can add transformations later if needed
    return url;
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (media.length <= 1) return;
    
    const currentIndex = media.findIndex(item => item._id === selectedImage._id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
    }
    
    setSelectedImage(media[newIndex]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-4';
    
    switch (layout) {
      case 'masonry':
        return `columns-1 sm:columns-2 lg:columns-3 xl:columns-${Math.min(columns, 4)} gap-4`;
      case 'list':
        return 'grid grid-cols-1 gap-4';
      default: // grid
        const colClasses = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 sm:grid-cols-2',
          3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
          6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
        };
        return `${baseClasses} ${colClasses[Math.min(columns, 6)] || colClasses[4]}`;
    }
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, media]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-golden/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-golden rounded-full animate-spin"></div>
          </div>
          <p className="text-golden-light text-lg">Loading gallery...</p>
          <p className="text-golden-light/60 text-sm mt-2">Please wait while we fetch your images</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
        <div className="text-8xl mb-6">⚠️</div>
        <h3 className="text-red-300 text-2xl font-bold mb-4">Failed to Load Gallery</h3>
        <p className="text-red-400 mb-6">{error}</p>
        <button 
          onClick={loadMedia}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-golden/30 rounded-xl px-4 py-3 pl-12 text-golden placeholder-golden-light/60 focus:outline-none focus:border-golden focus:bg-white/20 transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-golden-light/60">
              🔍
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-golden-light/60 hover:text-golden transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${
                    (cat === 'All' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-golden text-red-900 border-golden shadow-lg shadow-golden/30'
                      : 'bg-transparent text-golden border-golden/30 hover:border-golden hover:bg-golden/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-golden/20 border border-golden/40 rounded-lg text-golden hover:bg-golden/30 hover:border-golden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Refresh gallery to see latest changes. Last updated: ${formatLastRefresh()}`}
              >
                <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>🔄</span>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Refresh</span>
                  <span className="text-xs text-golden/70">{formatLastRefresh()}</span>
                </div>
              </button>
              {autoRefresh && (
                <div className="text-xs text-golden/60">
                  Auto-refresh: ON
                </div>
              )}
            </div>

            {/* View Mode and Sort Controls */}
            <div className="flex gap-2 items-center">
              {/* View Mode Filter */}
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All', icon: '🖼️' },
                  { key: 'images', label: 'Photos', icon: '📷' },
                  { key: 'videos', label: 'Videos', icon: '🎥' }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 text-sm ${
                      viewMode === mode.key
                        ? 'bg-golden text-red-900 shadow-md'
                        : 'text-golden hover:bg-white/10'
                    }`}
                  >
                    <span>{mode.icon}</span>
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Sort Controls */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="bg-white/10 border border-golden/30 rounded-lg px-3 py-2 text-golden text-sm focus:outline-none focus:border-golden"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="category-asc">Category A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {totalItems > 0 && (
        <div className="text-center bg-white/5 rounded-lg p-4 border border-golden/20">
          <p className="text-golden-light">
            Showing <span className="text-golden font-semibold">{media.length}</span> of{' '}
            <span className="text-golden font-semibold">{totalItems}</span> {viewMode === 'all' ? 'items' : viewMode}
            {selectedCategory && selectedCategory !== 'All' && (
              <span> in <span className="text-golden font-semibold">{selectedCategory}</span></span>
            )}
            {searchTerm && (
              <span> matching "<span className="text-golden font-semibold">{searchTerm}</span>"</span>
            )}
          </p>
        </div>
      )}

      {/* Gallery Grid */}
      {media.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-9xl mb-8">
            {searchTerm ? '🔍' : selectedCategory ? '📂' : '📷'}
          </div>
          <h3 className="text-3xl font-bold text-golden mb-4">
            {searchTerm ? 'No Results Found' : 'No Media Available'}
          </h3>
          <p className="text-golden-light text-lg mb-8 max-w-md mx-auto">
            {searchTerm 
              ? `No ${viewMode} found matching "${searchTerm}".`
              : selectedCategory && selectedCategory !== 'All'
              ? `No ${viewMode} found in ${selectedCategory} category.`
              : `No ${viewMode} have been uploaded yet.`
            }
          </p>
          <div className="flex gap-4 justify-center">
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  setViewMode('all');
                }}
                className="bg-golden text-red-900 px-6 py-3 rounded-full font-semibold hover:bg-golden-light transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            )}
            {showUploader && user?.role === 'admin' && (
              <button
                onClick={() => {/* Handle upload */}}
                className="bg-transparent border border-golden text-golden px-6 py-3 rounded-full font-semibold hover:bg-golden hover:text-red-900 transition-all duration-300 hover:scale-105"
              >
                Upload Media
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={getGridClasses()}>
          {media.map((item) => (
            <div
              key={item._id}
              className={`group relative bg-gradient-to-br from-red-900/40 via-amber-900/30 to-yellow-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-golden/20 hover:border-golden/50 transition-all duration-500 hover:shadow-2xl hover:shadow-golden/20 cursor-pointer hover:-translate-y-1 ${
                layout === 'masonry' ? 'break-inside-avoid mb-4' : ''
              }`}
              onClick={() => handleImageClick(item)}
            >
              {/* Media Preview */}
              <div className={`relative overflow-hidden ${layout === 'list' ? 'aspect-video' : 'aspect-square'}`}>
                {/* Always Visible Category Badge */}
                {item.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-golden via-yellow-400 to-amber-400 text-red-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-yellow-300/50 backdrop-blur-sm">
                      {PhotoUploadService.mapCategoryToFrontend(item.category)}
                    </div>
                  </div>
                )}

                {item.type === 'video' ? (
                  <div className="relative w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                    <div className="text-6xl text-white/80 transition-transform duration-300 group-hover:scale-110">🎥</div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[14px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-purple-500/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      VIDEO
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={getOptimizedImageUrl(item.url, 400, 400, 85)}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/400';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
                
                {/* Always Visible Category Badge */}
                {item.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-golden to-yellow-400 text-red-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-yellow-300/50 backdrop-blur-sm">
                      {PhotoUploadService.mapCategoryToFrontend(item.category)}
                    </div>
                  </div>
                )}

                {/* Hover Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    {/* Spacer for category badge */}
                    <div></div>
                    
                    {/* Delete Button */}
                    {allowDelete && (user?.role === 'admin' || user?._id === item.uploadedBy) && (
                      <button
                        onClick={(e) => handleDeleteMedia(item._id, e)}
                        className="w-9 h-9 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
                        title="Delete media"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {/* Bottom Info */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 -m-4 mt-auto">
                    <h4 className="text-white font-bold text-sm mb-1 truncate">
                      {item.title || 'Untitled'}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        {item.type === 'video' ? '🎥' : '📷'} 
                        {item.type}
                      </span>
                      <span>📅 {formatDate(item.createdAt)}</span>
                    </div>
                    {item.description && (
                      <p className="text-white/70 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Info (Always Visible) */}
              <div className="p-4">
                <h4 className="text-golden font-bold text-sm mb-2 truncate">
                  {item.title || 'Untitled'}
                </h4>
                
                {/* Category Tag - More Prominent */}
                {item.category && (
                  <div className="mb-3">
                    <span className="bg-gradient-to-r from-golden via-yellow-400 to-amber-400 text-red-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                      📂 {PhotoUploadService.mapCategoryToFrontend(item.category)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-golden-light mb-2">
                  <span className="flex items-center gap-1">
                    {item.type === 'video' ? '🎥' : '📷'} 
                    {item.type}
                  </span>
                  <span>📅 {formatDate(item.createdAt)}</span>
                </div>
                {item.description && (
                  <p className="text-golden-light/80 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 text-xs text-golden-light/60">
                  {item.fileSize && (
                    <span>📦 {formatFileSize(item.fileSize)}</span>
                  )}
                  {item.uploadedBy && (
                    <span>👤 {item.uploadedBy.name || 'Anonymous'}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-golden/30 text-golden hover:bg-golden/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ← Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 7) {
                pageNumber = i + 1;
              } else {
                // Smart pagination display
                if (currentPage <= 4) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = currentPage - 3 + i;
                }
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded-lg border transition-all duration-300 text-sm font-medium ${
                    currentPage === pageNumber
                      ? 'bg-golden text-red-900 border-golden shadow-lg'
                      : 'border-golden/30 text-golden hover:bg-golden/10 hover:border-golden'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {totalPages > 7 && currentPage < totalPages - 3 && (
              <>
                <span className="flex items-center text-golden-light">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded-lg border border-golden/30 text-golden hover:bg-golden/10 transition-all duration-300 text-sm font-medium"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-golden/30 text-golden hover:bg-golden/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal for Full Image View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              title="Close (Esc)"
            >
              ✕
            </button>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 text-xl"
                  title="Previous (←)"
                >
                  ←
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 text-xl"
                  title="Next (→)"
                >
                  →
                </button>
              </>
            )}

            {/* Media Container */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              {selectedImage.type === 'video' ? (
                <div className="w-full max-w-5xl aspect-video bg-black rounded-t-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl text-white/60 mb-4">🎥</div>
                    <p className="text-white/80 text-lg">Video Preview</p>
                    <p className="text-white/60 text-sm mt-2">Click to play in external player</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={getOptimizedImageUrl(selectedImage.url, 1400, 1000, 95)}
                    alt={selectedImage.title || 'Gallery image'}
                    className="max-w-full max-h-[85vh] object-contain"
                    onError={(e) => {
                      e.target.src = selectedImage.url; // Fallback to original URL
                    }}
                  />
                </div>
              )}
              
              {/* Image Info Panel */}
              <div className="p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white text-2xl font-bold mb-3">
                      {selectedImage.title || 'Untitled'}
                    </h3>
                    {selectedImage.description && (
                      <p className="text-white/90 text-lg leading-relaxed mb-4">
                        {selectedImage.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-white/80">
                        <span>📅</span>
                        <div>
                          <div className="text-white/60 text-xs">Date</div>
                          <div>{formatDate(selectedImage.createdAt)}</div>
                        </div>
                      </div>
                      
                      {selectedImage.category && (
                        <div className="flex items-center gap-2 text-white/80">
                          <span>📂</span>
                          <div>
                            <div className="text-white/60 text-xs">Category</div>
                            <div>{selectedImage.category}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-white/80">
                        <span>{selectedImage.type === 'video' ? '🎥' : '📷'}</span>
                        <div>
                          <div className="text-white/60 text-xs">Type</div>
                          <div className="capitalize">{selectedImage.type}</div>
                        </div>
                      </div>
                      
                      {selectedImage.fileSize && (
                        <div className="flex items-center gap-2 text-white/80">
                          <span>📦</span>
                          <div>
                            <div className="text-white/60 text-xs">Size</div>
                            <div>{formatFileSize(selectedImage.fileSize)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {allowDelete && (user?.role === 'admin' || user?._id === selectedImage.uploadedBy) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(selectedImage._id, e);
                        }}
                        className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      >
                        🗑️ Delete
                      </button>
                    )}
                    
                    <a
                      href={selectedImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      🔗 Open
                    </a>
                  </div>
                </div>
                
                {/* Navigation Indicator */}
                {media.length > 1 && (
                  <div className="flex justify-center mt-4 pt-4 border-t border-white/20">
                    <span className="text-white/60 text-sm">
                      {media.findIndex(item => item._id === selectedImage._id) + 1} of {media.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryViewer;
