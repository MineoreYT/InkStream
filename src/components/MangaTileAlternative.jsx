import { Link } from 'react-router-dom';

const MangaTile = ({ manga }) => {
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
  const contentRating = manga.attributes?.contentRating || 'safe';
  
  // Handle cover art with multiple MangaDx endpoints and public proxies
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  let coverUrl = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
  
  if (coverArt?.attributes?.fileName) {
    const fileName = coverArt.attributes.fileName;
    const mangaId = manga.id;
    
    // Check if we're in production
    const isProduction = typeof window !== 'undefined' && 
      (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
    
    if (isProduction) {
      // For production, use public image proxy with the best MangaDx endpoint
      const baseFileName = fileName.replace(/\.[^/.]+$/, "");
      const directUrl = `https://uploads.mangadx.org/covers/${mangaId}/${baseFileName}.256.jpg`;
      
      // Use weserv.nl as it's very reliable
      coverUrl = `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=300&h=400&fit=cover&output=webp`;
    } else {
      // In development, try the original filename first
      coverUrl = `https://uploads.mangadx.org/covers/${mangaId}/${fileName}`;
    }
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
      case 'safe': return null;
      case 'suggestive': return { text: 'S', color: 'bg-yellow-500 text-white', title: 'Suggestive' };
      case 'erotica': return { text: '18+', color: 'bg-red-500 text-white', title: 'Erotica' };
      case 'pornographic': return { text: '🔞', color: 'bg-red-700 text-white', title: 'Pornographic' };
      default: return null;
    }
  };

  // Handle image loading errors with comprehensive fallbacks
  const handleImageError = (e) => {
    const img = e.target;
    const currentSrc = img.src;
    
    if (coverArt?.attributes?.fileName && !currentSrc.includes('placeholder')) {
      const fileName = coverArt.attributes.fileName;
      const mangaId = manga.id;
      const baseFileName = fileName.replace(/\.[^/.]+$/, "");
      
      // Try different strategies based on current URL
      if (currentSrc.includes('weserv.nl')) {
        // Try different MangaDx endpoint with different proxy
        const altUrl = `https://uploads.mangadx.org/covers/${mangaId}/${fileName}`;
        img.src = `https://wsrv.nl/?url=${encodeURIComponent(altUrl)}&w=300&h=400&fit=cover`;
      } else if (currentSrc.includes('wsrv.nl')) {
        // Try .512.jpg version
        const url512 = `https://uploads.mangadx.org/covers/${mangaId}/${baseFileName}.512.jpg`;
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(url512)}&w=300&h=400&fit=cover`;
      } else if (currentSrc.includes('512.jpg')) {
        // Try original filename
        const originalUrl = `https://uploads.mangadx.org/covers/${mangaId}/${fileName}`;
        img.src = originalUrl;
      } else {
        // Final fallback
        img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
      }
    } else {
      img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
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
            onError={handleImageError}
            loading="lazy"
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

export default MangaTile;