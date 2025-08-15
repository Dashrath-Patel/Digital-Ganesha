import React, { useState, useEffect } from 'react';
import ImageKitService from '../services/ImageKitService';
import { useToast } from '../contexts/ToastContext';

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

const MAX_PHOTOS_PER_CATEGORY = 20;

const GalleryViewer = () => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoStats, setPhotoStats] = useState({});

  useEffect(() => {
    loadPhotoStats();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryPhotos(selectedCategory);
    }
  }, [selectedCategory]);

  const loadPhotoStats = async () => {
    try {
      const stats = {};
      
      for (const category of GALLERY_CATEGORIES) {
        const categoryData = await ImageKitService.getGalleryPhotos(category.id, {
          limit: 1 // Just get count
        });
        stats[category.id] = categoryData.total || 0;
      }
      
      setPhotoStats(stats);
    } catch (error) {
      console.error('Failed to load photo stats:', error);
    }
  };

  const loadCategoryPhotos = async (categoryId) => {
    if (photos[categoryId]) {
      return; // Already loaded
    }

    setLoading(true);
    try {
      const categoryData = await ImageKitService.getGalleryPhotos(categoryId, {
        limit: MAX_PHOTOS_PER_CATEGORY
      });

      setPhotos(prev => ({
        ...prev,
        [categoryId]: categoryData.photos || []
      }));
    } catch (error) {
      console.error(`Failed to load photos for ${categoryId}:`, error);
      showToast('Failed to load photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    if (!selectedPhoto || !selectedCategory) return;
    
    const categoryPhotos = photos[selectedCategory] || [];
    const currentIndex = categoryPhotos.findIndex(p => p.fileId === selectedPhoto.fileId);
    const nextIndex = (currentIndex + 1) % categoryPhotos.length;
    setSelectedPhoto(categoryPhotos[nextIndex]);
  };

  const prevPhoto = () => {
    if (!selectedPhoto || !selectedCategory) return;
    
    const categoryPhotos = photos[selectedCategory] || [];
    const currentIndex = categoryPhotos.findIndex(p => p.fileId === selectedPhoto.fileId);
    const prevIndex = currentIndex === 0 ? categoryPhotos.length - 1 : currentIndex - 1;
    setSelectedPhoto(categoryPhotos[prevIndex]);
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold text-golden mb-4">Community Gallery</h3>
          <p className="text-golden-light text-lg max-w-2xl mx-auto">
            Cherished moments and beautiful memories from our community celebrations
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Category Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative bg-gradient-to-br ${category.gradient} backdrop-blur-md rounded-2xl p-6 border border-golden/20 shadow-xl hover:shadow-2xl hover:shadow-golden/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">
                  {category.name}
                </h4>
                <p className="text-golden-light/80 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-golden-light text-sm">
                    {photoStats[category.id] || 0} Photo{(photoStats[category.id] || 0) !== 1 ? 's' : ''}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <span className="text-golden">View Gallery →</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-golden/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>

        {/* Recent Uploads Preview */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20">
          <h4 className="text-xl font-bold text-golden mb-4">Recently Added</h4>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-golden/20 to-amber-900/20 rounded-xl flex items-center justify-center border border-golden/30 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <span className="text-2xl">📸</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = GALLERY_CATEGORIES.find(cat => cat.id === selectedCategory);
  const categoryPhotos = photos[selectedCategory] || [];

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="bg-gradient-to-r from-golden/20 to-golden-light/20 text-golden border border-golden/40 px-4 py-2 rounded-lg hover:from-golden/30 hover:to-golden-light/30 transition-all duration-300 flex items-center gap-2"
        >
          ← Back to Categories
        </button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentCategory?.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-golden">{currentCategory?.name}</h3>
            <p className="text-golden-light">{categoryPhotos.length} photo{categoryPhotos.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-golden-light">Loading photos...</p>
        </div>
      )}

      {/* Photos Grid */}
      {!loading && categoryPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryPhotos.map((photo) => (
            <div
              key={photo.fileId}
              onClick={() => openPhotoModal(photo)}
              className="relative group cursor-pointer overflow-hidden rounded-xl border border-golden/20 hover:border-golden/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name || 'Gallery photo'}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm truncate">
                    {photo.customMetadata?.uploadedAt ? 
                      new Date(photo.customMetadata.uploadedAt).toLocaleDateString() : 
                      'Community Photo'
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categoryPhotos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <h4 className="text-xl font-bold text-golden mb-2">No Photos Yet</h4>
          <p className="text-golden-light">
            Photos from {currentCategory?.name} will appear here once they're uploaded.
          </p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closePhotoModal}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closePhotoModal}
              className="absolute -top-12 right-0 text-white hover:text-golden text-2xl font-bold z-10"
            >
              ✕
            </button>
            
            {/* Navigation Buttons */}
            {categoryPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-golden text-3xl font-bold z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-golden text-3xl font-bold z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                >
                  ›
                </button>
              </>
            )}
            
            {/* Image */}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name || 'Gallery photo'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Photo Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <div className="text-white">
                <p className="text-sm opacity-80">
                  {selectedPhoto.customMetadata?.uploadedAt ? 
                    `Uploaded on ${new Date(selectedPhoto.customMetadata.uploadedAt).toLocaleDateString()}` : 
                    'Community Photo'
                  }
                </p>
                <p className="text-lg font-semibold">{currentCategory?.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryViewer;
