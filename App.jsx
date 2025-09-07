import React, { useState, useEffect } from 'react';

// Helper function to load data from localStorage or return an empty array/object
function loadFromStorage(key, type = 'array') {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to parse data for key "${key}"`, e);
      return type === 'array' ? [] : {};
    }
  }
  return type === 'array' ? [] : {};
}

// Helper function to save data to localStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save data for key "${key}"`, e);
  }
}

// Custom Modal Component
const CustomModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs w-full text-center">
        <p className="text-base font-medium mb-4 text-gray-700">{message}</p>
        <button onClick={onClose} className="bg-blue-600 text-white py-2 px-4 rounded-xl w-full hover:bg-blue-700 transition">OK</button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [notices, setNotices] = useState(() => loadFromStorage("notices"));
  const [homeworkList, setHomeworkList] = useState(() => loadFromStorage("homeworkList"));
  const [summaryList, setSummaryList] = useState(() => loadFromStorage("summaryList"));
  const [attendanceRecords, setAttendanceRecords] = useState(() => loadFromStorage("attendanceRecords", 'object'));
  const [modal, setModal] = useState({ message: '', isVisible: false });

  const students = [
    { id: 1, name: "Aarav Singh" },
    { id: 2, name: "Anaya Patel" },
    { id: 3, name: "Rohan Sharma" },
    { id: 4, name: "Meera Gupta" }
  ];

  // Initialize notices if localStorage is empty
  useEffect(() => {
    if (notices.length === 0) {
      const initialNotices = [
        { id: 1, text: "School holiday on Friday 📅", author: "Principal", date: "Sep 5, 2025", timestamp: Date.now() - 86400000 },
        { id: 2, text: "Unit test on Monday 📝", author: "Ms. Sharma", date: "Sep 6, 2025", timestamp: Date.now() }
      ];
      setNotices(initialNotices);
    }
  }, []);

  // Save data to localStorage whenever the state changes
  useEffect(() => {
    saveToStorage("notices", notices);
  }, [notices]);

  useEffect(() => {
    saveToStorage("homeworkList", homeworkList);
  }, [homeworkList]);

  useEffect(() => {
    saveToStorage("summaryList", summaryList);
  }, [summaryList]);

  useEffect(() => {
    saveToStorage("attendanceRecords", attendanceRecords);
  }, [attendanceRecords]);


  const showModal = (message) => {
    setModal({ message, isVisible: true });
  };

  const closeModal = () => {
    setModal({ message: '', isVisible: false });
  };

  const HomeTab = () => {
    const sortedNotices = notices.slice().sort((a, b) => b.timestamp - a.timestamp);
    return (
      <section className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 mb-2">👩‍🏫 Ms. Priya Sharma</h2>
          <p className="text-sm"><strong>Class:</strong> 6th Standard</p>
          <p className="text-sm"><strong>School:</strong> Green Valley Public School</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-md font-bold text-gray-800 mb-3">📢 Notices</h3>
          <ul className="space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
            {sortedNotices.length === 0 ? (
              <li className="text-gray-400">No notices yet.</li>
            ) : (
              sortedNotices.map(n => (
                <li key={n.id} className="bg-gray-100 p-3 rounded-md">
                  {n.text}
                  <div className="text-xs text-gray-500 mt-1">👩‍🏫 {n.author} | 📅 {n.date}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    );
  };

  const StudentTab = () => (
    <section className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 text-center">📘 Student Options</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <button onClick={() => setCurrentTab('attendance-options')} className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📅 <span className="mt-1">Attendance</span>
        </button>
        <button onClick={() => setCurrentTab('homework-options')} className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📝 <span className="mt-1">Homework</span>
        </button>
        <button onClick={() => setCurrentTab('summary-options')} className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📖 <span className="mt-1">TODAYS LEARNING SUMMARY</span>
        </button>
        <button onClick={() => setCurrentTab('notice-options')} className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow font-semibold flex flex-col items-center">
          📢 <span className="mt-1">Notice</span>
        </button>
      </div>
    </section>
  );

  const NoticeOptions = () => (
    <section className="p-4 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 text-center">📢 Manage Notices</h2>
      <button onClick={() => setCurrentTab('notice-fill')} className="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold">➕ Add New Notice</button>
      <button onClick={() => setCurrentTab('notice-history')} className="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View Notice History</button>
      <button onClick={() => setCurrentTab('student')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  );

  const NoticeFill = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const noticeText = e.target.noticeText.value.trim();
      if (noticeText) {
        const newNotice = {
          id: Date.now(),
          text: noticeText,
          author: "Ms. Sharma",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: Date.now()
        };
        setNotices(prevNotices => [...prevNotices, newNotice]);
        showModal("Notice added successfully!");
        e.target.reset();
      } else {
        showModal("Please type some content for the notice.");
      }
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">➕ Add New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
          <div>
            <label htmlFor="noticeText" className="block font-semibold mb-1">Notice Content</label>
            <textarea id="noticeText" required rows="4" placeholder="Type notice content..." className="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Submit Notice</button>
        </form>
        <button onClick={() => setCurrentTab('notice-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const NoticeHistory = () => {
    const sortedNotices = notices.slice().sort((a, b) => b.timestamp - a.timestamp);
    const handleDelete = (id) => {
      setNotices(prevNotices => prevNotices.filter(n => n.id !== id));
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">📚 Notice History</h2>
        <div className="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow">
          {sortedNotices.length === 0 ? (
            <p className="text-gray-500 text-center">No notices have been added yet.</p>
          ) : (
            sortedNotices.map(n => (
              <div key={n.id} className="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
                <div>
                  <p className="font-semibold">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-1">👩‍🏫 {n.author} | 📅 {n.date}</p>
                </div>
                <button onClick={() => handleDelete(n.id)} className="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setCurrentTab('notice-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const AttendanceOptions = () => (
    <section className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">Attendance</h2>
      <button onClick={() => setCurrentTab('attendance-fill')} className="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">📝 Fill Attendance</button>
      <button onClick={() => setCurrentTab('attendance-history')} className="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📅 View History</button>
      <button onClick={() => setCurrentTab('student')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  );

  const AttendanceFill = () => {
    const today = new Date().toISOString().split("T")[0];
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const isReadyToSubmit = Object.keys(attendanceStatus).length === students.length;

    const handleAttendanceChange = (studentId, status) => {
      setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = () => {
      const selectedDate = today;
      setAttendanceRecords(prev => ({ ...prev, [selectedDate]: attendanceStatus }));
      showModal("Attendance updated successfully!");
      setCurrentTab('attendance-options');
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Select Date to Mark Attendance</h2>
        <input type="date" value={today} disabled className="w-full p-3 rounded border border-gray-300"/>
        <div className="mt-4 space-y-4">
          {students.map(student => (
            <div key={student.id} className="flex justify-between items-center p-3 bg-white rounded-xl shadow">
              <span className="font-medium">{student.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAttendanceChange(student.id, 'present')}
                  className={`px-3 py-1 rounded text-white bg-green-500 hover:bg-green-600 ${attendanceStatus[student.id] === 'present' ? '' : 'opacity-50'}`}
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendanceChange(student.id, 'absent')}
                  className={`px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600 ${attendanceStatus[student.id] === 'absent' ? '' : 'opacity-50'}`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentTab('attendance-options')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold">Back</button>
          <button
            onClick={handleSubmit}
            disabled={!isReadyToSubmit}
            className={`bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold ${isReadyToSubmit ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
          >
            Submit
          </button>
        </div>
      </section>
    );
  };

  const AttendanceHistory = () => {
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState('');

    const record = attendanceRecords[selectedDate];
    let presentCount = 0;
    let absentCount = 0;

    if (record) {
      students.forEach(student => {
        const status = record[student.id] || "absent";
        if (status === "present") presentCount++;
        else absentCount++;
      });
    }

    return (
      <section className="p-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Select Date to View History</h2>
        <input
          type="date"
          max={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 rounded border border-gray-300"
        />
        <div className="mt-4 space-y-4">
          {selectedDate && !record && (
            <p className="text-gray-500 text-center">No attendance record found for {selectedDate}.</p>
          )}
          {record && (
            <>
              {students.map(student => {
                const status = record[student.id] || "absent";
                return (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-white rounded-xl shadow">
                    <span>{student.name}</span>
                    <span className={`${status === "present" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                );
              })}
              <div className="mt-4 p-3 bg-gray-100 rounded-xl text-center font-semibold text-gray-700">
                Total Present: <span className="text-green-600">{presentCount}</span> |
                Total Absent: <span className="text-red-600">{absentCount}</span>
              </div>
            </>
          )}
        </div>
        <button onClick={() => setCurrentTab('attendance-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const LockTab = () => (
    <section className="flex items-center justify-center h-full text-center p-4">
      <div className="text-gray-500 text-lg font-medium">
        🔒 This feature is coming soon...
      </div>
    </section>
  );

  const HomeworkOptions = () => (
    <section className="p-4 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 text-center">📝 Homework Management</h2>
      <button onClick={() => setCurrentTab('homework-fill')} className="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">➕ Assign Homework</button>
      <button onClick={() => setCurrentTab('homework-history')} className="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View Homework History</button>
      <button onClick={() => setCurrentTab('student')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  );

  const HomeworkFill = () => {
    const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
    const standards = ["4th Standard", "5th Standard", "6th Standard", "7th Standard", "8th Standard"];
    const handleSubmit = (e) => {
      e.preventDefault();
      const newHomework = {
        id: Date.now(),
        subject: e.target.subject.value,
        std: e.target.std.value,
        description: e.target.description.value.trim(),
        assignedDate: new Date().toISOString().split("T")[0],
      };
      if (!newHomework.subject || !newHomework.std || !newHomework.description) {
        showModal("Please fill in all fields.");
        return;
      }
      setHomeworkList(prev => [...prev, newHomework]);
      showModal("Homework assigned successfully!");
      e.target.reset();
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">➕ Assign Homework</h2>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
          <div>
            <label htmlFor="subject" className="block font-semibold mb-1">Subject</label>
            <select id="subject" required className="w-full p-3 border border-gray-300 rounded">
              <option value="" disabled>Select subject</option>
              {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="std" className="block font-semibold mb-1">Class / Standard</label>
            <select id="std" required className="w-full p-3 border border-gray-300 rounded">
              <option value="" disabled>Select standard</option>
              {standards.map(std => <option key={std} value={std}>{std}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">Homework Description</label>
            <textarea id="description" required rows="4" placeholder="Write homework details..." className="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Assign Homework</button>
        </form>
        <button onClick={() => setCurrentTab('homework-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const HomeworkHistory = () => {
    const sortedHomework = homeworkList.slice().sort((a, b) => b.assignedDate.localeCompare(a.assignedDate));

    const handleDelete = (id) => {
      const now = new Date();
      const homework = homeworkList.find(hw => hw.id === id);
      if (!homework) return;

      const assignedTime = new Date(homework.id);
      const diffInHours = (now - assignedTime) / (1000 * 60 * 60);

      if (diffInHours > 12) {
        showModal("⏱️ You can only delete homework within 12 hours of assigning it.");
        return;
      }
      setHomeworkList(prev => prev.filter(hw => hw.id !== id));
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">📚 Homework History</h2>
        <div className="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow">
          {sortedHomework.length === 0 ? (
            <p className="text-gray-500 text-center">No homework assigned yet.</p>
          ) : (
            sortedHomework.map(hw => (
              <div key={hw.id} className="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
                <div>
                  <p className="font-semibold">{hw.subject} - <span className="text-sm text-gray-600">{hw.std}</span></p>
                  <p className="text-sm text-gray-700">{hw.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned on: {hw.assignedDate}</p>
                </div>
                <button onClick={() => handleDelete(hw.id)} className="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setCurrentTab('homework-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const SummaryOptions = () => (
    <section className="p-4 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 text-center">📖 Learning Summary</h2>
      <button onClick={() => setCurrentTab('summary-fill')} className="w-full bg-green-100 text-green-700 p-4 rounded-xl shadow font-semibold mb-4">➕ Add Summary</button>
      <button onClick={() => setCurrentTab('summary-history')} className="w-full bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow font-semibold">📚 View History</button>
      <button onClick={() => setCurrentTab('student')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
    </section>
  );

  const SummaryFill = () => {
    const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
    const standards = ["4th Standard", "5th Standard", "6th Standard", "7th Standard", "8th Standard"];
    const handleSubmit = (e) => {
      e.preventDefault();
      const newSummary = {
        id: Date.now(),
        subject: e.target.subject.value,
        std: e.target.std.value,
        summary: e.target.summaryText.value.trim(),
        assignedDate: new Date().toISOString().split("T")[0],
        timestamp: Date.now()
      };
      if (!newSummary.subject || !newSummary.std || !newSummary.summary) {
        showModal("Please fill in all fields.");
        return;
      }
      setSummaryList(prev => [...prev, newSummary]);
      showModal("Summary added successfully!");
      e.target.reset();
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">➕ Add Learning Summary</h2>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
          <div>
            <label htmlFor="subject" className="block font-semibold mb-1">Subject</label>
            <select id="subject" required className="w-full p-3 border border-gray-300 rounded">
              <option value="" disabled>Select subject</option>
              {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="std" className="block font-semibold mb-1">Class / Standard</label>
            <select id="std" required className="w-full p-3 border border-gray-300 rounded">
              <option value="" disabled>Select standard</option>
              {standards.map(std => <option key={std} value={std}>{std}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="summaryText" className="block font-semibold mb-1">Summary Description</label>
            <textarea id="summaryText" required rows="4" placeholder="Write summary..." className="w-full p-3 border border-gray-300 rounded resize-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition">Submit</button>
        </form>
        <button onClick={() => setCurrentTab('summary-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const SummaryHistory = () => {
    const sortedSummaries = summaryList.slice().sort((a, b) => b.timestamp - a.timestamp);
    const handleDelete = (id) => {
      setSummaryList(prev => prev.filter(s => s.id !== id));
    };

    return (
      <section className="p-4 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">📚 Learning Summary History</h2>
        <div className="max-h-72 overflow-y-auto space-y-4 bg-white rounded-xl p-4 shadow">
          {sortedSummaries.length === 0 ? (
            <p className="text-gray-500 text-center">No summaries submitted yet.</p>
          ) : (
            sortedSummaries.map(s => (
              <div key={s.id} className="flex justify-between items-start bg-gray-50 rounded p-3 shadow-sm">
                <div>
                  <p className="font-semibold">{s.subject} - <span className="text-sm text-gray-600">{s.std}</span></p>
                  <p className="text-sm text-gray-700">{s.summary}</p>
                  <p className="text-xs text-gray-500 mt-1">Submitted on: {s.assignedDate}</p>
                </div>
                <button onClick={() => handleDelete(s.id)} className="text-red-600 font-bold text-lg hover:text-red-800 ml-4" title="Delete">&times;</button>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setCurrentTab('summary-options')} className="mt-6 w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold">Back</button>
      </section>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeTab />;
      case 'student':
        return <StudentTab />;
      case 'lock':
        return <LockTab />;
      case 'attendance-options':
        return <AttendanceOptions />;
      case 'attendance-fill':
        return <AttendanceFill />;
      case 'attendance-history':
        return <AttendanceHistory />;
      case 'notice-options':
        return <NoticeOptions />;
      case 'notice-fill':
        return <NoticeFill />;
      case 'notice-history':
        return <NoticeHistory />;
      case 'homework-options':
        return <HomeworkOptions />;
      case 'homework-fill':
        return <HomeworkFill />;
      case 'homework-history':
        return <HomeworkHistory />;
      case 'summary-options':
        return <SummaryOptions />;
      case 'summary-fill':
        return <SummaryFill />;
      case 'summary-history':
        return <SummaryHistory />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col antialiased font-sans">
      <main className="flex-grow pb-24 overflow-y-auto">
        {renderContent()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around text-center z-50">
        <button onClick={() => setCurrentTab('home')} className={`nav-btn flex-1 py-3 text-gray-500 ${currentTab === 'home' ? 'active' : ''}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </div>
        </button>
        <button onClick={() => setCurrentTab('student')} className={`nav-btn flex-1 py-3 text-gray-500 ${['student', 'attendance-options', 'attendance-fill', 'attendance-history', 'notice-options', 'notice-fill', 'notice-history', 'homework-options', 'homework-fill', 'homework-history', 'summary-options', 'summary-fill', 'summary-history'].includes(currentTab) ? 'active' : ''}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">👨‍🎓</span>
            <span className="text-xs font-medium">Student</span>
          </div>
        </button>
        <button onClick={() => setCurrentTab('lock')} className={`nav-btn flex-1 py-3 text-gray-500 ${currentTab === 'lock' ? 'active' : ''}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🔒</span>
            <span className="text-xs font-medium">Lock</span>
          </div>
        </button>
      </nav>
      {modal.isVisible && <CustomModal message={modal.message} onClose={closeModal} />}
    </div>
  );
};

export default App;
