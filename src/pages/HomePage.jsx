import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative">
      {/* Spiritual Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl text-orange-500 animate-pulse">🕉️</div>
        <div className="absolute top-40 right-20 text-6xl text-red-500 animate-bounce">🪔</div>
        <div className="absolute bottom-40 left-20 text-7xl text-amber-500">🌺</div>
        <div className="absolute bottom-20 right-10 text-6xl text-orange-600">🙏</div>
        <div className="absolute top-1/2 left-1/4 text-4xl text-red-400">📿</div>
        <div className="absolute top-1/3 right-1/3 text-5xl text-orange-400">🔱</div>
        <div className="absolute top-3/4 right-1/4 text-3xl text-amber-600">🐚</div>
        <div className="absolute top-1/4 left-1/2 text-3xl text-red-600">🎺</div>
      </div>

      {/* Mandala Patterns */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-orange-500"/>
          <circle cx="80" cy="80" r="12" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-red-500"/>
          <circle cx="80" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-amber-500"/>
          <circle cx="20" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-orange-600"/>
        </svg>
      </div>

      <Header />
      <Hero />
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
