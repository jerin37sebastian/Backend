const express = require("express");
const router = express.Router();
const Celebrity = require("../models/Celebrity");

const FRONTEND_URL = (process.env.FRONTEND_URL || "https://your-site.vercel.app").replace(/\/$/, "");

router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
    `User-agent: *\nAllow: /\n\nSitemap: ${FRONTEND_URL}/sitemap.xml`
  );
});

router.get("/sitemap.xml", async (req, res) => {
  try {
    const celebrities = await Celebrity.find({}, "slug updatedAt").lean();

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/trending", priority: "0.8", changefreq: "daily" },
    ];

    const celebrityPages = celebrities.map((c) => ({
      url: `/celebrity/${c.slug}`,
      priority: "0.7",
      changefreq: "weekly",
      lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString().split("T")[0] : undefined,
    }));

    const allPages = [...staticPages, ...celebrityPages];

    const urlEntries = allPages
      .map(({ url, priority, changefreq, lastmod }) => {
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
        return `  <url>
    <loc>${FRONTEND_URL}${url}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap.");
  }
});

module.exports = router;
