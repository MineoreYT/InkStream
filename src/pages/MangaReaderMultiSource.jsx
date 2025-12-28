import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiManager, { API_SOURCES } from '../services/apiManager';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const MangaReaderMultiSource = () => {
  const { source, mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitToScreen, setFitToScreen] = useState(true);

  // Determine the actual source and manga ID
  const actualSource = source || API_SOURCES.MANGADX;
  const actualMangaId = source ? mangaId : source; // Handle both /read/mangaId/chapterId and /read/source/mangaId/chapterId
  const actualChapterId = source ? chapterId : mangaId; // Handle both formats

  // Check if this is a manhwa (long page format)
  const isManhwa = actualSource === API_SOURCES.MANHWA18;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCurrentPage(0); // Reset to first page when chapter changes
        
        if (actualSource === API_SOURCES.MANHWA18) {
          // Handle manhwa18 source
          const [manhwaDetails, pagesData] = await Promise.all([
            apiManager.getMangaDetails(actualSource, actualMangaId),
            apiManager.getChapterPages(actualSource, actualMangaId, actualChapterId)
          ]);
          
          // Set chapters from manhwa details
          const chapters = manhwaDetails?.chapters || [];
          setAllChapters(chapters);
          
          // Find current chapter index
          const currentIndex = chapters.findIndex(ch => ch.id === actualChapterId);
          setCurrentChapterIndex(currentIndex);
          
          // Set pages from manhwa18 API
          if (pagesData?.pages) {
            const pageUrls = pagesData.pages.map(page => page.url);
            setPages(pageUrls);
            setChapterInfo({ title: chapters[currentIndex]?.title || 'Chapter' });
          }
        } else {
          // Handle MangaDx source (original logic)
          const [chaptersData, pagesData] = await Promise.all([
            apiManager.getApi(API_SOURCES.MANGADX).getMangaChapters(actualMangaId),
            apiManager.getApi(API_SOURCES.MANGADX).getChapterPages(actualChapterId)
          ]);
          
          // Set chapters
          const chapters = chaptersData.data || [];
          setAllChapters(chapters);
          
          // Find current chapter index
          const currentIndex = chapters.findIndex(ch => ch.id === actualChapterId);
          setCurrentChapterIndex(currentIndex);
          
          // Set pages with proxy for production
          if (pagesData.chapter && pagesData.chapter.data) {
            const baseUrl = pagesData.baseUrl;
            const chapterHash = pagesData.chapter.hash;
            const pageFiles = pagesData.chapter.data;
            
            // Check if we're in production
            const isProduction = typeof window !== 'undefined' && 
              (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
            
            const pageUrls = pageFiles.map(filename => {
              const directUrl = `${baseUrl}/data/${chapterHash}/${filename}`;
              
              if (isProduction) {
                // In production, use wsrv.nl proxy (more reliable for MangaDex images)
                return `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&n=-1`;
              } else {
                // In development, use direct URL
                return directUrl;
              }
            });
            
            setPages(pageUrls);
            setChapterInfo(pagesData.chapter);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching chapter data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (actualChapterId && actualMangaId) {
      fetchData();
    }
  }, [actualChapterId, actualMangaId, actualSource]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
    setFitToScreen(false);
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    setFitToScreen(false);
  };

  const toggleFitToScreen = () => {
    setFitToScreen(!fitToScreen);
    if (!fitToScreen) {
      setZoomLevel(1);
    }
  };

  const nextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      // Scroll to top when changing chapters
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (actualSource === API_SOURCES.MANHWA18) {
        navigate(`/read/${actualSource}/${actualMangaId}/${nextChapter.id}`);
      } else {
        navigate(`/read/${actualMangaId}/${nextChapter.id}`);
      }
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      // Scroll to top when changing chapters
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (actualSource === API_SOURCES.MANHWA18) {
        navigate(`/read/${actualSource}/${actualMangaId}/${prevChapter.id}`);
      } else {
        navigate(`/read/${actualMangaId}/${prevChapter.id}`);
      }
    }
  };

  const goBackToDetails = () => {
    if (actualSource === API_SOURCES.MANHWA18) {
      navigate(`/manga/${actualSource}/${actualMangaId}`);
    } else {
      navigate(`/manga/${actualMangaId}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'Escape') goBackToDetails();
    if (e.key === '=' || e.key === '+') zoomIn();
    if (e.key === '-') zoomOut();
    if (e.key === '0') toggleFitToScreen();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, pages.length, actualMangaId, actualSource]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800 p-3 sm:p-4 flex items-center justify-between z-50">
          <button
            onClick={goBackToDetails}
            className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Details</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-sm sm:text-lg font-semibold">Chapter Error</h1>
          </div>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Error Content */}
        <div className="pt-20 min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Chapter Not Available</h2>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3 text-yellow-400">⚠️ Why is this happening?</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Chapter may not be uploaded yet</li>
                <li>• Content might be region-restricted</li>
                <li>• Temporary server issues</li>
                <li>• Chapter was removed by the uploader</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={goBackToDetails}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Back to Details
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <p className="text-xs text-gray-400 mt-4">
                If this problem persists, try checking other chapters.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentChapter = allChapters[currentChapterIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 p-3 sm:p-4 flex items-center justify-between z-50">
        <button
          onClick={goBackToDetails}
          className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5" />
          <span className="text-sm sm:text-base">Back to Details</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-sm sm:text-lg font-semibold">
            {currentChapter?.attributes?.title || currentChapter?.title || `Chapter ${currentChapter?.attributes?.chapter || currentChapter?.number}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Page {currentPage + 1} of {pages.length}
          </p>
          {!isManhwa && (
            <p className="hidden lg:block text-xs text-gray-500 mt-1">
              Use +/- to zoom, 0 to fit screen, ← → for pages
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Zoom Controls - Desktop only and not for manhwa */}
          {!isManhwa && (
            <div className="hidden lg:flex items-center space-x-1 mr-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-300 min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFitToScreen}
                className={`p-1.5 rounded-lg transition-colors ${
                  fitToScreen ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Fit to Screen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Page Content - Different layout for manhwa vs manga */}
      <div className="pt-16 sm:pt-20 pb-20 sm:pb-24 min-h-screen">
        {isManhwa ? (
          // Manhwa layout - Full width, long pages, vertical scrolling
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="w-full mx-auto shadow-2xl rounded-lg transition-all duration-300"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }}
              onError={(e) => {
                const img = e.target;
                const currentSrc = img.src;
                
                // Try different fallback strategies
                if (currentSrc.includes('wsrv.nl')) {
                  // If wsrv.nl failed, try weserv.nl
                  const originalUrl = decodeURIComponent(currentSrc.split('url=')[1].split('&')[0]);
                  img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&output=webp`;
                } else if (currentSrc.includes('weserv.nl')) {
                  // If weserv.nl also failed, try direct URL
                  const originalUrl = decodeURIComponent(currentSrc.split('url=')[1].split('&')[0]);
                  img.src = originalUrl;
                } else {
                  // Final fallback to placeholder
                  img.src = 'https://via.placeholder.com/800x1200/374151/9ca3af?text=Page+Unavailable';
                }
              }}
            />
          </div>
        ) : (
          // Regular manga layout - Responsive size container with zoom
          <div className="flex items-center justify-center overflow-auto">
            <div className={`w-full px-2 sm:px-4 ${
              fitToScreen 
                ? 'max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl' 
                : 'max-w-none'
            }`}>
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className={`mx-auto shadow-2xl rounded-lg transition-all duration-300 ${
                  fitToScreen 
                    ? 'w-full max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh] xl:max-h-[90vh] object-contain' 
                    : 'object-contain cursor-move'
                }`}
                style={!fitToScreen ? { 
                  transform: `scale(${zoomLevel})`,
                  maxWidth: 'none',
                  maxHeight: 'none'
                } : {}}
                onError={(e) => {
                  const img = e.target;
                  const currentSrc = img.src;
                  
                  // Try different fallback strategies
                  if (currentSrc.includes('wsrv.nl')) {
                    // If wsrv.nl failed, try weserv.nl
                    const originalUrl = decodeURIComponent(currentSrc.split('url=')[1].split('&')[0]);
                    img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&output=webp`;
                  } else if (currentSrc.includes('weserv.nl')) {
                    // If weserv.nl also failed, try direct URL
                    const originalUrl = decodeURIComponent(currentSrc.split('url=')[1].split('&')[0]);
                    img.src = originalUrl;
                  } else {
                    // Final fallback to placeholder
                    img.src = 'https://via.placeholder.com/800x1200/374151/9ca3af?text=Page+Unavailable';
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 sm:p-4 z-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={prevChapter}
            disabled={currentChapterIndex === 0}
            className="flex items-center space-x-1 sm:space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-2 sm:px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4" />
            <span className="text-xs sm:text-sm">Prev Chapter</span>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-400">
              {currentPage + 1} / {pages.length}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <button
            onClick={nextChapter}
            disabled={currentChapterIndex === allChapters.length - 1}
            className="flex items-center space-x-1 sm:space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-2 sm:px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-xs sm:text-sm">Next Chapter</span>
            <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MangaReaderMultiSource;