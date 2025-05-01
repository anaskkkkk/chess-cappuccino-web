
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fade-out') {
      setTransitionStage('fade-in');
      setDisplayLocation(location);
    } else {
      setIsTransitioning(false);
    }
  };

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        transitionStage === 'fade-in' ? 'opacity-100' : 'opacity-0'
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

export default PageTransition;
