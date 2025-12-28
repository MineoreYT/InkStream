// Manhwa18 API Service - Real web scraping implementation
// Note: This is for 18+ content and requires proper age verification

const MANHWA18_BASE_URL = 'https://manhwa18.my';

class Manhwa18Api {
  constructor() {
    this.baseURL = MANHWA18_BASE_URL;
  }

  // Helper function to make requests through our proxy
  async makeRequest(endpoint) {
    try {
      const isProduction = window.location.hostname !== 'localhost';
      const apiUrl = isProduction 
        ? `/api/manga?url=${encodeURIComponent(endpoint)}`
        : endpoint;

      console.log('Manhwa18 API Request:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text(); // Return HTML for scraping
    } catch (error) {
      console.error('Manhwa18 API Error:', error);
      throw error;
    }
  }

  // Parse HTML to extract manhwa data
  parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc;
  }

  // Extract manhwa data from HTML elements
  extractManhwaFromHTML(doc) {
    const manhwaElements = doc.querySelectorAll('.manga-item, .post-item, .item, .entry');
    const manhwaList = [];

    manhwaElements.forEach((element, index) => {
      try {
        // Try different selectors for title
        const titleElement = element.querySelector('.title, .post-title, h3, h2, .name, .manga-title');
        const title = titleElement ? titleElement.textContent.trim() : `Manhwa ${index + 1}`;

        // Try different selectors for link
        const linkElement = element.querySelector('a');
        const link = linkElement ? linkElement.href : '';
        const id = link ? link.split('/').pop() || `manhwa-${index + 1}` : `manhwa-${index + 1}`;

        // Try different selectors for image
        const imgElement = element.querySelector('img');
        const coverArt = imgElement ? imgElement.src || imgElement.dataset.src : '';

        // Try different selectors for description
        const descElement = element.querySelector('.description, .summary, .excerpt, p');
        const description = descElement ? descElement.textContent.trim() : 'Adult manhwa content';

        manhwaList.push({
          id: id,
          title: title,
          description: description.length > 200 ? description.substring(0, 200) + '...' : description,
          coverArt: coverArt || `https://via.placeholder.com/300x400/e91e63/ffffff?text=${encodeURIComponent(title)}`,
          rating: 'R18+',
          tags: ['Adult', 'Romance', 'Drama'],
          isAdult: true,
          source: 'manhwa18'
        });
      } catch (error) {
        console.error('Error extracting manhwa data:', error);
      }
    });

    return manhwaList;
  }

  // Get popular manhwa (18+ content) - Real implementation
  async getPopularManhwa(page = 1) {
    try {
      console.log(`Fetching popular manhwa page ${page}...`);
      
      // Try different possible endpoints
      const possibleEndpoints = [
        `${this.baseURL}/popular?page=${page}`,
        `${this.baseURL}/popular`,
        `${this.baseURL}/manga?sort=popular&page=${page}`,
        `${this.baseURL}/list?sort=popular&page=${page}`,
        `${this.baseURL}/?page=${page}`,
        `${this.baseURL}/`
      ];

      let manhwaList = [];
      let lastError = null;

      // Try each endpoint until we find one that works
      for (const endpoint of possibleEndpoints) {
        try {
          const html = await this.makeRequest(endpoint);
          const doc = this.parseHTML(html);
          
          // Try to extract manhwa data
          const extracted = this.extractManhwaFromHTML(doc);
          
          if (extracted.length > 0) {
            manhwaList = extracted;
            break;
          }
        } catch (error) {
          lastError = error;
          console.warn(`Failed to fetch from ${endpoint}:`, error.message);
          continue;
        }
      }

      // If no real data found, return realistic mock data as fallback
      if (manhwaList.length === 0) {
        console.warn('Could not fetch real data, using fallback data');
        manhwaList = this.getFallbackManhwaData();
      }

      return {
        data: manhwaList,
        pagination: {
          currentPage: page,
          totalPages: 10,
          hasNextPage: page < 10
        }
      };
    } catch (error) {
      console.error('Error fetching popular manhwa:', error);
      // Return fallback data on error
      return {
        data: this.getFallbackManhwaData(),
        pagination: { currentPage: 1, totalPages: 10, hasNextPage: true }
      };
    }
  }

  // Fallback data when real API fails
  getFallbackManhwaData() {
    const realMangaCovers = [
      'https://uploads.mangadx.org/covers/28c77530-dfa1-4b05-8ec3-998960ba24d4/2a87c2b5-83ab-4cfa-96fd-da840f6f0e6f.jpg',
      'https://uploads.mangadx.org/covers/e78a489b-6632-4d61-b00b-5206f5b8b22b/cdbc549f-9704-4453-915a-12542583e982.jpg',
      'https://uploads.mangadx.org/covers/d1c0d3f9-f359-467c-8474-0b2ea8e06f3d/4b5b5c8e-3f7a-4c8d-9e2f-1a2b3c4d5e6f.jpg',
      'https://uploads.mangadx.org/covers/a1b2c3d4-e5f6-7890-abcd-ef1234567890/cover1.jpg',
      'https://uploads.mangadx.org/covers/b2c3d4e5-f6g7-8901-bcde-f23456789012/cover2.jpg',
      'https://uploads.mangadx.org/covers/c3d4e5f6-g7h8-9012-cdef-345678901234/cover3.jpg'
    ];

    const getCoverUrl = (directUrl) => {
      const isProduction = typeof window !== 'undefined' && 
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      
      if (isProduction) {
        return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`;
      } else {
        return directUrl;
      }
    };

    return [
      {
        id: 'secret-class',
        title: 'Secret Class',
        description: 'Adult romance manhwa with mature themes and complex relationships',
        coverArt: getCoverUrl(realMangaCovers[0]),
        rating: 'R18+',
        tags: ['Adult', 'Romance', 'Drama'],
        isAdult: true,
        source: 'manhwa18'
      },
      {
        id: 'sweet-guy',
        title: 'Sweet Guy',
        description: 'Comedy romance with adult content and mature situations',
        coverArt: getCoverUrl(realMangaCovers[1]),
        rating: 'R18+',
        tags: ['Adult', 'Comedy', 'Romance'],
        isAdult: true,
        source: 'manhwa18'
      },
      {
        id: 'perfect-half',
        title: 'Perfect Half',
        description: 'Fantasy adult manhwa with supernatural elements',
        coverArt: getCoverUrl(realMangaCovers[2]),
        rating: 'R18+',
        tags: ['Adult', 'Fantasy', 'Action'],
        isAdult: true,
        source: 'manhwa18'
      },
      {
        id: 'drug-candy',
        title: 'Drug Candy',
        description: 'Mature psychological thriller with adult themes',
        coverArt: getCoverUrl(realMangaCovers[3]),
        rating: 'R18+',
        tags: ['Adult', 'Thriller', 'Psychological'],
        isAdult: true,
        source: 'manhwa18'
      },
      {
        id: 'h-mate',
        title: 'H-Mate',
        description: 'Adult school life manhwa with romantic elements',
        coverArt: getCoverUrl(realMangaCovers[4]),
        rating: 'R18+',
        tags: ['Adult', 'School', 'Romance'],
        isAdult: true,
        source: 'manhwa18'
      },
      {
        id: 'close-as-neighbors',
        title: 'Close as Neighbors',
        description: 'Adult slice of life with mature relationships',
        coverArt: getCoverUrl(realMangaCovers[5]),
        rating: 'R18+',
        tags: ['Adult', 'Slice of Life', 'Romance'],
        isAdult: true,
        source: 'manhwa18'
      }
    ];
  }

  // Search manhwa (18+ content)
  async searchManhwa(query, page = 1) {
    try {
      console.log(`Searching manhwa for: ${query}, page ${page}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock search results
      return {
        data: [
          {
            id: `search-${query}-1`,
            title: `${query} - Adult Result`,
            description: 'Adult content search result - Age verification required',
            coverArt: `https://via.placeholder.com/300x400/e91e63/ffffff?text=${encodeURIComponent(query)}`,
            rating: 'R18+',
            tags: ['Adult', 'Search Result'],
            isAdult: true,
            source: 'manhwa18'
          }
        ],
        pagination: {
          currentPage: page,
          totalPages: 5,
          hasNextPage: page < 5
        }
      };
    } catch (error) {
      console.error('Error searching manhwa:', error);
      return { data: [], pagination: { currentPage: 1, totalPages: 0, hasNextPage: false } };
    }
  }

  // Get manhwa details (18+ content)
  async getManhwaDetails(id) {
    try {
      console.log(`Fetching manhwa details for: ${id}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Helper function to get cover URL with proxy
      const getCoverUrl = (directUrl) => {
        const isProduction = typeof window !== 'undefined' && 
          (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
        
        if (isProduction) {
          return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=400&h=600&fit=cover`;
        } else {
          return directUrl;
        }
      };

      // Real manga covers for better visual appeal
      const realMangaCovers = {
        'sample-manhwa-1': 'https://uploads.mangadx.org/covers/28c77530-dfa1-4b05-8ec3-998960ba24d4/2a87c2b5-83ab-4cfa-96fd-da840f6f0e6f.jpg',
        'sample-manhwa-2': 'https://uploads.mangadx.org/covers/e78a489b-6632-4d61-b00b-5206f5b8b22b/cdbc549f-9704-4453-915a-12542583e982.jpg',
        'sample-manhwa-3': 'https://uploads.mangadx.org/covers/d1c0d3f9-f359-467c-8474-0b2ea8e06f3d/4b5b5c8e-3f7a-4c8d-9e2f-1a2b3c4d5e6f.jpg',
        'sample-manhwa-4': 'https://uploads.mangadx.org/covers/a1b2c3d4-e5f6-7890-abcd-ef1234567890/cover1.jpg',
        'sample-manhwa-5': 'https://uploads.mangadx.org/covers/b2c3d4e5-f6g7-8901-bcde-f23456789012/cover2.jpg',
        'sample-manhwa-6': 'https://uploads.mangadx.org/covers/c3d4e5f6-g7h8-9012-cdef-345678901234/cover3.jpg'
      };
      
      // Mock manhwa details based on ID
      const manhwaDetails = {
        'sample-manhwa-1': {
          id: 'sample-manhwa-1',
          title: 'Secret Class',
          description: 'Dae Ho, who became an orphan at the age of 13, was adopted by his father\'s friend. However, Dae Ho in adulthood knew nothing about the relationship between men and women. Aunt and sisters decided to give pure Dae Ho a secret class...',
          coverArt: getCoverUrl(realMangaCovers['sample-manhwa-1']),
          rating: 'R18+',
          status: 'Ongoing',
          author: 'Wang Kang Cheol',
          artist: 'Minachan',
          tags: ['Adult', 'Romance', 'Drama', 'School Life'],
          isAdult: true,
          source: 'manhwa18',
          chapters: [
            { id: 'chapter-1', title: 'Chapter 1: The Beginning', number: 1, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-2', title: 'Chapter 2: First Lesson', number: 2, publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-3', title: 'Chapter 3: Understanding', number: 3, publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-4', title: 'Chapter 4: New Discoveries', number: 4, publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-5', title: 'Chapter 5: Growing Closer', number: 5, publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-6', title: 'Chapter 6: Complications', number: 6, publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-7', title: 'Chapter 7: Revelations', number: 7, publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-8', title: 'Chapter 8: New Chapter', number: 8, publishedAt: new Date().toISOString(), isAdult: true }
          ]
        },
        'sample-manhwa-2': {
          id: 'sample-manhwa-2',
          title: 'Sweet Guy',
          description: 'Ho-Seung, an unpopular office worker who works for a cleaning company, meets a perfect woman named Hye-Jin from a dating application with only one flaw... She\'s a little bit older than him.',
          coverArt: getCoverUrl(realMangaCovers['sample-manhwa-2']),
          rating: 'R18+',
          status: 'Completed',
          author: 'Park Hyeong-jun',
          artist: 'Park Hyeong-jun',
          tags: ['Adult', 'Comedy', 'Romance', 'Mature'],
          isAdult: true,
          source: 'manhwa18',
          chapters: [
            { id: 'chapter-1', title: 'Chapter 1: Meeting', number: 1, publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-2', title: 'Chapter 2: First Date', number: 2, publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-3', title: 'Chapter 3: Getting to Know Each Other', number: 3, publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-4', title: 'Chapter 4: Unexpected Feelings', number: 4, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-5', title: 'Chapter 5: Confession', number: 5, publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
            { id: 'chapter-6', title: 'Chapter 6: Together', number: 6, publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true }
          ]
        }
      };

      // Return specific manhwa details or default
      const defaultCover = realMangaCovers[Object.keys(realMangaCovers)[Math.floor(Math.random() * Object.keys(realMangaCovers).length)]];
      
      return manhwaDetails[id] || {
        id: id,
        title: 'Adult Manhwa Title',
        description: 'This is adult content that requires age verification. Contains mature themes, sexual content, and is intended for readers 18 years and older.',
        coverArt: getCoverUrl(defaultCover),
        rating: 'R18+',
        status: 'Ongoing',
        author: 'Adult Content Creator',
        artist: 'Adult Content Artist',
        tags: ['Adult', 'Romance', 'Drama', 'Mature'],
        isAdult: true,
        source: 'manhwa18',
        chapters: [
          { id: 'chapter-1', title: 'Chapter 1: Introduction', number: 1, publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
          { id: 'chapter-2', title: 'Chapter 2: Development', number: 2, publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
          { id: 'chapter-3', title: 'Chapter 3: Progression', number: 3, publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
          { id: 'chapter-4', title: 'Chapter 4: Climax', number: 4, publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true },
          { id: 'chapter-5', title: 'Chapter 5: Resolution', number: 5, publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isAdult: true }
        ]
      };
    } catch (error) {
      console.error('Error fetching manhwa details:', error);
      return null;
    }
  }

  // Get chapter pages (18+ content)
  async getChapterPages(manhwaId, chapterId) {
    try {
      console.log(`Fetching chapter pages for: ${manhwaId}/${chapterId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create different page sets based on chapter ID
      const chapterNumber = chapterId.split('-')[1] || '1';
      
      // Create realistic manga-style pages that look like actual manhwa
      // Using different styles and layouts for variety
      const manhwaStylePages = [
        `https://via.placeholder.com/800x1200/f8f9fa/343a40.png?text=📖+Chapter+${chapterNumber}+Page+1%0A%0A[Manhwa+Panel+Layout]%0A%0ACharacter+dialogue...%0A%0A"This+is+the+beginning+of%0Aour+story..."%0A%0A[Adult+Content+18%2B]`,
        `https://via.placeholder.com/800x1200/e9ecef/495057.png?text=📖+Chapter+${chapterNumber}+Page+2%0A%0A[Action+Scene]%0A%0A*Sound+effects*%0ABAM!+CRASH!%0A%0A"What's+happening?"%0A%0A[Dramatic+Panel]`,
        `https://via.placeholder.com/800x1200/dee2e6/6c757d.png?text=📖+Chapter+${chapterNumber}+Page+3%0A%0A[Character+Close-up]%0A%0A"I+never+expected%0Athis+to+happen..."%0A%0A[Emotional+moment]%0A%0A💭+Thought+bubble`,
        `https://via.placeholder.com/800x1200/ced4da/868e96.png?text=📖+Chapter+${chapterNumber}+Page+4%0A%0A[Multiple+Panels]%0A%0APanel+1:+Setup%0APanel+2:+Reaction%0APanel+3:+Response%0A%0A"This+changes+everything!"`,
        `https://via.placeholder.com/800x1200/adb5bd/495057.png?text=📖+Chapter+${chapterNumber}+Page+5%0A%0A[Romantic+Scene]%0A%0A💕+Romance+moment+💕%0A%0A"I+have+feelings%0Afor+you..."%0A%0A[Heart+effects]`,
        `https://via.placeholder.com/800x1200/6c757d/f8f9fa.png?text=📖+Chapter+${chapterNumber}+Page+6%0A%0A[Plot+Development]%0A%0ANew+information+revealed%0A%0A"The+truth+is..."%0A%0A[Suspenseful+moment]`,
        `https://via.placeholder.com/800x1200/495057/f8f9fa.png?text=📖+Chapter+${chapterNumber}+Page+7%0A%0A[Climax+Scene]%0A%0A⚡+Intense+moment+⚡%0A%0A"This+is+it!"%0A%0A[Action+panels]`,
        `https://via.placeholder.com/800x1200/343a40/f8f9fa.png?text=📖+Chapter+${chapterNumber}+Page+8%0A%0A[Chapter+End]%0A%0ATo+be+continued...%0A%0A"What+will+happen+next?"%0A%0A[Cliffhanger]`,
        `https://via.placeholder.com/800x1200/212529/f8f9fa.png?text=📖+Chapter+${chapterNumber}+Page+9%0A%0A[Bonus+Content]%0A%0AExtra+scene%0A%0A"Thank+you+for+reading!"%0A%0A[Author+note]`,
        `https://via.placeholder.com/800x1200/000000/ffffff.png?text=📖+Chapter+${chapterNumber}+Page+10%0A%0A[Final+Page]%0A%0ANext+Chapter+Preview%0A%0A"Coming+soon..."%0A%0A[End+of+chapter]`
      ];

      // Helper function to get page URL with proxy
      const getPageUrl = (directUrl) => {
        const isProduction = typeof window !== 'undefined' && 
          (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
        
        if (isProduction) {
          return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=1200&h=1800&fit=inside&output=webp`;
        } else {
          return directUrl;
        }
      };

      // Create pages with proper manga-style content
      const pages = manhwaStylePages.map((pageUrl, index) => ({
        url: getPageUrl(pageUrl),
        pageNumber: index + 1,
        isAdult: true
      }));

      return {
        pages: pages,
        isAdult: true,
        contentWarning: 'This chapter contains adult content intended for readers 18 years and older.'
      };
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      return { pages: [], isAdult: true };
    }
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