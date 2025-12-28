import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, Clock, Heart, Info, Search, Shield, Settings } from 'lucide-react';
import { useNSFW } from '../contexts/NSFWContext';
import apiManager, { API_SOURCES } from '../services/apiManager';

const SidebarMultiAPI = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [showCredits, setShowCredits] = useState(false);
  const [showSourceSettings, setShowSourceSettings] = useState(false);
  const [ageVerificationModal, setAgeVerificationModal] = useState(null);
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

  // Get available sources
  const allSources = apiManager.getAllSources();
  const activeSources = apiManager.getActiveSources();

  const handleSourceToggle = (sourceId, enabled) => {
    // Check if it's an adult source and needs age verification
    if (enabled && apiManager.isAdultSource(sourceId)) {
      if (!apiManager.isAgeVerifiedForSource(sourceId)) {
        setAgeVerificationModal(sourceId);
        return;
      }
    }

    apiManager.toggleSource(sourceId, enabled);
    // Force re-render by updating state
    setShowSourceSettings(prev => !prev);
    setShowSourceSettings(prev => !prev);
  };

  const handleAgeVerification = (sourceId, verified) => {
    if (verified) {
      apiManager.setAgeVerificationForSource(sourceId, true);
      apiManager.toggleSource(sourceId, true);
    }
    setAgeVerificationModal(null);
  };

  return (
    <>
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

        {/* Sources Section */}
        <div className="px-3 sm:px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Sources
            </h3>
            <button
              onClick={() => setShowSourceSettings(!showSourceSettings)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Source Settings"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Active Sources */}
          <div className="space-y-1">
            {activeSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 text-sm"
              >
                <span className="text-base sm:text-lg">{source.icon}</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {source.name}
                  </span>
                  {source.isAdult && (
                    <span className="ml-1 px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                      18+
                    </span>
                  )}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Active" />
              </div>
            ))}
          </div>

          {/* Source Settings Panel */}
          {showSourceSettings && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Manage Sources</h4>
              <div className="space-y-2">
                {allSources.map(source => (
                  <div key={source.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{source.icon}</span>
                      <div>
                        <div className="text-xs font-medium text-gray-700">
                          {source.name}
                          {source.isAdult && (
                            <span className="ml-1 px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                              18+
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {source.description}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSourceToggle(source.id, !apiManager.isSourceEnabled(source.id))}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        apiManager.isSourceEnabled(source.id)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        apiManager.isSourceEnabled(source.id)
                          ? 'translate-x-4'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <div className="space-y-2">
                {activeSources.map(source => (
                  <div key={source.id}>
                    <p className="text-xs text-gray-600 mb-1">
                      {source.icon} Powered by {source.name}
                    </p>
                    {source.id === API_SOURCES.MANGADX && (
                      <a
                        href="https://mangadex.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Visit MangaDx.org
                      </a>
                    )}
                    {source.id === API_SOURCES.MANHWA18 && (
                      <a
                        href="https://manhwa18.my"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-600 hover:underline"
                      >
                        Visit Manhwa18.my (18+)
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                © 2024 InkStream. Multiple sources supported.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Age Verification Modal */}
      {ageVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <Shield size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Age Verification Required
              </h2>
              <p className="text-gray-600 mb-6">
                This source contains adult content (18+). You must be 18 years or older to access this content.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAgeVerification(ageVerificationModal, true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  I am 18 or older
                </button>
                <button
                  onClick={() => handleAgeVerification(ageVerificationModal, false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                By clicking "I am 18 or older", you confirm that you are of legal age to view adult content in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMultiAPI;