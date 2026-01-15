import axios from "axios";

export default async function handler(req, res) {

  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }

  // Get the video URL sent from Blogger
  const { url } = req.body;

  // Validate input
  if (!url) {
    res.status(400).json({ error: "Video URL is required" });
    return;
  }

  try {
    // Call RapidAPI securely
    const response = await axios.get(
      "https://EXAMPLE-RAPIDAPI-ENDPOINT",
      {
        params: { url },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "EXAMPLE-RAPIDAPI-HOST"
        }
      }
    );

    // Send response back to Blogger
    res.status(200).json(response.data);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch video"
    });
  }
}
