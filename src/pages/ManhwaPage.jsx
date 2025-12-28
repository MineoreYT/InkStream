import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MangaTile from '../components/MangaTileUniversal';
import apiManager, { API_SOURCES } from '../services/apiManager';
import { Loader2, AlertCircle, Shield } from 'lucide-react';

const ManhwaPage = () => {
  const [manhwa, setManhwa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    // Check if manhwa18 source is available and age verified
    const isVerified = apiManager.isAgeVerifiedForSource(API_SOURCES.MANHWA18);
    const isEnabled = apiManager.isSourceEnabled(API_SOURCES.MANHWA18);
    
    if (isEnabled && isVerified) {
      fetchManhwa();
    } else if (isEnabled && !isVerified) {
      setShowAgeVerification(true);
      setLoading(false);
    } else {
      // Enable manhwa18 source if not enabled
      setShowAgeVerification(true);
      setLoading(false);
    }
  }, []);

  const fetchManhwa = async (pageNum = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      
      const data = await apiManager.getPopular(API_SOURCES.MANHWA18, pageNum + 1);
      
      if (append) {
        setManhwa(prev => [...prev, ...(data.data || [])]);
      } else {
        setManhwa(data.data || []);
      }
      
      setPage(pageNum);
      setHasMore(data.pagination?.hasNextPage || false);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching manhwa:', err);
      if (!append) setManhwa([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreManhwa = async () => {
    if (loadingMore || !hasMore) return;
    await fetchManhwa(page + 1, true);
  };

  const handleAgeVerification = (verified) => {
    if (verified) {
      apiManager.setAgeVerificationForSource(API_SOURCES.MANHWA18, true);
      apiManager.toggleSource(API_SOURCES.MANHWA18, true);
      setShowAgeVerification(false);
      fetchManhwa();
    } else {
      setShowAgeVerification(false);
      setError('Age verification required to access manhwa content');
    }
  };

  if (showAgeVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <div className="text-center">
            <Shield size={64} className="mx-auto text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Adult Content Warning
            </h1>
            <p className="text-gray-600 mb-6">
              This section contains 18+ Korean manhwa with mature themes, sexual content, and adult situations. 
              You must be 18 years or older to access this content.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleAgeVerification(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                I am 18 or older - Enter
              </button>
              <Link
                to="/"
                className="block w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Go back to Home
              </Link>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              By clicking "I am 18 or older", you confirm that you are of legal age to view adult content in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading manhwa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading manhwa</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => fetchManhwa()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔞</span>
            <h1 className="text-4xl sm:text-5xl font-bold">Korean Manhwa</h1>
          </div>
          <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-2xl">
            Discover adult Korean webtoons with mature themes and stunning artwork. 
            <span className="block text-sm mt-2 opacity-75">
              ⚠️ 18+ Content Only - Age verification required
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm bg-white/20 rounded-lg px-4 py-2 inline-block">
            <Shield size={16} />
            <span>Age verified content</span>
          </div>
        </div>
        <div className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -left-5 sm:-left-10 -bottom-5 sm:-bottom-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full"></div>
      </div>

      {/* Content Warning - At the top */}
      <section className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-red-800 mb-2">Content Warning & Chapter Availability</h3>
            <p className="text-red-700 text-sm mb-3">
              All content in this section is intended for adults 18 years and older. 
              It may contain explicit sexual content, mature themes, violence, and other adult material. 
              Viewer discretion is advised.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-yellow-800 text-sm">
                <strong>📚 Chapter Availability:</strong> Some manhwa may have limited or no chapters available due to licensing restrictions. 
                Many adult Korean manhwa are only available on paid platforms like Lezhin Comics, Tappytoon, or official publishers.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-blue-800 text-sm">
                <strong>🌐 Language Notice:</strong> Some manhwa chapters may not be available in English. 
                Chapters might be in Korean, Japanese, Chinese, or other languages depending on what's available on MangaDex.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Manhwa Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🔥 Popular Adult Manhwa
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Most popular Korean webtoons with mature content
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {manhwa.map((item, index) => (
            <div
              key={`${item.source || API_SOURCES.MANHWA18}-${item.id}-${index}`}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <MangaTile 
                manga={{
                  ...item,
                  source: item.source || API_SOURCES.MANHWA18
                }} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button 
            onClick={loadMoreManhwa}
            disabled={loadingMore}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading More...</span>
              </div>
            ) : (
              'Load More Manhwa 🔞'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ManhwaPage;