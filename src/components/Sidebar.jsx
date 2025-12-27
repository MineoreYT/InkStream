import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, Clock, Heart, Info, Search, Shield } from 'lucide-react';
import { useNSFW } from '../contexts/NSFWContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [showCredits, setShowCredits] = useState(false);
  const { includeNSFW, toggleNSFW } = useNSFW();

  const categories = [
    { name: 'Action', tag: 'action', icon: '⚔️' },
    { name: 'Romance', tag: 'romance', icon: '💕' },
    { name: 'Comedy', tag: 'comedy', icon: '😄' },
    { name: 'Drama', tag: 'drama', icon: '🎭' },
    { name: 'Fantasy', tag: 'fantasy', icon: '🧙‍♂️' },
    { name: 'Horror', tag: 'horror', icon: '👻' },
    { name: 'Mystery', tag: 'mystery', icon: '🔍' },
    { name: 'Sci-Fi', tag: 'sci-fi', icon: '🚀' },
    { name: 'Slice of Life', tag: 'slice-of-life', icon: '🌸' },
    { name: 'Sports', tag: 'sports', icon: '⚽' },
  ];

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Popular', path: '/popular', icon: TrendingUp },
    { name: 'Latest', path: '/latest', icon: Clock },
    { name: 'NSFW', path: '/nsfw', icon: Shield, isNSFW: true },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Reading List', path: '/reading-list', icon: BookOpen },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full ${isOpen ? 'w-64' : 'w-0'} bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden z-30`}>
      {/* Navigation Menu */}
      <div className="p-3 sm:p-4 pt-16 sm:pt-20 flex-shrink-0">
        <nav className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            // Hide NSFW link if NSFW is disabled
            if (item.isNSFW && !includeNSFW) {
              return null;
            }
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  isActive
                    ? 'bg-primary text-white'
                    : item.isNSFW 
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
                {item.isNSFW && <span className="text-xs">🔞</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Categories */}
      <div className="flex-1 px-3 sm:px-4 pb-4 overflow-y-auto">
        {/* NSFW Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">NSFW Content</span>
            </div>
            <button
              onClick={toggleNSFW}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeNSFW ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeNSFW ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {includeNSFW ? 'Mature content enabled' : 'Mature content disabled'}
          </p>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category.tag}
              to={`/category/${category.tag}`}
              onClick={() => {
                // Close sidebar on mobile when clicking a link
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              <span className="text-base sm:text-lg">{category.icon}</span>
              <span className="text-xs sm:text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={() => setShowCredits(!showCredits)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors w-full text-sm"
        >
          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">API Credits</span>
        </button>
        
        {showCredits && (
          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1 sm:mb-2">
              Powered by MangaDex API
            </p>
            <a
              href="https://mangadex.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Visit MangaDex.org
            </a>
            <p className="text-xs text-gray-500 mt-1">
              © 2024 MangaDex. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;