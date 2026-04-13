const fetchCelebrityProfiles = async (celebrityName) => {
  try {
    const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
    const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    const model = "gemini-2.5-flash";

    const endpoint = `${baseUrl}/models/${model}:generateContent`;

    const prompt = `
Search for the celebrity or public figure named "${celebrityName}" and find their OFFICIALLY VERIFIED social media profiles.

Return ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{
  "found": true,
  "name": "Full Official Name",
  "category": "one of: Actor, Actress, Musician, Cricketer, Footballer, Athlete, Entrepreneur, Politician, Comedian, Model, Influencer, Other",
  "country": "Country name",
  "bio": "One sentence bio, max 200 characters",
  "totalReach": "Estimated total followers across all platforms e.g. 340M+",
  "platforms": {
    "instagram": { "handle": "@handle or null", "followers": "e.g. 50M or null", "verified": true, "url": "full URL or null" },
    "twitter":   { "handle": "@handle or null", "followers": "e.g. 10M or null", "verified": true, "url": "full URL or null" },
    "youtube":   { "handle": "channel name or null", "followers": "e.g. 5M or null", "verified": true, "url": "full URL or null" },
    "facebook":  { "handle": "page name or null", "followers": "e.g. 20M or null", "verified": true, "url": "full URL or null" },
    "threads":   { "handle": "@handle or null", "followers": "e.g. 2M or null", "verified": true, "url": "full URL or null" },
    "linkedin":  { "handle": "profile name or null", "followers": "e.g. 500K or null", "verified": true, "url": "full URL or null" },
    "naukri":    { "handle": "profile name or null", "followers": null, "verified": false, "url": "full URL or null" }
  }
}

If this person does not exist or is not a public figure, return:
{ "found": false }

STRICT RULES — follow these exactly:
- ONLY include a platform if the celebrity has an OFFICIALLY VERIFIED account there (blue tick / checkmark confirmed by the platform). If you are not 100% certain the account is verified, set the platform to null.
- Do NOT guess or infer handles. If you cannot confirm the verified handle with certainty, set it to null.
- If a platform profile does not exist or is unverified, set the entire platform value to null.
- The "verified" field inside each platform must be true ONLY if the account has a platform blue tick. Never set verified: true if you are unsure.
- Followers should be approximate like 270M, 54M, 1.2M, 500K.
- Return ONLY the JSON object, nothing else.
`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", response.status, err.slice(0, 200));
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      console.error("Gemini returned no text");
      return null;
    }

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
