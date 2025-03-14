
import React from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Copyright, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-8 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Classifieds</h3>
            <p className="text-gray-600 max-w-xs">
              Find exactly what you're looking for in your local community.
            </p>
            <div className="flex items-center mt-4 text-gray-500">
              <Copyright size={16} className="mr-2" />
              <span>{currentYear} Classifieds</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common', 'categories')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?category=vehicles" className="text-gray-600 hover:text-primary">
                  {t('categories', 'vehicles')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=realEstate" className="text-gray-600 hover:text-primary">
                  {t('categories', 'realEstate')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=electronics" className="text-gray-600 hover:text-primary">
                  {t('categories', 'electronics')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=fashion" className="text-gray-600 hover:text-primary">
                  {t('categories', 'fashion')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common', 'contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-gray-500 mt-0.5" />
                <span className="text-gray-600">123 Marketplace Street, City Center, 10001</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-500" />
                <a href="mailto:contact@classifieds.com" className="text-gray-600 hover:text-primary">
                  contact@classifieds.com
                </a>
              </li>
              <li className="flex items-center">
                <ExternalLink size={18} className="mr-2 text-gray-500" />
                <a href="https://classifieds.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  www.classifieds.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          All rights reserved. Classifieds is a fictional marketplace created for demonstration purposes.
        </div>
      </div>
    </footer>
  );
};
