import { Link } from 'react-router-dom';

const MangaCard = ({ manga }) => {
  // Simple title extraction with better fallbacks
  const title = manga.attributes?.title?.en || 
                manga.attributes?.title?.['ja-ro'] || 
                manga.attributes?.title?.ja || 
                Object.values(manga.attributes?.title || {})[0] || 
                'Untitled Manga';

  const description = manga.attributes?.description?.en || 'No description available';
  const status = manga.attributes?.status || 'unknown';
  const year = manga.attributes?.year;
  const author = manga.relationships?.find(rel => rel.type === 'author')?.attributes?.name || 'Unknown Author';
  const contentRating = manga.attributes?.contentRating || 'safe';
  
  // Get cover art with proper debugging and fallback
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  let coverUrl = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
  
  // Debug logging to see what's happening
  console.log('Manga title:', title);
  console.log('Manga ID:', manga.id);
  console.log('All relationships:', manga.relationships?.map(r => ({ type: r.type, hasAttributes: !!r.attributes })));
  console.log('Cover art relationship:', coverArt);
  
  if (coverArt?.attributes?.fileName) {
    const fileName = coverArt.attributes.fileName;
    // Remove any existing extension and add the correct one
    const baseFileName = fileName.replace(/\.[^/.]+$/, "");
    coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${baseFileName}.256.jpg`;
    console.log('Generated cover URL:', coverUrl);
  } else {
    console.log('No cover art fileName found for:', title);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'hiatus': return 'bg-yellow-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getContentRatingBadge = (rating) => {
    switch (rating) {
      case 'safe': return null; // No badge for safe content
      case 'suggestive': return { text: 'S', color: 'bg-yellow-500 text-white', title: 'Suggestive' };
      case 'erotica': return { text: '18+', color: 'bg-red-500 text-white', title: 'Erotica' };
      case 'pornographic': return { text: '🔞', color: 'bg-red-700 text-white', title: 'Pornographic' };
      default: return null;
    }
  };

  return (
    <Link to={`/manga/${manga.id}`} className="group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col space-y-1">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
              {status.toUpperCase()}
            </span>
            {getContentRatingBadge(contentRating) && (
              <span 
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getContentRatingBadge(contentRating).color}`}
                title={getContentRatingBadge(contentRating).title}
              >
                {getContentRatingBadge(contentRating).text}
              </span>
            )}
          </div>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs sm:text-sm font-medium truncate">{author}</p>
            {year && <p className="text-xs opacity-80">{year}</p>}
          </div>
        </div>
        
        <div className="p-3 sm:p-4 lg:p-5">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base lg:text-lg">
            {title}
          </h3>
          
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {description.length > 80 ? `${description.substring(0, 80)}...` : description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full"></div>
              <span className="text-xs font-medium text-gray-500">READ NOW</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;