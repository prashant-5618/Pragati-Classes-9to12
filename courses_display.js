"use strict";

(function () {
    const STORAGE_KEY = "pragatiClassesDB";

    function showAdminCourses() {
        let db = {};

        try {
            db = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "{}"
            );
        } catch (error) {
            console.error("Unable to read course data:", error);
        }

        const courses = Array.isArray(db.courses)
            ? db.courses
            : [];

        const overview = document.getElementById("overview");
        if (!overview) return;

        let section = document.getElementById("adminCoursesSection");

        if (!section) {
            section = document.createElement("section");
            section.id = "adminCoursesSection";
            section.className = "explore-batches";

            const heading = document.createElement("div");
            heading.className = "batch-heading";

            const title = document.createElement("h2");
            title.textContent = "Courses Added by Admin";

            const description = document.createElement("p");
            description.textContent =
                "Latest courses and batches available at Pragati Classes.";

            heading.append(title, description);

            const grid = document.createElement("div");
            grid.id = "adminCoursesGrid";
            grid.className = "batch-grid";

            section.append(heading, grid);
            overview.appendChild(section);
        }

        const grid = document.getElementById("adminCoursesGrid");
        if (!grid) return;

        grid.replaceChildren();

        const activeCourses = courses.filter(course =>
            String(course.status || "Active").trim().toLowerCase() === "active"
        );

        if (activeCourses.length === 0) {
            const message = document.createElement("p");
            message.className = "section-description";
            message.textContent = "No active courses available yet.";
            grid.appendChild(message);
            return;
        }

        activeCourses.forEach(course => {
            const card = document.createElement("article");
            card.className = "batch-card";

            const icon = document.createElement("div");
            icon.className = "batch-icon";
            icon.textContent = "📚";

            const title = document.createElement("h3");
            title.textContent = course.name || "Untitled Course";

            const details = document.createElement("p");
            details.textContent = [
                course.board || "",
                course.className || "",
                course.teacher ? "Teacher: " + course.teacher : "",
                course.fees !== "" && course.fees != null
                    ? "Fees: ₹" + course.fees
                    : ""
            ].filter(Boolean).join(" • ");

            card.append(icon, title, details);
            grid.appendChild(card);
        });
    }

    function refreshCourses(event) {
        if (!event || event.key === STORAGE_KEY) {
            showAdminCourses();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showAdminCourses);
    } else {
        showAdminCourses();
    }

    // Changes made in another browser tab.
    window.addEventListener("storage", refreshCourses);

    // Changes made in the same tab.
    window.addEventListener("pragatiDBUpdated", showAdminCourses);
})();