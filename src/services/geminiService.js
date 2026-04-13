const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fetchCelebrityProfiles = async (celebrityName) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
    });

    const prompt = `
Search for the celebrity or public figure named "${celebrityName}" and find ALL their official social media profiles.

Return ONLY a valid JSON object in this exact format:
{
  "found": true,
  "name": "Full Official Name",
  "category": "one of: Actor, Actress, Musician, Cricketer, Footballer, Athlete, Entrepreneur, Politician, Comedian, Model, Influencer, Other",
  "country": "Country name",
  "bio": "One sentence bio, max 200 characters",
  "totalReach": "e.g. 340M+",
  "platforms": {
    "instagram": { "handle": "@handle", "followers": "50M", "verified": true, "url": "full URL" },
    "twitter":   { "handle": "@handle", "followers": "10M", "verified": true, "url": "full URL" },
    "youtube":   { "handle": "channel name", "followers": "5M", "verified": true, "url": "full URL" },
    "facebook":  { "handle": "page name", "followers": "20M", "verified": true, "url": "full URL" },
    "threads":   { "handle": "@handle", "followers": "2M", "verified": true, "url": "full URL" },
    "linkedin":  { "handle": "profile name", "followers": "500K", "verified": true, "url": "full URL" },
    "naukri":    { "handle": "profile name", "followers": null, "verified": false, "url": "full URL" }
  }
}

If platform doesn't exist set it to null.
If person doesn't exist return: { "found": false }
Return ONLY the JSON, nothing else.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.found) return null;
    return parsed;
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    return null;
  }
};

module.exports = { fetchCelebrityProfiles };
