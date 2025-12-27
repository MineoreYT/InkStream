// Vercel serverless function to proxy manga cover images
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

    // Decode and validate the URL
    const imageUrl = decodeURIComponent(url);
    
    // Only allow MangaDx image URLs for security
    if (!imageUrl.startsWith('https://uploads.mangadx.org/')) {
      res.status(400).json({ error: 'Invalid image URL' });
      return;
    }

    // Fetch the image from MangaDx
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'InkStream/1.0 (https://ink-stream-pearl.vercel.app)',
        'Referer': 'https://mangadx.org/',
      },
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Content-Length', imageBuffer.byteLength);

    // Send the image
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch image',
      message: error.message 
    });
  }
}