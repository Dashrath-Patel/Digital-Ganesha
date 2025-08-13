const currentYear = new Date().getFullYear();
const yearsActive = currentYear - 1995;
const About = () => {
  const stats = [
    { number: "45K+", label: "Devotees Connected", icon: "🙏" },
    { number: `${yearsActive}+`, label: "Years of Blessings", icon: "🏙️" },
    { number: "100+", label: "Active Members", icon: "👥" },
    { number: "24/7", label: "Access Available", icon: "⏰" }
  ]

const values = [
  {
    title: "Tree Plantation",
    description: "Spreading greenery across the township to create a cleaner, healthier environment.",
    icon: "🌳"
  },
  {
    title: "Blood Donation Drives",
    description: "Saving lives by organizing regular and impactful blood donation camps.",
    icon: "🩸"
  },
  {
    title: "Free Book Distribution",
    description: "Encouraging learning by providing free books to students and community members.",
    icon: "📖"
  },
  {
    title: "Arts & Sports Events",
    description: "Fostering talent and teamwork through creative arts and competitive sports.",
    icon: "🎭"
  },
  {
    title: "SSC/HSC Student Felicitation",
    description: "Honoring academic excellence and inspiring young achievers in our community.",
    icon: "🏆"
  }
]

  return (
    <section id="about" className="py-20 relative" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      {/* Enhanced Spiritual Background - Without Circles */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
        {/* Floating Petals */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-60 left-10 text-4xl text-golden animate-float">🌺</div>
          <div className="absolute top-60 right-10 text-3xl text-golden-light animate-float-delay">🌸</div>
        </div>
      </div>

      {/* Enhanced Floating Spiritual Elements */}
      <div className="absolute top-20 left-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute top-20 right-5 text-6xl opacity-20 animate-pulse">🕉️</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-pulse delay-700">📿</div>
      <div className="absolute bottom-10 right-5 text-5xl opacity-25 animate-bounce delay-500">🌺</div>
      <div className="absolute top-1/2 left-5 text-3xl opacity-20 animate-pulse delay-1000">🔱</div>
      <div className="absolute top-1/2 right-5 text-3xl opacity-20 animate-bounce delay-1200">🐚</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-golden mb-6">
            <span className="bg-gradient-to-r from-golden via-golden-light to-golden-dark bg-clip-text text-transparent">
              About KTYA
            </span>
          </h2>
          <p className="text-xl text-golden-light max-w-4xl mx-auto leading-relaxed">
            Krishna Township Youth Association (KTYA) is based in Krishna Township, located on Ambadi Road, Vasai (West) a
            vibrant and cosmopolitan community comprising 42 buildings and home to approximately 4,500 residents.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="text-6xl mb-6">🐘</div>
            <h3 className="text-3xl font-bold text-golden mb-6">
              Our Journey: 1995 - Present
            </h3>
            <p className="text-lg text-golden-light leading-relaxed mb-6">
              In 1995, as people from diverse backgrounds settled in Krishna Township, there was little opportunity for community
              interaction. To bridge this gap, a group of enthusiastic youth formed the Krishna Township Youth Association (KTYA).
            </p>
            <p className="text-lg text-golden-light leading-relaxed mb-8">
              KTYA began by organizing festivals like Ganeshotsav, Navratrotsav, and various social-cultural events—creating a
              shared space that brought residents together and fostered a strong sense of unity.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-golden font-medium">Uniting Krishna Township since 1995 through cultural celebrations.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-golden font-medium">Empowering women and fostering inclusivity with social and sports events.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-golden font-medium">Eco-friendly and sustainable practices.</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div className="text-4xl mb-3 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-golden mb-12">
            Our Initiatives
          </h3>
          <div className="space-y-12">
            {/* First Row - 3 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.slice(0, 3).map((value, index) => (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-600/30 to-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-yellow-400/50">
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-golden mb-4 group-hover:text-golden-light transition-colors duration-300">
                    {value.title}
                  </h4>
                  <p className="text-golden-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Second Row - 2 items centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                {values.slice(3, 5).map((value, index) => (
                  <div
                    key={index + 3}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-600/30 to-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-yellow-400/50">
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h4 className="text-xl font-bold text-golden mb-4 group-hover:text-golden-light transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-golden-light leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
