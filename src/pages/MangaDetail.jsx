import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mangadexApi } from '../services/mangadexApi';
import { Loader2, AlertCircle, Calendar, User, BookOpen, Star, Play } from 'lucide-react';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        const [mangaData, chaptersData] = await Promise.all([
          mangadexApi.getMangaById(id),
          mangadexApi.getMangaChapters(id),
        ]);
        
        setManga(mangaData.data);
        setChapters(chaptersData.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching manga details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMangaDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading manga details...</p>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading manga details</p>
          <p className="text-gray-600 text-sm">{error || 'Manga not found'}</p>
        </div>
      </div>
    );
  }

  // Extract manga data
  const title = manga.attributes?.title?.en || 
                manga.attributes?.title?.['ja-ro'] || 
                manga.attributes?.title?.ja || 
                Object.values(manga.attributes?.title || {})[0] || 
                'Untitled Manga';

  const description = manga.attributes?.description?.en || 'No description available';
  const status = manga.attributes?.status || 'unknown';
  const year = manga.attributes?.year;
  const author = manga.relationships?.find(rel => rel.type === 'author')?.attributes?.name || 'Unknown Author';
  const artist = manga.relationships?.find(rel => rel.type === 'artist')?.attributes?.name || 'Unknown Artist';

  // Handle cover art with the EXACT same approach as MangaTile
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  let coverUrl = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
  
  if (coverArt?.attributes?.fileName) {
    const fileName = coverArt.attributes.fileName;
    const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
    
    // Check if we're in production
    const isProduction = typeof window !== 'undefined' && 
      (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
    
    console.log('Environment check:', {
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      isProduction: isProduction
    });
    
    if (isProduction) {
      // Try multiple public image proxy services (same as MangaTile)
      const proxyServices = [
        `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`,
        `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`,
        `https://imageproxy.pimg.tw/resize?url=${encodeURIComponent(directUrl)}&width=400`,
        directUrl // Fallback to direct URL
      ];
      
      coverUrl = proxyServices[0]; // Start with weserv.nl
      console.log('Using production proxy:', coverUrl);
    } else {
      // In development, use direct URL
      coverUrl = directUrl;
      console.log('Using development direct URL:', coverUrl);
    }
  }

  // Handle image loading errors with multiple fallbacks (same as MangaTile)
  const handleImageError = (e) => {
    const img = e.target;
    const currentSrc = img.src;
    
    if (coverArt?.attributes?.fileName && !currentSrc.includes('placeholder')) {
      const fileName = coverArt.attributes.fileName;
      const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
      
      // Try different proxy services in order (same as MangaTile)
      if (currentSrc.includes('weserv.nl')) {
        console.log('Trying wsrv proxy...');
        img.src = `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`;
      } else if (currentSrc.includes('wsrv.nl')) {
        console.log('Trying pimg proxy...');
        img.src = `https://imageproxy.pimg.tw/resize?url=${encodeURIComponent(directUrl)}&width=400`;
      } else if (currentSrc.includes('pimg.tw')) {
        console.log('Trying direct URL...');
        img.src = directUrl; // Try direct URL
      } else {
        // Final fallback to placeholder (same as MangaTile)
        console.log('Using placeholder fallback');
        img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
      }
    } else {
      img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'hiatus': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Manga Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={coverUrl}
              alt={title}
              className="w-64 h-96 object-cover rounded-lg shadow-md"
              onError={handleImageError}
              onLoad={(e) => {
                console.log('Image loaded successfully:', e.target.src);
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  <strong>Author:</strong> {author}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  <strong>Artist:</strong> {artist}
                </span>
              </div>

              {year && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    <strong>Year:</strong> {year}
                  </span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <BookOpen className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  <strong>Chapters:</strong> {chapters.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {manga.attributes?.tags?.slice(0, 10).map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag.attributes?.name?.en || 'Unknown Tag'}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {chapters.length > 0 && (
                <Link
                  to={`/read/${manga.id}/${chapters[0].id}`}
                  className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Reading
                </Link>
              )}
              
              <button className="flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                <Star className="h-5 w-5 mr-2" />
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
        
        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No chapters available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/read/${manga.id}/${chapter.id}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    Chapter {chapter.attributes?.chapter || 'Unknown'}
                    {chapter.attributes?.title && `: ${chapter.attributes.title}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {chapter.attributes?.pages} pages
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(chapter.attributes?.publishAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaDetail;