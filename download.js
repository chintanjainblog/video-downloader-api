import axios from "axios";

export default async function handler(req, res) {

  // Step 1: Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  // Step 2: Read video URL sent from Blogger
  const { url } = req.body;

  // Step 3: Validate input
  if (!url) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    // Step 4: Call RapidAPI securely
    const response = await axios.post(
      "video-downloader-api-uzoj-m4imnha3v.vercel.app",
      {
        url: url
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "social-download-all-in-one.p.rapidapi.com",
          "Content-Type": "application/json"
        }
      }
    );

    // Step 5: Send RapidAPI response back to frontend
    res.status(200).json(response.data);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch video"
    });
  }
}
