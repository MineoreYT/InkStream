// Vercel serverless function to proxy MangaDex API requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      res.status(400).json({ error: 'URL parameter is required' });
      return;
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(url);
    
    // Validate that it's a MangaDex API URL
    if (!decodedUrl.startsWith('https://api.mangadex.org/')) {
      res.status(400).json({ error: 'Invalid API URL' });
      return;
    }

    // Make the request to MangaDex API
    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'InkStream/1.0 (https://ink-stream-pearl.vercel.app)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the data
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from MangaDex API',
      message: error.message 
    });
  }
}