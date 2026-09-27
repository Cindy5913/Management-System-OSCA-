// ============================================================
// ID MAKER — role-specific module: production queue,
// queue analytics/charts, and print-queue status controls.
// Loaded after app.js (shared core). All functions are global so
// cross-file calls from the core resolve at runtime.
// ============================================================

const ID_MAKER_QUEUE = (function(){
  var stages = ['Queued','In Production','Printed','In Transit'];
  // Seed demo queue with pre-sent applications (status already 'In Process' from prior staff action)
  return FULL_APPLICANTS
    .filter(function(a){ return a.status === 'In Process' || a.status === 'Verified' || a.status === 'ID Issued'; })
    .slice(0, 8)
    .map(function(a, i){
      return Object.assign({}, a, {
        printStatus: stages[i % stages.length],
        photo: a.photo || fallbackMedia(a.name),
        controlNo: 'CTL-' + a.id.replace('SCB-','')
      });
    });
})();

function closeQueueFilter(){
  document.getElementById('queue-filter-wrap')?.classList.remove('open');
}

function filterIdMakerQueue(q){
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(r=>{
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function filterQueueChip(btn,status){
  btn.closest('.filter-bar').querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(r=>{
    const st = r.dataset.printStatus || r.querySelector('.queue-status-badge')?.textContent || '';
    r.style.display = (status === 'all' || st === status) ? '' : 'none';
  });
}

function initIdMakerCharts(){
  var mod = document.getElementById('mod-id-maker-analytics');
  if(!mod || !mod.classList.contains('active')) return;
  initIdMakerStatusChart();
  initIdMakerDailyChart();
  initIdMakerInsightCharts();
  updateIdMakerAnalytics();
}

function initIdMakerDailyChart(){
  var ctx = mkCanvas('chart-idmaker-daily'); if(!ctx)return;
  var dailyData = [5, 8, 7, 9, 6, 4, 8];
  var labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  if(CHARTS['idmaker-daily']) CHARTS['idmaker-daily'].destroy();
  CHARTS['idmaker-daily'] = new Chart(ctx,{
    type:'bar',
    data:{labels:labels,datasets:[{label:'Files Exported',data:dailyData,backgroundColor:'rgba(37,99,235,0.65)',hoverBackgroundColor:C.primary,borderRadius:6,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TIP,callbacks:{label:c=>{return ' '+c.parsed.y+' files exported';}}}},scales:{x:{grid:{display:false},ticks:{color:C.text,font:{size:11}},barPercentage:0.6,categoryPercentage:0.6},y:{beginAtZero:true,grid:{color:C.grid,drawBorder:false},ticks:{color:C.text,font:{size:10},stepSize:2}}}}
  });
}

function initIdMakerQueue(){
  const tbody = document.getElementById('id-maker-queue-tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  const statuses = ['Queued','In Production','Printed','In Transit'];
  ID_MAKER_QUEUE.forEach(app=>{
    const tr = document.createElement('tr');
    tr.dataset.appId = app.id;
    tr.dataset.printStatus = app.printStatus;
    tr.dataset.brgy = app.barangay || '';
    const statusColors = { 'Queued':'var(--warning)', 'In Production':'var(--primary)', 'Printed':'var(--purple)', 'In Transit':'var(--success)' };
    const statusIcons = { 'Queued':'clock', 'In Production':'document', 'Printed':'checkmark', 'In Transit':'check-circle' };
    const curColor = statusColors[app.printStatus] || 'var(--text-muted)';
    const menuItems = statuses.map(function(s){
      const active = s === app.printStatus ? ' active' : '';
      return '<button type="button" class="qsd-option' + active + '" data-status="' + s + '" onclick="selectRowStatus(this,\'' + app.id + '\',\'' + s + '\')">' +
        '<span class="qsd-dot" style="background:' + statusColors[s] + '"></span>' + s + '</button>';
    }).join('');
    const triggerHTML = '<button type="button" class="qsd-trigger" onclick="toggleRowStatus(this,event)">' +
      '<span class="qsd-dot" style="background:' + curColor + '"></span>' +
      '<span class="qsd-label">' + app.printStatus + '</span>' +
      '<svg class="qsd-arrow" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4.5L6 7.5L9 4.5"/></svg>' +
      '</button>' +
      '<div class="qsd-menu">' + menuItems + '</div>';
    tr.innerHTML = [
      '<td class="col-check"><input type="checkbox" class="queue-check" data-id="' + app.id + '" onchange="updateBatchSelection()"></td>',
      '<td>',
      '  <div class="applicant-cell">',
      '    <span class="applicant-avatar" style="background:linear-gradient(135deg,#7140D8,#5C51E0)">' + (app.name||'--').slice(0,2).toUpperCase() + '</span>',
      '    <div class="applicant-info">',
      '      <span class="applicant-name">' + app.name + '</span>',
      '      <span class="applicant-id">' + app.id + '</span>',
      '    </div>',
      '  </div>',
      '</td>',
      '<td><span class="cell-text" style="font-family:var(--font-data);font-size:12px;letter-spacing:.3px">' + (app.controlNo || '—') + '</span></td>',
      '<td><span class="cell-text">' + app.barangay + '</span></td>',
      '<td><div class="row-status-select" data-app-id="' + app.id + '">' + triggerHTML + '</div></td>',
      '<td style="text-align:right;white-space:nowrap">',
      '  <button class="row-action always-visible btn--primary" style="font-size:12px;padding:5px 12px" onclick="openDigitalIssuance(\'' + app.id + '\')">View Form</button>',
      '</td>'
    ].join('\n');
    tbody.appendChild(tr);
  });

  populateQueueFilters();
  updateQueueTagCounts();
  updateFilterCounts();
  updateAlertCounts();
}

function initIdMakerStatusChart(){
  var ctx = mkCanvas('chart-idmaker-status'); if(!ctx)return;
  var counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(function(a){ if(counts[a.printStatus]!==undefined) counts[a.printStatus]++; });
  if(CHARTS['idmaker-status']) CHARTS['idmaker-status'].destroy();
  CHARTS['idmaker-status'] = new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Awaiting','In Production','Exported','Ready for Release'],
      datasets:[{data:[counts.Queued, counts['In Production'], counts.Printed, counts['In Transit']],backgroundColor:['#FDA4AF','#F43F5E','#BE123C','#9F1239'],borderColor:'#FFFFFF',borderWidth:2,hoverOffset:6}]
    },
    options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{...TIP,callbacks:{label:c=>{var t=counts.Queued+counts['In Production']+counts.Printed+counts['In Transit']; var pct=t?Math.round(c.parsed/t*100):0; return ' '+c.label+': '+c.parsed+' ('+pct+'%)';}}}}}
  });
}

function inlineStatusChange(appId, newStatus){
  var queueItem = ID_MAKER_QUEUE.find(function(a){ return a.id === appId; });
  if(queueItem){ queueItem.printStatus = newStatus; }

  var queueRow = document.querySelector('#id-maker-queue-tbody tr[data-app-id="'+appId+'"]');
  if(queueRow){ queueRow.dataset.printStatus = newStatus; }

  // When ID Maker marks as In Transit, update application status to Ready for Release
  if(newStatus === 'In Transit' && APP_DB[appId]){
    APP_DB[appId].status = 'Ready for Release';
    syncApplicationsTableBadge(appId, 'Ready for Release');
  }

  updateIdMakerKPIs();
  appendAudit(CURRENT_USER?.displayName || 'ID Maker', 'Status set to: ' + newStatus, CURRENT_ROLE);
  showToast('Status updated to "' + newStatus + '" for ' + (queueItem?.name || appId), 'success');

  const activeOpt = document.querySelector('.queue-filter-option.active');
  if(activeOpt){
    const filterStatus = activeOpt.dataset.filter;
    if(filterStatus !== 'all'){
      document.querySelectorAll('#id-maker-queue-tbody tr').forEach(r=>{
        r.style.display = (r.dataset.printStatus === filterStatus) ? '' : 'none';
      });
    }
  }
}

function queueBadgeClass(status){
  const map = {
    'Queued':'badge-pending',
    'In Production':'badge-review',
    'Printed':'badge-issued',
    'In Transit':'badge-approved',
    'Released':'badge-approved',
    'Rejected':'badge-rejected'
  };
  return map[status] || 'badge-review';
}

function selectQueueFilter(btn,status){
  document.querySelectorAll('.queue-filter-option').forEach(o=>o.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('queue-filter-label').textContent = btn.querySelector('.qfo-label').textContent;
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(r=>{
    r.style.display = (status === 'all' || r.dataset.printStatus === status) ? '' : 'none';
  });
  closeQueueFilter();
}

function selectRowStatus(opt, appId, newStatus){
  const root = opt.closest('.row-status-select');
  const statusColors = { 'Queued':'var(--warning)', 'In Production':'var(--primary)', 'Printed':'var(--purple)', 'In Transit':'var(--success)' };
  root.querySelector('.qsd-label').textContent = newStatus;
  root.querySelector('.qsd-trigger .qsd-dot').style.background = statusColors[newStatus] || 'var(--text-muted)';
  root.querySelectorAll('.qsd-option').forEach(o => o.classList.toggle('active', o.dataset.status === newStatus));
  root.classList.remove('open');
  inlineStatusChange(appId, newStatus);
}

function toggleQueueFilter(){
  document.getElementById('queue-filter-wrap').classList.toggle('open');
}

function toggleRowStatus(btn, event){
  event.stopPropagation();
  const root = btn.closest('.row-status-select');
  const wasOpen = root.classList.contains('open');
  document.querySelectorAll('.row-status-select.open').forEach(r => r.classList.remove('open'));
  if(!wasOpen) root.classList.add('open');
}

function updateFilterCounts(){
  const counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(a => { if(counts[a.printStatus] !== undefined) counts[a.printStatus]++; });
  const total = ID_MAKER_QUEUE.length;
  const allCount = document.getElementById('qf-count-all');
  const q = document.getElementById('qf-count-queued');
  const p = document.getElementById('qf-count-production');
  const pr = document.getElementById('qf-count-printed');
  const t = document.getElementById('qf-count-transit');
  if(allCount) allCount.textContent = total;
  if(q) q.textContent = counts.Queued;
  if(p) p.textContent = counts['In Production'];
  if(pr) pr.textContent = counts.Printed;
  if(t) t.textContent = counts['In Transit'];
}

/* ── Dashboard additions: barangay filter, quick tags, batch export ── */
function populateQueueFilters(){
  const sel = document.getElementById('queue-barangay-filter');
  if(!sel) return;
  const brgys = [];
  ID_MAKER_QUEUE.forEach(a => { if(a.barangay && brgys.indexOf(a.barangay) === -1) brgys.push(a.barangay); });
  brgys.sort();
  sel.innerHTML = '<option value="all">All Barangays / Districts</option>' +
    brgys.map(b => '<option value="' + b + '">' + b + '</option>').join('');
}

function filterQueueByBarangay(value){
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(function(r){
    const brgyFilterVisible = (value === 'all' || r.dataset.brgy === value);
    const tagFilterVisible = r.style.display !== 'none';
    r.style.display = (brgyFilterVisible && tagFilterVisible) ? '' : 'none';
  });
  updateQueueCheckedDisabled();
  updateBatchSelection();
}

function updateQueueTagCounts(){
  const counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(a => { if(counts[a.printStatus] !== undefined) counts[a.printStatus]++; });
  const map = { 'qt-queued': counts.Queued, 'qt-production': counts['In Production'], 'qt-printed': counts.Printed, 'qt-transit': counts['In Transit'] };
  Object.keys(map).forEach(function(id){
    const el = document.getElementById(id);
    if(el) el.textContent = map[id];
  });
}

function filterQueueByStatusTag(btn, status){
  const bar = btn.closest('.ops-toolbar');
  if(bar) bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(function(r){
    const tagOk = (status === 'all' || r.dataset.printStatus === status);
    const brgy = document.getElementById('queue-barangay-filter');
    const brgyOk = (!brgy || brgy.value === 'all' || r.dataset.brgy === brgy.value);
    r.style.display = (tagOk && brgyOk) ? '' : 'none';
  });
  updateQueueCheckedDisabled();
  updateBatchSelection();
}

function toggleSelectAllQueue(checked){
  document.querySelectorAll('#id-maker-queue-tbody tr').forEach(function(r){
    if(r.style.display !== 'none'){
      const cb = r.querySelector('.queue-check');
      if(cb) cb.checked = checked;
    }
  });
  updateBatchSelection();
}

function updateBatchSelection(){
  const checks = Array.prototype.slice.call(document.querySelectorAll('#id-maker-queue-tbody .queue-check'));
  const allQ = document.getElementById('select-all-queue');
  if(allQ){
    const visible = checks.filter(c => c.closest('tr').style.display !== 'none');
    allQ.checked = visible.length > 0 && visible.every(c => c.checked);
    allQ.indeterminate = !allQ.checked && visible.some(c => c.checked);
  }
  const selected = checks.filter(c => c.checked);
  const countEl = document.getElementById('batch-selected-count');
  if(countEl) countEl.textContent = selected.length + ' selected';
  const hasSel = selected.length > 0;
  const w = document.getElementById('btn-export-word');
  const p = document.getElementById('btn-export-pdf');
  if(w) w.disabled = !hasSel;
  if(p) p.disabled = !hasSel;
}

function updateQueueCheckedDisabled(){
  const checks = document.querySelectorAll('#id-maker-queue-tbody .queue-check');
  checks.forEach(function(c){
    const row = c.closest('tr');
    if(row){
      const hidden = row.style.display === 'none';
      c.disabled = hidden;
      if(hidden) c.checked = false;
    }
  });
}

function batchExport(format){
  const checks = Array.prototype.slice.call(document.querySelectorAll('#id-maker-queue-tbody .queue-check:checked'));
  const names = checks.map(c => {
    const row = c.closest('tr');
    return row ? (row.querySelector('.applicant-name')?.textContent || 'ID Card') : 'ID Card';
  });
  const label = format === 'word' ? 'Word (DOCX)' : 'PDF';
  showToast('Exported ' + checks.length + ' file(s) to ' + label + ': ' + names.join(', '), 'success');
  checks.forEach(c => { c.checked = false; });
  document.getElementById('select-all-queue') && (document.getElementById('select-all-queue').checked = false);
  updateBatchSelection();
}

function dismissSystemAlert(){
  const b = document.getElementById('system-alert-banner');
  if(b) b.style.display = 'none';
}

function updateAlertCounts(){
  const counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(a => { if(counts[a.printStatus] !== undefined) counts[a.printStatus]++; });
}

/* ── Queue Analytics additions: insights & optimization ── */
function initIdMakerInsightCharts(){
  initIdMakerPeakChart();
  initIdMakerErrorBreakdownChart();
  initIdMakerBrgySpeedChart();
  initIdMakerSLA();
  initIdMakerProductivity();
}

function initIdMakerPeakChart(){
  var ctx = mkCanvas('chart-idmaker-peak'); if(!ctx)return;
  var labels = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p'];
  var data = [2,5,9,14,18,12,7,10,16,21,15,8,5,3,1];
  if(CHARTS['idmaker-peak']) CHARTS['idmaker-peak'].destroy();
  CHARTS['idmaker-peak'] = new Chart(ctx,{
    type:'line',
    data:{labels:labels,datasets:[{label:'Files Generated',data:data,borderColor:C.primary,backgroundColor:'rgba(37,99,235,0.12)',fill:true,tension:.35,pointRadius:2,pointHoverRadius:4,borderWidth:2.5}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TIP,callbacks:{label:c=>{return ' '+c.parsed.y+' files';}}}},scales:{x:{grid:{display:false},ticks:{color:C.text,font:{size:10},maxRotation:0,autoSkip:true,maxTicksLimit:8}},y:{beginAtZero:true,grid:{color:C.grid,drawBorder:false},ticks:{color:C.text,font:{size:10},stepSize:5}}}}
  });
}

function initIdMakerErrorBreakdownChart(){
  var ctx = mkCanvas('chart-idmaker-errors'); if(!ctx)return;
  var labels = ['Address Overflow','Missing Photo','Data Mismatch'];
  var data = [1,1,2];
  var colors = ['#F43F5E', '#BE123C', '#9F1239'];
  if(CHARTS['idmaker-errors']) CHARTS['idmaker-errors'].destroy();
  CHARTS['idmaker-errors'] = new Chart(ctx,{
    type:'doughnut',
    data:{labels:labels,datasets:[{data:data,backgroundColor:colors,borderColor:'#FFFFFF',borderWidth:2,hoverOffset:4}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{display:false},tooltip:{...TIP,callbacks:{label:c=>{var t=data.reduce(function(a,b){return a+b;},0);var pct=t?Math.round(c.parsed/t*100):0;return ' '+c.label+': '+c.parsed+' ('+pct+'%)';}}}}}
  });
  const leg = document.getElementById('error-breakdown-legend');
  if(leg){
    leg.innerHTML = labels.map(function(l,i){
      return '<div style="display:flex;align-items:center;gap:7px;font-size:12.5px">' +
        '<span style="width:9px;height:9px;border-radius:50%;background:'+colors[i]+';flex-shrink:0"></span>' +
        '<span style="color:var(--text-secondary)">'+l+'</span>' +
        '<strong style="margin-left:auto">'+data[i]+'</strong></div>';
    }).join('');
  }
}

function initIdMakerBrgySpeedChart(){
  var ctx = mkCanvas('chart-idmaker-brgy-speed'); if(!ctx)return;
  var brgys = ['Barangay I (Poblacion)','Manghinao Proper','Santa Maria','San Diego','Aplaya','San Roque'];
  var mins = [1.6, 2.4, 3.1, 2.0, 1.9, 2.8];
  if(CHARTS['idmaker-brgy']) CHARTS['idmaker-brgy'].destroy();
  CHARTS['idmaker-brgy'] = new Chart(ctx,{
    type:'bar',
    data:{labels:brgys,datasets:[{label:'Avg Minutes',data:mins,backgroundColor:'rgba(37,99,235,0.7)',hoverBackgroundColor:C.primary,borderRadius:5}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TIP,callbacks:{label:c=>{return ' '+c.parsed.x+' min avg';}}}},scales:{x:{beginAtZero:true,grid:{color:C.grid,drawBorder:false},ticks:{color:C.text,font:{size:10}}},y:{grid:{display:false},ticks:{color:C.text,font:{size:11}}}}}
  });
}

function initIdMakerSLA(){
  const counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(a => { if(counts[a.printStatus] !== undefined) counts[a.printStatus]++; });
  const total = ID_MAKER_QUEUE.length;
  const onTime = counts.Printed + counts['In Transit'];
  const over24 = counts.Queued;
  const over48 = Math.max(0, Math.round(over24 * 0.5));
  setText('sla-24h', over24);
  setText('sla-48h', over48);
  setText('sla-on-time', onTime);
  setText('sla-total', total);
}

function initIdMakerProductivity(){
  const list = document.getElementById('productivity-list');
  if(!list) return;
  const rows = [
    { name:'Barangay I (Poblacion)', count:18, pct:100 },
    { name:'Manghinao Proper', count:12, pct:67 },
    { name:'Santa Maria', count:8, pct:44 }
  ];
  const total = rows.reduce(function(a,r){ return a + r.count; }, 0);
  list.innerHTML = rows.map(function(r){
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 6px">' +
      '<span style="width:30px;height:30px;border-radius:8px;background:var(--bg-alt);color:var(--text-muted);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0" title="Location"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:12.5px;font-weight:600;color:var(--text-primary)">'+r.name+'</div>' +
        '<div style="height:5px;background:var(--bg-alt);border-radius:var(--r-pill);margin-top:4px;overflow:hidden">' +
          '<div style="height:100%;width:'+r.pct+'%;background:linear-gradient(90deg,#BE123C,#F43F5E);border-radius:var(--r-pill)"></div>' +
        '</div>' +
      '</div>' +
      '<strong style="font-family:var(--font-data);font-size:13px;color:var(--text-primary)">'+r.count+' files</strong>' +
    '</div>';
  }).join('') +
    '<div style="margin-top:10px;padding:10px 12px;background:var(--bg-alt);border-radius:8px;font-size:12px;color:var(--text-muted);line-height:1.5">' +
      '<strong style="color:var(--text-primary)">Total Shift Output:</strong> '+total+' files generated by Jayrold' +
    '</div>';
}


function updateIdMakerAnalytics(){
  var mod = document.getElementById('mod-id-maker-analytics');
  if(!mod || !mod.classList.contains('active')) return;

  var counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(function(a){ if(counts[a.printStatus]!==undefined) counts[a.printStatus]++; });

  var awaiting = document.getElementById('idm-awaiting-count');
  var production = document.getElementById('idm-production-count');
  var completed = document.getElementById('idm-completed-count');
  var transit = document.getElementById('idm-transit-count');

  if(awaiting) awaiting.textContent = counts.Queued.toLocaleString();
  if(production) production.textContent = counts['In Production'].toLocaleString();
  if(completed) completed.textContent = counts.Printed.toLocaleString();
  if(transit) transit.textContent = counts['In Transit'].toLocaleString();

  initIdMakerStatusChart();
  initIdMakerDailyChart();
  initIdMakerSLA();
}

function updateIdMakerKPIs(){
  const counts = { Queued:0, 'In Production':0, Printed:0, 'In Transit':0 };
  ID_MAKER_QUEUE.forEach(a => { if(counts[a.printStatus] !== undefined) counts[a.printStatus]++; });
  const cards = document.querySelectorAll('#mod-id-maker-dashboard .stat-card');
  if(cards[0]) cards[0].querySelector('.stat-card__value').textContent = counts.Queued;
  if(cards[1]) cards[1].querySelector('.stat-card__value').textContent = counts['In Production'];
  if(cards[2]) cards[2].querySelector('.stat-card__value').textContent = counts.Printed;
  if(cards[3])   cards[3].querySelector('.stat-card__value').textContent = counts['In Transit'];
  updateFilterCounts();
  updateQueueTagCounts();
  updateAlertCounts();
  if(typeof updateIdMakerAnalytics === 'function') updateIdMakerAnalytics();
}

document.addEventListener('click',function(e){
  if(!e.target.closest('.queue-filter-dropdown')) closeQueueFilter();
});

document.addEventListener('click', () => document.querySelectorAll('.row-status-select.open').forEach(r => r.classList.remove('open')));
