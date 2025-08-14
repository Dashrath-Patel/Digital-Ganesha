import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const VirtualDarshanPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('temple-tour');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(0);
  const [offerings, setOfferings] = useState([]);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const audioRef = useRef(null);

  const mantras = [
    { text: "ॐ गं गणपतये नमः", translation: "Om Gam Ganapataye Namaha" },
    { text: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ", translation: "Vakratunda Mahakaya Suryakoti Samaprabha" },
    { text: "गणानां त्वा गणपतिं हवामहे", translation: "Gananam Tva Ganapatim Havaamahe" },
    { text: "मंगलमूर्ति मोरया", translation: "Mangalmurti Morya" }
  ];

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
    { id: 'prayer-hall', name: 'Prayer Hall', description: 'Community prayer space' },
    { id: 'decoration', name: 'Festival Decorations', description: 'Beautiful festive arrangements' },
    { id: 'entrance', name: 'Temple Entrance', description: 'Welcome gateway to divinity' }
  ];

  useEffect(() => {
    // Auto-rotate mantras every 10 seconds
    const interval = setInterval(() => {
      setCurrentMantra((prev) => (prev + 1) % mantras.length);
    }, 10000);

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

  const handlePrayerSubmit = () => {
    if (prayerText.trim()) {
      alert('Your prayer has been submitted to Lord Ganesha 🙏');
      setPrayerText('');
      setShowPrayerModal(false);
    }
  };

  const toggleMantraAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'temple-tour':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">360° Temple Tour</h2>
              <p className="text-golden-light">Explore every corner of our sacred temple</p>
            </div>

            {/* 360° Viewer Placeholder */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-8 border border-golden/30 relative overflow-hidden">
              <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-golden mb-2">360° Virtual Tour</h3>
                  <p className="text-golden-light mb-4">Click and drag to explore the temple</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-4 py-2 rounded-lg transition-all duration-300">
                      🎯 Full Screen
                    </button>
                    <button className="bg-golden/20 hover:bg-golden/30 text-golden px-4 py-2 rounded-lg transition-all duration-300">
                      🔍 Zoom In
                    </button>
                  </div>
                </div>
                
                {/* Floating Hotspots */}
                <div className="absolute top-1/4 left-1/4 animate-pulse">
                  <div className="w-4 h-4 bg-golden rounded-full shadow-lg cursor-pointer" title="Main Ganesha Statue"></div>
                </div>
                <div className="absolute top-1/3 right-1/3 animate-pulse delay-300">
                  <div className="w-4 h-4 bg-golden rounded-full shadow-lg cursor-pointer" title="Prayer Hall"></div>
                </div>
                <div className="absolute bottom-1/4 left-1/2 animate-pulse delay-700">
                  <div className="w-4 h-4 bg-golden rounded-full shadow-lg cursor-pointer" title="Aarti Area"></div>
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
              <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <h3 className="text-2xl font-bold text-golden mb-2">Live Aarti Stream</h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">LIVE</span>
                  </div>
                  <p className="text-golden-light">Evening Aarti - 7:00 PM</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="bg-golden hover:bg-golden-light text-red-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                  🔔 Ring Temple Bell
                </button>
                <button className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                  ❤️ Join Aarti (245 devotees)
                </button>
              </div>
            </div>

            {/* Aarti Schedule */}
            <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
              <h3 className="text-xl font-bold text-golden mb-4">Today's Aarti Schedule</h3>
              <div className="space-y-3">
                {[
                  { time: '6:00 AM', name: 'Morning Aarti', status: 'completed' },
                  { time: '12:00 PM', name: 'Afternoon Aarti', status: 'completed' },
                  { time: '7:00 PM', name: 'Evening Aarti', status: 'live' },
                  { time: '9:00 PM', name: 'Night Aarti', status: 'upcoming' }
                ].map((aarti, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <span className="text-golden font-medium">{aarti.time}</span>
                      <span className="text-golden-light ml-3">{aarti.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      aarti.status === 'live' ? 'bg-red-500 text-white' :
                      aarti.status === 'completed' ? 'bg-green-600 text-white' :
                      'bg-amber-600 text-white'
                    }`}>
                      {aarti.status.toUpperCase()}
                    </span>
                  </div>
                ))}
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

      case 'prayer-room':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">Personal Prayer Space</h2>
              <p className="text-golden-light">Your private spiritual sanctuary</p>
            </div>

            {/* Virtual Altar */}
            <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-8 border border-golden/30 text-center">
              <div className="mb-6">
                <div className="text-8xl mb-4">🕉️</div>
                <h3 className="text-2xl font-bold text-golden mb-2">Lord Ganesha</h3>
                <p className="text-golden-light">Vighna Harta, Mangal Murti</p>
              </div>

              {/* Current Mantra Display */}
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <h4 className="text-golden font-semibold mb-3">Sacred Mantra</h4>
                <div className="text-2xl text-golden-light font-bold mb-2 font-devanagari">
                  {mantras[currentMantra].text}
                </div>
                <div className="text-golden italic">
                  {mantras[currentMantra].translation}
                </div>
              </div>

              {/* Prayer Controls */}
              <div className="flex justify-center space-x-4 mb-6">
                <button 
                  onClick={toggleMantraAudio}
                  className="bg-golden/20 hover:bg-golden/30 text-golden px-6 py-3 rounded-lg transition-all duration-300"
                >
                  {isPlaying ? '⏸️ Pause Mantras' : '▶️ Play Mantras'}
                </button>
                <button 
                  onClick={() => setShowPrayerModal(true)}
                  className="bg-golden hover:bg-golden-light text-red-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  🙏 Submit Prayer
                </button>
              </div>

              {/* Virtual Diya */}
              <div className="flex justify-center">
                <div className="text-6xl animate-pulse">🪔</div>
              </div>
            </div>

            <audio ref={audioRef} loop>
              <source src="/mantras/ganpati-mantras.mp3" type="audio/mpeg" />
            </audio>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { id: 'temple-tour', name: '360° Tour', icon: '🏛️' },
                { id: 'live-aarti', name: 'Live Aarti', icon: '🔔' },
                { id: 'offerings', name: 'Offerings', icon: '🙏' },
                { id: 'prayer-room', name: 'Prayer Room', icon: '🕉️' }
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

      {/* Prayer Modal */}
      {showPrayerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-900/95 to-amber-900/95 backdrop-blur-lg rounded-2xl w-full max-w-md border border-golden/40 shadow-2xl">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🙏</div>
                <h3 className="text-xl font-bold text-golden">Submit Your Prayer</h3>
                <p className="text-golden-light text-sm">Lord Ganesha will receive your heartfelt prayer</p>
              </div>

              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Write your prayer to Lord Ganesha..."
                className="w-full h-32 bg-black/30 border border-golden/30 rounded-lg p-4 text-golden-light placeholder-golden/50 resize-none focus:ring-2 focus:ring-golden focus:border-transparent"
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handlePrayerSubmit}
                  className="flex-1 bg-golden hover:bg-golden-light text-red-900 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Submit Prayer
                </button>
                <button
                  onClick={() => setShowPrayerModal(false)}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualDarshanPage;
