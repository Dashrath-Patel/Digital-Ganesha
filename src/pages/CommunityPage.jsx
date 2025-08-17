import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import GalleryViewer from '../components/GalleryViewer';
import MessageService from '../services/MessageService';
import EventService from '../services/EventService';

const CommunityPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('message');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['message', 'events', 'gallery'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
    { id: 'gallery', name: 'Community Gallery', icon: '📸' }
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-golden mb-3">Admin's Messages</h3>
              <p className="text-golden-light text-base sm:text-lg max-w-2xl mx-auto px-4">
                Important announcements and updates from our community leadership
              </p>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Messages List */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 && !error ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📭</div>
                  <p className="text-golden-light text-base sm:text-lg">No messages available at the moment.</p>
                  <p className="text-golden-light/70 text-sm mt-2 px-4">Check back later for updates from the admin team.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message._id || message.id} className="bg-gradient-to-br from-red-950/90 via-red-900/80 to-amber-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-golden/50 shadow-2xl shadow-red-900/50 overflow-hidden">
                    {/* Message Header - Clickable */}
                    <div
                      onClick={() => setExpandedMessage(expandedMessage === (message._id || message.id) ? null : (message._id || message.id))}
                      className="p-4 sm:p-6 cursor-pointer hover:bg-red-900/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                            <span className="text-lg sm:text-2xl">📢</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-golden font-bold text-base sm:text-lg lg:text-xl truncate">{message.title}</h4>
                            <p className="text-golden-light text-xs sm:text-sm">{new Date(message.createdAt || message.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-golden-light text-xs sm:text-sm font-medium">By</p>
                            <p className="text-golden text-xs sm:text-sm font-semibold">{message.author}</p>
                          </div>
                          <div className="text-golden text-xl sm:text-2xl transform transition-transform duration-300" style={{ transform: expandedMessage === (message._id || message.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ↓
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Content - Collapsible */}
                    {expandedMessage === (message._id || message.id) && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-golden/30">
                        <div className="pt-4">
                          <p className="text-golden-light leading-relaxed text-justify text-sm sm:text-base">
                            {message.content}
                          </p>
                          <div className="block sm:hidden mt-4 pt-4 border-t border-golden/20">
                            <p className="text-golden-light text-xs text-center">By {message.author}</p>
                          </div>
                          <div className="text-center mt-4 sm:mt-6">
                            <p className="text-golden-light text-base sm:text-lg font-semibold devanagari-text drop-shadow-lg">
                              🕉️ ॐ गणेशाय नमः 🕉️
                            </p>
                            <p className="text-golden-light text-sm sm:text-base">
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-golden mb-3">Upcoming Community Events</h3>
              <p className="text-golden-light text-base sm:text-lg max-w-2xl mx-auto px-4">
                Join us in celebrating our traditions and strengthening our community bonds
              </p>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Events List */}
            <div className="space-y-3 sm:space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-golden/20 to-golden-light/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">📅</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-golden mb-2">No Events Yet</h4>
                  <p className="text-golden-light text-sm sm:text-base px-4">Check back soon for upcoming community events!</p>
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
                    <div key={event._id || event.id} className="bg-gradient-to-br from-red-950/90 via-red-900/80 to-amber-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-golden/50 shadow-2xl shadow-red-900/50 overflow-hidden">
                      {/* Event Header - Clickable */}
                      <div
                        onClick={() => setExpandedEvent(expandedEvent === (event._id || event.id) ? null : (event._id || event.id))}
                        className="p-4 sm:p-6 cursor-pointer hover:bg-red-900/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                              <span className="text-lg sm:text-2xl">{eventIcon}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-golden font-bold text-base sm:text-lg lg:text-xl truncate">{event.title}</h4>
                              <p className="text-golden-light text-xs sm:text-sm truncate">{eventDate}</p>
                              <p className="text-golden-light text-xs sm:text-sm truncate">{eventLocation}</p>
                              {/* Event Tags */}
                              <div className="flex gap-1 sm:gap-2 mt-1 flex-wrap">
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
                          <div className="text-golden text-xl sm:text-2xl transform transition-transform duration-300 flex-shrink-0" style={{ transform: expandedEvent === (event._id || event.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ↓
                          </div>
                        </div>
                      </div>

                      {/* Event Content - Collapsible */}
                      {expandedEvent === (event._id || event.id) && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-golden/30">
                          <div className="pt-4">
                            <p className="text-golden-light leading-relaxed text-justify mb-4 sm:mb-6 text-sm sm:text-base">
                              {event.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-golden/30 text-xs sm:text-sm">
                                <span>📅</span>
                                <span className="truncate">{eventDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-golden/30 text-xs sm:text-sm">
                                <span>📍</span>
                                <span className="truncate">{eventLocation}</span>
                              </div>
                              <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-golden/30 text-xs sm:text-sm">
                                <span>👥</span>
                                <span>Open to All</span>
                              </div>
                              {event.mandal && (
                                <div className="flex items-center gap-2 text-golden-light bg-red-950/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-golden/30 text-xs sm:text-sm">
                                  <span>🏛️</span>
                                  <span className="truncate">{event.mandal.name || 'KTYA'}</span>
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
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-golden mb-3">Community Gallery</h3>
              <p className="text-golden-light text-base sm:text-lg max-w-2xl mx-auto px-4">
                Cherished moments and beautiful memories from our community celebrations
              </p>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Real Gallery Component */}
            <GalleryViewer 
              showFilters={true}
              showPagination={true}
              layout="grid"
              columns={4} // More columns for smaller cards
              itemsPerPage={12} // Increase items per page since cards are smaller
              allowDelete={false}
              showUploader={false}
              autoRefresh={true}
              autoRefreshInterval={60000}
            />
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
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-golden/20 via-transparent to-golden/20 rounded-full blur-3xl scale-150"></div>
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-golden via-golden-light to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-golden/30 animate-float border-4 border-golden/40">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-red-950 via-red-900 to-red-950 rounded-full flex items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-5xl lg:text-6xl drop-shadow-lg">👥</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            {/* Sanskrit greeting */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-golden mb-2 devanagari-text drop-shadow-lg">
                समुदाय संगम
              </h1>
              <p className="text-golden-light text-base sm:text-lg">Community Hub</p>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 relative">
              <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent drop-shadow-xl">
                Divine Community
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-golden to-transparent rounded-full shadow-lg"></div>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-golden-light max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg px-4">
              Connect with devotees, organize events, coordinate volunteers, and share experiences 
              <span className="block mt-2 text-golden font-medium">
                in our divine community
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Tab Navigation with Spiritual Theme */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/80 via-red-900/90 to-red-950/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-golden/40 shadow-2xl shadow-red-900/50">
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer w-full sm:w-auto ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-golden to-golden-light text-red-950 shadow-2xl shadow-golden/50 border-2 border-golden/60'
                      : 'bg-gradient-to-r from-white/10 to-white/5 text-golden hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 border-2 border-golden/30 hover:border-golden/50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={`text-xl sm:text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm sm:text-base lg:text-lg font-bold drop-shadow-sm">{tab.name}</span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-1 bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-full shadow-lg"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-golden to-golden-light text-red-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-20"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-lg sm:text-xl">↑</span>
      </button>
    </div>
  );
};

export default CommunityPage;
