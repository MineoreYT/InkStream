import React, { useState, useEffect } from 'react';
import { useNSFW } from '../contexts/NSFWContext';
import { useNotification } from '../contexts/NotificationContext';
import { mangadexApi } from '../services/mangadexApi';
import MangaTile from '../components/MangaTile';
import LoadingSpinner from '../components/LoadingSpinner';

const NSFWPage = () => {
  const { includeNSFW, showNSFWWarning, dismissWarning } = useNSFW();
  const { showNotification } = useNotification();
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);

  const limit = 12;

  // Check if user has already verified age
  useEffect(() => {
    const verified = localStorage.getItem('inkstream-age-verified');
    if (verified === 'true') {
      setAgeVerified(true);
      setShowAgeVerification(false);
    }
  }, []);

  const handleAgeVerification = (isAdult) => {
    if (isAdult) {
      setAgeVerified(true);
      setShowAgeVerification(false);
      localStorage.setItem('inkstream-age-verified', 'true');
      if (showNSFWWarning) {
        dismissWarning();
      }
    } else {
      showNotification('You must be 18 or older to access this content.', 'error');
    }
  };

  const fetchNSFWManga = async (isLoadMore = false) => {
    if (!ageVerified) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setManga([]);
        setOffset(0);
      }

      const currentOffset = isLoadMore ? offset : 0;
      const response = await mangadexApi.getNSFWManga(limit, currentOffset);
      
      if (response && response.data) {
        const newManga = response.data;
        
        if (isLoadMore) {
          setManga(prev => [...prev, ...newManga]);
        } else {
          setManga(newManga);
        }
        
        setOffset(currentOffset + limit);
        setHasMore(newManga.length === limit);
      }
    } catch (error) {
      console.error('Error fetching NSFW manga:', error);
      showNotification('Failed to load NSFW content. Please try again.', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (ageVerified) {
      fetchNSFWManga();
    }
  }, [ageVerified]);

  if (showAgeVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🔞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Verification Required</h2>
            <p className="text-gray-600 mb-6">
              This section contains mature content intended for adults only. 
              You must be 18 years or older to proceed.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleAgeVerification(true)}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                I am 18 or older
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                I am under 18
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!includeNSFW) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔞</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">NSFW Content Disabled</h2>
        <p className="text-gray-600 mb-6">
          NSFW content is currently disabled in your settings. 
          Enable it in the sidebar to access mature content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showNSFWWarning && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <p className="font-medium">Mature Content Warning</p>
                <p className="text-sm">This section contains adult content including nudity and sexual themes.</p>
              </div>
            </div>
            <button
              onClick={dismissWarning}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔞 Mature Content</h1>
        <p className="text-gray-600">Adult manga and mature themes - 18+ only</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Manga Grid */}
      {!loading && manga.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {manga.map((item) => (
              <MangaTile key={item.id} manga={item} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={() => fetchNSFWManga(true)}
                disabled={loadingMore}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  'Load More Mature Content 🔞'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && manga.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mature Content Found</h3>
          <p className="text-gray-600">
            No NSFW manga available at the moment. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default NSFWPage;