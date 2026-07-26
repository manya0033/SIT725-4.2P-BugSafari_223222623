// Wait until the HTML page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadBugCards();
});

/**
 * Requests the bug records from the Express GET endpoint.
 */
const loadBugCards = async () => {
  const cardContainer = document.getElementById("bug-card-container");

  try {
    const response = await fetch("/api/bugs");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!Array.isArray(result.data)) {
      throw new Error("The server returned an unexpected data format.");
    }

    displayBugCards(result.data);
  } catch (error) {
    console.error("Unable to load BugSafari records:", error);

    cardContainer.innerHTML = `
      <div class="col s12">
        <div class="card-panel red lighten-5 center-align error-panel">
          <i class="material-icons medium red-text text-darken-2">
            error_outline
          </i>

          <h5>Unable to load the Bug Guide</h5>

          <p>
            Please check that the Express server is running and try again.
          </p>
        </div>
      </div>
    `;
  }
};

/**
 * Generates one Materialize card for every bug returned by the server.
 *
 * @param {Array} bugs - Bug records received from /api/bugs.
 */
const displayBugCards = (bugs) => {
  const cardContainer = document.getElementById("bug-card-container");

  cardContainer.innerHTML = bugs
    .map((bug) => createBugCard(bug))
    .join("");
};

/**
 * Creates the HTML for an individual BugSafari card.
 *
 * @param {Object} bug - A single bug record.
 * @returns {string} Materialize card markup.
 */
const createBugCard = (bug) => {
  const severityClass = getSeverityClass(bug.severity);

  return `
    <div class="col s12 m6 l4">
      <article class="card bug-card hoverable">

        <div class="card-image waves-effect waves-block waves-light bug-image-area">
          <img
            class="activator bug-card-image"
            src="${bug.image}"
            alt="Illustration representing ${bug.title}"
          >

          <span class="severity-badge ${severityClass}">
            ${bug.severity}
          </span>
        </div>

        <div class="card-content">
          <span class="bug-category">
            ${bug.category}
          </span>

          <span class="card-title activator">
            ${bug.title}

            <i class="material-icons right">
              more_vert
            </i>
          </span>

          <p class="bug-description">
            ${bug.description}
          </p>
        </div>

        <div class="card-action">
          <button
            type="button"
            class="activator inspect-button"
            aria-label="Inspect ${bug.title}"
          >
            ${bug.link}

            <i class="material-icons tiny">
              arrow_forward
            </i>
          </button>
        </div>

        <div class="card-reveal">
          <span class="card-title">
            ${bug.title}

            <i class="material-icons right">
              close
            </i>
          </span>

          <span class="bug-category reveal-category">
            ${bug.category} · ${bug.severity} severity
          </span>

          <div class="bug-detail">
            <h6>
              <i class="material-icons">visibility</i>
              Typical symptom
            </h6>

            <p>${bug.symptom}</p>
          </div>

          <div class="bug-detail">
            <h6>
              <i class="material-icons">build</i>
              Recommended fix
            </h6>

            <p>${bug.fix}</p>
          </div>
        </div>

      </article>
    </div>
  `;
};

/**
 * Returns a CSS class matching the bug severity.
 *
 * @param {string} severity - Severity supplied by the server.
 * @returns {string} CSS class for the badge.
 */
const getSeverityClass = (severity) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "severity-critical";

    case "high":
      return "severity-high";

    case "medium":
      return "severity-medium";

    default:
      return "severity-low";
  }
};