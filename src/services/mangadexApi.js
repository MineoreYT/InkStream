import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

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
        
      const response = await api.get('/manga', {
        params: {
          limit,
          offset,
          'order[followedCount]': 'desc',
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': contentRatings,
          'availableTranslatedLanguage[]': 'en',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch popular manga');
    }
  },

  // Get latest manga
  getLatestManga: async (limit = 20, offset = 0, includeNSFW = false) => {
    try {
      const contentRatings = includeNSFW 
        ? ['safe', 'suggestive', 'erotica', 'pornographic']
        : ['safe', 'suggestive'];
        
      const response = await api.get('/manga', {
        params: {
          limit,
          offset,
          'order[latestUploadedChapter]': 'desc',
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': contentRatings,
          'availableTranslatedLanguage[]': 'en',
        },
      });
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
      const tagsResponse = await api.get('/manga/tag');
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
        const response = await api.get('/manga', {
          params: {
            limit,
            offset,
            title: tag,
            'includes[]': ['cover_art', 'author', 'artist'],
            'contentRating[]': contentRatings,
          },
        });
        return response.data;
      }
      
      // Use the found tag ID
      const response = await api.get('/manga', {
        params: {
          limit,
          offset,
          'includedTags[]': foundTag.id,
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': contentRatings,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`Failed to fetch manga for category: ${tag}`);
    }
  },

  // Get manga details
  getMangaById: async (id) => {
    try {
      const response = await api.get(`/manga/${id}`, {
        params: {
          'includes[]': ['cover_art', 'author', 'artist'],
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manga details');
    }
  },

  // Get manga chapters
  getMangaChapters: async (mangaId, limit = 100, offset = 0) => {
    try {
      const response = await api.get('/chapter', {
        params: {
          manga: mangaId,
          limit,
          offset,
          'order[chapter]': 'asc',
          'translatedLanguage[]': 'en',
          'includes[]': ['scanlation_group'],
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch manga chapters');
    }
  },

  // Get chapter pages
  getChapterPages: async (chapterId) => {
    try {
      const response = await api.get(`/at-home/server/${chapterId}`);
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
        
      const response = await api.get('/manga', {
        params: {
          title: query,
          limit,
          offset,
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': contentRatings,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search manga');
    }
  },

  // Get all tags
  getTags: async () => {
    try {
      const response = await api.get('/manga/tag');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch tags');
    }
  },

  // Get NSFW manga only
  getNSFWManga: async (limit = 20, offset = 0) => {
    try {
      const response = await api.get('/manga', {
        params: {
          limit,
          offset,
          'order[followedCount]': 'desc',
          'includes[]': ['cover_art', 'author', 'artist'],
          'contentRating[]': ['erotica', 'pornographic'],
          'availableTranslatedLanguage[]': 'en',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch NSFW manga');
    }
  },
};

export default mangadexApi;