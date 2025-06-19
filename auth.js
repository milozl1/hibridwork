// auth.js - gestionare login/înregistrare cu Firestore
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const authError = document.getElementById("authError");
const regError = document.getElementById("regError");

function showAuth(showReg = false) {
  loginForm.style.display = showReg ? "none" : "block";
  registerForm.style.display = showReg ? "block" : "none";
}
showRegister.onclick = () => showAuth(true);
showLogin.onclick = () => showAuth(false);

// LOGIN
loginForm.onsubmit = async e => {
  e.preventDefault();
  authError.textContent = "";
  const user = document.getElementById("loginUser").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;
  if (!user || !pass) return;
  try {
    const doc = await db.collection("users").doc(user).get();
    if (!doc.exists || doc.data().pass !== pass) {
      authError.textContent = "Username sau parolă incorecte!";
      return;
    }
    // Salvează user info în sessionStorage (nu localStorage)
    sessionStorage.setItem("calendar-current-user", user);
    sessionStorage.setItem("calendar-current-name", doc.data().name);
    sessionStorage.setItem("calendar-current-surname", doc.data().surname);
    window.location.href = "index.html";
  } catch (err) {
    authError.textContent = "Eroare la autentificare!";
  }
};

// REGISTER
registerForm.onsubmit = async e => {
  e.preventDefault();
  regError.textContent = "";
  const name = document.getElementById("regName").value.trim();
  const surname = document.getElementById("regSurname").value.trim();
  const user = document.getElementById("regUser").value.trim().toLowerCase();
  const pass = document.getElementById("regPass").value;
  if (!name || !surname || !user || !pass) return;
  if (user.includes(" ")) {
    regError.textContent = "Username-ul nu trebuie să conțină spații!";
    return;
  }
  try {
    const doc = await db.collection("users").doc(user).get();
    if (doc.exists) {
      regError.textContent = "Username-ul există deja!";
      return;
    }
    await db.collection("users").doc(user).set({
      name,
      surname,
      pass,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    regError.textContent = "Cont creat! Te poți loga.";
    setTimeout(() => showAuth(false), 1000);
  } catch (err) {
    regError.textContent = "Eroare la înregistrare!";
  }
};

// Dacă există deja sesiune, redirecționează spre calendar
if (sessionStorage.getItem("calendar-current-user")) {
  window.location.href = "index.html";
}
