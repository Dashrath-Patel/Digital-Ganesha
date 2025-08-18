import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const VirtualDarshanPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('live-aarti');
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [liveStreamData, setLiveStreamData] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const templeAreas = [
    { id: 'main-hall', name: 'Main Hall', description: 'The sacred main darshan area' },
    { id: 'prayer-hall', name: 'Mandap Area', description: 'Community prayer space' },
    { id: 'decoration', name: 'Festival Decorations', description: 'Beautiful festive arrangements' },
    { id: 'entrance', name: 'Mandap Entrance', description: 'Welcome gateway to divinity' }
  ];

  // Configuration for live streaming
  const liveStreamConfig = {
    // Replace with your actual YouTube channel ID
    youtubeChannelId: '------------------', // Example: 'UCxxxxxxxxxxxxxxxxxxxxxxx'
    manualLiveStatus: false, // Set to true for testing
  };

  // Check live stream status (YouTube approach)
  const checkLiveStreamStatus = async () => {
    try {
      // YouTube Data API v3 approach (requires API key)
      // const API_KEY = 'your-youtube-api-key';
      // const response = await fetch(
      //   `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${liveStreamConfig.youtubeChannelId}&eventType=live&type=video&key=${API_KEY}`
      // );
      // const data = await response.json();
      
      // For demo purposes, we'll simulate the check
      // In production, uncomment above and remove this simulation
      const isLive = liveStreamConfig.manualLiveStatus; // Simulate live status
      
      if (isLive) {
        setIsLiveStreamActive(true);
        setLiveStreamData({
          title: 'KTYA Mandal Evening Aarti',
          embedUrl: liveStreamConfig.manualStreamUrl,
          platform: 'YouTube'
        });
      } else {
        setIsLiveStreamActive(false);
        setLiveStreamData(null);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking live stream status:', error);
      setIsLiveStreamActive(false);
    }
  };

  // Check live stream status on component mount and periodically
  useEffect(() => {
    checkLiveStreamStatus();
    
    // Check every 2 minutes for live stream status
    const interval = setInterval(checkLiveStreamStatus, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'temple-tour':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-golden mb-3 sm:mb-4">About KTYA</h2>
              <p className="text-golden-light text-sm sm:text-base">Explore more about our KTYA Mandal</p>
            </div>

            {/* 360° Viewer Placeholder */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-golden/30 relative overflow-hidden">
              <div className="aspect-video bg-black/20 rounded-lg sm:rounded-xl flex items-center justify-center relative">
                <div className="text-center px-4">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏛️</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-golden mb-2 sm:mb-2">360° Virtual Experience</h3>
                  <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm">
                      🎯 Full Screen
                    </button>
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm">
                      🔍 Zoom In
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Temple Areas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {templeAreas.map((area) => (
                <div key={area.id} className="bg-red-900/40 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-golden/30 hover:bg-red-900/60 transition-all duration-300 cursor-pointer">
                  <h4 className="text-golden font-semibold mb-2 text-sm sm:text-base">{area.name}</h4>
                  <p className="text-golden-light text-xs sm:text-sm">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'live-aarti':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-golden mb-3 sm:mb-4">Live Aarti Darshan</h2>
              <p className="text-golden-light text-sm sm:text-base">Join our live aarti ceremonies from anywhere</p>
            </div>

            {/* Live Stream Area */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-golden/30">
              <div className="aspect-video bg-black/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative overflow-hidden">
                {isLiveStreamActive && liveStreamData ? (
                  // Live Stream Active
                  <div className="w-full h-full">
                    <iframe
                      src={liveStreamData.embedUrl}
                      className="w-full h-full rounded-lg sm:rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="KTYA Live Aarti Stream"
                    ></iframe>
                    
                    {/* Live Stream Overlay Info */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600/90 backdrop-blur-sm rounded-md sm:rounded-lg px-2 sm:px-3 py-1 flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs sm:text-sm font-semibold">LIVE</span>
                      <span className="text-white text-xs hidden sm:inline">👥 {liveStreamData.viewers}</span>
                    </div>
                    
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm rounded-md sm:rounded-lg p-2">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{liveStreamData.title}</p>
                      <p className="text-white/80 text-xs hidden sm:block">Streaming on {liveStreamData.platform}</p>
                    </div>
                  </div>
                ) : (
                  // No Live Stream
                  <div className="text-center px-2 sm:px-4">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4">📺</div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-golden mb-2">Live Aarti Stream</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3 md:mb-4">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-400 font-semibold text-xs sm:text-sm md:text-base">OFFLINE</span>
                    </div>
                    <p className="text-golden-light text-xs sm:text-sm md:text-base mb-3 sm:mb-4">Evening Aarti - 8:00 PM</p>
                    
                    {/* No Live Stream Message */}
                    <div className="mt-3 sm:mt-4 md:mt-6 p-2 sm:p-3 md:p-4 bg-red-900/30 rounded-md sm:rounded-lg border border-golden/20 mx-1 sm:mx-0">
                      <p className="text-golden-light text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">🙏 Live streaming hasn't started</p>
                      <p className="text-golden/80 text-xs sm:text-sm mb-1 sm:mb-2 md:mb-3">
                        Our evening aarti will be streamed live at 8:00 PM daily
                      </p>
                      <p className="text-golden/60 text-xs">
                        Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Controls */}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={checkLiveStreamStatus}
                  className="bg-golden/20 hover:bg-golden/30 text-golden px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>🔄</span>
                  <span>Check Live Status</span>
                </button>
                
                {isLiveStreamActive ? (
                  <button className="bg-red-700 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <span>❤️</span>
                    <span className="hidden sm:inline">Join Aarti ({liveStreamData?.viewers || 0} devotees)</span>
                    <span className="sm:hidden">Join Aarti</span>
                  </button>
                ) : (
                  <button className="bg-golden hover:bg-golden-light text-red-900 px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <span>🔔</span>
                    <span className="hidden sm:inline">Notify When Live</span>
                    <span className="sm:hidden">Notify</span>
                  </button>
                )}
              </div>
              
              {/* Alternative Platforms */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black/20 rounded-lg border border-golden/10">
                <h4 className="text-golden font-semibold mb-3 text-center text-sm sm:text-base">Follow us on other platforms</h4>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <a 
                    href={`https://instagram.com/${liveStreamConfig.instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 text-center"
                  >
                    📸 Instagram
                  </a>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300">
                    📺 YouTube
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300">
                    📘 Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      <Header />
      
      {/* Spiritual Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.2)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 left-10 text-4xl text-golden animate-float">🌺</div>
          <div className="absolute top-32 right-10 text-3xl text-golden-light animate-float-delay">🌸</div>
          <div className="absolute bottom-20 left-10 text-4xl text-golden-light opacity-50 animate-pulse delay-700">📿</div>
          <div className="absolute bottom-20 right-10 text-5xl text-golden opacity-40 animate-bounce delay-500">🪔</div>
        </div>
      </div>

      <div className="relative z-10 pt-16 sm:pt-20 px-2 sm:px-4 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-golden mb-3 sm:mb-4">
              Virtual Darshan
            </h1>
            <p className="text-golden-light text-sm sm:text-base lg:text-lg px-2">
              Experience divine presence and participate in sacred rituals from anywhere
            </p>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gradient-to-r from-red-900/60 to-amber-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-golden/40 mb-6 sm:mb-8 mx-2 sm:mx-0">
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {[
                { id: 'temple-tour', name: 'KTYA', icon: '🏛️' },
                { id: 'live-aarti', name: 'Live Aarti', icon: '🔔' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
                    activeSection === tab.id
                      ? 'bg-golden text-red-900 shadow-lg'
                      : 'text-golden hover:bg-red-800/40'
                  }`}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span className="text-xs sm:text-sm md:text-base">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gradient-to-br from-red-900/30 to-amber-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 border border-golden/30 mx-2 sm:mx-0">
            {renderSection()}
          </div>

          {/* Back Button */}
          <div className="text-center mt-6 sm:mt-8 px-2">
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDarshanPage;
