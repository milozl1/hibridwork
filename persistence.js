// Firestore persistence layer (Sprint 2 - step 1)
// Exposes: window.db, saveSelectionsToDB, loadSelectionsFromDB, loadAllSelectionsFromDB
(function(){
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
  function saveSelectionsToDB(user, year, month, selections) {
    return db.collection("calendars")
      .doc(`${user}_${year}_${month}`)
      .set({ user, year, month, selections, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
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
        snapshot.forEach(doc => { data[doc.data().user] = doc.data().selections; });
        return data;
      });
  }
  window.db = db;
  window.saveSelectionsToDB = saveSelectionsToDB;
  window.loadSelectionsFromDB = loadSelectionsFromDB;
  window.loadAllSelectionsFromDB = loadAllSelectionsFromDB;
})();
