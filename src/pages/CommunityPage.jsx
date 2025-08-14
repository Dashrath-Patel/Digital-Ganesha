import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'message', name: "Admin's Message", icon: '📢' },
    { id: 'events', name: 'Upcoming Events', icon: '📅' },
    { id: 'gallery', name: 'Community Gallery', icon: '📸' },
    { id: 'volunteers', name: 'Volunteer Hub', icon: '🤝' }
  ];

  // Loading Component
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-4xl">🕉️</span>
          </div>
          <div className="text-golden text-xl font-semibold mb-4">Loading Community Hub...</div>
          <div className="w-48 h-2 bg-red-900/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-golden to-golden-light rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'message':
        return (
          <div className="space-y-8">
            {/* Admin's Message Section */}
            <div className="bg-gradient-to-br from-red-900/80 via-amber-900/60 to-yellow-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-golden/40 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-3xl">🙏</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-golden mb-3">
                  Message from KTYA Admin
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto rounded-full"></div>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-golden/10 rounded-2xl p-6 border border-golden/30">
                  <p className="text-golden-light text-center italic text-xl mb-4">
                    "गणपति बप्पा मोरया! मंगलमूर्ति मोरया!"
                  </p>
                  <p className="text-golden-light text-center">
                    "Ganpati Bappa Morya! Mangalmurti Morya!"
                  </p>
                </div>

                <p className="text-golden-light text-lg leading-relaxed">
                  <span className="text-golden font-semibold">Beloved Devotees,</span><br/><br/>
                  Welcome to our digital community dedicated to Lord Ganesha. This platform is our <span className="text-golden font-semibold">digital temple</span> where every devotee can participate in celebrations, share devotion, and stay connected with our community family.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-900/40 rounded-xl p-4 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-2 flex items-center text-sm">
                      <span className="mr-2">🎭</span> Celebrate Together
                    </h4>
                    <p className="text-golden-light text-xs">
                      Experience festivals and virtual darshan, no matter where you are.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-2 flex items-center text-sm">
                      <span className="mr-2">🤝</span> Serve & Volunteer
                    </h4>
                    <p className="text-golden-light text-xs">
                      Find opportunities to serve and contribute to our community.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-2 flex items-center text-sm">
                      <span className="mr-2">📚</span> Learn & Grow
                    </h4>
                    <p className="text-golden-light text-xs">
                      Deepen spiritual knowledge through cultural resources.
                    </p>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border border-golden/30">
                    <h4 className="text-golden font-semibold mb-2 flex items-center text-sm">
                      <span className="mr-2">💝</span> Share & Connect
                    </h4>
                    <p className="text-golden-light text-xs">
                      Connect with fellow devotees and strengthen community bonds.
                    </p>
                  </div>
                </div>

                <div className="text-center bg-golden/20 rounded-xl p-4 border border-golden/40">
                  <p className="text-golden font-bold">With divine blessings,</p>
                  <p className="text-golden-light text-sm">KTYA Admin Team</p>
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
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold text-golden mb-4">Upcoming Community Events</h3>
              <p className="text-golden-light text-lg max-w-2xl mx-auto">
                Join us in celebrating our traditions and strengthening our community bonds
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Featured Event */}
            <div className="bg-gradient-to-br from-red-900/80 via-amber-900/60 to-yellow-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-golden/40 shadow-2xl mb-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center">
                      <span className="text-3xl">🎭</span>
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-golden to-golden-light px-4 py-2 rounded-full text-red-900 font-semibold text-sm">
                        FEATURED EVENT
                      </span>
                    </div>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-golden mb-4">Ganesh Chaturthi 2025</h4>
                  <p className="text-golden-light text-lg mb-6 leading-relaxed">
                    Join us for the grand celebration of Lord Ganesha's arrival. Experience the divine joy with traditional rituals, 
                    cultural programs, and community feast.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-golden-light">
                      <span>📅</span>
                      <span>September 7-17, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-golden-light">
                      <span>📍</span>
                      <span>KTYA Community Hall</span>
                    </div>
                    <div className="flex items-center gap-2 text-golden-light">
                      <span>👥</span>
                      <span>500+ Expected</span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-golden to-golden-light text-red-900 px-8 py-3 rounded-full font-semibold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Register Now
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-64 h-48 bg-gradient-to-br from-golden/20 to-amber-900/20 rounded-2xl flex items-center justify-center border border-golden/30">
                    <span className="text-8xl">🐘</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏛️',
                  title: 'Virtual Darshan',
                  date: 'Available 24/7',
                  desc: 'Experience 360° virtual tours and participate in live aarti ceremonies from anywhere.',
                  isVirtualDarshan: true
                },
                {
                  icon: '🪔',
                  title: 'Diwali Celebration',
                  date: 'November 1, 2025',
                  desc: 'Festival of lights celebration with traditional diyas and rangoli competition'
                },
                {
                  icon: '🎵',
                  title: 'Bhajan Sandhya',
                  date: 'Every Sunday',
                  desc: 'Weekly devotional singing sessions to connect with the divine'
                },
                {
                  icon: '🍛',
                  title: 'Community Feast',
                  date: 'Monthly',
                  desc: 'Share meals together and strengthen community bonds'
                },
                {
                  icon: '🎨',
                  title: 'Art Workshop',
                  date: 'October 15, 2025',
                  desc: 'Learn traditional Indian art forms and crafts'
                },
                {
                  icon: '📚',
                  title: 'Scripture Study',
                  date: 'Weekly',
                  desc: 'Deep dive into sacred texts and spiritual discussions'
                }
              ].map((event, index) => (
                <div key={index} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-golden/20 shadow-xl hover:shadow-2xl hover:shadow-golden/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">{event.icon}</div>
                  <h4 className="text-xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">{event.title}</h4>
                  <div className="text-golden-light font-semibold mb-3 flex items-center gap-2">
                    <span>📅</span>
                    <span>{event.date}</span>
                  </div>
                  <p className="text-golden-light/80 mb-4 leading-relaxed">{event.desc}</p>
                  {event.isVirtualDarshan ? (
                    <Link 
                      to="/virtual-darshan"
                      className="text-golden hover:text-golden-light font-semibold transition-colors duration-300 flex items-center gap-2 group-hover:gap-3"
                    >
                      Learn More 
                      <span className="transition-transform duration-300">→</span>
                    </Link>
                  ) : (
                    <button className="text-golden hover:text-golden-light font-semibold transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                      Learn More 
                      <span className="transition-transform duration-300">→</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-golden/10 via-golden/20 to-golden/10 backdrop-blur-md rounded-2xl p-8 border border-golden/30">
                <h4 className="text-2xl font-bold text-golden mb-4">Want to Organize an Event?</h4>
                <p className="text-golden-light mb-6">Have an idea for a community event? We'd love to hear from you!</p>
                <button className="bg-gradient-to-r from-golden to-golden-light text-red-900 px-8 py-3 rounded-full font-semibold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105">
                  Propose Event
                </button>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold text-golden mb-4">Community Gallery</h3>
              <p className="text-golden-light text-lg max-w-2xl mx-auto">
                Cherished moments and beautiful memories from our community celebrations
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Gallery Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['All', 'Festivals', 'Community Events', 'Volunteers', 'Behind the Scenes'].map((category, index) => (
                <button key={category} className="px-6 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 text-golden border border-golden/20 hover:from-golden/20 hover:to-golden/10 transition-all duration-300">
                  {category}
                </button>
              ))}
            </div>

            {/* Featured Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: 'Ganesh Chaturthi 2024',
                  subtitle: 'Grand Celebration',
                  icon: '🎭',
                  gradient: 'from-red-900/60 to-amber-900/40'
                },
                {
                  title: 'Community Volunteers',
                  subtitle: 'Seva in Action',
                  icon: '🤝',
                  gradient: 'from-amber-900/60 to-yellow-900/40'
                },
                {
                  title: 'Cultural Programs',
                  subtitle: 'Traditional Performances',
                  icon: '🎵',
                  gradient: 'from-yellow-900/60 to-orange-900/40'
                },
                {
                  title: 'Decoration Setup',
                  subtitle: 'Behind the Scenes',
                  icon: '🌸',
                  gradient: 'from-orange-900/60 to-red-900/40'
                },
                {
                  title: 'Community Feast',
                  subtitle: 'Sharing Meals',
                  icon: '🍛',
                  gradient: 'from-red-900/60 to-pink-900/40'
                },
                {
                  title: 'Children Activities',
                  subtitle: 'Next Generation',
                  icon: '👶',
                  gradient: 'from-pink-900/60 to-purple-900/40'
                }
              ].map((item, index) => (
                <div key={index} className={`group relative bg-gradient-to-br ${item.gradient} backdrop-blur-md rounded-2xl p-6 border border-golden/20 shadow-xl hover:shadow-2xl hover:shadow-golden/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-golden-light/80 mb-4">{item.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-golden-light text-sm">25+ Photos</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <span className="text-golden">View Gallery →</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-golden/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-br from-red-900/40 via-amber-900/30 to-yellow-900/40 backdrop-blur-xl rounded-3xl p-8 border border-golden/30 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📤</span>
                </div>
                <h4 className="text-2xl font-bold text-golden mb-4">Share Your Memories</h4>
                <p className="text-golden-light mb-6 max-w-2xl mx-auto">
                  Have photos from our events? Share them with the community and help us build our collective memory.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-golden to-golden-light text-red-900 px-8 py-3 rounded-full font-semibold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105">
                    Upload Photos
                  </button>
                  <button className="border border-golden text-golden px-8 py-3 rounded-full font-semibold hover:bg-golden hover:text-red-900 transition-all duration-300 transform hover:scale-105">
                    View Guidelines
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
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

      case 'volunteers':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold text-golden mb-4">Volunteer Hub</h3>
              <p className="text-golden-light text-lg max-w-3xl mx-auto">
                Join our dedicated team of volunteers and be part of something meaningful. 
                Together, we create magic and spread joy in our community.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Hero Volunteer Section */}
            <div className="bg-gradient-to-br from-red-900/80 via-amber-900/60 to-yellow-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-golden/40 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-golden to-golden-light px-4 py-2 rounded-full text-red-900 font-semibold text-sm">
                        MAKE A DIFFERENCE
                      </span>
                    </div>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-golden mb-4">Join Our Volunteer Family</h4>
                  <p className="text-golden-light text-lg mb-6 leading-relaxed">
                    Experience the joy of giving back to the community. Whether you have a few hours or want to take on bigger responsibilities, 
                    there's a perfect volunteer opportunity waiting for you.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-golden">50+</div>
                      <div className="text-golden-light text-sm">Active Volunteers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-golden">1000+</div>
                      <div className="text-golden-light text-sm">Hours Served</div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-golden to-golden-light text-red-900 px-8 py-4 rounded-full font-semibold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                    Register as Volunteer
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-64 h-48 bg-gradient-to-br from-golden/20 to-amber-900/20 rounded-2xl flex items-center justify-center border border-golden/30">
                    <span className="text-8xl">🙏</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer Opportunities */}
            <div>
              <h4 className="text-2xl font-bold text-golden mb-6 text-center">How You Can Help</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🎭',
                    title: 'Event Coordination',
                    desc: 'Help organize and manage community events, festivals, and celebrations',
                    commitment: 'Flexible',
                    color: 'from-red-900/60 to-amber-900/40'
                  },
                  {
                    icon: '🎨',
                    title: 'Decoration Team',
                    desc: 'Create beautiful decorations and set up venues for our celebrations',
                    commitment: '2-3 days',
                    color: 'from-amber-900/60 to-yellow-900/40'
                  },
                  {
                    icon: '🍛',
                    title: 'Food Service',
                    desc: 'Help prepare and serve meals during community feasts and events',
                    commitment: 'Event days',
                    color: 'from-yellow-900/60 to-orange-900/40'
                  },
                  {
                    icon: '📸',
                    title: 'Photography',
                    desc: 'Capture precious moments and create lasting memories of our events',
                    commitment: 'As needed',
                    color: 'from-orange-900/60 to-red-900/40'
                  },
                  {
                    icon: '🎵',
                    title: 'Cultural Programs',
                    desc: 'Lead or assist with traditional music, dance, and cultural activities',
                    commitment: 'Weekly',
                    color: 'from-purple-900/60 to-pink-900/40'
                  },
                  {
                    icon: '💻',
                    title: 'Tech Support',
                    desc: 'Help with website, social media, and technical aspects of events',
                    commitment: 'Remote',
                    color: 'from-blue-900/60 to-indigo-900/40'
                  }
                ].map((opportunity, index) => (
                  <div key={index} className={`group bg-gradient-to-br ${opportunity.color} backdrop-blur-md rounded-2xl p-6 border border-golden/20 shadow-xl hover:shadow-2xl hover:shadow-golden/20 transition-all duration-500 hover:-translate-y-2`}>
                    <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                      {opportunity.icon}
                    </div>
                    <h5 className="text-xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">
                      {opportunity.title}
                    </h5>
                    <p className="text-golden-light/80 mb-4 leading-relaxed text-sm">
                      {opportunity.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-golden-light text-sm bg-white/10 px-3 py-1 rounded-full">
                        {opportunity.commitment}
                      </span>
                      <button className="text-golden hover:text-golden-light font-semibold transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                        Apply →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Benefits */}
            <div className="bg-gradient-to-r from-golden/10 via-golden/20 to-golden/10 backdrop-blur-md rounded-2xl p-8 border border-golden/30">
              <h4 className="text-2xl font-bold text-golden mb-6 text-center">Why Volunteer With Us?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🌟', title: 'Personal Growth', desc: 'Develop new skills and gain valuable experience' },
                  { icon: '❤️', title: 'Community Impact', desc: 'Make a real difference in people\'s lives' },
                  { icon: '🤝', title: 'Build Connections', desc: 'Meet like-minded people and build lasting friendships' },
                  { icon: '🎯', title: 'Flexible Options', desc: 'Choose opportunities that fit your schedule' }
                ].map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <h5 className="text-golden font-semibold mb-2">{benefit.title}</h5>
                    <p className="text-golden-light text-sm">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Volunteers */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20">
              <h4 className="text-xl font-bold text-golden mb-4">Our Amazing Volunteers</h4>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[
                  { name: 'Priya S.', role: 'Event Coordinator' },
                  { name: 'Ravi K.', role: 'Decoration Lead' },
                  { name: 'Anjali M.', role: 'Cultural Program' },
                  { name: 'Suresh P.', role: 'Tech Support' },
                  { name: 'Meera J.', role: 'Photography' },
                  { name: 'Amit R.', role: 'Food Service' }
                ].map((volunteer, index) => (
                  <div key={index} className="flex-shrink-0 bg-gradient-to-br from-golden/20 to-amber-900/20 rounded-xl p-4 border border-golden/30 text-center min-w-[120px]">
                    <div className="w-12 h-12 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-900 font-bold">{volunteer.name.charAt(0)}</span>
                    </div>
                    <div className="text-golden font-semibold text-sm">{volunteer.name}</div>
                    <div className="text-golden-light text-xs">{volunteer.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-900/40 via-amber-900/30 to-red-900/40 backdrop-blur-md rounded-2xl p-6 border border-golden/30">
                <h4 className="text-xl font-bold text-golden mb-2">Have Questions?</h4>
                <p className="text-golden-light mb-4">Contact our volunteer coordinator for more information</p>
                <button className="border border-golden text-golden px-6 py-2 rounded-full font-semibold hover:bg-golden hover:text-red-900 transition-all duration-300">
                  Get in Touch
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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-golden/5 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-golden/10 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-600/5 to-transparent rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-golden/8 to-transparent rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Hero Section with Enhanced Design */}
      <section className="pt-24 pb-16 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-golden/20 via-transparent to-golden/20 rounded-full blur-3xl scale-150"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-golden via-golden-light to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-golden/25 animate-float animate-glow">
              <div className="w-28 h-28 bg-gradient-to-br from-red-900 via-red-800 to-red-900 rounded-full flex items-center justify-center">
                <span className="text-6xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent drop-shadow-lg animate-shimmer">
                Community Hub
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-golden to-transparent rounded-full animate-glow"></div>
            </h1>
            
            <p className="text-xl md:text-2xl text-golden-light max-w-4xl mx-auto leading-relaxed font-light">
              Connect with devotees, organize events, coordinate volunteers, and share experiences 
              <span className="block mt-2 text-golden font-medium">in our divine community</span>
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-golden/10 to-amber-900/20 backdrop-blur-md rounded-2xl p-4 border border-golden/20">
              <div className="text-2xl mb-2">🕉️</div>
              <div className="text-golden font-bold text-lg">250+</div>
              <div className="text-golden-light text-sm">Active Members</div>
            </div>
            <div className="bg-gradient-to-br from-golden/10 to-amber-900/20 backdrop-blur-md rounded-2xl p-4 border border-golden/20">
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-golden font-bold text-lg">15+</div>
              <div className="text-golden-light text-sm">Annual Events</div>
            </div>
            <div className="bg-gradient-to-br from-golden/10 to-amber-900/20 backdrop-blur-md rounded-2xl p-4 border border-golden/20">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-golden font-bold text-lg">50+</div>
              <div className="text-golden-light text-sm">Volunteers</div>
            </div>
            <div className="bg-gradient-to-br from-golden/10 to-amber-900/20 backdrop-blur-md rounded-2xl p-4 border border-golden/20">
              <div className="text-2xl mb-2">📸</div>
              <div className="text-golden font-bold text-lg">1000+</div>
              <div className="text-golden-light text-sm">Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tab Navigation */}
      <section className="pb-12 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/40 via-red-900/60 to-red-900/40 backdrop-blur-xl rounded-3xl p-6 border border-golden/30 shadow-2xl">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 tab-button community-card ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-golden to-golden-light text-red-900 shadow-2xl shadow-golden/50 animate-glow'
                      : 'bg-gradient-to-r from-white/10 to-white/5 text-golden hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 border border-golden/20'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={`text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-lg">{tab.name}</span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-900 via-red-800 to-red-900 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10">
            {renderContent()}
          </div>
        </div>
      </section>

      {/* Enhanced Floating Spiritual Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-8 opacity-10 animate-pulse">
          <div className="text-6xl transform rotate-12">🕉️</div>
        </div>
        <div className="absolute top-1/3 right-8 opacity-15 animate-bounce delay-300">
          <div className="text-4xl transform -rotate-12">🪔</div>
        </div>
        <div className="absolute bottom-1/4 left-12 opacity-10 animate-pulse delay-700">
          <div className="text-4xl transform rotate-45">📿</div>
        </div>
        <div className="absolute bottom-1/3 right-12 opacity-15 animate-bounce delay-500">
          <div className="text-5xl transform -rotate-6">🌺</div>
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-8 animate-pulse delay-1000">
          <div className="text-3xl transform rotate-90">🪷</div>
        </div>
        <div className="absolute top-2/3 right-1/4 opacity-12 animate-bounce delay-1500">
          <div className="text-3xl transform -rotate-45">🔔</div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-golden to-golden-light text-red-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-20"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-xl">↑</span>
      </button>
    </div>
  );
};

export default CommunityPage;
