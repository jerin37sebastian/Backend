const express = require("express");
const router = express.Router();
const {
  search,
  trending,
  getBySlug,
  getCategories,
  suggest,
} = require("../controllers/celebrityController");

router.get("/search", search);
router.get("/trending", trending);
router.get("/categories", getCategories);
router.post("/suggest", suggest);
router.get("/:slug", getBySlug);

module.exports = router;
