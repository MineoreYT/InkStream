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
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getTitle = (titleObj) => {
    if (!titleObj) return 'Unknown Title';
    
    // Try different language codes in order of preference
    const languages = ['en', 'ja', 'ja-ro', 'ko', 'zh', 'zh-hk'];
    
    for (const lang of languages) {
      if (titleObj[lang] && titleObj[lang].trim()) {
        return titleObj[lang].trim();
      }
    }
    
    // If no preferred language found, get the first available title
    const availableTitles = Object.values(titleObj).filter(title => title && title.trim());
    return availableTitles.length > 0 ? availableTitles[0].trim() : 'Unknown Title';
  };

  const title = getTitle(manga.attributes?.title);
  const description = manga.attributes?.description?.en || 
                     manga.attributes?.description?.ja || 
                     Object.values(manga.attributes?.description || {})[0] || 
                     'No description available';
  const status = manga.attributes?.status || 'unknown';
  const year = manga.attributes?.year;
  const tags = manga.attributes?.tags || [];
  
  const authorRel = manga.relationships?.find(rel => rel.type === 'author');
  const artistRel = manga.relationships?.find(rel => rel.type === 'artist');
  const author = authorRel?.attributes?.name || 'Unknown Author';
  const artist = artistRel?.attributes?.name || 'Unknown Artist';
  
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  const coverUrl = coverArt 
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes?.fileName}`
    : '/placeholder-manga.jpg';

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
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
              }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Author: {author}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Artist: {artist}</span>
              </div>
              {year && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Year: {year}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600">
                <BookOpen className="h-5 w-5" />
                <span>Chapters: {chapters.length}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
            
            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.attributes.name.en}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              {chapters.length > 0 && (
                <Link
                  to={`/read/${manga.id}/${chapters[0].id}`}
                  className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Reading</span>
                </Link>
              )}
              <button className="flex items-center space-x-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors">
                <Star className="h-5 w-5" />
                <span>Add to Favorites</span>
              </button>
            </div>
            
            {/* Note about chapter availability */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Chapter Availability Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Some chapters may not be available due to licensing restrictions, regional blocks, or upload issues. 
                    If you encounter reading errors, try different chapters or check back later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Chapters</h2>
        
        {chapters.length === 0 ? (
          <p className="text-gray-600">No chapters available</p>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> If a chapter fails to load, try another chapter or refresh the page. 
                Chapter availability depends on MangaDx servers and regional restrictions.
              </p>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.id}
                  to={`/read/${manga.id}/${chapter.id}`}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      Chapter {chapter.attributes.chapter}
                      {chapter.attributes.title && `: ${chapter.attributes.title}`}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{chapter.attributes.pages} pages</span>
                      {chapter.attributes.translatedLanguage && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {chapter.attributes.translatedLanguage.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                    </div>
                    {index === 0 && (
                      <span className="text-xs text-green-600 font-medium">Latest</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MangaDetail;