// diffEngine.js - responsible for building calendar model + diffing (Sprint A)
(function(){
  function buildModel(opts){
  const { date, savedSelections, filteredSelections, holidays, customHolidays, currentLang, selectionMode, teamView, filter, t, isWeekend, dateStr, getUserDisplayName, getUserInitials } = opts;
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const model = { year, month, lang: currentLang, selectionMode, teamView: !!teamView, filter:{...filter}, daysInMonth, days: [] };
    for(let d=1; d<=daysInMonth; d++){
      const dateObj = new Date(year, month, d);
      const weekend = isWeekend(dateObj);
      const ds = dateStr(year, month+1, d);
      const holidayName = holidays[ds] || customHolidays[ds] || '';
      const selValue = savedSelections[d-1] || (holidayName? 'office':'');
  let usersAtOffice = [];
      if(teamView && !weekend && !holidayName){
        for(const [u, sel] of Object.entries(filteredSelections||{})){
          if(sel && sel[d-1] === 'office') usersAtOffice.push(u);
        }
      }
  const membershipKey = usersAtOffice.length ? usersAtOffice.slice().sort().join('|') : '';
  model.days.push({ d, idx:d-1, weekend, holiday: !!holidayName, holidayName, value: selValue, usersAtOfficeCount: usersAtOffice.length, usersAtOffice, membershipKey });
    }
    return model;
  }
  function canPatch(prevModel, nextModel){
    if(!prevModel) return false;
    const keys = ['year','month','lang','selectionMode','teamView'];
    for(const k of keys){ if(prevModel[k] !== nextModel[k]) return false; }
    if(nextModel.filter.type || nextModel.filter.user) return false;
    // Allow patch for team view too if same month/year & no filters (we'll only update changed cells lightweight)
    return true;
  }
  function diff(prevModel, nextModel){
    if(!canPatch(prevModel, nextModel)) return null;
    const changes = [];
    nextModel.days.forEach(d=>{
      const prev = prevModel.days[d.idx];
      if(!prev) { changes.push(d); return; }
      // For team view track differences in usersAtOfficeCount (affects badge + classes)
      if(nextModel.teamView){
        if(prev.usersAtOfficeCount !== d.usersAtOfficeCount || prev.membershipKey !== d.membershipKey){ changes.push(d); return; }
      } else {
        if(prev.value !== d.value || prev.holiday!==d.holiday){ changes.push(d); return; }
      }
    });
    return { type:'patch', changes };
  }
  function applyPatch(patch, rootEl, helpers){
    if(!patch || patch.type!=='patch') return;
    const { applyVisualState, t, model } = helpers;
    patch.changes.forEach(day=>{
      const cell = rootEl.querySelector(`.day[data-idx='${day.idx}']`);
      if(!cell) return;
      if(model.teamView){
        // Ensure presence badge exists/updated and reflects density level based on filtered users count
        let badge = cell.querySelector('.presence-badge');
        if(day.usersAtOfficeCount > 0){
          if(!badge){
            badge = document.createElement('span');
            badge.className = 'presence-badge';
            cell.appendChild(badge);
          }
          const totalUsers = (helpers.allUsersCount)||0;
          const ratio = totalUsers? (day.usersAtOfficeCount/totalUsers) : 0;
          let level = 'level-low'; if(ratio>=0.66) level='level-high'; else if(ratio>=0.34) level='level-mid';
          badge.classList.remove('level-low','level-mid','level-high');
          badge.classList.add(level);
          badge.textContent = day.usersAtOfficeCount;
          badge.title = `${t('totalAtOffice')}: ${day.usersAtOfficeCount}`;
        } else {
          if(badge) badge.remove();
        }
        cell.classList.remove('office-majority','office-none','office-mixed');
        const totalUsers = (helpers.allUsersCount)||0;
        if(day.usersAtOfficeCount > totalUsers/2) cell.classList.add('office-majority');
        else if(day.usersAtOfficeCount===0) cell.classList.add('office-none');
        else cell.classList.add('office-mixed');

        // Update avatars list
        let teamWrap = cell.querySelector('.team-users');
        if(!teamWrap){
          teamWrap = document.createElement('div');
          teamWrap.className = 'team-users';
          cell.appendChild(teamWrap);
        }
        // Rebuild avatars safely
        teamWrap.innerHTML = '';
        (day.usersAtOffice||[]).forEach(u=>{
          const displayName = (helpers.getUserDisplayName? helpers.getUserDisplayName(u) : u);
          const initials = (helpers.getUserInitials? helpers.getUserInitials(u) : (u[0]||'?').toUpperCase());
          const span = document.createElement('span');
          span.className = 'avatar-initial';
          span.setAttribute('aria-label', displayName);
          span.dataset.user = u;
          // Keep color stable if helper unavailable
          try { span.style.background = (helpers.stringToColor? helpers.stringToColor(u) : '#e2e8f0'); } catch(_) {}
          span.textContent = initials;
          // Lightweight tooltip handlers (match full build)
          span.onmouseenter = e=>{
            const old=document.getElementById('bulinaTip'); if(old) old.remove();
            const tip=document.createElement('div'); tip.id='bulinaTip'; tip.className='avatar-tooltip'; tip.textContent=displayName; tip.style.left=(e.clientX+10)+"px"; tip.style.top=(e.clientY+10)+"px"; document.body.appendChild(tip);
          };
          span.onmouseleave = ()=>{ const tip=document.getElementById('bulinaTip'); if(tip) tip.remove(); };
          teamWrap.appendChild(span);
        });

        // Update capacity meter
        let meter = cell.querySelector('.capacity-meter');
        if(!meter){
          meter = document.createElement('div');
          meter.className = 'capacity-meter';
          const bar = document.createElement('div'); bar.className = 'capacity-bar'; meter.appendChild(bar);
          cell.appendChild(meter);
        }
  const MAX_SEATS = (helpers && helpers.maxSeats) ? helpers.maxSeats : 35;
        const used = day.usersAtOfficeCount || 0;
        const pct = Math.min(100, Math.round((used / MAX_SEATS) * 100));
        let capLevel = 'low'; if(pct >= 75) capLevel = 'high'; else if(pct >= 40) capLevel = 'mid';
        meter.setAttribute('data-level', capLevel);
        meter.setAttribute('role','img');
        meter.setAttribute('aria-label', `${t('capacity')}: ${used}/${MAX_SEATS} (${pct}%)`);
        meter.title = `${t('capacity')}: ${used}/${MAX_SEATS} (${pct}%)`;
        const barEl = meter.querySelector('.capacity-bar'); if(barEl) barEl.style.width = pct + '%';
        cell.classList.add('has-capacity');
        cell.dataset.userCount = String(used);

        // Rebind click to show updated list popup and update legend current bar
        cell.style.cursor = 'pointer';
        cell.onclick = (e)=>{
          const old=document.getElementById('dayUsersPopup'); if(old) old.remove();
          const popup=document.createElement('div'); popup.id='dayUsersPopup'; popup.className='popup-day-users'; popup.style.left=(e.clientX+10)+"px"; popup.style.top=(e.clientY+10)+"px";
          popup.innerHTML=`<div class='popup-day-users__header'><b>${t('day')} ${day.d}</b><button id='closeDayUsersPopup' class='popup-close-btn' aria-label='Close'>&times;</button></div>`;
          if(!day.usersAtOfficeCount){
            const empty = document.createElement('div'); empty.style.color = '#888'; empty.textContent = t('noColleagues'); popup.appendChild(empty);
          } else {
            const list = document.createElement('ul');
            (day.usersAtOffice||[]).forEach(u=>{ const li=document.createElement('li'); li.textContent = (helpers.getUserDisplayName? helpers.getUserDisplayName(u): u); list.appendChild(li); });
            popup.appendChild(list);
          }
          document.body.appendChild(popup);
          const closeBtn = document.getElementById('closeDayUsersPopup'); if(closeBtn) closeBtn.onclick = ()=> popup.remove();
          setTimeout(()=>{ document.addEventListener('mousedown', function handler(ev){ if(!popup.contains(ev.target)){ popup.remove(); document.removeEventListener('mousedown', handler);} });},10);
          // Update capacity legend current bar/label (if present)
          const wrap = document.getElementById('capacityLegend');
          if(wrap){
            const bar = wrap.querySelector('.cap-legend-current-bar span');
            const lbl = wrap.querySelector('.cap-legend-current-label');
            if(bar) bar.style.width = pct + '%';
            if(lbl) lbl.textContent = `${used}/${MAX_SEATS} (${pct}%)`;
          }
        };
      } else {
        applyVisualState(cell, day.value);
        const selEl = cell.querySelector('select'); if(selEl && !selEl.disabled) selEl.value = day.value;
        let ariaLabel = `${day.d} ${t('monthsFull')[model.month]} ${model.year}`;
        if(day.holiday && day.holidayName) ariaLabel += ` – ${day.holidayName}`;
        if(day.value) ariaLabel += ` – ${t(day.value)}`;
        cell.setAttribute('aria-label', ariaLabel);
        cell.setAttribute('aria-selected', day.value? 'true':'false');
      }
    });
  }
  window.diffEngine = { buildModel, diff, applyPatch, canPatch };
})();
