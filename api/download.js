// api/download.js - COMPLETE RAPIDAPI INTEGRATION
import axios from "axios";

export default async function handler(req, res) {
  console.log("🚀 Video Downloader API Called:", req.method);
  
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
      message: "🎉 Video Downloader API is LIVE!",
      timestamp: new Date().toISOString(),
      status: "Connected to RapidAPI",
      instructions: "Send POST request with {url: 'video-url'}",
      supported: ["YouTube", "Facebook", "Instagram", "TikTok", "Twitter", "Snapchat"]
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
      
      console.log("Downloading video from:", url);
      
      // ⚠️ YOUR RAPIDAPI CREDENTIALS (from screenshot)
      const RAPIDAPI_ENDPOINT = "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink";
      const RAPIDAPI_HOST = "social-download-all-in-one.p.rapidapi.com";
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "ad8c47939emsh34c3f5ac781b75ep1d21c0jsn117306633e32";
      
      console.log("Calling RapidAPI endpoint:", RAPIDAPI_ENDPOINT);
      
      // Call RapidAPI
      const rapidApiResponse = await axios.post(
        RAPIDAPI_ENDPOINT,
        { url: url },
        {
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
            "Content-Type": "application/json",
            "User-Agent": "Video-Downloader-App/1.0"
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
      
      console.log("RapidAPI Response Status:", rapidApiResponse.status);
      console.log("RapidAPI Data:", JSON.stringify(rapidApiResponse.data).substring(0, 200) + "...");
      
      // Format the response for your website
      const formattedResponse = {
        success: true,
        originalUrl: url,
        platform: detectPlatform(url),
        downloadLinks: formatDownloadLinks(rapidApiResponse.data),
        rawData: rapidApiResponse.data, // For debugging
        timestamp: new Date().toISOString()
      };
      
      return res.status(200).json(formattedResponse);
      
    } catch (error) {
      console.error("❌ RapidAPI Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });
      
      // Better error messages
      if (error.response?.status === 429) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded",
          message: "You've made too many requests. Please try again in a minute.",
          details: "RapidAPI Free tier has limited requests per day"
        });
      }
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        return res.status(401).json({
          success: false,
          error: "API Key Error",
          message: "Invalid or expired RapidAPI key",
          details: "Check your RapidAPI subscription"
        });
      }
      
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          error: "Timeout",
          message: "Video processing took too long",
          details: "Try a shorter video or try again"
        });
      }
      
      if (error.response?.data?.message) {
        return res.status(400).json({
          success: false,
          error: "Download Failed",
          message: error.response.data.message,
          details: "The video might be private, deleted, or not supported"
        });
      }
      
      return res.status(500).json({
        success: false,
        error: "Server Error",
        message: "Failed to process video",
        details: error.message,
        tip: "Check if the URL is correct and video is publicly accessible"
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    success: false,
    error: "Method not allowed",
    message: "Use GET or POST methods only"
  });
}

// Helper function to detect platform from URL
function detectPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  return 'Unknown';
}

// Helper function to format download links
function formatDownloadLinks(rapidApiData) {
  try {
    // Adjust this based on actual RapidAPI response structure
    if (rapidApiData.links && Array.isArray(rapidApiData.links)) {
      return rapidApiData.links.map(link => ({
        quality: link.quality || 'Unknown',
        size: link.size || 'N/A',
        url: link.url || link.downloadUrl || '#',
        format: link.format || 'mp4'
      }));
    }
    
    if (rapidApiData.video && rapidApiData.video.url) {
      return [{
        quality: rapidApiData.video.quality || 'HD',
        size: rapidApiData.video.size || 'N/A',
        url: rapidApiData.video.url,
        format: rapidApiData.video.format || 'mp4'
      }];
    }
    
    // Default fallback
    return [{
      quality: 'HD',
      size: 'N/A',
      url: '#',
      format: 'mp4',
      note: 'Check rawData for actual links'
    }];
    
  } catch (error) {
    console.error("Error formatting links:", error);
    return [];
  }
}
