
const STORAGE_KEY = "pragatiClassesDB";

const defaultDB = {
  students: [],
  courses: [],
  materials: [],
  classes: [],
  results: [],
  notices: [],
  settings: {
    websiteName: "Pragati Classes",
    tagline: "Learn Today, Lead Tomorrow"
  }
};

function getDB() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data) {
    return JSON.parse(data);
  }

  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
