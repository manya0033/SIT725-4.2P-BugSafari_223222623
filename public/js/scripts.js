/**
 * BugSafari Database Edition
 * Client-side JavaScript for retrieving and submitting MongoDB records.
 */

document.addEventListener("DOMContentLoaded", () => {
  initialiseMaterializeComponents();
  initialiseBugForm();
  loadBugCards();
});

/**
 * Initialise Materialize modal and select components.
 */
const initialiseMaterializeComponents = () => {
  const modals = document.querySelectorAll(".modal");
  M.Modal.init(modals, {
    dismissible: true,
    opacity: 0.5
  });

  const selects = document.querySelectorAll("select");
  M.FormSelect.init(selects);
};

/**
 * Attach the submit event to the Report a Bug form.
 */
const initialiseBugForm = () => {
  const bugForm = document.getElementById("report-bug-form");

  if (!bugForm) {
    return;
  }

  bugForm.addEventListener("submit", submitBugForm);
};

/**
 * Request all bug records from MongoDB through the Express API.
 */
const loadBugCards = async () => {
  const cardContainer = document.getElementById("bug-card-container");

  try {
    const response = await fetch("/api/bugs");

    if (!response.ok) {
      throw new Error(
        `Unable to retrieve bugs. Server returned ${response.status}.`
      );
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
            Confirm that Express and MongoDB are running, then refresh
            the page.
          </p>
        </div>
      </div>
    `;
  }
};

/**
 * Display all records returned by the server.
 *
 * @param {Array} bugs MongoDB bug records formatted by the Express server.
 */
const displayBugCards = (bugs) => {
  const cardContainer = document.getElementById("bug-card-container");

  if (bugs.length === 0) {
    cardContainer.innerHTML = `
      <div class="col s12 center-align">
        <i class="material-icons medium">search_off</i>
        <h5>No bug records found</h5>
        <p>Use the Report a Bug form to create the first record.</p>
      </div>
    `;

    return;
  }

  cardContainer.innerHTML = bugs
    .map((bug) => createBugCard(bug))
    .join("");
};

/**
 * Generate one Materialize card.
 *
 * @param {Object} bug Individual bug record.
 * @returns {string} Materialize card HTML.
 */
const createBugCard = (bug) => {
  const severityClass = getSeverityClass(bug.severity);

  return `
    <div class="col s12 m6 l4">
      <article class="card bug-card hoverable">

        <div
          class="card-image waves-effect waves-block waves-light bug-image-area"
        >
          <img
            class="activator bug-card-image"
            src="${escapeHtml(bug.image)}"
            alt="Illustration representing ${escapeHtml(bug.title)}"
          >

          <span class="severity-badge ${severityClass}">
            ${escapeHtml(bug.severity)}
          </span>
        </div>

        <div class="card-content">
          <span class="bug-category">
            ${escapeHtml(bug.category)}
          </span>

          <span class="card-title activator">
            ${escapeHtml(bug.title)}

            <i class="material-icons right">
              more_vert
            </i>
          </span>

          <p class="bug-description">
            ${escapeHtml(bug.description)}
          </p>
        </div>

        <div class="card-action">
          <button
            type="button"
            class="activator inspect-button"
            aria-label="Inspect ${escapeHtml(bug.title)}"
          >
            Inspect this bug

            <i class="material-icons tiny">
              arrow_forward
            </i>
          </button>
        </div>

        <div class="card-reveal">
          <span class="card-title">
            ${escapeHtml(bug.title)}

            <i class="material-icons right">
              close
            </i>
          </span>

          <span class="bug-category reveal-category">
            ${escapeHtml(bug.category)}
            ·
            ${escapeHtml(bug.severity)} severity
          </span>

          <div class="bug-detail">
            <h6>
              <i class="material-icons">visibility</i>
              Typical symptom
            </h6>

            <p>
              ${escapeHtml(bug.symptom)}
            </p>
          </div>

          <div class="bug-detail">
            <h6>
              <i class="material-icons">build</i>
              Recommended fix
            </h6>

            <p>
              ${escapeHtml(bug.fix)}
            </p>
          </div>
        </div>

      </article>
    </div>
  `;
};

/**
 * Submit a new BugSafari record to MongoDB.
 *
 * @param {SubmitEvent} event Form submission event.
 */
const submitBugForm = async (event) => {
  event.preventDefault();

  const bugForm = event.currentTarget;
  const submitButton = document.getElementById("submit-bug-button");

  if (!bugForm.checkValidity()) {
    bugForm.reportValidity();
    return;
  }

  const newBug = {
    bugName: document.getElementById("bugName").value.trim(),
    bugCategory: document.getElementById("bugCategory").value.trim(),
    severityLevel: document.getElementById("severityLevel").value,
    illustrationPath: document.getElementById("illustrationPath").value,
    overview: document.getElementById("overview").value.trim(),
    commonSymptom:
      document.getElementById("commonSymptom").value.trim(),
    recommendedSolution:
      document.getElementById("recommendedSolution").value.trim()
  };

  setSubmitButtonLoading(submitButton, true);

  try {
    const response = await fetch("/api/bugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newBug)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Request failed with status ${response.status}.`
      );
    }

    M.toast({
      html: "Bug saved to MongoDB successfully!",
      classes: "green darken-2"
    });

    closeAndResetBugForm(bugForm);
    await loadBugCards();
  } catch (error) {
    console.error("Unable to save the bug record:", error);

    M.toast({
      html: escapeHtml(error.message),
      classes: "red darken-2"
    });
  } finally {
    setSubmitButtonLoading(submitButton, false);
  }
};

/**
 * Close the modal and reset all form fields.
 *
 * @param {HTMLFormElement} bugForm Bug reporting form.
 */
const closeAndResetBugForm = (bugForm) => {
  bugForm.reset();

  document.querySelectorAll("#report-bug-form select").forEach((select) => {
    const currentInstance = M.FormSelect.getInstance(select);

    if (currentInstance) {
      currentInstance.destroy();
    }

    select.selectedIndex = 0;
    M.FormSelect.init(select);
  });

  M.updateTextFields();

  document
    .querySelectorAll("#report-bug-form textarea")
    .forEach((textarea) => {
      M.textareaAutoResize(textarea);
    });

  const modalElement = document.getElementById("report-bug-modal");
  const modalInstance = M.Modal.getInstance(modalElement);

  if (modalInstance) {
    modalInstance.close();
  }
};

/**
 * Change the submit button while a record is being saved.
 *
 * @param {HTMLButtonElement} button Submit button.
 * @param {boolean} isLoading Whether the request is running.
 */
const setSubmitButtonLoading = (button, isLoading) => {
  if (!button) {
    return;
  }

  button.disabled = isLoading;

  button.innerHTML = isLoading
    ? `
      Saving...
      <i class="material-icons right">hourglass_top</i>
    `
    : `
      Save to Database
      <i class="material-icons right">save</i>
    `;
};

/**
 * Return the CSS class for a severity badge.
 *
 * @param {string} severity Severity supplied by MongoDB.
 * @returns {string} Severity CSS class.
 */
const getSeverityClass = (severity = "") => {
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

/**
 * Encode text before inserting it into generated HTML.
 *
 * @param {*} value Value received from the database.
 * @returns {string} HTML-safe value.
 */
const escapeHtml = (value) => {
  const text = String(value ?? "");

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};