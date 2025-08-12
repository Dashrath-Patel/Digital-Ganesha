import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  const [firstLine, setFirstLine] = useState('')
  const [secondLine, setSecondLine] = useState('')
  const [isFirstLineAnimating, setIsFirstLineAnimating] = useState(false)
  const [isSecondLineAnimating, setIsSecondLineAnimating] = useState(false)
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0)

  const mantraLines = [
    [
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।",
      "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
    ],
    [
      "विघ्नेश्वराय वरदाय सुरप्रियाय लम्बोदराय सकलाय जगद्धितायं।",
      "एकदन्ताय शुद्घाय सुमुखाय नमो नमः।"
    ],
    [
      "अमेयाय च हेरम्ब परशुधारकाय ते।",
      "एकदंताय विद्‍महे। वक्रतुण्डाय धीमहि। तन्नो दंती प्रचोदयात्॥"
    ]
  ]

  const mantraTranslations = [
    {
      romanized: "Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada",
      meaning: "O Lord with curved trunk and massive body, shining like million suns, remove all obstacles from my path in all endeavors always"
    },
    {
      romanized: "Vighneshvaraya Varadaya Surapriyaya Lambodaraya Sakalaya Jagaddhitayam, Ekadantaya Shudghaya Sumukhaya Namo Namah",
      meaning: "Salutations to the remover of obstacles, the boon giver, beloved of gods, pot-bellied one, complete one, benefactor of universe, single-tusked, pure and pleasant-faced"
    },
    {
      romanized: "Ameyaya Cha Heramba Parashudhrakaya Te, Ekadantaya Vidmahe Vakratundaya Dhimahi Tanno Danti Prachodayat",
      meaning: "To the immeasurable Heramba who holds the axe, we know the single-tusked one, we meditate on the curved-trunk one, may that tusked one inspire us"
    }
  ]

  // Sequential line-by-line animation effect for mantra
  useEffect(() => {
    const animateMantra = () => {
      // Reset everything
      setFirstLine('')
      setSecondLine('')
      setIsFirstLineAnimating(false)
      setIsSecondLineAnimating(false)

      // Use current index and cycle through mantras sequentially
      const selectedMantra = mantraLines[currentMantraIndex]

      // Start first line after a brief delay
      setTimeout(() => {
        setFirstLine(selectedMantra[0])
        setIsFirstLineAnimating(true)
        
        // Start second line after first line animation completes
        setTimeout(() => {
          setSecondLine(selectedMantra[1])
          setIsSecondLineAnimating(true)
        }, 1000) // Increased wait time for much slower animation
      }, 300)

      // Move to next mantra in sequence after animation completes
      setTimeout(() => {
        setCurrentMantraIndex((prevIndex) => (prevIndex + 1) % mantraLines.length)
      }, 6000) // Wait longer before switching to next mantra
    }

    // Initial animation
    animateMantra()

    // Repeat every 10 seconds (increased time to read mantras)
    const timer = setInterval(animateMantra, 10000)

    return () => clearInterval(timer)
  }, [currentMantraIndex])

  return (
    <div className="relative">
      <Header />
      <div id="home">
        <Hero firstLine={firstLine} secondLine={secondLine} isFirstLineAnimating={isFirstLineAnimating} isSecondLineAnimating={isSecondLineAnimating} currentMantraIndex={currentMantraIndex} mantraTranslations={mantraTranslations} />
      </div>
      
      <div id="features">
        <Features />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
