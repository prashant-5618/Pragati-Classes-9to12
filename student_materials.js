
const MATERIALS_DB_KEY = "pragatiClassesDB";

function escapeMaterialHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function renderStudentMaterials() {
    const container = document.getElementById("studentMaterialsList");
    if (!container) return;

    let db = {};

    try {
        db = JSON.parse(
            localStorage.getItem(MATERIALS_DB_KEY)
        ) || {};
    } catch (error) {
        console.error("Study materials load error:", error);
    }

    const materials = Array.isArray(db.materials)
        ? db.materials
        : [];

    if (materials.length === 0) {
        container.innerHTML =
            "<p>Abhi koi study material available nahi hai.</p>";
        return;
    }

    container.innerHTML = materials.map(item => {
        const title = escapeMaterialHTML(item.title || "Untitled");
        const subject = escapeMaterialHTML(item.subject || "General");
        const className = escapeMaterialHTML(item.className || "All Classes");
        const type = escapeMaterialHTML(item.type || "Material");

        const url = /^https?:\/\//i.test(item.url || "")
            ? item.url
            : "";

        return `
            <article class="panel" style="margin-top:12px">
                <h3>${title}</h3>
                <p>Subject: ${subject}</p>
                <p>Class: ${className}</p>
                <p>Type: ${type}</p>
                ${
                    url
                        ? `<a href="${escapeMaterialHTML(url)}"
                             target="_blank"
                             rel="noopener noreferrer">
                             View / Download Material
                           </a>`
                        : "<p>Material link add nahi kiya gaya hai.</p>"
                }
            </article>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", renderStudentMaterials);

window.addEventListener("storage", event => {
    if (event.key === MATERIALS_DB_KEY) {
        renderStudentMaterials();
    }
});
