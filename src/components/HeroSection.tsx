import { useEffect, useState } from "react";
import { Sparkles, Trophy, Award } from "lucide-react";

export const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation dots for visual interest
  const animationDots = [0, 1, 2].map((i) => (
    <span 
      key={i}
      className={`inline-flex h-3 w-3 rounded-full animate-pulse transition-all duration-400 ease-out ${
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      } ${
        i === 0 ? 'bg-primary' : 
        i === 1 ? 'bg-accent animate-pulse delay-150' : 
        'bg-indigo-400 animate-pulse delay-300'
      }`}
      style={{ transitionDelay: `${700 + i * 100}ms` }}
      aria-hidden="true"
    />
  ));

  return (
    <section 
      className="text-center space-y-8 mb-16 overflow-hidden py-10 sm:py-12 md:py-16 sf-pro"
      aria-labelledby="hero-heading"
    >
      <div className="mb-6 hidden sm:flex justify-center">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm sf-pro"
          role="presentation"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>AI-powered study assistance</span>
        </div>
      </div>
      
      <h1 
        id="hero-heading"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight max-w-4xl mx-auto px-4 sf-pro"
      >
        <span className="sr-only">Your Last-Minute Study Companion</span>
        <span 
          aria-hidden="true" 
          className={`block transition-all duration-700 ease-out sf-pro ${
            mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          Your Last-Minute
        </span>
        <span 
          className={`bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent block mt-2 transition-all duration-700 ease-out sf-pro ${
            mounted ? 'opacity-100 transform-none' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '300ms' }}
          aria-hidden="true"
        >
          Study Companion
        </span>
      </h1>
      
      <p 
        className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-500 ease-out px-4 text-balance sf-pro ${
          mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-3'
        }`}
        style={{ transitionDelay: '500ms' }}
      >
        Get concise, memorable answers to your Computer Science questions. 
        Perfect for quick exam preparation and concept revision.
      </p>
      
      <div 
        className="flex justify-center gap-3 mt-6"
        aria-hidden="true"
      >
        {animationDots}
      </div>
    </section>
  );
};
