
"use strict";

// Login protection: demo frontend only
if (sessionStorage.getItem("pragatiAdminLoggedIn") !== "true") {
  window.location.replace("admin_login.html");
}

const STORAGE_KEY = "pragatiClassesDB";

const moduleConfig = {
  students: {
    title: "Students Management",
    singular: "Student",
    fields: [
      { key: "name", label: "Student Name", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone Number", required: true },
      { key: "className", label: "Class", type: "select",
        options: ["Class 9", "Class 10", "Class 11", "Class 12"] },
      { key: "board", label: "Board", type: "select",
        options: ["BSEB", "CBSE"] },
      { key: "batch", label: "Batch Name" },
      { key: "status", label: "Account Status", type: "select",
        options: ["Active", "Inactive"] }
    ]
  },

  courses: {
    title: "Courses & Batches",
    singular: "Course / Batch",
    fields: [
      { key: "name", label: "Course / Batch Name", required: true },
      { key: "board", label: "Board", type: "select",
        options: ["BSEB", "CBSE"] },
      { key: "className", label: "Class", type: "select",
        options: ["Class 9", "Class 10", "Class 11", "Class 12"] },
      { key: "teacher", label: "Teacher Name" },
      { key: "fees", label: "Fees (INR)", type: "number" },
      { key: "status", label: "Status", type: "select",
        options: ["Active", "Inactive"] }
    ]
  },

  materials: {
    title: "Study Materials",
    singular: "Material",
    fields: [
      { key: "title", label: "Material Title", required: true },
      { key: "subject", label: "Subject" },
      { key: "className", label: "Class", type: "select",
        options: ["Class 9", "Class 10", "Class 11", "Class 12"] },
      { key: "board", label: "Board", type: "select",
        options: ["BSEB", "CBSE"] },
      { key: "type", label: "Material Type", type: "select",
        options: ["PDF", "Video", "Assignment", "Syllabus", "Other"] },
      { key: "url", label: "File / Video URL", type: "url" }
    ]
  },

  classes: {
    title: "Online Classes",
    singular: "Online Class",
    fields: [
      { key: "title", label: "Class Title", required: true },
      { key: "teacher", label: "Teacher Name" },
      { key: "className", label: "Class", type: "select",
        options: ["Class 9", "Class 10", "Class 11", "Class 12"] },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Time", type: "time" },
      { key: "link", label: "Meeting Link", type: "url" },
      { key: "status", label: "Status", type: "select",
        options: ["Scheduled", "Live", "Completed", "Cancelled"] }
    ]
  },

  results: {
    title: "Tests & Results",
    singular: "Result",
    fields: [
      { key: "student", label: "Student Name", required: true },
      { key: "test", label: "Test Name", required: true },
      { key: "subject", label: "Subject" },
      { key: "marks", label: "Marks Obtained", type: "number" },
      { key: "total", label: "Total Marks", type: "number" },
      { key: "status", label: "Result Status", type: "select",
        options: ["Pending", "Published"] }
    ]
  },

  notices: {
    title: "Notices & Announcements",
    singular: "Notice",
    fields: [
      { key: "title", label: "Notice Title", required: true },
      { key: "category", label: "Category", type: "select",
        options: ["Exam", "Holiday", "Admission", "General"] },
      { key: "date", label: "Notice Date", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "status", label: "Publication Status", type: "select",
        options: ["Draft", "Published"] }
    ]
  },
    crashVideos: {
    title: "Crash Course Videos",
    singular: "Crash Course Video",
    fields: [
      {
        key: "title",
        label: "Video Title",
        required: true
      },
      {
        key: "className",
        label: "Crash Course Class",
        type: "select",
        options: ["Class 10", "Class 12"],
        required: true
      },
      {
        key: "url",
        label: "Video URL",
        type: "url",
        required: true
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"]
      }
    ]
  },
};

const defaultData = {
  students: [],
  courses: [],
  materials: [],
  classes: [],
  results: [],
  notices: [],
  crashVideos:[],
  settings: {
    websiteName: "Pragati Classes",
    tagline: "Learn Today, Lead Tomorrow",
    phone: "",
    email: "",
    address: "",
    about: "",
    bannerText: "",
    faculty: "",
    galleryUrl: ""
  }
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") {
      return structuredClone(defaultData);
    }

    const result = structuredClone(defaultData);

    Object.keys(moduleConfig).forEach(key => {
      result[key] = Array.isArray(saved[key]) ? saved[key] : [];
    });

    if (saved.settings && typeof saved.settings === "object") {
      result.settings = { ...result.settings, ...saved.settings };
    }

    return result;
  } catch (error) {
    console.error("Could not load saved data:", error);
    return structuredClone(defaultData);
  }
}

let appData = loadData();
let activePage = "dashboard";
let editingId = null;
let searchTerm = "";

const pageContent = document.getElementById("pageContent");
const pageTitle = document.getElementById("pageTitle");
const dialog = document.getElementById("recordDialog");
const recordForm = document.getElementById("recordForm");
const formFields = document.getElementById("formFields");

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
     window.dispatchEvent(new Event("pragatiDBUpdated"));
    return true;
  } catch (error) {
    alert("Data save nahi hua. Browser storage full ho sakta hai.");
    console.error(error);
    return false;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function makeId() {
  return window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

function renderPage() {
  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === activePage);
  });

  if (activePage === "dashboard") {
    renderDashboard();
  } else if (activePage === "settings") {
    renderSettings();
  } else {
    renderModule(activePage);
  }

  document.getElementById("sidebar").classList.remove("open");
}

function renderDashboard() {
  pageTitle.textContent = "Dashboard";

  const stats = [
    ["Total Students", appData.students.length],
    ["Courses & Batches", appData.courses.length],
    ["Study Materials", appData.materials.length],
    ["Online Classes", appData.classes.length]
  ];

  pageContent.innerHTML = `
    <div class="welcome-card">
      <h3>Welcome to Pragati Classes!</h3>
      <p>Manage students, courses, study materials, classes, results,
      notices and website details from one place.</p>
    </div>

    <div class="stats-grid">
      ${stats.map(([label, value]) => `
        <article class="stat-card">
          <p>${escapeHTML(label)}</p>
          <h3>${value}</h3>
        </article>
      `).join("")}
    </div>

    <div class="panel-card">
      <h3>Quick Actions</h3>
      <div class="quick-links">
        ${Object.entries(moduleConfig).map(([key, config]) => `
          <button class="secondary-btn" data-go="${key}">
            + ${escapeHTML(config.singular)}
          </button>
        `).join("")}
        <button class="secondary-btn" data-go="settings">
          ⚙ Website Settings
        </button>
      </div>
    </div>
  `;

  pageContent.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      activePage = button.dataset.go;
      searchTerm = "";
      renderPage();
    });
  });
}

function renderModule(key) {
  const config = moduleConfig[key];
  if (!config) return;

  pageTitle.textContent = config.title;

  const records = appData[key].filter(record => {
    const text = Object.values(record).join(" ").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const columns = config.fields;

  pageContent.innerHTML = `
    <div class="section-heading">
      <h3>${escapeHTML(config.title)}</h3>
      <button class="primary-btn" id="addRecordBtn">
        + Add ${escapeHTML(config.singular)}
      </button>
    </div>

    <div class="panel-card">
      <input class="search-input" id="searchRecords"
        type="search" placeholder="Search records..."
        value="${escapeHTML(searchTerm)}">
    </div>

    <div class="table-wrap" style="margin-top:15px">
      <table>
        <thead>
          <tr>
            ${columns.map(field => `<th>${escapeHTML(field.label)}</th>`).join("")}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => `
            <tr>
              ${columns.map(field => `
                <td>${escapeHTML(record[field.key] ?? "-")}</td>
              `).join("")}
              <td>
                <div class="table-actions">
                  <button class="edit-btn" data-edit="${escapeHTML(record.id)}">
                    Edit
                  </button>
                  <button class="delete-btn" data-delete="${escapeHTML(record.id)}">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ${records.length === 0
        ? `<div class="empty-state">No records found. Add your first record.</div>`
        : ""}
    </div>
  `;

  document.getElementById("addRecordBtn").addEventListener("click", () => {
    openRecordDialog(key);
  });

  document.getElementById("searchRecords").addEventListener("input", event => {
    searchTerm = event.target.value;
    const cursorPosition = event.target.selectionStart;
    renderModule(key);
    const searchBox = document.getElementById("searchRecords");
    searchBox.focus();
    searchBox.setSelectionRange(cursorPosition, cursorPosition);
  });

  pageContent.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => {
      openRecordDialog(key, button.dataset.edit);
    });
  });

  pageContent.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.delete;
      const confirmed = confirm("Are you sure you want to delete this record?");
      if (!confirmed) return;

      appData[key] = appData[key].filter(record => record.id !== id);

      if (saveData()) renderPage();
    });
  });
}

function openRecordDialog(key, id = null) {
  const config = moduleConfig[key];
  const existing = id
    ? appData[key].find(record => record.id === id)
    : null;

  editingId = id;
  document.getElementById("dialogTitle").textContent =
    `${existing ? "Edit" : "Add"} ${config.singular}`;

  formFields.innerHTML = config.fields.map(field => {
    const value = existing?.[field.key] ?? "";
    const required = field.required ? "required" : "";
    const fullWidth = field.type === "textarea" ? "full-width" : "";

    let control;

    if (field.type === "select") {
      control = `
        <select name="${field.key}" ${required}>
          <option value="">Select option</option>
          ${field.options.map(option => `
            <option value="${escapeHTML(option)}"
              ${value === option ? "selected" : ""}>
              ${escapeHTML(option)}
            </option>
          `).join("")}
        </select>`;
    } else if (field.type === "textarea") {
      control = `
        <textarea name="${field.key}" ${required}
          placeholder="${escapeHTML(field.label)}">${escapeHTML(value)}</textarea>`;
    } else {
      const type = field.type || "text";
      control = `
        <input name="${field.key}" type="${type}"
          value="${escapeHTML(value)}"
          placeholder="${escapeHTML(field.label)}" ${required}>`;
    }

    return `
      <div class="field-group ${fullWidth}">
        <label>${escapeHTML(field.label)}</label>
        ${control}
      </div>`;
  }).join("");

  dialog.showModal();
}

recordForm.addEventListener("submit", event => {
  event.preventDefault();

  const key = activePage;
  const config = moduleConfig[key];
  if (!config) return;

  const formData = new FormData(recordForm);
  const record = {};

  for (const field of config.fields) {
    record[field.key] = String(formData.get(field.key) ?? "").trim();

    if (field.required && !record[field.key]) {
      alert(`${field.label} is required.`);
      return;
    }

    if (field.type === "number" && record[field.key] !== "") {
      const number = Number(record[field.key]);

      if (!Number.isFinite(number) || number < 0) {
        alert(`${field.label} must be a valid non-negative number.`);
        return;
      }

      record[field.key] = number;
    }
  }

  if (key === "results") {
    if (record.total !== "" && record.marks !== "" &&
        Number(record.marks) > Number(record.total)) {
      alert("Marks obtained cannot exceed total marks.");
      return;
    }
  }

  if (editingId) {
    const index = appData[key].findIndex(item => item.id === editingId);
    if (index !== -1) {
      appData[key][index] = { ...appData[key][index], ...record };
    }
  } else {
    appData[key].push({ id: makeId(), ...record });
  }

  if (saveData()) {
    dialog.close();
    editingId = null;
    renderPage();
  }
});

function renderSettings() {
  pageTitle.textContent = "Website Settings";

  const fields = [
    { key: "websiteName", label: "Website Name" },
    { key: "tagline", label: "Tagline" },
    { key: "phone", label: "Contact Number", type: "tel" },
    { key: "email", label: "Contact Email", type: "email" },
    { key: "address", label: "Address", type: "textarea" },
    { key: "about", label: "About Us", type: "textarea" },
    { key: "bannerText", label: "Homepage Banner Text", type: "textarea" },
    { key: "faculty", label: "Faculty Details", type: "textarea" },
    { key: "galleryUrl", label: "Gallery URL", type: "url" }
  ];

  pageContent.innerHTML = `
    <div class="panel-card">
      <h3>Website Information</h3>
      <p class="muted">Edit your institute's website details below.</p>

      <form id="settingsForm" class="settings-form">
        <div class="form-grid">
          ${fields.map(field => {
            const value = appData.settings[field.key] ?? "";
            const type = field.type || "text";

            return `
              <div class="field-group ${
                type === "textarea" ? "full-width" : ""
              }">
                <label>${escapeHTML(field.label)}</label>
                ${type === "textarea"
                  ? `<textarea name="${field.key}">${escapeHTML(value)}</textarea>`
                  : `<input name="${field.key}" type="${type}"
                      value="${escapeHTML(value)}">`}
              </div>`;
          }).join("")}
        </div>

        <button class="primary-btn" type="submit">Save Settings</button>
        <p class="muted small-text">
          These settings are stored in this browser. They do not automatically
          change the live website homepage.
        </p>
      </form>
    </div>
  `;

  document.getElementById("settingsForm").addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    fields.forEach(field => {
      appData.settings[field.key] =
        String(formData.get(field.key) ?? "").trim();
    });

    if (saveData()) {
      alert("Settings saved in this browser.");
    }
  });
}

// Sidebar navigation
document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    activePage = button.dataset.page;
    searchTerm = "";
    renderPage();
  });
});

// Dialog controls
document.getElementById("closeDialog").addEventListener("click", () => {
  dialog.close();
});

document.getElementById("cancelDialog").addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("close", () => {
  editingId = null;
  recordForm.reset();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("pragatiAdminLoggedIn");
  window.location.replace("admin_login.html");
});

// Mobile menu
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// Initial page
renderPage();
