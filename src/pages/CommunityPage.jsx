import React, { useState } from 'react';
import Header from '../components/Header';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('message');

  const tabs = [
    { id: 'message', name: "Admin's Message", icon: '📢' },
    { id: 'events', name: 'Upcoming Events', icon: '📅' },
    { id: 'gallery', name: 'Community Gallery', icon: '📸' },
    { id: 'volunteers', name: 'Volunteer Hub', icon: '🤝' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'message':
        return (
          <div className="space-y-8">
            {/* Admin's Message Section */}
            <div className="bg-gradient-to-br from-red-900/80 via-amber-900/60 to-yellow-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-golden/40 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl">🙏</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-golden mb-4">
                  Message from KTYA Admin
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto rounded-full"></div>
              </div>

              <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed">
                <div className="bg-golden/10 rounded-2xl p-6 border border-golden/30">
                  <p className="text-golden-light text-center italic text-xl mb-4">
                    "गणपति बप्पा मोरया! मंगलमूर्ति मोरया!"
                  </p>
                  <p className="text-golden-light text-center">
                    "Ganpati Bappa Morya! Mangalmurti Morya!"
                  </p>
                </div>

                <p className="text-golden-light">
                  <span className="text-golden font-semibold">Beloved Devotees,</span>
                </p>

                <p className="text-golden-light">
                  With hearts full of devotion and gratitude, we welcome you to our digital community dedicated to our beloved Lord Ganesha. As we gather here in this sacred digital space, we carry forward the same spirit of unity, faith, and celebration that has bound our KTYA community together for decades.
                </p>

                <p className="text-golden-light">
                  Lord Ganesha, the remover of obstacles and the harbinger of good fortune, has always been the guiding light of our community. In these modern times, as we embrace technology to stay connected, we remember that the essence of our devotion remains unchanged - <span className="text-golden font-semibold">pure love, unwavering faith, and collective celebration</span>.
                </p>

                <div className="bg-gradient-to-r from-golden/20 to-amber-900/20 rounded-2xl p-6 border border-golden/30">
                  <p className="text-golden-light">
                    This platform is more than just a website - it is our <span className="text-golden font-semibold">digital temple</span> where every devotee, whether near or far, can participate in our celebrations, share their devotion, and stay connected with our community family.
                  </p>
                </div>

                <p className="text-golden-light">
                  Whether you are joining us for the first time or have been part of our journey for years, know that you are <span className="text-golden font-semibold">cherished, valued, and blessed</span>. Through this platform, we can:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-3 flex items-center">
                      <span className="mr-2">🎭</span> Celebrate Together
                    </h4>
                    <p className="text-golden-light text-sm">
                      Experience our festivals, participate in virtual darshan, and be part of every sacred moment, no matter where you are.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-3 flex items-center">
                      <span className="mr-2">🤝</span> Serve & Volunteer
                    </h4>
                    <p className="text-golden-light text-sm">
                      Find opportunities to serve our community, coordinate events, and contribute your skills for the greater good.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-3 flex items-center">
                      <span className="mr-2">📚</span> Learn & Grow
                    </h4>
                    <p className="text-golden-light text-sm">
                      Deepen your spiritual knowledge through our cultural learning resources, traditional recipes, and sacred texts.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-6 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-3 flex items-center">
                      <span className="mr-2">💝</span> Share & Connect
                    </h4>
                    <p className="text-golden-light text-sm">
                      Share your devotional experiences, connect with fellow devotees, and strengthen our community bonds.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 rounded-2xl p-6 border border-golden/30">
                  <p className="text-golden-light">
                    As we embark on this digital journey together, let us remember the words of our beloved Ganpati Bappa: 
                    <span className="block text-center text-golden font-semibold mt-3 text-xl">
                      "Where there is devotion, there I am present"
                    </span>
                  </p>
                </div>

                <p className="text-golden-light">
                  May Lord Ganesha bless each one of you with happiness, prosperity, and spiritual fulfillment. May our community continue to grow in love, understanding, and shared devotion.
                </p>

                <div className="text-center space-y-4">
                  <p className="text-golden font-semibold">
                    With divine blessings and warm regards,
                  </p>
                  <div className="bg-golden/20 rounded-xl p-4 border border-golden/40">
                    <p className="text-golden font-bold text-lg">KTYA Admin Team</p>
                    <p className="text-golden-light text-sm">Krishna Township Youth Association</p>
                    <p className="text-golden-light text-sm">Vasai (W), Mumbai, Maharashtra</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-golden-light text-lg font-semibold">
                    🕉️ ॐ गणेशाय नमः 🕉️
                  </p>
                  <p className="text-golden-light">
                    Om Ganapataye Namaha
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-golden mb-6">Upcoming Community Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for upcoming events */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl">
                <div className="text-4xl mb-4">🎭</div>
                <h4 className="text-xl font-bold text-golden mb-2">Ganesh Chaturthi 2025</h4>
                <p className="text-golden-light mb-4">Join us for the grand celebration of Lord Ganesha's arrival</p>
                <div className="text-golden font-semibold">Coming Soon</div>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-golden mb-6">Community Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for community photos */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl text-center">
                <div className="text-6xl mb-4">📸</div>
                <h4 className="text-xl font-bold text-golden mb-2">Photo Gallery</h4>
                <p className="text-golden-light">Community memories and celebration moments</p>
              </div>
            </div>
          </div>
        );

      case 'volunteers':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-golden mb-6">Volunteer with Us</h3>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-golden/30 shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-6">🤝</div>
                <h4 className="text-2xl font-bold text-golden mb-4">Join Our Volunteer Team</h4>
                <p className="text-golden-light mb-6">
                  Be part of something beautiful. Help us organize events, assist devotees, and spread the joy of devotion.
                </p>
                <button className="bg-golden hover:bg-golden-light text-red-900 px-8 py-3 rounded-full font-semibold transition-colors duration-300">
                  Register as Volunteer
                </button>
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-5xl">👥</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-golden mb-6">
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent">
              Community Hub
            </span>
          </h1>
          <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
            Connect with devotees, organize events, coordinate volunteers, and share experiences in our divine community
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-golden text-red-900 shadow-xl'
                    : 'bg-white/20 text-golden hover:bg-white/30'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </section>

      {/* Floating Spiritual Elements */}
      <div className="fixed top-1/4 left-5 text-4xl opacity-20 animate-pulse pointer-events-none">🕉️</div>
      <div className="fixed top-1/3 right-5 text-3xl opacity-20 animate-bounce delay-300 pointer-events-none">🪔</div>
      <div className="fixed bottom-1/4 left-5 text-3xl opacity-20 animate-pulse delay-700 pointer-events-none">📿</div>
      <div className="fixed bottom-1/3 right-5 text-4xl opacity-20 animate-bounce delay-500 pointer-events-none">🌺</div>
    </div>
  );
};

export default CommunityPage;
