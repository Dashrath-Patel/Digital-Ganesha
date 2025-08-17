import mongoose from 'mongoose'
import dotenv from 'dotenv'
import CulturalContent from './models/CulturalContent.js'
import connectDB from './config/database.js'

// Load environment variables
dotenv.config()

// Static data from the Cultural Learning Page
const mantrasData = [
  {
    title: "Ganesha Atharvashirsha (Opening Verses)",
    category: "mantras",
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
    source: "Atharva Veda",
    featured: true,
    order: 1,
    tags: ["atharvashirsha", "vedic", "powerful", "supreme"]
  },
  {
    title: "Ganesha Dwadasanama Stotra (12 Names of Ganesha)",
    category: "mantras",
    sanskrit: `सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः॥
लम्बोदरश्च विकटो विघ्ननाशो विनायकः॥
धूम्रकेतुर्गणाध्यक्षो भालचन्द्रो गजाननः॥
द्वादशैतानि नामानि यः पठेच्छृणुयादपि॥
विद्यारम्भे विवाहे च प्रवेशे निर्गमे तथा॥
संग्रामे संकटे चैव विघ्नस्तस्य न जायते॥`,
    translation: "Sumukhah, Ekadantah, Kapilo, Gajakarnakah, Lambodarah, Vikato, Vighnanasho, Vinayakah, Dhoomraketuh, Ganadhyaksho, Bhalachandro, Gajanana. Whoever recites these 12 names avoids obstacles in education, marriage, and battles.",
    significance: "These twelve sacred names of Ganesha provide protection and success in all endeavors.",
    image: "Hero/om.svg",
    source: "Ganesha Purana",
    featured: true,
    order: 2,
    tags: ["twelve names", "protection", "success", "purana"]
  },
  {
    title: "Ganesha Pancharatnam (Adi Shankaracharya's Hymn)",
    category: "mantras",
    sanskrit: `मुदाकरात्तमोदकं सदा विमुक्तिसाधकं॥
कलाधरावतंसकं विलासिलोकरक्षकम्॥
अनायकैकनायकं विनाशितेभदैत्यकम्॥
नताशुभाशु नाशकं नमामि तं विनायकम्॥`,
    translation: "I bow to Vinayaka, who holds the modak, grants liberation, wears the moon, destroys demons, and removes sorrows.",
    significance: "Composed by Adi Shankaracharya, this hymn is considered one of the most beautiful poems dedicated to Lord Ganesha.",
    image: "Hero/modak.png",
    source: "Adi Shankaracharya",
    featured: true,
    order: 3,
    tags: ["shankaracharya", "pancharatnam", "liberation", "beautiful"]
  },
  {
    title: "Ganesha Sahasranama (Selected 8 Lines)",
    category: "mantras",
    sanskrit: `ॐ गणाधिपाय नमः॥ ॐ गणेश्वराय नमः॥
ॐ गजाननाय नमः॥ ॐ एकदन्ताय नमः॥
ॐ हेरम्बाय नमः॥ ॐ लम्बोदराय नमः॥
ॐ सिद्धिदात्रे नमः॥ ॐ विघ्नहन्त्रे नमः॥`,
    translation: "Salutations to Ganesha as Ganadhipa, Gajanana, Lambodara, and the bestower of Siddhi.",
    significance: "These are sacred names from the thousand names of Ganesha, each carrying special spiritual power.",
    image: "Hero/diya.png",
    source: "Various Puranas",
    order: 4,
    tags: ["sahasranama", "thousand names", "spiritual power", "siddhi"]
  },
  {
    title: "Ganesha Mangala Aarti",
    category: "mantras",
    sanskrit: `जय गणेश जय गणेश जय गणेश देवा॥
माता जाकी पार्वती पिता महादेवा॥
एक दन्त दयावन्त चार भुजाधारी॥
मस्तक पर सिन्दूर सोहे मूषक वाहन साजे॥`,
    translation: "Victory to Ganesha! Son of Parvati and Shiva, with one tusk, four arms, and a mouse as His vehicle.",
    significance: "This is the most popular aarti sung during Ganesha worship ceremonies and festivals.",
    image: "Hero/flower.png",
    source: "Traditional Aarti",
    featured: true,
    order: 5,
    tags: ["aarti", "popular", "worship", "festival"]
  },
  {
    title: "Ganesha Vedic Mantra (From Rigveda)",
    category: "mantras",
    sanskrit: `गणानां त्वा गणपतिं हवामहे॥
कविं कवीनामुपमश्रवस्तमम्॥
ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत॥
आ नः शृण्वन्नूतिभिः सीद सादनम्॥`,
    translation: "We invoke You, Lord of all beings, the wisest among sages, the Supreme Brahman. Hear us and bless us with prosperity.",
    significance: "This ancient Vedic hymn from the Rigveda is one of the earliest references to Lord Ganesha in Sanskrit literature.",
    image: "Hero/ganesh.svg",
    source: "Rigveda",
    featured: true,
    order: 6,
    tags: ["rigveda", "ancient", "earliest", "vedic"]
  },
  {
    title: "Ganesha Gayatri Mantra",
    category: "mantras",
    sanskrit: `ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि।
तन्नो दन्ति प्रचोदयात्॥`,
    translation: "Om, we meditate on the One-Tusked Lord, we contemplate the Curved-Trunk One. May that Ganesha inspire and illumine our mind and understanding.",
    significance: "This Gayatri mantra dedicated to Ganesha enhances wisdom and removes mental obstacles.",
    image: "Hero/om.svg",
    source: "Tantric Tradition",
    featured: true,
    order: 7,
    tags: ["gayatri", "wisdom", "mental", "illumination"]
  },
  {
    title: "Ganesha Stotra by Mudgala Purana",
    category: "mantras",
    sanskrit: `गजानन भूतगणादि सेवितं कपित्थ जम्बू फल चारु भक्षणम्।
उमासुतं शोकविनाशकारकं नमामि विघ्नेश्वर पादपङ्कजम्॥`,
    translation: "I bow to the lotus feet of Ganesha, who has an elephant face, is served by Bhootaganas, enjoys wood apple and jamun fruits, is the son of Uma, and destroys all sorrows.",
    significance: "A beautiful verse from Mudgala Purana highlighting Ganesha's divine qualities and his power to remove sorrows.",
    image: "Hero/flower.png",
    source: "Mudgala Purana",
    featured: false,
    order: 8,
    tags: ["mudgala", "elephant face", "sorrow removal", "divine qualities"]
  },
  {
    title: "Ganesha Beej Mantra",
    category: "mantras",
    sanskrit: `ॐ गं गणपतये नमः॥`,
    translation: "Om Gam Ganapataye Namaha - Salutations to Lord Ganesha with the seed sound 'Gam'.",
    significance: "The most powerful seed mantra of Ganesha. The sound 'Gam' represents the primordial vibration of Lord Ganesha and removes all obstacles instantly.",
    image: "Hero/ganesh.svg",
    source: "Tantric Texts",
    featured: true,
    order: 9,
    tags: ["beej mantra", "seed sound", "powerful", "instant results"]
  }
]

const recipesData = [
  {
    title: "Modak (Traditional)",
    category: "recipes",
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
    videoId: "0tJTqOaaZII",
    featured: true,
    order: 1,
    tags: ["modak", "favorite", "traditional", "ganesh chaturthi"]
  },
  {
    title: "Puran Poli",
    category: "recipes",
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
    videoId: "puran_poli_demo",
    featured: false,
    order: 2,
    tags: ["puran poli", "maharashtrian", "sweet bread", "traditional"]
  },
  {
    title: "Ukadiche Modak (Steamed Modak)",
    category: "recipes",
    ingredients: [
      "2 cups rice flour",
      "1 cup fresh grated coconut",
      "3/4 cup jaggery",
      "1/2 tsp cardamom powder",
      "1 tbsp ghee",
      "Salt to taste"
    ],
    instructions: [
      "Boil water with salt and 1 tsp ghee.",
      "Gradually add rice flour while stirring to avoid lumps.",
      "Cook until dough forms, cover and cool.",
      "For filling: Cook coconut with jaggery until thick.",
      "Add cardamom powder and cool.",
      "Shape modaks and steam for 12-15 minutes."
    ],
    significance: "Traditional steamed version of modaks, considered more authentic and healthy.",
    videoId: "ukadiche_modak_demo",
    featured: true,
    order: 3,
    tags: ["ukadiche", "steamed", "authentic", "healthy"]
  },
  {
    title: "Rava Ladoo",
    category: "recipes",
    ingredients: [
      "2 cups semolina (rava)",
      "1 cup ghee",
      "1 cup powdered sugar",
      "1/2 cup mixed nuts",
      "1/2 tsp cardamom powder",
      "2 tbsp milk"
    ],
    instructions: [
      "Roast semolina in ghee until golden.",
      "Add chopped nuts and roast briefly.",
      "Cool completely, then add sugar and cardamom.",
      "Add milk gradually to bind the mixture.",
      "Shape into round ladoos.",
      "Let them set for 30 minutes before serving."
    ],
    significance: "Quick and easy sweet offering for Lord Ganesha, perfect for daily worship.",
    videoId: "rava_ladoo_demo",
    featured: false,
    order: 4,
    tags: ["rava ladoo", "quick", "easy", "daily worship"]
  },
  {
    title: "Coconut Barfi",
    category: "recipes",
    ingredients: [
      "3 cups fresh grated coconut",
      "1 cup sugar",
      "1/2 cup milk",
      "1/4 tsp cardamom powder",
      "Ghee for greasing",
      "Chopped pistachios for garnish"
    ],
    instructions: [
      "Cook coconut with milk on medium heat.",
      "Add sugar and cook until mixture thickens.",
      "Add cardamom powder and mix well.",
      "Pour into greased tray and level.",
      "Garnish with pistachios and let it set.",
      "Cut into squares when cooled."
    ],
    significance: "White colored sweet symbolizing purity and devotion to Lord Ganesha.",
    videoId: "coconut_barfi_demo",
    featured: false,
    order: 5,
    tags: ["coconut barfi", "white", "purity", "devotion"]
  },
  {
    title: "Kheer (Rice Pudding)",
    category: "recipes",
    ingredients: [
      "1/2 cup basmati rice",
      "4 cups full-fat milk",
      "1/2 cup sugar",
      "1/4 tsp cardamom powder",
      "2 tbsp chopped almonds",
      "2 tbsp raisins",
      "1 tbsp ghee"
    ],
    instructions: [
      "Wash and soak rice for 30 minutes.",
      "Boil milk in heavy-bottomed pan.",
      "Add rice and cook until soft and mushy.",
      "Add sugar and cook until thick.",
      "Add cardamom, nuts fried in ghee.",
      "Serve warm or chilled."
    ],
    significance: "Sacred rice pudding offered to deities, represents abundance and prosperity.",
    videoId: "kheer_demo",
    featured: true,
    order: 6,
    tags: ["kheer", "rice pudding", "abundance", "prosperity"]
  },
  {
    title: "Gur Til Ladoo (Jaggery Sesame Balls)",
    category: "recipes",
    ingredients: [
      "2 cups sesame seeds",
      "1 cup jaggery",
      "1 tsp ghee",
      "1/4 tsp cardamom powder",
      "Pinch of salt"
    ],
    instructions: [
      "Dry roast sesame seeds until golden.",
      "Heat jaggery with little water until melted.",
      "Cook to one-string consistency.",
      "Add sesame seeds and cardamom.",
      "Mix well and shape into balls while warm.",
      "Store in airtight container."
    ],
    significance: "Winter special offering that provides warmth and energy, ideal for Makar Sankranti celebrations.",
    videoId: "gur_til_ladoo_demo",
    featured: false,
    order: 7,
    tags: ["jaggery", "sesame", "winter", "makar sankranti"]
  },
  {
    title: "Besan Ladoo",
    category: "recipes",
    ingredients: [
      "2 cups chickpea flour (besan)",
      "1 cup ghee",
      "1 cup powdered sugar",
      "1/2 tsp cardamom powder",
      "2 tbsp chopped almonds",
      "2 tbsp raisins"
    ],
    instructions: [
      "Roast besan in ghee on low heat until aromatic.",
      "Color should change to golden brown.",
      "Cool completely, then add sugar.",
      "Add cardamom, nuts, and raisins.",
      "Mix well and shape into ladoos.",
      "Store in airtight container."
    ],
    significance: "Classic Indian sweet that's a favorite offering to Lord Ganesha during festivals.",
    videoId: "besan_ladoo_demo",
    featured: true,
    order: 8,
    tags: ["besan ladoo", "classic", "festivals", "favorite"]
  },
  {
    title: "Shrikhand",
    category: "recipes",
    ingredients: [
      "2 cups thick yogurt",
      "1/2 cup powdered sugar",
      "1/4 tsp cardamom powder",
      "Pinch of saffron",
      "2 tbsp warm milk",
      "Chopped pistachios for garnish"
    ],
    instructions: [
      "Hang yogurt in muslin cloth for 4-5 hours.",
      "Remove whey completely to get thick hung curd.",
      "Soak saffron in warm milk.",
      "Mix hung curd with sugar until smooth.",
      "Add cardamom and saffron milk.",
      "Chill and garnish with nuts before serving."
    ],
    significance: "Cooling and pure offering perfect for summer festivals and special occasions.",
    videoId: "shrikhand_demo",
    featured: false,
    order: 9,
    tags: ["shrikhand", "cooling", "summer", "special occasions"]
  },
  {
    title: "Motichoor Ladoo",
    category: "recipes",
    ingredients: [
      "2 cups fine besan",
      "1 cup sugar",
      "3/4 cup water",
      "Oil for frying",
      "1/4 tsp cardamom powder",
      "2 tbsp chopped almonds",
      "Few drops orange food color"
    ],
    instructions: [
      "Make smooth batter with besan and water.",
      "Heat oil and make tiny droplets through perforated spoon.",
      "Fry until light golden and drain.",
      "Make sugar syrup of one-string consistency.",
      "Mix fried besan pearls with syrup.",
      "Add cardamom, color, and shape into ladoos."
    ],
    significance: "Festive sweet with beautiful texture, often offered during Ganesh Chaturthi celebrations.",
    videoId: "motichoor_ladoo_demo",
    featured: false,
    order: 10,
    tags: ["motichoor", "festive", "beautiful texture", "ganesh chaturthi"]
  },
  {
    title: "Dry Fruit Modak",
    category: "recipes",
    ingredients: [
      "1 cup mixed dry fruits (dates, almonds, cashews)",
      "1/2 cup dessicated coconut",
      "2 tbsp ghee",
      "1/4 tsp cardamom powder",
      "2 tbsp jaggery powder",
      "Modak molds"
    ],
    instructions: [
      "Soak dates and remove seeds.",
      "Grind all dry fruits coarsely.",
      "Heat ghee and roast the mixture briefly.",
      "Add coconut and cardamom.",
      "Add jaggery powder and mix well.",
      "Press into modak molds and demold carefully."
    ],
    significance: "Healthy and nutritious version of modaks, perfect for health-conscious devotees.",
    videoId: "dry_fruit_modak_demo",
    featured: true,
    order: 11,
    tags: ["dry fruit", "healthy", "nutritious", "health conscious"]
  },
  {
    title: "Besan Laddu",
    category: "recipes",
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
    order: 3,
    tags: ["besan laddu", "auspicious", "prayers", "dry fruits"]
  }
]

const traditionsData = [
  {
    title: "Ganesh Chaturthi Celebration",
    category: "traditions",
    description: "The 11-day festival celebrating Lord Ganesha's birth.",
    rituals: [
      "Pranapratishtha - Installation of Ganesha idol with proper rituals",
      "Daily Aarti - Morning and evening prayers with offerings",
      "Modak Offering - Daily offering of Ganesha's favorite sweets",
      "Visarjan - Immersion ceremony on the final day"
    ],
    significance: "This festival symbolizes the cycle of creation and dissolution in Hindu philosophy.",
    videoId: "xeXcq1SWgLw",
    image: "Hero/ganesh.svg",
    featured: true,
    order: 1,
    tags: ["ganesh chaturthi", "festival", "eleven days", "celebration"]
  },
  {
    title: "Sankashti Chaturthi",
    category: "traditions",
    description: "Monthly fasting day dedicated to Lord Ganesha.",
    rituals: [
      "Observe fast from sunrise to moonrise",
      "Perform special puja in the evening",
      "Offer durva grass and red flowers",
      "Break fast only after sighting the moon"
    ],
    significance: "This monthly observance helps devotees overcome obstacles and gain Ganesha's blessings.",
    videoId: "4ncAlDhIfTw",
    image: "Hero/diya.png",
    featured: true,
    order: 2,
    tags: ["sankashti", "monthly", "fasting", "moon"]
  },
  {
    title: "First Worship Tradition",
    category: "traditions",
    description: "Lord Ganesha is always worshipped first in any Hindu ceremony.",
    rituals: [
      "Begin any puja with Ganesha invocation",
      "Offer red flowers and durva grass",
      "Chant 'Vighneshwaraya Namaha'",
      "Seek blessings for obstacle-free completion"
    ],
    significance: "As the remover of obstacles, Ganesha's blessings ensure successful completion of any endeavor.",
    videoId: "On8RhqLwLvw",
    image: "Hero/om.svg",
    order: 3,
    tags: ["first worship", "ceremony", "obstacles", "blessings"]
  },
  {
    title: "Ganesh Visarjan (Immersion Ceremony)",
    category: "traditions",
    description: "The ritualistic immersion of Ganesha idols in water bodies, marking the end of Ganesh Chaturthi festival.",
    rituals: [
      "Perform final aarti with family and community",
      "Offer prayers and seek blessings for next year",
      "Carry the idol in a grand procession",
      "Immerse the idol in river, lake, or sea with 'Ganpati Bappa Morya, Mangal Murti Morya' chants",
      "Distribute prasad and celebrate the divine journey"
    ],
    significance: "Symbolizes the cycle of creation and dissolution, teaching us about the impermanent nature of life while celebrating the eternal presence of the divine.",
    videoId: "ganesh_visarjan_demo",
    image: "Hero/ganesh.svg",
    featured: true,
    order: 4,
    tags: ["visarjan", "immersion", "procession", "cycle of life", "community celebration"]
  }
]

const booksData = [
  {
    title: "Ganesha Purana",
    category: "books",
    author: "Sage Vyasa",
    description: "One of the two major Puranas dedicated entirely to Lord Ganesha, narrating his origin, forms, and stories.",
    chapters: [
      "Upasana Khanda - Methods of worship",
      "Krida Khanda - Divine plays and stories",
      "Uttara Khanda - Advanced spiritual teachings"
    ],
    significance: "One of the most comprehensive texts about Lord Ganesha's divine nature and worship methods.",
    videoId: "kxxhO92X8ro",
    image: "Hero/ganesh.svg",
    featured: true,
    order: 1,
    tags: ["ganesha purana", "sage vyasa", "comprehensive", "worship methods"]
  },
  {
    title: "Mudgala Purana",
    category: "books",
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
    image: "Hero/modak.png",
    featured: true,
    order: 2,
    tags: ["mudgala purana", "eight incarnations", "forms", "obstacles"]
  },
  {
    title: "Ganapati Atharvashirsha",
    category: "books",
    author: "Atharva Veda",
    description: "A Vedic text (part of Atharvaveda) that praises Ganesha as the Supreme Brahman.",
    chapters: [
      "Om Namaste Ganapataye - Opening invocation",
      "Tvameva Pratyaksham Tattvamasi - Truth declarations",
      "Ekadantaya Vidmahe - Meditation verses"
    ],
    significance: "One of the most powerful Vedic hymns establishing Ganesha as the ultimate reality.",
    videoId: "RYqJ5w-GrfM",
    image: "Hero/om.svg",
    featured: true,
    order: 3,
    tags: ["atharvashirsha", "vedic", "supreme brahman", "ultimate reality"]
  },
  {
    title: "Vinayaka Chavithi Vratam",
    category: "books",
    author: "Traditional Texts",
    description: "Complete guide to observing Ganesha Chaturthi festival with proper rituals, mantras, and procedures.",
    chapters: [
      "Significance of Ganesh Chaturthi",
      "Puja Vidhi (Worship Procedures)",
      "Daily Rituals for 11 Days",
      "Visarjan (Immersion) Ceremony"
    ],
    significance: "Essential guide for devotees to properly observe the most important festival dedicated to Lord Ganesha.",
    videoId: "chavithi_vratam_demo",
    image: "Hero/ganesh.svg",
    featured: false,
    order: 4,
    tags: ["chavithi", "festival", "rituals", "procedures", "11 days"]
  },
  {
    title: "Sankashti Chaturthi Vrat Katha",
    category: "books",
    author: "Puranic Literature",
    description: "Collection of stories and significance of monthly Sankashti Chaturthi fasting dedicated to Lord Ganesha.",
    chapters: [
      "Origin of Sankashti Vrat",
      "Stories of Devotees",
      "Proper Fasting Methods",
      "Moon Sighting Significance"
    ],
    significance: "Understanding these stories helps devotees develop deeper faith and proper observance of monthly Ganesha fasting.",
    videoId: "sankashti_katha_demo",
    image: "Hero/diya.png",
    featured: false,
    order: 5,
    tags: ["sankashti", "monthly fasting", "stories", "moon sighting"]
  },
  {
    title: "Ganapati Sahasranama",
    category: "books",
    author: "Narada Purana",
    description: "One thousand names of Lord Ganesha with their meanings and significance, revealing his various aspects and powers.",
    chapters: [
      "108 Primary Names",
      "Names for Different Occasions",
      "Names for Specific Blessings",
      "Meditation on Each Name"
    ],
    significance: "Chanting these thousand names brings complete purification, removes all obstacles, and grants all desires.",
    videoId: "sahasranama_demo",
    image: "Hero/om.svg",
    featured: true,
    order: 6,
    tags: ["sahasranama", "thousand names", "purification", "all desires"]
  },
  {
    title: "Ganesha Gita",
    category: "books",
    author: "Ganesha Purana",
    description: "Philosophical discourse by Lord Ganesha on dharma, wisdom, and the path to liberation, similar to Bhagavad Gita.",
    chapters: [
      "Nature of Reality",
      "Path of Devotion",
      "Wisdom and Knowledge",
      "Liberation Through Service"
    ],
    significance: "Contains profound spiritual teachings directly from Lord Ganesha about achieving success in worldly and spiritual pursuits.",
    videoId: "ganesha_gita_demo",
    image: "Hero/ganesh.svg",
    featured: true,
    order: 7,
    tags: ["ganesha gita", "philosophy", "dharma", "liberation", "teachings"]
  },
  {
    title: "Vinayaka Vratam Stories",
    category: "books",
    author: "Various Traditional Sources",
    description: "Collection of miraculous stories and experiences of devotees who observed Ganesha fasting and worship.",
    chapters: [
      "Ancient Kings and Ganesha",
      "Modern Devotees' Experiences",
      "Miraculous Interventions",
      "Faith and Devotion Stories"
    ],
    significance: "These inspiring stories strengthen faith and demonstrate the power of sincere devotion to Lord Ganesha.",
    videoId: "vratam_stories_demo",
    image: "Hero/flower.png",
    featured: false,
    order: 8,
    tags: ["vratam stories", "miraculous", "devotees", "faith", "experiences"]
  },
  {
    title: "Ganesha Pancharatnam by Adi Shankaracharya",
    category: "books",
    author: "Adi Shankaracharya",
    description: "Five beautiful verses in praise of Lord Ganesha, considered one of the most powerful hymns for beginning any work.",
    chapters: [
      "First Verse - Mudakara (Giver of Joy)",
      "Second Verse - Vighna Vinashaka (Obstacle Remover)",
      "Third Verse - Sarva Mangala (All Auspiciousness)",
      "Fourth Verse - Sarva Siddhi (All Accomplishments)",
      "Fifth Verse - Final Salutations"
    ],
    significance: "These five verses encapsulate the complete essence of Ganesha worship and are essential for students and professionals.",
    videoId: "pancharatnam_demo",
    image: "Hero/om.svg",
    featured: true,
    order: 9,
    tags: ["pancharatnam", "shankaracharya", "five verses", "students", "professionals"]
  }
]

const bhajansData = [
  {
    title: "Ganpati Bappa Morya",
    category: "bhajans",
    artist: "Shankar Mahadevan",
    videoId: "xeXcq1SWgLw",
    description: "Classic Ganesh Chaturthi celebration song",
    significance: "The most popular and energetic bhajan sung during Ganesh Chaturthi festivities.",
    featured: true,
    order: 1,
    tags: ["ganpati bappa", "celebration", "popular", "energetic"]
  },
  {
    title: "Sukh Karta Dukh Harta",
    category: "bhajans",
    artist: "Sadhana Sargam",
    videoId: "4ncAlDhIfTw",
    description: "Beautiful devotional song praising Lord Ganesha",
    significance: "A soul-stirring bhajan that invokes Ganesha's blessings for happiness and removal of sorrows.",
    featured: true,
    order: 2,
    tags: ["sukh karta", "devotional", "happiness", "sorrows"]
  },
  {
    title: "Om Gan Ganpataye Namo Namah",
    category: "bhajans",
    artist: "Suresh Wadkar",
    videoId: "On8RhqLwLvw",
    description: "Powerful mantra chanting for Lord Ganesha",
    significance: "Sacred mantra that purifies the mind and brings divine grace.",
    order: 3,
    tags: ["om gan", "mantra", "powerful", "divine grace"]
  },
  {
    title: "Vakratunda Mahakaya",
    category: "bhajans",
    artist: "Anup Jalota",
    videoId: "kxxhO92X8ro",
    description: "Sacred shloka sung melodiously",
    significance: "Traditional shloka that removes obstacles and brings prosperity.",
    order: 4,
    tags: ["vakratunda", "shloka", "melodious", "prosperity"]
  },
  {
    title: "Morya Re Bappa Morya Re",
    category: "bhajans",
    artist: "Ajay Atul",
    videoId: "morya_re_demo",
    description: "Modern energetic bhajan celebrating Lord Ganesha",
    significance: "Contemporary celebration song that connects modern youth with traditional devotion to Ganesha.",
    featured: true,
    order: 5,
    tags: ["morya re", "modern", "energetic", "youth connection"]
  },
  {
    title: "Jai Ganesh Jai Ganesh Deva",
    category: "bhajans",
    artist: "Lata Mangeshkar",
    videoId: "jai_ganesh_demo",
    description: "Classical devotional bhajan with traditional melody",
    significance: "Timeless bhajan that has been sung for generations, expressing pure devotion and surrender to Lord Ganesha.",
    featured: true,
    order: 6,
    tags: ["jai ganesh", "classical", "lata mangeshkar", "timeless", "devotion"]
  },
  {
    title: "Shendur Lal Chadhayo",
    category: "bhajans",
    artist: "Usha Mangeshkar",
    videoId: "shendur_lal_demo",
    description: "Beautiful bhajan about adorning Ganesha with red sindoor",
    significance: "Describes the beautiful decoration of Lord Ganesha and expresses the devotee's love and reverence.",
    featured: false,
    order: 7,
    tags: ["shendur lal", "decoration", "sindoor", "love", "reverence"]
  },
  {
    title: "Deva Shree Ganesha",
    category: "bhajans",
    artist: "Ajay Gogavale",
    videoId: "deva_shree_demo",
    description: "Powerful and dynamic bhajan from popular culture",
    significance: "Modern composition that beautifully blends traditional devotion with contemporary musical arrangements.",
    featured: true,
    order: 8,
    tags: ["deva shree", "powerful", "dynamic", "modern", "contemporary"]
  },
  {
    title: "Ekadantaya Vakratundaya",
    category: "bhajans",
    artist: "Hariharan",
    videoId: "ekadantaya_demo",
    description: "Sanskrit hymn praising Ganesha's divine attributes",
    significance: "Sacred hymn that describes various divine qualities of Lord Ganesha and invokes his blessings for wisdom.",
    featured: false,
    order: 9,
    tags: ["ekadantaya", "sanskrit hymn", "divine attributes", "wisdom", "hariharan"]
  }
]

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to database
    await connectDB()
    
    // Clear existing cultural content
    console.log('🗑️  Clearing existing cultural content...')
    await CulturalContent.deleteMany({})
    
    // Insert all data
    console.log('📝 Inserting mantras...')
    await CulturalContent.insertMany(mantrasData)
    
    console.log('🍯 Inserting recipes...')
    await CulturalContent.insertMany(recipesData)
    
    console.log('🪔 Inserting traditions...')
    await CulturalContent.insertMany(traditionsData)
    
    console.log('📚 Inserting books...')
    await CulturalContent.insertMany(booksData)
    
    console.log('🎵 Inserting bhajans...')
    await CulturalContent.insertMany(bhajansData)
    
    console.log('✅ Database seeding completed successfully!')
    
    // Display statistics
    const stats = await CulturalContent.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])
    
    console.log('\n📊 Content Statistics:')
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} items`)
    })
    
    const totalCount = await CulturalContent.countDocuments()
    console.log(`   Total: ${totalCount} items\n`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
