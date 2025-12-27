import React from 'react';
import { useNSFW } from '../contexts/NSFWContext';

const NSFWWarning = () => {
  const { showNSFWWarning, dismissWarning } = useNSFW();

  if (!showNSFWWarning) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <p className="font-medium">Mature Content Warning</p>
            <p className="text-sm">NSFW content is enabled. You may see adult material including nudity and sexual themes.</p>
          </div>
        </div>
        <button
          onClick={dismissWarning}
          className="text-red-500 hover:text-red-700 ml-4 text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NSFWWarning;