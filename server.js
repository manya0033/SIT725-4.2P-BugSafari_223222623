const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Bug = require("./models/Bug");

const app = express();

const PORT = process.env.PORT || 3000;

const DATABASE_URL =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/bugsafariDB";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Convert MongoDB fields into the card structure
 * expected by the client-side application.
 */
const formatBugForClient = (bug) => ({
  id: bug._id,
  title: bug.bugName,
  image: bug.illustrationPath,
  link: "Inspect this bug",
  category: bug.bugCategory,
  severity: bug.severityLevel,
  description: bug.overview,
  symptom: bug.commonSymptom,
  fix: bug.recommendedSolution,
  isResolved: bug.isResolved,
  createdAt: bug.createdAt
});

/**
 * GET /api/bugs
 * Retrieve all bug records from MongoDB.
 */
app.get("/api/bugs", async (request, response) => {
  try {
    const databaseBugs = await Bug.find({}).sort({
      createdAt: 1
    });

    response.status(200).json({
      statusCode: 200,
      data: databaseBugs.map(formatBugForClient),
      message: "Bug records retrieved from MongoDB successfully"
    });
  } catch (error) {
    console.error("Unable to retrieve bug records:", error);

    response.status(500).json({
      statusCode: 500,
      data: [],
      message: "Unable to retrieve bug records from MongoDB"
    });
  }
});

// Only these local illustrations can be saved
const allowedIllustrations = new Set([
  "images/infinite-loop.svg",
  "images/off-by-one.svg",
  "images/undefined.svg",
  "images/api-path.svg",
  "images/type-mismatch.svg",
  "images/race-condition.svg"
]);

/**
 * POST /api/bugs
 * Validate and save a new record to MongoDB.
 */
app.post("/api/bugs", async (request, response) => {
  try {
    const {
      bugName,
      bugCategory,
      severityLevel,
      overview,
      commonSymptom,
      recommendedSolution,
      illustrationPath
    } = request.body;

    const safeIllustrationPath = allowedIllustrations.has(
      illustrationPath
    )
      ? illustrationPath
      : "images/undefined.svg";

    const newBug = new Bug({
      bugName,
      bugCategory,
      severityLevel,
      overview,
      commonSymptom,
      recommendedSolution,
      illustrationPath: safeIllustrationPath,
      isResolved: false
    });

    const savedBug = await newBug.save();

    response.status(201).json({
      statusCode: 201,
      data: formatBugForClient(savedBug),
      message: "New bug record saved to MongoDB successfully"
    });
  } catch (error) {
    console.error("Unable to save bug record:", error.message);

    if (error.name === "ValidationError") {
      return response.status(400).json({
        statusCode: 400,
        data: null,
        message: error.message
      });
    }

    response.status(500).json({
      statusCode: 500,
      data: null,
      message: "Unable to save the bug record"
    });
  }
});

// Serve the browser-side application
app.use(express.static(path.join(__dirname, "public")));

/**
 * Connect to MongoDB before starting Express.
 */
const startServer = async () => {
  try {
    await mongoose.connect(DATABASE_URL);

    console.log("Connected to MongoDB database: bugsafariDB");

    app.listen(PORT, () => {
      console.log(
        `BugSafari Database Edition is running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();