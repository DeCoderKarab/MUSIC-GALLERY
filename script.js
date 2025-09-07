const mainContent = document.getElementById("mainContent");
const navButtons = document.querySelectorAll(".nav-btn");

// Helper function to load data from localStorage or return an empty array/object
function loadFromStorage(key, type = 'array') {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return type === 'array' ? [] : {};
}

// Helper function to save data to localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Data storage (now persistent with localStorage)
let notices = loadFromStorage("notices");
let homeworkList = loadFromStorage("homeworkList");
let summaryList = loadFromStorage("summaryList");
let attendanceRecords = loadFromStorage("attendanceRecords", 'object');
const students = [
  { id: 1, name: "Aarav Singh" },
  { id: 2, name: "Anaya Patel" },
  { id: 3, name: "Rohan Sharma" },
  { id: 4, name: "Meera Gupta" }
];

// Initial notice data (if none exists)
if (notices.length === 0) {
  notices = [
    { id: 1, text: "School holiday on Friday 📅", author: "Principal", date: "Sep 5, 2025", timestamp: Date.now() - 86400000 },
    { id: 2, text: "Unit test on Monday 📝", author: "Ms. Sharma", date: "Sep 6, 2025", timestamp: Date.now() }
  ];
  saveToStorage("notices", notices);
}

// Modal
function showModal(message) {
  const modal = document.getElementById("customModal");
  document.getElementById("modalMessage").textContent = message;
  modal.classList.remove("hidden");
  document.getElementById("modalCloseBtn").onclick = () => {
    modal.classList.add("hidden");
  };
}

// Navigation Logic
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.getAttribute("data-tab");
    if (tab === "home") loadHomeTab();
    else if (tab === "student") loadStudentTab();
    else if (tab === "lock") loadLockTab();
  });
});

// HOME TAB
function loadHomeTab() {
  const sortedNotices = notices.slice().sort((a, b) => b.timestamp - a.timestamp);
  mainContent.innerHTML = `
    <section class="p-4 space-y-4">
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h2 class="text-xl font-bold text-blue-700 mb-2">👩‍🏫 Ms. Priya Sharma</h2>
        <p class="text-sm"><strong>Class:</strong> 6th Standard</p>
        <p class="text-sm"><strong>School:</strong> Green Valley Public School</p>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h3 class="text-md font-bold text-gray-800 mb-3">📢 Notices</h3>
        <ul class="space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
          ${
            sortedNotices.length === 0
              ? '<li class="text-gray-400">No notices yet.</li>'
              : sortedNotices
                  .map(n => `
                    <li class="bg-gray-100 p-3 rounded-md">
                      ${n.text}
                      <div class="text-xs text-gray-500 mt-1">👩‍🏫 ${n.author} | 📅 ${n.date}</div>
                    </li>
                  `).join("")
          }
        </ul>
      </div>
    </section>
  `;
}

// STUDENT TAB
function loadStudentTab() {
  mainContent.innerHTML = `
    <section class="p-4 space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center">📘 Student Options</h2>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <button onclick="loadAttendanceOptions()" class="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📅 <span class="mt-1">Attendance</span>
        </button>
        <button onclick="loadHomeworkOptions()" class="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📝 <span class="mt-1">Homework</span>
        </button>
        <button onclick="loadSummaryOptions()" class="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📖 <span class="mt-1">TODAYS LEARNING SUMMARY</span>
        </button>
        <button onclick="loadNoticeOptions()" class="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📢 <span class="mt-1">Notice</span>
        </button>
      </div>
    </section>
  `;
}

// Notice management
function loadNoticeOptions() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center">📢 Manage Notices</h2>
      <button onclick="loadNoticeFill()" class="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold">➕ Add New Notice</button>
      <button onclick="loadNoticeHistory()" class="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View Notice History</button>
      <button onclick="loadStudentTab()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
}

function loadNoticeFill() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">➕ Add New Notice</h2>
      <form id="noticeForm" class="space-y-5 bg-white p-6 rounded-xl shadow">
        <div>
          <label for="noticeText" class="block font-semibold mb-1">Notice Content</label>
          <textarea id="noticeText" required rows="4" placeholder="Type notice content..." class="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Submit Notice</button>
      </form>
      <button onclick="loadNoticeOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  document.getElementById("noticeForm").addEventListener("submit", e => {
    e.preventDefault();
    const noticeText = document.getElementById("noticeText").value.trim();
    if (noticeText) {
      const newNotice = {
        id: Date.now(),
        text: noticeText,
        author: "Ms. Sharma", // Assuming a fixed author for now
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      };
      notices.push(newNotice);
      saveToStorage("notices", notices);
      showModal("Notice added successfully!");
      loadNoticeFill();
    } else {
      showModal("Please type some content for the notice.");
    }
  });
}

function loadNoticeHistory() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">📚 Notice History</h2>
      <div id="noticeHistoryList" class="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow"></div>
      <button onclick="loadNoticeOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  renderNoticeHistory();
}

function renderNoticeHistory() {
  const listDiv = document.getElementById("noticeHistoryList");
  if (!notices.length) {
    listDiv.innerHTML = `<p class="text-gray-500 text-center">No notices have been added yet.</p>`;
    return;
  }
  const sortedNotices = notices.slice().sort((a, b) => b.timestamp - a.timestamp);
  listDiv.innerHTML = sortedNotices.map(n => `
    <div class="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
      <div>
        <p class="font-semibold">${n.text}</p>
        <p class="text-xs text-gray-500 mt-1">👩‍🏫 ${n.author} | 📅 ${n.date}</p>
      </div>
      <button onclick="deleteNotice(${n.id})" class="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
    </div>
  `).join("");
}

function deleteNotice(id) {
  notices = notices.filter(n => n.id !== id);
  saveToStorage("notices", notices);
  renderNoticeHistory();
}

// ATTENDANCE TAB
function loadAttendanceOptions() {
  mainContent.innerHTML = `
    <section class="p-4 space-y-4 max-w-md mx-auto">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-6">Attendance</h2>
      <button onclick="loadAttendanceFill()" class="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">📝 Fill Attendance</button>
      <button onclick="loadAttendanceHistory()" class="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📅 View History</button>
      <button onclick="loadStudentTab()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
}

// Step 2a: Fill Attendance - Calendar & Student List
function loadAttendanceFill() {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-4">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">Select Date to Mark Attendance</h2>
      <input type="date" id="attendanceDate" value="${today}" min="${today}" max="${today}" class="w-full p-3 rounded border border-gray-300"/>
      <div id="studentAttendanceList" class="mt-4 space-y-4"></div>
      <div class="flex justify-between mt-6">
        <button onclick="loadAttendanceOptions()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold">Back</button>
        <button id="submitAttendanceBtn" disabled class="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold opacity-50 cursor-not-allowed">Submit</button>
      </div>
    </section>
  `;

  const attendanceDateInput = document.getElementById("attendanceDate");
  const studentListDiv = document.getElementById("studentAttendanceList");
  const submitBtn = document.getElementById("submitAttendanceBtn");

  // Render student attendance options
  function renderStudents() {
    studentListDiv.innerHTML = students.map(student => {
      return `
        <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow">
          <span class="font-medium">${student.name}</span>
          <div class="flex gap-2">
            <button data-id="${student.id}" data-status="present" class="attendance-btn px-3 py-1 rounded text-white bg-green-500 hover:bg-green-600">Present</button>
            <button data-id="${student.id}" data-status="absent" class="attendance-btn px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600">Absent</button>
          </div>
        </div>
      `;
    }).join("");
  }

  renderStudents();

  // Track attendance status
  let attendanceStatus = {};

  // Use event delegation for buttons
  studentListDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("attendance-btn")) {
      const btn = e.target;
      const studentId = btn.getAttribute("data-id");
      const status = btn.getAttribute("data-status");

      // Update attendance status
      attendanceStatus[studentId] = status;

      // Update UI buttons opacity
      const siblings = btn.parentElement.querySelectorAll(".attendance-btn");
      siblings.forEach(sib => sib.classList.remove("opacity-50"));
      siblings.forEach(sib => {
        if (sib !== btn) sib.classList.add("opacity-50");
      });

      // Enable submit if all students are marked
      if (Object.keys(attendanceStatus).length === students.length) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }
  });

  // Submit attendance handler
  submitBtn.addEventListener("click", () => {
    const selectedDate = attendanceDateInput.value;
    if (selectedDate !== today) {
      showModal("You can only submit attendance for today's date.");
      return;
    }
    attendanceRecords[selectedDate] = { ...attendanceStatus };
    saveToStorage("attendanceRecords", attendanceRecords);
    showModal("Attendance updated successfully!");
    loadAttendanceOptions();
  });
}

// Step 2b: Attendance History - Calendar & Records View
function loadAttendanceHistory() {
  const today = new Date().toISOString().split("T")[0];
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-4">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">Select Date to View History</h2>
      <input type="date" id="historyDate" max="${today}" class="w-full p-3 rounded border border-gray-300"/>
      <div id="attendanceHistoryList" class="mt-4 space-y-4"></div>
      <button onclick="loadAttendanceOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;

  const historyDateInput = document.getElementById("historyDate");
  const historyListDiv = document.getElementById("attendanceHistoryList");

  historyDateInput.addEventListener("change", () => {
    const selectedDate = historyDateInput.value;
    if (!selectedDate) {
      historyListDiv.innerHTML = "";
      return;
    }
    if (new Date(selectedDate) > new Date(today)) {
      showModal("You can only select today or previous dates.");
      historyDateInput.value = "";
      historyListDiv.innerHTML = "";
      return;
    }
    const record = attendanceRecords[selectedDate];
    if (!record) {
      historyListDiv.innerHTML = `<p class="text-gray-500 text-center">No attendance record found for ${selectedDate}.</p>`;
      return;
    }

    // Count present & absent
    let presentCount = 0;
    let absentCount = 0;

    const listHTML = students.map(student => {
      const status = record[student.id] || "absent";
      if (status === "present") presentCount++;
      else absentCount++;
      return `
        <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow">
          <span>${student.name}</span>
          <span class="${status === "present" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      `;
    }).join("");

    historyListDiv.innerHTML = `
      ${listHTML}
      <div class="mt-4 p-3 bg-gray-100 rounded-xl text-center font-semibold text-gray-700">
        Total Present: <span class="text-green-600">${presentCount}</span> |
        Total Absent: <span class="text-red-600">${absentCount}</span>
      </div>
    `;
  });
}

// LOCK TAB
function loadLockTab() {
  mainContent.innerHTML = `
    <section class="flex items-center justify-center h-full text-center p-4">
      <div class="text-gray-500 text-lg font-medium">
        🔒 This feature is coming soon...
      </div>
    </section>
  `;
}

// HOMEWORK TAB
function loadHomeworkOptions() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center">📝 Homework Management</h2>
      <button onclick="loadHomeworkFill()" class="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">➕ Assign Homework</button>
      <button onclick="loadHomeworkHistory()" class="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View Homework History</button>
      <button onclick="loadStudentTab()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
}

function loadHomeworkFill() {
  const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
  const standards = ["4th Standard", "5th Standard", "6th Standard", "7th Standard", "8th Standard"];

  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">➕ Assign Homework</h2>
      <form id="homeworkForm" class="space-y-5 bg-white p-6 rounded-xl shadow">
        <div>
          <label for="subject" class="block font-semibold mb-1">Subject</label>
          <select id="subject" required class="w-full p-3 border border-gray-300 rounded">
            <option value="" disabled selected>Select subject</option>
            ${subjects.map(sub => `<option value="${sub}">${sub}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="std" class="block font-semibold mb-1">Class / Standard</label>
          <select id="std" required class="w-full p-3 border border-gray-300 rounded">
            <option value="" disabled selected>Select standard</option>
            ${standards.map(std => `<option value="${std}">${std}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="description" class="block font-semibold mb-1">Homework Description</label>
          <textarea id="description" required rows="4" placeholder="Write homework details..." class="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Assign Homework</button>
      </form>
      <button onclick="loadHomeworkOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  document.getElementById("homeworkForm").addEventListener("submit", e => {
    e.preventDefault();
    addHomework();
  });
}

function addHomework() {
  const subject = document.getElementById("subject").value;
  const std = document.getElementById("std").value;
  const description = document.getElementById("description").value.trim();

  if (!subject || !std || !description) {
    showModal("Please fill in all fields.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const newHomework = {
    id: Date.now(),
    subject,
    std,
    description,
    assignedDate: today,
  };

  homeworkList.push(newHomework);
  saveToStorage("homeworkList", homeworkList);
  showModal("Homework assigned successfully!");
  loadHomeworkFill();
}

function loadHomeworkHistory() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">📚 Homework History</h2>
      <div id="homeworkHistoryList" class="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow"></div>
      <button onclick="loadHomeworkOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  renderHomeworkHistory();
}

function renderHomeworkHistory() {
  const listDiv = document.getElementById("homeworkHistoryList");
  if (!homeworkList.length) {
    listDiv.innerHTML = `<p class="text-gray-500 text-center">No homework assigned yet.</p>`;
    return;
  }
  const sortedHomework = homeworkList.slice().sort((a, b) => b.assignedDate.localeCompare(a.assignedDate));
  listDiv.innerHTML = sortedHomework.map(hw => `
    <div class="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
      <div>
        <p class="font-semibold">${hw.subject} - <span class="text-sm text-gray-600">${hw.std}</span></p>
        <p class="text-sm text-gray-700">${hw.description}</p>
        <p class="text-xs text-gray-500 mt-1">Assigned on: ${hw.assignedDate}</p>
      </div>
      <button onclick="deleteHomework(${hw.id})" class="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
    </div>
  `).join("");
}

function deleteHomework(id) {
  const now = new Date();
  const homework = homeworkList.find(hw => hw.id === id);

  if (!homework) return;

  const assignedTime = new Date(homework.id); // since id = Date.now()
  const diffInHours = (now - assignedTime) / (1000 * 60 * 60);

  if (diffInHours > 12) {
    showModal("⏱️ You can only delete homework within 12 hours of assigning it.");
    return;
  }

  homeworkList = homeworkList.filter(hw => hw.id !== id);
  saveToStorage("homeworkList", homeworkList);
  renderHomeworkHistory();
}

// SUMMARY TAB
function loadSummaryOptions() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center">📖 Learning Summary</h2>
      <button onclick="loadSummaryFill()" class="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">➕ Add Summary</button>
      <button onclick="loadSummaryHistory()" class="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View History</button>
      <button onclick="loadStudentTab()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
}

function loadSummaryFill() {
  const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
  const standards = ["4th Standard", "5th Standard", "6th Standard", "7th Standard", "8th Standard"];

  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">➕ Add Learning Summary</h2>
      <form id="summaryForm" class="space-y-5 bg-white p-6 rounded-xl shadow">
        <div>
          <label for="subject" class="block font-semibold mb-1">Subject</label>
          <select id="subject" required class="w-full p-3 border border-gray-300 rounded">
            <option value="" disabled selected>Select subject</option>
            ${subjects.map(sub => `<option value="${sub}">${sub}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="std" class="block font-semibold mb-1">Class / Standard</label>
          <select id="std" required class="w-full p-3 border border-gray-300 rounded">
            <option value="" disabled selected>Select standard</option>
            ${standards.map(std => `<option value="${std}">${std}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="summaryText" class="block font-semibold mb-1">Summary Description</label>
          <textarea id="summaryText" required rows="4" placeholder="Write summary..." class="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Submit</button>
      </form>
      <button onclick="loadSummaryOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  document.getElementById("summaryForm").addEventListener("submit", e => {
    e.preventDefault();
    addSummary();
  });
}

function addSummary() {
  const subject = document.getElementById("subject").value;
  const std = document.getElementById("std").value;
  const summaryText = document.getElementById("summaryText").value.trim();

  if (!subject || !std || !summaryText) {
    showModal("Please fill in all fields.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const newSummary = {
    id: Date.now(),
    subject,
    std,
    summary: summaryText,
    assignedDate: today,
    timestamp: Date.now()
  };

  summaryList.push(newSummary);
  saveToStorage("summaryList", summaryList);
  showModal("Summary added successfully!");
  loadSummaryFill();
}

function loadSummaryHistory() {
  mainContent.innerHTML = `
    <section class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-semibold text-gray-700 text-center mb-4">📚 Learning Summary History</h2>
      <div id="summaryHistoryList" class="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow"></div>
      <button onclick="loadSummaryOptions()" class="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  `;
  renderSummaryHistory();
}

function renderSummaryHistory() {
  const listDiv = document.getElementById("summaryHistoryList");

  if (!summaryList.length) {
    listDiv.innerHTML = `<p class="text-gray-500 text-center">No summaries submitted yet.</p>`;
    return;
  }

  const sortedSummaries = summaryList.slice().sort((a, b) => b.timestamp - a.timestamp);

  listDiv.innerHTML = sortedSummaries.map(s => `
    <div class="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
      <div>
        <p class="font-semibold">${s.subject} - <span class="text-sm text-gray-600">${s.std}</span></p>
        <p class="text-sm text-gray-700">${s.summary}</p>
        <p class="text-xs text-gray-500 mt-1">Submitted on: ${s.assignedDate}</p>
      </div>
      <button onclick="deleteSummary(${s.id})" class="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
    </div>
  `).join("");
}

function deleteSummary(id) {
  summaryList = summaryList.filter(s => s.id !== id);
  saveToStorage("summaryList", summaryList);
  renderSummaryHistory();
}


// Load the initial tab when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHomeTab();
});
