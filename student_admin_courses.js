
"use strict";

(function () {
    const STORAGE_KEY = "pragatiClassesDB";

    function showAdminCourses() {
        let db;

        try {
            db = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "{}"
            );
        } catch (error) {
            console.error("Unable to read admin course data:", error);
            return;
        }

        const courses = Array.isArray(db.courses)
            ? db.courses
            : [];

        // Existing My Courses section
        const myCourses = document.getElementById("courses");

        if (!myCourses) {
            console.error('Section with id="courses" was not found.');
            return;
        }

        // Create a separate admin courses section
        let section = document.getElementById("adminCoursesSection");

        if (!section) {
            section = document.createElement("div");
            section.id = "adminCoursesSection";
            section.className = "panel";

            const heading = document.createElement("h2");
            heading.className = "section-heading";
            heading.textContent = "Courses Added by Admin";

            const description = document.createElement("p");
            description.className = "section-description";
            description.textContent = "Active courses and batches available at Pragati Classes.";

            const grid = document.createElement("div");
            grid.id = "adminCoursesGrid";
            grid.className = "course-cards";

            section.append(heading, description, grid);
            myCourses.appendChild(section);
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
            message.textContent = "No active courses added by admin yet.";
            grid.appendChild(message);
            return;
        }

        activeCourses.forEach(course => {
            const card = document.createElement("article");
            card.className = "panel course-card";

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

    // Initial display
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showAdminCourses);
    } else {
        showAdminCourses();
    }

    // Refresh if admin changes data in another tab
    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY) {
            showAdminCourses();
        }
    });
})();
