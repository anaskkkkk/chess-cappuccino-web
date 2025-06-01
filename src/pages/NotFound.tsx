
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguageContext } from '@/contexts/LanguageContext';

const NotFound = () => {
  const { t } = useLanguageContext();

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-chess-accent mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl text-chess-text-light mb-8">{t('pageNotFound')}</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        {t('pageNotFoundDescription')}
      </p>
      <Link to="/">
        <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
          {t('returnToHomepage')}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
