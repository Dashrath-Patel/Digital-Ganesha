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
    videoId: "oTl_DYNAP0o",
    featured: true,
    order: 2,
    tags: ["puran poli", "maharashtrian", "sweet bread", "traditional"]
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
