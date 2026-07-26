# BugSafari

BugSafari is an interactive web application developed for SIT725 Task 3.2P. It presents common programming bugs as a graphical field guide to help beginner developers recognise typical symptoms and understand possible fixes.

## Features

- Express.js web server
- Materialize CSS responsive interface
- Custom graphical design and illustrations
- RESTful GET endpoint
- Client-side API request using Fetch
- Dynamically generated bug cards
- Materialize card-reveal interactions
- Severity and category labels
- Responsive layout for different screen sizes
- Error handling for failed API requests

## Application Scenario

The workshop practical demonstrated an Express and Materialize application using kitten cards. BugSafari follows the same client-server architecture but changes the domain to common programming bugs.

The application currently covers:

- The Infinite Loop
- The Off-by-One Error
- The Silent Undefined
- The Broken API Path
- The Type Mismatch
- The Race Condition

## REST Endpoint

The application provides the following GET endpoint:

```text
GET /api/bugs