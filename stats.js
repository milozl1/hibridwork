// Stats & export module (Sprint 2 - step 2)
// Exposes: exportCSV, exportICS, buildStats (called from script.js)
(function(){
  function pad(n){ return n<10? '0'+n : ''+n; }
  function triggerDownload(filename, content, mime){
    const blob = new Blob([content], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 500);
  }
  function formatDateForExport(y,m,d){
    const df = localStorage.getItem('calendar-date-format') || 'yyyy-mm-dd';
    const map = { yyyy: y.toString(), mm: pad(m), dd: pad(d)};
    if(df==='dd.mm.yyyy') return `${map.dd}.${map.mm}.${map.yyyy}`;
    if(df==='mm/dd/yyyy') return `${map.mm}/${map.dd}/${map.yyyy}`;
    return `${map.yyyy}-${map.mm}-${map.dd}`;
  }
  function getCurrentDate(){ return (window.calendarStore && window.calendarStore.getState().currentDate) || new Date(); }
  function exportCSV(dateObj){
    const cd = dateObj || getCurrentDate();
    const year = cd.getFullYear();
    const month = cd.getMonth();
    if(!window.dataService){ console.warn('dataService missing'); return; }
    window.dataService.loadAllUsersMonth(year, month).then(allSel => {
      const daysInMonth = new Date(year, month+1,0).getDate();
      const header = ['User', ...Array.from({length:daysInMonth},(_,i)=>formatDateForExport(year,month+1,i+1))];
      const rows = [header];
      Object.keys(allSel).sort().forEach(u=>{
        const arr = allSel[u];
        rows.push([ (window.getUserDisplayName? window.getUserDisplayName(u):u), ...Array.from({length:daysInMonth},(_,i)=>arr[i]||'')]);
      });
      const csv = rows.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
      triggerDownload(`calendar_${year}_${month+1}.csv`, csv, 'text/csv');
    });
  }
  // Export only Out of Office (vacation) days as all-day events suitable for Outlook/Teams.
  function exportICS(dateObj, user){
    const cd = dateObj || getCurrentDate();
    const year = cd.getFullYear();
    const month = cd.getMonth();
    if(!window.dataService){ console.warn('dataService missing'); return; }
    window.dataService.loadUserMonth(user, year, month).then(sel => {
      const daysInMonth = new Date(year, month+1,0).getDate();
      let ics = '';
      ics += 'BEGIN:VCALENDAR\n';
      ics += 'VERSION:2.0\n';
      ics += 'PRODID:-//HybridOffice//OutOfOffice//EN\n';
      ics += 'CALSCALE:GREGORIAN\n';
      ics += 'METHOD:PUBLISH\n';
      ics += 'X-WR-CALNAME:Out of Office\n';
      const oooSummary = (window.translations && (window.translations[window.currentLang]||window.translations.ro).outOfOffice) || 'Out of Office';
      for(let d=1; d<=daysInMonth; d++){
        const val = sel[d-1];
        if(val !== 'vacation') continue; // Only create OOO for vacation days
        const dtStart = `${year}${pad(month+1)}${pad(d)}`;
        const nextDate = new Date(year, month, d); nextDate.setDate(nextDate.getDate()+1);
        const dtEnd = `${nextDate.getFullYear()}${pad(nextDate.getMonth()+1)}${pad(nextDate.getDate())}`;
        const uid = `${dtStart}-ooo-${user}@hybrid`;
        ics += 'BEGIN:VEVENT\n';
        ics += `UID:${uid}\n`;
        ics += `DTSTAMP:${dtStart}T080000Z\n`;
        ics += `DTSTART;VALUE=DATE:${dtStart}\n`;
        ics += `DTEND;VALUE=DATE:${dtEnd}\n`;
        ics += `SUMMARY:${oooSummary}\n`;
        // Outlook/Teams-friendly all-day Out of Office
        ics += 'TRANSP:OPAQUE\n';
        ics += 'CLASS:PUBLIC\n';
        ics += 'X-MICROSOFT-CDO-BUSYSTATUS:OOF\n';
        ics += 'X-MICROSOFT-CDO-INTENDEDSTATUS:OOF\n';
        ics += 'X-MICROSOFT-DISALLOW-COUNTER:TRUE\n';
        ics += 'CATEGORIES:Out of Office\n';
        ics += 'END:VEVENT\n';
      }
      ics += 'END:VCALENDAR';
      triggerDownload(`ooo_${year}_${month+1}.ics`, ics, 'text/calendar');
    });
  }
  function buildMonthlyStats(dateObj, user, requiredOfficeBase, maxHomeDays){
    const cd = dateObj || getCurrentDate();
    const year = cd.getFullYear();
    const month = cd.getMonth();
    const today = new Date();
    const statsContainer = document.getElementById('statsContainer');
    if(!statsContainer) return;
    if(!window.dataService){ console.warn('dataService missing'); return; }
    window.dataService.loadAllUsersMonth(year, month).then(allSelections => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startIdx = (()=>{
        let idx = (today.getMonth()===month && today.getFullYear()===year) ? today.getDate()-1 : 0;
        const dayOfWeek = (new Date(year, month, idx+1).getDay() + 6) % 7;
        if(dayOfWeek===5) idx += 2; // Sat -> Mon
        if(dayOfWeek===6) idx += 1; // Sun -> Mon
        return Math.max(0, idx);
      })();
      const endIdx = Math.min(daysInMonth-1, startIdx + 20);
      const prezentaPeZi = Array(daysInMonth).fill(0);
      Object.values(allSelections).forEach(sel=>{ for(let i=0;i<daysInMonth;i++){ if(sel[i]==='office') prezentaPeZi[i]++; }});
      const topZile = prezentaPeZi.map((v,i)=>({zi:i+1,v}))
        .filter(z=> z.zi-1>=startIdx && z.zi-1<=endIdx)
        .sort((a,b)=> b.v - a.v || a.zi - b.zi)
        .slice(0,3);
      const pragSocial = Math.max(2, Math.floor(Object.keys(allSelections).length/2));
      let zileSociale = prezentaPeZi.map((v,i)=> (i>=startIdx && i<=endIdx && v>=pragSocial)? (i+1): null).filter(Boolean);
      if(zileSociale.length>2){
        zileSociale = zileSociale.map(zi=>({zi, v: prezentaPeZi[zi-1]})).sort((a,b)=> b.v - a.v || a.zi - b.zi).slice(0,2).map(o=>o.zi);
      }
      window.dataService.loadUserMonth(user, year, month).then(mySel=>{
        let legalHolidaysWorkdays = 0; for(let d=1; d<=daysInMonth; d++){ const ds = `${year}-${pad(month+1)}-${pad(d)}`; const dateObj=new Date(year,month,d); if(dateObj.getDay()!==0 && dateObj.getDay()!==6 && window.holidaysRO && window.holidaysRO[ds]) legalHolidaysWorkdays++; }
        let zileOffice=0, zileHome=0, zileVac=0, ratariSocial=[];
        for(let i=0;i<daysInMonth;i++){
          if(mySel[i]==='office'){ zileOffice++; }
          if(mySel[i]==='home'){ zileHome++; }
            if(mySel[i]==='vacation'){ zileVac++; }
          if(i>=startIdx && i<=endIdx && prezentaPeZi[i]>=pragSocial && mySel[i]!=='office') ratariSocial.push(i+1);
        }
    // Dynamic office requirement respects Max Home setting:
    // required = Working weekdays - Max Home - Vacation - Legal holidays (on workdays)
    let workingWeekdays = 0; for(let d=1; d<=daysInMonth; d++){ const dow=new Date(year,month,d).getDay(); if(dow!==0 && dow!==6) workingWeekdays++; }
    const dynamicOfficeTarget = Math.max(0, workingWeekdays - maxHomeDays - zileVac - legalHolidaysWorkdays);
    const zileOfficeRamase = Math.max(0, dynamicOfficeTarget - zileOffice);
        const translations = window.translations[window.currentLang] || window.translations.ro;
        const sugestie = zileSociale.length ? `${translations.socialize} <b>${zileSociale.join(', ')}</b>.` : translations.noHighPresence;
        // KPI quick metrics
        const kpiTarget = dynamicOfficeTarget;
        const kpiCompleted = zileOffice;
        const kpiRemaining = zileOfficeRamase;
        // Pace & ETA (only meaningful for current month)
        let kpiPace = null, kpiEta = null;
        if(today.getFullYear()===year && today.getMonth()===month){
          let pastWorkingDays = 0;
          for(let d=1; d<=Math.min(today.getDate(), daysInMonth); d++){
            const dow = new Date(year, month, d).getDay();
            if(dow!==0 && dow!==6) pastWorkingDays++;
          }
          if(pastWorkingDays>0){
            kpiPace = zileOffice / pastWorkingDays; // office days per working day
            // Estimate day index when target reached
            if(kpiPace>0){
              const needed = Math.max(0, kpiTarget - zileOffice);
              const estWorkingDaysToGo = Math.ceil(needed / kpiPace);
              // Walk forward through the month counting working days
              let cnt=0, etaDay=null;
              for(let d=Math.min(today.getDate(), daysInMonth); d<=daysInMonth; d++){
                const dow=new Date(year,month,d).getDay();
                if(dow!==0 && dow!==6){ cnt++; }
                if(cnt>=estWorkingDaysToGo){ etaDay=d; break; }
              }
              kpiEta = etaDay;
            }
          }
        }

        // Weekday distribution (Mon..Sun)
        const weekdayLabels = (window.translations[window.currentLang]||window.translations.ro).weekdaysShort;
        // Incoming weekdaysShort is Mon..Sun already
        const officeByWd = Array(7).fill(0), homeByWd = Array(7).fill(0), vacByWd = Array(7).fill(0);
        for(let d=1; d<=daysInMonth; d++){
          const jsDow = new Date(year, month, d).getDay(); // 0=Sun..6=Sat
          const wd = (jsDow+6)%7; // 0=Mon..6=Sun
          const v = mySel[d-1];
          if(v==='office') officeByWd[wd]++;
          else if(v==='home') homeByWd[wd]++;
          else if(v==='vacation') vacByWd[wd]++;
        }

        // Weekly distribution (S1..Sn in month)
        const firstDowOffset = ((new Date(year, month, 1).getDay()+6)%7); // 0=Mon offset
        const weeksCount = Math.ceil((firstDowOffset + daysInMonth)/7);
        const officeByWk = Array(weeksCount).fill(0), homeByWk = Array(weeksCount).fill(0), vacByWk = Array(weeksCount).fill(0);
        for(let d=1; d<=daysInMonth; d++){
          const weekIdx = Math.floor((firstDowOffset + (d-1))/7);
          const v = mySel[d-1];
          if(v==='office') officeByWk[weekIdx]++;
          else if(v==='home') homeByWk[weekIdx]++;
          else if(v==='vacation') vacByWk[weekIdx]++;
        }

        // Build UI
        const homeLeft = Math.max(0, maxHomeDays - zileHome);
        statsContainer.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:12px;">
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('adjustedShort')}</div>
              <div style="font-size:22px;font-weight:700;">${kpiTarget}</div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('officeRequiredDynamicTip')}</div>
            </div>
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('completed')}</div>
              <div style="font-size:22px;font-weight:700;">${kpiCompleted}</div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('completedTip')}</div>
            </div>
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('remaining')}</div>
              <div style="font-size:22px;font-weight:700;">${kpiRemaining}</div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('remainingTip')}</div>
            </div>
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('homeRemaining')}</div>
              <div style="font-size:22px;font-weight:700;">${homeLeft} <span style="font-size:12px;color:#5b5f7a;">${window.t('daysHomeOf')} ${maxHomeDays}</span></div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('homeDaysRemainingTip')}</div>
            </div>
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('pace')}</div>
              <div style="font-size:22px;font-weight:700;">${kpiPace!=null? kpiPace.toFixed(2): '—'}<span style="font-size:12px;color:#5b5f7a;">${kpiPace!=null? window.t('paceUnit'): ''}</span></div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('paceTip')}</div>
            </div>
            <div style="background:#f7f9fc;border-radius:12px;padding:10px 12px;">
              <div style="font-size:12px;color:#5b5f7a;">${window.t('etaLabel')}</div>
              <div style="font-size:22px;font-weight:700;">${kpiEta? kpiEta : '—'}</div>
              <div style="font-size:12px;color:#5b5f7a;">${window.t('etaTip')}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
            <div style="background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 2px 8px #0000000f;">
              <div style="font-weight:600;margin-bottom:8px;">${window.t('distribution')}</div>
              <canvas id="statsDonut" height="170"></canvas>
            </div>
            <div style="background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 2px 8px #0000000f;">
              <div style="font-weight:600;margin-bottom:8px;">${window.t('distribution')} • ${window.t('week')||'Week'}</div>
              <canvas id="statsWeekday" height="170"></canvas>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:12px;">
            <div style="background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 2px 8px #0000000f;">
              <div style="font-weight:600;margin-bottom:8px;">${window.t('distribution')} • ${(window.currentLang==='ro'?'Săptămâni':'Weeks')}</div>
              <canvas id="statsWeekly" height="170"></canvas>
            </div>
            <div style="background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 2px 8px #0000000f;">
              <div style="font-weight:600;margin-bottom:8px;">${window.t('advancedDetails')}</div>
              <div id="insightsCard" style="font-size:14px;line-height:1.5;"></div>
            </div>
          </div>

          <div style="margin-top:12px;font-size:15px;">
            <b>${translations.top3Presence}</b><br>
            <ul style='margin:4px 0 10px 18px;'>
              ${topZile.map(z=>`<li>${translations.day} ${z.zi}: <b>${z.v}</b> ${translations.colleagues}${mySel[z.zi-1]==='office'? ` <span style='color:green'>(${translations.present})</span>` : ` <span style='color:#888'>(${translations.absent})</span>`}</li>`).join('')}
            </ul>
            <b>${translations.highPresenceDays}</b> ${ratariSocial.length ? ratariSocial.join(', ') : translations.none}<br>
            <b>${translations.socialSuggestion}</b> ${sugestie}<br>
          </div>`;

        // Donut chart
        const donutCtx = document.getElementById('statsDonut').getContext('2d');
        new Chart(donutCtx, {
          type:'doughnut',
          data:{
            labels:[window.t('office'), window.t('home'), window.t('vacation')],
            datasets:[{
              data:[zileOffice, zileHome, zileVac],
              backgroundColor:['#6366f1','#10b981','#f59e0b'],
              borderWidth:0
            }]
          },
          options:{ plugins:{ legend:{ position:'bottom' } }, cutout:'60%'}
        });

        // Weekday stacked bar
        const wdCtx = document.getElementById('statsWeekday').getContext('2d');
        new Chart(wdCtx, {
          type:'bar',
          data:{
            labels: weekdayLabels,
            datasets:[
              { label: window.t('office'), data: officeByWd, backgroundColor:'#6366f1', stack:'stack1', borderRadius:6 },
              { label: window.t('home'), data: homeByWd, backgroundColor:'#10b981', stack:'stack1', borderRadius:6 },
              { label: window.t('vacation'), data: vacByWd, backgroundColor:'#f59e0b', stack:'stack1', borderRadius:6 }
            ]
          },
          options:{
            plugins:{ legend:{ position:'bottom' } },
            scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true, ticks:{ precision:0 } } }
          }
        });

        // Weekly stacked bar
        const wkCtx = document.getElementById('statsWeekly').getContext('2d');
        const weekLabels = Array.from({length:weeksCount}, (_,i)=> (window.currentLang==='ro'? `S${i+1}` : `W${i+1}`));
        new Chart(wkCtx, {
          type:'bar',
          data:{
            labels: weekLabels,
            datasets:[
              { label: window.t('office'), data: officeByWk, backgroundColor:'#6366f1', stack:'wk', borderRadius:6 },
              { label: window.t('home'), data: homeByWk, backgroundColor:'#10b981', stack:'wk', borderRadius:6 },
              { label: window.t('vacation'), data: vacByWk, backgroundColor:'#f59e0b', stack:'wk', borderRadius:6 }
            ]
          },
          options:{ plugins:{ legend:{ position:'bottom' } }, scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true, ticks:{ precision:0 } } } }
        });

        // Insights (alerts & recommendations)
        const insights = [];
        const lang = window.currentLang || 'ro';
        const ttxt = (ro,en)=> (lang==='ro'? ro : en);
        if(zileHome > maxHomeDays){
          insights.push(`<span style='color:#dc2626;font-weight:600;'>${ttxt('Home depășit', 'Home exceeded')}</span>: ${ttxt('cu', 'by')} <b>${zileHome - maxHomeDays}</b>.`);
        }
        if(zileOffice >= kpiTarget){
          insights.push(`<span style='color:#16a34a;font-weight:600;'>${window.t('goalMet')}</span>`);
        } else if(kpiPace==null){
          insights.push(`${window.t('noPaceData')}`);
        } else {
          let remWD = 0;
          if(today.getFullYear()===year && today.getMonth()===month){
            for(let d=Math.min(today.getDate(), daysInMonth); d<=daysInMonth; d++){
              const dow=new Date(year,month,d).getDay(); if(dow!==0 && dow!==6) remWD++;
            }
          } else {
            for(let d=1; d<=daysInMonth; d++){ const dow=new Date(year,month,d).getDay(); if(dow!==0 && dow!==6) remWD++; }
          }
          const canDoAtPace = Math.floor(kpiPace * remWD);
          const shortfall = Math.max(0, kpiRemaining - canDoAtPace);
          if(shortfall>0){
            insights.push(`<span style='color:#d97706;font-weight:600;'>${ttxt('Ritmul curent ratează ținta', 'Current pace will miss target')}</span>: ${ttxt('mai ai nevoie de ~', 'need ~')}<b>${shortfall}</b> ${ttxt('zile Office', 'Office days')}.`);
          } else {
            insights.push(`<span style='color:#16a34a;font-weight:600;'>${ttxt('Ești pe grafic', 'On track')}</span>: ${ttxt('vei atinge ținta la ritmul actual', 'you will reach the target at current pace')}.`);
          }
        }
        if(zileSociale && zileSociale.length){
          insights.push(`${ttxt('Recomandare', 'Recommendation')}: ${ttxt('planifică Office în zilele', 'plan Office on')}: <b>${zileSociale.join(', ')}</b>.`);
        } else if(kpiRemaining>0){
          insights.push(`${ttxt('Planifică încă', 'Plan another')} <b>${kpiRemaining}</b> ${ttxt('zile Office în această lună', 'Office days this month')}.`);
        }
        const insightsEl = document.getElementById('insightsCard');
        if(insightsEl){ insightsEl.innerHTML = `<ul style="margin:6px 0 0 18px;">${insights.map(i=>`<li>${i}</li>`).join('')}</ul>`; }
      });
    });
  }
  window.buildMonthlyStats = buildMonthlyStats;
  window.exportCSV = exportCSV;
  window.exportICS = exportICS;
})();
