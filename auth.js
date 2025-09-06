// auth.js - gestionare login/înregistrare cu Firestore + UX îmbunătățit
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const authError = document.getElementById("authError");
const regError = document.getElementById("regError");
const authTitle = document.getElementById("auth-title");
const authLangBtn = document.getElementById("authLangBtn");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const showPassBtn = document.getElementById("showPassBtn");
const showRegPassBtn = document.getElementById("showRegPassBtn");
const rememberUser = document.getElementById("rememberUser");
const rememberLabel = document.getElementById("rememberLabel");
const loginSubmit = document.getElementById("loginSubmit");
const registerSubmit = document.getElementById("registerSubmit");
// Help modal elements
const authHelpBtn = document.getElementById('authHelpBtn');
const authHelpModal = document.getElementById('authHelpModal');
const authHelpClose = document.getElementById('authHelpClose');
const authHelpContent = document.getElementById('authHelpContent');
const authHelpTitle = document.getElementById('authHelpTitle');

function showAuth(showReg = false) {
  loginForm.style.display = showReg ? "none" : "block";
  registerForm.style.display = showReg ? "block" : "none";
  if(authTitle){ authTitle.textContent = showReg ? (translations[currentLang]?.auth?.registerTitle || 'Register') : (translations[currentLang]?.auth?.loginTitle || 'Login'); }
}
showRegister.onclick = () => showAuth(true);
showLogin.onclick = () => showAuth(false);

// i18n populate (if translations loaded)
function applyAuthLang(){
  const tr = (translations && translations[currentLang] && translations[currentLang].auth) ? translations[currentLang].auth : null;
  if(!tr) return;
  if(authTitle) authTitle.textContent = tr.loginTitle;
  if(loginUser){ loginUser.placeholder = tr.username; }
  if(loginPass){ loginPass.placeholder = tr.password; }
  if(showPassBtn){
    showPassBtn.setAttribute('aria-label', tr.showPassword);
    const sr = showPassBtn.querySelector('.sr-only'); if(sr) sr.textContent = tr.showPassword;
  }
  if(rememberLabel){ const span = rememberLabel.querySelector('.switch-text') || rememberLabel.querySelector('span'); if(span) span.textContent = tr.rememberMe; }
  if(loginSubmit) loginSubmit.textContent = tr.login;
  const loginSwitch = document.getElementById('login-switch'); if(loginSwitch){ loginSwitch.innerHTML = `${tr.noAccount} <a href="#" id="showRegister">${tr.showRegisterLink}</a>`; loginSwitch.querySelector('#showRegister').onclick = ()=> showAuth(true); }
  const registerSwitch = document.getElementById('register-switch'); if(registerSwitch){ registerSwitch.innerHTML = `${tr.haveAccount} <a href="#" id="showLogin">${tr.showLoginLink}</a>`; registerSwitch.querySelector('#showLogin').onclick = ()=> showAuth(false); }
  const regName = document.getElementById('regName'); if(regName) regName.placeholder = tr.name;
  const regSurname = document.getElementById('regSurname'); if(regSurname) regSurname.placeholder = tr.surname;
  const regUser = document.getElementById('regUser'); if(regUser) regUser.placeholder = `${tr.username} (unic)`;
  const regPass = document.getElementById('regPass'); if(regPass) regPass.placeholder = tr.password;
  if(showRegPassBtn){
    showRegPassBtn.setAttribute('aria-label', tr.showPassword);
    const sr2 = showRegPassBtn.querySelector('.sr-only'); if(sr2) sr2.textContent = tr.showPassword;
  }
  if(registerSubmit) registerSubmit.textContent = tr.register;
  if(authLangBtn){ authLangBtn.textContent = currentLang==='ro'? 'RO':'EN'; authLangBtn.title = currentLang==='ro'? 'Switch to English':'Schimbă în Română'; }
  // Help modal titles
  if(authHelpBtn){
    const lbl = (translations[currentLang]?.help?.title) || 'Ghid de utilizare';
    authHelpBtn.title = lbl;
    const labEl = authHelpBtn.querySelector('.btn-label'); if(labEl) labEl.textContent = lbl;
  }
  if(authHelpTitle){ authHelpTitle.textContent = (translations[currentLang]?.help?.title) || 'Ghid de utilizare'; }
  // Populate full help content identical to post-login modal
  renderAuthHelpContent();
}
applyAuthLang();
if(authLangBtn){ authLangBtn.onclick = ()=>{ const next = (currentLang==='ro')? 'en':'ro'; if(typeof setLang==='function'){ setLang(next); } else { window.currentLang = next; localStorage.setItem('calendar-lang', next); } applyAuthLang(); } }

// Remember username
try {
  const savedUser = localStorage.getItem('calendar-remember-user')||'';
  if(savedUser && loginUser){ loginUser.value = savedUser; rememberUser.checked = true; rememberUser.setAttribute('aria-checked','true'); }
} catch(_){ }

// Keep aria-checked in sync for the toggle
if(rememberUser){
  rememberUser.addEventListener('change', ()=>{
    rememberUser.setAttribute('aria-checked', rememberUser.checked? 'true':'false');
  });
}

// Toggle password visibility (login + register)
function wirePassToggle(btn, input){
  if(!btn || !input) return;
  btn.addEventListener('click', ()=>{
    const tr = translations[currentLang]?.auth;
    const isText = input.getAttribute('type') === 'text';
    input.setAttribute('type', isText ? 'password':'text');
    btn.setAttribute('aria-pressed', (!isText).toString());
    // icon swap
    const icon = btn.querySelector('.material-symbols-outlined');
    if(icon) icon.textContent = isText ? 'visibility' : 'visibility_off';
    // sr-only text + aria-label
    const txtShow = tr?.showPassword || 'Show password';
    const txtHide = tr?.hidePassword || 'Hide password';
    const sr = btn.querySelector('.sr-only'); if(sr) sr.textContent = isText ? txtShow : txtHide;
    btn.setAttribute('aria-label', isText ? txtShow : txtHide);
  });
}
wirePassToggle(showPassBtn, loginPass);
wirePassToggle(showRegPassBtn, document.getElementById('regPass'));

// LOGIN
loginForm.onsubmit = async e => {
  e.preventDefault();
  authError.textContent = ""; authError.style.display='none';
  const user = document.getElementById("loginUser").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;
  if (!user || !pass) return;
  try {
    const doc = await db.collection("users").doc(user).get();
    if (!doc.exists || doc.data().pass !== pass) {
      authError.textContent = (translations[currentLang]?.auth?.invalidCredentials) || "Username sau parolă incorecte!";
      authError.style.display='block';
      return;
    }
    // Salvează user info în sessionStorage (nu localStorage)
    sessionStorage.setItem("calendar-current-user", user);
    sessionStorage.setItem("calendar-current-name", doc.data().name);
    sessionStorage.setItem("calendar-current-surname", doc.data().surname);
    // Remember username if checked
    try { if(rememberUser && rememberUser.checked){ localStorage.setItem('calendar-remember-user', user); } else { localStorage.removeItem('calendar-remember-user'); } } catch(_){}
    window.location.href = "index.html";
  } catch (err) {
    authError.textContent = (translations[currentLang]?.auth?.loginError) || "Eroare la autentificare!";
    authError.style.display='block';
  }
};

// REGISTER
registerForm.onsubmit = async e => {
  e.preventDefault();
  regError.textContent = ""; regError.style.display='none';
  const name = document.getElementById("regName").value.trim();
  const surname = document.getElementById("regSurname").value.trim();
  const user = document.getElementById("regUser").value.trim().toLowerCase();
  const pass = document.getElementById("regPass").value;
  if (!name || !surname || !user || !pass) return;
  if (user.includes(" ")) {
    regError.textContent = (translations[currentLang]?.auth?.userSpacesError) || "Username-ul nu trebuie să conțină spații!";
    regError.style.display='block';
    return;
  }
  try {
    const doc = await db.collection("users").doc(user).get();
    if (doc.exists) {
      regError.textContent = (translations[currentLang]?.auth?.userExists) || "Username-ul există deja!";
      regError.style.display='block';
      return;
    }
    await db.collection("users").doc(user).set({
      name,
      surname,
      pass,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    regError.textContent = (translations[currentLang]?.auth?.registerSuccess) || "Cont creat! Te poți loga.";
    regError.style.display='block';
    setTimeout(() => showAuth(false), 1000);
  } catch (err) {
    regError.textContent = (translations[currentLang]?.auth?.registerError) || "Eroare la înregistrare!";
    regError.style.display='block';
  }
};

// Dacă există deja sesiune, redirecționează spre calendar
if (sessionStorage.getItem("calendar-current-user")) {
  window.location.href = "index.html";
}

// Help modal wiring
function openAuthHelp(){ if(!authHelpModal) return; authHelpModal.classList.remove('hidden'); authHelpModal.setAttribute('aria-hidden','false'); }
function closeAuthHelp(){ if(!authHelpModal) return; authHelpModal.classList.add('hidden'); authHelpModal.setAttribute('aria-hidden','true'); }
if(authHelpBtn) authHelpBtn.addEventListener('click', openAuthHelp);
if(authHelpClose) authHelpClose.addEventListener('click', closeAuthHelp);
if(authHelpModal) authHelpModal.addEventListener('click', (e)=>{ if(e.target && (e.target === authHelpModal || e.target.getAttribute('data-close')==='true')) closeAuthHelp(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeAuthHelp(); });

function renderAuthHelpContent(){
  if(!authHelpContent) return;
  const lang = window.currentLang || 'ro';
  const TR = window.translations[lang] || window.translations['ro'];
  const H = TR.help || {}; const S = H.sections || {};
  authHelpContent.innerHTML = `
    <nav class="help-toc" aria-label="${H.title||'Help'}">
      ${['intro','quickStart','actionBar','dayModes','multiselect','profile','team','exports','settings','shortcuts','faq'].map(key=> (H.toc&&H.toc[key])? `<a href="#help-${key}"><span class="material-icons">bookmark</span>${H.toc[key]}</a>`:'').join('')}
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
    ${S.daymodes? `<div class="help-section"><div class="help-media"><span class="material-icons">toggle_on</span></div><div class="help-text"><h4>${S.daymodes.title}</h4><div class="help-grid">${(S.daymodes.items||[]).map(it=>`<div class="help-card"><span class="material-icons">check_circle</span><div><div style=\"font-weight:600;\">${it.title}</div><div>${it.desc}</div></div></div>`).join('')}</div></div></div>`:''}
    ${S.actionbar? `<div class="help-section" id="help-actionBar"><div class="help-media"><span class="material-icons">view_week</span></div><div class="help-text"><h4>${S.actionbar.title}</h4><div class="help-grid">${(S.actionbar.items||[]).map(it=>`<div class="help-card"><span class="material-icons">${it.icon||'info'}</span><div><div style=\"font-weight:600;\">${it.title}</div><div>${it.desc||''}</div></div></div>`).join('')}</div></div></div>`:''}
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
    ${S.faq? `<div class="help-section" id="help-faq"><div class="help-media"><span class="material-icons">quiz</span></div><div class="help-text"><h4>${S.faq.title}</h4>${Array.isArray(S.faq.qas)? S.faq.qas.map(qa=>`<div class="help-card"><span class="material-icons">help_outline</span><div><div style=\"font-weight:600;\">${qa.q}</div><div>${qa.a}</div></div></div>`).join(''): ''}</div></div>`:''}
  `;
}
