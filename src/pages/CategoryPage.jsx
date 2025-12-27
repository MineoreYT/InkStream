import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mangadexApi } from '../services/mangadexApi';
import { useNSFW } from '../contexts/NSFWContext';
import MangaTile from '../components/MangaTile';
import { Loader2, AlertCircle } from 'lucide-react';

const CategoryPage = () => {
  const { tag } = useParams();
  const { includeNSFW } = useNSFW();
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const categoryNames = {
    'action': 'Action',
    'romance': 'Romance',
    'comedy': 'Comedy',
    'drama': 'Drama',
    'fantasy': 'Fantasy',
    'horror': 'Horror',
    'mystery': 'Mystery',
    'sci-fi': 'Science Fiction',
    'slice-of-life': 'Slice of Life',
    'sports': 'Sports',
  };

  useEffect(() => {
    const fetchMangaByCategory = async () => {
      try {
        setLoading(true);
        setManga([]);
        setPage(0);
        
        const data = await mangadexApi.getMangaByTag(tag, 20, 0, includeNSFW);
        const mangaData = data.data || [];
        setManga(mangaData);
        setHasMore(mangaData.length === 20);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching manga by category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchMangaByCategory();
    }
  }, [tag, includeNSFW]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await mangadexApi.getMangaByTag(tag, 20, nextPage * 20, includeNSFW);
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
          <p className="text-gray-600">Loading {categoryNames[tag] || tag} manga...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1)} Manga
        </h1>
        <p className="text-gray-600">
          Discover the best {categoryNames[tag] || tag} manga titles
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {manga.length} manga found
        </div>
      </div>

      {/* Manga Grid */}
      {manga.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No manga found for this category</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;