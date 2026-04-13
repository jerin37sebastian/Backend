const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema(
  {
    celebrityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Celebrity",
      default: null,
    },
    celebrityName: { type: String, required: true },
    type: {
      type: String,
      enum: ["new_celebrity", "correction", "missing_platform"],
      required: true,
    },
    platform: { type: String, default: null },
    suggestedHandle: { type: String, default: null },
    suggestedUrl: { type: String, default: null },
    message: { type: String, maxlength: 500 },
    submitterEmail: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", SuggestionSchema);
