import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const CulturalLearningPage = () => {
  const [activeCategory, setActiveCategory] = useState('mantras');
  const [expandedMantra, setExpandedMantra] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bhajanSearchTerm, setBhajanSearchTerm] = useState('');
  const [currentRecipeStart, setCurrentRecipeStart] = useState(0);

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
      significance: "This is from the sacred Ganesha Atharvashirsha, one of the most powerful Vedic hymns to Lord Ganesha.",
      image: "Hero/ganesh.svg",
      source: "Atharva Veda"
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
      significance: "These twelve sacred names of Ganesha provide protection and success in all endeavors.",
      image: "Hero/om.svg",
      source: "Ganesha Purana"
    },
    {
      id: 3,
      title: "Ganesha Pancharatnam (Adi Shankaracharya's Hymn)",
      sanskrit: `मुदाकरात्तमोदकं सदा विमुक्तिसाधकं॥
कलाधरावतंसकं विलासिलोकरक्षकम्॥
अनायकैकनायकं विनाशितेभदैत्यकम्॥
नताशुभाशु नाशकं नमामि तं विनायकम्॥`,
      translation: "I bow to Vinayaka, who holds the modak, grants liberation, wears the moon, destroys demons, and removes sorrows.",
      significance: "Composed by Adi Shankaracharya, this hymn is considered one of the most beautiful poems dedicated to Lord Ganesha.",
      image: "Hero/modak.png",
      source: "Adi Shankaracharya"
    },
    {
      id: 4,
      title: "Ganesha Sahasranama (Selected 8 Lines)",
      sanskrit: `ॐ गणाधिपाय नमः॥ ॐ गणेश्वराय नमः॥
ॐ गजाननाय नमः॥ ॐ एकदन्ताय नमः॥
ॐ हेरम्बाय नमः॥ ॐ लम्बोदराय नमः॥
ॐ सिद्धिदात्रे नमः॥ ॐ विघ्नहन्त्रे नमः॥`,
      translation: "Salutations to Ganesha as Ganadhipa, Gajanana, Lambodara, and the bestower of Siddhi.",
      significance: "These are sacred names from the thousand names of Ganesha, each carrying special spiritual power.",
      image: "Hero/diya.png",
      source: "Various Puranas"
    },
    {
      id: 5,
      title: "Ganesha Mangala Aarti",
      sanskrit: `जय गणेश जय गणेश जय गणेश देवा॥
माता जाकी पार्वती पिता महादेवा॥
एक दन्त दयावन्त चार भुजाधारी॥
मस्तक पर सिन्दूर सोहे मूषक वाहन साजे॥`,
      translation: "Victory to Ganesha! Son of Parvati and Shiva, with one tusk, four arms, and a mouse as His vehicle.",
      significance: "This is the most popular aarti sung during Ganesha worship ceremonies and festivals.",
      image: "Hero/flower.png",
      source: "Traditional Aarti"
    },
    {
      id: 6,
      title: "Ganesha Vedic Mantra (From Rigveda)",
      sanskrit: `गणानां त्वा गणपतिं हवामहे॥
कविं कवीनामुपमश्रवस्तमम्॥
ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत॥
आ नः शृण्वन्नूतिभिः सीद सादनम्॥`,
      translation: "We invoke You, Lord of all beings, the wisest among sages, the Supreme Brahman. Hear us and bless us with prosperity.",
      significance: "This ancient Vedic hymn from the Rigveda is one of the earliest references to Lord Ganesha in Sanskrit literature.",
      image: "Hero/ganesh.svg",
      source: "Rigveda"
    },
    {
      id: 7,
      title: "Ganesha Shodashopachara Puja Mantra",
      sanskrit: `ॐ गं गणपतये नमः आवाहयामि॥
ॐ गं गणपतये नमः आसनं समर्पयामि॥
ॐ गं गणपतये नमः पाद्यं समर्पयामि॥`,
      translation: "Invoking Ganesha, offering seat, water for feet, and other rituals in 16 steps.",
      significance: "These mantras are used during the traditional 16-step worship ritual of Lord Ganesha.",
      image: "Hero/diya.png",
      source: "Tantric Traditions"
    },
    {
      id: 8,
      title: "Ganesha Kavacham (Armor Hymn)",
      sanskrit: `ॐ गणपतये अस्त्राय फट्॥
हृदयं पातु मे शम्भोः सुतो गणपतिर्हरिः॥
शिरो मे पातु विघ्नेशः कर्णौ पातु गजाननः॥`,
      translation: "May Ganesha protect my heart, head, and ears like divine armor.",
      significance: "This protective hymn is recited to invoke Ganesha's divine protection for the devotee's body and mind.",
      image: "Hero/om.svg",
      source: "Tantric Literature"
    },
    {
      id: 9,
      title: "Ganesha Suktam (From Yajurveda)",
      sanskrit: `त्वं नो अग्ने वरुणस्त्वं मित्रस्त्वमिन्द्र ओजसा॥
त्वं विष्णुरुतो रुद्रस्त्वं ब्रह्मा विभुर्भवः॥
त्वं त्वष्टा त्वं पूषासि त्वं गणेश्वरो विभुः॥`,
      translation: "You are Agni, Varuna, Vishnu, and Brahma—all gods united in Ganesha.",
      significance: "This Yajurveda hymn establishes Ganesha as the supreme deity encompassing all divine powers.",
      image: "Hero/flower.png",
      source: "Yajurveda"
    },
    {
      id: 10,
      title: "Ganesha Bhujanga Stotra",
      sanskrit: `यो दूर्वांकुरैर्यजति स नित्यं सिद्धिमाप्नुयात्॥
यः पूजयेत् सुमनसा स विज्ञानी भवेन्नरः॥
यो मन्त्रमेतं पठते स गच्छेत् परमां गतिम्॥`,
      translation: "Whoever worships Ganesha with durva grass attains eternal wisdom and liberation.",
      significance: "This stotra emphasizes the importance of sincere devotion and proper offerings in Ganesha worship.",
      image: "Hero/modak.png",
      source: "Classical Stotra"
    },
    {
      id: 11,
      title: "Ganesha Purana Mantra",
      sanskrit: `नमस्ते स्तुत गणेश्वर सिद्धिं ददस्व मे सदा॥
त्वमेव शरणं देव त्वमेव शरणं मम॥
त्वमेव रक्षको नाथ त्वमेव विघ्ननाशनः॥`,
      translation: "O Ganesha, grant me success. You are my protector and destroyer of obstacles.",
      significance: "This prayer from the Ganesha Purana is a complete surrender to Lord Ganesha seeking his divine grace.",
      image: "Hero/ganesh.svg",
      source: "Ganesha Purana"
    },
    {
      id: 12,
      title: "Ganesha Mahimna Stotra",
      sanskrit: `विघ्नेश्वराय वरदाय सुरप्रियाय॥
सिद्धिप्रदाय सकलाय नमो नमस्ते॥
गौरीसुताय गणनाथ नमोऽस्तु तुभ्यम्॥`,
      translation: "Salutations to Ganesha, granter of boons, beloved of gods, and son of Gauri.",
      significance: "This stotra glorifies the various divine qualities and powers of Lord Ganesha.",
      image: "Hero/diya.png",
      source: "Devotional Literature"
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
      significance: "Modak is Lord Ganesha's favorite sweet and is essential for Ganesh Chaturthi celebrations.",
      videoId: "0tJTqOaaZII"
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
      significance: "A traditional Maharashtrian sweet bread offered to Lord Ganesha.",
      videoId: "oTl_DYNAP0o",
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
      significance: "Laddu is considered auspicious and is commonly offered to Lord Ganesha during prayers.",
      videoId: "u50h9LRhVB4",
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
      significance: "Meva represents prosperity and abundance, making it a perfect offering for Ganesha.",
      videoId: "_2pgPggIVbk",
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
      significance: "Kheer is a traditional dessert offered during festivals and symbolizes sweetness in life.",
      videoId: "k6i2t2OPO-8"
    },
    {
      title: "Coconut Barfi",
      ingredients: [
        "2 cups fresh grated coconut",
        "1 cup sugar",
        "1/2 cup milk",
        "1/4 tsp cardamom powder",
        "1 tbsp ghee",
        "Chopped pistachios for garnish"
      ],
      instructions: [
        "Heat ghee in a heavy-bottomed pan.",
        "Add grated coconut and sauté for 3-4 minutes.",
        "Add milk and cook until coconut absorbs the milk.",
        "Add sugar and cook while stirring continuously.",
        "Add cardamom powder and cook until mixture thickens.",
        "Pour into greased tray, garnish with pistachios, and cut into squares."
      ],
      significance: "Coconut barfi is a pure and sattvic sweet ideal for offering to Lord Ganesha.",
      videoId: "lZP2ydT3hQw",
    },
    {
      title: "Rava Sheera",
      ingredients: [
        "1 cup semolina (rava)",
        "1 cup sugar",
        "2 cups water",
        "1/4 cup ghee",
        "1/4 tsp cardamom powder",
        "10-12 cashews and raisins"
      ],
      instructions: [
        "Dry roast rava in a pan until light golden.",
        "Heat ghee in another pan, fry cashews and raisins.",
        "Add roasted rava to ghee and mix well.",
        "Boil water with sugar, add to rava mixture carefully.",
        "Stir continuously to avoid lumps.",
        "Add cardamom powder and cook until thick."
      ],
      significance: "Sheera is considered a blessed prasadam and is commonly offered during Ganesha festivals.",
      videoId: "meyqEbT_HkQ"
    },
    {
      title: "Til Gur Laddu",
      ingredients: [
        "1 cup sesame seeds (til)",
        "1 cup jaggery (gur)",
        "1/4 tsp cardamom powder",
        "2 tbsp ghee",
        "1 tbsp chopped almonds",
        "Pinch of salt"
      ],
      instructions: [
        "Dry roast sesame seeds until they splutter.",
        "Heat jaggery in a pan until it melts completely.",
        "Add roasted sesame seeds and mix well.",
        "Add cardamom powder and chopped almonds.",
        "Let it cool slightly and shape into laddus while warm.",
        "Store in airtight container once cooled."
      ],
      significance: "Til Gur laddus are especially offered during Makar Sankranti and symbolize prosperity.",
      videoId: "b5bd57OPBZA"
    },
    {
      title: "Banana Halwa",
      ingredients: [
        "4 ripe bananas",
        "1/2 cup sugar",
        "1/4 cup ghee",
        "1/4 cup milk",
        "1/4 tsp cardamom powder",
        "Chopped dry fruits for garnish"
      ],
      instructions: [
        "Mash bananas into a smooth paste.",
        "Heat ghee in a heavy-bottomed pan.",
        "Add mashed bananas and cook on medium heat.",
        "Add milk and sugar, mix well.",
        "Cook until mixture thickens and leaves the pan.",
        "Garnish with dry fruits and serve warm."
      ],
      significance: "Banana halwa is a simple and nutritious offering that pleases Lord Ganesha.",
      videoId: "z2k6jKaevWc"
    },
    {
      title: "Shrikhand",
      ingredients: [
        "2 cups hung curd (chakka)",
        "1/2 cup powdered sugar",
        "1/4 tsp cardamom powder",
        "Pinch of saffron",
        "2 tbsp warm milk",
        "Chopped pistachios and almonds"
      ],
      instructions: [
        "Soak saffron in warm milk for 10 minutes.",
        "Mix hung curd with powdered sugar until smooth.",
        "Add cardamom powder and saffron milk.",
        "Whisk until creamy and well combined.",
        "Chill in refrigerator for 2 hours.",
        "Garnish with chopped nuts before serving."
      ],
      significance: "Shrikhand is a cooling and divine dessert perfect for summer offerings to Ganesha.",
      videoId: "kp9XGxxPvB8"
    },
    {
      title: "Peda",
      ingredients: [
        "2 cups khoya (mawa)",
        "1/2 cup powdered sugar",
        "1/4 tsp cardamom powder",
        "1 tbsp ghee",
        "Chopped pistachios",
        "Silver varq for decoration"
      ],
      instructions: [
        "Heat ghee in a heavy-bottomed pan.",
        "Add khoya and cook on low heat, stirring continuously.",
        "Cook until khoya becomes slightly brown and aromatic.",
        "Add powdered sugar and cardamom powder.",
        "Mix well and cook until mixture thickens.",
        "Shape into pedas and decorate with nuts and silver varq."
      ],
      significance: "Peda is a traditional milk sweet that symbolizes purity and devotion to Lord Ganesha.",
      videoId: "QDUdY_HKRsU"
    },
    {
      title: "Malpua",
      ingredients: [
        "1 cup all-purpose flour",
        "1/2 cup milk",
        "1/4 cup sugar",
        "1/4 tsp cardamom powder",
        "Ghee for frying",
        "Sugar syrup for soaking"
      ],
      instructions: [
        "Mix flour, milk, and sugar to make smooth batter.",
        "Add cardamom powder and let batter rest for 30 minutes.",
        "Heat ghee in a pan for deep frying.",
        "Pour batter to make small pancakes.",
        "Fry until golden brown on both sides.",
        "Soak in sugar syrup and serve warm."
      ],
      significance: "Malpua is a festive sweet that brings joy and is loved by Lord Ganesha during celebrations.",
      videoId: "l4Qxt51Uvk4"
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
      significance: "This festival symbolizes the cycle of creation and dissolution in Hindu philosophy.",
      videoId: "xeXcq1SWgLw",
      image: "Hero/ganesh.svg"
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
      significance: "This monthly observance helps devotees overcome obstacles and gain Ganesha's blessings.",
      videoId: "4ncAlDhIfTw",
      image: "Hero/diya.png"
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
      significance: "As the remover of obstacles, Ganesha's blessings ensure successful completion of any endeavor.",
      videoId: "On8RhqLwLvw",
      image: "Hero/om.svg"
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
      significance: "One of the most comprehensive texts about Lord Ganesha's divine nature and worship methods.",
      videoId: "kxxhO92X8ro",
      image: "Hero/ganesh.svg"
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
      significance: "Describes various forms of Ganesha and their specific powers to overcome different types of obstacles.",
      videoId: "AQRzNBNIJEk",
      image: "Hero/modak.png"
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
      significance: "One of the most powerful Vedic hymns establishing Ganesha as the ultimate reality.",
      videoId: "RYqJ5w-GrfM",
      image: "Hero/om.svg"
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
      significance: "Provides detailed accounts of Ganesha's origin and his appointment as the remover of obstacles.",
      videoId: "8jff2wz3Hpk",
      image: "Hero/flower.png"
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
      significance: "Establishes Ganesha's role in creation and his divine powers in the cosmic hierarchy.",
      videoId: "ym4o5F8ncY0",
      image: "Hero/diya.png"
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
      significance: "The most popular and widely known account of how Ganesha received his elephant head.",
      videoId: "nLUmRxc6140",
      image: "Hero/ganesh.svg"
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
      significance: "Provides comprehensive devotional literature and worship guidelines for Ganesha devotees.",
      videoId: "xeXcq1SWgLw",
      image: "Hero/modak.png"
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
      significance: "Contains the earliest known references to Ganesha in Sanskrit literature dating back thousands of years.",
      videoId: "4ncAlDhIfTw",
      image: "Hero/om.svg"
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
      significance: "Explores the deeper philosophical and spiritual aspects of Ganesha worship and symbolism.",
      videoId: "On8RhqLwLvw",
      image: "Hero/flower.png"
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
      significance: "Provides practical guidance for incorporating Ganesha worship into daily spiritual practice.",
      videoId: "kxxhO92X8ro",
      image: "Hero/diya.png"
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
      significance: "Chanting these sacred names is believed to grant all wishes and remove all obstacles.",
      videoId: "AQRzNBNIJEk",
      image: "Hero/ganesh.svg"
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
      significance: "Reveals advanced spiritual practices and the esoteric dimensions of Ganesha worship.",
      videoId: "RYqJ5w-GrfM",
      image: "Hero/modak.png"
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

  // Filter function for search
  const filteredRecipes = recipesContent.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get 4 random recipes or filtered recipes
  const getDisplayedRecipes = () => {
    if (searchTerm) {
      return filteredRecipes; // Show all filtered results when searching
    }
    
    // Shuffle and get 4 random recipes
    const shuffled = [...recipesContent];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 4);
  };

  const [displayedRecipes, setDisplayedRecipes] = useState(getDisplayedRecipes());

  // Refresh recipes function
  const refreshRecipes = () => {
    if (!searchTerm) {
      setDisplayedRecipes(getDisplayedRecipes());
    }
  };

  // Update displayed recipes when search term changes
  React.useEffect(() => {
    if (searchTerm) {
      setDisplayedRecipes(filteredRecipes);
    } else {
      setDisplayedRecipes(getDisplayedRecipes());
    }
  }, [searchTerm]);

  // Shuffle function for arrays
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter function for bhajans search
  const filteredBhajans = bhajansContent.filter(bhajan =>
    bhajan.title.toLowerCase().includes(bhajanSearchTerm.toLowerCase()) ||
    bhajan.artist.toLowerCase().includes(bhajanSearchTerm.toLowerCase()) ||
    bhajan.description.toLowerCase().includes(bhajanSearchTerm.toLowerCase())
  );

  // Get displayed bhajans (shuffled or filtered)
  const getDisplayedBhajans = () => {
    if (bhajanSearchTerm) {
      return filteredBhajans;
    }
    return shuffleArray(bhajansContent);
  };

  // Get displayed books (shuffled)
  const getDisplayedBooks = () => {
    return shuffleArray(booksContent);
  };

  // State for displayed content - automatically shuffled on load
  const [displayedBhajans, setDisplayedBhajans] = useState(() => shuffleArray(bhajansContent));
  const [displayedBooks, setDisplayedBooks] = useState(() => shuffleArray(booksContent));

  // Update displayed bhajans when search term changes
  React.useEffect(() => {
    if (bhajanSearchTerm) {
      setDisplayedBhajans(filteredBhajans);
    } else {
      setDisplayedBhajans(shuffleArray(bhajansContent));
    }
  }, [bhajanSearchTerm]);

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
                      className="relative overflow-hidden rounded-3xl shadow-2xl"
                      style={{ backgroundColor: 'rgb(21, 21, 21)' }}
                    >
                      {/* Background overlay matching homepage */}
                      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                        {/* Mandala Pattern Background */}
                        <div className="absolute inset-0 opacity-20">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
                            <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative z-10 p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img 
                                src={`/${mantra.image}`} 
                                alt="Sacred Symbol" 
                                className="w-full h-full object-contain rounded-lg filter drop-shadow-lg"
                              />
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-golden leading-tight">{mantra.title}</h4>
                              <p className="text-golden-light/80 text-sm mt-1">Source: {mantra.source}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mantrasContent.map((mantra) => (
                <div 
                  key={mantra.id} 
                  className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform ${
                    expandedMantra === mantra.id ? 'ring-2 ring-golden/50' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'rgb(21, 21, 21)',
                    minHeight: '200px' 
                  }}
                  onClick={() => setExpandedMantra(expandedMantra === mantra.id ? null : mantra.id)}
                >
                  {/* Background overlay matching homepage */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.2)' }}>
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-golden"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-golden-light"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 flex-shrink-0">
                          <img 
                            src={`/${mantra.image}`} 
                            alt="Sacred Symbol" 
                            className="w-full h-full object-contain rounded-lg filter drop-shadow-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-golden leading-tight pr-2">{mantra.title}</h4>
                          <p className="text-golden-light/70 text-xs mt-1">{mantra.source}</p>
                        </div>
                      </div>
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
                      <div className="mt-4 p-3 bg-golden/5 backdrop-blur-sm rounded-lg border border-golden/10">
                        <p className="text-golden-light/60 text-xs font-mono leading-relaxed line-clamp-2">
                          {mantra.sanskrit.split('\n')[0]}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'recipes':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Traditional Recipes</h3>
            
            {/* Search Bar with Refresh Button */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative max-w-2xl w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-golden/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by recipe name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-golden/30 rounded-full bg-black/30 backdrop-blur-md text-golden placeholder-golden/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/50"
                />
                {/* Clear button (X) */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-golden/20 rounded-r-full transition-colors duration-200"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5 text-golden/60 hover:text-golden transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Refresh Button */}
              {!searchTerm && (
                <button
                  onClick={refreshRecipes}
                  className="p-3 rounded-full bg-golden/20 hover:bg-golden/60 transition-all duration-300 transform hover:scale-110 hover:rotate-180 border border-golden/30 hover:border-golden/70 hover:shadow-lg hover:shadow-golden/30 cursor-pointer"
                  title="Refresh recipes"
                >
                  <svg className="w-5 h-5 text-golden hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>

            {/* Recipe Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {displayedRecipes.map((recipe, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-102"
                  style={{ backgroundColor: 'rgb(21, 21, 21)' }}
                >
                  {/* Background overlay matching homepage */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                    {/* Mandala Pattern Background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
                        <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Video Section */}
                    <div className="aspect-video bg-black/50 rounded-t-3xl overflow-hidden">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${recipe.videoId}`}
                        title={recipe.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <h4 className="text-2xl font-bold text-golden">{recipe.title}</h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-4 border border-golden/20">
                          <h5 className="text-lg font-semibold text-golden mb-3">Ingredients:</h5>
                          <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, idx) => (
                              <li key={idx} className="text-golden-light flex items-center text-sm">
                                <span className="text-golden mr-2">•</span>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-4 border border-golden/10">
                          <h5 className="text-lg font-semibold text-golden mb-3">Instructions:</h5>
                          <ol className="space-y-2 max-h-48 overflow-y-auto">
                            {recipe.instructions.slice(0, 4).map((step, idx) => (
                              <li key={idx} className="text-golden-light text-sm">
                                <span className="text-golden font-semibold mr-2">{idx + 1}.</span>
                                {step}
                              </li>
                            ))}
                            {recipe.instructions.length > 4 && (
                              <li className="text-golden-light/70 text-xs italic">
                                +{recipe.instructions.length - 4} more steps...
                              </li>
                            )}
                          </ol>
                        </div>
                      </div>
                      
                      <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-4 border border-golden/10">
                        <p className="text-md font-medium text-golden mb-2">Significance:</p>
                        <p className="text-golden-light text-sm">{recipe.significance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {displayedRecipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-golden-light text-lg">No recipes found matching your search.</p>
              </div>
            )}
          </div>
        );
      
      case 'traditions':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Traditions & Rituals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {traditionsContent.map((tradition, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgb(21, 21, 21)' }}
                >
                  {/* Background overlay matching homepage */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                    {/* Mandala Pattern Background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
                        <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Image Section instead of Video */}
                    <div className="aspect-video bg-gradient-to-br from-golden/20 to-golden/10 rounded-t-3xl overflow-hidden flex items-center justify-center">
                      <div className="text-center">
                        <img 
                          src={`/${tradition.image}`} 
                          alt={tradition.title} 
                          className="w-24 h-24 object-contain mx-auto mb-4 filter drop-shadow-2xl"
                        />
                        <h5 className="text-golden font-semibold text-lg">{tradition.title}</h5>
                        <p className="text-golden-light/80 text-sm mt-2">Sacred Tradition</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 flex-shrink-0">
                          <img 
                            src={`/${tradition.image}`} 
                            alt="Tradition Symbol" 
                            className="w-full h-full object-contain rounded-lg filter drop-shadow-lg"
                          />
                        </div>
                        <h4 className="text-xl font-bold text-golden leading-tight">{tradition.title}</h4>
                      </div>
                      
                      <p className="text-golden-light mb-4 text-sm leading-relaxed">{tradition.description}</p>
                      
                      <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-4 border border-golden/20 mb-4">
                        <h5 className="text-md font-semibold text-golden mb-3">Rituals:</h5>
                        <ul className="space-y-2">
                          {tradition.rituals.map((ritual, idx) => (
                            <li key={idx} className="text-golden-light flex items-start text-sm">
                              <span className="text-golden mr-2 mt-1">🔸</span>
                              {ritual}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-4 border border-golden/10">
                        <p className="text-md font-medium text-golden mb-2">Significance:</p>
                        <p className="text-golden-light text-sm leading-relaxed">{tradition.significance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'books':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Books & Scriptures</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedBooks.map((book, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgb(21, 21, 21)' }}
                >
                  {/* Background overlay matching homepage */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                    {/* Mandala Pattern Background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
                        <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Image Section instead of Video */}
                    <div className="aspect-video bg-gradient-to-br from-golden/20 to-golden/10 rounded-t-3xl overflow-hidden flex items-center justify-center">
                      <div className="text-center">
                        <h5 className="text-golden font-semibold text-2xl mb-2">{book.title}</h5>
                        <p className="text-golden-light/80 text-lg">Sacred Scripture</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-golden leading-tight">{book.title}</h4>
                      </div>
                      
                      <p className="text-golden-light/80 mb-3 text-xs">Author: {book.author}</p>
                      <p className="text-golden-light mb-4 text-sm leading-relaxed">{book.description}</p>
                      
                      <div className="bg-golden/10 backdrop-blur-md rounded-2xl p-4 border border-golden/20 mb-4">
                        <h5 className="text-md font-semibold text-golden mb-3">Key Chapters/Sections:</h5>
                        <ul className="space-y-2 max-h-32 overflow-y-auto">
                          {book.chapters.map((chapter, idx) => (
                            <li key={idx} className="text-golden-light flex items-start text-sm">
                              <span className="text-golden mr-2 mt-1">📖</span>
                              {chapter}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-golden/5 backdrop-blur-md rounded-2xl p-4 border border-golden/10">
                        <p className="text-md font-medium text-golden mb-2">Significance:</p>
                        <p className="text-golden-light text-sm leading-relaxed">{book.significance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'bhajans':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-golden mb-6">Sacred Bhajans & Devotional Songs</h3>
            
            {/* Search Bar */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative max-w-2xl w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-golden/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search bhajans by title, artist..."
                  value={bhajanSearchTerm}
                  onChange={(e) => setBhajanSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-golden/30 rounded-full bg-black/30 backdrop-blur-md text-golden placeholder-golden/60 focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/50"
                />
                {/* Clear button (X) */}
                {bhajanSearchTerm && (
                  <button
                    onClick={() => setBhajanSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-golden/20 rounded-r-full transition-colors duration-200"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5 text-golden/60 hover:text-golden transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBhajans.map((bhajan, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgb(21, 21, 21)' }}
                >
                  {/* Background overlay matching homepage */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
                    {/* Mandala Pattern Background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-light"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden"/>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-golden-dark"/>
                        <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.2" className="text-golden"/>
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* YouTube Video Embed */}
                    <div className="aspect-video bg-black/50 rounded-t-3xl overflow-hidden">
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
                      <p className="text-golden-light text-sm leading-relaxed mb-4">{bhajan.description}</p>
                      
                      {/* Play Button Overlay */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-golden/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-golden" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <span className="text-golden-light/70 text-xs">Click video to play</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {displayedBhajans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-golden-light text-lg">No bhajans found matching your search.</p>
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
