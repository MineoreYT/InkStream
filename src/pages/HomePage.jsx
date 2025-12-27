import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mangadexApi } from '../services/mangadexApi';
import { useNSFW } from '../contexts/NSFWContext';
import MangaTile from '../components/MangaTile';
import NSFWWarning from '../components/NSFWWarning';
import { Loader2, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { includeNSFW } = useNSFW();
  const [popularManga, setPopularManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const popularData = await mangadexApi.getPopularManga(12, 0, includeNSFW);
        
        setPopularManga(popularData.data || []);
        setPage(0);
        setHasMore((popularData.data || []).length === 12);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [includeNSFW]);

  const loadMoreManga = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const moreData = await mangadexApi.getPopularManga(12, nextPage * 12, includeNSFW);
      const newManga = moreData.data || [];
      
      setPopularManga(prev => [...prev, ...newManga]);
      setPage(nextPage);
      setHasMore(newManga.length === 12);
    } catch (err) {
      console.error('Error loading more manga:', err);
    } finally {
      setLoadingMore(false);
    }
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
            onClick={() => window.location.reload()}
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
      {/* NSFW Warning */}
      <NSFWWarning />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to InkStream</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl">
            Discover and read thousands of manga titles from around the world. Your next adventure awaits!
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

      {/* Popular Manga Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🔥 Popular Manga</h2>
            <p className="text-gray-600 text-sm sm:text-base">Most loved by our community</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {popularManga.map((manga) => (
            <MangaTile key={manga.id} manga={manga} />
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
              'Load More Amazing Manga ✨'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;