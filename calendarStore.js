// calendarStore.js - central state store (Sprint A)
(function(){
  const listeners = new Set();
  const state = {
    user: null,
    currentDate: new Date(),
    filter: { type: '', user: '' },
    preferences: {},
    selectionsCache: {}, // key: user_year_month -> array
    modelSnapshot: null
  };
  function notify(){ listeners.forEach(l=>{ try { l({...state}); } catch(e){ console.error('[store listener error]', e);} }); }
  function set(patch){ Object.assign(state, patch); notify(); }
  function setNested(key, patch){ if(state[key] && typeof state[key]==='object'){ Object.assign(state[key], patch); notify(); } }
  function get(){ return {...state}; }
  function subscribe(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
  function monthKey(year, month){ return `${year}-${month}`; }
  function setUser(user){ state.user = user; notify(); }
  function setCurrentDate(date){ state.currentDate = date; notify(); }
  function cacheSelections(user, year, month, arr){ state.selectionsCache[`${user}_${year}_${month}`] = arr.slice(); }
  function getCachedSelections(user, year, month){ return state.selectionsCache[`${user}_${year}_${month}`]; }
  window.calendarStore = { getState:get, set, setNested, subscribe, setUser, setCurrentDate, cacheSelections, getCachedSelections, monthKey };
})();
