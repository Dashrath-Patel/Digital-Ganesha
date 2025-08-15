import React, { useState, useEffect } from 'react';
import ImageKitService from '../services/ImageKitService';

const MediaGallery = ({ 
    filters = {}, 
    showUploader = false, 
    onMediaSelect,
    layout = 'grid', // 'grid' or 'list'
    itemsPerPage = 12
}) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // 'all', 'images', 'videos'

    useEffect(() => {
        loadMedia();
    }, [filters, currentPage, viewMode]);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const queryFilters = {
                ...filters,
                limit: itemsPerPage,
                skip: (currentPage - 1) * itemsPerPage
            };

            if (viewMode !== 'all') {
                queryFilters.type = viewMode === 'images' ? 'image' : 'video';
            }

            const result = await ImageKitService.listMedia(queryFilters);
            
            if (result.success) {
                setMedia(result.data.media);
                setTotalPages(result.data.pagination.pages);
                setError(null);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMediaClick = (mediaItem) => {
        setSelectedMedia(mediaItem);
        if (onMediaSelect) {
            onMediaSelect(mediaItem);
        }
    };

    const handleDeleteMedia = async (mediaId, event) => {
        event.stopPropagation();
        
        if (!confirm('Are you sure you want to delete this media?')) {
            return;
        }

        try {
            const result = await ImageKitService.deleteFile(mediaId);
            if (result.success) {
                setMedia(media.filter(item => item._id !== mediaId));
                if (selectedMedia && selectedMedia._id === mediaId) {
                    setSelectedMedia(null);
                }
            } else {
                alert('Failed to delete media: ' + result.error);
            }
        } catch (error) {
            alert('Error deleting media: ' + error.message);
        }
    };

    const getOptimizedImageUrl = (url, width = 300, height = 300) => {
        return ImageKitService.getOptimizedImageURL(url, {
            width,
            height,
            quality: 80,
            crop: 'maintain_ratio'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden"></div>
                <span className="ml-3 text-golden-light">Loading media...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 mb-4">Error loading media: {error}</div>
                <button 
                    onClick={loadMedia}
                    className="bg-golden/20 hover:bg-golden/30 text-golden px-4 py-2 rounded-lg border border-golden/30"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="media-gallery">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-golden">Media Gallery</h2>
                    <div className="flex bg-golden/10 rounded-lg p-1 border border-golden/20">
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                viewMode === 'all' 
                                    ? 'bg-golden/20 text-golden' 
                                    : 'text-golden-light hover:text-golden'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setViewMode('images')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                viewMode === 'images' 
                                    ? 'bg-golden/20 text-golden' 
                                    : 'text-golden-light hover:text-golden'
                            }`}
                        >
                            Images
                        </button>
                        <button
                            onClick={() => setViewMode('videos')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                viewMode === 'videos' 
                                    ? 'bg-golden/20 text-golden' 
                                    : 'text-golden-light hover:text-golden'
                            }`}
                        >
                            Videos
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLayout('grid')}
                        className={`p-2 rounded transition-all ${
                            layout === 'grid' 
                                ? 'bg-golden/20 text-golden' 
                                : 'text-golden-light hover:text-golden'
                        }`}
                        title="Grid View"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setLayout('list')}
                        className={`p-2 rounded transition-all ${
                            layout === 'list' 
                                ? 'bg-golden/20 text-golden' 
                                : 'text-golden-light hover:text-golden'
                        }`}
                        title="List View"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Media Grid/List */}
            {media.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-golden text-xl font-semibold mb-2">No media found</h3>
                    <p className="text-golden-light">Upload some images or videos to get started</p>
                </div>
            ) : (
                <div className={
                    layout === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
                        : 'space-y-4'
                }>
                    {media.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleMediaClick(item)}
                            className={`cursor-pointer bg-golden/10 border border-golden/20 rounded-xl overflow-hidden hover:bg-golden/20 transition-all duration-200 ${
                                layout === 'list' ? 'flex items-center p-4' : 'block'
                            }`}
                        >
                            {/* Media Preview */}
                            <div className={layout === 'list' ? 'w-24 h-24 flex-shrink-0 mr-4' : 'aspect-square'}>
                                {item.type === 'image' ? (
                                    <img
                                        src={getOptimizedImageUrl(item.url, 300, 300)}
                                        alt={item.title || item.originalName}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-golden/5 flex items-center justify-center relative">
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l8-5-8-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Media Info */}
                            <div className={layout === 'list' ? 'flex-1' : 'p-4'}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-golden font-medium truncate">
                                            {item.title || item.originalName}
                                        </h4>
                                        <p className="text-golden-light text-sm mt-1">
                                            {formatFileSize(item.size)} • {formatDate(item.createdAt)}
                                        </p>
                                        {item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {item.tags.slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-golden/10 text-golden-light text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 3 && (
                                                    <span className="text-golden-light text-xs">
                                                        +{item.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={(e) => handleDeleteMedia(item._id, e)}
                                        className="ml-2 p-1 text-red-400 hover:text-red-500 hover:bg-red-400/10 rounded transition-all"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-golden/10 text-golden rounded-lg border border-golden/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-golden/20"
                    >
                        Previous
                    </button>
                    
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg border transition-all ${
                                    page === currentPage
                                        ? 'bg-golden/20 text-golden border-golden/30'
                                        : 'bg-golden/10 text-golden-light border-golden/20 hover:bg-golden/15'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-golden/10 text-golden rounded-lg border border-golden/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-golden/20"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Media Modal */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div 
                        className="bg-golden/10 backdrop-blur-md border border-golden/20 rounded-xl max-w-4xl max-h-full overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-golden">
                                    {selectedMedia.title || selectedMedia.originalName}
                                </h3>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="text-golden-light hover:text-golden"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="mb-4">
                                {selectedMedia.type === 'image' ? (
                                    <img
                                        src={selectedMedia.url}
                                        alt={selectedMedia.title || selectedMedia.originalName}
                                        className="w-full max-h-96 object-contain rounded-lg"
                                    />
                                ) : (
                                    <video
                                        src={selectedMedia.url}
                                        controls
                                        className="w-full max-h-96 rounded-lg"
                                    />
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-golden-light"><strong className="text-golden">Size:</strong> {formatFileSize(selectedMedia.size)}</p>
                                    <p className="text-golden-light"><strong className="text-golden">Type:</strong> {selectedMedia.type}</p>
                                    <p className="text-golden-light"><strong className="text-golden">Category:</strong> {selectedMedia.category}</p>
                                    <p className="text-golden-light"><strong className="text-golden">Uploaded:</strong> {formatDate(selectedMedia.createdAt)}</p>
                                </div>
                                <div>
                                    {selectedMedia.tags.length > 0 && (
                                        <div>
                                            <p className="text-golden font-semibold mb-2">Tags:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedMedia.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-golden/10 text-golden-light text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {selectedMedia.description && (
                                <div className="mt-4">
                                    <p className="text-golden font-semibold mb-2">Description:</p>
                                    <p className="text-golden-light">{selectedMedia.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaGallery;
