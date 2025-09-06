// Extracted translations & basic i18n utilities (Sprint 2 modularization step 1)
// This file defines: window.translations, window.currentLang, window.t

(function(){
  const translations = {
  ro: {
      today: "Astăzi",
      totalAtOffice: "Total la birou",
      noColleagues: "Niciun coleg prezent la birou.",
  capacity: "Capacitate",
  capacityLegendTitle: "Legendă capacitate",
  capacityLow: "scăzută",
  capacityMid: "medie",
  capacityHigh: "ridicată",
  capacitySelected: "Capacitate (ziua selectată)",
      baseLabel: "Bază",
      legalLabel: "Legale",
      adjustedLabel: "Ajustat",
      remainingLabel: "Rămase",
      homeShort: "Home",
      remainingShort: "rămase",
      baseOfficeRequirement: "Necesar de bază office",
      legalWorkdayHolidays: "Sărbători legale în zile lucrătoare",
      adjustedOfficeRequirement: "Necesar office ajustat (bază - vacanțe - sărbători)",
      officeDaysRemaining: "Zile office rămase de realizat",
  homeDaysRemaining: "Zile rămase Home Office",
      saving: "Se salvează…",
      saved: "Salvat",
      pending: "În așteptare…",
      manualMode: "Mod manual",
      saveError: "Eroare salvare",
      retrySave: "Reîncearcă salvarea",
      errorRetry: "Eroare, retry",
      monthsFull: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
      monthsShort: ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"],
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
  collapse: "Ascunde",
  expand: "Arată",
  clearAllHolidays: "Șterge toate sărbătorile",
      resetMonth: "Resetare lună",
      allOffice: "Toate Office",
      allHome: "Toate Home",
      stats: "Statistici lunare",
  logout: "Deconectare",
      summary: "Sumar:",
      totalSelected: "Total selectate:",
      weekdaysShort: ["Lun", "Mar", "Mie", "Joi", "Vin", "Sam", "Dum"],
      colleagues: "colegi",
      personalSummary: "Rezumat personal:",
      daysOffice: "Zile Office + Sărbători",
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
      chartLabel: "Număr colegi la birou",
      chartX: "Ziua lunii",
      chartY: "Colegii la birou",
      switchToPersonal: "Comută la vizualizare personală",
      switchToTeam: "Comută la vizualizare echipă",
      confirmReset: "Resetezi toate selecțiile pentru această lună?",
      massEdit: "Editare în masă",
      clear: "Golește",
      cancel: "Anulează",
      weekend: "Weekend",
      day: "Ziua",
      settings: "Setări",
      save: "Salvează",
      maxHomeDays: "Zile maxime Home Office / lună",
  maxSeats: "Locuri maxime (capacitate echipă)",
      dateFormat: "Format dată",
      autoSave: "Salvare automată (întârziere)",
      exportCsv: "Exportă CSV",
  exportIcs: "Exportă iCalendar",
  exportOooIcs: "Exportă Out of Office (iCalendar)",
      footerBrand: "Hybrid Office Planner",
      footerMeta: "Planificator lunar pentru Office/Home/Vacanță",
      footerLinks: {
        help: "Ajutor",
        csv: "Export CSV",
        ics: "Export Out of Office",
        settings: "Setări"
      },
      settingsTitle: "Setări",
      week: "Săptămână",
      month: "Lună",
      multiSelectOn: "Mod selectare multiplă activ",
      multiSelectOff: "Selectare multiplă (inactive)",
      keyboardHelp: "Navigare: săgeți; Enter = schimbă; 1=Office 2=Home 3=Vacanță; M = multi-select; Esc = ieșire",
      selectionMode: "Mod selectare zi",
      selectionCycle: "Click ciclic",
      selectionDropdown: "Dropdown",
      modeHintCycle: "Mod: Click ciclic",
      modeHintDropdown: "Mod: Select dropdown",
      showOfficeReq: "Necesar office ajustat vizibil",
      adaptiveDebounce: "Debounce adaptiv",
      baseDebounce: "Debounce bază (ms)",
      minDebounce: "Debounce min (ms)",
      maxDebounce: "Debounce max (ms)",
      maxHomeDays_help: "Număr maxim de zile lucrate de acasă permise într-o lună (pentru bară de progres).",
      dateFormat_help: "Formatul folosit la export (CSV/ICS) și afișări. Nu schimbă datele salvate.",
      selectionMode_help: "Click ciclic: un click schimbă starea. Dropdown: alegi explicit din listă.",
      autoSave_help: "Dacă e activ, modificările se salvează automat după o întârziere (debounce).",
      showOfficeReq_help: "Afișează/ascunde linia cu necesarul office ajustat (bază - vacanțe - legale).",
      adaptiveDebounce_help: "Ajustează automat întârzierea de salvare în funcție de ritmul modificărilor.",
      baseDebounce_help: "Valoarea de plecare a întârzierii (ms) pentru salvare automată.",
      minDebounce_help: "Limita inferioară la care poate ajunge debounce-ul adaptiv.",
      maxDebounce_help: "Limita superioară la care poate urca debounce-ul adaptiv." 
  ,profile: "Profil"
  ,coreIndicators: "Indicatori principali"
  ,workingDaysInMonth: "Zile lucrătoare"
  ,workingDaysInMonthTip: "Zile de luni până vineri"
  ,homeRemaining: "Zile rămase Home Office"
  ,limitReached: "Limită atinsă"
  ,collapseSidebar: "Restrânge bara laterală"
  ,expandSidebar: "Extinde bara laterală"
  ,homeDaysRemainingTip: "Zile pe care le mai poți lucra de acasă"
  ,officeRequiredDynamic: "Zile Obligatorii Office"
  ,officeRequiredDynamicTip: "(Zile lucrătoare - Home max - Vacanță - Legale)"
  ,officeRemaining: "Zile Rămase Office"
  ,officeRemainingDynamicTip: "Zile încă de planificat la birou"
  ,completed: "Realizat"
  ,remaining: "Rămase"
  ,adjustedShort: "Țintă"
  ,pace: "Ritm"
  ,etaLabel: "Estimare"
  ,impactOffice: "din necesar office"
  ,advancedDetails: "Detalii și factori"
  ,distribution: "Distribuție"
  ,coverage: "acoperire WD"
  ,forecastCompletion: "Estimare finalizare"
  ,goalMet: "Obiect atins"
  ,noPaceData: "Nu există ritm încă"
  ,completedTip: "Zile office deja realizate în această lună"
  ,remainingTip: "Zile office rămase pentru a atinge ținta"
  ,targetTip: "Necesar (țintă) de zile la birou pentru luna curentă"
  ,paceUnit: " / zi lucrătoare"
  ,paceTip: "Media zilelor office pe zilele lucrătoare trecute (inclusiv azi)"
  ,etaTip: "Ziua din lună când atingi ținta dacă păstrezi același ritm"
  ,paceLabelLong: "Ritm curent"
  ,paceValueSuffix: "zile la birou/zi lucrătoare"
  ,etaLabelLong: "Țintă atinsă pe"
  ,outOfOffice: "Out of Office"
  ,auth: {
    loginTitle: "Autentificare",
    registerTitle: "Înregistrare",
    username: "Utilizator",
    password: "Parolă",
    name: "Nume",
    surname: "Prenume",
    login: "Autentifică-te",
    register: "Înregistrează-te",
    noAccount: "Nu ai cont?",
    haveAccount: "Ai deja cont?",
    showRegisterLink: "Înregistrează-te",
    showLoginLink: "Autentificare",
    rememberMe: "Ține minte utilizatorul",
    showPassword: "Arată parola",
    hidePassword: "Ascunde parola",
    invalidCredentials: "Utilizator sau parolă incorecte.",
    loginError: "Eroare la autentificare.",
    registerError: "Eroare la înregistrare.",
    userExists: "Username-ul există deja.",
    userSpacesError: "Username-ul nu trebuie să conțină spații.",
    registerSuccess: "Cont creat! Te poți autentifica."
  }
  ,help: {
    title: "Ghid de utilizare",
    toc: {
      intro: "Prezentare",
      quickStart: "Start rapid",
      actionBar: "Bara de acțiuni",
      dayModes: "Moduri de selectare",
      multiselect: "Multi‑select",
      profile: "Profil & indicatori",
      team: "Vizualizare echipă",
      exports: "Exporturi",
      settings: "Setări",
      shortcuts: "Scurtături",
      faq: "Întrebări frecvente"
    },
    sections: {
      intro: { title: "Prezentare", desc: "Aplicatie pentru planificarea lunară a zilelor Office / Home / Vacanță, cu vizualizare de echipă, statistici și export." },
      quickstart: { title: "Start rapid", steps: [
        "Alege luna cu săgețile din antet.",
        "Selectează pentru fiecare zi Office / Home / Vacanță.",
        "Folosește Multi‑select pentru a edita mai multe zile odată.",
        "Verifică progresul în panoul de profil.",
        "Exportă zilele de vacanță ca Out of Office (iCalendar)."
      ]},
      calendar: { title: "Vizualizare calendar", desc: "Navighează lunile cu săgețile din antet. Weekend-urile sunt gri; sărbătorile legale sunt marcate automat." },
      selection: { title: "Selectarea zilelor", desc: "Setează pentru fiecare zi: Office, Home sau Vacanță. Poți comuta modul de selectare între Click ciclic și Dropdown din Setări.", bullets: ["1 = Office, 2 = Home, 3 = Vacanță","Enter: schimbă starea zilei","M: activează/dezactivează Multi‑select"] },
      daymodes: { title: "Moduri de selectare", items: [
        { title: "Click ciclic", desc: "Clic pe o zi pentru a parcurge stările: gol → Office → Home → Vacanță." },
        { title: "Dropdown", desc: "Alege explicit starea din listă; util pentru precizie." }
      ]},
      actionbar: { title: "Bara de acțiuni", items: [
        { icon: "refresh", title: "Resetare lună", desc: "Golește selecțiile din luna curentă." },
        { icon: "business", title: "Toate Office", desc: "Setează toate zilele lucrătoare ca Office." },
        { icon: "home", title: "Toate Home", desc: "Setează toate zilele lucrătoare ca Home." },
        { icon: "select_all", title: "Multi‑select", desc: "Activează editarea în masă prin selectare cu mouse-ul." },
        { icon: "help_outline", title: "Ghid", desc: "Deschide acest ghid de utilizare." },
        { icon: "event", title: "Export iCalendar OOO", desc: "Exportă doar zilele de vacanță ca Out of Office." },
        { icon: "save", title: "Salvare acum", desc: "Forțează salvarea instant (când auto-save e dezactivat)." }
      ]},
      multiselect: { title: "Editare în masă (Multi‑select)", desc: "Activează Multi‑select din bară, trage peste zilele dorite, apoi alege acțiunea (Office/Home/Vacanță/Curăță)." },
      profile: { title: "Profil și indicatori", desc: "Panoul de profil arată progresul Office, zilele rămase Home și impactul vacanțelor. Limita Home este configurabilă din Setări." },
      team: { title: "Vizualizare echipă", desc: "Comută între personal și echipă. În modul echipă vezi colegii prezenți la birou pe fiecare zi și poți filtra după utilizator sau tip." },
      exports: { title: "Exporturi", desc: "CSV: export pentru întreaga echipă. iCalendar: exportă doar zilele de Vacanță ca Out of Office pentru Outlook/Teams." },
      settings: { title: "Setări", desc: "Configurează limita Home, formatul de dată, modul de selectare, salvarea automată și alte preferințe." },
      shortcuts: { title: "Scurtături tastatură", bullets: ["Săgeți: navigare în calendar","Enter: schimbă starea zilei","1 = Office, 2 = Home, 3 = Vacanță","M: Multi‑select on/off","Esc: ieșire din Multi‑select"] },
      faq: { title: "Întrebări frecvente", qas: [
        { q: "De ce nu pot selecta o zi?", a: "Zilele de weekend și sărbătorile legale sunt blocate; în modul echipă selectarea personală e dezactivată." },
        { q: "Ce înseamnă Out of Office?", a: "La import în Outlook/Teams, zilele de vacanță sunt marcate ca indisponibil (OOO)." }
      ]}
    }
  }
    },
  en: {
      today: "Today",
      totalAtOffice: "Total at office",
      noColleagues: "No colleagues at the office.",
  capacity: "Capacity",
  capacityLegendTitle: "Capacity legend",
  capacityLow: "low",
  capacityMid: "medium",
  capacityHigh: "high",
  capacitySelected: "Capacity (selected day)",
      baseLabel: "Base",
      legalLabel: "Legal",
      adjustedLabel: "Adjusted",
      remainingLabel: "Remaining",
      homeShort: "Home",
      remainingShort: "left",
      baseOfficeRequirement: "Base office requirement",
      legalWorkdayHolidays: "Legal holidays on workdays",
      adjustedOfficeRequirement: "Adjusted office requirement (base - vacation - holidays)",
      officeDaysRemaining: "Office days still required",
  homeDaysRemaining: "Home Office days left",
      saving: "Saving…",
      saved: "Saved",
      pending: "Pending…",
      manualMode: "Manual mode",
      saveError: "Save error",
      retrySave: "Retry save",
      errorRetry: "Error, retry",
      monthsFull: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      monthsShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
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
  collapse: "Collapse",
  expand: "Expand",
  clearAllHolidays: "Clear all holidays",
      resetMonth: "Reset month",
      allOffice: "All Office",
      allHome: "All Home",
      stats: "Monthly stats",
      logout: "Logout",
      summary: "Summary:",
      totalSelected: "Total selected:",
      weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      colleagues: "colleagues",
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
      chartLabel: "Number of colleagues at office",
      chartX: "Day of month",
      chartY: "Colleagues at office",
      switchToPersonal: "Switch to personal view",
      switchToTeam: "Switch to team view",
      confirmReset: "Reset all selections for this month?",
      massEdit: "Mass edit",
      clear: "Clear",
      cancel: "Cancel",
      weekend: "Weekend",
      day: "Day",
      settings: "Settings",
      save: "Save",
      maxHomeDays: "Max Home Office days / month",
  maxSeats: "Max seats (team capacity)",
      dateFormat: "Date format",
      autoSave: "Auto save (debounce)",
      exportCsv: "Export CSV",
  exportIcs: "Export iCalendar",
  exportOooIcs: "Export Out of Office (iCalendar)",
      footerBrand: "Hybrid Office Planner",
      footerMeta: "Monthly planner for Office/Home/Vacation",
      footerLinks: {
        help: "Help",
        csv: "Export CSV",
        ics: "Export Out of Office",
        settings: "Settings"
      },
      settingsTitle: "Settings",
      week: "Week",
      month: "Month",
      multiSelectOn: "Multi-select mode on",
      multiSelectOff: "Multi-select (off)",
      keyboardHelp: "Keyboard: arrows move; Enter cycles; 1=Office 2=Home 3=Vacation; M=multi-select; Esc=exit",
      selectionMode: "Day selection mode",
      selectionCycle: "Click cycle",
      selectionDropdown: "Dropdown",
      modeHintCycle: "Mode: Click cycle",
      modeHintDropdown: "Mode: Dropdown select",
      showOfficeReq: "Show adjusted office requirement",
      adaptiveDebounce: "Adaptive debounce",
      baseDebounce: "Base debounce (ms)",
      minDebounce: "Min debounce (ms)",
      maxDebounce: "Max debounce (ms)",
      maxHomeDays_help: "Maximum allowed home-office days per month (used for progress bars).",
      dateFormat_help: "Format used for export (CSV/ICS) and display. Does not change stored data.",
      selectionMode_help: "Click cycle: one click cycles states. Dropdown: pick explicitly from list.",
      autoSave_help: "When enabled, changes auto-save after a delay (debounce).",
      showOfficeReq_help: "Show/hide the adjusted office requirement line (base - vacation - legal).",
      adaptiveDebounce_help: "Automatically adjusts save delay based on edit frequency.",
      baseDebounce_help: "Starting debounce delay (ms) for auto-save.",
      minDebounce_help: "Lower bound the adaptive debounce will not go below.",
      maxDebounce_help: "Upper bound the adaptive debounce will not exceed." 
  ,profile: "Profile"
  ,coreIndicators: "Core indicators"
  ,workingDaysInMonth: "Working weekdays"
  ,workingDaysInMonthTip: "Monday–Friday days"
  ,homeRemaining: "Home Office days left"
  ,limitReached: "Limit reached"
  ,collapseSidebar: "Collapse sidebar"
  ,expandSidebar: "Expand sidebar"
  ,homeDaysRemainingTip: "Days you can still work from home"
  ,officeRequiredDynamic: "Office required"
  ,officeRequiredDynamicTip: "(Weekdays - Max Home - Vacation - Legal)"
  ,officeRemaining: "Office remaining"
  ,officeRemainingDynamicTip: "Days still to plan at office"
  ,completed: "Completed"
  ,remaining: "Remaining"
  ,adjustedShort: "Target"
  ,pace: "Pace"
  ,etaLabel: "ETA"
  ,impactOffice: "from office requirement"
  ,advancedDetails: "Details & factors"
  ,distribution: "Distribution"
  ,coverage: "WD coverage"
  ,forecastCompletion: "Completion estimate"
  ,goalMet: "Goal met"
  ,noPaceData: "No pace yet"
  ,completedTip: "Office days already completed this month"
  ,remainingTip: "Office days remaining to reach the target"
  ,targetTip: "Required (target) office days for the current month"
  ,paceUnit: " / working day"
  ,paceTip: "Average office days per past working day (including today)"
  ,etaTip: "Day of the month when you'll reach the target if pace stays the same"
  ,paceLabelLong: "Current pace"
  ,paceValueSuffix: "office days/working day"
  ,etaLabelLong: "Target reached on"
  ,outOfOffice: "Out of Office"
  ,auth: {
    loginTitle: "Sign in",
    registerTitle: "Register",
    username: "Username",
    password: "Password",
    name: "First name",
    surname: "Last name",
    login: "Sign in",
    register: "Create account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    showRegisterLink: "Register",
    showLoginLink: "Sign in",
    rememberMe: "Remember username",
    showPassword: "Show password",
    hidePassword: "Hide password",
    invalidCredentials: "Incorrect username or password.",
    loginError: "Sign-in error.",
    registerError: "Registration error.",
    userExists: "Username already exists.",
    userSpacesError: "Username must not contain spaces.",
    registerSuccess: "Account created! You can sign in now."
  }
  ,help: {
    title: "User guide",
    toc: {
      intro: "Overview",
      quickStart: "Quick start",
      actionBar: "Action bar",
      dayModes: "Selection modes",
      multiselect: "Multi‑select",
      profile: "Profile & indicators",
      team: "Team view",
      exports: "Exports",
      settings: "Settings",
      shortcuts: "Shortcuts",
      faq: "FAQ"
    },
    sections: {
      intro: { title: "Overview", desc: "Plan monthly Office / Home / Vacation days, see team presence, stats, and export." },
      quickstart: { title: "Quick start", steps: [
        "Pick a month with the header arrows.",
        "Set each day to Office / Home / Vacation.",
        "Use Multi‑select to edit many days at once.",
        "Check progress in the profile panel.",
        "Export vacation days as Out of Office (iCalendar)."
      ]},
      calendar: { title: "Calendar view", desc: "Navigate months with the header arrows. Weekends are grey; legal holidays are auto-marked." },
      selection: { title: "Selecting days", desc: "Set each day to Office, Home or Vacation. Switch selection mode between Click cycle and Dropdown in Settings.", bullets: ["1 = Office, 2 = Home, 3 = Vacation","Enter: cycle day state","M: toggle Multi‑select"] },
      daymodes: { title: "Selection modes", items: [
        { title: "Click cycle", desc: "Click a day to cycle states: empty → Office → Home → Vacation." },
        { title: "Dropdown", desc: "Pick the exact state from the list; great for precision." }
      ]},
      actionbar: { title: "Action bar", items: [
        { icon: "refresh", title: "Reset month", desc: "Clear selections for the current month." },
        { icon: "business", title: "All Office", desc: "Set all working days to Office." },
        { icon: "home", title: "All Home", desc: "Set all working days to Home." },
        { icon: "select_all", title: "Multi‑select", desc: "Enable mass edit via drag selection." },
        { icon: "help_outline", title: "Guide", desc: "Open this user guide." },
        { icon: "event", title: "Export iCalendar OOO", desc: "Export only Vacation days as Out of Office." },
        { icon: "save", title: "Save now", desc: "Force an immediate save (when auto-save is off)." }
      ]},
      multiselect: { title: "Mass edit (Multi‑select)", desc: "Enable Multi‑select from the bar, drag over desired days, then choose an action (Office/Home/Vacation/Clear)." },
      profile: { title: "Profile & indicators", desc: "The profile shows Office progress, remaining Home days, and vacation impact. Home limit is configurable in Settings." },
      team: { title: "Team view", desc: "Toggle personal vs team. In team view, see colleagues at office per day and filter by user or type." },
      exports: { title: "Exports", desc: "CSV: export for the whole team. iCalendar: exports only Vacation days as Out of Office for Outlook/Teams." },
      settings: { title: "Settings", desc: "Configure Home limit, date format, selection mode, auto-save and more." },
      shortcuts: { title: "Keyboard shortcuts", bullets: ["Arrows: navigate calendar","Enter: cycle day state","1 = Office, 2 = Home, 3 = Vacation","M: toggle Multi‑select","Esc: exit Multi‑select"] },
      faq: { title: "FAQ", qas: [
        { q: "Why can’t I edit a day?", a: "Weekends and legal holidays are locked; in team view personal editing is disabled." },
        { q: "What is Out of Office?", a: "When importing to Outlook/Teams, vacation days are marked as unavailable (OOO)." }
      ]}
    }
  }
    }
  };

  let currentLang = localStorage.getItem('calendar-lang') || 'ro';
  function t(key, fallback=''){
    const base = translations[currentLang] || translations['ro'];
    const parts = key.split('.');
    let cur = base;
    for(const p of parts){ if(cur==null) break; cur = cur[p]; }
    if(cur !== undefined) return cur; return fallback || key;
  }
  window.translations = translations;
  window.currentLang = currentLang;
  window.t = t;

  // setLang moved from script.js into this i18n module; updates visible UI strings.
  function setLang(lang){
    currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem('calendar-lang', lang);
    // Defer DOM operations if document not ready
    if(typeof document === 'undefined') return;
    try {
      // Sidebar titles (defensive checks)
      const sideTitles = document.querySelectorAll('.sidebar-title');
      if(sideTitles[0]) sideTitles[0].textContent = translations[lang].view;
      if(sideTitles[1]) sideTitles[1].textContent = translations[lang].customHolidays;
      if(sideTitles[2]) sideTitles[2].textContent = translations[lang].filterCalendar;
      const holidayName = document.getElementById('holidayName'); if(holidayName) holidayName.placeholder = translations[lang].addHoliday;
      const filterType = document.getElementById('filterType');
      if(filterType && filterType.options.length>=4){
        filterType.options[0].textContent = translations[lang].allTypes;
        filterType.options[1].textContent = translations[lang].office;
        filterType.options[2].textContent = translations[lang].home;
        filterType.options[3].textContent = translations[lang].vacation;
      }
      const filterUser = document.getElementById('filterUser'); if(filterUser) filterUser.placeholder = translations[lang].userFilter;
      const filterBtn = document.getElementById('filterBtn'); if(filterBtn) filterBtn.title = translations[lang].filter;
      const resetFilterBtn = document.getElementById('resetFilterBtn'); if(resetFilterBtn) resetFilterBtn.title = translations[lang].resetFilters;
  const toggleCustomHolidaysSec = document.getElementById('toggleCustomHolidaysSec'); if(toggleCustomHolidaysSec){ toggleCustomHolidaysSec.title = translations[lang].collapse; }
  const toggleFilterSec = document.getElementById('toggleFilterSec'); if(toggleFilterSec){ toggleFilterSec.title = translations[lang].collapse; }
  const clearHolidaysBtn = document.getElementById('clearHolidaysBtn'); if(clearHolidaysBtn) clearHolidaysBtn.title = translations[lang].clearAllHolidays;
  const collapseSidebarBtn = document.getElementById('collapseSidebarBtn'); if(collapseSidebarBtn){ const collapsed = document.querySelector('.sidebar')?.classList.contains('sidebar--collapsed'); collapseSidebarBtn.title = collapsed? translations[lang].expandSidebar : translations[lang].collapseSidebar; }
  const resetBtn = document.getElementById('resetBtn'); if(resetBtn){ const lbl=resetBtn.querySelector('.btn-label'); if(lbl) lbl.textContent = translations[lang].resetMonth; else resetBtn.innerHTML = `<span class="material-icons">refresh</span> ${translations[lang].resetMonth}`; }
  const bulkOfficeBtn = document.getElementById('bulkOfficeBtn'); if(bulkOfficeBtn){ const lbl=bulkOfficeBtn.querySelector('.btn-label'); if(lbl) lbl.textContent = translations[lang].allOffice; else bulkOfficeBtn.innerHTML = `<span class="material-icons">business</span> ${translations[lang].allOffice}`; }
  const bulkHomeBtn = document.getElementById('bulkHomeBtn'); if(bulkHomeBtn){ const lbl=bulkHomeBtn.querySelector('.btn-label'); if(lbl) lbl.textContent = translations[lang].allHome; else bulkHomeBtn.innerHTML = `<span class="material-icons">home</span> ${translations[lang].allHome}`; }
      const langBtn = document.getElementById('langBtn');
      if(langBtn){
        langBtn.innerHTML = `<span style="font-weight:bold;font-size:16px;letter-spacing:1px;padding:2px 8px;border-radius:8px;background:#f3f6ff;color:#6c63ff;box-shadow:0 1px 4px #0001;">${lang==='ro'?'RO':'EN'}</span>`;
        langBtn.title = lang==='ro' ? 'Schimbă limba în engleză' : 'Switch language to Romanian';
      }
  const logoutBtn = document.getElementById('logoutBtn'); if(logoutBtn) logoutBtn.textContent = translations[lang].logout;
  const manualSaveBtn = document.getElementById('manualSaveBtn'); if(manualSaveBtn){ const lbl=manualSaveBtn.querySelector('.btn-label'); if(lbl) lbl.textContent = translations[lang].save; else manualSaveBtn.innerHTML = `<span class="material-icons">save</span> ${translations[lang].save}`; }
      // Settings modal labels
      const settingsBtn = document.getElementById('settingsBtn'); if(settingsBtn) settingsBtn.title = translations[lang].settings;
      const exportCsvBtn = document.getElementById('exportCsvBtn'); if(exportCsvBtn) exportCsvBtn.title = translations[lang].exportCsv;
  const exportIcsBtn = document.getElementById('exportIcsBtn'); if(exportIcsBtn) exportIcsBtn.title = translations[lang].exportOooIcs || translations[lang].exportIcs;
  // Rail quick actions (sidebar collapsed)
  const railExpandBtn = document.getElementById('railExpandBtn'); if(railExpandBtn) railExpandBtn.title = translations[lang].expandSidebar;
  // Collapsed rail contains only the Expand control
      // Footer population
      const footer = document.getElementById('pageFooter');
  if(footer){
        const L = translations[lang];
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
        // Wire footer buttons to existing actions (idempotent wiring here; script.js also reinforces)
        const hb=document.getElementById('ftHelpBtn'); if(hb){ hb.onclick = ()=>{ if(typeof window.openHelp==='function') window.openHelp(); else { const b=document.getElementById('keyboardHelpBtn'); if(b) b.click(); } }; }
        const cb=document.getElementById('ftCsvBtn'); if(cb){ cb.onclick = ()=>{ const b=document.getElementById('exportCsvBtn'); if(b) b.click(); }; }
        const ib=document.getElementById('ftIcsBtn'); if(ib){ ib.onclick = ()=>{ const b=document.getElementById('exportIcsBtn'); if(b) b.click(); }; }
        const sb=document.getElementById('ftSettingsBtn'); if(sb){ sb.onclick = ()=>{ const b=document.getElementById('settingsBtn'); if(b) b.click(); }; }
      }
      const keyboardHelpBtn = document.getElementById('keyboardHelpBtn'); if(keyboardHelpBtn) keyboardHelpBtn.title = (translations[lang].help && translations[lang].help.title) || translations[lang].keyboardHelp || 'Help';
      const settingsTitle = document.getElementById('settingsTitle'); if(settingsTitle) settingsTitle.textContent = translations[lang].settingsTitle;
      const labelMaxHomeDays = document.getElementById('labelMaxHomeDays'); if(labelMaxHomeDays) labelMaxHomeDays.textContent = translations[lang].maxHomeDays;
      const labelDateFormat = document.getElementById('labelDateFormat'); if(labelDateFormat) labelDateFormat.textContent = translations[lang].dateFormat;
  const labelMaxSeats = document.getElementById('labelMaxSeats'); if(labelMaxSeats) labelMaxSeats.textContent = translations[lang].maxSeats;
      const labelAutoSave = document.getElementById('labelAutoSave'); if(labelAutoSave){ const cb=labelAutoSave.querySelector('input'); labelAutoSave.innerHTML=''; if(cb) labelAutoSave.appendChild(cb); labelAutoSave.append(' '+translations[lang].autoSave); }
      const labelSelectionMode = document.getElementById('labelSelectionMode'); if(labelSelectionMode) labelSelectionMode.textContent = translations[lang].selectionMode;
      const selectionModeSelect = document.getElementById('selectionModeSelect'); if(selectionModeSelect && selectionModeSelect.options.length>=2){ selectionModeSelect.options[0].textContent = translations[lang].selectionCycle; selectionModeSelect.options[1].textContent = translations[lang].selectionDropdown; }
      const saveSettingsBtn = document.getElementById('saveSettingsBtn'); if(saveSettingsBtn) saveSettingsBtn.textContent = translations[lang].save;
      const labelShowOfficeReq = document.getElementById('labelShowOfficeReq'); if(labelShowOfficeReq){ const cb=labelShowOfficeReq.querySelector('input'); labelShowOfficeReq.innerHTML=''; if(cb) labelShowOfficeReq.appendChild(cb); labelShowOfficeReq.append(' '+translations[lang].showOfficeReq); }
      const labelAdaptiveDebounce = document.getElementById('labelAdaptiveDebounce'); if(labelAdaptiveDebounce){ const cb=labelAdaptiveDebounce.querySelector('input'); labelAdaptiveDebounce.innerHTML=''; if(cb) labelAdaptiveDebounce.appendChild(cb); labelAdaptiveDebounce.append(' '+translations[lang].adaptiveDebounce); }
      const labelBaseDebounce = document.getElementById('labelBaseDebounce'); if(labelBaseDebounce) labelBaseDebounce.textContent = translations[lang].baseDebounce;
      const labelMinDebounce = document.getElementById('labelMinDebounce'); if(labelMinDebounce) labelMinDebounce.textContent = translations[lang].minDebounce;
      const labelMaxDebounce = document.getElementById('labelMaxDebounce'); if(labelMaxDebounce) labelMaxDebounce.textContent = translations[lang].maxDebounce;
      // External helpers (defined in script.js) if available
      if(typeof enhanceSettingsHelp === 'function') enhanceSettingsHelp();
      if(typeof kbHelpPopover !== 'undefined' && kbHelpPopover && !kbHelpPopover.classList.contains('hidden') && typeof populateKeyboardHelp==='function') populateKeyboardHelp();
    } catch(err){ console.warn('setLang update skipped', err); }
  }
  window.setLang = setLang;
})();
