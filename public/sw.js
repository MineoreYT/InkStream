// InkStream Service Worker
const CACHE_NAME = 'inkstream-v2';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache addAll failed:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - only cache same-origin non-API requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for:
  // 1. API calls (both local and external)
  // 2. External domains (MangaDex, image proxies, etc.)
  // 3. Non-GET requests
  const shouldSkip = 
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.hostname !== self.location.hostname ||
    url.hostname.includes('mangadex') ||
    url.hostname.includes('weserv') ||
    url.hostname.includes('wsrv') ||
    url.hostname.includes('cloudfront');
  
  if (shouldSkip) {
    // Don't intercept - let the browser handle it normally
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          // Don't cache if not a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          // Clone and cache the response
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        });
      })
      .catch(() => {
        // Return offline fallback if available
        return caches.match('/');
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});