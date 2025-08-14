import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MessageService from '../services/MessageService';
import EventService from '../services/EventService';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch messages from the database
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await MessageService.getMessages();
      
      // Ensure response is an array
      const messageArray = Array.isArray(response) ? response : [];
      
      // Only show active messages to community users
      const activeMessages = messageArray.filter(message => message.isActive);
      setMessages(activeMessages);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again later.');
      // Fallback to empty array
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events from the database
  const fetchEvents = async () => {
    try {
      console.log('Fetching events from database...');
      const response = await EventService.getEvents();
      console.log('Raw events response:', response);
      
      // Ensure response is an array
      const eventArray = Array.isArray(response) ? response : [];
      console.log('Event array:', eventArray);
      
      // Show all events for now (remove filtering to see all events)
      setEvents(eventArray);
      setError(null);
      console.log(`Loaded ${eventArray.length} events from database`);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again later.');
      // Fallback to empty array
      setEvents([]);
    }
  };

  useEffect(() => {
    // Fetch messages and events when component mounts
    fetchMessages();
    fetchEvents();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <span className="text-4xl">🕉️</span>
          </div>
          <div className="text-golden text-xl font-semibold mb-4 drop-shadow-lg">Loading Community Hub...</div>
          <div className="w-48 h-2 bg-red-900/40 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-golden to-golden-light rounded-full animate-pulse shadow-lg" style={{ width: '70%' }}></div>
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
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold text-golden mb-4">Admin's Messages</h3>
              <p className="text-golden-light text-lg max-w-2xl mx-auto">
                Important announcements and updates from our community leadership
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Messages List */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {messages.length === 0 && !error ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-golden-light text-lg">No messages available at the moment.</p>
                  <p className="text-golden-light/70 text-sm mt-2">Check back later for updates from the admin team.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message._id || message.id} className="bg-gradient-to-br from-red-950/90 via-red-900/80 to-amber-900/70 backdrop-blur-xl rounded-2xl border-2 border-golden/50 shadow-2xl shadow-red-900/50 overflow-hidden">
                    {/* Message Header - Clickable */}
                    <div
                      onClick={() => setExpandedMessage(expandedMessage === (message._id || message.id) ? null : (message._id || message.id))}
                      className="p-6 cursor-pointer hover:bg-red-900/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-2xl">📢</span>
                          </div>
                          <div>
                            <h4 className="text-golden font-bold text-lg md:text-xl">{message.title}</h4>
                            <p className="text-golden-light text-sm">{new Date(message.createdAt || message.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            {message.priority && message.priority !== 'low' && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                message.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                message.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {message.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-golden-light text-sm font-medium">By</p>
                            <p className="text-golden text-sm font-semibold">{message.author}</p>
                          </div>
                          <div className="text-golden text-2xl transform transition-transform duration-300" style={{ transform: expandedMessage === (message._id || message.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ↓
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Content - Collapsible */}
                    {expandedMessage === (message._id || message.id) && (
                      <div className="px-6 pb-6 border-t border-golden/30">
                        <div className="pt-4">
                          <p className="text-golden-light leading-relaxed text-justify">
                            {message.content}
                          </p>

                          <div className="text-center mt-6">
                            <p className="text-golden-light text-lg font-semibold devanagari-text drop-shadow-lg">
                              🕉️ ॐ गणेशाय नमः 🕉️
                            </p>
                            <p className="text-golden-light">
                              Om Ganapataye Namaha
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
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

            {/* Events List */}
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-golden/20 to-golden-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📅</span>
                  </div>
                  <h4 className="text-xl font-semibold text-golden mb-2">No Events Yet</h4>
                  <p className="text-golden-light">Check back soon for upcoming community events!</p>
                </div>
              ) : (
                events.map((event) => {
                  // Format the date properly
                  const eventDate = event.startDate && event.endDate 
                    ? EventService.formatEventDate(event.startDate, event.endDate)
                    : event.date || 'Date TBD';
                  
                  // Get venue/location
                  const eventLocation = event.venue?.name || event.location || 'Location TBD';
                  
                  // Get event icon based on category or use default
                  const eventIcon = event.icon || 
                    (event.category === 'festival' ? '🎭' : 
                     event.category === 'cultural' ? '🎵' : 
                     event.category === 'community' ? '🤝' : 
                     event.category === 'spiritual' ? '🕉️' : '📅');

                  return (
                    <div key={event._id || event.id} className="bg-gradient-to-br from-red-950/90 via-red-900/80 to-amber-900/70 backdrop-blur-xl rounded-2xl border-2 border-golden/50 shadow-2xl shadow-red-900/50 overflow-hidden">
                      {/* Event Header - Clickable */}
                      <div
                        onClick={() => setExpandedEvent(expandedEvent === (event._id || event.id) ? null : (event._id || event.id))}
                        className="p-6 cursor-pointer hover:bg-red-900/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center shadow-xl">
                              <span className="text-2xl">{eventIcon}</span>
                            </div>
                            <div>
                              <h4 className="text-golden font-bold text-lg md:text-xl">{event.title}</h4>
                              <p className="text-golden-light text-sm">{eventDate} • {eventLocation}</p>
                              {/* Event Tags */}
                              <div className="flex gap-2 mt-1">
                                {event.category && (
                                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-golden/20 text-golden">
                                    {event.category.toUpperCase()}
                                  </span>
                                )}
                                {event.priority && event.priority !== 'low' && (
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    event.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                    event.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                    'bg-yellow-500/20 text-yellow-300'
                                  }`}>
                                    {event.priority.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-golden text-2xl transform transition-transform duration-300" style={{ transform: expandedEvent === (event._id || event.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ↓
                          </div>
                        </div>
                      </div>

                      {/* Event Content - Collapsible */}
                      {expandedEvent === (event._id || event.id) && (
                        <div className="px-6 pb-6 border-t border-golden/30">
                          <div className="pt-4">
                            <p className="text-golden-light leading-relaxed text-justify mb-6">
                              {event.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-6">
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-3 py-2 rounded-full border border-golden/30">
                                <span>📅</span>
                                <span>{eventDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-3 py-2 rounded-full border border-golden/30">
                                <span>📍</span>
                                <span>{eventLocation}</span>
                              </div>
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-3 py-2 rounded-full border border-golden/30">
                                <span>👥</span>
                                <span>Open to All</span>
                              </div>
                              {event.mandal && (
                                <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-3 py-2 rounded-full border border-golden/30">
                                  <span>🏛️</span>
                                  <span>{event.mandal.name || 'KTYA'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-red-950/80 via-red-900/70 to-red-950/80 backdrop-blur-md rounded-2xl p-8 border-2 border-golden/40 shadow-2xl">
                <h4 className="text-2xl font-bold text-golden mb-4 drop-shadow-lg">Want to Organize an Event?</h4>
                <p className="text-golden-light mb-6 drop-shadow-sm">Have an idea for a community event? We'd love to hear from you!</p>
                <button className="bg-gradient-to-r from-golden to-golden-light text-red-950 px-8 py-3 rounded-full font-bold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer">
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

            {/* Volunteer Opportunities - Photography Only */}
            <div>
              <h4 className="text-2xl font-bold text-golden mb-6 text-center">How You Can Help</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: '📸',
                    title: 'Photography',
                    desc: 'Capture precious moments and create lasting memories of our events',
                    commitment: 'As needed',
                    color: 'from-orange-900/60 to-red-900/40'
                  }
                ].map((opportunity, index) => (
                  <div key={index} className={`group bg-gradient-to-br ${opportunity.color} backdrop-blur-md rounded-2xl p-6 border-2 border-golden/30 shadow-xl hover:shadow-2xl hover:shadow-golden/30 transition-all duration-500 hover:-translate-y-2 hover:border-golden/50`}>
                    <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                      {opportunity.icon}
                    </div>
                    <h5 className="text-xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300 drop-shadow-sm">
                      {opportunity.title}
                    </h5>
                    <p className="text-golden-light/90 mb-4 leading-relaxed text-sm drop-shadow-sm">
                      {opportunity.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-golden-light text-sm bg-red-950/60 px-3 py-1 rounded-full border border-golden/30">
                        {opportunity.commitment}
                      </span>
                      <button className="text-golden hover:text-golden-light font-semibold transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 cursor-pointer">
                        Apply →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards Section */}
            <div className="bg-gradient-to-br from-red-950/90 via-red-900/80 to-amber-900/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-golden/50 shadow-2xl shadow-red-900/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl border-2 border-golden/40">
                  <span className="text-3xl drop-shadow-lg">🏆</span>
                </div>
                <h4 className="text-3xl font-bold text-golden mb-4 drop-shadow-lg">Community Awards & Recognition</h4>
                <p className="text-golden-light text-lg max-w-3xl mx-auto drop-shadow-sm">
                  Celebrating the outstanding contributions of our community members who have made a significant impact
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-4 rounded-full shadow-lg"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🥇',
                    title: 'Seva Ratna Award',
                    desc: 'For exceptional service to the community',
                    recipients: ['Rajesh Patel (2024)', 'Meera Sharma (2023)'],
                    color: 'from-yellow-600/30 to-amber-600/30'
                  },
                  {
                    icon: '🌟',
                    title: 'Cultural Excellence',
                    desc: 'Outstanding contribution to cultural programs',
                    recipients: ['Priya Joshi (2024)', 'Amit Kumar (2023)'],
                    color: 'from-amber-600/30 to-orange-600/30'
                  },
                  {
                    icon: '🤝',
                    title: 'Community Builder',
                    desc: 'For fostering unity and bringing people together',
                    recipients: ['Sunita Devi (2024)', 'Ramesh Gupta (2023)'],
                    color: 'from-orange-600/30 to-red-600/30'
                  },
                  {
                    icon: '📸',
                    title: 'Best Photography',
                    desc: 'Capturing the essence of our celebrations',
                    recipients: ['Vikash Singh (2024)', 'Anjali Nair (2023)'],
                    color: 'from-red-600/30 to-pink-600/30'
                  },
                  {
                    icon: '🎭',
                    title: 'Event Organizer',
                    desc: 'Excellence in event management and coordination',
                    recipients: ['Kiran Jain (2024)', 'Deepak Roy (2023)'],
                    color: 'from-pink-600/30 to-purple-600/30'
                  },
                  {
                    icon: '💫',
                    title: 'Rising Star',
                    desc: 'Young volunteer making significant impact',
                    recipients: ['Aarav Patel (2024)', 'Riya Sharma (2023)'],
                    color: 'from-purple-600/30 to-indigo-600/30'
                  }
                ].map((award, index) => (
                  <div key={index} className={`group bg-gradient-to-br ${award.color} backdrop-blur-md rounded-2xl p-6 border-2 border-golden/30 shadow-xl hover:shadow-2xl hover:shadow-golden/30 transition-all duration-500 hover:-translate-y-2 hover:border-golden/50`}>
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                        {award.icon}
                      </div>
                      <h5 className="text-lg font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300 drop-shadow-sm">
                        {award.title}
                      </h5>
                      <p className="text-golden-light/90 text-sm mb-4 leading-relaxed drop-shadow-sm">
                        {award.desc}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h6 className="text-golden font-semibold text-xs mb-2">Recent Recipients:</h6>
                      {award.recipients.map((recipient, idx) => (
                        <div key={idx} className="bg-red-950/60 rounded-lg px-3 py-2 border border-golden/20">
                          <span className="text-golden-light text-xs font-medium">{recipient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <div className="bg-gradient-to-r from-golden/30 to-amber-600/30 rounded-xl p-6 border-2 border-golden/50 shadow-lg">
                  <h5 className="text-xl font-bold text-golden mb-3">Nominate Someone Special</h5>
                  <p className="text-golden-light mb-4 text-sm">Know someone who deserves recognition? Nominate them for our annual community awards!</p>
                  <button className="bg-gradient-to-r from-golden to-golden-light text-red-950 px-6 py-3 rounded-full font-bold hover:from-golden-light hover:to-golden transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer">
                    Submit Nomination
                  </button>
                </div>
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-950">
      <Header />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-golden/10 to-transparent rounded-full blur-xl animate-pulse shadow-2xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-golden/15 to-transparent rounded-full blur-xl animate-pulse delay-1000 shadow-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-600/8 to-transparent rounded-full blur-xl animate-pulse delay-2000 shadow-2xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-golden/12 to-transparent rounded-full blur-xl animate-pulse delay-3000 shadow-xl"></div>
        <div className="absolute top-1/2 left-8 w-20 h-20 bg-gradient-to-br from-amber-500/8 to-transparent rounded-full blur-xl animate-pulse delay-4000"></div>
        <div className="absolute top-3/4 right-16 w-36 h-36 bg-gradient-to-br from-golden/6 to-transparent rounded-full blur-xl animate-pulse delay-5000"></div>
      </div>
      
      {/* Hero Section with Enhanced Spiritual Design */}
      <section className="pt-24 pb-16 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-golden/20 via-transparent to-golden/20 rounded-full blur-3xl scale-150"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-golden via-golden-light to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-golden/30 animate-float border-4 border-golden/40">
              <div className="w-28 h-28 bg-gradient-to-br from-red-950 via-red-900 to-red-950 rounded-full flex items-center justify-center shadow-inner">
                <span className="text-6xl drop-shadow-lg">👥</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 mb-12">
            {/* Sanskrit greeting */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-golden mb-2 devanagari-text drop-shadow-lg">
                समुदाय संगम
              </h1>
              <p className="text-golden-light text-lg">Community Hub</p>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent drop-shadow-xl">
                Divine Community
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-golden to-transparent rounded-full shadow-lg"></div>
            </h2>
            
            <p className="text-xl md:text-2xl text-golden-light max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Connect with devotees, organize events, coordinate volunteers, and share experiences 
              <span className="block mt-2 text-golden font-medium">
                in our divine community
              </span>
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

      {/* Enhanced Tab Navigation with Spiritual Theme */}
      <section className="pb-12 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/80 via-red-900/90 to-red-950/80 backdrop-blur-xl rounded-3xl p-6 border border-golden/40 shadow-2xl shadow-red-900/50">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-golden to-golden-light text-red-950 shadow-2xl shadow-golden/50 border-2 border-golden/60'
                      : 'bg-gradient-to-r from-white/10 to-white/5 text-golden hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 border-2 border-golden/30 hover:border-golden/50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={`text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-lg font-bold drop-shadow-sm">{tab.name}</span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-full shadow-lg"></div>
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
