import React, { useState } from 'react';
import Header from '../components/Header';

const CulturalLearningPage = () => {
  const [activeCategory, setActiveCategory] = useState('mantras');
  const [expandedMantra, setExpandedMantra] = useState(null);

  const categories = [
    { id: 'mantras', name: 'Mantras & Shlokas', icon: '🕉️' },
    { id: 'recipes', name: 'Recipes', icon: '🍯' },
    { id: 'traditions', name: 'Traditions & Rituals', icon: '🪔' },
    { id: 'books', name: 'Books & Scriptures', icon: '📚' },
    { id: 'bhajans', name: 'Bhajans', icon: '🎵' }
  ];

  const mantrasContent = [
    {
      id: 1,
      title: "Ganesha Atharvashirsha (Opening Verses)",
      sanskrit: `ॐ नमस्ते गणपतये॥
त्वमेव प्रत्यक्षं तत्त्वमसि॥
त्वमेव केवलं कर्ताऽसि॥
त्वमेव केवलं धर्ताऽसि॥
त्वमेव केवलं हर्ताऽसि॥
त्वमेव सर्वं खल्विदं ब्रह्मासि॥
त्वं साक्षादात्माऽसि नित्यम्॥`,
      translation: "Om Namaste Ganapataye || You are the visible Supreme Truth. You alone are the Creator, Sustainer, and Destroyer. You are the eternal Brahman and the Soul of all.",
      significance: "This is from the sacred Ganesha Atharvashirsha, one of the most powerful Vedic hymns to Lord Ganesha."
    },
    {
      id: 2,
      title: "Ganesha Dwadasanama Stotra (12 Names of Ganesha)",
      sanskrit: `सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः॥
लम्बोदरश्च विकटो विघ्ननाशो विनायकः॥
धूम्रकेतुर्गणाध्यक्षो भालचन्द्रो गजाननः॥
द्वादशैतानि नामानि यः पठेच्छृणुयादपि॥
विद्यारम्भे विवाहे च प्रवेशे निर्गमे तथा॥
संग्रामे संकटे चैव विघ्नस्तस्य न जायते॥`,
      translation: "Sumukhah, Ekadantah, Kapilo, Gajakarnakah, Lambodarah, Vikato, Vighnanasho, Vinayakah, Dhoomraketuh, Ganadhyaksho, Bhalachandro, Gajanana. Whoever recites these 12 names avoids obstacles in education, marriage, and battles.",
      significance: "These twelve sacred names of Ganesha provide protection and success in all endeavors."
    },
    {
      id: 3,
      title: "Ganesha Pancharatnam (Adi Shankaracharya's Hymn)",
      sanskrit: `मुदाकरात्तमोदकं सदा विमुक्तिसाधकं॥
कलाधरावतंसकं विलासिलोकरक्षकम्॥
अनायकैकनायकं विनाशितेभदैत्यकम्॥
नताशुभाशु नाशकं नमामि तं विनायकम्॥`,
      translation: "I bow to Vinayaka, who holds the modak, grants liberation, wears the moon, destroys demons, and removes sorrows.",
      significance: "Composed by Adi Shankaracharya, this hymn is considered one of the most beautiful poems dedicated to Lord Ganesha."
    },
    {
      id: 4,
      title: "Ganesha Sahasranama (Selected 8 Lines)",
      sanskrit: `ॐ गणाधिपाय नमः॥ ॐ गणेश्वराय नमः॥
ॐ गजाननाय नमः॥ ॐ एकदन्ताय नमः॥
ॐ हेरम्बाय नमः॥ ॐ लम्बोदराय नमः॥
ॐ सिद्धिदात्रे नमः॥ ॐ विघ्नहन्त्रे नमः॥`,
      translation: "Salutations to Ganesha as Ganadhipa, Gajanana, Lambodara, and the bestower of Siddhi.",
      significance: "These are sacred names from the thousand names of Ganesha, each carrying special spiritual power."
    },
    {
      id: 5,
      title: "Ganesha Mangala Aarti",
      sanskrit: `जय गणेश जय गणेश जय गणेश देवा॥
माता जाकी पार्वती पिता महादेवा॥
एक दन्त दयावन्त चार भुजाधारी॥
मस्तक पर सिन्दूर सोहे मूषक वाहन साजे॥`,
      translation: "Victory to Ganesha! Son of Parvati and Shiva, with one tusk, four arms, and a mouse as His vehicle.",
      significance: "This is the most popular aarti sung during Ganesha worship ceremonies and festivals."
    },
    {
      id: 6,
      title: "Ganesha Vedic Mantra (From Rigveda)",
      sanskrit: `गणानां त्वा गणपतिं हवामहे॥
कविं कवीनामुपमश्रवस्तमम्॥
ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत॥
आ नः शृण्वन्नूतिभिः सीद सादनम्॥`,
      translation: "We invoke You, Lord of all beings, the wisest among sages, the Supreme Brahman. Hear us and bless us with prosperity.",
      significance: "This ancient Vedic hymn from the Rigveda is one of the earliest references to Lord Ganesha in Sanskrit literature."
    },
    {
      id: 7,
      title: "Ganesha Shodashopachara Puja Mantra",
      sanskrit: `ॐ गं गणपतये नमः आवाहयामि॥
ॐ गं गणपतये नमः आसनं समर्पयामि॥
ॐ गं गणपतये नमः पाद्यं समर्पयामि॥`,
      translation: "Invoking Ganesha, offering seat, water for feet, and other rituals in 16 steps.",
      significance: "These mantras are used during the traditional 16-step worship ritual of Lord Ganesha."
    },
    {
      id: 8,
      title: "Ganesha Kavacham (Armor Hymn)",
      sanskrit: `ॐ गणपतये अस्त्राय फट्॥
हृदयं पातु मे शम्भोः सुतो गणपतिर्हरिः॥
शिरो मे पातु विघ्नेशः कर्णौ पातु गजाननः॥`,
      translation: "May Ganesha protect my heart, head, and ears like divine armor.",
      significance: "This protective hymn is recited to invoke Ganesha's divine protection for the devotee's body and mind."
    },
    {
      id: 9,
      title: "Ganesha Suktam (From Yajurveda)",
      sanskrit: `त्वं नो अग्ने वरुणस्त्वं मित्रस्त्वमिन्द्र ओजसा॥
त्वं विष्णुरुतो रुद्रस्त्वं ब्रह्मा विभुर्भवः॥
त्वं त्वष्टा त्वं पूषासि त्वं गणेश्वरो विभुः॥`,
      translation: "You are Agni, Varuna, Vishnu, and Brahma—all gods united in Ganesha.",
      significance: "This Yajurveda hymn establishes Ganesha as the supreme deity encompassing all divine powers."
    },
    {
      id: 10,
      title: "Ganesha Bhujanga Stotra",
      sanskrit: `यो दूर्वांकुरैर्यजति स नित्यं सिद्धिमाप्नुयात्॥
यः पूजयेत् सुमनसा स विज्ञानी भवेन्नरः॥
यो मन्त्रमेतं पठते स गच्छेत् परमां गतिम्॥`,
      translation: "Whoever worships Ganesha with durva grass attains eternal wisdom and liberation.",
      significance: "This stotra emphasizes the importance of sincere devotion and proper offerings in Ganesha worship."
    },
    {
      id: 11,
      title: "Ganesha Purana Mantra",
      sanskrit: `नमस्ते स्तुत गणेश्वर सिद्धिं ददस्व मे सदा॥
त्वमेव शरणं देव त्वमेव शरणं मम॥
त्वमेव रक्षको नाथ त्वमेव विघ्ननाशनः॥`,
      translation: "O Ganesha, grant me success. You are my protector and destroyer of obstacles.",
      significance: "This prayer from the Ganesha Purana is a complete surrender to Lord Ganesha seeking his divine grace."
    },
    {
      id: 12,
      title: "Ganesha Mahimna Stotra",
      sanskrit: `विघ्नेश्वराय वरदाय सुरप्रियाय॥
सिद्धिप्रदाय सकलाय नमो नमस्ते॥
गौरीसुताय गणनाथ नमोऽस्तु तुभ्यम्॥`,
      translation: "Salutations to Ganesha, granter of boons, beloved of gods, and son of Gauri.",
      significance: "This stotra glorifies the various divine qualities and powers of Lord Ganesha."
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
    },
    {
      title: "Besan Laddu",
      ingredients: [
        "2 cups besan (gram flour)",
        "1 cup powdered sugar",
        "1/2 cup ghee",
        "1 tsp cardamom powder",
        "Chopped almonds and pistachios",
        "Raisins for garnish"
      ],
      instructions: [
        "Dry roast besan in a heavy pan until aromatic and golden.",
        "Add ghee and mix well, cook for 5 more minutes.",
        "Let it cool completely, then add powdered sugar and cardamom.",
        "Mix well and shape into round laddus while the mixture is warm.",
        "Garnish with chopped nuts and raisins.",
        "Store in airtight container."
      ],
      significance: "Laddu is considered auspicious and is commonly offered to Lord Ganesha during prayers."
    },
    {
      title: "Dry Fruits Meva",
      ingredients: [
        "1 cup mixed dry fruits (almonds, cashews, dates)",
        "1/2 cup khoya (mawa)",
        "1/4 cup sugar",
        "1/2 tsp cardamom powder",
        "Silver foil for decoration",
        "Ghee for binding"
      ],
      instructions: [
        "Chop all dry fruits into small pieces.",
        "Heat ghee in a pan and lightly fry the dry fruits.",
        "Add khoya and cook until it melts and combines.",
        "Add sugar and cardamom powder, mix well.",
        "Cook until mixture thickens and leaves the pan.",
        "Shape into small balls and decorate with silver foil."
      ],
      significance: "Meva represents prosperity and abundance, making it a perfect offering for Ganesha."
    },
    {
      title: "Rice Kheer",
      ingredients: [
        "1/2 cup basmati rice",
        "1 liter full-fat milk",
        "1/2 cup sugar",
        "1/4 tsp cardamom powder",
        "Chopped almonds and pistachios",
        "A pinch of saffron"
      ],
      instructions: [
        "Wash and soak rice for 30 minutes, then drain.",
        "Boil milk in a heavy-bottomed pan.",
        "Add rice to boiling milk and cook on low heat, stirring frequently.",
        "Cook until rice is completely soft and kheer thickens (45 minutes).",
        "Add sugar, cardamom, and saffron. Cook for 5 more minutes.",
        "Garnish with chopped nuts and serve warm or chilled."
      ],
      significance: "Kheer is a traditional dessert offered during festivals and symbolizes sweetness in life."
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
      description: "One of the two major Puranas dedicated entirely to Lord Ganesha, narrating his origin, forms, and stories.",
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
      description: "The second major Ganesha Purana, detailing eight incarnations of Lord Ganesha.",
      chapters: [
        "Vakratunda incarnation",
        "Ekadanta incarnation", 
        "Mahodara incarnation",
        "Gajanana incarnation"
      ],
      significance: "Describes various forms of Ganesha and their specific powers to overcome different types of obstacles."
    },
    {
      title: "Ganapati Atharvashirsha",
      author: "Atharva Veda",
      description: "A Vedic text (part of Atharvaveda) that praises Ganesha as the Supreme Brahman.",
      chapters: [
        "Om Namaste Ganapataye - Opening invocation",
        "Tvameva Pratyaksham Tattvamasi - Truth declarations",
        "Ekadantaya Vidmahe - Meditation verses"
      ],
      significance: "One of the most powerful Vedic hymns establishing Ganesha as the ultimate reality."
    },
    {
      title: "Skanda Purana (Ganesha Khanda)",
      author: "Sage Vyasa",
      description: "Contains the Ganesha Khanda, describing his birth and role among the gods.",
      chapters: [
        "Birth of Ganesha - Divine creation story",
        "Elephant head incarnation - Transformation narrative",
        "Lord of Obstacles - Divine appointment"
      ],
      significance: "Provides detailed accounts of Ganesha's origin and his appointment as the remover of obstacles."
    },
    {
      title: "Brahma Vaivarta Purana",
      author: "Various sages",
      description: "Includes stories of Ganesha's origin and blessings in the cosmic order.",
      chapters: [
        "Ganesha Janma Katha - Birth stories",
        "Divine blessings and powers",
        "Cosmic role and significance"
      ],
      significance: "Establishes Ganesha's role in creation and his divine powers in the cosmic hierarchy."
    },
    {
      title: "Shiva Purana",
      author: "Sage Vyasa",
      description: "Narrates Ganesha's birth, beheading, and revival by Lord Shiva.",
      chapters: [
        "Creation by Goddess Parvati",
        "Encounter with Lord Shiva",
        "Elephant head transformation"
      ],
      significance: "The most popular and widely known account of how Ganesha received his elephant head."
    },
    {
      title: "Narada Purana",
      author: "Sage Narada",
      description: "Contains hymns and stories dedicated to Ganesha with devotional practices.",
      chapters: [
        "Ganesha Sahasranama - Thousand names",
        "Devotional hymns and prayers",
        "Worship rituals and practices"
      ],
      significance: "Provides comprehensive devotional literature and worship guidelines for Ganesha devotees."
    },
    {
      title: "Rigveda Hymns to Ganapati",
      author: "Ancient Vedic Rishis",
      description: "Early references to Ganapati as the lord of hosts in the oldest Vedic text.",
      chapters: [
        "Gananam Tva Ganapatim - Primary hymn",
        "Invocation as lord of assemblies",
        "Vedic worship traditions"
      ],
      significance: "Contains the earliest known references to Ganesha in Sanskrit literature dating back thousands of years."
    },
    {
      title: "Modaka Upanishad",
      author: "Unknown sage",
      description: "A minor Upanishad devoted to Lord Ganesha's spiritual symbolism and philosophical teachings.",
      chapters: [
        "Modaka as divine knowledge",
        "Spiritual symbolism of Ganesha",
        "Path to self-realization"
      ],
      significance: "Explores the deeper philosophical and spiritual aspects of Ganesha worship and symbolism."
    },
    {
      title: "Uddhava Samhita",
      author: "Various spiritual masters",
      description: "Contains devotional guidance and mentions of Ganesha worship in spiritual practice.",
      chapters: [
        "Devotional practices and guidelines",
        "Ganesha worship in spiritual path",
        "Integration with other deities"
      ],
      significance: "Provides practical guidance for incorporating Ganesha worship into daily spiritual practice."
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
    },
    {
      title: "Ganesha Rahasya",
      author: "Tantric tradition",
      description: "Esoteric text revealing the mystical aspects and hidden powers of Lord Ganesha.",
      chapters: [
        "Secret mantras and yantras",
        "Tantric worship methods",
        "Mystical powers and siddhis"
      ],
      significance: "Reveals advanced spiritual practices and the esoteric dimensions of Ganesha worship."
    }
  ];

  const bhajansContent = [
    {
      title: "Ganpati Bappa Morya",
      artist: "Shankar Mahadevan",
      videoId: "xeXcq1SWgLw", // Replace with actual YouTube video ID
      description: "Classic Ganesh Chaturthi celebration song"
    },
    {
      title: "Sukh Karta Dukh Harta",
      artist: "Sadhana Sargam",
      videoId: "4ncAlDhIfTw", // Replace with actual YouTube video ID
      description: "Beautiful devotional song praising Lord Ganesha"
    },
    {
      title: "Om Gan Ganpataye Namo Namah",
      artist: "Suresh Wadkar",
      videoId: "On8RhqLwLvw", // Replace with actual YouTube video ID
      description: "Powerful mantra chanting for Lord Ganesha"
    },
    {
      title: "Vakratunda Mahakaya",
      artist: "Anup Jalota ",
      videoId: "kxxhO92X8ro", // Replace with actual YouTube video ID
      description: "Sacred shloka sung melodiously"
    },
    {
      title: "Gajanana Shri Ganaraya",
      artist: "Shreya Goshal",
      videoId: "AQRzNBNIJEk", // Replace with actual YouTube video ID
      description: "Energetic bhajan for Ganesha festivities"
    },
    {
      title: "Deva Shree Ganesha",
      artist: "Ajay Gogavale",
      videoId: "RYqJ5w-GrfM", // Replace with actual YouTube video ID
      description: "Modern Bollywood tribute to Lord Ganesha"
    },
    {
      title: "Morya Re",
      artist: "Shankar Mahadevan",
      videoId: "8jff2wz3Hpk", // Replace with actual YouTube video ID
      description: "Emotional Ganesha bhajan"
    },
    {
      title: "Gananayakaya",
      artist: "Suprabha KV",
      videoId: "ym4o5F8ncY0", // Replace with actual YouTube video ID
      description: "Sanskrit classical rendition"
    },
    {
      title: "Ghar Mein Padharo Gajanan Ji",
      artist: "Sohini Mishra",
      videoId: "nLUmRxc6140", // Replace with actual YouTube video ID
      description: "Welcoming Song"
    }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'mantras':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Mantras & Shlokas</h3>
            
            {/* Expanded Card Display */}
            {expandedMantra && (
              <div className="mb-8">
                {mantrasContent
                  .filter(mantra => mantra.id === expandedMantra)
                  .map((mantra) => (
                    <div 
                      key={`expanded-${mantra.id}`}
                      className="bg-gradient-to-br from-red-900/20 via-amber-900/10 to-yellow-900/20 backdrop-blur-xl rounded-3xl p-8 border border-golden/40 shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-2xl font-bold text-golden leading-tight">{mantra.title}</h4>
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
                        <div className="bg-golden/10 rounded-2xl p-6">
                          <p className="text-lg font-medium text-golden mb-3">Sanskrit:</p>
                          <p className="text-golden-light text-base leading-relaxed whitespace-pre-line font-mono">
                            {mantra.sanskrit}
                          </p>
                        </div>
                        <div className="bg-golden/5 rounded-2xl p-6">
                          <p className="text-lg font-medium text-golden mb-3">Translation:</p>
                          <p className="text-golden-light text-base leading-relaxed">{mantra.translation}</p>
                        </div>
                        <div className="bg-golden/5 rounded-2xl p-6">
                          <p className="text-lg font-medium text-golden mb-3">Significance:</p>
                          <p className="text-golden-light text-base leading-relaxed">{mantra.significance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mantrasContent.map((mantra) => (
                <div 
                  key={mantra.id} 
                  className={`bg-gradient-to-br from-red-900/15 via-amber-900/8 to-yellow-900/15 backdrop-blur-md rounded-2xl p-6 border border-golden/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform ${
                    expandedMantra === mantra.id ? 'ring-2 ring-golden/50 bg-golden/10' : ''
                  }`}
                  style={{ height: 'auto', minHeight: '180px' }}
                  onClick={() => setExpandedMantra(expandedMantra === mantra.id ? null : mantra.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-golden leading-tight pr-2">{mantra.title}</h4>
                    <div className="ml-2 flex-shrink-0">
                      <div className={`p-2 rounded-full transition-all duration-200 ${
                        expandedMantra === mantra.id 
                          ? 'bg-golden/30 rotate-180' 
                          : 'bg-golden/20 hover:bg-golden/30'
                      }`}>
                        <svg className="w-4 h-4 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-golden-light/80 text-sm leading-relaxed">
                    {expandedMantra === mantra.id 
                      ? 'Expanded above - Click to collapse' 
                      : 'Click to read the full mantra and its significance'
                    }
                  </p>
                  
                  {/* Preview of Sanskrit text for collapsed cards */}
                  {expandedMantra !== mantra.id && (
                    <div className="mt-4 p-3 bg-golden/5 rounded-lg">
                      <p className="text-golden-light/60 text-xs font-mono leading-relaxed line-clamp-2">
                        {mantra.sanskrit.split('\n')[0]}...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
      
      case 'bhajans':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Bhajans & Devotional Songs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bhajansContent.map((bhajan, index) => (
                <div key={index} className="bg-gradient-to-br from-red-900/15 via-amber-900/8 to-yellow-900/15 backdrop-blur-md rounded-2xl overflow-hidden border border-golden/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* YouTube Video Embed */}
                  <div className="aspect-video bg-black/50">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${bhajan.videoId}`}
                      title={bhajan.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-golden mb-2 leading-tight">{bhajan.title}</h4>
                    <p className="text-golden-light/80 text-sm mb-3">Artist: {bhajan.artist}</p>
                    <p className="text-golden-light text-sm leading-relaxed">{bhajan.description}</p>
                    
                    {/* Play Button Overlay */}
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-golden/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="text-golden-light/70 text-xs">Click video to play</span>
                    </div>
                  </div>
                </div>
              ))}
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
