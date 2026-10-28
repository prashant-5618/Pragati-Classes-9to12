
const STUDENT_DB_KEY = "pragatiClassesDB";

function escapeStudentHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getStudentDB() {
    try {
        return JSON.parse(localStorage.getItem(STUDENT_DB_KEY)) || {};
    } catch (error) {
        console.error("Could not read classes data:", error);
        return {};
    }
}

function renderStudentClasses() {
    const container = document.getElementById("studentClassesList");
    if (!container) return;

    const db = getStudentDB();
    const classes = Array.isArray(db.classes) ? db.classes : [];

    const visibleClasses = classes.filter(item =>
        item.status !== "Cancelled"
    );

    if (visibleClasses.length === 0) {
        container.innerHTML = `
            <div class="panel empty-state">
                <div>🎥</div>
                <h3>No live classes scheduled</h3>
                <p>Your class timetable and joining links will appear here.</p>
            </div>`;
        return;
    }

    container.innerHTML = visibleClasses.map(item => {
        const link = /^https?:\/\//i.test(item.link || "")
            ? item.link
            : "";

        return `
            <div class="panel course-card">
                <h3>${escapeStudentHTML(item.title || item.name || "Online Class")}</h3>
                <p><strong>Class:</strong> ${escapeStudentHTML(item.className || item.course || "—")}</p>
                <p><strong>Teacher:</strong> ${escapeStudentHTML(item.teacher || "—")}</p>
                <p><strong>Date:</strong> ${escapeStudentHTML(item.date || "Not announced")}</p>
                <p><strong>Time:</strong> ${escapeStudentHTML(item.time || "Not announced")}</p>
                <p><strong>Status:</strong> ${escapeStudentHTML(item.status || "Scheduled")}</p>
                ${link ? `<a href="${escapeStudentHTML(link)}" target="_blank" rel="noopener noreferrer">Join Class</a>` : ""}
            </div>`;
    }).join("");
}

function renderStudentResults() {
    const container = document.getElementById("studentResultsList");
    if (!container) return;

    const db = getStudentDB();
    const results = Array.isArray(db.results) ? db.results : [];

    const publishedResults = results.filter(item =>
        item.status === "Published"
    );

    if (publishedResults.length === 0) {
        container.innerHTML = `
            <div class="panel empty-state">
                <div>📊</div>
                <h3>No results available yet</h3>
                <p>Your published test results will appear here.</p>
            </div>`;
        return;
    }

    container.innerHTML = publishedResults.map(item => `
        <div class="panel course-card">
            <h3>${escapeStudentHTML(item.test || "Test Result")}</h3>
            <p><strong>Student:</strong> ${escapeStudentHTML(item.student || "—")}</p>
            <p><strong>Subject:</strong> ${escapeStudentHTML(item.subject || "—")}</p>
            <p><strong>Marks:</strong> ${escapeStudentHTML(item.marks ?? "—")} / ${escapeStudentHTML(item.total ?? "—")}</p>
        </div>
    `).join("");
}

function refreshStudentClassesAndResults() {
    renderStudentClasses();
    renderStudentResults();
}

document.addEventListener("DOMContentLoaded", refreshStudentClassesAndResults);

// Refresh when the admin updates data in another browser tab.
window.addEventListener("storage", event => {
    if (event.key === STUDENT_DB_KEY) {
        refreshStudentClassesAndResults();
    }
});
