import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CulturalService from '../services/CulturalService';

const CulturalLearningPage = () => {
  const [activeCategory, setActiveCategory] = useState('mantras');
  const [expandedMantra, setExpandedMantra] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [expandedTradition, setExpandedTradition] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bhajanSearchTerm, setBhajanSearchTerm] = useState('');
  const [currentRecipeStart, setCurrentRecipeStart] = useState(0);
  
  // Dynamic data state
  const [mantrasContent, setMantrasContent] = useState([]);
  const [recipesContent, setRecipesContent] = useState([]);
  const [traditionsContent, setTraditionsContent] = useState([]);
  const [booksContent, setBooksContent] = useState([]);
  const [bhajansContent, setBhajansContent] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [displayedBhajans, setDisplayedBhajans] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState({});
  const [error, setError] = useState(null);

  // Utility function to get YouTube thumbnail URL
  const getYoutubeThumbnail = (videoId, quality = 'maxresdefault') => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // Utility function to get YouTube video URL
  const getYoutubeUrl = (videoId) => {
    if (!videoId) return null;
    return `https://youtube.com/watch?v=${videoId}`;
  };

  const categories = [
    { id: 'mantras', name: 'Mantras & Shlokas', icon: '🕉️' },
    { id: 'recipes', name: 'Recipes', icon: '🍯' },
    { id: 'traditions', name: 'Traditions & Rituals', icon: '🪔' },
    { id: 'books', name: 'Books & Scriptures', icon: '📚' },
    { id: 'bhajans', name: 'Bhajans', icon: '🎵' }
  ];

  // Load all cultural content on component mount
  useEffect(() => {
    const loadAllContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all categories in parallel
        const [mantras, recipes, traditions, books, bhajans] = await Promise.all([
          CulturalService.getMantras(),
          CulturalService.getRecipes({ limit: 12 }), // Get 12 recipes
          CulturalService.getTraditions(),
          CulturalService.getBooks(),
          CulturalService.getBhajans()
        ]);

        setMantrasContent(mantras.data || []);
        setRecipesContent(recipes.data || []);
        setTraditionsContent(traditions.data || []);
        setBooksContent(books.data || []);
        setBhajansContent(bhajans.data || []);
        
        // Set initial displayed content
        setDisplayedRecipes(getRandomItems(recipes.data || [], 4));
        setDisplayedBhajans(getRandomItems(bhajans.data || [], 9));
        setDisplayedBooks(getRandomItems(books.data || [], 12));
        
      } catch (err) {
        console.error('Error loading cultural content:', err);
        setError('Failed to load cultural content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllContent();
  }, []);

  // Load content for specific category when switching
  const loadCategoryContent = async (category) => {
    if (categoryLoading[category]) return;
    
    try {
      setCategoryLoading(prev => ({ ...prev, [category]: true }));
      
      let content;
      switch (category) {
        case 'mantras':
          if (mantrasContent.length === 0) {
            content = await CulturalService.getMantras();
            setMantrasContent(content.data || []);
          }
          break;
        case 'recipes':
          if (recipesContent.length === 0) {
            content = await CulturalService.getRecipes();
            setRecipesContent(content.data || []);
            setDisplayedRecipes(getRandomItems(content.data || [], 4));
          }
          break;
        case 'traditions':
          if (traditionsContent.length === 0) {
            content = await CulturalService.getTraditions();
            setTraditionsContent(content.data || []);
          }
          break;
        case 'books':
          if (booksContent.length === 0) {
            content = await CulturalService.getBooks();
            setBooksContent(content.data || []);
            setDisplayedBooks(getRandomItems(content.data || [], 12));
          }
          break;
        case 'bhajans':
          if (bhajansContent.length === 0) {
            content = await CulturalService.getBhajans();
            setBhajansContent(content.data || []);
            setDisplayedBhajans(getRandomItems(content.data || [], 9));
          }
          break;
      }
    } catch (err) {
      console.error(`Error loading ${category} content:`, err);
    } finally {
      setCategoryLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  // Utility function to get random items from array - wrapped in useCallback
  const getRandomItems = React.useCallback((array, count) => {
    if (!array || array.length === 0) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }, []);

  // Filter function for search using useMemo to prevent infinite loops
  const filteredRecipes = React.useMemo(() => {
    return recipesContent.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.ingredients && recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [recipesContent, searchTerm]);

  // Get 4 random recipes or filtered recipes - wrapped in useCallback
  const getDisplayedRecipes = React.useCallback(() => {
    if (searchTerm) {
      return filteredRecipes; // Show all filtered results when searching
    }
    return displayedRecipes;
  }, [searchTerm, filteredRecipes, displayedRecipes]);

  // Refresh recipes function - wrapped in useCallback
  const refreshRecipes = React.useCallback(() => {
    if (!searchTerm && recipesContent.length > 0) {
      setDisplayedRecipes(getRandomItems(recipesContent, 4));
    }
  }, [searchTerm, recipesContent, getRandomItems]);

  // Refresh traditions function - wrapped in useCallback
  const refreshTraditions = React.useCallback(() => {
    if (!searchTerm && traditionsContent.length > 0) {
      setTraditionsContent([...getRandomItems(traditionsContent, traditionsContent.length)]);
    }
  }, [searchTerm, traditionsContent, getRandomItems]);

  // Refresh books function - wrapped in useCallback
  const refreshBooks = React.useCallback(() => {
    if (!searchTerm && displayedBooks.length > 0) {
      setDisplayedBooks(getRandomItems(displayedBooks, displayedBooks.length));
    }
  }, [searchTerm, displayedBooks, getRandomItems]);

  // Refresh bhajans function - wrapped in useCallback
  const refreshBhajans = React.useCallback(() => {
    if (!bhajanSearchTerm && displayedBhajans.length > 0) {
      setDisplayedBhajans(getRandomItems(displayedBhajans, displayedBhajans.length));
    }
  }, [bhajanSearchTerm, displayedBhajans, getRandomItems]);

  // Update displayed recipes when search term changes
  useEffect(() => {
    if (searchTerm && filteredRecipes.length >= 0) {
      setDisplayedRecipes(filteredRecipes);
    } else if (!searchTerm && recipesContent.length > 0) {
      setDisplayedRecipes(getRandomItems(recipesContent, 4));
    }
  }, [searchTerm, recipesContent, filteredRecipes, getRandomItems]);

  // Filter function for bhajans search using useMemo
  const filteredBhajans = React.useMemo(() => {
    return bhajansContent.filter(bhajan =>
      bhajan.title.toLowerCase().includes(bhajanSearchTerm.toLowerCase()) ||
      (bhajan.artist && bhajan.artist.toLowerCase().includes(bhajanSearchTerm.toLowerCase())) ||
      (bhajan.description && bhajan.description.toLowerCase().includes(bhajanSearchTerm.toLowerCase()))
    );
  }, [bhajansContent, bhajanSearchTerm]);

  // Update displayed bhajans when search term changes
  useEffect(() => {
    if (bhajanSearchTerm && filteredBhajans.length >= 0) {
      setDisplayedBhajans(filteredBhajans);
    } else if (!bhajanSearchTerm && bhajansContent.length > 0) {
      setDisplayedBhajans(getRandomItems(bhajansContent, 9));
    }
  }, [bhajanSearchTerm, bhajansContent, filteredBhajans, getRandomItems]);

  // Removed auto-scroll functionality to prevent unwanted page jumps
  // Users can manually scroll to see the expanded content if needed

  // Handle mantra card click
  const handleMantraCardClick = async (mantraId) => {
    const newExpandedMantra = expandedMantra === mantraId ? null : mantraId;
    setExpandedMantra(newExpandedMantra);
    
    // Track view if expanding
    if (newExpandedMantra) {
      try {
        await CulturalService.getContentById(mantraId);
      } catch (err) {
        console.error('Error tracking mantra view:', err);
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    loadCategoryContent(category);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-golden mx-auto mb-4"></div>
            <p className="text-golden-light">Loading cultural content...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-golden text-red-900 px-6 py-2 rounded-full font-semibold hover:bg-golden-light transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeCategory) {
      case 'mantras':
        return (
          <div className="space-y-8 p-6 bg-black/5 backdrop-blur-sm rounded-2xl border border-golden/10">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-golden mb-4 drop-shadow-lg">Sacred Mantras & Shlokas</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent mx-auto"></div>
            </div>
            
            {categoryLoading.mantras ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Expanded Card Display */}
                {expandedMantra && (
                  <div className="mb-12 section-spacing">
                    {mantrasContent
                      .filter(mantra => mantra._id === expandedMantra)
                      .map((mantra) => (
                        <div 
                          key={`expanded-${mantra._id}`}
                          className="relative overflow-hidden rounded-3xl shadow-2xl content-container"
                          style={{ backgroundColor: 'rgba(21, 21, 21, 0.8)' }}
                        >
                          {/* Clean background overlay - minimal design */}
                          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-red-900/10 to-black/30"></div>
                          
                          <div className="relative z-10 p-8">
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 flex-shrink-0">
                                  <img 
                                    src={`/${mantra.image}`} 
                                    alt="Sacred Symbol" 
                                    className="w-full h-full object-contain rounded-lg filter drop-shadow-lg"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-3xl font-bold text-golden leading-tight">{mantra.title}</h4>
                                  <p className="text-golden-light/80 text-base mt-2">Source: {mantra.source}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setExpandedMantra(null)}
                                className="ml-4 flex-shrink-0 p-2 rounded-full bg-golden/20 hover:bg-golden/30 transition-all duration-200"
                              >
                                <svg className="w-6 h-6 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="space-y-6 animate-fadeIn">
                              <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20">
                                <p className="text-lg font-medium text-golden mb-3">Sanskrit:</p>
                                <p className="text-golden-light text-base leading-relaxed whitespace-pre-line font-mono">
                                  {mantra.sanskrit}
                                </p>
                              </div>
                              <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-6 border border-golden/10">
                                <p className="text-lg font-medium text-golden mb-3">Translation:</p>
                                <p className="text-golden-light text-base leading-relaxed">{mantra.translation}</p>
                              </div>
                              <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-6 border border-golden/10">
                                <p className="text-lg font-medium text-golden mb-3">Significance:</p>
                                <p className="text-golden-light text-base leading-relaxed">{mantra.significance}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {mantrasContent.map((mantra) => (
                    <div 
                      key={mantra._id} 
                      className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform content-container ${
                        expandedMantra === mantra._id ? 'ring-2 ring-golden/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(21, 21, 21, 0.8)',
                        minHeight: '200px' 
                      }}
                      onClick={() => handleMantraCardClick(mantra._id)}
                    >
                      {/* Clean background overlay - minimal design */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-red-900/5 to-black/15"></div>
                      
                      <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 flex-shrink-0">
                            <img 
                              src={`/${mantra.image}`} 
                              alt="Sacred Symbol" 
                              className="w-full h-full object-contain rounded-lg filter drop-shadow-lg"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-lg font-bold text-golden leading-tight mb-2">{mantra.title}</h4>
                            <p className="text-golden-light/70 text-sm">Source: {mantra.source}</p>
                          </div>
                        </div>
                        
                        <div className="bg-golden/5 backdrop-blur-md rounded-xl p-4 border border-golden/10">
                          <p className="text-golden-light text-sm leading-relaxed line-clamp-3">
                            {mantra.significance}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-golden-light/60 text-xs">
                            Click to {expandedMantra === mantra._id ? 'collapse' : 'expand'}
                          </span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-golden opacity-60"></div>
                            <div className="w-2 h-2 rounded-full bg-golden-light opacity-40"></div>
                            <div className="w-2 h-2 rounded-full bg-golden opacity-60"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'recipes':
        return (
          <div className="space-y-8 p-6 bg-black/5 backdrop-blur-sm rounded-2xl border border-golden/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <h3 className="text-4xl font-bold text-golden mb-2 drop-shadow-lg">Sacred Recipes</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes or ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-golden/30 text-golden-light placeholder-golden-light/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/70 transition-all duration-300"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-golden-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {!searchTerm && (
                  <button
                    onClick={refreshRecipes}
                    className="px-6 py-3 bg-gradient-to-r from-golden/20 to-golden-light/20 hover:from-golden/30 hover:to-golden-light/30 rounded-2xl text-golden font-bold transition-all duration-300 flex items-center space-x-3 border border-golden/30 hover:border-golden/50 hover:scale-105 transform"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Shuffle</span>
                  </button>
                )}
              </div>
            </div>

            {categoryLoading.recipes ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4"></div>
                  <p className="text-golden-light">Loading delicious recipes...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {getDisplayedRecipes().map((recipe) => (
                  <div 
                    key={recipe._id} 
                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform bg-gradient-to-br from-black/40 via-black/30 to-black/20 backdrop-blur-md border border-golden/20 cursor-pointer"
                    onClick={() => setExpandedRecipe(expandedRecipe === recipe._id ? null : recipe._id)}
                  >
                    {/* Clean YouTube Thumbnail Background */}
                    {recipe.videoId && (
                      <div className="absolute inset-0">
                        <img 
                          src={getYoutubeThumbnail(recipe.videoId)} 
                          alt={recipe.title}
                          className="w-full h-full object-cover opacity-8 group-hover:opacity-12 transition-opacity duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/80"></div>
                      </div>
                    )}
                    
                    {/* Minimal background pattern - removed for cleaner look */}
                    
                    <div className="relative z-10 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-3xl font-bold text-golden mb-3 group-hover:text-golden-light transition-colors duration-300">{recipe.title}</h4>
                          <p className="text-golden-light/90 text-base leading-relaxed">{recipe.significance}</p>
                        </div>
                        <div className="flex items-center space-x-3 ml-6">
                          {recipe.videoId && (
                            <a 
                              href={getYoutubeUrl(recipe.videoId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/play relative"
                              title="Watch Recipe Video"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* YouTube Thumbnail */}
                              <div className="relative w-24 h-18 rounded-xl overflow-hidden border-2 border-golden/50 group-hover/play:border-golden transition-all duration-300 group-hover/play:scale-110 transform">
                                <img 
                                  src={getYoutubeThumbnail(recipe.videoId, 'mqdefault')} 
                                  alt={`${recipe.title} video`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/20 transition-colors duration-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center group-hover/play:bg-red-500 transition-colors duration-300 shadow-lg">
                                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </a>
                          )}
                          
                          {/* Expand/Collapse Button */}
                          <button 
                            className="p-3 bg-golden/20 hover:bg-golden/30 rounded-full transition-all duration-300 group/expand"
                            title={expandedRecipe === recipe._id ? "Hide Details" : "Show Recipe Details"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRecipe(expandedRecipe === recipe._id ? null : recipe._id);
                            }}
                          >
                            <svg 
                              className={`w-6 h-6 text-golden transform transition-transform duration-300 group-hover/expand:scale-110 ${
                                expandedRecipe === recipe._id ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Collapsible Recipe Details */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedRecipe === recipe._id 
                          ? 'max-h-[2000px] opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="space-y-6 pt-4">
                          <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20 group-hover:bg-golden/15 transition-colors duration-300">
                            <h5 className="text-xl font-bold text-golden mb-4 flex items-center">
                              <span className="w-2 h-2 bg-golden rounded-full mr-3"></span>
                              Ingredients:
                            </h5>
                            <ul className="space-y-3">
                              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <span className="w-2 h-2 rounded-full bg-golden-light mt-2 flex-shrink-0"></span>
                                  <span className="text-golden-light text-sm leading-relaxed">{ingredient}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-6 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-xl font-bold text-golden mb-4 flex items-center">
                              <span className="w-2 h-2 bg-golden rounded-full mr-3"></span>
                              Instructions:
                            </h5>
                            <ol className="space-y-4">
                              {recipe.instructions && recipe.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start space-x-4">
                                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-golden to-golden-light text-red-900 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                                    {index + 1}
                                  </span>
                                  <span className="text-golden-light text-sm leading-relaxed">{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'traditions':
        return (
          <div className="space-y-8 p-6 bg-black/5 backdrop-blur-sm rounded-2xl border border-golden/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <h3 className="text-4xl font-bold text-golden mb-2 drop-shadow-lg">Sacred Traditions & Rituals</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Explore ancient traditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-golden/30 text-golden-light placeholder-golden-light/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/70 transition-all duration-300"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-golden-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {!searchTerm && (
                  <button
                    onClick={refreshTraditions}
                    className="px-6 py-3 bg-gradient-to-r from-golden/20 to-golden-light/20 hover:from-golden/30 hover:to-golden-light/30 rounded-2xl text-golden font-bold transition-all duration-300 flex items-center space-x-3 border border-golden/30 hover:border-golden/50 hover:scale-105 transform"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Shuffle</span>
                  </button>
                )}
              </div>
            </div>
            
            {categoryLoading.traditions ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4"></div>
                  <p className="text-golden-light">Discovering sacred traditions...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {traditionsContent.map((tradition) => (
                  <div 
                    key={tradition._id} 
                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform bg-gradient-to-br from-black/50 via-black/40 to-black/30 backdrop-blur-md border border-golden/20 cursor-pointer"
                    onClick={() => setExpandedTradition(expandedTradition === tradition._id ? null : tradition._id)}
                  >
                    {/* Clean minimal background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-red-900/5 to-black/25"></div>
                    
                    <div className="relative z-10 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img 
                              src={`/${tradition.image}`} 
                              alt="Tradition Symbol" 
                              className="w-full h-full object-contain rounded-lg filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-golden mb-2 group-hover:text-golden-light transition-colors duration-300">{tradition.title}</h4>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Button */}
                        <button 
                          className="p-3 bg-golden/20 hover:bg-golden/30 rounded-full transition-all duration-300 group/expand flex-shrink-0"
                          title={expandedTradition === tradition._id ? "Hide Details" : "Show Tradition Details"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTradition(expandedTradition === tradition._id ? null : tradition._id);
                          }}
                        >
                          <svg 
                            className={`w-6 h-6 text-golden transform transition-transform duration-300 group-hover/expand:scale-110 ${
                              expandedTradition === tradition._id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Always visible description */}
                      <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-6 border border-golden/20 group-hover:bg-golden/15 transition-colors duration-300 mb-6">
                        <p className="text-golden-light text-base leading-relaxed">{tradition.description}</p>
                      </div>
                      
                      {/* Collapsible Tradition Details */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedTradition === tradition._id 
                          ? 'max-h-[2000px] opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="space-y-6">
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-6 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-lg font-bold text-golden mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-3 text-golden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
                              </svg>
                              Sacred Rituals:
                            </h5>
                            <ul className="space-y-3">
                              {tradition.rituals && tradition.rituals.map((ritual, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <span className="w-2 h-2 rounded-full bg-golden mt-2 flex-shrink-0"></span>
                                  <span className="text-golden-light text-sm leading-relaxed">{ritual}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-6 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-lg font-bold text-golden mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-3 text-golden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.5 2C8.67 2 8 2.67 8 3.5V5H6.5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8H8V9.5C8 10.33 8.67 11 9.5 11S11 10.33 11 9.5V8H12.5C13.33 8 14 7.33 14 6.5S13.33 5 12.5 5H11V3.5C11 2.67 10.33 2 9.5 2Z"/>
                              </svg>
                              Divine Significance:
                            </h5>
                            <p className="text-golden-light text-sm leading-relaxed">{tradition.significance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'books':
        return (
          <div className="space-y-8 p-6 bg-black/5 backdrop-blur-sm rounded-2xl border border-golden/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <h3 className="text-4xl font-bold text-golden mb-2 drop-shadow-lg">Sacred Books & Scriptures</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sacred texts and authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-golden/30 text-golden-light placeholder-golden-light/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/70 transition-all duration-300"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-golden-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {!searchTerm && (
                  <button
                    onClick={refreshBooks}
                    className="px-6 py-3 bg-gradient-to-r from-golden/20 to-golden-light/20 hover:from-golden/30 hover:to-golden-light/30 rounded-2xl text-golden font-bold transition-all duration-300 flex items-center space-x-3 border border-golden/30 hover:border-golden/50 hover:scale-105 transform"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Shuffle</span>
                  </button>
                )}
              </div>
            </div>
            
            {categoryLoading.books ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4"></div>
                  <p className="text-golden-light">Loading sacred scriptures...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayedBooks.map((book) => (
                  <div 
                    key={book._id} 
                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md border border-golden/20 cursor-pointer"
                    onClick={() => setExpandedBook(expandedBook === book._id ? null : book._id)}
                  >
                    {/* Clean minimal background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-red-900/8 to-black/30"></div>
                    
                    <div className="relative z-10 p-8 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img 
                              src={`/${book.image}`} 
                              alt="Book Symbol" 
                              className="w-full h-full object-contain rounded-lg filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-golden mb-2 leading-tight group-hover:text-golden-light transition-colors duration-300">{book.title}</h4>
                            <p className="text-golden-light/70 text-sm font-medium">By {book.author}</p>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Button */}
                        <button 
                          className="p-3 bg-golden/20 hover:bg-golden/30 rounded-full transition-all duration-300 group/expand flex-shrink-0"
                          title={expandedBook === book._id ? "Hide Details" : "Show Book Details"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedBook(expandedBook === book._id ? null : book._id);
                          }}
                        >
                          <svg 
                            className={`w-6 h-6 text-golden transform transition-transform duration-300 group-hover/expand:scale-110 ${
                              expandedBook === book._id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Always visible description */}
                      <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-5 border border-golden/20 group-hover:bg-golden/15 transition-colors duration-300 mb-4">
                        <p className="text-golden-light text-sm leading-relaxed">{book.description}</p>
                      </div>
                      
                      {/* Collapsible Book Details */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out flex-1 ${
                        expandedBook === book._id 
                          ? 'max-h-[2000px] opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="space-y-5">
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-5 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-lg font-bold text-golden mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-3 text-golden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM17 7H7V9H17V7ZM17 11H7V13H17V11ZM14 15H7V17H14V15Z"/>
                              </svg>
                              Key Chapters:
                            </h5>
                            <ul className="space-y-3">
                              {book.chapters && book.chapters.slice(0, 4).map((chapter, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-golden to-golden-light text-red-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                                    {index + 1}
                                  </span>
                                  <span className="text-golden-light text-sm leading-relaxed">{chapter}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-5 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-lg font-bold text-golden mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-3 text-golden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
                              </svg>
                              Spiritual Significance:
                            </h5>
                            <p className="text-golden-light text-sm leading-relaxed">{book.significance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'bhajans':
        return (
          <div className="space-y-8 p-6 bg-black/5 backdrop-blur-sm rounded-2xl border border-golden/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <h3 className="text-4xl font-bold text-golden mb-2 drop-shadow-lg">Divine Bhajans</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bhajans, artists, moods..."
                    value={bhajanSearchTerm}
                    onChange={(e) => setBhajanSearchTerm(e.target.value)}
                    className="w-full lg:w-80 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-golden/30 text-golden-light placeholder-golden-light/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/70 transition-all duration-300"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-golden-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {!bhajanSearchTerm && (
                  <button
                    onClick={refreshBhajans}
                    className="px-6 py-3 bg-gradient-to-r from-golden/20 to-golden-light/20 hover:from-golden/30 hover:to-golden-light/30 rounded-2xl text-golden font-bold transition-all duration-300 flex items-center space-x-3 border border-golden/30 hover:border-golden/50 hover:scale-105 transform"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Shuffle</span>
                  </button>
                )}
              </div>
            </div>

            {categoryLoading.bhajans ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4"></div>
                  <p className="text-golden-light">Loading divine melodies...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayedBhajans.map((bhajan) => (
                  <div 
                    key={bhajan._id} 
                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md border border-golden/20"
                    style={{ minHeight: '400px' }}
                  >
                    {/* Clean YouTube Thumbnail Background */}
                    {bhajan.videoId && (
                      <div className="absolute inset-0">
                        <img 
                          src={getYoutubeThumbnail(bhajan.videoId)} 
                          alt={bhajan.title}
                          className="w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/85"></div>
                      </div>
                    )}
                    
                    {/* Minimal background - removed pattern for cleaner look */}
                    
                    <div className="relative z-10 p-8 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-golden mb-3 leading-tight group-hover:text-golden-light transition-colors duration-300">{bhajan.title}</h4>
                          <p className="text-golden-light/80 text-sm font-medium mb-2">🎤 {bhajan.artist}</p>
                          {bhajan.category && (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-golden/20 text-golden border border-golden/30">
                              {bhajan.category}
                            </span>
                          )}
                        </div>
                        {bhajan.videoId && (
                          <a 
                            href={getYoutubeUrl(bhajan.videoId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 group/play relative flex-shrink-0"
                            title="Play Divine Bhajan"
                          >
                            <div className="relative w-24 h-18 rounded-xl overflow-hidden border-2 border-golden/50 group-hover/play:border-golden transition-all duration-300 group-hover/play:scale-110 transform">
                              <img 
                                src={getYoutubeThumbnail(bhajan.videoId, 'mqdefault')} 
                                alt={`${bhajan.title} video`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/20 transition-colors duration-300"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover/play:bg-red-500 transition-colors duration-300 shadow-lg">
                                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-5">
                        <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-5 border border-golden/20 group-hover:bg-golden/15 transition-colors duration-300">
                          <p className="text-golden-light text-sm leading-relaxed">{bhajan.description}</p>
                        </div>
                        
                        {bhajan.significance && (
                          <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-5 border border-golden/10 group-hover:bg-golden/10 transition-colors duration-300">
                            <h5 className="text-lg font-bold text-golden mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-3 text-golden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3V1L14.5 3.5L12 6V4C8.69 4 6 6.69 6 10S8.69 16 12 16 18 13.31 18 10H16C16 12.21 14.21 14 12 14S8 12.21 8 10 9.79 6 12 6Z"/>
                              </svg>
                              Spiritual Significance:
                            </h5>
                            <p className="text-golden-light text-sm leading-relaxed">{bhajan.significance}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-golden opacity-80 animate-pulse"></div>
                            <div className="w-3 h-3 rounded-full bg-golden-light opacity-60 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-3 h-3 rounded-full bg-golden opacity-80 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <div className="flex items-center space-x-2 text-golden-light/60 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3V1L14.5 3.5L12 6V4C8.69 4 6 6.69 6 10S8.69 16 12 16 18 13.31 18 10H16C16 12.21 14.21 14 12 14S8 12.21 8 10 9.79 6 12 6Z"/>
                            </svg>
                            <span>Divine Music</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-center py-20 text-golden-light">Select a category to explore</div>;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden spiritual-gradient">
      {/* Fixed Background Elements - Non-scrolling Sacred Patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Sacred Om Symbol Background */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-3">
          <svg viewBox="0 0 100 100" className="w-full h-full text-golden">
            <path d="M30 70 Q40 50 50 70 Q60 50 70 70 M35 60 Q50 45 65 60 M20 80 Q50 40 80 80" 
                  stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Lotus Petals Pattern */}
        <div className="absolute top-40 right-16 w-28 h-28 opacity-4">
          <svg viewBox="0 0 100 100" className="w-full h-full text-golden-light">
            <path d="M50 10 Q60 30 80 40 Q60 50 50 70 Q40 50 20 40 Q40 30 50 10" 
                  stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
          </svg>
        </div>
        
        {/* Sacred Geometry Mandala */}
        <div className="absolute bottom-40 left-16 w-36 h-36 opacity-4">
          <svg viewBox="0 0 100 100" className="w-full h-full text-golden-dark">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.8"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.6"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.4"/>
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" 
                  stroke="currentColor" strokeWidth="0.2"/>
          </svg>
        </div>
        
        {/* Decorative Border Elements */}
        <div className="absolute bottom-20 right-10 w-24 h-24 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-golden">
            <path d="M10 10 L90 10 L90 90 L10 90 Z M20 20 L80 20 L80 80 L20 80 Z" 
                  stroke="currentColor" strokeWidth="1" fill="none"/>
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          </svg>
        </div>
      </div>

      <Header />

      {/* Enhanced Hero Section with clean background */}
      <section className="relative pt-32 pb-20 px-4 z-10 bg-gradient-to-b from-transparent via-red-900/5 to-transparent">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-golden via-golden-light to-golden-dark rounded-full flex items-center justify-center shadow-2xl border-4 border-golden/30">
              <svg className="w-12 h-12 text-red-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-golden mb-8 drop-shadow-2xl tracking-tight">
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden bg-clip-text text-transparent">
              Cultural Learning
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-golden-light mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Embark on a spiritual journey through the rich heritage of Lord Ganesha worship - 
            discover sacred mantras, traditional recipes, ancient scriptures, and divine music 
            that have blessed devotees for millennia
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-golden to-transparent rounded-full shadow-lg"></div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-golden rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-golden-light rounded-full animate-pulse delay-200"></div>
              <div className="w-3 h-3 bg-golden rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Navigation Section - Fixed Layout */}
      <section className="relative pb-12 px-4 z-10 bg-gradient-to-b from-transparent via-black/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-2 lg:gap-4 mb-16 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={categoryLoading[category.id]}
                className={`group relative flex items-center space-x-2 px-4 lg:px-6 py-3 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-golden via-golden-light to-golden text-red-900 shadow-2xl shadow-golden/50 scale-105'
                    : 'bg-white/10 backdrop-blur-md text-golden hover:bg-white/20 border border-golden/30 hover:border-golden/50'
                } ${categoryLoading[category.id] ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}`}
              >
                {/* Icon with enhanced styling */}
                <span className={`text-lg lg:text-xl transform transition-transform group-hover:scale-125 ${
                  activeCategory === category.id ? 'animate-bounce' : ''
                }`}>
                  {category.icon}
                </span>
                
                {/* Category name */}
                <span className="text-sm lg:text-base tracking-wide">{category.name}</span>
                
                {/* Loading spinner */}
                {categoryLoading[category.id] && (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
                
                {/* Active category indicator */}
                {activeCategory === category.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-golden rotate-45"></div>
                )}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-golden/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section with clean background */}
      <section className="relative pb-20 px-4 z-10 bg-gradient-to-b from-transparent via-red-900/3 to-transparent">
        <div className="max-w-7xl mx-auto bg-black/10 backdrop-blur-sm rounded-3xl p-8 border border-golden/10">
          {renderContent()}
        </div>
      </section>

      {/* Fixed Floating Spiritual Elements - Non-scrolling */}
      <div className="fixed top-1/4 left-3 text-2xl opacity-10 animate-pulse pointer-events-none z-5">🕉️</div>
      <div className="fixed top-1/3 right-3 text-xl opacity-10 animate-bounce delay-300 pointer-events-none z-5">🪔</div>
      <div className="fixed bottom-1/4 left-3 text-xl opacity-10 animate-pulse delay-700 pointer-events-none z-5">📿</div>
      <div className="fixed bottom-1/3 right-3 text-2xl opacity-10 animate-bounce delay-500 pointer-events-none z-5">🌺</div>
    </div>
  );
};

export default CulturalLearningPage;
