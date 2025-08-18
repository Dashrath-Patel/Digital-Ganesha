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
      image: "/developers/rabindra1.jpg", // Add your actual image to public/developers/
      cgpa: "9.5",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Python, React.js, Node.js",
      description: "Passionate about creating innovative web solutions with a focus on user experience and scalable architecture. Proposed the development of KTYA platform.",
      skills: ["React.js", "MongoDB", "Express.js", "JavaScript", "Python"],
      social: {
        github: "https://github.com/RabindraMishra-AIDS",
        linkedin: "https://www.linkedin.com/in/rabindra-mishra-18481427b/"
      },
    },
    {
      id: 2,
      name: "Dashrath Patel",
      role: "Backend & Database Architect",
      image: "/developers/Dashrath.jpg",
      cgpa: "9.3",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Backend Development, Database Design",
      description: "Expert in server-side development and database optimization. Architected the robust backend infrastructure for seamless user experiences.",
      skills: ["Node.js", "MongoDB", "Express.js", "API Development", "Database Design"],
      social: {
        github: "https://github.com/Dashrath-Patel",
        linkedin: "https://www.linkedin.com/in/dashrath-patel/"
      },
    },
    {
      id: 3,
      name: "Ayush Pandey",
      role: "Frontend Developer",
      image: "/developers/ayush.jpg",
      cgpa: "8.0",
      course: "B.Tech - AI&DS",
      Qualification: "Graduate",
      specialization: "Frontend Development, UI/UX Design",
      description: "Creative frontend developer with an eye for design. Crafted the beautiful and intuitive user interface.",
      skills: ["React.js", "CSS3", "JavaScript", "Figma"],
      social: {
        github: "https://github.com/Ayp47098",
        linkedin: "https://www.linkedin.com/in/ayush-pandey-b60609226/"
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
                The passionate minds behind this Platform - bringing devotion and technology together
              </p>
            </div>
            
            <div className="w-32 h-1 bg-gradient-to-r from-golden to-golden-light mx-auto rounded-full"></div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">10+</div>
                <div className="text-golden-light text-sm">Components Built</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">1000+</div>
                <div className="text-golden-light text-sm">Lines of Code</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">1</div>
                <div className="text-golden-light text-sm">Months Development</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-xl p-4 border border-golden/30">
                <div className="text-2xl font-bold text-golden">7+</div>
                <div className="text-golden-light text-sm">Features Integrated</div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="mb-16">
            {/* Information Boxes with Profile Images on Top */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={`info-${member.id}`}
                  className={`bg-gradient-to-br from-red-900/40 to-amber-900/40 rounded-2xl p-6 border border-golden/30 hover:border-golden/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    animatedCards.includes(index) ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Profile Image on Top of Box */}
                  <div className="text-center mb-6">
                    <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-golden/20 to-golden-light/20 border-4 border-golden/50 flex items-center justify-center overflow-hidden group-hover:border-golden transition-all duration-300 hover:scale-105">
                        {/* Display actual image or placeholder */}
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-golden/10 to-golden-light/10 flex items-center justify-center ${member.image ? 'hidden' : 'flex'}`}
                          style={{ display: member.image ? 'none' : 'flex' }}
                        >
                          <span className="text-5xl md:text-6xl lg:text-7xl">👨‍💻</span>
                        </div>
                      </div>
                      {/* Floating ring effect */}
                      <div className="absolute inset-0 rounded-full border-4 border-golden/30 animate-pulse group-hover:animate-ping"></div>
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-xl md:text-2xl font-bold text-golden mb-2">{member.name}</h3>
                    
                    {/* LinkedIn Icon */}
                    <button
                      onClick={() => handleSocialClick(member.social.linkedin)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                      title={`${member.name}'s LinkedIn`}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Role and Course */}
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-golden mb-1">{member.role}</h4>
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
                        <div className="text-lg font-bold text-golden">{member.Qualification}</div>
                        <div className="text-xs text-golden-light">Status</div>
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

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-golden font-semibold mb-2 text-sm">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-golden/20 text-golden text-xs rounded-full border border-golden/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Link */}
                  <div className="text-center">
                    <button
                      onClick={() => handleSocialClick(member.social.github)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 text-white text-sm"
                      title="GitHub Profile"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-gradient-to-br from-red-900/30 to-amber-900/30 backdrop-blur-sm rounded-3xl p-8 border border-golden/30 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-golden mb-4">About KTYA Website Project</h2>
              <p className="text-golden-light text-lg max-w-4xl mx-auto leading-relaxed">
                This is a comprehensive spiritual platform that bridges traditional devotion with modern technology. 
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
                    <span>Virtual Mandal Tour</span>
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
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
