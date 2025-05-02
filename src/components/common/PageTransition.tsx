
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import audioService from '@/services/audioService';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');
  
  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Only trigger transitions when the location changes
    if (location.pathname !== displayLocation.pathname) {
      // Play navigation sound
      if (isAdminRoute) {
        audioService.playNotificationSound();
      }
      
      setTransitionStage('fade-out');
      
      // Small timeout to ensure the animation completes
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-in');
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation, isAdminRoute]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        transitionStage === 'fade-in' 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
      }`}
      aria-live="polite"
    >
      {children}
    </div>
  );
};

export default PageTransition;
