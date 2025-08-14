import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Constants for easier maintenance
const KTYA_ADDRESS = "9RWF+8QM, Gokul Aagan, Vasai West, Vasai-Virar, Maharashtra 401202";
const KTYA_DIRECTIONS_ADDRESS = "KTYA Ground, Gokul Aagan, Vasai West, Vasai-Virar, Maharashtra 401202";
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.123456!2d72.8305!3d19.3953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b00000000000%3A0x0000000000000000!2s${encodeURIComponent(KTYA_ADDRESS)}!5e0!3m2!1sen!2sin!4v1692345678901`;

const MandalLocatorPage = () => {
  const [selectedMandal, setSelectedMandal] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const handleGetDirections = () => {
    try {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(KTYA_DIRECTIONS_ADDRESS)}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening directions:', error);
      alert('Unable to open directions. Please try again.');
    }
  };

  const handleMapLoad = () => {
    setMapLoading(false);
  };

  const handleMapError = () => {
    setMapLoading(false);
    setMapError(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-golden mb-6">
            Locate Our Mandal
          </h1>
          <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
            Discover our KTYA mandal in Krishna Township and connect with our community
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Map Section */}
            <div className="w-full">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                    </svg>
                  </div>
                </div>
                
                <div className="relative z-10 p-6">
                  <h3 className="text-2xl font-bold text-golden mb-4">KTYA Office Location</h3>
                  <div className="w-full h-96 rounded-2xl border border-golden/20 overflow-hidden relative">
                    {/* Loading State */}
                    {mapLoading && (
                      <div className="absolute inset-0 bg-golden/10 flex items-center justify-center z-20">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden mx-auto mb-4"></div>
                          <p className="text-golden-light">Loading map...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Error State */}
                    {mapError && (
                      <div className="absolute inset-0 bg-golden/10 flex items-center justify-center z-20">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4">🗺️</div>
                          <h4 className="text-golden font-semibold mb-2">Map Unavailable</h4>
                          <p className="text-golden-light text-sm mb-4">
                            Unable to load the map. Please check your internet connection.
                          </p>
                          <button 
                            onClick={() => {
                              setMapError(false);
                              setMapLoading(true);
                              // Force iframe reload by changing src
                              const iframe = document.querySelector('#ktya-map');
                              if (iframe) {
                                iframe.src = iframe.src;
                              }
                            }}
                            className="bg-golden/20 hover:bg-golden/30 text-golden font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-golden/30"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <iframe
                      id="ktya-map"
                      src={GOOGLE_MAPS_EMBED_URL}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="KTYA Ground - Gokul Aagan, Vasai West"
                      onLoad={handleMapLoad}
                      onError={handleMapError}
                    ></iframe>
                  </div>
                  
                  <div className="mt-4 p-4 bg-golden/10 rounded-xl border border-golden/20">
                    <h4 className="text-lg font-semibold text-golden mb-2">Krishna Township Youth Association</h4>
                    <p className="text-golden-light text-sm mb-2">📍 {KTYA_ADDRESS}</p>
                    <p className="text-golden-light text-sm">🏛️ Regn. No: MH/890/03/Thane</p>
                  </div>
                  
                  <div className="mt-4">
                    <button 
                      onClick={handleGetDirections}
                      className="w-full bg-golden/20 hover:bg-golden/30 text-golden font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-golden/30"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

export default MandalLocatorPage;
