// Import required modules
const express = require("express");
const path = require("path");

// Create the Express application
const app = express();

// Use the hosting platform's port or port 3000 locally
const PORT = process.env.PORT || 3000;

// BugSafari data returned by the REST endpoint
const bugList = [
  {
    id: 1,
    title: "The Infinite Loop",
    image: "images/infinite-loop.svg",
    link: "Inspect this bug",
    category: "Logic Error",
    severity: "High",
    description:
      "A loop continues forever because its stopping condition is never reached.",
    symptom:
      "The application freezes, becomes unresponsive or repeatedly performs the same action.",
    fix:
      "Check the loop condition and confirm that the controlling value changes during each iteration."
  },
  {
    id: 2,
    title: "The Off-by-One Error",
    image: "images/off-by-one.svg",
    link: "Inspect this bug",
    category: "Boundary Error",
    severity: "Medium",
    description:
      "The program processes one item too many or one item too few.",
    symptom:
      "The first or last element of an array is skipped, repeated or accessed incorrectly.",
    fix:
      "Review the starting value, comparison operator and final index used by the loop."
  },
  {
    id: 3,
    title: "The Silent Undefined",
    image: "images/undefined.svg",
    link: "Inspect this bug",
    category: "Data Error",
    severity: "Medium",
    description:
      "A variable or property is used before it contains a valid value.",
    symptom:
      "The page displays missing information or reports that a property cannot be read.",
    fix:
      "Check spelling, initialise variables and confirm that objects contain the expected properties."
  },
  {
    id: 4,
    title: "The Broken API Path",
    image: "images/api-path.svg",
    link: "Inspect this bug",
    category: "Network Error",
    severity: "High",
    description:
      "The client sends its request to an incorrect or unavailable endpoint.",
    symptom:
      "The browser reports a 404 error and the expected data does not appear.",
    fix:
      "Compare the client request URL with the route declared in the Express server."
  },
  {
    id: 5,
    title: "The Type Mismatch",
    image: "images/type-mismatch.svg",
    link: "Inspect this bug",
    category: "Type Error",
    severity: "Medium",
    description:
      "The application performs an operation using incompatible data types.",
    symptom:
      "Calculations produce unexpected results or a function rejects the supplied value.",
    fix:
      "Inspect the value with typeof and convert it to the required type before using it."
  },
  {
    id: 6,
    title: "The Race Condition",
    image: "images/race-condition.svg",
    link: "Inspect this bug",
    category: "Timing Error",
    severity: "Critical",
    description:
      "Multiple asynchronous operations compete to update the same data.",
    symptom:
      "The result changes unpredictably depending on which operation finishes first.",
    fix:
      "Control the operation order using promises, async-await or an appropriate locking strategy."
  }
];

// Allow Express to read JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GET REST endpoint for all BugSafari records
app.get("/api/bugs", (request, response) => {
  response.status(200).json({
    statusCode: 200,
    data: bugList,
    message: "Bug records retrieved successfully"
  });
});

// Serve HTML, CSS, JavaScript and images from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Start the Express server
app.listen(PORT, () => {
  console.log(`BugSafari is running at http://localhost:${PORT}`);
});