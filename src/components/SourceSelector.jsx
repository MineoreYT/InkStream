import React, { useState, useEffect } from 'react';
import { Settings, Shield, Eye, EyeOff } from 'lucide-react';
import apiManager, { API_SOURCES } from '../services/apiManager';

const SourceSelector = ({ currentSource, onSourceChange, showSettings = false }) => {
  const [sources, setSources] = useState([]);
  const [showSourceSettings, setShowSourceSettings] = useState(false);
  const [ageVerificationModal, setAgeVerificationModal] = useState(null);

  useEffect(() => {
    setSources(apiManager.getAllSources());
  }, []);

  const handleSourceToggle = (sourceId, enabled) => {
    // Check if it's an adult source and needs age verification
    if (enabled && apiManager.isAdultSource(sourceId)) {
      if (!apiManager.isAgeVerifiedForSource(sourceId)) {
        setAgeVerificationModal(sourceId);
        return;
      }
    }

    apiManager.toggleSource(sourceId, enabled);
    setSources([...apiManager.getAllSources()]);
  };

  const handleAgeVerification = (sourceId, verified) => {
    if (verified) {
      apiManager.setAgeVerificationForSource(sourceId, true);
      apiManager.toggleSource(sourceId, true);
      setSources([...apiManager.getAllSources()]);
    }
    setAgeVerificationModal(null);
  };

  const activeSources = apiManager.getActiveSources();

  return (
    <div className="relative">
      {/* Source Selector Dropdown */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Source:
        </label>
        <select
          value={currentSource}
          onChange={(e) => onSourceChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          {activeSources.map(source => (
            <option key={source.id} value={source.id}>
              {source.icon} {source.name}
              {source.isAdult ? ' (18+)' : ''}
            </option>
          ))}
        </select>

        {showSettings && (
          <button
            onClick={() => setShowSourceSettings(!showSourceSettings)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Source Settings"
          >
            <Settings size={16} />
          </button>
        )}
      </div>

      {/* Source Settings Panel */}
      {showSourceSettings && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Manga Sources
          </h3>
          
          <div className="space-y-3">
            {sources.map(source => (
              <div key={source.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{source.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {source.name}
                      {source.isAdult && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                          18+
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {source.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {source.isAdult && (
                    <Shield size={16} className="text-red-500" title="Adult Content" />
                  )}
                  <button
                    onClick={() => handleSourceToggle(source.id, !apiManager.isSourceEnabled(source.id))}
                    className={`p-1 rounded ${
                      apiManager.isSourceEnabled(source.id)
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={apiManager.isSourceEnabled(source.id) ? 'Disable Source' : 'Enable Source'}
                  >
                    {apiManager.isSourceEnabled(source.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <Shield size={12} className="inline mr-1" />
              Adult content sources require age verification and are subject to content policies.
            </p>
          </div>
        </div>
      )}

      {/* Age Verification Modal */}
      {ageVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <Shield size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Age Verification Required
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                  className="w-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                By clicking "I am 18 or older", you confirm that you are of legal age to view adult content in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceSelector;