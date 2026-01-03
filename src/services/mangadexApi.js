import axios from 'axios';

// Check if we're in production (deployed)
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const BASE_URL = isProduction ? '/api/manga' : 'https://api.mangadex.org';

const api = axios.create({
  timeout: 15000,
});

// Helper function to make API requests
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

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const mangadexApi = {
  // Get popular manga
  getPopularManga: async (limit = 20, offset = 0, includeNSFW = false) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      const params = {
        limit,
        offset,
        'order[followedCount]': 'desc',
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': contentRatings,
        'availableTranslatedLanguage[]': 'en',
      };

      const response = await makeApiRequest('/manga', params);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch popular manga');
    }
  },

  // Get latest manga
  getLatestManga: async (limit = 20, offset = 0, includeNSFW = true) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      const params = {
        limit,
        offset,
        'order[latestUploadedChapter]': 'desc',
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': contentRatings,
        'availableTranslatedLanguage[]': 'en',
      };

      const response = await makeApiRequest('/manga', params);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch latest manga');
    }
  },

  // Get manga by category/tag
  getMangaByTag: async (tag, limit = 20, offset = 0, includeNSFW = false) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      // First get all tags to find the correct tag ID
      const tagsResponse = await makeApiRequest('/manga/tag', {});
      const tags = tagsResponse.data.data || [];
      
      // Find the tag by name (case insensitive)
      const foundTag = tags.find(t => 
        t.attributes.name.en?.toLowerCase() === tag.toLowerCase() ||
        Object.values(t.attributes.name).some(name => 
          name?.toLowerCase() === tag.toLowerCase()
        )
      );
      
      if (!foundTag) {
        // If tag not found, try searching by title instead
        const params = {
          limit,
          offset,
          title: tag,
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': contentRatings,
        };
        const response = await makeApiRequest('/manga', params);
        return response.data;
      }
      
      // Use the found tag ID
      const params = {
        limit,
        offset,
        'includedTags[]': foundTag.id,
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': contentRatings,
      };
      const response = await makeApiRequest('/manga', params);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`Failed to fetch manga for category: ${tag}`);
    }
  },

  // Get manga details
  getMangaById: async (id) => {
    try {
      const params = {
        'includes[]': ['cover_art', 'author', 'artist'],
      };
      const response = await makeApiRequest(`/manga/${id}`, params);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manga details');
    }
  },

  // Get manga chapters
  getMangaChapters: async (mangaId, limit = 100, offset = 0, includeNSFW = true) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      // Only get English chapters
      const params = {
        manga: mangaId,
        limit,
        offset,
        'order[chapter]': 'asc',
        'translatedLanguage[]': 'en', // Only English
        'includes[]': ['scanlation_group'],
        'contentRating[]': contentRatings,
      };
      
      const response = await makeApiRequest('/chapter', params);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manga chapters');
    }
  },

  // Get chapter pages
  getChapterPages: async (chapterId) => {
    try {
      const response = await makeApiRequest(`/at-home/server/${chapterId}`, {});
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch chapter pages');
    }
  },

  // Search manga
  searchManga: async (query, limit = 20, offset = 0, includeNSFW = false) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      const params = {
        title: query,
        limit,
        offset,
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': contentRatings,
      };
      const response = await makeApiRequest('/manga', params);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search manga');
    }
  },

  // Get all tags
  getTags: async () => {
    try {
      const response = await makeApiRequest('/manga/tag', {});
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch tags');
    }
  },

  // Get NSFW manga only
  getNSFWManga: async (limit = 20, offset = 0) => {
    try {
      const params = {
        limit,
        offset,
        'order[followedCount]': 'desc',
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': ['erotica', 'pornographic'],
        'availableTranslatedLanguage[]': 'en',
      };
      const response = await makeApiRequest('/manga', params);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch NSFW manga');
    }
  },
};

export default mangadexApi;