// dataService.js - Firestore abstraction + in-memory cache (Sprint A)
(function(){
  if(typeof firebase === 'undefined') { console.warn('[dataService] Firebase not yet loaded at module parse'); }
  const writeQueue = [];
  let flushing = false;
  const cache = {}; // key: user_year_month -> selections array
  function key(user, y, m){ return `${user}_${y}_${m}`; }
  function initDb(){
    if(!firebase.apps.length){
      // assume config already declared elsewhere; no re-init here
      return firebase.firestore();
    }
    return firebase.firestore();
  }
  function getDb(){ return initDb(); }
  async function loadUserMonth(user, y, m){
    const k = key(user,y,m);
    if(cache[k]) return cache[k];
    const db = getDb();
    const doc = await db.collection('calendars').doc(k).get();
    const sel = doc.exists ? (doc.data().selections||[]) : [];
    cache[k] = sel.slice();
    window.calendarStore && window.calendarStore.cacheSelections(user,y,m, sel);
    return sel.slice();
  }
  async function loadAllUsersMonth(y,m){
    const db = getDb();
    const snap = await db.collection('calendars').where('year','==',y).where('month','==',m).get();
    const data = {};
    snap.forEach(doc=>{ const d=doc.data(); data[d.user]=d.selections||[]; cache[key(d.user,y,m)] = (d.selections||[]).slice(); });
    return data;
  }
  function enqueueSave(user,y,m,selections, opts={}){
    writeQueue.push({user,y,m,selections:selections.slice(), opts});
    cache[key(user,y,m)] = selections.slice();
    scheduleFlush();
  }
  function scheduleFlush(){ if(flushing) return; setTimeout(flush, 80); }
  async function flush(){
    if(flushing) return; flushing = true;
    try {
      const db = getDb();
      while(writeQueue.length){
        const batchItems = writeQueue.splice(0, Math.min(5, writeQueue.length));
        // linear (could batch() later)
        for(const item of batchItems){
          const {user,y,m,selections} = item;
          await db.collection('calendars').doc(key(user,y,m)).set({ user, year:y, month:m, selections, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        }
      }
    } catch(e){ console.error('[dataService flush error]', e); }
    finally { flushing = false; }
  }
  function getPendingCount(){ return writeQueue.length; }
  window.dataService = { loadUserMonth, loadAllUsersMonth, enqueueSave, flush, getPendingCount };
})();
