import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageKitUploader from '../components/ImageKitUploader';
import MediaGallery from '../components/MediaGallery';

const MediaTestPage = () => {
    const [refreshGallery, setRefreshGallery] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleUploadSuccess = (data) => {
        console.log('Upload successful:', data);
        setUploadSuccess(true);
        setError(null);
        // Refresh gallery to show new uploads
        setRefreshGallery(prev => prev + 1);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setUploadSuccess(false);
        }, 3000);
    };

    const handleUploadError = (errorMessage) => {
        console.error('Upload error:', errorMessage);
        setError(errorMessage);
        setUploadSuccess(false);
        
        // Clear error message after 5 seconds
        setTimeout(() => {
            setError(null);
        }, 5000);
    };

    const handleMediaSelect = (media) => {
        console.log('Media selected:', media);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
            <Header />
            
            {/* Hero Section */}
            <section className="pt-28 pb-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-golden mb-6">
                        Media Management
                    </h1>
                    <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
                        Upload and manage images and videos using ImageKit
                    </p>
                </div>
            </section>

            {/* Success/Error Messages */}
            {uploadSuccess && (
                <div className="max-w-7xl mx-auto px-4 mb-6">
                    <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Files uploaded successfully!
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-7xl mx-auto px-4 mb-6">
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <section className="pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Upload Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-golden mb-6">Upload Media</h2>
                            <ImageKitUploader
                                onUploadSuccess={handleUploadSuccess}
                                onUploadError={handleUploadError}
                                multiple={true}
                                folder="test-uploads"
                                category="other"
                                tags={['test', 'digital-ganesha']}
                                maxFiles={5}
                                showPreview={true}
                            />
                        </div>

                        {/* Upload Tips */}
                        <div className="lg:pl-8">
                            <h2 className="text-2xl font-bold text-golden mb-6">Upload Guidelines</h2>
                            <div className="bg-golden/10 border border-golden/20 rounded-xl p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-golden font-semibold mb-2">📸 Supported Formats</h4>
                                        <p className="text-golden-light text-sm">
                                            <strong>Images:</strong> JPEG, PNG, GIF, WebP, SVG<br />
                                            <strong>Videos:</strong> MP4, AVI, MOV, WMV, FLV, WebM, MKV
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-golden font-semibold mb-2">📏 Size Limits</h4>
                                        <p className="text-golden-light text-sm">
                                            Maximum file size: 50MB per file<br />
                                            Recommended: Under 10MB for faster uploads
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-golden font-semibold mb-2">🏷️ Best Practices</h4>
                                        <ul className="text-golden-light text-sm space-y-1">
                                            <li>• Use descriptive filenames</li>
                                            <li>• Add relevant tags for easy searching</li>
                                            <li>• Choose appropriate categories</li>
                                            <li>• Optimize images before upload</li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-golden font-semibold mb-2">🔧 Features</h4>
                                        <ul className="text-golden-light text-sm space-y-1">
                                            <li>• Automatic image optimization</li>
                                            <li>• Real-time transformations</li>
                                            <li>• CDN delivery worldwide</li>
                                            <li>• Responsive image serving</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery Section */}
                    <div className="mt-12">
                        <MediaGallery
                            key={refreshGallery} // Force re-render when uploads happen
                            filters={{ isPublic: true }}
                            showUploader={false}
                            onMediaSelect={handleMediaSelect}
                            layout="grid"
                            itemsPerPage={12}
                        />
                    </div>
                </div>
            </section>

            {/* Floating Spiritual Elements */}
            <div className="fixed top-1/4 left-5 text-4xl opacity-20 animate-pulse pointer-events-none">🕉️</div>
            <div className="fixed top-1/3 right-5 text-3xl opacity-20 animate-bounce delay-300 pointer-events-none">🪔</div>
            <div className="fixed bottom-1/4 left-5 text-3xl opacity-20 animate-pulse delay-700 pointer-events-none">📿</div>
            <div className="fixed bottom-1/3 right-5 text-4xl opacity-20 animate-bounce delay-500 pointer-events-none">🌺</div>

            <Footer />
        </div>
    );
};

export default MediaTestPage;
