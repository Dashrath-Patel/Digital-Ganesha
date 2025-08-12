import React, { useState } from 'react';
import Header from '../components/Header';

const CulturalLearningPage = () => {
  const [activeCategory, setActiveCategory] = useState('mantras');

  const categories = [
    { id: 'mantras', name: 'Mantras & Shlokas', icon: '🕉️' },
    { id: 'recipes', name: 'Recipes', icon: '🍯' },
    { id: 'traditions', name: 'Traditions & Rituals', icon: '🪔' },
    { id: 'books', name: 'Books & Scriptures', icon: '📚' }
  ];

  const mantrasContent = [
    {
      title: "गणपति आरती",
      sanskrit: "जय गणेश जय गणेश जय गणेश देवा। माता जाकी पार्वती पिता महादेवा।",
      translation: "Glory to Lord Ganesha, whose mother is Parvati and father is Mahadeva (Shiva).",
      significance: "This is the most popular aarti sung during Ganesha worship.",
      audio: null
    },
    {
      title: "गणेश मंत्र",
      sanskrit: "ॐ गं गणपतये नमः",
      translation: "Om Gam Ganapataye Namaha - I bow to Lord Ganesha",
      significance: "This is the most powerful and commonly chanted Ganesha mantra for removing obstacles.",
      audio: null
    },
    {
      title: "वक्रतुंड महाकाय",
      sanskrit: "वक्रतुंड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा।",
      translation: "O Lord with the curved trunk and massive body, whose brilliance is equal to millions of suns, please make all my endeavors free of obstacles always.",
      significance: "This shloka is traditionally recited before beginning any important work or ceremony.",
      audio: null
    }
  ];

  const recipesContent = [
    {
      title: "Modak (Traditional)",
      ingredients: [
        "2 cups rice flour",
        "1 cup jaggery (gur)",
        "1 cup fresh grated coconut",
        "1/2 tsp cardamom powder",
        "Ghee for greasing"
      ],
      instructions: [
        "Heat water in a heavy-bottomed pan and add a pinch of salt and 1 tsp ghee.",
        "When water boils, gradually add rice flour while stirring continuously.",
        "Cook until mixture forms a soft dough. Cover and let it cool.",
        "For filling: Heat jaggery until it melts, add coconut and cardamom.",
        "Cook until mixture thickens. Let it cool.",
        "Make small portions of dough, flatten, add filling, and shape into modaks.",
        "Steam for 10-12 minutes. Serve warm."
      ],
      significance: "Modak is Lord Ganesha's favorite sweet and is essential for Ganesh Chaturthi celebrations."
    },
    {
      title: "Puran Poli",
      ingredients: [
        "2 cups chana dal (split chickpeas)",
        "1 cup jaggery",
        "2 cups wheat flour",
        "1/2 tsp turmeric",
        "Ghee as needed"
      ],
      instructions: [
        "Cook chana dal with turmeric until soft.",
        "Mash the dal and cook with jaggery until thick.",
        "Make dough with wheat flour, salt, and ghee.",
        "Roll dough, add filling, and cook on tawa with ghee.",
        "Serve hot with ghee."
      ],
      significance: "A traditional Maharashtrian sweet bread offered to Lord Ganesha."
    }
  ];

  const traditionsContent = [
    {
      title: "Ganesh Chaturthi Celebration",
      description: "The 11-day festival celebrating Lord Ganesha's birth.",
      rituals: [
        "Pranapratishtha - Installation of Ganesha idol with proper rituals",
        "Daily Aarti - Morning and evening prayers with offerings",
        "Modak Offering - Daily offering of Ganesha's favorite sweets",
        "Visarjan - Immersion ceremony on the final day"
      ],
      significance: "This festival symbolizes the cycle of creation and dissolution in Hindu philosophy."
    },
    {
      title: "Sankashti Chaturthi",
      description: "Monthly fasting day dedicated to Lord Ganesha.",
      rituals: [
        "Observe fast from sunrise to moonrise",
        "Perform special puja in the evening",
        "Offer durva grass and red flowers",
        "Break fast only after sighting the moon"
      ],
      significance: "This monthly observance helps devotees overcome obstacles and gain Ganesha's blessings."
    },
    {
      title: "First Worship Tradition",
      description: "Lord Ganesha is always worshipped first in any Hindu ceremony.",
      rituals: [
        "Begin any puja with Ganesha invocation",
        "Offer red flowers and durva grass",
        "Chant 'Vighneshwaraya Namaha'",
        "Seek blessings for obstacle-free completion"
      ],
      significance: "As the remover of obstacles, Ganesha's blessings ensure successful completion of any endeavor."
    }
  ];

  const booksContent = [
    {
      title: "Ganesha Purana",
      author: "Sage Vyasa",
      description: "A sacred text dedicated entirely to Lord Ganesha, containing stories of his birth, adventures, and teachings.",
      chapters: [
        "Upasana Khanda - Methods of worship",
        "Krida Khanda - Divine plays and stories",
        "Uttara Khanda - Advanced spiritual teachings"
      ],
      significance: "One of the most comprehensive texts about Lord Ganesha's divine nature and worship methods."
    },
    {
      title: "Mudgala Purana",
      author: "Unknown",
      description: "Another important Purana focusing on eight incarnations of Lord Ganesha.",
      chapters: [
        "Vakratunda incarnation",
        "Ekadanta incarnation", 
        "Mahodara incarnation",
        "Gajanana incarnation"
      ],
      significance: "Describes various forms of Ganesha and their specific powers to overcome different types of obstacles."
    },
    {
      title: "Ganesha Sahasranama",
      author: "Various sources",
      description: "Collection of 1000 names of Lord Ganesha with their meanings and significance.",
      chapters: [
        "Mudgala Sahasranama",
        "Ganesha Purana Sahasranama",
        "Narada Purana Sahasranama"
      ],
      significance: "Chanting these sacred names is believed to grant all wishes and remove all obstacles."
    }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'mantras':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Mantras & Shlokas</h3>
            {mantrasContent.map((mantra, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl">
                <h4 className="text-xl font-bold text-golden mb-4">{mantra.title}</h4>
                <div className="space-y-4">
                  <div className="bg-golden/10 rounded-lg p-4">
                    <p className="text-lg font-medium text-golden mb-2">Sanskrit:</p>
                    <p className="text-golden-light text-lg leading-relaxed">{mantra.sanskrit}</p>
                  </div>
                  <div>
                    <p className="text-md font-medium text-golden mb-2">Translation:</p>
                    <p className="text-golden-light">{mantra.translation}</p>
                  </div>
                  <div>
                    <p className="text-md font-medium text-golden mb-2">Significance:</p>
                    <p className="text-golden-light">{mantra.significance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'recipes':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Traditional Recipes</h3>
            {recipesContent.map((recipe, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl">
                <h4 className="text-xl font-bold text-golden mb-4">{recipe.title}</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-golden mb-3">Ingredients:</h5>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-golden-light flex items-center">
                          <span className="text-golden mr-2">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-golden mb-3">Instructions:</h5>
                    <ol className="space-y-2">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="text-golden-light">
                          <span className="text-golden font-semibold mr-2">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-4 bg-golden/10 rounded-lg p-4">
                  <p className="text-md font-medium text-golden mb-2">Significance:</p>
                  <p className="text-golden-light">{recipe.significance}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'traditions':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Traditions & Rituals</h3>
            {traditionsContent.map((tradition, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl">
                <h4 className="text-xl font-bold text-golden mb-4">{tradition.title}</h4>
                <p className="text-golden-light mb-4">{tradition.description}</p>
                <div>
                  <h5 className="text-lg font-semibold text-golden mb-3">Rituals:</h5>
                  <ul className="space-y-2 mb-4">
                    {tradition.rituals.map((ritual, idx) => (
                      <li key={idx} className="text-golden-light flex items-start">
                        <span className="text-golden mr-2 mt-1">🔸</span>
                        {ritual}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-golden/10 rounded-lg p-4">
                  <p className="text-md font-medium text-golden mb-2">Significance:</p>
                  <p className="text-golden-light">{tradition.significance}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'books':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Books & Scriptures</h3>
            {booksContent.map((book, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl">
                <h4 className="text-xl font-bold text-golden mb-2">{book.title}</h4>
                <p className="text-golden-light/80 mb-4">Author: {book.author}</p>
                <p className="text-golden-light mb-4">{book.description}</p>
                <div>
                  <h5 className="text-lg font-semibold text-golden mb-3">Key Chapters/Sections:</h5>
                  <ul className="space-y-2 mb-4">
                    {book.chapters.map((chapter, idx) => (
                      <li key={idx} className="text-golden-light flex items-start">
                        <span className="text-golden mr-2 mt-1">📖</span>
                        {chapter}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-golden/10 rounded-lg p-4">
                  <p className="text-md font-medium text-golden mb-2">Significance:</p>
                  <p className="text-golden-light">{book.significance}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(180, 50, 50, 0.85)' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-golden mb-6">
            Cultural Learning
          </h1>
          <p className="text-xl text-golden-light max-w-3xl mx-auto leading-relaxed">
            Discover the rich traditions, sacred texts, and spiritual wisdom of Lord Ganesha
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-golden text-red-900 shadow-xl'
                    : 'bg-white/20 text-golden hover:bg-white/30'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
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

export default CulturalLearningPage;
