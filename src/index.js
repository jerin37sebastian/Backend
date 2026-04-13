require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimiter = require("./middleware/rateLimiter");
const celebrityRoutes = require("./routes/celebrities");
const seoRoutes = require("./routes/seo");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "✦ FameFinder API is live",
    version: "1.0.0",
    endpoints: {
      search: "GET /api/celebrities/search?q=virat",
      trending: "GET /api/celebrities/trending",
      profile: "GET /api/celebrities/:slug",
      categories: "GET /api/celebrities/categories",
      suggest: "POST /api/celebrities/suggest",
    },
  });
});

app.use("/api/celebrities", celebrityRoutes);
app.use("/", seoRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`🚀 FameFinder API running on port ${PORT}`);
});
