
import React from 'react';

const features = [
  {
    title: "Real-time Board Pairing",
    description: "Connect your physical board to the digital platform in seconds with our seamless WebSocket technology.",
    icon: "🔄"
  },
  {
    title: "2D & 3D Digital Play",
    description: "Experience chess in multiple dimensions with our immersive digital interface.",
    icon: "🎮"
  },
  {
    title: "AI Opponents",
    description: "Challenge yourself with our Stockfish-powered AI opponents at various skill levels.",
    icon: "🤖"
  },
  {
    title: "Global Matchmaking",
    description: "Find opponents from around the world and compete in real-time matches.",
    icon: "🌎"
  },
  {
    title: "Tournament Support",
    description: "Create or join tournaments with friends or the global chess community.",
    icon: "🏆"
  },
  {
    title: "Advanced Training",
    description: "Improve your skills with our comprehensive library of lessons and puzzles.",
    icon: "📚"
  },
  {
    title: "Social Features",
    description: "Connect with friends, share games, and build your chess network.",
    icon: "👥"
  },
  {
    title: "Analytics Dashboard",
    description: "Track your progress with detailed statistics and performance insights.",
    icon: "📊"
  },
  {
    title: "Multi-device Support",
    description: "Access your account from any device, anytime, anywhere.",
    icon: "📱"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-chess-beige-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-chess-text-dark text-center mb-4">Key Features</h2>
        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          Discover the powerful features that make SmartChess the ultimate platform for chess enthusiasts of all levels.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card hover:shadow-lg transition-shadow duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-chess-text-dark">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
