import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mangadexApi } from '../services/mangadexApi';
import { useNSFW } from '../contexts/NSFWContext';
import MangaCard from '../components/MangaCard';
import { Loader2, AlertCircle, Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { includeNSFW } = useNSFW();
  const query = searchParams.get('q');
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const searchManga = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        setManga([]);
        setPage(0);
        
        const data = await mangadexApi.searchManga(query, 20, 0, includeNSFW);
        const mangaData = data.data || [];
        setManga(mangaData);
        setHasMore(mangaData.length === 20);
      } catch (err) {
        setError(err.message);
        console.error('Error searching manga:', err);
      } finally {
        setLoading(false);
      }
    };

    searchManga();
  }, [query, includeNSFW]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || !query) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await mangadexApi.searchManga(query, 20, nextPage * 20, includeNSFW);
      const newManga = data.data || [];
      
      setManga(prev => [...prev, ...newManga]);
      setPage(nextPage);
      setHasMore(newManga.length === 20);
    } catch (err) {
      console.error('Error loading more search results:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No search query</h2>
        <p className="text-gray-600">Please enter a search term to find manga.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error searching manga</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          {manga.length === 0 ? 'No results found' : `${manga.length} manga found`}
        </p>
      </div>

      {/* Results Grid */}
      {manga.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No manga found</h2>
          <p className="text-gray-600">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {manga.map((mangaItem) => (
              <MangaCard key={mangaItem.id} manga={mangaItem} />
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
                  'Load More Results'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;