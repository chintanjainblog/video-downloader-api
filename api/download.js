// api/download.js - WORKING VERSION WITH AXIOS
import axios from "axios";

export default async function handler(req, res) {
  console.log("🚀 API Called:", req.method);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET requests (for testing)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "🎉 VIDEO DOWNLOADER API IS WORKING!",
      timestamp: new Date().toISOString(),
      instructions: "Send POST request with {url: 'video-url'}",
      status: "Ready to connect to RapidAPI"
    });
  }
  
  // Handle POST requests
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          error: "Please provide a video URL"
        });
      }
      
      console.log("Processing URL:", url);
      
      // ⚠️ TEMPORARY: Return test response (remove when adding RapidAPI)
      return res.status(200).json({
        success: true,
        message: "✅ Connected! Ready for RapidAPI integration",
        receivedUrl: url,
        testMode: true,
        note: "1. This test works! 2. Now add your RapidAPI credentials",
        exampleResponse: {
          quality: "720p",
          downloadUrl: "#",
          size: "15.2 MB"
        }
      });
      
      // ⚠️ UNCOMMENT THIS WHEN READY FOR RAPIDAPI:
      // const rapidApiResponse = await axios.post(
      //   "YOUR_RAPIDAPI_ENDPOINT_HERE",
      //   { url: url },
      //   {
      //     headers: {
      //       "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      //       "X-RapidAPI-Host": "YOUR_RAPIDAPI_HOST_HERE",
      //       "Content-Type": "application/json"
      //     }
      //   }
      // );
      // 
      // return res.status(200).json(rapidApiResponse.data);
      
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        error: "Server error",
        details: error.message
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    success: false,
    error: "Method not allowed. Use GET or POST."
  });
}
