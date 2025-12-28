import { Link } from 'react-router-dom';

const MangaTileUniversal = ({ manga }) => {
  // Handle both MangaDx format and simple format (for manhwa)
  const title = manga.title || // Simple format (manhwa)
                manga.attributes?.title?.en || 
                manga.attributes?.title?.['ja-ro'] || 
                manga.attributes?.title?.ja || 
                Object.values(manga.attributes?.title || {})[0] || 
                'Untitled Manga';

  const description = manga.description || // Simple format (manhwa)
                      manga.attributes?.description?.en || 
                      'No description available';
                      
  const status = manga.status || manga.attributes?.status || 'unknown';
  const year = manga.year || manga.attributes?.year;
  const author = manga.author || 
                 manga.relationships?.find(rel => rel.type === 'author')?.attributes?.name || 
                 'Unknown Author';
  const contentRating = manga.rating || manga.attributes?.contentRating || 'safe';
  
  // Handle cover art with multiple fallback strategies
  let coverUrl = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
  
  // Check if it's simple format (manhwa) with direct coverArt URL
  if (manga.coverArt && typeof manga.coverArt === 'string') {
    coverUrl = manga.coverArt;
  } else {
    // Handle MangaDx format
    const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
    
    if (coverArt?.attributes?.fileName) {
      const fileName = coverArt.attributes.fileName;
      const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
      
      // Check if we're in production
      const isProduction = typeof window !== 'undefined' && 
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      
      if (isProduction) {
        // Try multiple public image proxy services
        const proxyServices = [
          `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`,
          `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`,
          `https://imageproxy.pimg.tw/resize?url=${encodeURIComponent(directUrl)}&width=400`,
          directUrl // Fallback to direct URL
        ];
        
        coverUrl = proxyServices[0]; // Start with weserv.nl
      } else {
        // In development, use direct URL
        coverUrl = directUrl;
      }
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
      case 'R18+': return { text: '🔞', color: 'bg-red-700 text-white', title: 'Adult Content' };
      default: return null;
    }
  };

  // Handle image loading errors with multiple fallbacks
  const handleImageError = (e) => {
    const img = e.target;
    const currentSrc = img.src;
    
    // For simple format (manhwa), just use placeholder
    if (manga.coverArt && typeof manga.coverArt === 'string') {
      img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
      return;
    }
    
    // For MangaDx format, try different proxies
    const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
    if (coverArt?.attributes?.fileName && !currentSrc.includes('placeholder')) {
      const fileName = coverArt.attributes.fileName;
      const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
      
      // Try different proxy services in order
      if (currentSrc.includes('weserv.nl')) {
        img.src = `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`;
      } else if (currentSrc.includes('wsrv.nl')) {
        img.src = `https://imageproxy.pimg.tw/resize?url=${encodeURIComponent(directUrl)}&width=400`;
      } else if (currentSrc.includes('pimg.tw')) {
        img.src = directUrl; // Try direct URL
      } else {
        // Final fallback to placeholder
        img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
      }
    } else {
      img.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Cover';
    }
  };

  // Determine the correct link path based on source
  const linkPath = manga.source === 'manhwa18' 
    ? `/manga/manhwa18/${manga.id}` 
    : manga.source 
      ? `/manga/${manga.source}/${manga.id}` 
      : `/manga/${manga.id}`;

  return (
    <Link to={linkPath} className="group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Content Rating Badge */}
          {(() => {
            const badge = getContentRatingBadge(contentRating);
            return badge ? (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${badge.color}`} title={badge.title}>
                {badge.text}
              </div>
            ) : null;
          })()}
          
          {/* Adult Content Warning for manhwa */}
          {manga.isAdult && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              18+
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {year && <span>{year}</span>}
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>
          
          <div className="text-xs text-gray-500">
            <span className="font-medium">By:</span> {author}
          </div>
          
          {/* Source indicator */}
          {manga.source && (
            <div className="mt-2 text-xs text-gray-400">
              Source: {manga.source === 'manhwa18' ? '🔞 Manhwa18' : '📚 MangaDx'}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MangaTileUniversal;