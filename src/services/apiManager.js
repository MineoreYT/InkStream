// API Manager - Handles multiple manga sources
import { mangadexApi } from './mangadexApi';
import manhwa18Api from './manhwa18ApiReal';

// Available API sources
export const API_SOURCES = {
  MANGADX: 'mangadx',
  MANHWA18: 'manhwa18'
};

// Source configurations
const SOURCE_CONFIG = {
  [API_SOURCES.MANGADX]: {
    name: 'MangaDx',
    description: 'High-quality manga from MangaDx',
    api: mangadexApi,
    isAdult: true,
    icon: '📚',
    color: '#ff6b35'
  },
  [API_SOURCES.MANHWA18]: {
    name: 'Manhwa18',
    description: '18+ Korean manhwa (Adult content)',
    api: manhwa18Api,
    isAdult: true,
    icon: '🔞',
    color: '#e74c3c',
    requiresAgeVerification: true
  }
};

class ApiManager {
  constructor() {
    this.defaultSource = API_SOURCES.MANGADX;
    this.enabledSources = this.getEnabledSources();
  }

  // Get enabled sources from localStorage
  getEnabledSources() {
    const saved = localStorage.getItem('enabled_sources');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: MangaDx and Manhwa18 enabled
    return [API_SOURCES.MANGADX, API_SOURCES.MANHWA18];
  }

  // Save enabled sources to localStorage
  setEnabledSources(sources) {
    this.enabledSources = sources;
    localStorage.setItem('enabled_sources', JSON.stringify(sources));
  }

  // Get all available sources
  getAllSources() {
    return Object.keys(SOURCE_CONFIG).map(key => ({
      id: key,
      ...SOURCE_CONFIG[key]
    }));
  }

  // Get enabled sources only
  getActiveSources() {
    return this.enabledSources.map(sourceId => ({
      id: sourceId,
      ...SOURCE_CONFIG[sourceId]
    }));
  }

  // Get source configuration
  getSourceConfig(sourceId) {
    return SOURCE_CONFIG[sourceId];
  }

  // Check if source is adult content
  isAdultSource(sourceId) {
    return SOURCE_CONFIG[sourceId]?.isAdult || false;
  }

  // Check if source requires age verification
  requiresAgeVerification(sourceId) {
    return SOURCE_CONFIG[sourceId]?.requiresAgeVerification || false;
  }

  // Get API instance for source
  getApi(sourceId) {
    return SOURCE_CONFIG[sourceId]?.api;
  }

  // Search across multiple sources
  async searchAll(query, page = 1) {
    const results = [];
    const activeSources = this.getActiveSources();

    for (const source of activeSources) {
      try {
        // Skip adult sources if age not verified
        if (source.isAdult && !this.isAgeVerifiedForSource(source.id)) {
          continue;
        }

        const api = this.getApi(source.id);
        if (api && api.searchManga) {
          const result = await api.searchManga(query, page);
          
          // Add source info to each result
          if (result.data) {
            result.data = result.data.map(item => ({
              ...item,
              source: source.id,
              sourceName: source.name,
              isAdult: source.isAdult
            }));
          }
          
          results.push({
            source: source.id,
            sourceName: source.name,
            ...result
          });
        }
      } catch (error) {
        console.error(`Error searching ${source.name}:`, error);
      }
    }

    return results;
  }

  // Get popular manga from specific source
  async getPopular(sourceId, page = 1) {
    const source = this.getSourceConfig(sourceId);
    if (!source) {
      throw new Error(`Unknown source: ${sourceId}`);
    }

    // Check age verification for adult sources
    if (source.isAdult && !this.isAgeVerifiedForSource(sourceId)) {
      throw new Error('Age verification required for adult content');
    }

    const api = this.getApi(sourceId);
    if (!api) {
      throw new Error(`API not available for source: ${sourceId}`);
    }

    // Call appropriate method based on source
    if (sourceId === API_SOURCES.MANGADX) {
      return await api.getPopularManga(page);
    } else if (sourceId === API_SOURCES.MANHWA18) {
      return await api.getPopularManhwa(page);
    }

    throw new Error(`Popular method not implemented for source: ${sourceId}`);
  }

  // Get manga details from specific source
  async getMangaDetails(sourceId, mangaId) {
    const source = this.getSourceConfig(sourceId);
    if (!source) {
      throw new Error(`Unknown source: ${sourceId}`);
    }

    // Check age verification for adult sources
    if (source.isAdult && !this.isAgeVerifiedForSource(sourceId)) {
      throw new Error('Age verification required for adult content');
    }

    const api = this.getApi(sourceId);
    if (!api) {
      throw new Error(`API not available for source: ${sourceId}`);
    }

    // Call appropriate method based on source
    if (sourceId === API_SOURCES.MANGADX) {
      return await api.getMangaDetails(mangaId);
    } else if (sourceId === API_SOURCES.MANHWA18) {
      return await api.getManhwaDetails(mangaId);
    }

    throw new Error(`Details method not implemented for source: ${sourceId}`);
  }

  // Get chapter pages from specific source
  async getChapterPages(sourceId, mangaId, chapterId) {
    const source = this.getSourceConfig(sourceId);
    if (!source) {
      throw new Error(`Unknown source: ${sourceId}`);
    }

    // Check age verification for adult sources
    if (source.isAdult && !this.isAgeVerifiedForSource(sourceId)) {
      throw new Error('Age verification required for adult content');
    }

    const api = this.getApi(sourceId);
    if (!api) {
      throw new Error(`API not available for source: ${sourceId}`);
    }

    return await api.getChapterPages(mangaId, chapterId);
  }

  // Check age verification for specific source
  isAgeVerifiedForSource(sourceId) {
    if (!this.isAdultSource(sourceId)) {
      return true; // Non-adult sources don't need verification
    }

    const api = this.getApi(sourceId);
    return api && api.isAgeVerified ? api.isAgeVerified() : false;
  }

  // Set age verification for specific source
  setAgeVerificationForSource(sourceId, verified) {
    if (!this.isAdultSource(sourceId)) {
      return; // Non-adult sources don't need verification
    }

    const api = this.getApi(sourceId);
    if (api && api.setAgeVerified) {
      api.setAgeVerified(verified);
    }
  }

  // Enable/disable source
  toggleSource(sourceId, enabled) {
    if (enabled && !this.enabledSources.includes(sourceId)) {
      this.enabledSources.push(sourceId);
    } else if (!enabled) {
      this.enabledSources = this.enabledSources.filter(id => id !== sourceId);
    }
    
    this.setEnabledSources(this.enabledSources);
  }

  // Check if source is enabled
  isSourceEnabled(sourceId) {
    return this.enabledSources.includes(sourceId);
  }
}

export default new ApiManager();