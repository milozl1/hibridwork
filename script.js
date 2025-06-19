// === REFERINȚE ELEMENTE HTML ===
const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const userProfileDiv = document.getElementById("userProfile");
const resetBtn = document.getElementById("resetBtn");
const bulkOfficeBtn = document.getElementById("bulkOfficeBtn");
const bulkHomeBtn = document.getElementById("bulkHomeBtn");
const holidayDate = document.getElementById("holidayDate");
const holidayName = document.getElementById("holidayName");
const addHolidayBtn = document.getElementById("addHolidayBtn");
const customHolidaysList = document.getElementById("customHolidaysList");
const filterType = document.getElementById("filterType");
const filterUser = document.getElementById("filterUser");
const filterBtn = document.getElementById("filterBtn");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const statsBtn = document.getElementById("statsBtn");
const statsContainer = document.getElementById("statsContainer");
const toggleTeamViewBtn = document.getElementById("toggleTeamViewBtn");
const teamView = { checked: false };

// === VARIABILE GLOBALE ===
let user = null;
let currentDate = new Date();
let maxHomeDays = 12;
let weekView = false;
const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

// === UTILITARE ===
function pad(n) { return n < 10 ? "0" + n : n; }
function dateStr(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }
function isToday(date) {
  const t = new Date();
  return date.getFullYear() === t.getFullYear() && date.getMonth() === t.getMonth() && date.getDate() === t.getDate();
}
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h},70%,70%)`;
}

// === SĂRBĂTORI ===
const holidaysRO = {
  // 2025
  "2025-01-01": "Anul Nou",
  "2025-01-02": "Anul Nou (a doua zi)",
  "2025-01-24": "Ziua Unirii Principatelor Române",
  "2025-04-20": "Paște Ortodox",
  "2025-04-21": "Paște Ortodox (a doua zi)",
  "2025-05-01": "Ziua Muncii",
  "2025-06-08": "Rusalii (Cincizecime)",
  "2025-06-09": "Rusalii (a doua zi)",
  "2025-08-15": "Adormirea Maicii Domnului",
  "2025-11-30": "Sfântul Andrei",
  "2025-12-01": "Ziua Națională a României",
  "2025-12-25": "Crăciunul",
  "2025-12-26": "Crăciunul (a doua zi)",
  // 2026
  "2026-01-01": "Anul Nou",
  "2026-01-02": "Anul Nou (a doua zi)",
  "2026-01-24": "Ziua Unirii Principatelor Române",
  "2026-04-12": "Paște Ortodox",
  "2026-04-13": "Paște Ortodox (a doua zi)",
  "2026-05-01": "Ziua Muncii",
  "2026-05-31": "Rusalii (Cincizecime)",
  "2026-06-01": "Rusalii (a doua zi)",
  "2026-08-15": "Adormirea Maicii Domnului",
  "2026-11-30": "Sfântul Andrei",
  "2026-12-01": "Ziua Națională a României",
  "2026-12-25": "Crăciunul",
  "2026-12-26": "Crăciunul (a doua zi)",
  // 2027
  "2027-01-01": "Anul Nou",
  "2027-01-02": "Anul Nou (a doua zi)",
  "2027-01-24": "Ziua Unirii Principatelor Române",
  "2027-05-02": "Paște Ortodox",
  "2027-05-03": "Paște Ortodox (a doua zi)",
  "2027-05-01": "Ziua Muncii",
  "2027-06-20": "Rusalii (Cincizecime)",
  "2027-06-21": "Rusalii (a doua zi)",
  "2027-08-15": "Adormirea Maicii Domnului",
  "2027-11-30": "Sfântul Andrei",
  "2027-12-01": "Ziua Națională a României",
  "2027-12-25": "Crăciunul",
  "2027-12-26": "Crăciunul (a doua zi)"
};
// Sărbători personalizate doar pentru utilizatorul curent
function getCustomHolidays() {
  try {
    return JSON.parse(sessionStorage.getItem("customHolidays_" + user) || "{}");
  } catch {
    return {};
  }
}
function setCustomHolidays(obj) {
  sessionStorage.setItem("customHolidays_" + user, JSON.stringify(obj));
}
let customHolidays = getCustomHolidays();
function renderCustomHolidays() {
  customHolidaysList.innerHTML = Object.entries(customHolidays)
    .map(([date, name]) => `<div>${date}: ${name} <button data-date="${date}" class="removeHolidayBtn">Șterge</button></div>`)
    .join("");
  // Atașează handler pentru fiecare buton
  document.querySelectorAll('.removeHolidayBtn').forEach(btn => {
    btn.onclick = function() {
      const date = btn.getAttribute('data-date');
      delete customHolidays[date];
      setCustomHolidays(customHolidays);
      renderCustomHolidays();
      generateCalendar(currentDate);
    };
  });
}
addHolidayBtn.onclick = () => {
  const date = holidayDate.value;
  const name = holidayName.value;
  if (date && name) {
    customHolidays[date] = name;
    setCustomHolidays(customHolidays);
    renderCustomHolidays();
    generateCalendar(currentDate);
  }
};
renderCustomHolidays();

// === FIREBASE INIT ===
if (typeof firebase === 'undefined') {
  throw new Error('Firebase SDK nu este încărcat!');
}
const firebaseConfig = {
  apiKey: "AIzaSyAWWO3oeiIEZNf5DrYD2LvSBVV0U-aw-Oo",
  authDomain: "office-hibrid.firebaseapp.com",
  projectId: "office-hibrid",
  storageBucket: "office-hibrid.appspot.com",
  messagingSenderId: "47327667023",
  appId: "1:47327667023:web:e56674e6c448f1c26ddb3a",
  measurementId: "G-LDNZD6VYR9"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// === FIREBASE: SALVARE/ÎNCĂRCARE ===
function saveSelectionsToDB(user, year, month, selections) {
  return db.collection("calendars")
    .doc(`${user}_${year}_${month}`)
    .set({ user, year, month, selections });
}
function loadSelectionsFromDB(user, year, month) {
  return db.collection("calendars")
    .doc(`${user}_${year}_${month}`)
    .get()
    .then(doc => doc.exists ? doc.data().selections : []);
}
function loadAllSelectionsFromDB(year, month) {
  return db.collection("calendars")
    .where("year", "==", year)
    .where("month", "==", month)
    .get()
    .then(snapshot => {
      const data = {};
      snapshot.forEach(doc => {
        data[doc.data().user] = doc.data().selections;
      });
      return data;
    });
}

// === MASS EDIT VARS ===
let mouseDown = false;
let massEditActive = false;
let selectedMass = [];
let lastEntered = null;
function clearMassSelection() {
  selectedMass.forEach(idx => {
    const cell = document.querySelector(`#calendarGrid .day[data-idx='${idx}']`);
    if (cell) cell.classList.remove("selected-mass");
  });
  selectedMass = [];
  removeMassEditPopup();
}
function showMassEditPopup(x, y) {
  removeMassEditPopup();
  const popup = document.createElement("div");
  popup.id = "massEditPopup";
  popup.style.position = "fixed";
  popup.style.left = x + "px";
  popup.style.top = y + "px";
  popup.innerHTML = `
    <b>${translations[currentLang].massEdit}</b><br>
    <button data-type="office">${translations[currentLang].office}</button>
    <button data-type="home">${translations[currentLang].home}</button>
    <button data-type="vacation">${translations[currentLang].vacation}</button>
    <button data-type="clear">${translations[currentLang].clear}</button>
    <button data-type="cancel">${translations[currentLang].cancel}</button>
  `;
  document.body.appendChild(popup);
  popup.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.type === "cancel") {
        clearMassSelection();
        return;
      }
      if (btn.dataset.type === "clear") {
        selectedMass.forEach(idx => {
          const sel = document.querySelector(`#calendarGrid .day[data-idx='${idx}'] select`);
          if (sel && !sel.disabled) sel.value = "";
        });
      } else {
        selectedMass.forEach(idx => {
          const sel = document.querySelector(`#calendarGrid .day[data-idx='${idx}'] select`);
          if (sel && !sel.disabled) sel.value = btn.dataset.type;
        });
      }
      // Salvare robustă și la mass edit
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const selections = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`);
        selections.push(dayCell ? dayCell.value : "");
      }
      saveSelectionsToDB(user, year, month, selections).then(() => generateCalendar(currentDate));
      clearMassSelection();
    };
  });
}
function removeMassEditPopup() {
  const old = document.getElementById("massEditPopup");
  if (old) old.remove();
}

// === FILTRARE ===
let filter = { type: "", user: "" };
filterBtn.onclick = () => {
  filter.type = filterType.value;
  filter.user = filterUser.value.trim().toLowerCase();
  generateCalendar(currentDate);
};
resetFilterBtn.onclick = () => {
  filter = { type: "", user: "" };
  filterType.value = "";
  filterUser.value = "";
  generateCalendar(currentDate);
};

// === LEGENDĂ ECHIPĂ ===
let teamLegendDiv = document.getElementById("teamLegend");
if (!teamLegendDiv) {
  teamLegendDiv = document.createElement("div");
  teamLegendDiv.id = "teamLegend";
  teamLegendDiv.style.margin = "18px 0 10px 0";
  teamLegendDiv.style.display = "none";
  teamLegendDiv.style.justifyContent = "center";
  teamLegendDiv.style.flexWrap = "wrap";
  teamLegendDiv.style.gap = "18px";
  teamLegendDiv.style.background = "#f7f9fc";
  teamLegendDiv.style.padding = "10px 0 6px 0";
  teamLegendDiv.style.borderRadius = "10px";
  calendarGrid.parentNode.insertBefore(teamLegendDiv, calendarGrid);
}

function renderTeamLegend(users) {
  let html = '';
  for (const u of users) {
    const displayName = getUserDisplayName(u);
    const initials = getUserInitials(u);
    html += `<span style="display:flex;align-items:center;gap:6px;">
      <span style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:${stringToColor(u)};color:#222;font-weight:bold;align-items:center;justify-content:center;font-size:17px;box-shadow:0 1px 4px #0001;" title="${displayName}">${initials}</span>
      <span style="font-size:15px;font-weight:500;">${displayName}</span>
    </span>`;
  }
  return html;
}

function generateCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  loadAllSelectionsFromDB(year, month).then(allSelections => {
    // === FILTRARE UTILIZATOR ===
    let filteredSelections = { ...allSelections };
    if (filter.user && teamView.checked) {
      filteredSelections = {};
      for (const [u, sel] of Object.entries(allSelections)) {
        if ((userNameMap[u] || u).toLowerCase().includes(filter.user)) {
          filteredSelections[u] = sel;
        }
      }
    }
    // === FILTRARE TIP ===
    if (filter.type && teamView.checked) {
      for (const u of Object.keys(filteredSelections)) {
        filteredSelections[u] = filteredSelections[u].map(val => val === filter.type ? filter.type : "");
      }
    }
    loadSelectionsFromDB(user, year, month).then(savedSelections => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1);
      const startDay = (firstDay.getDay() + 6) % 7;
      monthTitle.textContent = `${months[month]} ${year}`;
      calendarGrid.innerHTML = "";
      // === TEAM LEGEND ===
      if (teamView.checked) {
        const users = Object.keys(filteredSelections).sort();
        teamLegendDiv.innerHTML = renderTeamLegend(users);
        teamLegendDiv.style.display = "flex";
      } else {
        teamLegendDiv.style.display = "none";
      }

      // Header zile săptămână
      translations[currentLang].weekdaysShort.forEach(day => {
        const div = document.createElement("div");
        div.textContent = day;
        div.style.fontWeight = "bold";
        div.style.background = "#e8f0fe";
        div.style.textAlign = "center";
        div.style.border = "none";
        calendarGrid.appendChild(div);
      });

      // Spații goale pentru începutul lunii (doar în modul lunar)
      if (!weekView) {
        for (let i = 0; i < startDay; i++) {
          const empty = document.createElement("div");
          empty.className = "day disabled";
          calendarGrid.appendChild(empty);
        }
      }

      let startDayIdx = 1;
      let endDayIdx = daysInMonth;
      if (weekView) {
        const today = new Date();
        if (today.getMonth() === month && today.getFullYear() === year) {
          const dayOfMonth = today.getDate();
          const dayOfWeek = (new Date(year, month, dayOfMonth).getDay() + 6) % 7; // luni=0
          startDayIdx = Math.max(1, dayOfMonth - dayOfWeek);
          endDayIdx = Math.min(daysInMonth, startDayIdx + 6);
        } else {
          startDayIdx = 1;
          endDayIdx = 7;
        }
      }

      for (let d = startDayIdx; d <= endDayIdx; d++) {
        const dateObj = new Date(year, month, d);
        const isWk = isWeekend(dateObj);
        const dateString = dateStr(year, month + 1, d);

        // --- WEEKEND: structură identică în ambele moduri ---
        if (isWk) {
          const cell = document.createElement("div");
          cell.className = "day disabled";
          cell.setAttribute("data-idx", d - 1);
          cell.style.position = "relative";
          const label = document.createElement("div");
          label.textContent = d;
          label.style.fontWeight = "bold";
          label.style.fontSize = "16px";
          label.style.marginBottom = "4px";
          cell.appendChild(label);
          if (teamView.checked) {
            const wk = document.createElement("div");
            wk.textContent = translations[currentLang].weekend;
            wk.style.fontSize = "13px";
            wk.style.marginTop = "10px";
            wk.style.color = "#bbb";
            cell.appendChild(wk);
          }
          calendarGrid.appendChild(cell);
          continue;
        }
        // --- ZILE LUCRĂTOARE ---
        const cell = document.createElement("div");
        cell.className = "day";
        cell.setAttribute("data-idx", d - 1);
        cell.style.position = "relative";
        if (isToday(dateObj)) cell.classList.add("today");
        const label = document.createElement("div");
        label.textContent = d;
        label.style.fontWeight = "bold";
        label.style.fontSize = "16px";
        label.style.marginBottom = "4px";
        cell.appendChild(label);
        if (teamView.checked) {
          // --- TEAM VIEW: doar buline și badge ---
          const usersAtOffice = [];
          for (const [u, sel] of Object.entries(filteredSelections)) {
            if (sel && sel[d - 1] === "office") usersAtOffice.push(u);
          }
          if (usersAtOffice.length > 0) {
            const badge = document.createElement("span");
            badge.textContent = usersAtOffice.length;
            badge.title = `Total la birou: ${usersAtOffice.length}`;
            badge.style.position = "absolute";
            badge.style.top = "6px";
            badge.style.right = "10px";
            badge.style.background = "#2196f3";
            badge.style.color = "#fff";
            badge.style.fontSize = "12px";
            badge.style.borderRadius = "8px";
            badge.style.padding = "0 7px";
            badge.style.zIndex = "2";
            badge.style.boxShadow = "0 1px 4px #0002";
            cell.appendChild(badge);
          }
          if (usersAtOffice.length > Object.keys(allSelections).length / 2) {
            cell.style.background = "#e0f0ff";
            cell.style.border = "2px solid #2196f3";
          } else if (usersAtOffice.length === 0) {
            cell.style.background = "#f7f7f7";
            cell.style.border = "1px solid #eee";
          } else {
            cell.style.background = "#fafdff";
            cell.style.border = "1px solid #cce4ff";
          }
          const teamDiv = document.createElement("div");
          teamDiv.style.display = "flex";
          teamDiv.style.flexWrap = "wrap";
          teamDiv.style.justifyContent = "center";
          teamDiv.style.gap = "4px";
          teamDiv.style.marginTop = "8px";
          usersAtOffice.forEach(u => {
            const displayName = getUserDisplayName(u);
            const initials = getUserInitials(u);
            const span = document.createElement("span");
            span.title = displayName;
            span.textContent = initials;
            span.style.background = stringToColor(u);
            span.style.color = "#222";
            span.style.display = "inline-flex";
            span.style.alignItems = "center";
            span.style.justifyContent = "center";
            span.style.width = "28px";
            span.style.height = "28px";
            span.style.borderRadius = "50%";
            span.style.fontWeight = "bold";
            span.style.fontSize = "17px";
            span.style.boxShadow = "0 1px 4px #0001";
            span.style.cursor = "pointer";
            span.onmouseenter = function(e) {
              const tip = document.createElement("div");
              tip.id = "bulinaTip";
              tip.textContent = displayName;
              tip.style.position = "fixed";
              tip.style.left = (e.clientX + 10) + "px";
              tip.style.top = (e.clientY + 10) + "px";
              tip.style.background = "#23283a";
              tip.style.color = "#ffb300";
              tip.style.padding = "4px 10px";
              tip.style.borderRadius = "6px";
              tip.style.fontSize = "13px";
              tip.style.zIndex = 10000;
              document.body.appendChild(tip);
            };
            span.onmouseleave = function() {
              const tip = document.getElementById("bulinaTip");
              if (tip) tip.remove();
            };
            teamDiv.appendChild(span);
          });
          cell.appendChild(teamDiv);

          // --- POPUP cu lista colegilor la click pe zi ---
          cell.style.cursor = "pointer";
          cell.onclick = function(e) {
            // Elimină popup vechi dacă există
            const oldPopup = document.getElementById("dayUsersPopup");
            if (oldPopup) oldPopup.remove();
            // Creează popup
            const popup = document.createElement("div");
            popup.id = "dayUsersPopup";
            popup.style.position = "fixed";
            popup.style.left = (e.clientX + 10) + "px";
            popup.style.top = (e.clientY + 10) + "px";
            popup.style.background = "#fff";
            popup.style.border = "1.5px solid #6366f1";
            popup.style.borderRadius = "10px";
            popup.style.boxShadow = "0 4px 18px #0002";
            popup.style.padding = "16px 22px 14px 22px";
            popup.style.zIndex = 10001;
            popup.style.minWidth = "220px";
            popup.style.maxWidth = "320px";
            popup.style.fontSize = "15px";
            popup.innerHTML = `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><b>${translations[currentLang].day} ${d}</b><button id='closeDayUsersPopup' style='background:none;border:none;font-size:18px;cursor:pointer;'>&times;</button></div>`;
            if (usersAtOffice.length === 0) {
              popup.innerHTML += `<div style='color:#888;'>Niciun coleg prezent la birou.</div>`;
            } else {
              popup.innerHTML += `<ul style='margin:0 0 0 10px;padding:0;'>${usersAtOffice.map(u => `<li style='margin-bottom:2px;'>${getUserDisplayName(u)}</li>`).join("")}</ul>`;
            }
            document.body.appendChild(popup);
            // Închide la click pe X sau în afara popup-ului
            document.getElementById('closeDayUsersPopup').onclick = () => popup.remove();
            setTimeout(() => {
              document.addEventListener('mousedown', function handler(ev) {
                if (!popup.contains(ev.target)) {
                  popup.remove();
                  document.removeEventListener('mousedown', handler);
                }
              });
            }, 10);
          };
        } else {
          // --- MOD EDITARE: dropdown, mass edit etc ---
          // Wrapper pentru select pentru a permite click pe celulă
          const selectWrapper = document.createElement("div");
          selectWrapper.style.position = "relative";
          selectWrapper.style.display = "flex";
          selectWrapper.style.alignItems = "center";
          selectWrapper.style.height = "32px";
          selectWrapper.style.justifyContent = "center";

          const select = document.createElement("select");
          select.style.zIndex = "1";
          select.style.position = "relative";
          select.style.width = "90%";
          select.style.margin = "0 auto";
          ["", "office", "home", "vacation"].forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt ? translations[currentLang][opt] : "";
            select.appendChild(option);
          });
          // Sărbători
          const holiday = holidaysRO[dateString] || customHolidays[dateString];
          if (holiday) {
            cell.title = holiday;
            select.disabled = true;
            select.value = "office";
            cell.classList.add("worked-office");
            cell.setAttribute("data-tooltip", holiday);
          }
          // Reîncarcă selecția salvată
          if (savedSelections[d - 1]) {
            select.value = savedSelections[d - 1];
            if (select.value === "office") cell.classList.add("worked-office");
            if (select.value === "home") cell.classList.add("free");
            if (select.value === "vacation") cell.classList.add("remote-work");
          }
          select.addEventListener("change", () => {
            cell.classList.remove("worked-office", "free", "remote-work");
            if (select.value === "office") cell.classList.add("worked-office");
            if (select.value === "home") cell.classList.add("free");
            if (select.value === "vacation") cell.classList.add("remote-work");
            // Salvare robustă: array cu exact daysInMonth elemente, fiecare pentru o zi
            const selections = [];
            for (let i = 1; i <= daysInMonth; i++) {
              const dayCell = document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`);
              selections.push(dayCell ? dayCell.value : "");
            }
            saveSelectionsToDB(user, year, month, selections).then(() => {
              updateSummary(year, month, selections);
              renderUserProfile(selections); // Actualizează instant profilul
            });
          });

          // Mass edit logic (doar dacă nu e team view și nu e disabled)
          if (!select.disabled) {
            cell.addEventListener("mousedown", e => {
              if (e.button !== 0 || e.target !== cell) return;
              mouseDown = true;
              massEditActive = true;
              clearMassSelection();
              cell.classList.add("selected-mass");
              selectedMass.push(d - 1);
              lastEntered = d - 1;
              e.preventDefault();
            });
            cell.addEventListener("mouseenter", e => {
              if (mouseDown && massEditActive && e.target === cell) {
                if (!selectedMass.includes(d - 1)) {
                  cell.classList.add("selected-mass");
                  selectedMass.push(d - 1);
                  lastEntered = d - 1;
                }
              }
            });
            cell.addEventListener("mouseup", e => {
              if (massEditActive && selectedMass.length > 0 && e.target === cell) {
                const rect = cell.getBoundingClientRect();
                showMassEditPopup(rect.right + 10, rect.top);
              }
              mouseDown = false;
              massEditActive = false;
            });
          }
          selectWrapper.appendChild(select);
          cell.appendChild(selectWrapper);
        }
        calendarGrid.appendChild(cell);
      }
      // === MASS EDIT: clear selection dacă dai click oriunde altundeva ===
      document.addEventListener("mousedown", function massEditDocHandler(e) {
        if (!e.target.closest("#calendarGrid .day") && !e.target.closest("#massEditPopup")) {
          clearMassSelection();
          document.removeEventListener("mousedown", massEditDocHandler);
        }
      });

      updateSummary(year, month, savedSelections);
      renderUserProfile(savedSelections);
    });
  });
}

// === MAPARE USERNAME -> NUME COMPLET ===
let userNameMap = {};
async function loadUserNameMap() {
  const usersSnap = await db.collection("users").get();
  userNameMap = {};
  usersSnap.forEach(doc => {
    const data = doc.data();
    userNameMap[doc.id] = (data.name && data.surname) ? `${capitalize(data.name)} ${capitalize(data.surname)}` : doc.id;
  });
}
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// === UTILITARE NUME ===
function getUserDisplayName(u) {
  return userNameMap[u] || (u.charAt(0).toUpperCase() + u.slice(1));
}
function getUserInitials(u) {
  const displayName = getUserDisplayName(u);
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return displayName.charAt(0).toUpperCase();
}

// === TRADUCERI ===
const translations = {
  ro: {
    view: "MOD VIZUALIZARE",
    customHolidays: "Sărbători personalizate",
    addHoliday: "Nume sărbătoare",
    filterCalendar: "Filtrare calendar",
    allTypes: "Toate tipurile",
    office: "Office",
    home: "Home",
    vacation: "Vacanță",
    userFilter: "Filtru utilizator (echipă)",
    filter: "Filtrează",
    resetFilters: "Resetează filtrele",
    resetMonth: "Resetare lună",
    allOffice: "Toate Office",
    allHome: "Toate Home",
    stats: "Statistici lunare",
    logout: "Delogare",
    summary: "Sumar:",
    totalSelected: "Total selectate:",
    weekdaysShort: ["Lun", "Mar", "Mie", "Joi", "Vin", "Sam", "Dum"],
    // Dynamic/statistics
    personalSummary: "Rezumat personal:",
    daysOffice: "Zile Office",
    daysHome: "Zile Home",
    daysVacation: "Zile Vacanță",
    daysWork: "Zile lucrătoare în lună",
    daysHomeLeft: "Zile rămase de home office",
    daysHomeExceeded: "⚠ DEPĂȘIT!",
    daysHomeOf: "din",
    daysOfficeRequired: "Zile obligatorii la birou (fără vacanță)",
    top3Presence: "Top 3 zile cu cea mai mare prezență la birou (doar săptămâna curentă și următoarele 2):",
    present: "(ai fost prezent)",
    absent: "(ai lipsit)",
    highPresenceDays: "Zile cu prezență mare in care lipsești (doar săptămâna curentă și următoarele 2):",
    none: "-",
    socialSuggestion: "Sugestie socializare (doar săptămâna curentă și următoarele 2):",
    socialize: "Dacă vrei să socializezi, vino la birou în zilele:",
    noHighPresence: "Nu există zile cu prezență mare în următoarele 3 săptămâni.",
    // Chart
    chartLabel: "Număr colegi la birou",
    chartX: "Ziua lunii",
    chartY: "Colegii la birou",
    // Tooltips & popups
    switchToPersonal: "Comută la vizualizare personală",
    switchToTeam: "Comută la vizualizare echipă",
    confirmReset: "Resetezi toate selecțiile pentru această lună?",
    // Mass edit popup
    massEdit: "Editare în masă",
    clear: "Golește",
    cancel: "Anulează",
    // Legend/weekend
    weekend: "Weekend",
    day: "Ziua",
  },
  en: {
    view: "View Mode",
    customHolidays: "Custom holidays",
    addHoliday: "Holiday name",
    filterCalendar: "Calendar filter",
    allTypes: "All types",
    office: "Office",
    home: "Home",
    vacation: "Vacation",
    userFilter: "User filter (team)",
    filter: "Filter",
    resetFilters: "Reset filters",
    resetMonth: "Reset month",
    allOffice: "All Office",
    allHome: "All Home",
    stats: "Monthly stats",
    logout: "Logout",
    summary: "Summary:",
    totalSelected: "Total selected:",
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // Dynamic/statistics
    personalSummary: "Personal summary:",
    daysOffice: "Office days",
    daysHome: "Home days",
    daysVacation: "Vacation days",
    daysWork: "Working days in month",
    daysHomeLeft: "Home office days left",
    daysHomeExceeded: "⚠ EXCEEDED!",
    daysHomeOf: "of",
    daysOfficeRequired: "Mandatory office days (excluding vacation)",
    top3Presence: "Top 3 days with highest office presence (current and next 2 weeks only):",
    present: "(you were present)",
    absent: "(you were absent)",
    highPresenceDays: "High presence days you miss (current and next 2 weeks only):",
    none: "-",
    socialSuggestion: "Social suggestion (current and next 2 weeks only):",
    socialize: "If you want to socialize, come to the office on:",
    noHighPresence: "No high presence days in the next 3 weeks.",
    // Chart
    chartLabel: "Number of colleagues at office",
    chartX: "Day of month",
    chartY: "Colleagues at office",
    // Tooltips & popups
    switchToPersonal: "Switch to personal view",
    switchToTeam: "Switch to team view",
    confirmReset: "Reset all selections for this month?",
    // Mass edit popup
    massEdit: "Mass edit",
    clear: "Clear",
    cancel: "Cancel",
    // Legend/weekend
    weekend: "Weekend",
    day: "Day",
  }
};
let currentLang = localStorage.getItem('calendar-lang') || 'ro';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('calendar-lang', lang);
  // Sidebar titles
  document.querySelectorAll('.sidebar-title')[0].textContent = translations[lang].view;
  document.querySelectorAll('.sidebar-title')[1].textContent = translations[lang].customHolidays;
  document.querySelectorAll('.sidebar-title')[2].textContent = translations[lang].filterCalendar;
  // Holiday placeholder
  document.getElementById('holidayName').placeholder = translations[lang].addHoliday;
  // Filter section
  document.getElementById('filterType').options[0].textContent = translations[lang].allTypes;
  document.getElementById('filterType').options[1].textContent = translations[lang].office;
  document.getElementById('filterType').options[2].textContent = translations[lang].home;
  document.getElementById('filterType').options[3].textContent = translations[lang].vacation;
  document.getElementById('filterUser').placeholder = translations[lang].userFilter;
  document.getElementById('filterBtn').title = translations[lang].filter;
  document.getElementById('resetFilterBtn').title = translations[lang].resetFilters;
  // Action bar
  document.getElementById('resetBtn').innerHTML = `<span class="material-icons">refresh</span> ${translations[lang].resetMonth}`;
  document.getElementById('bulkOfficeBtn').innerHTML = `<span class="material-icons">business</span> ${translations[lang].allOffice}`;
  document.getElementById('bulkHomeBtn').innerHTML = `<span class="material-icons">home</span> ${translations[lang].allHome}`;
  // Language button visual effect: show language code in a styled span
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.innerHTML = `<span style="font-weight:bold;font-size:16px;letter-spacing:1px;padding:2px 8px;border-radius:8px;background:#f3f6ff;color:#6c63ff;box-shadow:0 1px 4px #0001;">${lang === 'ro' ? 'RO' : 'EN'}</span>`;
    langBtn.title = lang === 'ro' ? 'Schimbă limba în engleză' : 'Switch language to Romanian';
  }
  // Sumar
  const summaryDiv = document.getElementById('summary');
  if (summaryDiv) summaryDiv.innerHTML = summaryDiv.innerHTML.replace(/^(Sumar:|Summary:)/, translations[lang].summary);
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.textContent = translations[lang].logout;
}

document.getElementById('langBtn').onclick = function() {
  setLang(currentLang === 'ro' ? 'en' : 'ro');
  location.reload();
};
window.addEventListener('DOMContentLoaded', () => setLang(currentLang));

// === NAVIGARE LUNĂ ===
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate);
});
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate);
});
toggleTeamViewBtn.onclick = () => {
  teamView.checked = !teamView.checked;
  toggleTeamViewBtn.classList.toggle("active", teamView.checked);
  // Schimbă iconița și tooltipul
  const icon = document.getElementById("teamViewIcon");
  if (teamView.checked) {
    icon.textContent = "person";
    toggleTeamViewBtn.title = translations[currentLang].switchToPersonal;
  } else {
    icon.textContent = "groups";
    toggleTeamViewBtn.title = translations[currentLang].switchToTeam;
  }
  // Dezactivează opțiunile home/vacation la filtrare când e team view
  if (teamView.checked) {
    Array.from(filterType.options).forEach(opt => {
      if (opt.value === "home" || opt.value === "vacation") {
        opt.disabled = true;
        if (filterType.value === opt.value) filterType.value = "";
      } else {
        opt.disabled = false;
      }
    });
  } else {
    Array.from(filterType.options).forEach(opt => { opt.disabled = false; });
  }
  generateCalendar(currentDate);
};
// Inițializare iconiță corectă la încărcare
window.addEventListener('DOMContentLoaded', async () => {
  const sessionUser = sessionStorage.getItem("calendar-current-user");
  if (!sessionUser) {
    window.location.href = "auth.html";
    return;
  }
  user = sessionUser.trim(); // FĂRĂ .toLowerCase() ca să corespundă exact cu id-ul din Firestore!
  await loadUserNameMap();
  customHolidays = getCustomHolidays();
  renderCustomHolidays();
  generateCalendar(currentDate);
  loadSelectionsFromDB(user, currentDate.getFullYear(), currentDate.getMonth()).then(selections => {
    renderUserProfile(selections);
  });
  const icon = document.getElementById("teamViewIcon");
  if (teamView.checked) {
    icon.textContent = "person";
    toggleTeamViewBtn.title = translations[currentLang].switchToPersonal;
  } else {
    icon.textContent = "groups";
    toggleTeamViewBtn.title = translations[currentLang].switchToTeam;
  }
});

// === DARK MODE ===
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("calendar-dark-mode", document.body.classList.contains("dark-mode"));
});
if (localStorage.getItem("calendar-dark-mode") === "true") {
  document.body.classList.add("dark-mode");
}

// === RESETARE LUNĂ ===
resetBtn.onclick = () => {
  if (confirm(translations[currentLang].confirmReset)) {
    saveSelectionsToDB(user, currentDate.getFullYear(), currentDate.getMonth(), []).then(() => generateCalendar(currentDate));
  }
};

// === TOATE OFFICE/HOME ===
bulkOfficeBtn.onclick = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selections = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = dateStr(year, month + 1, d);
    const weekend = isWeekend(dateObj);
    const holiday = holidaysRO[dateString] || customHolidays[dateString];
    selections.push((!weekend && !holiday) ? "office" : "");
  }
  saveSelectionsToDB(user, year, month, selections).then(() => generateCalendar(currentDate));
};

bulkHomeBtn.onclick = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selections = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = dateStr(year, month + 1, d);
    const weekend = isWeekend(dateObj);
    const holiday = holidaysRO[dateString] || customHolidays[dateString];
    selections.push((!weekend && !holiday) ? "home" : "");
  }
  saveSelectionsToDB(user, year, month, selections).then(() => generateCalendar(currentDate));
};

// === STATISTICI LUNARE ===
statsBtn.onclick = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  loadAllSelectionsFromDB(year, month).then(allSelections => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // --- Filtrare: doar zile din săptămâna curentă și următoarele 2 săptămâni ---
    const startIdx = (() => {
      // Prima zi eligibilă: azi sau prima zi a săptămânii curente dacă azi e weekend
      let idx = today.getMonth() === month && today.getFullYear() === year ? today.getDate() - 1 : 0;
      // Dacă azi e weekend, sari la luni
      const dayOfWeek = (new Date(year, month, idx + 1).getDay() + 6) % 7;
      if (dayOfWeek === 5) idx += 2; // sâmbătă -> luni
      if (dayOfWeek === 6) idx += 1; // duminică -> luni
      return Math.max(0, idx);
    })();
    const endIdx = Math.min(daysInMonth - 1, startIdx + 20); // 21 zile (3 săptămâni)
    // ---
    const prezentaPeZi = Array(daysInMonth).fill(0);
    Object.values(allSelections).forEach(sel => {
      for (let i = 0; i < daysInMonth; i++) {
        if (sel[i] === "office") prezentaPeZi[i]++;
      }
    });
    // Top 3 zile cu cea mai mare prezență (doar în intervalul dorit)
    const topZile = prezentaPeZi
      .map((v, i) => ({ zi: i + 1, v }))
      .filter(z => z.zi - 1 >= startIdx && z.zi - 1 <= endIdx)
      .sort((a, b) => b.v - a.v || a.zi - b.zi)
      .slice(0, 3);
    // Recomandare: zile cu prezență mare (doar în intervalul dorit, MAXIM 2 zile)
    const pragSocial = Math.max(2, Math.floor(Object.keys(allSelections).length / 2));
    let zileSociale = prezentaPeZi
      .map((v, i) => (i >= startIdx && i <= endIdx && v >= pragSocial) ? (i + 1) : null)
      .filter(x => x);
    if (zileSociale.length > 2) {
      // Sortează descrescător după prezență, apoi crescător după zi, și păstrează maxim 2
      zileSociale = zileSociale
        .map(zi => ({ zi, v: prezentaPeZi[zi - 1] }))
        .sort((a, b) => b.v - a.v || a.zi - b.zi)
        .slice(0, 2)
        .map(obj => obj.zi);
    }
    // Distribuție office/home/vacanță pe zilele săptămânii (pe toată luna)
    const zileSapt = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
    const distributie = { office: Array(7).fill(0), home: Array(7).fill(0), vacation: Array(7).fill(0) };
    loadSelectionsFromDB(user, year, month).then(mySel => {
      // Calculează zile lucrătoare
      let zileLucratoare = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const dateString = dateStr(year, month + 1, d);
        if (!isWeekend(dateObj) && !holidaysRO[dateString] && !customHolidays[dateString]) {
          zileLucratoare++;
        }
      }
      // Calculează statistici personale
      let zileOffice = 0, zileHome = 0, zileVac = 0;
      let zileBirouCuMulti = 0, zileBirouSingur = 0;
      let ratariSocial = [];
      for (let i = 0; i < daysInMonth; i++) {
        const ziSapt = (new Date(year, month, i + 1).getDay() + 6) % 7; // luni=0
        if (mySel[i] === "office") {
          zileOffice++;
          if (prezentaPeZi[i] > 1) zileBirouCuMulti++;
          if (prezentaPeZi[i] === 1) zileBirouSingur++;
        }
        if (mySel[i] === "home") zileHome++;
        if (mySel[i] === "vacation") zileVac++;
        // Ai ratat o zi cu prezență mare? (doar în intervalul dorit)
        if (i >= startIdx && i <= endIdx && prezentaPeZi[i] >= pragSocial && mySel[i] !== "office") ratariSocial.push(i + 1);
      }
      // Sugestie personalizată (doar în intervalul dorit, maxim 2 zile)
      let sugestie = "";
      if (zileSociale.length) {
        sugestie = `${translations[currentLang].socialize} <b>${zileSociale.join(", ")}</b>.`;
      } else {
        sugestie = translations[currentLang].noHighPresence;
      }
      // 4. Afișare rezumat + grafic + recomandări + statistici avansate
      statsContainer.innerHTML = `
        <div style="background:#f7f9fc;padding:10px 14px;border-radius:10px;margin-bottom:12px;">
          <b>${translations[currentLang].personalSummary}</b><br/>
          - ${translations[currentLang].daysOffice}: <b>${zileOffice}</b><br/>
          - ${translations[currentLang].daysHome}: <b>${zileHome}</b> ${zileHome > maxHomeDays ? `<span style=\"color:red;font-weight:bold;\">${translations[currentLang].daysHomeExceeded}</span>` : ''}<br/>
          - ${translations[currentLang].daysVacation}: <b>${zileVac}</b><br/>
          - ${translations[currentLang].daysWork}: <b>${zileLucratoare}</b><br/>
          - ${translations[currentLang].daysHomeLeft}: <b>${Math.max(0, maxHomeDays - zileHome)}</b> ${translations[currentLang].daysHomeOf} ${maxHomeDays}<br/>
          - ${translations[currentLang].daysOfficeRequired}: <b>${Math.max(0, zileLucratoare - maxHomeDays)}</b><br/>
        </div>
        <canvas id="statsChart" height="80"></canvas>
        <div style="margin-top:12px;font-size:15px;">
          <b>${translations[currentLang].top3Presence}</b><br>
          <ul style='margin:4px 0 10px 18px;'>
            ${topZile.map(z => `<li>${translations[currentLang].day} ${z.zi}: <b>${z.v}</b> ${translations[currentLang].colleagues}${mySel[z.zi-1]==="office" ? ` <span style='color:green'>(${translations[currentLang].present})</span>` : ` <span style='color:#888'>(${translations[currentLang].absent})</span>`}</li>`).join("")}
          </ul>
          <b>${translations[currentLang].highPresenceDays}</b> ${ratariSocial.length ? ratariSocial.join(", ") : translations[currentLang].none}<br>
          <b>${translations[currentLang].socialSuggestion}</b> ${sugestie}<br>
        </div>
      `;
      // Grafic bară cu prezența pe zile (luna întreagă)
      const ctx = document.getElementById("statsChart").getContext("2d");
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({length: daysInMonth}, (_, i) => (i+1).toString()),
          datasets: [{
            label: translations[currentLang].chartLabel,
            data: prezentaPeZi,
            backgroundColor: '#2196f3',
            borderRadius: 6,
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: translations[currentLang].chartX } },
            y: { title: { display: true, text: translations[currentLang].chartY, color: '#2196f3' }, beginAtZero: true, precision:0 }
          }
        }
      });
    });
  });
};

// === PROFIL UTILIZATOR ===
function renderUserProfile(selections) {
  const stats = { office: 0, home: 0, vacation: 0 };
  selections.forEach(val => { if (stats[val] !== undefined) stats[val]++; });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let zileLucratoare = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = dateStr(year, month + 1, d);
    if (!isWeekend(dateObj) && !holidaysRO[dateString] && !customHolidays[dateString]) {
      zileLucratoare++;
    }
  }
  const zileRamaseHome = Math.max(0, maxHomeDays - stats.home);
  const zileObligatoriiOffice = Math.max(0, zileLucratoare - maxHomeDays);
  const total = stats.office + stats.home + stats.vacation;
  const displayName = userNameMap[user] || (user.charAt(0).toUpperCase() + user.slice(1));
  const initials = displayName.split(' ').map(s => s[0]).join('').toUpperCase();
  userProfileDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:48px;height:48px;border-radius:50%;background:#2196f3;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">
        ${initials}
      </div>
      <div>
        <div style="font-size:18px;font-weight:bold;display:flex;align-items:center;gap:10px;">
          ${displayName}
          <button id='logoutBtn' style='margin-left:8px;font-size:13px;padding:4px 10px 4px 10px;'>${translations[currentLang].logout}</button>
        </div>
        <div style="font-size:13px;color:#888;">${translations[currentLang].daysOffice}: <b>${stats.office}</b> | ${translations[currentLang].daysHome}: <b>${stats.home}</b>${stats.home > maxHomeDays ? ` <span style='color:red;font-weight:bold;'>${translations[currentLang].daysHomeExceeded}</span>` : ""} | ${translations[currentLang].daysVacation}: <b>${stats.vacation}</b></div>
        <div style="font-size:13px;color:#888;">${translations[currentLang].totalSelected} <b>${total}</b></div>
        <div style="font-size:13px;color:#2196f3;">${translations[currentLang].daysWork}: <b>${zileLucratoare}</b></div>
        <div style="font-size:13px;color:#fbc02d;">${translations[currentLang].daysHomeLeft}: <b>${zileRamaseHome}</b> ${translations[currentLang].daysHomeOf} ${maxHomeDays}</div>
        <div style="font-size:13px;color:#43a047;">${translations[currentLang].daysOfficeRequired}: <b>${Math.max(0, zileLucratoare - maxHomeDays)}</b></div>
      </div>
    </div>
  `;
  const logoutBtnEl = document.getElementById('logoutBtn');
  if (logoutBtnEl) {
    logoutBtnEl.onclick = () => {
      sessionStorage.clear();
      window.location.href = "auth.html";
    };
  }
}

// === FUNCȚIE SUMAR (afișat sub profil) ===
function updateSummary(year, month, selections) {
  let zileOffice = 0, zileHome = 0, zileVac = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < daysInMonth; i++) {
    if (selections[i] === "office") zileOffice++;
    if (selections[i] === "home") zileHome++;
    if (selections[i] === "vacation") zileVac++;
  }
  let summaryDiv = document.getElementById("summary");
  if (!summaryDiv) {
    summaryDiv = document.createElement("div");
    summaryDiv.id = "summary";
    summaryDiv.style.margin = "12px 0 0 0";
    summaryDiv.style.fontSize = "15px";
    userProfileDiv.parentNode.insertBefore(summaryDiv, userProfileDiv.nextSibling);
  }
  summaryDiv.innerHTML = `<b>${translations[currentLang].summary}</b> ${translations[currentLang].daysOffice}: <b>${zileOffice}</b> | ${translations[currentLang].daysHome}: <b>${zileHome}</b> | ${translations[currentLang].daysVacation}: <b>${zileVac}</b>`;
}

// === INIȚIALIZARE ===
window.addEventListener('DOMContentLoaded', async () => {
  const sessionUser = sessionStorage.getItem("calendar-current-user");
  if (!sessionUser) {
    window.location.href = "auth.html";
    return;
  }
  user = sessionUser.trim(); // FĂRĂ .toLowerCase() ca să corespundă exact cu id-ul din Firestore!
  await loadUserNameMap();
  customHolidays = getCustomHolidays();
  renderCustomHolidays();
  generateCalendar(currentDate);
  loadSelectionsFromDB(user, currentDate.getFullYear(), currentDate.getMonth()).then(selections => {
    renderUserProfile(selections);
  });
  const icon = document.getElementById("teamViewIcon");
  if (teamView.checked) {
    icon.textContent = "person";
    toggleTeamViewBtn.title = translations[currentLang].switchToPersonal;
  } else {
    icon.textContent = "groups";
    toggleTeamViewBtn.title = translations[currentLang].switchToTeam;
  }
});
