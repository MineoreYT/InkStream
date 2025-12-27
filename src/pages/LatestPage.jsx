import { useState, useEffect } from 'react';
import { mangadexApi } from '../services/mangadexApi';
import { useNSFW } from '../contexts/NSFWContext';
import MangaTile from '../components/MangaTile';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

const LatestPage = () => {
  const { includeNSFW } = useNSFW();
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchLatestManga = async () => {
      try {
        setLoading(true);
        setManga([]);
        setPage(0);
        
        const data = await mangadexApi.getLatestManga(20, 0, includeNSFW);
        const mangaData = data.data || [];
        setManga(mangaData);
        setHasMore(mangaData.length === 20);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching latest manga:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestManga();
  }, [includeNSFW]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await mangadexApi.getLatestManga(20, nextPage * 20, includeNSFW);
      const newManga = data.data || [];
      
      setManga(prev => [...prev, ...newManga]);
      setPage(nextPage);
      setHasMore(newManga.length === 20);
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
          <p className="text-gray-600">Loading latest manga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading latest manga</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Latest Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Latest Updates
          </h1>
        </div>
        <p className="text-gray-600">
          Recently updated manga with new chapters
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {manga.length} manga found
        </div>
      </div>

      {/* Results Grid */}
      {manga.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No latest manga found</h2>
          <p className="text-gray-600">
            Try refreshing the page or check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {manga.map((mangaItem) => (
              <MangaTile key={mangaItem.id} manga={mangaItem} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More Latest Manga'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LatestPage;