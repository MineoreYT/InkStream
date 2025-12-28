import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNSFW } from '../contexts/NSFWContext';
import MangaTile from '../components/MangaTile';
import NSFWWarning from '../components/NSFWWarning';
import SourceSelector from '../components/SourceSelector';
import apiManager, { API_SOURCES } from '../services/apiManager';
import { Loader2, AlertCircle } from 'lucide-react';

const HomePageMultiAPI = () => {
  const navigate = useNavigate();
  const { includeNSFW } = useNSFW();
  const [popularManga, setPopularManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentSource, setCurrentSource] = useState(API_SOURCES.MANGADX);

  const fetchData = async (sourceId = currentSource, pageNum = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      
      // Use API manager to get popular manga from selected source
      const data = await apiManager.getPopular(sourceId, pageNum + 1);
      
      if (append) {
        setPopularManga(prev => [...prev, ...(data.data || [])]);
      } else {
        setPopularManga(data.data || []);
      }
      
      setPage(pageNum);
      setHasMore(data.pagination?.hasNextPage || false);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      if (!append) setPopularManga([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(currentSource, 0, false);
  }, [currentSource, includeNSFW]);

  const loadMoreManga = async () => {
    if (loadingMore || !hasMore) return;
    await fetchData(currentSource, page + 1, true);
  };

  const handleSourceChange = (newSource) => {
    setCurrentSource(newSource);
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading manga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading manga</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => fetchData(currentSource, 0, false)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sourceConfig = apiManager.getSourceConfig(currentSource);

  return (
    <div className="space-y-8">
      {/* NSFW Warning */}
      <NSFWWarning />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to InkStream</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl">
            Discover and read manga from multiple sources. Your next adventure awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/popular')}
              className="bg-white text-primary px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse Popular
            </button>
            <button 
              onClick={() => navigate('/latest')}
              className="border-2 border-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-primary transition-colors"
            >
              Latest Updates
            </button>
          </div>
        </div>
        <div className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -left-5 sm:-left-10 -bottom-5 sm:-bottom-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full"></div>
      </div>

      {/* Source Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <SourceSelector 
          currentSource={currentSource}
          onSourceChange={handleSourceChange}
          showSettings={true}
        />
      </div>

      {/* Popular Manga Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {sourceConfig?.icon || '🔥'} Popular {sourceConfig?.name || 'Manga'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {sourceConfig?.description || 'Most loved by our community'}
              {sourceConfig?.isAdult && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  18+ Content
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {popularManga.map((manga, index) => (
            <MangaTile 
              key={`${manga.source || currentSource}-${manga.id}-${index}`} 
              manga={{
                ...manga,
                source: manga.source || currentSource
              }} 
            />
          ))}
        </div>
      </section>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button 
            onClick={loadMoreManga}
            disabled={loadingMore}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading More...</span>
              </div>
            ) : (
              `Load More ${sourceConfig?.name || 'Manga'} ✨`
            )}
          </button>
        </div>
      )}

      {/* Multi-Source Info */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          🌟 Multiple Sources Available
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">MangaDx</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              High-quality manga with great translations
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔞</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Manhwa18</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Adult Korean manhwa (18+ verification required)
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">More Coming</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Additional sources will be added soon
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageMultiAPI;