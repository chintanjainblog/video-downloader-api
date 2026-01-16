
// api/download.js - Basic test function
export default async function handler(req, res) {
  // Allow requests from anywhere (for testing)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: '🎉 API is working!',
      timestamp: new Date().toISOString(),
      instructions: 'Send POST request with {url: "video-url"}'
    });
  }
  
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { url } = body;
      
      console.log('Received URL:', url);
      
      // For testing, just return success
      return res.status(200).json({
        success: true,
        message: 'Video URL received!',
        receivedUrl: url,
        downloadInfo: {
          quality: '720p',
          size: '15.2 MB',
          downloadLink: '#'
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
