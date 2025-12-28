// Vercel serverless function to proxy manga chapter page images
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    const imageUrl = decodeURIComponent(url);
    
    // Validate that it's a MangaDex chapter image URL (various CDN domains)
    const allowedDomains = [
      'mangadex.org',
      'uploads.mangadex.org',
      'cmdxd97gh0x3e.cloudfront.net',
      'na.mangadex.network',
      'eu.mangadex.network',
      'ap.mangadex.network'
    ];
    
    const isValidUrl = allowedDomains.some(domain => imageUrl.includes(domain));
    
    if (!isValidUrl) {
      console.log('Invalid URL rejected:', imageUrl);
      res.status(400).json({ error: 'Invalid image URL - must be from MangaDex', receivedUrl: imageUrl });
      return;
    }

    console.log('Proxying chapter image:', imageUrl);

    // Fetch the image with proper headers to avoid anti-hotlinking
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      },
    });

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Content-Length', imageBuffer.byteLength);

    // Send the image
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Chapter proxy error:', error);
    
    // Return error info
    res.status(500).json({ 
      error: 'Failed to fetch chapter image',
      message: error.message,
      url: req.query.url
    });
  }
}