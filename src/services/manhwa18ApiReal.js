// Manhwa18 API Service - Using REAL MangaDx API for 18+ Korean manhwa
// This fetches REAL adult manhwa from MangaDx API, not mock data

import axios from 'axios';

// Check if we're in production (deployed)
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const api = axios.create({
  timeout: 15000,
});

// Helper function to make API requests (same as mangadexApi.js)
const makeApiRequest = async (endpoint, params = {}) => {
  if (isProduction) {
    // In production, use our proxy
    const mangadexUrl = `https://api.mangadex.org${endpoint}`;
    const urlWithParams = new URL(mangadexUrl);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => urlWithParams.searchParams.append(key, v));
      } else {
        urlWithParams.searchParams.append(key, value);
      }
    });
    
    const proxyUrl = `/api/manga?url=${encodeURIComponent(urlWithParams.toString())}`;
    return await api.get(proxyUrl);
  } else {
    // In development, make direct requests
    return await api.get(`https://api.mangadex.org${endpoint}`, { params });
  }
};

class Manhwa18Api {
  constructor() {
    console.log('Manhwa18Api initialized - using REAL MangaDx API');
  }

  // Get popular adult manhwa (18+ content) from REAL MangaDx API
  async getPopularManhwa(page = 1) {
    try {
      console.log(`Fetching REAL popular adult manhwa page ${page}...`);
      
      const limit = 12;
      const offset = (page - 1) * limit;
      
      // Parameters for REAL adult Korean manhwa from MangaDex
      const params = {
        limit,
        offset,
        'order[followedCount]': 'desc',
        'availableTranslatedLanguage[]': 'en',
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': ['erotica', 'pornographic'], // REAL adult content
        'originalLanguage[]': 'ko', // Korean manhwa only
        'hasAvailableChapters': 'true' // ONLY show manga with available chapters!
      };

      console.log('Fetching from MangaDex API with params:', params);
      const response = await makeApiRequest('/manga', params);
      
      if (!response.data || !response.data.data) {
        throw new Error('No data received from MangaDx API');
      }

      const mangaList = response.data.data;
      console.log(`Found ${mangaList.length} REAL adult manhwa from MangaDx`);

      // Transform REAL MangaDx data to our format
      const transformedData = mangaList.map(manga => {
        const title = manga.attributes?.title?.en || 
                     manga.attributes?.title?.['ja-ro'] || 
                     manga.attributes?.title?.ko ||
                     Object.values(manga.attributes?.title || {})[0] || 
                     'Untitled Manhwa';

        const description = manga.attributes?.description?.en || 
                           manga.attributes?.description?.ko ||
                           Object.values(manga.attributes?.description || {})[0] ||
                           'No description available';

        const coverArt = this.getCoverUrl(manga);
        const contentRating = manga.attributes?.contentRating || 'safe';
        const status = manga.attributes?.status || 'unknown';
        const year = manga.attributes?.year;
        
        // Get author and artist from relationships
        const author = manga.relationships?.find(rel => rel.type === 'author')?.attributes?.name || 'Unknown Author';
        const artist = manga.relationships?.find(rel => rel.type === 'artist')?.attributes?.name || 'Unknown Artist';
        
        // Get tags
        const tags = manga.attributes?.tags?.map(tag => tag.attributes?.name?.en).filter(Boolean) || ['Adult'];

        return {
          id: manga.id,
          title,
          description,
          coverArt,
          rating: contentRating === 'pornographic' ? 'R18+' : '18+',
          tags,
          isAdult: true,
          source: 'manhwa18',
          status,
          year,
          author,
          artist,
          contentRating
        };
      });

      return {
        data: transformedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(response.data.total / limit),
          hasNextPage: offset + limit < response.data.total
        }
      };
    } catch (error) {
      console.error('Error fetching REAL popular manhwa:', error);
      return { data: [], pagination: { currentPage: 1, totalPages: 0, hasNextPage: false } };
    }
  }

  // Search REAL adult manhwa from MangaDx
  async searchManhwa(query, page = 1) {
    try {
      console.log(`Searching REAL adult manhwa for: ${query}, page ${page}`);
      
      const limit = 12;
      const offset = (page - 1) * limit;
      
      const params = {
        title: query,
        limit,
        offset,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': ['erotica', 'pornographic'], // REAL adult content
        'originalLanguage[]': 'ko', // Korean manhwa only
        'hasAvailableChapters': 'true' // ONLY show manga with available chapters!
      };

      const response = await makeApiRequest('/manga', params);
      
      if (!response.data || !response.data.data) {
        throw new Error('No search results from MangaDx API');
      }

      const mangaList = response.data.data;
      console.log(`Found ${mangaList.length} REAL adult manhwa search results`);

      // Transform REAL MangaDx data to our format
      const transformedData = mangaList.map(manga => ({
        id: manga.id,
        title: manga.attributes?.title?.en || 
               manga.attributes?.title?.['ja-ro'] || 
               manga.attributes?.title?.ko ||
               Object.values(manga.attributes?.title || {})[0] || 
               'Untitled Manhwa',
        description: manga.attributes?.description?.en || 
                    manga.attributes?.description?.ko ||
                    Object.values(manga.attributes?.description || {})[0] ||
                    'No description available',
        coverArt: this.getCoverUrl(manga),
        rating: manga.attributes?.contentRating === 'pornographic' ? 'R18+' : '18+',
        tags: manga.attributes?.tags?.map(tag => tag.attributes?.name?.en).filter(Boolean) || ['Adult'],
        isAdult: true,
        source: 'manhwa18',
        contentRating: manga.attributes?.contentRating
      }));

      return {
        data: transformedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(response.data.total / limit),
          hasNextPage: offset + limit < response.data.total
        }
      };
    } catch (error) {
      console.error('Error searching REAL manhwa:', error);
      return { data: [], pagination: { currentPage: 1, totalPages: 0, hasNextPage: false } };
    }
  }

  // Get REAL manhwa details from MangaDex
  async getManhwaDetails(id) {
    try {
      console.log(`Fetching REAL manhwa details for: ${id}`);
      
      // Get manga details
      const mangaParams = {
        'includes[]': ['cover_art', 'author', 'artist']
      };
      
      const mangaResponse = await makeApiRequest(`/manga/${id}`, mangaParams);
      
      if (!mangaResponse.data || !mangaResponse.data.data) {
        throw new Error('Manhwa not found in MangaDex API');
      }

      const mangaData = mangaResponse.data.data;

      // Get chapters for this manhwa - fetch ALL chapters without language filter first
      let chaptersResponse;
      try {
        const chaptersParams = {
          'order[chapter]': 'asc',
          limit: 500,
          'contentRating[]': ['safe', 'suggestive', 'erotica', 'pornographic']
        };
        
        chaptersResponse = await makeApiRequest(`/manga/${id}/feed`, chaptersParams);
        console.log(`Chapter API response:`, chaptersResponse.data);
      } catch (chapterError) {
        console.error('Error fetching chapters:', chapterError);
        chaptersResponse = { data: { data: [] } };
      }

      const chapters = chaptersResponse.data?.data || [];
      console.log(`Found ${chapters.length} chapters for manhwa ${id}`);
      
      // Transform to our format
      const result = {
        id: mangaData.id,
        title: mangaData.attributes?.title?.en || 
               mangaData.attributes?.title?.['ja-ro'] || 
               mangaData.attributes?.title?.ko ||
               Object.values(mangaData.attributes?.title || {})[0] || 
               'Untitled Manhwa',
        description: mangaData.attributes?.description?.en || 
                    mangaData.attributes?.description?.ko ||
                    Object.values(mangaData.attributes?.description || {})[0] ||
                    'No description available',
        coverArt: this.getCoverUrl(mangaData),
        rating: mangaData.attributes?.contentRating === 'pornographic' ? 'R18+' : '18+',
        status: mangaData.attributes?.status || 'unknown',
        author: mangaData.relationships?.find(rel => rel.type === 'author')?.attributes?.name || 'Unknown Author',
        artist: mangaData.relationships?.find(rel => rel.type === 'artist')?.attributes?.name || 'Unknown Artist',
        tags: mangaData.attributes?.tags?.map(tag => tag.attributes?.name?.en).filter(Boolean) || ['Adult'],
        isAdult: true,
        source: 'manhwa18',
        contentRating: mangaData.attributes?.contentRating,
        chapters: chapters.map(chapter => ({
          id: chapter.id,
          title: chapter.attributes?.title || `Chapter ${chapter.attributes?.chapter || '?'}`,
          number: chapter.attributes?.chapter,
          language: chapter.attributes?.translatedLanguage,
          publishedAt: chapter.attributes?.publishAt || chapter.attributes?.createdAt,
          isAdult: true
        }))
      };
      
      console.log(`Returning manhwa with ${result.chapters.length} chapters`);
      return result;
    } catch (error) {
      console.error('Error fetching REAL manhwa details:', error);
      return null;
    }
  }

  // Get REAL chapter pages from MangaDx
  async getChapterPages(manhwaId, chapterId) {
    try {
      console.log(`Fetching REAL chapter pages for: ${manhwaId}/${chapterId}`);
      
      // Get chapter server info
      const response = await makeApiRequest(`/at-home/server/${chapterId}`);
      
      if (!response.data || !response.data.chapter) {
        throw new Error('Chapter pages not found in MangaDx API');
      }

      const pagesData = response.data;
      const baseUrl = pagesData.baseUrl;
      const chapterHash = pagesData.chapter.hash;
      const pageFiles = pagesData.chapter.data;
      
      // Check if we're in production
      const isProduction = typeof window !== 'undefined' && 
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      
      const pages = pageFiles.map((filename, index) => {
        const directUrl = `${baseUrl}/data/${chapterHash}/${filename}`;
        
        let pageUrl;
        if (isProduction) {
          // In production, use image proxy to avoid anti-hotlinking
          pageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=1200&h=1800&fit=inside&output=webp`;
        } else {
          // In development, use direct URL
          pageUrl = directUrl;
        }

        return {
          url: pageUrl,
          pageNumber: index + 1,
          isAdult: true
        };
      });

      console.log(`Found ${pages.length} REAL pages for chapter ${chapterId}`);

      return {
        pages: pages,
        isAdult: true,
        contentWarning: 'This chapter contains adult content intended for readers 18 years and older.'
      };
    } catch (error) {
      console.error('Error fetching REAL chapter pages:', error);
      return { pages: [], isAdult: true };
    }
  }

  // Helper function to get REAL cover URL from MangaDx
  getCoverUrl(manga) {
    const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
    let coverUrl = 'https://dummyimage.com/400x600/e5e7eb/9ca3af&text=No+Cover';
    
    if (coverArt?.attributes?.fileName) {
      const fileName = coverArt.attributes.fileName;
      const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
      
      // Check if we're in production
      const isProduction = typeof window !== 'undefined' && 
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      
      if (isProduction) {
        coverUrl = `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`;
      } else {
        coverUrl = directUrl;
      }
    }
    
    return coverUrl;
  }

  // Check if user has verified age for adult content
  isAgeVerified() {
    return localStorage.getItem('manhwa18_age_verified') === 'true';
  }

  // Set age verification status
  setAgeVerified(verified) {
    localStorage.setItem('manhwa18_age_verified', verified.toString());
  }
}

export default new Manhwa18Api();