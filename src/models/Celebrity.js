const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema({
  handle: { type: String, default: null },
  followers: { type: String, default: null },
  url: { type: String, default: null },
  verified: { type: Boolean, default: false },
});

const CelebritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Actor", "Actress", "Musician", "Cricketer",
        "Footballer", "Athlete", "Entrepreneur",
        "Politician", "Comedian", "Model", "Influencer", "Other",
      ],
    },
    country: { type: String, required: true },
    bio: { type: String, maxlength: 300 },
    avatar: { type: String, default: null },
    totalReach: { type: String, default: "N/A" },
    platforms: {
      instagram: { type: PlatformSchema, default: null },
      twitter:   { type: PlatformSchema, default: null },
      youtube:   { type: PlatformSchema, default: null },
      facebook:  { type: PlatformSchema, default: null },
      threads:   { type: PlatformSchema, default: null },
      linkedin:  { type: PlatformSchema, default: null },
      naukri:    { type: PlatformSchema, default: null },
    },
    isVerified: { type: Boolean, default: false },
    searchCount: { type: Number, default: 0 },
    submittedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

CelebritySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

CelebritySchema.index({ name: "text", category: "text", country: "text" });

module.exports = mongoose.model("Celebrity", CelebritySchema);
