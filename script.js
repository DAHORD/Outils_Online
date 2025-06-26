const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");
const daysEl = document.getElementById("calendar-days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const noteModal = document.getElementById("noteModal");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNote");
const deleteNoteBtn = document.getElementById("deleteNote");
const closeModal = document.getElementById("closeModal");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];


const monthDropdown = document.getElementById("monthDropdown");
const yearDropdown = document.getElementById("yearDropdown");

document.getElementById("month").onclick = () => {
  monthDropdown.innerHTML = months.map((m, i) =>
    `<div data-value="${i}">${m}</div>`).join("");
  showDropdown(monthDropdown, "month");
};

document.getElementById("year").onclick = () => {
  const range = Array.from({length: 21}, (_, i) => currentYear - 10 + i);
  yearDropdown.innerHTML = range.map(y => `<div data-value="${y}">${y}</div>`).join("");
  showDropdown(yearDropdown, "year");
};

function showDropdown(dropdown, type) {
  dropdown.style.display = "block";
  const rect = type === "month"
    ? document.getElementById("month").getBoundingClientRect()
    : document.getElementById("year").getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
  dropdown.style.left = `${rect.left + window.scrollX}px`;
}

monthDropdown.onclick = (e) => {
  const value = +e.target.getAttribute("data-value");
  if (!isNaN(value)) {
    currentMonth = value;
    monthDropdown.style.display = "none";
    renderCalendar(currentMonth, currentYear);
  }
};

yearDropdown.onclick = (e) => {
  const value = +e.target.getAttribute("data-value");
  if (!isNaN(value)) {
    currentYear = value;
    yearDropdown.style.display = "none";
    renderCalendar(currentMonth, currentYear);
  }
};

window.addEventListener("click", (e) => {
  if (!e.target.closest("#monthDropdown") && e.target.id !== "month") {
    monthDropdown.style.display = "none";
  }
  if (!e.target.closest("#yearDropdown") && e.target.id !== "year") {
    yearDropdown.style.display = "none";
  }
});



let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let selectedDay = null;

let notes = JSON.parse(localStorage.getItem("calendarNotes") || "{}");

function renderCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  monthEl.textContent = months[month];
  yearEl.textContent = year;
  daysEl.innerHTML = "";

  for (let i = 0; i < startDay; i++) {
    daysEl.innerHTML += "<li></li>";
  }

  for (let day = 1; day <= lastDate; day++) {
    const key = `${year}-${month}-${day}`;
    const noteExists = !!notes[key];

    const dayEl = document.createElement("li");
    dayEl.innerHTML = `
      <div class="day-number">${day}</div>
      ${noteExists ? `<span class="dot"></span>` : ""}
    `;

    if (
      day === date.getDate() &&
      month === date.getMonth() &&
      year === date.getFullYear()
    ) {
      dayEl.classList.add("active");
    }

    dayEl.onclick = () => {
      selectedDay = key;
      noteInput.value = notes[key] || "";
      noteModal.style.display = "flex";
    };

    daysEl.appendChild(dayEl);
  }
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

saveNoteBtn.onclick = () => {
  if (selectedDay) {
    const text = noteInput.value.trim();
    if (text) {
      notes[selectedDay] = text;
    } else {
      delete notes[selectedDay];
    }
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
    noteModal.style.display = "none";
    renderCalendar(currentMonth, currentYear);
  }
};

deleteNoteBtn.onclick = () => {
  if (selectedDay && notes[selectedDay]) {
    delete notes[selectedDay];
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
    noteInput.value = "";
    noteModal.style.display = "none";
    renderCalendar(currentMonth, currentYear);
  }
};

closeModal.onclick = () => {
  noteModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === noteModal) {
    noteModal.style.display = "none";
  }
};

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mes-notes.json";
  a.click();
  URL.revokeObjectURL(url);
};

importBtn.onclick = () => {
  importInput.click();
};

importInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      notes = data;
      localStorage.setItem("calendarNotes", JSON.stringify(notes));
      renderCalendar(currentMonth, currentYear);
    } catch (err) {
      alert("Fichier JSON invalide.");
    }
  };
  reader.readAsText(file);
};

renderCalendar(currentMonth, currentYear);

document.addEventListener("DOMContentLoaded", () => {
  function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
  }

  setInterval(updateClock, 1000);
  updateClock(); // affichage immédiat
});

