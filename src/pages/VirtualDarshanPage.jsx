import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const VirtualDarshanPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('live-aarti');
  const [offerings, setOfferings] = useState([]);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [liveStreamData, setLiveStreamData] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const offeringTypes = [
    { id: 'flowers', name: 'Flowers', icon: '🌺', price: 'Free' },
    { id: 'modak', name: 'Modak', icon: '🍯', price: '₹51' },
    { id: 'coconut', name: 'Coconut', icon: '🥥', price: '₹21' },
    { id: 'incense', name: 'Incense', icon: '🕯️', price: '₹11' },
    { id: 'lamp', name: 'Diya', icon: '🪔', price: '₹31' },
    { id: 'garland', name: 'Garland', icon: '🏵️', price: '₹101' }
  ];

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

  const handleOfferingSelect = (offering) => {
    setOfferings(prev => [...prev, { ...offering, timestamp: new Date() }]);
    // Here you would integrate with payment gateway for paid offerings
    if (offering.price !== 'Free') {
      alert(`Offering ${offering.name} selected. Redirecting to payment...`);
    } else {
      alert(`${offering.name} offered successfully! 🙏`);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'temple-tour':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">About KTYA</h2>
              <p className="text-golden-light">Explore more about our KTYA Mandal</p>
            </div>

            {/* 360° Viewer Placeholder */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-8 border border-golden/30 relative overflow-hidden">
              <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-golden mb-2">360° Virtual Experience</h3>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-4 py-2 rounded-lg transition-all duration-300">
                      🎯 Full Screen
                    </button>
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-4 py-2 rounded-lg transition-all duration-300">
                      🔍 Zoom In
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Temple Areas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templeAreas.map((area) => (
                <div key={area.id} className="bg-red-900/40 rounded-xl p-4 border border-golden/30 hover:bg-red-900/60 transition-all duration-300 cursor-pointer">
                  <h4 className="text-golden font-semibold mb-2">{area.name}</h4>
                  <p className="text-golden-light text-sm">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'live-aarti':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">Live Aarti Darshan</h2>
              <p className="text-golden-light">Join our live aarti ceremonies from anywhere</p>
            </div>

            {/* Live Stream Area */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-6 border border-golden/30">
              <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                {isLiveStreamActive && liveStreamData ? (
                  // Live Stream Active
                  <div className="w-full h-full">
                    <iframe
                      src={liveStreamData.embedUrl}
                      className="w-full h-full rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="KTYA Live Aarti Stream"
                    ></iframe>
                    
                    {/* Live Stream Overlay Info */}
                    <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-semibold">LIVE</span>
                      <span className="text-white text-xs">👥 {liveStreamData.viewers}</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-white text-sm font-medium">{liveStreamData.title}</p>
                      <p className="text-white/80 text-xs">Streaming on {liveStreamData.platform}</p>
                    </div>
                  </div>
                ) : (
                  // No Live Stream
                  <div className="text-center">
                    <div className="text-6xl mb-4">📺</div>
                    <h3 className="text-2xl font-bold text-golden mb-2">Live Aarti Stream</h3>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-400 font-semibold">OFFLINE</span>
                    </div>
                    <p className="text-golden-light">Evening Aarti - 8:00 PM</p>
                    
                    {/* No Live Stream Message */}
                    <div className="mt-6 p-4 bg-red-900/30 rounded-lg border border-golden/20">
                      <p className="text-golden-light text-lg mb-2">🙏 Live streaming hasn't started</p>
                      <p className="text-golden/80 text-sm mb-3">
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
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={checkLiveStreamStatus}
                  className="bg-golden/20 hover:bg-golden/30 text-golden px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Check Live Status</span>
                </button>
                
                {isLiveStreamActive ? (
                  <button className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2">
                    <span>❤️</span>
                    <span>Join Aarti ({liveStreamData?.viewers || 0} devotees)</span>
                  </button>
                ) : (
                  <button className="bg-golden hover:bg-golden-light text-red-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2">
                    <span>🔔</span>
                    <span>Notify When Live</span>
                  </button>
                )}
              </div>
              
              {/* Alternative Platforms */}
              <div className="mt-6 p-4 bg-black/20 rounded-lg border border-golden/10">
                <h4 className="text-golden font-semibold mb-3 text-center">Follow us on other platforms</h4>
                <div className="flex justify-center space-x-4">
                  <a 
                    href={`https://instagram.com/${liveStreamConfig.instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    📸 Instagram
                  </a>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    📺 YouTube
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    📘 Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'offerings':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">Virtual Offerings</h2>
              <p className="text-golden-light">Offer prayers and prasad to Lord Ganesha</p>
            </div>

            {/* Offerings Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offeringTypes.map((offering) => (
                <div key={offering.id} className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-6 border border-golden/30 text-center hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-4">{offering.icon}</div>
                  <h3 className="text-xl font-bold text-golden mb-2">{offering.name}</h3>
                  <p className="text-golden-light mb-4">{offering.price}</p>
                  <button 
                    onClick={() => handleOfferingSelect(offering)}
                    className="w-full bg-golden hover:bg-golden-light text-red-900 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Offer Now
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Offerings */}
            {offerings.length > 0 && (
              <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
                <h3 className="text-xl font-bold text-golden mb-4">Your Recent Offerings</h3>
                <div className="space-y-2">
                  {offerings.slice(-3).map((offering, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{offering.icon}</span>
                        <span className="text-golden">{offering.name}</span>
                      </div>
                      <span className="text-golden-light text-sm">
                        {offering.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      <div className="relative z-10 pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-golden mb-4">
              Virtual Darshan
            </h1>
            <p className="text-golden-light text-lg">
              Experience divine presence and participate in sacred rituals from anywhere
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gradient-to-r from-red-900/60 to-amber-900/60 backdrop-blur-sm rounded-2xl p-2 border border-golden/40 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {[
                { id: 'temple-tour', name: 'KTYA', icon: '🏛️' },
                { id: 'live-aarti', name: 'Live Aarti', icon: '🔔' },
                { id: 'offerings', name: 'Offerings', icon: '🙏' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-golden text-red-900 shadow-lg'
                      : 'text-golden hover:bg-red-800/40'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gradient-to-br from-red-900/30 to-amber-900/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-golden/30">
            {renderSection()}
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/community')}
              className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              ← Back to Community Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDarshanPage;
