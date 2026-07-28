const mongoose = require("mongoose");

/**
 * MongoDB schema for a BugSafari record.
 */
const bugSchema = new mongoose.Schema(
  {
    bugName: {
      type: String,
      required: [true, "Bug name is required"],
      trim: true,
      minlength: 3,
      maxlength: 80
    },

    bugCategory: {
      type: String,
      required: [true, "Bug category is required"],
      trim: true,
      maxlength: 50
    },

    severityLevel: {
      type: String,
      required: [true, "Severity level is required"],
      enum: ["Low", "Medium", "High", "Critical"]
    },

    overview: {
      type: String,
      required: [true, "Bug overview is required"],
      trim: true,
      maxlength: 300
    },

    commonSymptom: {
      type: String,
      required: [true, "Common symptom is required"],
      trim: true,
      maxlength: 400
    },

    recommendedSolution: {
      type: String,
      required: [true, "Recommended solution is required"],
      trim: true,
      maxlength: 500
    },

    illustrationPath: {
      type: String,
      required: [true, "Illustration path is required"],
      trim: true
    },

    isResolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Bug = mongoose.model("Bug", bugSchema);

module.exports = Bug;