const mongoose = require("mongoose");
const Bug = require("./models/Bug");

const DATABASE_URL =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/bugsafariDB";

const bugSeedData = [
  {
    bugName: "The Infinite Loop",
    bugCategory: "Logic Error",
    severityLevel: "High",
    overview:
      "A loop continues forever because its stopping condition is never reached.",
    commonSymptom:
      "The application freezes, becomes unresponsive or repeatedly performs the same action.",
    recommendedSolution:
      "Check the loop condition and confirm that the controlling value changes during each iteration.",
    illustrationPath: "images/infinite-loop.svg",
    isResolved: false
  },
  {
    bugName: "The Off-by-One Error",
    bugCategory: "Boundary Error",
    severityLevel: "Medium",
    overview:
      "The program processes one item too many or one item too few.",
    commonSymptom:
      "The first or last element of an array is skipped, repeated or accessed incorrectly.",
    recommendedSolution:
      "Review the starting value, comparison operator and final index used by the loop.",
    illustrationPath: "images/off-by-one.svg",
    isResolved: false
  },
  {
    bugName: "The Silent Undefined",
    bugCategory: "Data Error",
    severityLevel: "Medium",
    overview:
      "A variable or property is used before it contains a valid value.",
    commonSymptom:
      "The page displays missing information or reports that a property cannot be read.",
    recommendedSolution:
      "Check spelling, initialise variables and confirm that objects contain the expected properties.",
    illustrationPath: "images/undefined.svg",
    isResolved: false
  },
  {
    bugName: "The Broken API Path",
    bugCategory: "Network Error",
    severityLevel: "High",
    overview:
      "The client sends its request to an incorrect or unavailable endpoint.",
    commonSymptom:
      "The browser reports a 404 error and the expected data does not appear.",
    recommendedSolution:
      "Compare the client request URL with the route declared in the Express server.",
    illustrationPath: "images/api-path.svg",
    isResolved: false
  },
  {
    bugName: "The Type Mismatch",
    bugCategory: "Type Error",
    severityLevel: "Medium",
    overview:
      "The application performs an operation using incompatible data types.",
    commonSymptom:
      "Calculations produce unexpected results or a function rejects the supplied value.",
    recommendedSolution:
      "Inspect the value with typeof and convert it to the required type before using it.",
    illustrationPath: "images/type-mismatch.svg",
    isResolved: false
  },
  {
    bugName: "The Race Condition",
    bugCategory: "Timing Error",
    severityLevel: "Critical",
    overview:
      "Multiple asynchronous operations compete to update the same data.",
    commonSymptom:
      "The result changes unpredictably depending on which operation finishes first.",
    recommendedSolution:
      "Control the operation order using promises, async-await or an appropriate locking strategy.",
    illustrationPath: "images/race-condition.svg",
    isResolved: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB for seeding.");

    // Remove previous seed records to avoid duplicates
    await Bug.deleteMany({});
    console.log("Existing BugSafari records removed.");

    const insertedBugs = await Bug.insertMany(bugSeedData);
    console.log(`${insertedBugs.length} BugSafari records inserted successfully.`);
  } catch (error) {
    console.error("Database seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB seed connection closed.");
  }
};

seedDatabase();