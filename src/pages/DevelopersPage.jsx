import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DevelopersPage = () => {
  const navigate = useNavigate();
  const [animatedCards, setAnimatedCards] = useState([]);

  // Team member data - Replace with your actual information
  const teamMembers = [
    {
      id: 1,
      name: "Rabindra Mishra",
      role: "Full Stack Developer",
      image: "", // Add your actual image
      cgpa: "9.5",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Python, React.js, Node.js",
      description: "Passionate about creating innovative web solutions with a focus on user experience and scalable architecture. Led the development of Digital Ganesha platform.",
      skills: ["React.js", "Node.js", "MongoDB", "Express.js", "JavaScript", "Python"],
      social: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername"
      },
    },
    {
      id: 2,
      name: "Dashrath Patel",
      role: "Backend Developer & Database Architect",
      image: "/team/member2.jpg", // Add actual image
      cgpa: "9.3",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Backend Development, Database Design",
      description: "Expert in server-side development and database optimization. Architected the robust backend infrastructure for seamless user experiences.",
      skills: ["Node.js", "MongoDB", "Express.js", "API Development", "Database Design"],
      social: {
        github: "https://github.com/member2username",
        linkedin: "https://linkedin.com/in/member2username"
      },
    },
    {
      id: 3,
      name: "Ayush Patel",
      role: "Frontend Developer & UI/UX Designer",
      image: "/team/member3.jpg", // Add actual image
      cgpa: "8.8",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Frontend Development, UI/UX Design",
      description: "Creative frontend developer with an eye for design. Crafted the beautiful and intuitive user interface that brings Digital Ganesha to life.",
      skills: ["React.js", "CSS3", "JavaScript", "Figma"],
      social: {
        github: "https://github.com/member3username",
        linkedin: "https://linkedin.com/in/member3username"
      },
    }
  ];

  useEffect(() => {
    // Animate cards on load
    teamMembers.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedCards(prev => [...prev, index]);
      }, index * 200);
    });
  }, []);

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
      <Header />
      
      {/* Spiritual Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.2)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 text-4xl text-golden animate-float">🌺</div>
          <div className="absolute top-40 right-20 text-3xl text-golden-light animate-float-delay">🌸</div>
          <div className="absolute bottom-40 left-20 text-4xl text-golden-light opacity-50 animate-pulse delay-700">📿</div>
          <div className="absolute bottom-20 right-10 text-5xl text-golden opacity-40 animate-bounce delay-500">🪔</div>
          <div className="absolute top-60 left-1/4 text-3xl text-golden opacity-30 animate-pulse delay-1000">🕉️</div>
          <div className="absolute bottom-60 right-1/4 text-4xl text-golden-light opacity-25 animate-float delay-1200">🏵️</div>
        </div>
      </div>

      <div className="relative z-10 pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <div className="text-6xl mb-4">👨‍💻</div>
              <h1 className="text-4xl md:text-6xl font-bold text-golden mb-4 leading-tight">
                Meet Our Development Team
              </h1>
              <p className="text-golden-light text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                The passionate minds behind Digital Ganesha - bringing devotion and technology together
              </p>
            </div>
            
            <div className="w-32 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto rounded-full"></div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">50+</div>
                <div className="text-golden-light text-sm">Components Built</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">1000+</div>
                <div className="text-golden-light text-sm">Lines of Code</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">3</div>
                <div className="text-golden-light text-sm">Months Development</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">15+</div>
                <div className="text-golden-light text-sm">Features Integrated</div>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`group relative bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-3xl p-6 border border-golden/30 hover:border-golden/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl transform ${
                  animatedCards.includes(index) ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 text-golden/30 group-hover:text-golden/60 transition-colors duration-300">
                  🕉️
                </div>

                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative mx-auto w-28 h-28 mb-4">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-golden/20 to-golden-light/20 border-2 border-golden/50 flex items-center justify-center overflow-hidden group-hover:border-golden transition-colors duration-300">
                      {/* Placeholder avatar - replace with actual images */}
                      <div className="w-full h-full bg-gradient-to-br from-golden/10 to-golden-light/10 flex items-center justify-center">
                        <span className="text-4xl">👨‍💻</span>
                      </div>
                    </div>
                    {/* Floating ring effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-golden/30 animate-pulse group-hover:animate-ping"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-golden mb-2">{member.name}</h3>
                  <p className="text-golden-light font-medium mb-1">{member.role}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-golden/80">
                    <span>🎓</span>
                    <span>{member.course}</span>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-black/20 rounded-xl p-4 mb-4 border border-golden/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-golden">{member.cgpa}</div>
                      <div className="text-xs text-golden-light">CGPA</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-golden">{member.year}</div>
                      <div className="text-xs text-golden-light">Academic Year</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-medium text-golden-light">{member.specialization}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-golden-light text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

                {/* Quote */}
                <div className="bg-golden/10 rounded-lg p-3 mb-4 border-l-4 border-golden/50">
                  <p className="text-golden italic text-sm">"{member.quote}"</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-golden font-semibold mb-2 text-sm">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 4).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-golden/20 text-golden text-xs rounded-full border border-golden/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="px-2 py-1 bg-golden/10 text-golden-light text-xs rounded-full border border-golden/20">
                        +{member.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleSocialClick(member.social.github)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 group-hover:scale-110"
                    title="GitHub"
                  >
                    <span className="text-white text-lg">🐙</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick(member.social.linkedin)}
                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-300 group-hover:scale-110"
                    title="LinkedIn"
                  >
                    <span className="text-white text-lg">💼</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick(`mailto:${member.social.email}`)}
                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300 group-hover:scale-110"
                    title="Email"
                  >
                    <span className="text-white text-lg">📧</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick(member.social.portfolio)}
                    className="p-2 bg-golden hover:bg-golden-light rounded-lg transition-colors duration-300 group-hover:scale-110"
                    title="Portfolio"
                  >
                    <span className="text-red-900 text-lg">🌐</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Information */}
          <div className="bg-gradient-to-br from-red-900/30 to-amber-900/30 backdrop-blur-sm rounded-3xl p-8 border border-golden/30 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">About Digital Ganesha Project</h2>
              <p className="text-golden-light text-lg max-w-4xl mx-auto leading-relaxed">
                Digital Ganesha is a comprehensive spiritual platform that bridges traditional devotion with modern technology. 
                Our platform provides virtual darshan, cultural learning, community engagement, and sacred experiences for devotees worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-golden">🛠️ Technologies Used</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS', 'JWT Auth', 'Socket.io', 'Cloudinary'].map((tech, index) => (
                    <div key={index} className="bg-golden/10 rounded-lg p-2 text-golden-light text-sm text-center border border-golden/20">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-golden">✨ Key Features</h3>
                <ul className="space-y-2 text-golden-light">
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">🔔</span>
                    <span>Live Aarti Streaming</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">🏛️</span>
                    <span>Virtual Temple Tour</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">📚</span>
                    <span>Cultural Learning Hub</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">👥</span>
                    <span>Community Engagement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">🙏</span>
                    <span>Virtual Offerings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-golden">🛡️</span>
                    <span>Admin Dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-8 border border-golden/30">
            <h2 className="text-2xl font-bold text-golden mb-4">Let's Connect</h2>
            <p className="text-golden-light mb-6">
              Interested in our work? Have a project idea? We'd love to hear from you!
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.open('mailto:team@digitalganesha.com')}
                className="bg-golden hover:bg-golden-light text-red-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                📧 Email Our Team
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
