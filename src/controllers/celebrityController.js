const Celebrity = require("../models/Celebrity");
const Suggestion = require("../models/Suggestion");
const { fetchCelebrityProfiles } = require("../services/geminiService");
const { getWikipediaPhoto, fallbackAvatar } = require("../utils/photos");

const geminiToDBFormat = async (data) => {
  const photo = await getWikipediaPhoto(data.name);
  return {
  name: data.name,
  category: data.category,
  country: data.country,
  bio: data.bio,
  totalReach: data.totalReach || "N/A",
  avatar: photo || fallbackAvatar(data.name),
  isVerified: false,
  submittedBy: "gemini-ai",
  platforms: {
    instagram: data.platforms?.instagram || null,
    twitter:   data.platforms?.twitter   || null,
    youtube:   data.platforms?.youtube   || null,
    facebook:  data.platforms?.facebook  || null,
    threads:   data.platforms?.threads   || null,
    linkedin:  data.platforms?.linkedin  || null,
    naukri:    data.platforms?.naukri    || null,
  },
  };
};

exports.search = async (req, res) => {
  try {
    const { q, category, country, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters.",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { $text: { $search: q.trim() } };
    if (category) filter.category = category;
    if (country) filter.country = new RegExp(country, "i");

    let [results, total] = await Promise.all([
      Celebrity.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, searchCount: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v"),
      Celebrity.countDocuments(filter),
    ]);

    if (results.length === 0) {
      console.log(`🤖 Not in DB, asking Gemini for: "${q}"`);
      const aiData = await fetchCelebrityProfiles(q.trim());

      if (aiData) {
        const existing = await Celebrity.findOne({
          name: new RegExp(`^${aiData.name}$`, "i"),
        });

        if (existing) {
          results = [existing];
          total = 1;
        } else {
          try {
            const newCeleb = await Celebrity.create(await geminiToDBFormat(aiData));
            console.log(`✅ Saved new celebrity to DB: ${newCeleb.name}`);
            results = [newCeleb];
            total = 1;
          } catch (saveErr) {
            console.warn("Could not save to DB:", saveErr.message);
            results = [{ ...(await geminiToDBFormat(aiData)), _id: "ai-result", fromAI: true }];
            total = 1;
          }
        }
      }
    }

    if (results.length > 0 && results[0]._id !== "ai-result") {
      Celebrity.updateMany(
        { _id: { $in: results.map((r) => r._id) } },
        { $inc: { searchCount: 1 } }
      ).catch(() => {});
    }

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      source: results[0]?._id === "ai-result" ? "ai" : "database",
      results,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server error during search." });
  }
};

exports.trending = async (req, res) => {
  try {
    const trending = await Celebrity.find()
      .sort({ searchCount: -1 })
      .limit(8)
      .select("name category country avatar totalReach slug isVerified");
    res.json({ success: true, results: trending });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const celebrity = await Celebrity.findOne({ slug: req.params.slug }).select("-__v");
    if (!celebrity) {
      return res.status(404).json({ success: false, message: "Celebrity not found." });
    }
    celebrity.searchCount += 1;
    celebrity.save().catch(() => {});
    res.json({ success: true, data: celebrity });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Celebrity.distinct("category");
    const countries  = await Celebrity.distinct("country");
    res.json({ success: true, categories, countries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.suggest = async (req, res) => {
  try {
    const { celebrityName, type, platform, suggestedHandle, suggestedUrl, message, submitterEmail, celebrityId } = req.body;
    if (!celebrityName || !type) {
      return res.status(400).json({ success: false, message: "celebrityName and type are required." });
    }
    const suggestion = await Suggestion.create({
      celebrityId: celebrityId || null,
      celebrityName, type, platform,
      suggestedHandle, suggestedUrl,
      message, submitterEmail,
    });
    res.status(201).json({
      success: true,
      message: "Thanks! Your suggestion has been submitted for review.",
      id: suggestion._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
