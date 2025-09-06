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
const clearHolidaysBtn = document.getElementById('clearHolidaysBtn');
const toggleCustomHolidaysSec = document.getElementById('toggleCustomHolidaysSec');
const toggleFilterSec = document.getElementById('toggleFilterSec');
const customHolidaysCard = document.getElementById('customHolidaysCard');
const filterCard = document.getElementById('filterCard');
const filterType = document.getElementById("filterType");
const filterUser = document.getElementById("filterUser");
const filterBtn = document.getElementById("filterBtn");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const statsBtn = document.getElementById("statsBtn");
const statsContainer = document.getElementById("statsContainer");
const toggleTeamViewBtn = document.getElementById("toggleTeamViewBtn");
const collapseSidebarBtn = document.getElementById('collapseSidebarBtn');
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportIcsBtn = document.getElementById("exportIcsBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const maxHomeDaysInput = document.getElementById("maxHomeDaysInput");
const maxSeatsInput = document.getElementById('maxSeatsInput');
const localeDateFormatSelect = document.getElementById("localeDateFormatSelect");
const autoSaveToggle = document.getElementById("autoSaveToggle");
// New advanced settings inputs
const showOfficeReqToggle = document.getElementById('showOfficeReqToggle');
const adaptiveDebounceToggle = document.getElementById('adaptiveDebounceToggle');
const baseDebounceInput = document.getElementById('baseDebounceInput');
const minDebounceInput = document.getElementById('minDebounceInput');
const maxDebounceInput = document.getElementById('maxDebounceInput');
const loadingOverlay = document.getElementById("loadingOverlay");
const teamView = { checked: false };
const massModeToggleBtn = document.getElementById('massModeToggleBtn');
const selectionModeSelect = document.getElementById('selectionModeSelect');
// Explicit global user holder to avoid implicit global usage
let user = null;
// Reactivare buton comutare vizualizare echipă/personală
if(toggleTeamViewBtn){
  toggleTeamViewBtn.addEventListener('click', async ()=>{
    teamView.checked = !teamView.checked;
    // Resetăm snapshot ca să forțăm rebuild complet (mai ales când intrăm în team view)
    calendarState = null;
    const cd = getCurrentDate();
    await generateCalendar(cd);
    const icon = document.getElementById('teamViewIcon');
    if(teamView.checked){
      if(icon) icon.textContent = 'person';
      toggleTeamViewBtn.title = translations[currentLang].switchToPersonal || 'Personal';
    } else {
      if(icon) icon.textContent = 'groups';
      toggleTeamViewBtn.title = translations[currentLang].switchToTeam || 'Team';
    }
  });
}
// Sidebar collapse/expand
const sidebarEl = document.querySelector('.sidebar');
if(sidebarEl){
  const collapsedPref = localStorage.getItem('calendar-sidebar-collapsed')==='1';
  if(collapsedPref){
    sidebarEl.classList.add('sidebar--collapsed');
    if(collapseSidebarBtn){ collapseSidebarBtn.setAttribute('aria-expanded','false'); const icon=collapseSidebarBtn.querySelector('.material-icons'); if(icon) icon.textContent='chevron_right'; }
    // Build rail actions on start if collapsed
    ensureRailQuickActions();
    updateRailTitles();
  }
}
if(collapseSidebarBtn && sidebarEl){
  collapseSidebarBtn.addEventListener('click', ()=>{
    const isCollapsed = sidebarEl.classList.toggle('sidebar--collapsed');
    localStorage.setItem('calendar-sidebar-collapsed', isCollapsed? '1':'0');
    collapseSidebarBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
    const icon = collapseSidebarBtn.querySelector('.material-icons'); if(icon) icon.textContent = isCollapsed? 'chevron_right':'chevron_left';
    // Update tooltip text according to language
    if(typeof window.setLang === 'function'){ setLang(currentLang); }
    // Ensure rail quick actions exist only in collapsed mode
    ensureRailQuickActions();
    updateRailTitles();
  });
}
// Sidebar rail quick actions (Filter/Reset) visible only in collapsed mode
function ensureRailQuickActions(){
  if(!sidebarEl) return;
  const collapsed = sidebarEl.classList.contains('sidebar--collapsed');
  let rail = document.getElementById('railQuickActions');
  if(!collapsed){ if(rail) rail.remove(); return; }
  if(!rail){
    rail = document.createElement('div');
    rail.id = 'railQuickActions';
    rail.className = 'rail-actions';
    rail.style.cssText = 'display:flex;gap:6px;justify-content:center;padding:6px;';
    // Insert at the top of the sidebar for quick access
    sidebarEl.insertBefore(rail, sidebarEl.firstChild);
  }
  // Always ensure collapsed rail contains only the Expand control
  rail.innerHTML = `
    <button id=\"railExpandBtn\" class=\"icon-btn\" title=\"${t('expandSidebar')}\"><span class=\"material-icons\">chevron_right</span></button>
  `;
  // Wire proxy actions
  const re = document.getElementById('railExpandBtn'); if(re){ re.onclick = ()=>{ if(collapseSidebarBtn) collapseSidebarBtn.click(); else { sidebarEl.classList.remove('sidebar--collapsed'); localStorage.setItem('calendar-sidebar-collapsed','0'); ensureRailQuickActions(); updateRailTitles(); } }; }
}
function updateRailTitles(){
  const rx=document.getElementById('railExpandBtn'); if(rx) rx.title = t('expandSidebar');
}
// Language button handler (toggle RO/EN)
const langBtnEl = document.getElementById('langBtn');
if(langBtnEl){
  langBtnEl.addEventListener('click', async ()=>{
    const next = currentLang === 'ro' ? 'en' : 'ro';
    setLang(next);
    // Invalidate diff snapshot so we rebuild structure with new text
    calendarState = null;
  const cd = getCurrentDate();
  await generateCalendar(cd);
  // Refresh profile & summary (generateCalendar already does, but safe if diff path in future supports lang)
  const sel = await window.dataService.loadUserMonth(getUser(), cd.getFullYear(), cd.getMonth());
    renderUserProfile(sel);
  });
}
// Month navigation (restored)
if(prevBtn){
  prevBtn.addEventListener('click', async ()=>{
    const cd = getCurrentDate();
    const nd = new Date(cd.getFullYear(), cd.getMonth()-1, 1);
    window.calendarStore.setCurrentDate(nd);
    calendarState = null; await generateCalendar(nd);
  });
}
if(nextBtn){
  nextBtn.addEventListener('click', async ()=>{
    const cd = getCurrentDate();
    const nd = new Date(cd.getFullYear(), cd.getMonth()+1, 1);
    window.calendarStore.setCurrentDate(nd);
    calendarState = null; await generateCalendar(nd);
  });
}
// Help modal elements (user guide)
const keyboardHelpBtn = document.getElementById('keyboardHelpBtn');
const helpModal = document.getElementById('helpModal');
const helpBody = document.getElementById('helpBody');
const closeHelpBtn = document.getElementById('closeHelpBtn');
let lastKbHelpDismiss = parseInt(localStorage.getItem('calendar-kbhelp-dismiss')||'0',10);
const KB_HELP_AUTO_DELAY = 1000 * 60 * 60 * 24 * 14; // 14 zile

function renderHelpContent(){
  if(!helpBody) return;
  const lang = window.currentLang || 'ro';
  const TR = window.translations[lang] || window.translations['ro'];
  const H = TR.help || {};
  const S = (H.sections)||{};
  const titleEl = document.getElementById('helpTitle'); if(titleEl) titleEl.textContent = (H.title || 'Help');
  const toc = H.toc || {};
  helpBody.innerHTML = `
    <nav class="help-toc" aria-label="${H.title||'Help'}">
      ${['intro','quickStart','actionBar','dayModes','multiselect','profile','team','exports','settings','shortcuts','faq'].map(key=> toc[key]? `<a href="#help-${key}"><span class="material-icons">bookmark</span>${toc[key]}</a>`:'').join('')}
    </nav>
    ${S.intro? `<div class="help-section" id="help-intro"><div class="help-media"><span class="material-icons">lightbulb</span></div><div class="help-text"><h4>${S.intro.title}</h4><p>${S.intro.desc||''}</p></div></div>`:''}
    ${S.quickstart? `<div class="help-section" id="help-quickStart"><div class="help-media"><span class="material-icons">rocket_launch</span></div><div class="help-text"><h4>${S.quickstart.title}</h4>${Array.isArray(S.quickstart.steps)? `<ol class="help-list">${S.quickstart.steps.map(st=>`<li>${st}</li>`).join('')}</ol>`:''}</div></div>`:''}
    <div class="help-section">
      <div class="help-media"><span class="material-icons">calendar_month</span></div>
      <div class="help-text">
        <h4 id="help-calendar">${(S.calendar&&S.calendar.title) || 'Calendar'}</h4>
        <p>${(S.calendar&&S.calendar.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">touch_app</span></div>
      <div class="help-text">
        <h4 id="help-dayModes">${(S.selection&&S.selection.title) || ''}</h4>
        <p>${(S.selection&&S.selection.desc) || ''}</p>
        ${S.selection&&Array.isArray(S.selection.bullets)? `<ul class="help-list">${S.selection.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
      </div>
    </div>
    ${S.daymodes? `<div class="help-section"><div class="help-media"><span class="material-icons">toggle_on</span></div><div class="help-text"><h4>${S.daymodes.title}</h4><div class="help-grid">${(S.daymodes.items||[]).map(it=>`<div class="help-card"><span class="material-icons">check_circle</span><div><div style="font-weight:600;">${it.title}</div><div>${it.desc}</div></div></div>`).join('')}</div></div></div>`:''}
    ${S.actionbar? `<div class="help-section" id="help-actionBar"><div class="help-media"><span class="material-icons">view_week</span></div><div class="help-text"><h4>${S.actionbar.title}</h4><div class="help-grid">${(S.actionbar.items||[]).map(it=>`<div class="help-card"><span class="material-icons">${it.icon||'info'}</span><div><div style="font-weight:600;">${it.title}</div><div>${it.desc||''}</div></div></div>`).join('')}</div></div></div>`:''}
    <div class="help-section">
      <div class="help-media"><span class="material-icons">select_all</span></div>
      <div class="help-text">
        <h4 id="help-multiselect">${(S.multiselect&&S.multiselect.title) || ''}</h4>
        <p>${(S.multiselect&&S.multiselect.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">insights</span></div>
      <div class="help-text">
        <h4 id="help-profile">${(S.profile&&S.profile.title) || ''}</h4>
        <p>${(S.profile&&S.profile.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">group</span></div>
      <div class="help-text">
        <h4 id="help-team">${(S.team&&S.team.title) || ''}</h4>
        <p>${(S.team&&S.team.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">get_app</span></div>
      <div class="help-text">
        <h4 id="help-exports">${(S.exports&&S.exports.title) || ''}</h4>
        <p>${(S.exports&&S.exports.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">settings</span></div>
      <div class="help-text">
        <h4 id="help-settings">${(S.settings&&S.settings.title) || (TR.settings||'Settings')}</h4>
        <p>${(S.settings&&S.settings.desc) || ''}</p>
      </div>
    </div>
    <div class="help-section">
      <div class="help-media"><span class="material-icons">keyboard</span></div>
      <div class="help-text">
        <h4 id="help-shortcuts">${(S.shortcuts&&S.shortcuts.title) || ''}</h4>
        ${S.shortcuts&&Array.isArray(S.shortcuts.bullets)? `<ul class="help-list">${S.shortcuts.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
      </div>
    </div>
    ${S.faq? `<div class="help-section" id="help-faq"><div class="help-media"><span class="material-icons">quiz</span></div><div class="help-text"><h4>${S.faq.title}</h4>${Array.isArray(S.faq.qas)? S.faq.qas.map(qa=>`<div class="help-card"><span class="material-icons">help_outline</span><div><div style="font-weight:600;">${qa.q}</div><div>${qa.a}</div></div></div>`).join(''): ''}</div></div>`:''}
  `;
}

function openHelp(){ if(helpModal){ renderHelpContent(); helpModal.classList.remove('hidden'); } }
function closeHelp(){ if(helpModal){ helpModal.classList.add('hidden'); localStorage.setItem('calendar-kbhelp-dismiss', Date.now().toString()); } }
if(keyboardHelpBtn){ keyboardHelpBtn.addEventListener('click', openHelp); }
if(closeHelpBtn){ closeHelpBtn.addEventListener('click', closeHelp); }
if(helpModal){ helpModal.addEventListener('mousedown', (e)=>{ if(e.target===helpModal) closeHelp(); }); }
// Expose openHelp for footer
window.openHelp = openHelp;

// Footer renderer (fallback if setLang runs before DOMContentLoaded)
function renderFooter(){
  const footer = document.getElementById('pageFooter'); if(!footer) return;
  const L = translations[currentLang] || translations['ro'];
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="footer-wrap">
      <div class="brand">
        <span class="logo" aria-hidden="true"></span>
        <span class="name">${L.footerBrand || 'Hybrid Office Planner'}</span>
      </div>
      <div class="links" role="navigation" aria-label="Footer actions">
        <button id="ftHelpBtn" class="icon-btn" title="${(L.help&&L.help.title)||L.footerLinks?.help||'Help'}"><span class="material-icons">help_outline</span></button>
        <button id="ftCsvBtn" class="icon-btn" title="${L.footerLinks?.csv || L.exportCsv}"><span class="material-icons">table_view</span></button>
        <button id="ftIcsBtn" class="icon-btn" title="${L.footerLinks?.ics || (L.exportOooIcs||L.exportIcs)}"><span class="material-icons">event</span></button>
        <button id="ftSettingsBtn" class="icon-btn" title="${L.footerLinks?.settings || L.settings}"><span class="material-icons">settings</span></button>
      </div>
    </div>
    <div class="footer-wrap" style="grid-template-columns:1fr; gap:6px;">
      <div class="meta">${L.footerMeta || ''}</div>
      <div class="meta meta-copy">© ${year} Zlatan Milosevic</div>
    </div>`;
  const hb=document.getElementById('ftHelpBtn'); if(hb){ hb.onclick = ()=> openHelp(); }
  const cb=document.getElementById('ftCsvBtn'); if(cb){ cb.onclick = ()=>{ const b=document.getElementById('exportCsvBtn'); if(b) b.click(); }; }
  const ib=document.getElementById('ftIcsBtn'); if(ib){ ib.onclick = ()=>{ const b=document.getElementById('exportIcsBtn'); if(b) b.click(); }; }
  const sb=document.getElementById('ftSettingsBtn'); if(sb){ sb.onclick = ()=>{ const b=document.getElementById('settingsBtn'); if(b) b.click(); }; }
}

// === VARIABILE GLOBALE (MIGRARE spre calendarStore) ===
function getUser(){ return (window.calendarStore && window.calendarStore.getState().user) || null; }
function getCurrentDate(){ return (window.calendarStore && window.calendarStore.getState().currentDate) || new Date(); }
let maxHomeDays = 12; // poate fi personalizat și salvat local
let maxSeats = parseInt(localStorage.getItem('calendar-max-seats')||'35',10);
const requiredOfficeBase = 12; // regulă business
// weekView functionality removed per request
let autoSave = (localStorage.getItem('calendar-autosave')||'1')==='1';
let dateFormat = localStorage.getItem('calendar-date-format') || 'yyyy-mm-dd';
let selectionMode = localStorage.getItem('calendar-selection-mode') || 'dropdown';
// Advanced configurable settings (persisted in localStorage)
let showOfficeReq = (localStorage.getItem('calendar-show-office-req')||'1')==='1';
let adaptiveDebounce = (localStorage.getItem('calendar-adaptive-debounce')||'1')==='1';
let baseDebounce = parseInt(localStorage.getItem('calendar-base-debounce')||'400',10);
let minDebounce = parseInt(localStorage.getItem('calendar-min-debounce')||'250',10);
let maxDebounce = parseInt(localStorage.getItem('calendar-max-debounce')||'1400',10);
// Diff/render snapshot & custom holidays (may be reset on view/lang changes)
let calendarState = null;
let customHolidays = {};
// Team-view: currently selected user in legend (for highlight)
let selectedLegendUser = null;
if(isNaN(baseDebounce)) baseDebounce = 400;
if(isNaN(minDebounce)) minDebounce = 250;
if(isNaN(maxDebounce)) maxDebounce = 1400;
// Relationship clamping
if(minDebounce < 50) minDebounce = 50;
if(maxDebounce <= minDebounce) maxDebounce = minDebounce + 50;
if(baseDebounce < minDebounce) baseDebounce = minDebounce;
if(baseDebounce > maxDebounce) baseDebounce = maxDebounce;
// Mass edit state (reintroduced after refactor rollback)
let explicitMassMode = false; // toggled via button / keyboard
let massEditActive = false;   // drag in progress
let mouseDown = false;
let selectedMass = [];
let lastEntered = -1;
let docMouseUpHandler = null;
function clearMassSelection(){
  selectedMass.forEach(idx=>{
    const cell=document.querySelector(`#calendarGrid .day[data-idx='${idx}']`);
    if(cell) cell.classList.remove('selected-mass');
  });
  selectedMass = [];
  const popup=document.getElementById('massEditPopup'); if(popup) popup.remove();
}
let saveDebounceMs = baseDebounce;
let saveTimer = null;
let lastSaveStarted = 0;
let recentSaves = []; // timestamps for adaptive debounce
const autosaveStatusEl = document.getElementById('autosaveStatus');
const manualSaveBtn = document.getElementById('manualSaveBtn');
const retrySaveBtn = document.getElementById('retrySaveBtn');
const storedMaxHomeLS = parseInt(localStorage.getItem('calendar-max-home')||'');
if(!isNaN(storedMaxHomeLS)) maxHomeDays = storedMaxHomeLS;
if(isNaN(maxSeats) || maxSeats < 1) maxSeats = 35;
// Months now provided through translations (monthsShort / monthsFull) to enable i18n
const months = null; // legacy placeholder (avoid accidental use)

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

// Aplica stil vizual pentru o selecție (centralizăm logica pentru consecvență)
function applyVisualState(cell, value){
  if(!cell) return;
  // Clean legacy classes
  cell.classList.remove('worked-office','free','remote-work');
  if(value){ cell.setAttribute('data-state', value); }
  else { cell.removeAttribute('data-state'); }
  // Remove previous textual badge
  const oldBadge = cell.querySelector('.state-badge'); if(oldBadge) oldBadge.remove();
  if(selectionMode==='cycle' && value){
    const badge = document.createElement('span');
    badge.className = `state-badge state-${value}`;
    badge.textContent = t(value, value);
    cell.appendChild(badge);
  }
}
function formatDateForExport(y,m,d){
  const map = { yyyy: y.toString(), mm: pad(m), dd: pad(d)};
  if(dateFormat==='dd.mm.yyyy') return `${map.dd}.${map.mm}.${map.yyyy}`;
  if(dateFormat==='mm/dd/yyyy') return `${map.mm}/${map.dd}/${map.yyyy}`;
  return `${map.yyyy}-${map.mm}-${map.dd}`;
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
// Publish holidays for other modules (e.g., stats.js)
window.holidaysRO = holidaysRO;
// Sărbători personalizate doar pentru utilizatorul curent
function getCustomHolidays() {
  try {
    const u = getUser() || user || 'anon';
    return JSON.parse(sessionStorage.getItem("customHolidays_" + u) || "{}");
  } catch { return {}; }
}
// === CUSTOM HOLIDAYS RENDER & CRUD (restored) ===
function renderCustomHolidays(){
  if(!customHolidaysList) return;
  customHolidaysList.innerHTML = '';
  const entries = Object.entries(customHolidays||{}).sort((a,b)=> a[0].localeCompare(b[0]));
  if(!entries.length){
    const empty = document.createElement('div'); empty.className='u-muted'; empty.style.fontSize='12px'; empty.textContent = '—'; customHolidaysList.appendChild(empty); return;
  }
  entries.forEach(([date, name])=>{
    const row=document.createElement('div'); row.className='custom-holiday-row'; row.style.display='flex'; row.style.alignItems='center'; row.style.justifyContent='space-between'; row.style.gap='6px'; row.style.margin='2px 0';
    const label=document.createElement('span'); label.textContent = `${date} · ${name}`; label.style.fontSize='12px'; label.style.flex='1';
    const del=document.createElement('button'); del.className='icon-btn small'; del.type='button'; del.innerHTML='<span class="material-icons" style="font-size:16px;">delete</span>'; del.title='Șterge';
    del.onclick = ()=>{
      const map = getCustomHolidays(); delete map[date];
      const u = getUser() || user || 'anon'; sessionStorage.setItem('customHolidays_'+u, JSON.stringify(map));
      customHolidays = map; renderCustomHolidays();
      // Re-gen calendar to apply changes visually
      generateCalendar(getCurrentDate());
    };
    row.appendChild(label); row.appendChild(del); customHolidaysList.appendChild(row);
  });
}
if(clearHolidaysBtn){
  clearHolidaysBtn.addEventListener('click', ()=>{
    const u = getUser() || user || 'anon';
    if(!confirm(t('confirmReset')||'Ștergi toate selecțiile pentru această lună?')) return;
    sessionStorage.setItem('customHolidays_'+u, JSON.stringify({}));
    customHolidays = {};
    renderCustomHolidays();
    generateCalendar(getCurrentDate());
  });
}
// Collapsible sections (with optional persistence key)
function toggleSection(btn, card, storageKey){
  if(!btn || !card) return;
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', (!expanded).toString());
  const icon = btn.querySelector('.material-icons'); if(icon) icon.textContent = expanded? 'expand_more':'expand_less';
  card.classList.toggle('collapsed', expanded);
  // Persist state if key provided (1 = collapsed, 0 = expanded)
  if(storageKey){ try { localStorage.setItem(storageKey, expanded? '1':'0'); } catch(e){} }
  if(!expanded){ // expanding: ensure max-height large for animation
    card.style.maxHeight = card.scrollHeight + 'px';
    setTimeout(()=>{ card.style.maxHeight = ''; }, 250);
  } else {
    card.style.maxHeight = card.scrollHeight + 'px';
    requestAnimationFrame(()=>{ card.style.maxHeight = '0px'; });
    setTimeout(()=>{ card.style.maxHeight = ''; }, 260);
  }
}
// Initialize section collapsed states from localStorage
function initSectionState(btn, card, storageKey){
  if(!btn || !card) return;
  const collapsed = localStorage.getItem(storageKey) === '1';
  if(collapsed){
    btn.setAttribute('aria-expanded','false');
    const ic = btn.querySelector('.material-icons'); if(ic) ic.textContent = 'expand_more';
    card.classList.add('collapsed');
  }
}
if(toggleCustomHolidaysSec && customHolidaysCard){
  initSectionState(toggleCustomHolidaysSec, customHolidaysCard, 'calendar-sec-customHolidays-collapsed');
  toggleCustomHolidaysSec.addEventListener('click', ()=> toggleSection(toggleCustomHolidaysSec, customHolidaysCard, 'calendar-sec-customHolidays-collapsed'));
}
if(toggleFilterSec && filterCard){
  initSectionState(toggleFilterSec, filterCard, 'calendar-sec-filter-collapsed');
  toggleFilterSec.addEventListener('click', ()=> toggleSection(toggleFilterSec, filterCard, 'calendar-sec-filter-collapsed'));
}
if(addHolidayBtn){
  addHolidayBtn.addEventListener('click', ()=>{
    if(!holidayDate || !holidayName) return;
    const d = holidayDate.value.trim(); const n = holidayName.value.trim();
    if(!d || !n) return;
    const map = getCustomHolidays(); map[d]=n; const u=getUser()||user||'anon'; sessionStorage.setItem('customHolidays_'+u, JSON.stringify(map));
    customHolidays = map; holidayDate.value=''; holidayName.value=''; renderCustomHolidays(); generateCalendar(getCurrentDate());
  });
}
function renderUserProfile(selections){
  const user = getUser(); if(!user) return;
  const stats = {office:0, home:0, vacation:0};
  if(Array.isArray(selections)) selections.forEach(v=>{ if(stats[v]!==undefined) stats[v]++; });
  const cd = getCurrentDate(); const year = cd.getFullYear(); const month = cd.getMonth();
  const daysInMonth = new Date(year, month+1,0).getDate();
    // Working weekdays (Mon-Fri) regardless of holidays
    let workingWeekdays = 0; for(let d=1; d<=daysInMonth; d++){ const dt=new Date(year,month,d); if(!isWeekend(dt)) workingWeekdays++; }
    // Working days excluding holidays (used for coverage & pace)
    const workingDays = []; for(let d=1; d<=daysInMonth; d++){ const ds=dateStr(year,month+1,d); const dateObj=new Date(year,month,d); if(!isWeekend(dateObj) && !holidaysRO[ds] && !customHolidays[ds]) workingDays.push(d); }
    let legalHolidaysWorkdays=0; for(let d=1; d<=daysInMonth; d++){ const ds=dateStr(year,month+1,d); const dateObj=new Date(year,month,d); if(!isWeekend(dateObj) && holidaysRO[ds]) legalHolidaysWorkdays++; }
  // Base (before deductions) = working weekdays - legal holiday workdays
  const requiredOfficeBase = Math.max(0, workingWeekdays - legalHolidaysWorkdays);
  // Dynamic office requirement: (working weekdays) - maxHomeDays - vacation - legal holidays
  const dynamicOfficeTarget = Math.max(0, workingWeekdays - maxHomeDays - stats.vacation - legalHolidaysWorkdays);
  const dynamicOfficeRemaining = Math.max(0, dynamicOfficeTarget - stats.office);
  const zileRamaseHome = Math.max(0, maxHomeDays - stats.home);
  const total = stats.office + stats.home + stats.vacation;
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const officePct = dynamicOfficeTarget ? Math.min(100, Math.round((stats.office / dynamicOfficeTarget)*100)) : 100;
  // Pace (Ritm): count only OFFICE on past working days (Mon-Fri, excluding holidays), up to today
  const today = new Date();
  const workingDaysPast = workingDays.filter(d=> new Date(year,month,d) <= today).length;
  const officePastWD = workingDays.filter(d=>{
    const dt = new Date(year, month, d);
    if(dt > today) return false;
    const val = selections && selections[d-1];
    return val === 'office';
  }).length;
  const paceOfficePerWD = workingDaysPast ? (officePastWD / workingDaysPast) : 0;
  let forecastCompletionDay = null;
  if(paceOfficePerWD>0 && stats.office < dynamicOfficeTarget){
    const remaining = dynamicOfficeTarget - stats.office;
    const estWDNeeded = remaining / Math.max(paceOfficePerWD, 0.0001);
    let acc=0;
    for(const d of workingDays){
      const dateObj=new Date(year,month,d);
      if(dateObj < today) continue; // skip past
      acc += 1; // assume pace ~1 per WD for projection (simplified)
      if(acc>=estWDNeeded){ forecastCompletionDay = d; break; }
    }
  }
  const forecastLabel = forecastCompletionDay? `${t('forecastCompletion')}: ${forecastCompletionDay}` : (dynamicOfficeRemaining===0? t('goalMet') : (paceOfficePerWD===0? t('noPaceData') : ''));
  // Sparkline bars (working days only)
  const sparkBars = workingDays.map(d=>{
    const val = selections && selections[d-1];
    let cls='pp-sp-bar--none'; if(val==='office') cls='pp-sp-bar--office'; else if(val==='home') cls='pp-sp-bar--home'; else if(val==='vacation') cls='pp-sp-bar--vac';
    return `<span class="pp-sp-bar ${cls}" title="${t('day')} ${d}: ${val? t(val): t('none')}"></span>`;
  }).join('');
  // Distribution percentages
  const pctOffice = total? Math.round((stats.office/total)*100):0;
  const pctHome = total? Math.round((stats.home/total)*100):0;
  const pctVac = total? Math.round((stats.vacation/total)*100):0;
  const coveragePct = workingDays.length? Math.round(((stats.office+stats.home)/workingDays.length)*100):0;
  const coverLabel = `${coveragePct}% ${t('coverage')}`;
  // Gauge math
  const ringSegments = Math.max(1, dynamicOfficeTarget || 1);
  const filledSegments = Math.min(ringSegments, stats.office);
  const rgRadius=52; const rgCirc=2*Math.PI*rgRadius; const officeProgressRatio = dynamicOfficeTarget? (stats.office/dynamicOfficeTarget):1; const rgDashOffset=(1-Math.min(1,officeProgressRatio))*rgCirc;
  const gaugeTicks = Array.from({length: ringSegments}).map((_,i)=>{ const angle=(i/ringSegments)*2*Math.PI - Math.PI/2; const rOuter=rgRadius+6; const rInner=rgRadius-4; const x1=60+Math.cos(angle)*rInner; const y1=60+Math.sin(angle)*rInner; const x2=60+Math.cos(angle)*rOuter; const y2=60+Math.sin(angle)*rOuter; return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="rg-tick ${i<filledSegments?'rg-tick--filled':''}" />`; }).join('');
  const homePct = maxHomeDays? Math.min(100, Math.round((stats.home/maxHomeDays)*100)) : 0; const warnHome = stats.home>maxHomeDays;
  let thresholdClass='threshold-neutral'; if(homePct>=100) thresholdClass='threshold-full'; else if(homePct>=90) thresholdClass='threshold-high'; else if(homePct>=60) thresholdClass='threshold-mid'; if(warnHome) thresholdClass='threshold-exceeded';
  userProfileDiv.className=''; userProfileDiv.classList.add('profile-host','fade-in');
  userProfileDiv.innerHTML = `
  <div class="profile-panel premium" data-view="profile" aria-label="${t('profile')}">
      <div class="pp-header">
        <div class="pp-identity">
          <div class="pp-avatar" aria-hidden="true">${initials}</div>
          <div class="pp-id-block">
            <div class="pp-name">${displayName}</div>
            <div class="pp-sub">${t('monthsFull')[month]} ${year}</div>
            <div class="profile-badges-row" aria-hidden="true">
              <span class="badge-pill badge-pill--office" title="${t('office')}">${stats.office}</span>
              <span class="badge-pill badge-pill--home" title="${t('home')}">${stats.home}</span>
              <span class="badge-pill badge-pill--vac" title="${t('vacation')}">${stats.vacation}</span>
              <span class="badge-pill" title="${t('totalSelected')}">${total}</span>
            </div>
          </div>
        </div>
        <div class="pp-actions"><button id='logoutBtn' class='btn-prim' style="padding:6px 14px;">${translations[currentLang].logout}</button></div>
      </div>
      <div class="pp-mini-indicators" aria-label="${t('coreIndicators')}">
        <div class="mi-item" title="${t('workingDaysInMonthTip')}"><span class="mi-label">${t('workingDaysInMonth')}</span><span class="mi-val">${workingWeekdays}</span></div>
        <div class="mi-item" title="${t('homeDaysRemainingTip')}"><span class="mi-label">${t('homeRemaining')}</span><span class="mi-val">${Math.max(0, maxHomeDays - stats.home)}</span></div>
        <div class="mi-item" title="${t('officeRequiredDynamicTip')}"><span class="mi-label">${t('officeRequiredDynamic')}</span><span class="mi-val">${dynamicOfficeTarget}</span></div>
        <div class="mi-item" title="${t('officeRemainingDynamicTip')}"><span class="mi-label">${t('officeRemaining')}</span><span class="mi-val mi-val--remain">${dynamicOfficeRemaining}</span></div>
      </div>
  </div>
  <br />
  <div class="pp-metrics">
  <div class="pp-metric-card pp-metric-card--office" aria-label="${t('office')} ${stats.office}/${dynamicOfficeTarget}" aria-describedby="officeGoalDesc formulaDesc" title="${t('office')} – ${stats.office} / ${dynamicOfficeTarget} (${officePct}%) · ${t('officeRequiredDynamicTip')}">
          <div class="pp-metric-title">${t('office')}</div>
          <div class="radial-gauge" role="img" aria-label="${t('office')} ${officePct}%">
            <svg viewBox="0 0 120 120" class="rg-svg">
              <defs>
                <linearGradient id="rgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="65%" stop-color="#3b82f6" />
                </linearGradient>
                <linearGradient id="rgGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#818cf8" />
                  <stop offset="65%" stop-color="#6366f1" />
                </linearGradient>
              </defs>
              <circle class="rg-track" cx="60" cy="60" r="52" />
              <circle class="rg-progress" cx="60" cy="60" r="52" stroke-dasharray="${rgCirc}" stroke-dashoffset="${rgDashOffset}" />
              <g class="rg-ticks">${gaugeTicks}</g>
              <g class="rg-center">
                <text x="60" y="56" text-anchor="middle" class="rg-val">${stats.office}</text>
                <text x="60" y="72" text-anchor="middle" class="rg-sub">/${dynamicOfficeTarget}</text>
                <text x="60" y="88" text-anchor="middle" class="rg-pct">${officePct}%</text>
              </g>
            </svg>
          </div>
          <!-- Legend and pace/ETA text removed by request: keep only the gauge -->
        </div>
        <div class="pp-metric-card" aria-label="${t('home')} ${stats.home}/${maxHomeDays}" aria-describedby="homeLimitDesc" title="${t('home')} – ${stats.home} / ${maxHomeDays} (${homePct}%)">
          <div class="pp-metric-title">${t('home')}</div>
          <div class="hbar ${thresholdClass} ${homePct===100 || stats.home>maxHomeDays? 'pulse-once':''}" role="progressbar" aria-valuemin="0" aria-valuemax="${maxHomeDays}" aria-valuenow="${stats.home}" style="height:18px;">
            <div class="hbar__fill" style="width:${Math.min(100,homePct)}%;"></div>
            <div class="hbar__label">${stats.home}/${maxHomeDays}</div>
          </div>
          <div class="pp-metric-note">${zileRamaseHome===0? (warnHome? `<span class='status-badge status-badge--danger'>${t('daysHomeExceeded')}</span>`: `<span class='status-badge status-badge--ok'>${t('limitReached')}</span>`): `${t('remainingLabel')}: ${zileRamaseHome}`}</div>
        </div>
        <div class="pp-metric-card" aria-label="${t('vacation')} ${stats.vacation}" title="${t('vacation')} – ${stats.vacation}">
          <div class="pp-metric-title">${t('vacation')}</div>
          <div class="pp-metric-value">${stats.vacation}</div>
          <div class="pp-metric-note">${t('daysVacation')}<br><span class="impact-text">${stats.vacation? `−${stats.vacation} ${t('impactOffice')}`:''}</span></div>
        </div>
  <!-- Total card removed to avoid duplication with Working Days / coverage -->
      </div>
      <div class="pp-breakdown">
  <details class="pp-advanced" open>
          <summary class="pp-advanced__summary">${t('advancedDetails')}</summary>
          <div class="pp-goal-chips">
            <span class="goal-chip" title="${t('baseLabel')}"><b>${requiredOfficeBase}</b> ${t('baseLabel')}</span>
            <span class="goal-chip" title="${t('legalLabel')}"><b>${legalHolidaysWorkdays}</b> ${t('legalLabel')}</span>
            <span class="goal-chip" title="${t('officeRequiredDynamic')||'Zile Obligatorii Office'}"><b>${dynamicOfficeTarget}</b> ${t('officeRequiredDynamic')||'Zile Obligatorii Office'}</span>
            <span class="goal-chip goal-chip--remain" title="${t('officeRemaining')||'Zile Rămase Office'}"><b>${dynamicOfficeRemaining}</b> ${t('officeRemaining')||'Zile Rămase Office'}</span>
          </div>
          <div class="pp-homebar">
            <div style="margin-top:4px;">
              <div class="dist-bar dist-bar--labeled" aria-label="${t('distribution')}">
                <div class="dist-bar__seg dist-bar__seg--office" style="width:${(stats.office/Math.max(1,total))*100}%" data-pct="${pctOffice}%"></div>
                <div class="dist-bar__seg dist-bar__seg--home" style="width:${(stats.home/Math.max(1,total))*100}%" data-pct="${pctHome}%"></div>
                <div class="dist-bar__seg dist-bar__seg--vac" style="width:${(stats.vacation/Math.max(1,total))*100}%" data-pct="${pctVac}%"></div>
              </div>
              <div class="dist-leg">
                <span><span class="dist-swatch office"></span>${t('office')} ${stats.office} (${pctOffice}%)</span>
                <span><span class="dist-swatch home"></span>${t('home')} ${stats.home} (${pctHome}%)</span>
                <span><span class="dist-swatch vac"></span>${t('vacation')} ${stats.vacation} (${pctVac}%)</span>
              </div>
            </div>
          </div>
          <div class="pp-sparkline" aria-hidden="true">${sparkBars}</div>
          <div class="pp-insights" role="note">
            <div class="pp-insight-item">${t('pace')}: <b>${paceOfficePerWD? paceOfficePerWD.toFixed(2): '—'}</b> / WD</div>
            <div class="pp-insight-item">${t('remainingLabel')}: <b>${dynamicOfficeRemaining}</b></div>
            <div class="pp-insight-item">${forecastLabel}</div>
            <div class="pp-insight-item">${coverLabel}</div>
          </div>
        </details>
  <span id="officeGoalDesc" class="visually-hidden">${t('office')}: ${stats.office} / ${dynamicOfficeTarget}. ${dynamicOfficeRemaining} ${t('remainingLabel')}.</span>
        <span id="homeLimitDesc" class="visually-hidden">${t('home')}: ${stats.home} / ${maxHomeDays}. ${zileRamaseHome} ${t('remainingLabel')}.</span>
  <span id="formulaDesc" class="visually-hidden">${t('office')} ${stats.office} / ${dynamicOfficeTarget} (${officePct}%). ${dynamicOfficeRemaining} ${t('remainingLabel')}.</span>
      </div>
    </div>`;
  // Wire logout button
  try {
    const logoutBtnEl = document.getElementById('logoutBtn');
    if(logoutBtnEl){
      logoutBtnEl.onclick = ()=>{
        try { sessionStorage.removeItem('calendar-current-user'); } catch(_) {}
        if(window.calendarStore && typeof window.calendarStore.setUser === 'function'){
          window.calendarStore.setUser(null);
        }
        window.location.href = 'auth.html';
      };
    }
  } catch(_){ /* noop */ }
}
function showMassEditPopup(x, y) {
  removeMassEditPopup();
  const popup = document.createElement("div");
  popup.id = "massEditPopup";
  popup.className = 'mass-edit-popup';
  popup.style.left = x + "px";
  popup.style.top = y + "px";
  popup.innerHTML = `
    <div class="mass-edit-popup__title">${translations[currentLang].massEdit}</div>
    <button class="mass-edit-btn" data-type="office">${translations[currentLang].office}</button>
    <button class="mass-edit-btn" data-type="home">${translations[currentLang].home}</button>
    <button class="mass-edit-btn" data-type="vacation">${translations[currentLang].vacation}</button>
    <button class="mass-edit-btn mass-edit-btn--clear" data-type="clear">${translations[currentLang].clear}</button>
    <button class="mass-edit-btn mass-edit-btn--cancel" data-type="cancel">${translations[currentLang].cancel}</button>
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
          if (sel && !sel.disabled){
            sel.value = "";
            const cell = sel.closest('.day');
            if(cell) applyVisualState(cell, "");
          }
        });
      } else {
        selectedMass.forEach(idx => {
          const sel = document.querySelector(`#calendarGrid .day[data-idx='${idx}'] select`);
          if (sel && !sel.disabled){
            sel.value = btn.dataset.type;
            const cell = sel.closest('.day');
            if(cell) applyVisualState(cell, sel.value);
          }
        });
      }
      // Reconstruire selecții după mass edit
  const cd = getCurrentDate();
  const year = cd.getFullYear();
  const month = cd.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const selections = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`);
        selections.push(dayCell ? dayCell.value : "");
      }
      schedulePersist(selections, year, month, {forceImmediate: !autoSave});
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
  generateCalendar(getCurrentDate());
};
resetFilterBtn.onclick = () => {
  filter = { type: "", user: "" };
  filterType.value = "";
  filterUser.value = "";
  generateCalendar(getCurrentDate());
};

// === LEGENDĂ ECHIPĂ ===
let teamLegendDiv = document.getElementById("teamLegend");
if (!teamLegendDiv) {
  teamLegendDiv = document.createElement("div");
  teamLegendDiv.id = "teamLegend";
  teamLegendDiv.className = 'team-legend';
  calendarGrid.parentNode.insertBefore(teamLegendDiv, calendarGrid);
}

function renderTeamLegend(users) {
  return users.map(u=>{
    const displayName = getUserDisplayName(u);
    const initials = getUserInitials(u);
    return `<span class="legend-user" role="button" tabindex="0" data-user="${u}" aria-label="${displayName}" style="display:flex;align-items:center;gap:6px;">
      <span class="avatar-initial" style="background:${stringToColor(u)}">${initials}</span>
      <span class="legend-name" style="font-size:15px;font-weight:500;">${displayName}</span>
    </span>`;
  }).join('');
}


// === USER NAME MAP UTILITIES (restored after modularization) ===
let userNameMap = {};
async function loadUserNameMap(){
  if(!window.db){ return; }
  const usersSnap = await db.collection('users').get();
  userNameMap = {};
  usersSnap.forEach(doc=>{
    const data = doc.data();
    userNameMap[doc.id] = (data.name && data.surname) ? `${capitalize(data.name)} ${capitalize(data.surname)}` : doc.id;
  });
  // Populate datalist for quick user filtering
  try {
    const list = document.getElementById('userListOptions');
    if(list){
      list.innerHTML = Object.entries(userNameMap)
        .sort((a,b)=> (a[1]||a[0]).localeCompare(b[1]||b[0]))
        .map(([id,label])=> `<option value="${label}"></option>`)
        .join('');
    }
  } catch {}
}
function capitalize(str){ if(!str) return ''; return str.charAt(0).toUpperCase()+str.slice(1).toLowerCase(); }
function getUserDisplayName(u){ return userNameMap[u] || (u.charAt(0).toUpperCase()+u.slice(1)); }
function getUserInitials(u){ const dn = getUserDisplayName(u); const parts = dn.trim().split(/\s+/); if(parts.length>=2) return (parts[0][0]+parts[1][0]).toUpperCase(); if(parts.length===1) return parts[0][0].toUpperCase(); return dn.charAt(0).toUpperCase(); }
window.getUserDisplayName = getUserDisplayName; // expose for stats.js


// wire export buttons to new module (use store-backed date)
if(typeof exportCsvBtn !== 'undefined' && exportCsvBtn){ exportCsvBtn.onclick = ()=>{ const cd=getCurrentDate(); window.exportCSV(cd); }; }
if(typeof exportIcsBtn !== 'undefined' && exportIcsBtn){ exportIcsBtn.onclick = ()=>{ const cd=getCurrentDate(); window.exportICS(cd, getUser()); }; }

// Integrity test harness (simple)
window.runCalendarIntegrityTest = function(){
  const before = calendarState; if(!before){ console.warn('No calendar state yet.'); return false; }
  const clone = JSON.parse(JSON.stringify(before));
  // simulate language change then revert
  const origLang = currentLang;
  setLang(origLang==='ro'? 'en':'ro');
  setLang(origLang); // revert
  const after = calendarState; // may have been rebuilt
  const sameMonth = after && after.year===clone.year && after.month===clone.month;
  console.log('[IntegrityTest] sameMonth:', sameMonth);
  return sameMonth;
};

// === RE-INTRODUCED CORE RENDER (async) ===
async function generateCalendar(date){
  showLoading();
  try {
    const year = date.getFullYear();
    const month = date.getMonth();
  const allSelections = await window.dataService.loadAllUsersMonth(year, month);
    // Apply user filter (team view only)
    let filteredSelections = { ...allSelections };
    if(filter.user && teamView.checked){
      filteredSelections = {};
      for(const [u, sel] of Object.entries(allSelections)){
        if((getUserDisplayName(u)||u).toLowerCase().includes(filter.user)){ filteredSelections[u]=sel; }
      }
    }
    // Apply type filter (team view only)
    if(filter.type && teamView.checked){
      for(const u of Object.keys(filteredSelections)){
        filteredSelections[u] = filteredSelections[u].map(v=> v===filter.type? filter.type: '');
      }
    }
    const savedSelections = await window.dataService.loadUserMonth(getUser(), year, month);
    // Build new model via diffEngine
    const model = window.diffEngine.buildModel({
      date,
      savedSelections,
      filteredSelections,
      holidays: holidaysRO,
      customHolidays,
      currentLang,
      selectionMode,
      teamView: teamView.checked,
      filter,
      t,
      isWeekend,
      dateStr,
      getUserDisplayName,
      getUserInitials
    });
    // Attempt patch update
    if(window.diffEngine.canPatch(calendarState, model)){
      const patch = window.diffEngine.diff(calendarState, model);
      if(patch){
  const allUsersCount = Object.keys(filteredSelections||{}).length || 0;
  window.diffEngine.applyPatch(patch, calendarGrid, { applyVisualState, t, model, allUsersCount, getUserDisplayName, getUserInitials, stringToColor, maxSeats });
        calendarState = model; updateSummary(year, month, savedSelections); renderUserProfile(savedSelections); return;
      }
    }
    // Full rebuild
    monthTitle.textContent = `${t('monthsFull')[month]} ${year}`;
    calendarGrid.innerHTML = '';
    calendarGrid.setAttribute('role','grid');
    calendarGrid.setAttribute('aria-colcount','7');
    // Team legend
    if(teamView.checked){
      const users = Object.keys(filteredSelections).sort();
      teamLegendDiv.innerHTML = renderTeamLegend(users);
      teamLegendDiv.style.display='flex';
      setupLegendInteractions();
        // Insert capacity legend helper (intuitive illustration)
        let capLegend = document.getElementById('capacityLegend');
        if(!capLegend){
          capLegend = document.createElement('div');
          capLegend.id = 'capacityLegend';
          capLegend.className = 'capacity-legend';
          teamLegendDiv.insertAdjacentElement('afterend', capLegend);
        }
  const MAX_SEATS = maxSeats;
        capLegend.innerHTML = `
          <div class="cap-legend-title">${t('capacityLegendTitle')}</div>
          <div class="cap-legend-row">
            <div class="cap-legend-swatch low"><span class="cap-legend-fill"></span></div>
            <span class="cap-legend-label">0–39% (${t('capacityLow')})</span>
          </div>
          <div class="cap-legend-row">
            <div class="cap-legend-swatch mid"><span class="cap-legend-fill"></span></div>
            <span class="cap-legend-label">40–74% (${t('capacityMid')})</span>
          </div>
          <div class="cap-legend-row">
            <div class="cap-legend-swatch high"><span class="cap-legend-fill"></span></div>
            <span class="cap-legend-label">≥75% (${t('capacityHigh')})</span>
          </div>
          <div class="cap-legend-note">${t('capacity')}: n/${MAX_SEATS} · bara indică procentul ocupat</div>
          <div class="cap-legend-current" aria-live="polite">
            <div class="cap-legend-current-title">${t('capacitySelected')}:</div>
            <div class="cap-legend-current-bar"><span style="width:0%"></span></div>
            <div class="cap-legend-current-label">—</div>
          </div>
        `;
    } else { teamLegendDiv.style.display='none'; }
    // Weekday headers
    t('weekdaysShort').forEach(dayLabel=>{
      const div=document.createElement('div');
      div.className='calendar-head-cell';
      div.textContent=dayLabel; div.setAttribute('role','columnheader');
      calendarGrid.appendChild(div);
    });
  // Leading blanks (always full month view since week view removed)
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay()+6)%7; // Luni=0
  for(let i=0;i<startDay;i++){ calendarGrid.appendChild(document.createElement('div')); }
    // Render days
    for(const day of model.days){
      const d = day.d; const dateObj = new Date(year, month, d); const isWk = day.weekend; const dateString = dateStr(year, month+1, d);
      if(isWk){
        const cell = document.createElement('div');
        cell.className='day disabled';
        cell.setAttribute('data-idx', (d-1).toString());
        cell.setAttribute('role','gridcell');
        const label=document.createElement('div'); label.textContent=d; label.className='day-label'; cell.appendChild(label);
        if(teamView.checked){ const wk=document.createElement('div'); wk.textContent=t('weekend'); wk.className='weekend-label'; cell.appendChild(wk); }
        calendarGrid.appendChild(cell); continue;
      }
      const cell=document.createElement('div'); cell.className='day'; cell.setAttribute('data-idx',(d-1).toString()); cell.setAttribute('role','gridcell');
      if(isToday(dateObj)) cell.classList.add('today');
      const label=document.createElement('div'); label.textContent=d; label.className='day-label'; cell.appendChild(label);
      if(teamView.checked){
        const usersAtOffice = day.usersAtOffice || [];
        if(usersAtOffice.length>0){
          // Use filtered selections count so badge density reflects current filter
          const totalUsersCount = Object.keys(filteredSelections || allSelections).length || 0;
          const ratio = totalUsersCount? (usersAtOffice.length/totalUsersCount): 0;
          let level = 'level-low'; if(ratio>=0.66) level='level-high'; else if(ratio>=0.34) level='level-mid';
          const badge=document.createElement('span'); badge.className='presence-badge '+level; badge.textContent=usersAtOffice.length; badge.title=`${t('totalAtOffice')}: ${usersAtOffice.length}`; cell.appendChild(badge);
        }
        // Majority class should also respect the filtered set size
        if(usersAtOffice.length > (Object.keys(filteredSelections || allSelections).length/2)) cell.classList.add('office-majority');
        else if(usersAtOffice.length===0) cell.classList.add('office-none');
        else cell.classList.add('office-mixed');
        const teamDiv=document.createElement('div'); teamDiv.className='team-users';
        usersAtOffice.forEach(u=>{
          const displayName=getUserDisplayName(u); const initials=getUserInitials(u);
          const span=document.createElement('span');
          span.className='avatar-initial';
          // Remove native title to avoid duplicate tooltip; keep accessible label
          span.setAttribute('aria-label', displayName);
          span.dataset.user = u;
          span.style.background=stringToColor(u);
          span.textContent=initials;
          span.onmouseenter = e=>{
            const old=document.getElementById('bulinaTip'); if(old) old.remove();
            const tip=document.createElement('div'); tip.id='bulinaTip'; tip.className='avatar-tooltip'; tip.textContent=displayName; tip.style.left=(e.clientX+10)+"px"; tip.style.top=(e.clientY+10)+"px"; document.body.appendChild(tip);
          };
          span.onmouseleave = ()=>{ const tip=document.getElementById('bulinaTip'); if(tip) tip.remove(); };
          teamDiv.appendChild(span);
        });
        cell.appendChild(teamDiv);
    // Capacity meter (max seats from settings)
  const MAX_SEATS = maxSeats;
        const used = usersAtOffice.length;
        const cap = document.createElement('div');
        cap.className = 'capacity-meter';
        const pct = Math.min(100, Math.round((used / MAX_SEATS) * 100));
        // threshold class
        let capLevel = 'low'; if(pct >= 75) capLevel = 'high'; else if(pct >= 40) capLevel = 'mid';
        cap.setAttribute('data-level', capLevel);
        cap.setAttribute('role','img');
        cap.setAttribute('aria-label', `${t('capacity')}: ${used}/${MAX_SEATS} (${pct}%)`);
        cap.title = `${t('capacity')}: ${used}/${MAX_SEATS} (${pct}%)`;
  const bar = document.createElement('div'); bar.className = 'capacity-bar'; bar.style.width = pct + '%';
  cap.appendChild(bar);
        cell.appendChild(cap);
  // Reserve space so avatars don't overlap the meter
  cell.classList.add('has-capacity');
        cell.dataset.userCount = used.toString();
        cell.style.cursor='pointer';
        const updateCapLegendFor = (usedVal)=>{
          const MAX_SEATS = maxSeats;
          const pct = Math.min(100, Math.round((usedVal / MAX_SEATS) * 100));
          const wrap = document.getElementById('capacityLegend');
          if(!wrap) return;
          const bar = wrap.querySelector('.cap-legend-current-bar span');
          const lbl = wrap.querySelector('.cap-legend-current-label');
          if(bar) bar.style.width = pct + '%';
          if(lbl) lbl.textContent = `${usedVal}/${MAX_SEATS} (${pct}%)`;
          // Colorize bar according to thresholds
          if(bar){
            let bg = 'linear-gradient(90deg,#22c55e,#16a34a)';
            if(pct >= 75) bg = 'linear-gradient(90deg,#ef4444,#b91c1c)';
            else if(pct >= 40) bg = 'linear-gradient(90deg,#f59e0b,#f97316)';
            bar.style.background = bg;
          }
        };
        // Initialize current legend with this day when rendering
        updateCapLegendFor(used);
        cell.onclick = e=>{
          const old=document.getElementById('dayUsersPopup'); if(old) old.remove();
          const popup=document.createElement('div'); popup.id='dayUsersPopup'; popup.className='popup-day-users'; popup.style.left=(e.clientX+10)+"px"; popup.style.top=(e.clientY+10)+"px";
          popup.innerHTML=`<div class='popup-day-users__header'><b>${t('day')} ${d}</b><button id='closeDayUsersPopup' class='popup-close-btn' aria-label='Close'>&times;</button></div>`;
          if(usersAtOffice.length===0){
            const empty = document.createElement('div');
            empty.style.color = '#888';
            empty.textContent = t('noColleagues');
            popup.appendChild(empty);
          } else {
            const list = document.createElement('ul');
            usersAtOffice.forEach(u=>{
              const li = document.createElement('li');
              // Use textContent to avoid any HTML injection from display names
              li.textContent = getUserDisplayName(u);
              list.appendChild(li);
            });
            popup.appendChild(list);
          }
          document.body.appendChild(popup);
          document.getElementById('closeDayUsersPopup').onclick=()=>popup.remove();
          setTimeout(()=>{ document.addEventListener('mousedown', function handler(ev){ if(!popup.contains(ev.target)){ popup.remove(); document.removeEventListener('mousedown', handler);} });},10);
          // Update legend dynamic display on click
          updateCapLegendFor(usersAtOffice.length);
        };
      } else {
        // Personal view select or cycle
        const select=document.createElement('select');
        if(selectionMode==='cycle') select.className='hidden-select'; else select.className='day-select';
        const optionMap={ "":"", office:t('office'), home:t('home'), vacation:t('vacation') };
        ["","office","home","vacation"].forEach(opt=>{ const o=document.createElement('option'); o.value=opt; o.textContent=optionMap[opt]; select.appendChild(o); });
        const holidayName = day.holiday ? day.holidayName : null;
        if(holidayName){
          cell.title = holidayName; select.disabled=true; select.value='office'; applyVisualState(cell,'office'); cell.setAttribute('data-tooltip', holidayName);
        }
        if(day.value && !select.disabled){ select.value = day.value; }
        applyVisualState(cell, select.value);
        let ariaLabel = `${d} ${t('monthsFull')[month]} ${year}`;
        if(holidayName) ariaLabel += ` – ${holidayName}`;
        if(select.value) ariaLabel += ` – ${t(select.value)}`;
        if(isToday(dateObj)) ariaLabel += ` – ${t('today')}`;
        if(isWeekend(dateObj)) ariaLabel += ` – ${t('weekend')}`;
        cell.setAttribute('aria-label', ariaLabel);
        cell.setAttribute('aria-selected', select.value? 'true':'false');
        if(selectionMode==='cycle' && !select.disabled){
          cell.addEventListener('click', (e)=>{
            if(massEditActive || mouseDown) return;
            const order=["","office","home","vacation"]; const idx=order.indexOf(select.value); const next=order[(idx+1)%order.length]; select.value=next; applyVisualState(cell,next);
            const dim=model.daysInMonth; const selections=[]; for(let i=1;i<=dim;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:""); }
            schedulePersist(selections, year, month);
          });
        } else if(!select.disabled){
          select.addEventListener('change', ()=>{
            applyVisualState(cell, select.value);
            const dim=model.daysInMonth; const selections=[]; for(let i=1;i<=dim;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:""); }
            schedulePersist(selections, year, month);
          });
        }
        if(!select.disabled){
          cell.addEventListener('mousedown', e=>{
            if(!explicitMassMode) return;
            if(e.button!==0) return;
            if(e.target && e.target.closest('select')) return; // avoid starting on dropdown
            if(!cell.contains(e.target)) return;
            mouseDown=true; massEditActive=true; clearMassSelection();
            cell.classList.add('selected-mass'); selectedMass.push(d-1); lastEntered=d-1; e.preventDefault();
            // Fallback: show popup on mouseup anywhere
            if(!docMouseUpHandler){
              docMouseUpHandler = (ev)=>{
                if(explicitMassMode && massEditActive && selectedMass.length>0){
                  const anchor = document.querySelector(`#calendarGrid .day[data-idx='${lastEntered}']`) || cell;
                  const rect = anchor.getBoundingClientRect();
                  showMassEditPopup(rect.right+10, rect.top);
                }
                mouseDown=false; massEditActive=false;
                document.removeEventListener('mouseup', docMouseUpHandler); docMouseUpHandler=null;
              };
              document.addEventListener('mouseup', docMouseUpHandler);
            }
          });
          cell.addEventListener('mouseenter', e=>{
            if(explicitMassMode && mouseDown && massEditActive){
              if(!selectedMass.includes(d-1)){ cell.classList.add('selected-mass'); selectedMass.push(d-1); lastEntered=d-1; }
            }
          });
          cell.addEventListener('mouseup', e=>{
            if(explicitMassMode && massEditActive && selectedMass.length>0){
              const rect=cell.getBoundingClientRect(); showMassEditPopup(rect.right+10, rect.top);
            }
            mouseDown=false; massEditActive=false;
          });
        }
        cell.appendChild(select);
      }
      calendarGrid.appendChild(cell);
    }
    // Clear mass selection on outside click
    document.addEventListener('mousedown', function massEditDocHandler(e){ if(!e.target.closest('#calendarGrid .day') && !e.target.closest('#massEditPopup')){ clearMassSelection(); document.removeEventListener('mousedown', massEditDocHandler); } });
    // Normalize visuals
    document.querySelectorAll('#calendarGrid .day select').forEach(sel=>{ const cell=sel.closest('.day'); applyVisualState(cell, sel.value); });
    updateSummary(year, month, savedSelections);
    renderUserProfile(savedSelections);
    calendarState = model; // snapshot
    const hintEl=document.getElementById('selectionModeHint');
    if(hintEl){ const text= selectionMode==='cycle'? t('modeHintCycle'): t('modeHintDropdown'); hintEl.innerHTML = `<span class="badge">${selectionMode==='cycle'?'C':'D'}</span> ${text}`; hintEl.classList.toggle('no-cycle', selectionMode==='dropdown'); }
    // Office requirement line
    const reqInfoId='officeReqInfo'; let reqInfo=document.getElementById(reqInfoId);
    if(!reqInfo){ reqInfo=document.createElement('div'); reqInfo.id=reqInfoId; reqInfo.style.cssText='font-size:11px;font-weight:500;margin:2px 6px 6px 6px;color:#64748b;'; const ref=document.getElementById('selectionModeHint'); if(ref && ref.parentNode) ref.parentNode.insertBefore(reqInfo, ref.nextSibling); }
    if(showOfficeReq){
      let legalHolidaysWorkdays=0; const dim=new Date(year,month+1,0).getDate(); for(let d=1; d<=dim; d++){ const ds=dateStr(year, month+1, d); const dateObj=new Date(year,month,d); if(!isWeekend(dateObj) && holidaysRO[ds]) legalHolidaysWorkdays++; }
      let myVac = savedSelections.filter(v=>v==='vacation').length;
      const adjusted = Math.max(0, requiredOfficeBase - (myVac + legalHolidaysWorkdays));
      reqInfo.style.display='block'; reqInfo.textContent = `${t('adjustedOfficeRequirement')}: ${adjusted} (${t('baseLabel')} ${requiredOfficeBase} - vacation ${myVac} - legal ${legalHolidaysWorkdays})`;
    } else { reqInfo.style.display='none'; }
    calendarGrid.classList.toggle('mode-cycle', selectionMode==='cycle');
    calendarGrid.classList.toggle('mode-dropdown', selectionMode==='dropdown');
  } finally { hideLoading(); }
}

// === TEAM VIEW: Legend click-to-highlight across calendar ===
function setupLegendInteractions(){
  if(!teamView.checked) return;
  const legend = document.getElementById('teamLegend'); if(!legend) return;
  legend.querySelectorAll('.legend-user').forEach(el=>{
    const userId = el.getAttribute('data-user');
    const activate = ()=>{
      selectedLegendUser = (selectedLegendUser === userId) ? null : userId;
      legend.querySelectorAll('.legend-user').forEach(n=> n.classList.toggle('active', n.getAttribute('data-user')===selectedLegendUser));
      applyTeamHighlight();
    };
    el.onclick = activate;
    el.onkeydown = (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); activate(); } };
  });
}
function applyTeamHighlight(){
  const grid = document.getElementById('calendarGrid'); if(!grid) return;
  if(!selectedLegendUser){
    grid.classList.remove('team-highlight');
    grid.querySelectorAll('.day').forEach(d=>{ d.classList.remove('team-match','team-miss'); });
    return;
  }
  grid.classList.add('team-highlight');
  const esc = (window.CSS && CSS.escape) ? CSS.escape : (s=> String(s).replace(/['"\\]/g,'\\$&'));
  grid.querySelectorAll('.day').forEach(cell=>{
    if(cell.classList.contains('disabled')){ cell.classList.remove('team-match','team-miss'); return; }
    const has = !!cell.querySelector(`.team-users .avatar-initial[data-user='${esc(selectedLegendUser)}']`);
    cell.classList.toggle('team-match', has);
    cell.classList.toggle('team-miss', !has);
  });
}

// === DARK MODE ===
toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  if(isDark){
    document.documentElement.setAttribute('data-theme','dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem("calendar-dark-mode", isDark? 'true':'false');
});
// Init dark mode din localStorage
if(localStorage.getItem('calendar-dark-mode')==='true'){
  document.body.classList.add('dark-mode');
  document.documentElement.setAttribute('data-theme','dark');
}

// === RESETARE LUNĂ ===
resetBtn.onclick = () => {
  if (confirm(translations[currentLang].confirmReset)) {
    const cd = getCurrentDate();
    window.dataService.enqueueSave(getUser(), cd.getFullYear(), cd.getMonth(), []);
    generateCalendar(cd);
  }
};

// === TOATE OFFICE/HOME ===
bulkOfficeBtn.onclick = () => {
  const cd = getCurrentDate();
  const year = cd.getFullYear();
  const month = cd.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selections = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = dateStr(year, month + 1, d);
    const weekend = isWeekend(dateObj);
    const holiday = holidaysRO[dateString] || customHolidays[dateString];
    selections.push((!weekend && !holiday) ? "office" : "");
  }
  window.dataService.enqueueSave(getUser(), year, month, selections);
  generateCalendar(cd);
};

bulkHomeBtn.onclick = () => {
  const cd = getCurrentDate();
  const year = cd.getFullYear();
  const month = cd.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selections = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = dateStr(year, month + 1, d);
    const weekend = isWeekend(dateObj);
    const holiday = holidaysRO[dateString] || customHolidays[dateString];
    selections.push((!weekend && !holiday) ? "home" : "");
  }
  window.dataService.enqueueSave(getUser(), year, month, selections);
  generateCalendar(cd);
};

// === STATISTICI LUNARE ===
statsBtn.onclick = () => {
  const cd = getCurrentDate();
  // Lazy load Chart.js dacă nu este prezent
  if(typeof Chart === 'undefined'){
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.onload = ()=> window.buildMonthlyStats(cd, getUser(), requiredOfficeBase, maxHomeDays);
    s.onerror = ()=>{ console.error('Chart.js load failed'); };
    document.head.appendChild(s);
  } else {
    window.buildMonthlyStats(cd, getUser(), requiredOfficeBase, maxHomeDays);
  }
};

// === PROFIL UTILIZATOR ===

// === FUNCȚIE SUMAR (afișat sub profil) ===
function updateSummary(year, month, selections) {
  // Summary bar removed by request: ensure any existing element is removed and skip rendering
  const summaryDiv = document.getElementById("summary");
  if (summaryDiv && summaryDiv.parentNode) summaryDiv.parentNode.removeChild(summaryDiv);
}

// (Eliminat: init duplicat #2, folosit blocul final consolidat mai jos)
function showLoading(){ if(loadingOverlay) loadingOverlay.classList.remove('hidden'); }
function hideLoading(){ if(loadingOverlay) loadingOverlay.classList.add('hidden'); }
// (Eliminat wrapper generateCalendar; acum funcția este async și gestionează loading intern)
// Week view toggle removed
// Wire export buttons to centralized functions in stats.js
if(exportCsvBtn) exportCsvBtn.onclick = ()=>{ if(typeof window.exportCSV==='function'){ window.exportCSV(getCurrentDate()); } };
if(exportIcsBtn) exportIcsBtn.onclick = ()=>{ if(typeof window.exportICS==='function'){ window.exportICS(getCurrentDate(), getUser()||user); } };
// === MASS MODE TOGGLE BUTTON ===
if(massModeToggleBtn){
  massModeToggleBtn.addEventListener('click', ()=>{
    explicitMassMode = !explicitMassMode;
    massModeToggleBtn.classList.toggle('active', explicitMassMode);
    massModeToggleBtn.title = explicitMassMode ? translations[currentLang].multiSelectOn : translations[currentLang].multiSelectOff;
    if(!explicitMassMode){ clearMassSelection(); }
  });
}
function openSettings(){
  if(!settingsModal) return;
  maxHomeDaysInput.value = maxHomeDays;
  if(maxSeatsInput) maxSeatsInput.value = String(maxSeats||'');
  localeDateFormatSelect.value = dateFormat;
  autoSaveToggle.checked = autoSave;
  if(selectionModeSelect) selectionModeSelect.value = selectionMode;
  if(showOfficeReqToggle) showOfficeReqToggle.checked = showOfficeReq;
  if(adaptiveDebounceToggle) adaptiveDebounceToggle.checked = adaptiveDebounce;
  if(baseDebounceInput) baseDebounceInput.value = baseDebounce;
  if(minDebounceInput) minDebounceInput.value = minDebounce;
  if(maxDebounceInput) maxDebounceInput.value = maxDebounce;
  // Remove previous error states
  [baseDebounceInput,minDebounceInput,maxDebounceInput].forEach(inp=>{ if(inp) inp.classList.remove('invalid'); });
  settingsModal.classList.remove('hidden');
}
function closeSettings(){ if(settingsModal) settingsModal.classList.add('hidden'); }
if(settingsBtn) settingsBtn.onclick = openSettings;
if(closeSettingsBtn) closeSettingsBtn.onclick = closeSettings;
if(settingsModal){ settingsModal.addEventListener('mousedown', e=>{ if(e.target===settingsModal) closeSettings(); }); }
if(saveSettingsBtn){
  saveSettingsBtn.onclick = () => {
    maxHomeDays = parseInt(maxHomeDaysInput.value,10) || maxHomeDays;
    if(maxSeatsInput){
      const parsed = parseInt(maxSeatsInput.value,10);
      if(!isNaN(parsed) && parsed>0){ maxSeats = parsed; }
    }
    dateFormat = localeDateFormatSelect.value;
    autoSave = autoSaveToggle.checked;
    if(selectionModeSelect){ selectionMode = selectionModeSelect.value; }
  // New settings
  if(showOfficeReqToggle) showOfficeReq = showOfficeReqToggle.checked;
  if(adaptiveDebounceToggle) adaptiveDebounce = adaptiveDebounceToggle.checked;
  if(baseDebounceInput) baseDebounce = parseInt(baseDebounceInput.value,10)||baseDebounce;
  if(minDebounceInput) minDebounce = parseInt(minDebounceInput.value,10)||minDebounce;
  if(maxDebounceInput) maxDebounce = parseInt(maxDebounceInput.value,10)||maxDebounce;
  // Clamp
  if(minDebounce < 50) minDebounce = 50;
  if(maxDebounce <= minDebounce) maxDebounce = minDebounce + 50;
  if(baseDebounce < minDebounce) baseDebounce = minDebounce;
  if(baseDebounce > maxDebounce) baseDebounce = maxDebounce;
  // Highlight if adjustments done
  if(baseDebounceInput && parseInt(baseDebounceInput.value,10)!==baseDebounce) baseDebounceInput.classList.add('invalid');
  if(minDebounceInput && parseInt(minDebounceInput.value,10)!==minDebounce) minDebounceInput.classList.add('invalid');
  if(maxDebounceInput && parseInt(maxDebounceInput.value,10)!==maxDebounce) maxDebounceInput.classList.add('invalid');
  saveDebounceMs = baseDebounce;
    localStorage.setItem('calendar-max-home', maxHomeDays.toString());
  localStorage.setItem('calendar-max-seats', String(maxSeats));
    localStorage.setItem('calendar-date-format', dateFormat);
    localStorage.setItem('calendar-autosave', autoSave? '1':'0');
    localStorage.setItem('calendar-selection-mode', selectionMode);
  localStorage.setItem('calendar-show-office-req', showOfficeReq? '1':'0');
  localStorage.setItem('calendar-adaptive-debounce', adaptiveDebounce? '1':'0');
  localStorage.setItem('calendar-base-debounce', baseDebounce.toString());
  localStorage.setItem('calendar-min-debounce', minDebounce.toString());
  localStorage.setItem('calendar-max-debounce', maxDebounce.toString());
  closeSettings();
  generateCalendar(getCurrentDate());
  };
}

// === PERSIST HELPERS (debounce) ===
function schedulePersist(selections, year, month, opts={}){
  const {forceImmediate=false} = opts;
  const maxRetries = 3;
  const attemptSave = (attempt=1) => {
    lastSaveStarted = Date.now();
    if(autosaveStatusEl){ autosaveStatusEl.textContent = t('saving'); autosaveStatusEl.className='autosave-status saving'; }
    try {
      const u = getUser();
      if(!u){ console.warn('[schedulePersist] user not set yet, abort save'); return; }
      if(!Array.isArray(selections)) { console.warn('[schedulePersist] invalid selections'); return; }
      const dimCheck = new Date(year, month+1, 0).getDate();
      if(selections.length !== dimCheck){
        console.warn('[schedulePersist] selection length mismatch, adjusting', selections.length, '!=', dimCheck);
        // normalize by padding/truncating
        const norm = new Array(dimCheck).fill('').map((_,i)=> selections[i] || '');
        selections = norm;
      }
      window.dataService.enqueueSave(u, year, month, selections);
      updateSummary(year, month, selections);
      renderUserProfile(selections);
      recentSaves.push(Date.now()); if(recentSaves.length>6) recentSaves = recentSaves.slice(-6);
      adaptDebounce();
      if(autosaveStatusEl){
        autosaveStatusEl.textContent = t('saved');
        autosaveStatusEl.className='autosave-status saved';
        appendDebounceChip();
      }
      if(retrySaveBtn) retrySaveBtn.style.display='none';
      setTimeout(()=>{ if(autosaveStatusEl && autosaveStatusEl.textContent === t('saved')) autosaveStatusEl.textContent=''; }, 3500);
    } catch(err){
      console.error('Save error', err);
      if(attempt < maxRetries){
        if(autosaveStatusEl){ autosaveStatusEl.textContent = `${t('errorRetry')} ${attempt}…`; autosaveStatusEl.className='autosave-status saving'; }
        setTimeout(()=>attemptSave(attempt+1), 400*attempt);
      } else {
        if(autosaveStatusEl){ autosaveStatusEl.textContent = t('saveError'); autosaveStatusEl.className='autosave-status error'; }
        if(retrySaveBtn){ retrySaveBtn.style.display='inline-flex'; retrySaveBtn.title = t('retrySave'); }
      }
    }
  };
  if(forceImmediate){ attemptSave(); return; }
  if(autoSave){
    if(saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(attemptSave, saveDebounceMs);
  if(autosaveStatusEl){ autosaveStatusEl.textContent = t('pending'); autosaveStatusEl.className='autosave-status'; appendDebounceChip(); }
  } else {
    updateSummary(year, month, selections);
    renderUserProfile(selections);
    if(manualSaveBtn) manualSaveBtn.style.display='inline-flex';
  if(autosaveStatusEl){ autosaveStatusEl.textContent = t('manualMode'); autosaveStatusEl.className='autosave-status'; }
  }
}

function adaptDebounce(){
  if(!adaptiveDebounce){ saveDebounceMs = baseDebounce; return; }
  if(recentSaves.length < 3) return; // need data
  const now = Date.now();
  const windowMs = 60*1000;
  const inWindow = recentSaves.filter(t=> now - t < windowMs);
  if(inWindow.length >= 4){
    saveDebounceMs = Math.min(maxDebounce, saveDebounceMs + 200);
  } else if(inWindow.length <=2){
    saveDebounceMs = Math.max(minDebounce, saveDebounceMs - 100);
  }
}

function appendDebounceChip(){
  if(!autosaveStatusEl) return;
  // remove old chip
  const old = autosaveStatusEl.querySelector('.debounce-chip'); if(old) old.remove();
  const chip = document.createElement('span');
  chip.className='debounce-chip';
  chip.textContent = saveDebounceMs + 'ms';
  autosaveStatusEl.appendChild(chip);
}

if(retrySaveBtn){
  retrySaveBtn.addEventListener('click', ()=>{
  const cd = getCurrentDate();
  const year = cd.getFullYear();
  const month = cd.getMonth();
    const dim = new Date(year, month+1,0).getDate();
    const selections=[]; for(let i=1;i<=dim;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:''); }
    schedulePersist(selections, year, month, {forceImmediate:true});
  });
}

if(manualSaveBtn){
  manualSaveBtn.addEventListener('click', ()=>{
  const cd = getCurrentDate();
  const year = cd.getFullYear();
  const month = cd.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const selections=[]; for(let i=1;i<=daysInMonth;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:"" ); }
    schedulePersist(selections, year, month, {forceImmediate:true});
  });
}

// === Flush on exit / visibility for production safety ===
function safeFlushOnExit(){
  try {
    if(window.dataService && window.dataService.getPendingCount && window.dataService.getPendingCount()>0){
      window.dataService.flush();
      if(autosaveStatusEl){ autosaveStatusEl.textContent = (autosaveStatusEl.textContent||'') + ' ↻'; }
    }
  } catch(e){ /* ignore */ }
}
window.addEventListener('beforeunload', safeFlushOnExit);
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden'){ safeFlushOnExit(); } });

// === Lightweight pending indicator (no spinner CSS) ===
function updatePendingBadge(){
  if(!autosaveStatusEl || !window.dataService || !window.dataService.getPendingCount) return;
  const p = window.dataService.getPendingCount();
  autosaveStatusEl.dataset.pending = p.toString();
  if(p>0){
    if(!autosaveStatusEl.textContent.includes('…')){ autosaveStatusEl.textContent = (autosaveStatusEl.textContent||'') + ' …'; }
  }
}
setInterval(updatePendingBadge, 1800);

// === INIT UNIC CONSOLIDAT ===
window.addEventListener('DOMContentLoaded', async () => {
  setLang(currentLang);
  if(selectionModeSelect) selectionModeSelect.value = selectionMode;
  const sessionUser = sessionStorage.getItem("calendar-current-user");
  if (!sessionUser) { window.location.href = "auth.html"; return; }
  user = sessionUser.trim();
  if(window.calendarStore){ window.calendarStore.setUser(user); }
  await loadUserNameMap();
  customHolidays = getCustomHolidays();
  renderCustomHolidays();
  // Ensure footer is rendered on first load (setLang also populates it, but order-safe)
  try { renderFooter(); } catch {}
  const cdInit = getCurrentDate();
  await generateCalendar(cdInit);
  const sel = await window.dataService.loadUserMonth(getUser(), cdInit.getFullYear(), cdInit.getMonth());
  renderUserProfile(sel);
  const icon = document.getElementById("teamViewIcon");
  if (teamView.checked) { icon.textContent = "person"; toggleTeamViewBtn.title = translations[currentLang].switchToPersonal; }
  else { icon.textContent = "groups"; toggleTeamViewBtn.title = translations[currentLang].switchToTeam; }
  // Keyboard navigation & shortcuts
  document.addEventListener('keydown', (e)=>{
    const days = Array.from(document.querySelectorAll('#calendarGrid .day:not(.disabled)'));
    if(!days.length) return;
    const focusable = days;
    let currentIndex = focusable.findIndex(c=>c.classList.contains('kb-focus'));
    if(currentIndex === -1) currentIndex = 0;
    const moveFocus = (nextIdx)=>{
      focusable.forEach(c=>c.classList.remove('kb-focus'));
      const target = focusable[nextIdx];
      if(target){ target.classList.add('kb-focus'); target.scrollIntoView({block:'nearest'}); }
    };
    switch(e.key){
      case 'ArrowRight': e.preventDefault(); moveFocus(Math.min(focusable.length-1, currentIndex+1)); break;
      case 'ArrowLeft': e.preventDefault(); moveFocus(Math.max(0, currentIndex-1)); break;
      case 'ArrowDown': e.preventDefault(); moveFocus(Math.min(focusable.length-1, currentIndex+7)); break;
      case 'ArrowUp': e.preventDefault(); moveFocus(Math.max(0, currentIndex-7)); break;
      case 'Enter': {
        e.preventDefault();
        const cell = focusable[currentIndex];
        const sel = cell.querySelector('select');
        if(sel && !sel.disabled){
          const order = ["", "office", "home", "vacation"]; const idx = order.indexOf(sel.value); sel.value = order[(idx+1)%order.length]; applyVisualState(cell, sel.value);
          const cdKey = getCurrentDate();
          const year = cdKey.getFullYear();
          const month = cdKey.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const selections=[]; for(let i=1;i<=daysInMonth;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:""); }
          schedulePersist(selections, year, month);
        }
        break;
      }
      case '1': case '2': case '3': {
        const mapKey = { '1':'office','2':'home','3':'vacation'}; const val = mapKey[e.key];
        const cell = focusable[currentIndex]; const sel = cell.querySelector('select');
        if(sel && !sel.disabled){ sel.value = val; applyVisualState(cell,val); const cdKey2=getCurrentDate(); const year=cdKey2.getFullYear(); const month=cdKey2.getMonth(); const daysInMonth=new Date(year,month+1,0).getDate(); const selections=[]; for(let i=1;i<=daysInMonth;i++){ const s=document.querySelector(`#calendarGrid .day[data-idx='${i-1}'] select`); selections.push(s? s.value:""); } schedulePersist(selections, year, month); }
        break;
      }
      case 'm': case 'M': {
        explicitMassMode = !explicitMassMode; if(massModeToggleBtn){ massModeToggleBtn.classList.toggle('active', explicitMassMode); massModeToggleBtn.title = explicitMassMode ? translations[currentLang].multiSelectOn : translations[currentLang].multiSelectOff; }
        if(!explicitMassMode) clearMassSelection();
        break;
      }
      case 'Escape': {
        if(explicitMassMode){ explicitMassMode=false; if(massModeToggleBtn){ massModeToggleBtn.classList.remove('active'); massModeToggleBtn.title = translations[currentLang].multiSelectOff; } clearMassSelection(); }
        break;
      }
      default: break;
    }
  });
  // Auto-open keyboard help once per 14 zile pentru utilizatori noi / după update (dacă user nu a deschis manual recent)
  if(helpModal && (Date.now() - lastKbHelpDismiss) > KB_HELP_AUTO_DELAY){
    setTimeout(()=>{ openHelp(); }, 1200);
  }
});

// (Eliminat: userSettings Firestore - folosim localStorage pentru preferințe UI)
