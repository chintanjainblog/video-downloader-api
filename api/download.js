// TEMPORARY TEST VERSION - REMOVE LATER
import axios from "axios";

export default async function handler(req, res) {
  console.log("API called with method:", req.method);
  
  // Allow CORS for testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // For testing, allow GET to see if API is working
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "✅ API is working!",
      timestamp: new Date().toISOString(),
      instructions: "Send POST request with {url: 'video-url'}",
      debug: {
        hasRapidAPIKey: !!process.env.RAPIDAPI_KEY,
        nodeVersion: process.version
      }
    });
  }
  
  // Original POST logic
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    // TEMPORARY: Return test data instead of calling RapidAPI
    return res.status(200).json({
      success: true,
      message: "Test mode - API is working!",
      receivedUrl: url,
      testDownload: {
        quality: "720p",
        size: "15.2 MB",
        url: "#",
        note: "Replace with RapidAPI response"
      },
      rapidApiReady: !!process.env.RAPIDAPI_KEY
    });

    // // UNCOMMENT THIS LATER WHEN RAPIDAPI IS SETUP
    // const response = await axios.post(
    //   "PASTE_RAPIDAPI_ENDPOINT_HERE",
    //   { url: url },
    //   {
    //     headers: {
    //       "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    //       "X-RapidAPI-Host": "PASTE_RAPIDAPI_HOST_HERE",
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );
    // 
    // res.status(200).json(response.data);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch video",
      details: error.message
    });
  }
}
