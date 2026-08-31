
/* ============================================================
   Existing JS from your last file (kept) + NEW JS for features:
   - RBAC (role switching)
   - Application detail modal workflow + docs verification + audit log
   - AI flags (duplicate detection demo)
   - Exports & scheduling (demo)
============================================================ */

/* ── Chart palette + chart init from your previous code (kept) ── */
const C = {
  primary: '#2563EB',
  primaryMid: '#3B82F6',
  primaryFade: 'rgba(37,99,235,0.12)',
  green: '#059669',
  greenFade: 'rgba(5,150,105,0.1)',
  red: '#E11D48',
  redFade: 'rgba(225,29,72,0.08)',
  amber: '#D97706',
  amberFade: 'rgba(217,119,6,0.12)',
  purple: '#6B5BD1',
  purpleFade: 'rgba(107,91,209,0.1)',
  teal: '#0D8C8C',
  rose: '#E11D48',
  grid: 'rgba(226,232,240,0.7)',
  text: '#64748B',
  tooltip: 'rgba(15,23,42,0.94)',
};
if (typeof Chart !== 'undefined') {
  try {
    Chart.defaults.font.family = "'Space Grotesk', system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = C.text;
  } catch (_err) { /* chart defaults are non-critical */ }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ANALYTICS_DATA = {
  Admin: {
    scopeLabel: 'Admin Scope',
    title: 'Analytics',
    subtitle: 'Municipality-wide data visualizations and performance insights',
    totalApplications: 12482,
    pending: 612,
    inReview: 231,
    pendingReview: 843,
    approved: 11204,
    rejected: 435,
    idsIssued: 7841,
    submitted: [820, 940, 880, 1020, 1100, 980, 1060, 1140, 1020, 1200, 1180, 1142],
    approvedMonthly: [740, 850, 790, 920, 990, 880, 950, 1020, 920, 1080, 1060, 1004],
    rejectedMonthly: [26, 28, 30, 32, 34, 35, 36, 38, 39, 42, 45, 50],
    barangayLabels: ['Aplaya', 'Santa Maria', 'Barangay I (Poblacion)', 'San Roque', 'San Diego', 'Manghinao Proper'],
    barangayTotal: [2458, 2110, 1840, 1604, 1220, 760],
    barangayApproved: [2204, 1892, 1650, 1440, 1094, 684],
    barangayPending: [166, 142, 124, 108, 82, 51],
    statusDenominator: 12482,
    issuance: [620, 1290, 2140, 3080, 4010, 4870, 5620, 6310, 6890, 7300, 7600, 7841],
    processing: [3.8, 3.4, 3.1, 2.9, 3.0, 2.8, 2.7, 2.6, 2.5, 2.5, 2.4, 2.4]
  },
  Staff: {
    scopeLabel: 'Staff Scope',
    title: 'Staff Analytics',
    subtitle: 'Assigned queue, review workload, and daily processing performance',
    totalApplications: 147,
    pending: 18,
    inReview: 11,
    pendingReview: 29,
    approved: 102,
    rejected: 16,
    idsIssued: 64,
    submitted: [8, 10, 9, 12, 13, 11, 12, 14, 13, 15, 15, 15],
    approvedMonthly: [6, 7, 6, 8, 9, 8, 8, 9, 9, 10, 11, 11],
    rejectedMonthly: [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2],
    barangayLabels: ['Aplaya', 'Santa Maria', 'Barangay I (Poblacion)', 'San Roque', 'San Diego', 'Manghinao Proper'],
    barangayTotal: [39, 30, 26, 22, 17, 13],
    barangayApproved: [28, 21, 18, 15, 11, 9],
    barangayPending: [8, 6, 5, 4, 3, 3],
    statusDenominator: 147,
    issuance: [2, 6, 11, 17, 23, 28, 34, 41, 47, 53, 59, 64],
    processing: [3.2, 3.0, 2.9, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 2.0]
  },
  'ID Maker': {
    scopeLabel: 'ID Maker Scope',
    title: 'Print & Issuance Analytics',
    subtitle: 'Print queue, issuance throughput, and ID production insights',
    totalApplications: 64,
    pending: 11,
    inReview: 9,
    pendingReview: 20,
    approved: 44,
    rejected: 3,
    idsIssued: 64,
    submitted: [3, 5, 6, 8, 9, 8, 9, 10, 10, 12, 13, 13],
    approvedMonthly: [2, 3, 4, 6, 7, 6, 7, 8, 8, 10, 11, 11],
    rejectedMonthly: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    barangayLabels: ['Aplaya', 'Santa Maria', 'Barangay I (Poblacion)', 'San Roque', 'San Diego', 'Manghinao Proper'],
    barangayTotal: [18, 14, 12, 9, 7, 4],
    barangayApproved: [12, 10, 8, 7, 5, 2],
    barangayPending: [5, 3, 3, 2, 1, 1],
    statusDenominator: 64,
    issuance: [1, 3, 7, 12, 18, 24, 31, 38, 45, 52, 58, 64],
    processing: [2.8, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.8, 1.7]
  }
};
const SUBMITTED = ANALYTICS_DATA.Admin.submitted;
const APPROVED = ANALYTICS_DATA.Admin.approvedMonthly;
const REJECTED = ANALYTICS_DATA.Admin.rejectedMonthly;
const BRGY_LBL = ANALYTICS_DATA.Admin.barangayLabels;
const BRGY_TOT = ANALYTICS_DATA.Admin.barangayTotal;
const BRGY_APR = ANALYTICS_DATA.Admin.barangayApproved;
const BRGY_PND = ANALYTICS_DATA.Admin.barangayPending;
const CHARTS = {};

function analyticsScope() {
  return ANALYTICS_DATA[CURRENT_ROLE] || ANALYTICS_DATA.Staff;
}

const SCALE = {
  x: { grid: { color: C.grid, drawBorder: false }, ticks: { color: C.text } },
  y: { grid: { color: C.grid, drawBorder: false }, ticks: { color: C.text, callback: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v } }
};
const TIP = { backgroundColor: C.tooltip, padding: 12, cornerRadius: 10, titleFont: { weight: '700', size: 12 }, bodyFont: { size: 11 } };

function mkCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  if (typeof Chart === 'undefined') {
    canvas.closest('.chart-wrap')?.classList.add('chart-wrap--unavailable');
    return null;
  }
  // Dispose any existing chart bound to this canvas. Chart.js v4 exposes
  // getChart(element), which is authoritative even if CHARTS lost the entry
  // (e.g. re-init from a role switch) — prevents "Canvas is already in use".
  canvas.closest('.chart-wrap')?.classList.remove('chart-wrap--unavailable');
  const existing = CHARTS[id] || Chart.getChart(canvas);
  if (existing) { existing.destroy(); }
  delete CHARTS[id];
  return canvas;
}

function initTrend() {
  const ctx = mkCanvas('chart-trend'); if (!ctx) return;
  const data = analyticsScope();
  CHARTS['trend'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS, datasets: [
        { label: 'Submitted', data: data.submitted, borderColor: C.primary, backgroundColor: C.primaryFade, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: C.primary, pointHoverRadius: 7, fill: true, tension: 0.42 },
        { label: 'Approved', data: data.approvedMonthly, borderColor: C.green, backgroundColor: C.greenFade, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: C.green, pointHoverRadius: 7, fill: true, tension: 0.42 },
        { label: 'Rejected', data: data.rejectedMonthly, borderColor: C.red, backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: C.red, pointHoverRadius: 5, fill: false, tension: 0.42, borderDash: [5, 4] }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y.toLocaleString()}` } } }, scales: SCALE }
  });
}
function initStatus() {
  const ctx = mkCanvas('chart-status'); if (!ctx) return;
  const data = analyticsScope();
  CHARTS['status'] = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['Approved', 'Pending', 'In Review', 'Rejected'], datasets: [{ data: [data.approved, data.pending, data.inReview, data.rejected], backgroundColor: ['#FF9A9E', '#FF6B6B', '#FFB3B8', '#C41E3A'], hoverOffset: 8, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` ${c.label}: ${c.parsed.toLocaleString()} (${((c.parsed / data.statusDenominator) * 100).toFixed(1)}%)` } } } }
  });
}
function initDashboardCardClick() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;
  cards.forEach(card => card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  }));
}
function toggleDateFilter(event) {
  event.stopPropagation();
  const menu = document.getElementById('dashboard-date-menu');
  if (!menu) return;
  menu.classList.toggle('show');
  if (menu.classList.contains('show')) {
    const seed = selectedDate ? new Date(selectedDate.year, selectedDate.month, selectedDate.day) : new Date();
    renderCalendar(seed);
  }
}
function closeDateFilter() {
  const menu = document.getElementById('dashboard-date-menu');
  if (menu) menu.classList.remove('show');
}
function renderCalendar(date = new Date()) {
  const grid = document.getElementById('calendar-grid');
  const monthYear = document.getElementById('calendar-month-year');
  if (!grid || !monthYear) return;

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  monthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  grid.innerHTML = '';

  // Previous month days
  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-day disabled';
    day.textContent = prevLastDate - i;
    grid.appendChild(day);
  }

  // Current month days
  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;
    day.addEventListener('click', () => selectCalendarDay(i, month, year));
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      day.classList.add('today');
    }
    if (selectedDate && i === selectedDate.day && month === selectedDate.month && year === selectedDate.year) {
      day.classList.add('selected');
    }
    grid.appendChild(day);
  }

  // Next month days
  const remaining = 42 - grid.children.length; // 6 rows * 7 days
  for (let i = 1; i <= remaining; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day disabled';
    day.textContent = i;
    grid.appendChild(day);
  }
}
function changeCalendarMonth(delta) {
  const monthYear = document.getElementById('calendar-month-year');
  if (!monthYear) return;
  const [monthName, yearStr] = monthYear.textContent.split(' ');
  const year = parseInt(yearStr);
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const newDate = new Date(year, monthIndex + delta, 1);
  renderCalendar(newDate);
}
let selectedDate = null;
function selectCalendarDay(day, month, year) {
  selectedDate = { day, month, year };
  const date = new Date(year, month, day);
  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('dashboard-date-label').textContent = label;
  renderCalendar(date);
  closeDateFilter();
  showToast('Calendar filtered: ' + label, 'success');
}
function initBarangay(stacked = false) {
  const ctx = mkCanvas('chart-barangay'); if (!ctx) return;
  const data = analyticsScope();
  CHARTS['barangay'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.barangayLabels, datasets: [
        { label: 'Total', data: data.barangayTotal, backgroundColor: 'rgba(26,79,186,0.22)', hoverBackgroundColor: 'rgba(26,79,186,0.5)', borderRadius: 5, borderSkipped: false },
        { label: 'Approved', data: data.barangayApproved, backgroundColor: 'rgba(11,158,108,0.6)', hoverBackgroundColor: C.green, borderRadius: 5, borderSkipped: false },
        { label: 'Pending Review', data: data.barangayPending, backgroundColor: 'rgba(192,122,10,0.6)', hoverBackgroundColor: C.amber, borderRadius: 5, borderSkipped: false },
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y.toLocaleString()}` } } }, scales: { x: { stacked, grid: { display: false }, ticks: { color: C.text } }, y: { stacked, grid: { color: C.grid, drawBorder: false }, ticks: { color: C.text, callback: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v } } } }
  });
}
function initAge() {
  const ctx = mkCanvas('chart-age'); if (!ctx) return;
  CHARTS['age'] = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['60–64', '65–69', '70–74', '75–79', '80–84', '85+'], datasets: [{ data: [18, 24, 21, 19, 11, 7], backgroundColor: ['#BFDBFE', '#60A5FA', '#2563EB', '#1A4FBA', '#1E3A8A', '#0F1F4D'], hoverOffset: 6, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` Age ${c.label}: ${c.parsed}%` } } } }
  });
}
function initIssuance() {
  const ctx = mkCanvas('chart-issuance'); if (!ctx) return;
  const cumul = analyticsScope().issuance;
  CHARTS['issuance'] = new Chart(ctx, {
    type: 'line',
    data: { labels: MONTHS, datasets: [{ label: 'IDs Issued', data: cumul, borderColor: C.purple, backgroundColor: (context) => { const ch = context.chart; const { ctx: c, chartArea } = ch; if (!chartArea) return 'transparent'; const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom); g.addColorStop(0, 'rgba(113,64,216,0.28)'); g.addColorStop(1, 'rgba(113,64,216,0.01)'); return g; }, borderWidth: 3, pointRadius: 4, pointBackgroundColor: C.purple, pointHoverRadius: 7, fill: true, tension: 0.45 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` Cumulative IDs: ${c.parsed.y.toLocaleString()}` } } }, scales: SCALE }
  });
}
function initProcessing() {
  const ctx = mkCanvas('chart-processing'); if (!ctx) return;
  const vals = analyticsScope().processing;
  CHARTS['processing'] = new Chart(ctx, {
    type: 'bar',
    data: { labels: MONTHS, datasets: [{ label: 'Avg Days', data: vals, backgroundColor: vals.map((v, i) => i >= 10 ? 'rgba(11,158,108,0.7)' : 'rgba(26,79,186,0.22)'), hoverBackgroundColor: vals.map((v, i) => i >= 10 ? C.green : C.primary), borderRadius: 4, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => ` Avg: ${c.parsed.y} days` } } }, scales: { x: { grid: { display: false }, ticks: { color: C.text, font: { size: 10 } } }, y: { min: 0, max: 5, grid: { color: C.grid, drawBorder: false }, ticks: { color: C.text, font: { size: 10 }, callback: v => v + 'd' } } } }
  });
}
function initRadar() {
  const ctx = mkCanvas('chart-radar'); if (!ctx) return;
  CHARTS['radar'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Speed', 'Approval', 'ID Issuance', 'Coverage', 'Accuracy', 'Turnaround'], datasets: [
        { label: 'Q2 2026', data: [88, 90, 78, 92, 85, 82], borderColor: C.primary, backgroundColor: 'rgba(26,79,186,0.12)', borderWidth: 2.5, pointBackgroundColor: C.primary, pointRadius: 4 },
        { label: 'Q1 2026', data: [72, 86, 70, 88, 80, 74], borderColor: C.purple, backgroundColor: 'rgba(113,64,216,0.08)', borderWidth: 2, borderDash: [4, 3], pointBackgroundColor: C.purple, pointRadius: 3 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, padding: 14, font: { size: 11 } } }, tooltip: { ...TIP } }, scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: C.grid }, angleLines: { color: C.grid }, pointLabels: { color: C.text, font: { size: 10, weight: '600' } } } } }
  });
}

/* ── ID Maker Operational Analytics ── */




let chartsReady = false;
function initAllCharts() {
  initTrend(); initStatus(); initBarangay(false); initAge(); initIssuance(); initProcessing(); initRadar();
  chartsReady = true;
}
function switchTrendView(btn, view) {
  btn.closest('.tab-group').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const ch = CHARTS['trend']; if (!ch) return;
  if (view === 'all') { ch.data.datasets.forEach(d => d.hidden = false); }
  else if (view === 'approved') { ch.data.datasets[0].hidden = true; ch.data.datasets[1].hidden = false; ch.data.datasets[2].hidden = true; }
  else { ch.data.datasets[0].hidden = false; ch.data.datasets[1].hidden = true; ch.data.datasets[2].hidden = true; }
  ch.update();
}
function switchBarangayView(btn, view) {
  btn.closest('.tab-group').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  initBarangay(view === 'stacked');
}
function switchPeriod(btn, p) {
  btn.closest('.tab-group').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (chartsReady) initAllCharts();
  showToast('Switched to ' + p + ' view', 'info');
}

/* ── NAVIGATION (kept) ── */
function navigate(moduleId) {
  const p = ROLE_PERMS[CURRENT_ROLE] || ROLE_PERMS.Staff;

  // Transactional (Staff) modules are not part of the Admin portal —
  // the Administrator supervises integrity/security, not daily processing.
  const staffOnlyModules = ['applicants', 'applications', 'analytics', 'id-issuance'];
  if (CURRENT_ROLE === 'Admin' && staffOnlyModules.includes(moduleId)) {
    showToast('This transactional screen is only available to Staff accounts.', 'error');
    return;
  }

  // ID Maker Dashboard is restricted to ID Maker accounts
  if (CURRENT_ROLE !== 'ID Maker' && moduleId === 'id-maker-dashboard') {
    showToast('The ID Maker Dashboard is only available to ID Maker accounts.', 'error');
    return;
  }

  // ID Maker is restricted to ID Maker Dashboard + Analytics
  if (CURRENT_ROLE === 'ID Maker' && moduleId !== 'id-maker-dashboard' && moduleId !== 'id-maker-analytics') {
    showToast('Access restricted to ID Maker Dashboard.', 'error');
    return;
  }

  // Admin-only modules (Admin Console)
  const adminOnlyModules = ['user-mgmt', 'audit-logs', 'system-config', 'backup'];
  if (adminOnlyModules.includes(moduleId) && CURRENT_ROLE !== 'Admin') {
    showToast('This section is restricted to admin accounts.', 'error');
    return;
  }
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const mod = document.getElementById('mod-' + moduleId);
  if (mod) mod.classList.add('active');
  const link = document.querySelector('[data-module="' + moduleId + '"]');
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (moduleId === 'analytics') setTimeout(initAllCharts, 80);
  if (moduleId === 'id-maker-dashboard') { if (typeof initIdMakerQueue === 'function') initIdMakerQueue(); if (typeof updateIdMakerKPIs === 'function') updateIdMakerKPIs(); }
  if (moduleId === 'id-maker-analytics') { if (typeof initIdMakerCharts === 'function') setTimeout(initIdMakerCharts, 80); }
}

/* Wire nav links */
document.querySelectorAll('.nav-link[data-module]').forEach(l => l.addEventListener('click', () => navigate(l.dataset.module)));

/* ── FILTERS (kept) ── */
function filterByStatus(el, status) {
  el.closest('.status-tabs').querySelectorAll('.status-tab').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  // Map tab keys to actual status labels used in the table
  const statusMap = {
    all: 'all',
    pending: 'Pending',
    unverified: 'Unverified',
    review: 'Under Review',
    verified: 'Verified',
    process: 'In Process',
    release: 'Ready for Release',
    issued: 'ID Issued',
    completed: 'Completed',
    rejected: 'Rejected'
  };
  const filterStatus = statusMap[status] || 'all';
  document.querySelectorAll('#mod-applications .data-table tbody tr').forEach(row => {
    if (filterStatus === 'all') { row.style.display = ''; return; }
    const statusSelect = row.querySelector('.status-select__label');
    const rowStatus = statusSelect ? statusSelect.textContent.trim() : '';
    row.style.display = rowStatus === filterStatus ? '' : 'none';
  });
  // Update the 'All' tab count to reflect visible rows
  updateStatusTabCounts();
}

const STATUS_ICON_SVGS = {
  clock: '<path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM9.25 5v5.25l3.75 2.25.75-1.23-3-1.77V5h-1.5z"/>',
  document: '<path d="M4 2.5A1.5 1.5 0 0 1 5.5 1h5.75a1.5 1.5 0 0 1 1.06.44l2.25 2.25a1.5 1.5 0 0 1 .44 1.06V17.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 17.5v-15zM5.5 2.5V16h9V6.38L11.12 3.5H5.5zM6 7.5h8v1.5H6V7.5zm0 3.5h8v1.5H6V11zm0 3.5h5v1.5H6V14.5z"/>',
  checkmark: '<path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-10.707-1.414-1.414L9 8.586 6.707 6.293l-1.414 1.414L9 11.414l5.707-5.707z"/>',
  check: '<path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1.293 11.293-2.5-2.5 1.414-1.414L8.707 10.586l3.793-3.793 1.414 1.414-5.207 5.207z"/>',
  truck: '<path d="M1 4.5A1.5 1.5 0 0 1 2.5 3h8A1.5 1.5 0 0 1 12 4.5V6h2.09a1.5 1.5 0 0 1 1.2.6l2.09 2.785a1.5 1.5 0 0 1 .27.885V13a1.5 1.5 0 0 1-1.5 1.5h-.578A2.75 2.75 0 0 1 12.75 17a2.75 2.75 0 0 1-2.672-2.25H5.922A2.75 2.75 0 0 1 3.25 17 2.75 2.75 0 0 1 .5 14.25V4.5zM3.25 3.75V14.5a1 1 0 0 0 1 1h.439a2.75 2.75 0 0 1 5.3 0h.861V6.75H3.25v-3zM12 7.5v6.25h.439a2.75 2.75 0 0 1 5.3 0H17.5v-3.02L15.83 7.5H12zM3.75 15.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
  x: '<path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-11.293-1.414-1.414L10 8.586 7.707 6.293 6.293 7.707 8.586 10l-2.293 2.293 1.414 1.414L10 11.414l2.293 2.293 1.414-1.414L11.414 10l2.293-2.293z"/>'
};

function getStatusIconSvg(iconKey) {
  return STATUS_ICON_SVGS[iconKey] || STATUS_ICON_SVGS.clock;
}

function setStatusTrigger(root, iconKey, color, label) {
  const iconWrap = root.querySelector('.status-select__icon');
  const labelEl = root.querySelector('.status-select__label');
  if (iconWrap) {
    iconWrap.innerHTML = `<svg viewBox="0 0 20 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">${getStatusIconSvg(iconKey)}</svg>`;
  }
  if (labelEl) labelEl.textContent = label;
}

function toggleStatusSelect(btn, event) {
  event.stopPropagation();
  const root = btn.closest('.status-select');
  const menu = root.querySelector('.status-select__menu');
  document.querySelectorAll('.status-select__menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); });
  menu.classList.toggle('show');
}

function selectStatusOption(btn, event) {
  event.stopPropagation();
  const root = btn.closest('.status-select');
  const status = btn.dataset.status;
  const icon = btn.dataset.icon;
  const color = btn.dataset.color;
  root.querySelectorAll('.status-select__option').forEach(o => o.classList.toggle('active', o === btn));
  setStatusTrigger(root, icon, color, status);
  updateTableStatus(root.dataset.appId, status);
}

document.addEventListener('click', () => document.querySelectorAll('.status-select__menu.show').forEach(m => m.classList.remove('show')));

function filterApplicants(q) {
  document.querySelectorAll('#applicants-tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function filterRecentSubmissions() {
  const q = (document.getElementById('recent-submission-search')?.value || '').trim().toLowerCase();
  const barangay = document.getElementById('recent-barangay-filter')?.value || '';
  const rows = document.querySelectorAll('#recent-submissions-tbody tr');
  let visible = 0;

  rows.forEach(row => {
    const rowText = row.textContent.toLowerCase();
    const rowBarangay = row.children[2]?.textContent?.trim() || '';
    const matchesSearch = !q || rowText.includes(q);
    const matchesBarangay = !barangay || rowBarangay === barangay;
    const show = matchesSearch && matchesBarangay;
    row.style.display = show ? '' : 'none';
    if (show) visible += 1;
  });

  const footer = Array.from(document.querySelectorAll('.data-table-card')).find(card =>
    card.querySelector('.table-header__title')?.textContent?.trim() === 'Recent Submissions'
  )?.querySelector('.table-footer__info');
  if (footer) {
    const data = analyticsScope();
    footer.textContent = `Showing ${visible} of ${fmt(data.pendingReview)} pending review submissions`;
  }
}

/* ───────────────────────────────────────────────────────────
   NEW: RBAC (Demo)
─────────────────────────────────────────────────────────── */
let CURRENT_ROLE = 'Staff';
let CURRENT_USER = null;
let LOGIN_ROLE = 'admin';

function readAuthSession() {
  try {
    const sessionValue = window.sessionStorage.getItem('senioridAuth');
    if (sessionValue) return sessionValue;
  } catch (_err) { }
  try {
    const localValue = window.localStorage.getItem('senioridAuth');
    if (localValue) return localValue;
  } catch (_err) { }
  return window.name.startsWith('senioridAuth=') ? window.name.slice(14) : null;
}

function writeAuthSession(value) {
  try { window.sessionStorage.setItem('senioridAuth', value); return true; }
  catch (_err) { }
  try { window.localStorage.setItem('senioridAuth', value); return true; }
  catch (_err) { }
  window.name = 'senioridAuth=' + value;
  return true;
}

function clearAuthSession() {
  try { window.sessionStorage.removeItem('senioridAuth'); }
  catch (_err) { }
  try { window.localStorage.removeItem('senioridAuth'); }
  catch (_err) { }
  if (window.name.startsWith('senioridAuth=')) window.name = '';
}

const DEMO_USERS = {
  admin: { password: 'admin123', role: 'Admin', displayName: 'System Administrator', email: 'admin@scb.gov.ph', status: 'Active' },
  staff: { password: 'staff123', role: 'Staff', displayName: 'Frontline Staff', email: 'staff@scb.gov.ph', status: 'Active' },
  idmaker: { password: 'idmaker123', role: 'ID Maker', displayName: 'Jayrold', email: 'jayrold@scb.gov.ph', status: 'Active' }
};

const ROLE_PERMS = {
  Admin: { approve: true, reject: true, print: true, userMgmt: true, export: true, viewPII: true, settings: true, idMakerDashboard: true },
  Staff: { approve: true, reject: true, print: true, userMgmt: false, export: true, viewPII: true, settings: false, idMakerDashboard: false },
  "ID Maker": { approve: false, reject: false, print: true, userMgmt: false, export: false, viewPII: true, settings: false, idMakerDashboard: true }
};

/* Page detection — login is a standalone page; portals are separate pages.
   All pages share app.js, so these helpers are page-aware. */
const PAGE = (() => {
  const p = (location.pathname.split('/').pop() || '').toLowerCase();
  if (p === 'login.html') return 'login';
  if (p === 'admin.html') return 'admin';
  if (p === 'staff.html') return 'staff';
  if (p === 'idmaker.html') return 'idmaker';
  return 'unknown';
})();

function normalizeRole(role) {
  if (!role) return 'Staff';
  const normalized = String(role).trim();
  const directMap = {
    admin: 'Admin',
    'admin user': 'Admin',
    staff: 'Staff',
    'frontline staff': 'Staff',
    'id maker': 'ID Maker',
    idmaker: 'ID Maker',
    'id-maker': 'ID Maker'
  };
  return directMap[normalized.toLowerCase()] || (normalized === 'Admin' || normalized === 'Staff' || normalized === 'ID Maker' ? normalized : 'Staff');
}

function portalFileForRole(role) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'Admin') return 'admin.html';
  if (normalizedRole === 'ID Maker') return 'idmaker.html';
  return 'staff.html';
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

function showLoginPage() {
  if (PAGE === 'login') {
    document.body.classList.remove('portal-mode');
    document.body.classList.add('auth-mode');
    showScreen('login-page');
    document.getElementById('login-form')?.reset();
    selectLoginRole(LOGIN_ROLE || 'admin', false);
    return;
  }
  // On a portal page there is no login screen — bounce back to login.html.
  location.href = 'login.html';
}

function showLogoutPage() {
  // Redirect the user straight back to the Login page (no static "Logged Out" screen).
  if (PAGE === 'login') {
    document.body.classList.remove('portal-mode');
    document.body.classList.add('auth-mode');
    showScreen('login-page');
    return;
  }
  location.href = 'login.html?loggedout=1';
}

/* Flash a one-time toast/message on the standalone Login page. The message is
   carried via a URL state parameter so a full page redirect can still surface it. */
function applyLoginFlash(msg, type = 'info') {
  if (PAGE !== 'login') { location.href = 'login.html?loggedout=1'; return; }
  if (msg) { showToast(msg, type); }
  if (location.search.includes('loggedout')) {
    const url = new URL(location.href);
    url.searchParams.delete('loggedout');
    history.replaceState(null, '', url.toString());
  }
}

function showPortalPage() {
  if (PAGE === 'login') {
    // Already authenticated on the login page — take them to their portal.
    location.href = portalFileForRole(CURRENT_ROLE);
    return;
  }
  document.body.classList.remove('auth-mode');
  document.body.classList.add('portal-mode');
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
}

function updateRoleUI() {
  const roleLabel = document.getElementById('current-role-label');
  const dashboardBadge = document.getElementById('dashboard-role-badge');
  const roleSelect = document.getElementById('role-switch-select');
  const portalBrand = document.getElementById('portal-brand-name');
  const dashboardTitle = document.getElementById('dashboard-title');
  if (roleLabel) roleLabel.textContent = CURRENT_ROLE;
  if (dashboardBadge) {
    dashboardBadge.textContent = CURRENT_ROLE === 'Admin' ? 'Admin View' : (CURRENT_ROLE === 'ID Maker' ? 'ID Maker View' : 'Staff View');
    dashboardBadge.classList.toggle('green', CURRENT_ROLE === 'Staff' || CURRENT_ROLE === 'ID Maker');
  }
  if (roleSelect) roleSelect.value = CURRENT_ROLE;
  if (portalBrand) portalBrand.textContent = CURRENT_ROLE === 'Admin' ? 'Admin Portal' : (CURRENT_ROLE === 'ID Maker' ? 'ID Maker Portal' : 'Staff Portal');
  if (dashboardTitle) dashboardTitle.textContent = CURRENT_ROLE === 'Admin' ? 'Admin Dashboard' : (CURRENT_ROLE === 'ID Maker' ? 'ID Maker Dashboard' : 'Staff Dashboard');
  applyDashboardMetrics();
  applyAnalyticsRoleView();
  if (typeof switchKPIs === 'function') switchKPIs(CURRENT_ROLE);
}

function applySessionContext() {
  const displayName = CURRENT_USER?.displayName || 'Staff Account';
  const userLabel = document.getElementById('current-user-name');
  const welcome = document.getElementById('dashboard-welcome');
  if (userLabel) userLabel.textContent = displayName;
  const today = new Date();
  if (welcome) {
    const longDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    welcome.textContent = `${longDate} · Welcome back, ${displayName}`;
  }
  const dateLabel = document.getElementById('dashboard-date-label');
  if (dateLabel) {
    const shortDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    dateLabel.textContent = shortDate;
  }
}

function fmt(n) {
  return Number(n).toLocaleString('en-US');
}

function applyDashboardMetrics() {
  const data = analyticsScope();
  const cards = document.querySelectorAll('#mod-dashboard > .cards-grid .stat-card');
  const isAdmin = CURRENT_ROLE === 'Admin';
  const dashboardStats = isAdmin
    ? [
      ['Total Applications', fmt(data.totalApplications), '+47 submitted today'],
      ['Pending Review', fmt(data.pendingReview), `${fmt(data.pending)} pending + ${fmt(data.inReview)} in review`],
      ['Approved', fmt(data.approved), `${((data.approved / data.totalApplications) * 100).toFixed(1)}% approval rate`],
      ['Rejected', fmt(data.rejected), `${((data.rejected / data.totalApplications) * 100).toFixed(1)}% rejection rate`]
    ]
    : [
      ['Assigned Applications', fmt(data.totalApplications), 'Current staff workload'],
      ['Needs Review', fmt(data.pendingReview), `${fmt(data.pending)} pending + ${fmt(data.inReview)} in review`],
      ['Completed', fmt(data.approved), 'Approved from assigned queue'],
      ['Returned', fmt(data.rejected), 'Returned or rejected for correction']
    ];

  cards.forEach((card, index) => {
    const stat = dashboardStats[index];
    if (!stat) return;
    const label = card.querySelector('.stat-card__label');
    const value = card.querySelector('.stat-card__value');
    const sub = card.querySelector('.stat-card__sub');
    if (label) label.textContent = stat[0];
    if (value) value.textContent = stat[1];
    if (sub) sub.textContent = stat[2];
  });

  // Dynamic admin KPI strip (5-card row)
  const adminKpiStrip = document.querySelector('#mod-dashboard > .admin-kpi-strip');
  if (adminKpiStrip) {
    const kpiCards = adminKpiStrip.querySelectorAll('.stat-card');
    // Card 0: Total Registered Citizens
    if (kpiCards[0]) {
      kpiCards[0].querySelector('.stat-card__value').textContent = fmt(data.totalApplications);
      kpiCards[0].querySelector('.stat-card__sub').textContent = 'Overall demographic volume';
    }
    // Card 1 / 2 / 3 / 4: static (Active Users, Uptime, Security Alerts, Backup) — set by admin.js
  }

  // System Metrics Panel values
  const metricReceived = document.getElementById('metric-received');
  if (metricReceived) metricReceived.textContent = fmt(SUBMITTED[SUBMITTED.length - 1] || data.totalApplications);

  const applicantsBadge = document.querySelector('[data-module="applicants"] .nav-link__badge');
  if (applicantsBadge) applicantsBadge.textContent = fmt(data.pendingReview);

  document.querySelectorAll('.data-table-card').forEach(card => {
    const title = card.querySelector('.table-header__title')?.textContent?.trim();
    const footer = card.querySelector('.table-footer__info');
    if (!footer) return;
    if (title === 'Recent Submissions') {
      footer.textContent = `Showing 5 of ${fmt(data.pendingReview)} pending review submissions`;
    }
  });
}

function applyAnalyticsRoleView() {
  const data = analyticsScope();
  const title = document.getElementById('analytics-title');
  const subtitle = document.getElementById('analytics-subtitle');
  const badge = document.getElementById('analytics-scope-badge');
  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (badge) badge.textContent = data.scopeLabel;

  document.querySelectorAll('#mod-analytics strong').forEach(strong => {
    const value = strong.parentElement?.querySelector('span');
    if (!value) return;
    if (strong.textContent === 'Approved') value.textContent = fmt(data.approved);
    if (strong.textContent === 'Pending') value.textContent = fmt(data.pending);
    if (strong.textContent === 'In Review') value.textContent = fmt(data.inReview);
    if (strong.textContent === 'Rejected') value.textContent = fmt(data.rejected);
  });

  document.querySelectorAll('#mod-analytics .report-controls .mini-btn').forEach(btn => {
    btn.style.display = CURRENT_ROLE === 'Admin' ? '' : 'none';
  });

  // Exports are restricted to Admin/Staff — ID Maker can view reports only
  const canExport = (ROLE_PERMS[CURRENT_ROLE] || ROLE_PERMS.Staff).export;
  document.querySelectorAll('#mod-analytics select[onchange*="exportData"]').forEach(sel => {
    sel.style.display = canExport ? '' : 'none';
  });

  if (chartsReady) initAllCharts();
}

function toggleRoleSwitcher() {
  if (CURRENT_ROLE !== 'Admin') return;
  const rs = document.getElementById('role-switcher');
  if (!rs) return;
  rs.style.display = rs.style.display === 'none' ? 'block' : 'none';
}

function setRole(role, silent = false) {
  const roleMap = { 'Admin': 'Admin', 'Staff': 'Staff', 'ID Maker': 'ID Maker' };
  CURRENT_ROLE = roleMap[normalizeRole(role)] || 'Staff';
  if (CURRENT_USER) CURRENT_USER.role = CURRENT_ROLE;
  updateRoleUI();
  applyRoleToUI();
  if (!silent) showToast('Role set to ' + CURRENT_ROLE + ' (demo)', 'success');
}

function applyRoleToUI() {
  const p = ROLE_PERMS[CURRENT_ROLE] || ROLE_PERMS.Staff;
  const homeModule = CURRENT_ROLE === 'ID Maker' ? 'id-maker-dashboard' : 'dashboard';

  const btnApprove = document.getElementById('btn-approve');
  const btnReject = document.getElementById('btn-reject');
  const btnSave = document.getElementById('btn-save');
  if (btnApprove) btnApprove.style.display = p.approve ? '' : 'none';
  if (btnReject) btnReject.style.display = p.reject ? '' : 'none';
  if (btnSave) btnSave.style.display = (p.approve || p.reject || p.print) ? '' : 'none';

  document.querySelectorAll('[data-export]').forEach(el => {
    el.disabled = !p.export;
    el.style.opacity = p.export ? '1' : '.55';
  });

  const adminOpsPanel = document.getElementById('admin-ops-panel');
  if (adminOpsPanel) adminOpsPanel.style.display = (CURRENT_ROLE === 'Admin') ? 'grid' : 'none';

  const aiInsightsPanel = document.getElementById('ai-insights-panel');
  if (aiInsightsPanel) aiInsightsPanel.style.display = (CURRENT_ROLE === 'Admin' || CURRENT_ROLE === 'ID Maker') ? '' : 'none';

  // Staff-only nav links: Small Form Issuance — hidden for Admin, shown for Staff
  // Staff + ID Maker nav links (Applications, ID Issuance): hidden for Admin and ID Maker
  const isPrinterRole = (CURRENT_ROLE === 'Staff');
  const staffOnlyLinks = document.querySelectorAll('.nav-link.staff-only');
  staffOnlyLinks.forEach(link => {
    link.style.display = isPrinterRole ? '' : 'none';
  });
  // ID Maker Dashboard nav: shown only to ID Maker accounts
  const idMakerOnlyLinks = document.querySelectorAll('.nav-link.id-maker-only');
  idMakerOnlyLinks.forEach(link => {
    link.style.display = (CURRENT_ROLE === 'ID Maker') ? '' : 'none';
  });
  // Admin-only nav links (Admin Console): shown only to Admin accounts
  const adminOnlyLinks = document.querySelectorAll('.nav-link.admin-only');
  adminOnlyLinks.forEach(link => {
    link.style.display = (CURRENT_ROLE === 'Admin') ? '' : 'none';
  });
  // Admin-hidden nav links (transactional screens): hidden for Admin and ID Maker, shown for Staff
  // NOTE: must set explicit 'flex' — the '.admin-hidden' CSS forces display:none,
  // so clearing inline style ('' ) would fall back to hidden. 'flex' overrides it.
  const adminHiddenLinks = document.querySelectorAll('.nav-link.admin-hidden');
  adminHiddenLinks.forEach(link => {
    link.style.display = (CURRENT_ROLE === 'Admin' || CURRENT_ROLE === 'ID Maker') ? 'none' : 'flex';
  });
  // Dashboard "View all submissions" button links to the staff-only applicants screen —
  // hide it for Admin so it doesn't attempt a blocked transaction.
  const viewAllSubBtn = document.getElementById('btn-view-all-submissions');
  if (viewAllSubBtn) viewAllSubBtn.style.display = (CURRENT_ROLE === 'Admin') ? 'none' : '';
  // Section labels visibility: "Admin Console" → Admin only; "Staff Section" → Staff only
  const adminSectionLabels = document.querySelectorAll('.sidebar__section .sidebar__section-label');
  adminSectionLabels.forEach(lbl => {
    const t = lbl.textContent.trim();
    if (t === 'Admin Console') lbl.style.display = (CURRENT_ROLE === 'Admin') ? '' : 'none';
    if (t === 'Staff Section') lbl.style.display = (CURRENT_ROLE === 'Staff') ? '' : 'none';
    if (t === 'Main Menu') lbl.style.display = (CURRENT_ROLE === 'ID Maker') ? 'none' : '';
  });
  // Redirect out of admin-only modules for non-admins
  const adminOnlyModules = ['user-mgmt', 'audit-logs', 'system-config', 'backup'];
  if (CURRENT_ROLE !== 'Admin') {
    adminOnlyModules.forEach(mod => {
      const el = document.getElementById('mod-' + mod);
      if (el && el.classList.contains('active')) navigate(homeModule);
    });
  }
  // Main Dashboard nav: hidden for ID Maker (they use the ID Maker Dashboard)
  const dashboardNav = document.querySelector('[data-module="dashboard"]');
  if (dashboardNav) dashboardNav.style.display = (CURRENT_ROLE === 'ID Maker') ? 'none' : '';

  // Redirect out of unauthorized modules
  const staffOnlyModules = ['applicants', 'applications', 'analytics', 'id-issuance'];
  if (CURRENT_ROLE === 'Admin') {
    staffOnlyModules.forEach(mod => {
      const el = document.getElementById('mod-' + mod);
      if (el && el.classList.contains('active')) navigate(homeModule);
    });
  }
  if (CURRENT_ROLE === 'ID Maker') {
    ['dashboard', 'applicants', 'applications', 'analytics', 'id-issuance'].forEach(mod => {
      const el = document.getElementById('mod-' + mod);
      if (el && el.classList.contains('active')) navigate(homeModule);
    });
  }

  const roleSwitchTrigger = document.getElementById('role-switch-trigger');
  const roleSwitcher = document.getElementById('role-switcher');
  if (roleSwitchTrigger) roleSwitchTrigger.style.display = p.settings ? '' : 'none';
  if (roleSwitcher && !p.settings) roleSwitcher.style.display = 'none';
}

function authenticateUser(username, password) {
  const record = DEMO_USERS[username];
  if (!record || record.password !== password) return null;
  return { username, role: normalizeRole(record.role), displayName: record.displayName };
}

function selectLoginRole(role, focusPassword = true) {
  LOGIN_ROLE = (role === 'staff' || role === 'id-maker') ? role : 'admin';
  document.querySelectorAll('.login-role-card').forEach(card => {
    card.classList.toggle('active', card.dataset.loginRole === LOGIN_ROLE);
  });

  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const title = document.getElementById('login-title');
  const subtitle = document.getElementById('login-subtitle');

  if (usernameInput) usernameInput.value = LOGIN_ROLE === 'id-maker' ? 'idmaker' : LOGIN_ROLE;
  if (passwordInput) passwordInput.value = '';
  if (title) title.textContent = LOGIN_ROLE === 'admin'
    ? 'Welcome back, Admin User!'
    : (LOGIN_ROLE === 'id-maker' ? 'Welcome back, Jayrold!' : 'Welcome back, Staff User!');
  if (subtitle) {
    subtitle.textContent = LOGIN_ROLE === 'admin'
      ? 'Sign in to manage users, settings, logs, and backups'
      : (LOGIN_ROLE === 'id-maker'
        ? 'Sign in to review applications, update status, and manage ID printing'
        : 'Sign in to manage applicants and daily processing work');
  }
  if (focusPassword && passwordInput) passwordInput.focus();
}

function handleLogin(event) {
  event.preventDefault();
  const username = (document.getElementById('login-username').value.trim().toLowerCase() || (LOGIN_ROLE === 'id-maker' ? 'idmaker' : LOGIN_ROLE));
  const password = document.getElementById('login-password').value;
  const authUser = authenticateUser(username, password);
  if (!authUser) {
    showToast('Invalid login credentials. Please try again.', 'error');
    return;
  }

  CURRENT_USER = authUser;
  setRole(authUser.role, true);
  applySessionContext();
  writeAuthSession(JSON.stringify({ username: authUser.username, role: authUser.role, displayName: authUser.displayName }));

  if (PAGE === 'login') {
    // Standalone login page — send the user to their role-specific portal.
    location.href = portalFileForRole(authUser.role);
    return;
  }

  showPortalPage();
  navigate(authUser.role === 'ID Maker' ? 'id-maker-dashboard' : 'dashboard');
  showToast(`Signed in as ${authUser.role}.`, 'success');
}

function restoreSession() {
  const raw = readAuthSession();
  const loggedOut = new URLSearchParams(location.search).get('loggedout') === '1';
  if (!raw) {
    if (PAGE === 'login') {
      // When the user just signed out, land them straight on the Login page
      // and flash a privacy note; a fresh visitor simply sees the login form.
      showLoginPage();
      if (loggedOut) { applyLoginFlash('Session ended for data privacy protection', 'info'); }
      return;
    }
    // Portal accessed without a session — require a login.
    location.href = 'login.html';
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.role) {
      clearAuthSession();
      if (PAGE === 'login') { showLoginPage(); return; }
      location.href = 'login.html';
      return;
    }

    const normalizedRole = normalizeRole(parsed.role);
    CURRENT_USER = { username: parsed.username, role: normalizedRole, displayName: parsed.displayName || 'Staff Account' };
    setRole(normalizedRole, true);
    applySessionContext();

    if (PAGE === 'login') {
      // Already authenticated — skip the login screen and go straight to the portal.
      location.href = portalFileForRole(CURRENT_ROLE);
      return;
    }

    const currentPage = (location.pathname.split('/').pop() || '').toLowerCase();
    const expectedPortal = portalFileForRole(CURRENT_ROLE);
    const pageMatchesRole = (
      (PAGE === 'admin' && CURRENT_ROLE === 'Admin') ||
      (PAGE === 'staff' && CURRENT_ROLE === 'Staff') ||
      (PAGE === 'idmaker' && CURRENT_ROLE === 'ID Maker')
    );

    if (!pageMatchesRole) {
      clearAuthSession();
      location.href = 'login.html';
      return;
    }

    if (currentPage && currentPage !== expectedPortal.toLowerCase()) {
      location.href = expectedPortal;
      return;
    }

    showPortalPage();
    navigate(CURRENT_ROLE === 'ID Maker' ? 'id-maker-dashboard' : 'dashboard');
  } catch (_err) {
    clearAuthSession();
    if (PAGE === 'login') { showLoginPage(); return; }
    location.href = 'login.html';
  }
}

/* ───────────────────────────────────────────────────────────
   NEW: Application Detail Modal + Workflow + Docs + Audit
─────────────────────────────────────────────────────────── */
const FULL_APPLICANTS = [
  {
    id: 'SCB-2026-00421', surname: 'Abad', firstName: 'Maria', middleName: 'Santos', name: 'Maria Abad', age: 67, gender: 'F', barangay: 'Manghinao Proper', address: 'Purok 1, Manghinao Proper, Bauan, Batangas', dob: '1959-02-14', birthplace: 'Bauan, Batangas', civilStatus: 'Widower', education: 'High School Graduate', religion: 'Roman Catholic', occupation: 'Retired Teacher', contactNumber: '09171234567', idOsca: '', idSss: '34-1234567-0', idPhilhealth: '12-345678901-2', idGsis: '', idTin: '123-456-789-000', status: 'Verified', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-04-07', reviewer: 'Cindy B.',
    familyComposition: [
      { name: 'Pedro Abad', relationship: 'Son', age: 42, civilStatus: 'Married', occupation: 'Engineer', income: 25000 },
      { name: 'Ana Abad', relationship: 'Daughter-in-law', age: 38, civilStatus: 'Married', occupation: 'Nurse', income: 20000 }
    ],
    membership: { associationName: 'Manghinao Senior Citizens Assoc.', associationAddress: 'Purok 1, Manghinao Proper', associationDate: '2020-06-15', position: 'Member' },
    personalBackground: { incomeSources: ['Pension', 'Dependent Of Children/Relatives'], assets: ['House', 'Lot'], monthlyIncome: '5,000 - 5,999', livingWith: ['Children', 'Grandchildren'], skills: ['Teaching', 'Counseling'], involvement: ['Community/Organization Leader'] },
    problemsNeeds: { economic: [], social: ['Feeling of Loneliness & Isolation'], health: ['High Cost of Medicines', 'Lack/No Health Insurance'], housing: [], communityService: ['Desire To Participate'], otherNeeds: 'Needs regular medical checkup' },
    confirmations: { consentAll: true, assistedBy: 'Pedro Abad', relationToRegistrant: 'Son' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&fit=crop',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    }
  },
  {
    id: 'SCB-2026-00418', surname: 'Reyes', firstName: 'Jose', middleName: 'Lopez', name: 'Jose Reyes', age: 74, gender: 'M', barangay: 'Barangay II (Poblacion)', address: 'Zone 2, Barangay II (Poblacion), Bauan, Batangas', dob: '1951-11-02', birthplace: 'Batangas City', civilStatus: 'Married', education: 'College Graduate', religion: 'Roman Catholic', occupation: 'Retired Government Employee', contactNumber: '09181234567', idOsca: 'OSCA-001234', idSss: '34-7654321-0', idPhilhealth: '12-987654321-2', idGsis: 'GSIS-12345', idTin: '234-567-890-000', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-04-07', reviewer: 'Ramon P.',
    familyComposition: [
      { name: 'Rosalie Reyes', relationship: 'Wife', age: 70, civilStatus: 'Married', occupation: 'Retired', income: 8000 },
      { name: 'Mark Reyes', relationship: 'Son', age: 45, civilStatus: 'Married', occupation: 'Businessman', income: 50000 }
    ],
    membership: { associationName: 'Poblacion Elderly Association', associationAddress: 'Zone 2, Barangay II (Poblacion)', associationDate: '2018-03-20', position: 'Vice President' },
    personalBackground: { incomeSources: ['Own Pension', 'Stocks/Dividends', 'Dependent Of Children/Relatives'], assets: ['House', 'Lot', 'Commercial Building'], monthlyIncome: '10,000 & ABOVE', livingWith: ['Spouse', 'Children'], skills: ['Engineering', 'Legal Services'], involvement: ['Community/Organization Leader', 'Resource Volunteer'] },
    problemsNeeds: { economic: [], social: [], health: ['Lack of Medical Professionals'], housing: [], communityService: ['Skills/Resource to Share'], otherNeeds: '' },
    confirmations: { consentAll: true, assistedBy: 'Mark Reyes', relationToRegistrant: 'Son' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&fit=crop',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    }
  },
  {
    id: 'SCB-2026-00415', surname: 'Santos', firstName: 'Lourdes', middleName: 'Cruz', name: 'Lourdes Santos', age: 82, gender: 'F', barangay: 'Santa Maria', address: 'Purok 3, Santa Maria, Bauan, Batangas', dob: '1943-05-21', birthplace: 'Bauan, Batangas', civilStatus: 'Widower', education: 'Elementary Graduate', religion: 'Roman Catholic', occupation: 'Housewife', contactNumber: '09191234567', idOsca: '', idSss: '', idPhilhealth: '12-111222333-4', idGsis: '', idTin: '', status: 'Verified', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-04-06', reviewer: 'Ana D.',
    familyComposition: [
      { name: 'Jun Santos', relationship: 'Son', age: 55, civilStatus: 'Married', occupation: 'OFW', income: 40000 },
      { name: 'Rica Santos', relationship: 'Daughter', age: 48, civilStatus: 'Single', occupation: 'Teacher', income: 18000 }
    ],
    membership: null,
    personalBackground: { incomeSources: ['Dependent Of Children/Relatives', 'Savings'], assets: ['House', 'Lot'], monthlyIncome: '3,000 - 3,999', livingWith: ['Children', 'Grandchildren'], skills: ['Cooking'], involvement: ['Friendly Visits'] },
    problemsNeeds: { economic: ['Lack of Income/Resource'], social: ['Feeling of Loneliness & Isolation'], health: ['High Cost of Medicines', 'Lack of Hospitals/Medical Facilities'], housing: [], communityService: [], otherNeeds: 'Needs wheelchair access at barangay hall' },
    confirmations: { consentAll: true, assistedBy: 'Rica Santos', relationToRegistrant: 'Daughter' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: '',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    }
  },
  {
    id: 'SCB-2026-00410', surname: 'Cruz', firstName: 'Roberto', middleName: 'Garcia', name: 'Roberto Cruz', age: 71, gender: 'M', barangay: 'San Roque', address: 'Brgy San Roque Proper, Bauan, Batangas', dob: '1954-08-12', birthplace: 'Lemery, Batangas', civilStatus: 'Married', education: 'Vocational', religion: 'Iglesia Ni Cristo', occupation: 'Tricycle Driver', contactNumber: '09201234567', idOsca: '', idSss: '34-5556667-0', idPhilhealth: '12-444555666-7', idGsis: '', idTin: '', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-04-05', reviewer: 'Unassigned',
    familyComposition: [
      { name: 'Lita Cruz', relationship: 'Wife', age: 68, civilStatus: 'Married', occupation: 'Vendor', income: 5000 }
    ],
    membership: { associationName: 'San Roque Tricycle Operators Assoc.', associationAddress: 'San Roque Proper', associationDate: '2015-01-10', position: 'Member' },
    personalBackground: { incomeSources: ['Own Earnings, Salaries, /Waves'], assets: [], monthlyIncome: '2,000 - 2,999', livingWith: ['Spouse'], skills: ['Fishing', 'Farming'], involvement: ['Friendly Visits'] },
    problemsNeeds: { economic: ['Lack of Income/Resource', 'Livelihood Opportunities (specify)'], social: [], health: ['Lack/No Health Insurance'], housing: ['High Cost of Rental'], communityService: [], otherNeeds: 'Needs livelihood training' },
    confirmations: { consentAll: true, assistedBy: '', relationToRegistrant: '' }
  },
  {
    id: 'SCB-2026-00408', surname: 'Torres', firstName: 'Estrella', middleName: 'Ramos', name: 'Estrella Torres', age: 78, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Extension, Bauan, Batangas', dob: '1948-04-09', birthplace: 'Bauan, Batangas', civilStatus: 'Widower', education: 'High School Level', religion: 'Protestant', occupation: 'Retired Seamstress', contactNumber: '09211234567', idOsca: 'OSCA-005678', idSss: '34-8889990-0', idPhilhealth: '12-777888999-0', idGsis: '', idTin: '', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-04-05', reviewer: 'Cindy B.',
    familyComposition: [
      { name: 'Ricardo Torres', relationship: 'Son', age: 50, civilStatus: 'Married', occupation: 'Mechanic', income: 15000 },
      { name: 'Celina Torres', relationship: 'Daughter', age: 46, civilStatus: 'Married', occupation: 'OFW', income: 35000 }
    ],
    membership: { associationName: 'Aplaya Women for Progress', associationAddress: 'Aplaya Extension', associationDate: '2019-09-05', position: 'Secretary' },
    personalBackground: { incomeSources: ['Own Pension', 'Dependent Of Children/Relatives', 'Savings'], assets: ['House'], monthlyIncome: '4,000 - 4,999', livingWith: ['Children'], skills: ['Cooking', 'Farming'], involvement: ['Resource Volunteer'] },
    problemsNeeds: { economic: [], social: ['Inadequate Leisure/Recreational Activities'], health: ['High Cost of Medicines'], housing: [], communityService: ['Desire To Participate'], otherNeeds: '' },
    confirmations: { consentAll: true, assistedBy: 'Ricardo Torres', relationToRegistrant: 'Son' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    }
  },
  {
    id: 'SCB-2026-00502', surname: 'Cruz', firstName: 'Juan', middleName: 'A.', name: 'Juan Cruz', age: 66, gender: 'M', barangay: 'Cupang', address: 'Purok 2, Cupang, Bauan, Batangas', dob: '1959-04-18', birthplace: 'San Juan, Batangas', civilStatus: 'Married', education: 'College Level', religion: 'Roman Catholic', occupation: 'Farmer', contactNumber: '09221234567', idOsca: '', idSss: '34-1112223-0', idPhilhealth: '12-333444555-6', idGsis: '', idTin: '', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-04-08', reviewer: 'Unassigned', duplicate: { score: 0.94, matchId: 'SCB-2026-00311', matchName: 'Juan A. Cruz' },
    familyComposition: [
      { name: 'Maria Cruz', relationship: 'Wife', age: 63, civilStatus: 'Married', occupation: 'Vendor', income: 4000 },
      { name: 'Jose Cruz Jr.', relationship: 'Son', age: 38, civilStatus: 'Married', occupation: 'Construction Worker', income: 12000 }
    ],
    membership: null,
    personalBackground: { incomeSources: ['Own Earnings, Salaries, /Waves', 'Livestock/Crop'], assets: ['Lot', 'Farmland'], monthlyIncome: '1,000 - 1,999', livingWith: ['Spouse'], skills: ['Farming'], involvement: [] },
    problemsNeeds: { economic: ['Lack of Income/Resource'], social: [], health: ['Lack/No Health Insurance', 'Lack of Hospitals/Medical Facilities'], housing: ['No Permanent Housing'], communityService: [], otherNeeds: 'Needs irrigation support for farmland' },
    confirmations: { consentAll: true, assistedBy: 'Jose Cruz Jr.', relationToRegistrant: 'Son' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      idBack: '',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: '',
      signature: ''
    }
  },
  {
    id: 'SCB-2026-00503', surname: 'Mendoza', firstName: 'Corazon', middleName: 'Villanueva', name: 'Corazon Mendoza', age: 72, gender: 'F', barangay: 'Santa Maria', address: 'Purok 5, Santa Maria, Bauan, Batangas', dob: '1953-09-18', birthplace: 'Taal, Batangas', civilStatus: 'Married', education: 'College Graduate', religion: 'Roman Catholic', occupation: 'Retired Nurse', contactNumber: '09171234568', idOsca: 'OSCA-007890', idSss: '34-2223334-0', idPhilhealth: '12-555666777-8', idGsis: 'GSIS-67890', idTin: '345-678-901-000', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-04-08', reviewer: 'Unassigned',
    familyComposition: [
      { name: 'Ricardo Mendoza', relationship: 'Husband', age: 75, civilStatus: 'Married', occupation: 'Retired Teacher', income: 12000 },
      { name: 'Mark Mendoza', relationship: 'Son', age: 48, civilStatus: 'Married', occupation: 'Doctor', income: 60000 },
      { name: 'Grace Mendoza-Santos', relationship: 'Daughter', age: 44, civilStatus: 'Married', occupation: 'Lawyer', income: 45000 },
      { name: 'Carlo Mendoza', relationship: 'Son', age: 40, civilStatus: 'Single', occupation: 'Nurse', income: 25000 }
    ],
    membership: { associationName: 'Santa Maria Women for Progress', associationAddress: 'Purok 5, Santa Maria', associationDate: '2017-11-20', position: 'President' },
    personalBackground: { incomeSources: ['Own Pension', 'Spouse\'s Salary', 'Dependent Of Children/Relatives', 'Insurance'], assets: ['House', 'Lot', 'Farmland'], monthlyIncome: '10,000 & ABOVE', livingWith: ['Spouse', 'Children'], skills: ['Medical', 'Counseling', 'Cooking'], involvement: ['Community/Organization Leader', 'Resource Volunteer', 'Counseling/Referral'] },
    problemsNeeds: { economic: [], social: ['Inadequate Leisure/Recreational Activities'], health: ['Lack of Medical Professionals', 'Lack/No Access of Sanitation'], housing: [], communityService: ['Desire To Participate', 'Skills/Resource to Share'], otherNeeds: 'Advocate for more medical missions in barangay' },
    confirmations: { consentAll: true, assistedBy: 'Mark Mendoza', relationToRegistrant: 'Son' },
    documents: {
      idFront: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&crop=face',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    }
  },
  { id: 'SCB-2026-00501', name: 'Carmen Lopez', age: 69, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Barangay I (Poblacion), Bauan, Batangas', dob: '1957-03-25', status: 'Verified', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-04-08' },
  { id: 'SCB-2026-00500', name: 'Pedro Garcia', age: 73, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao Proper, Bauan, Batangas', dob: '1952-07-10', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-04-07' },
  { id: 'SCB-2026-00499', name: 'Teresa Mendoza', age: 81, gender: 'F', barangay: 'Santa Maria', address: 'Purok 4, Santa Maria, Bauan, Batangas', dob: '1944-12-03', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-04-06' },
  { id: 'SCB-2026-00498', name: 'Manuel Lim', age: 65, gender: 'M', barangay: 'San Diego', address: 'San Diego Ext., Bauan, Batangas', dob: '1960-09-15', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-04-06' },
  { id: 'SCB-2026-00497', name: 'Rosa Santos', age: 72, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Main, Bauan, Batangas', dob: '1954-01-22', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-04-05' },
  { id: 'SCB-2026-00496', name: 'Antonio Dela Cruz', age: 68, gender: 'M', barangay: 'San Roque', address: 'Purok 5, San Roque, Bauan, Batangas', dob: '1958-06-30', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-04-04' },
  { id: 'SCB-2026-00495', name: 'Elena Ramirez', age: 79, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Zone 1, Barangay I (Poblacion), Bauan, Batangas', dob: '1947-11-18', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-04-03' },
  { id: 'SCB-2026-00494', name: 'Francisco Gomez', age: 76, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao II, Bauan, Batangas', dob: '1950-03-05', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-04-02' },
  { id: 'SCB-2026-00493', name: 'Isabel Fernandez', age: 84, gender: 'F', barangay: 'Santa Maria', address: 'Santa Maria Center, Bauan, Batangas', dob: '1942-09-12', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-04-01' },
  { id: 'SCB-2026-00492', name: 'Miguel Tan', age: 62, gender: 'M', barangay: 'San Diego', address: 'Purok 1, San Diego, Bauan, Batangas', dob: '1964-05-27', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-03-31' },
  { id: 'SCB-2026-00491', name: 'Sofia Villanueva', age: 70, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Beach Road, Bauan, Batangas', dob: '1956-08-14', status: 'Verified', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-03-30' },
  { id: 'SCB-2026-00490', name: 'Ramon Salazar', age: 77, gender: 'M', barangay: 'San Roque', address: 'San Roque Heights, Bauan, Batangas', dob: '1949-12-09', status: 'Verified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-03-29' },
  { id: 'SCB-2026-00489', name: 'Lucia Morales', age: 83, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Barangay I (Poblacion), Bauan, Batangas', dob: '1943-07-23', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-03-28' },
  { id: 'SCB-2026-00488', name: 'Victor Navarro', age: 64, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao East, Bauan, Batangas', dob: '1962-10-11', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-03-27' },
  { id: 'SCB-2026-00487', name: 'Mercedes Aquino', age: 75, gender: 'F', barangay: 'Santa Maria', address: 'Purok 2, Santa Maria, Bauan, Batangas', dob: '1951-05-03', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-03-26' },
  { id: 'SCB-2026-00486', name: 'Ricardo Bautista', age: 69, gender: 'M', barangay: 'San Diego', address: 'Purok 3, San Diego, Bauan, Batangas', dob: '1957-12-17', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-03-25' },
  { id: 'SCB-2026-00485', name: 'Fe Castillo', age: 80, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Extension II, Bauan, Batangas', dob: '1946-08-29', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-03-24' },
  { id: 'SCB-2026-00484', name: 'Leonardo Mendoza', age: 66, gender: 'M', barangay: 'San Roque', address: 'San Roque Lower, Bauan, Batangas', dob: '1960-02-08', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-03-23' },
  { id: 'SCB-2026-00483', name: 'Concepcion Reyes', age: 78, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Zone 3, Barangay I (Poblacion), Bauan, Batangas', dob: '1948-11-30', status: 'Verified', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-03-22' },
  { id: 'SCB-2026-00482', name: 'Domingo Santos', age: 71, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao III, Bauan, Batangas', dob: '1955-04-12', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-03-21' },
  { id: 'SCB-2026-00481', name: 'Gloria Tan', age: 67, gender: 'F', barangay: 'Santa Maria', address: 'Purok 5, Santa Maria, Bauan, Batangas', dob: '1959-09-05', status: 'Verified', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-03-20' },
  { id: 'SCB-2026-00480', name: 'Hector Lim', age: 73, gender: 'M', barangay: 'San Diego', address: 'San Diego Heights, Bauan, Batangas', dob: '1953-01-19', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-03-19' },
  { id: 'SCB-2026-00479', name: 'Imelda Garcia', age: 82, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Proper, Bauan, Batangas', dob: '1944-06-27', status: 'Verified', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-03-18' },
  { id: 'SCB-2026-00478', name: 'Joaquin Cruz', age: 65, gender: 'M', barangay: 'San Roque', address: 'Purok 4, San Roque, Bauan, Batangas', dob: '1961-03-14', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-03-17' },
  { id: 'SCB-2026-00477', name: 'Katerina Lopez', age: 76, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Barangay I (Poblacion), Bauan, Batangas', dob: '1950-10-22', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-03-16' },
  { id: 'SCB-2026-00476', name: 'Lorenzo Reyes', age: 70, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao West, Bauan, Batangas', dob: '1956-07-09', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-03-15' },
  { id: 'SCB-2026-00475', name: 'Mercedes Fernandez', age: 79, gender: 'F', barangay: 'Santa Maria', address: 'Santa Maria Lower, Bauan, Batangas', dob: '1947-02-16', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-03-14' },
  { id: 'SCB-2026-00474', name: 'Nestor Bautista', age: 68, gender: 'M', barangay: 'San Diego', address: 'Purok 6, San Diego, Bauan, Batangas', dob: '1958-11-04', status: 'Verified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-03-13' },
  { id: 'SCB-2026-00473', name: 'Ofelia Torres', age: 74, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Hill, Bauan, Batangas', dob: '1952-04-28', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-03-12' },
  { id: 'SCB-2026-00472', name: 'Pablo Gomez', age: 81, gender: 'M', barangay: 'San Roque', address: 'San Roque Upper, Bauan, Batangas', dob: '1945-09-11', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-03-11' },
  { id: 'SCB-2026-00471', name: 'Quiana Santos', age: 67, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Zone 4, Barangay I (Poblacion), Bauan, Batangas', dob: '1959-12-25', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-03-10' },
  { id: 'SCB-2026-00470', name: 'Raul Mendoza', age: 72, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao Center, Bauan, Batangas', dob: '1954-05-18', status: 'Verified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-03-09' },
  { id: 'SCB-2026-00469', name: 'Sonia Ramirez', age: 85, gender: 'F', barangay: 'Santa Maria', address: 'Santa Maria Ext., Bauan, Batangas', dob: '1941-08-07', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-03-08' },
  { id: 'SCB-2026-00468', name: 'Teodoro Cruz', age: 63, gender: 'M', barangay: 'San Diego', address: 'San Diego Lower, Bauan, Batangas', dob: '1963-03-02', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-03-07' },
  { id: 'SCB-2026-00467', name: 'Ursula Lopez', age: 77, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Beach, Bauan, Batangas', dob: '1949-01-30', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-03-06' },
  { id: 'SCB-2026-00466', name: 'Valentino Reyes', age: 69, gender: 'M', barangay: 'San Roque', address: 'Purok 1, San Roque, Bauan, Batangas', dob: '1957-10-15', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-03-05' },
  { id: 'SCB-2026-00465', name: 'Wilma Santos', age: 80, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Zone 5, Barangay I (Poblacion), Bauan, Batangas', dob: '1946-07-21', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-03-04' },
  { id: 'SCB-2026-00464', name: 'Xavier Tan', age: 66, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao South, Bauan, Batangas', dob: '1960-04-08', status: 'Verified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-03-03' },
  { id: 'SCB-2026-00463', name: 'Yolanda Lim', age: 74, gender: 'F', barangay: 'Santa Maria', address: 'Purok 6, Santa Maria, Bauan, Batangas', dob: '1952-11-26', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-03-02' },
  { id: 'SCB-2026-00462', name: 'Zacarias Garcia', age: 71, gender: 'M', barangay: 'San Diego', address: 'San Diego North, Bauan, Batangas', dob: '1955-02-13', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-03-01' },
  { id: 'SCB-2026-00461', name: 'Amelia Cruz', age: 68, gender: 'F', barangay: 'Aplaya', address: 'Aplaya Central, Bauan, Batangas', dob: '1958-09-20', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-02-28' },
  { id: 'SCB-2026-00460', name: 'Benigno Lopez', age: 82, gender: 'M', barangay: 'San Roque', address: 'San Roque East, Bauan, Batangas', dob: '1944-06-05', status: 'Verified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-02-27' },
  { id: 'SCB-2026-00459', name: 'Catalina Reyes', age: 65, gender: 'F', barangay: 'Barangay I (Poblacion)', address: 'Zone 6, Barangay I (Poblacion), Bauan, Batangas', dob: '1961-01-12', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-02-26' },
  { id: 'SCB-2026-00458', name: 'Dario Santos', age: 77, gender: 'M', barangay: 'Manghinao Proper', address: 'Manghinao North, Bauan, Batangas', dob: '1949-08-03', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-02-25' },
  { id: 'SCB-2026-00457', name: 'Elena Mendoza', age: 70, gender: 'F', barangay: 'Santa Maria', address: 'Santa Maria West, Bauan, Batangas', dob: '1956-03-17', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-02-24' },
  { id: 'SCB-2026-00456', name: 'Felipe Ramirez', age: 75, gender: 'M', barangay: 'San Diego', address: 'Purok 7, San Diego, Bauan, Batangas', dob: '1951-12-29', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-02-23' },
  { id: 'SCB-2026-00455', name: 'Gerardo Bautista', age: 69, gender: 'M', barangay: 'Aplaya', address: 'Aplaya West, Bauan, Batangas', dob: '1957-07-06', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-02-22' },
  { id: 'SCB-2026-00454', name: 'Herminia Torres', age: 83, gender: 'F', barangay: 'San Roque', address: 'Purok 2, San Roque, Bauan, Batangas', dob: '1943-10-14', status: 'Verified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-02-21' },
  { id: 'SCB-2026-00453', name: 'Ignacio Gomez', age: 64, gender: 'M', barangay: 'Barangay I (Poblacion)', address: 'Barangay I (Poblacion), Bauan, Batangas', dob: '1962-05-21', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-02-20' },
  { id: 'SCB-2026-00452', name: 'Julia Santos', age: 78, gender: 'F', barangay: 'Manghinao Proper', address: 'Manghinao Upper, Bauan, Batangas', dob: '1948-02-28', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-02-19' },
  { id: 'SCB-2026-00451', name: 'Kiko Tan', age: 66, gender: 'M', barangay: 'Santa Maria', address: 'Santa Maria North, Bauan, Batangas', dob: '1960-09-09', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-02-18' },
  { id: 'SCB-2026-00450', name: 'Lorna Lim', age: 72, gender: 'F', barangay: 'San Diego', address: 'San Diego West, Bauan, Batangas', dob: '1954-06-16', status: 'Verified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-02-17' },
  { id: 'SCB-2026-00449', name: 'Marcos Garcia', age: 81, gender: 'M', barangay: 'Aplaya', address: 'Aplaya North, Bauan, Batangas', dob: '1945-03-23', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1593482588784-baa11b9a4c89?w=128&fit=crop&crop=face', regDate: '2026-02-16' },
  { id: 'SCB-2026-00448', name: 'Nora Cruz', age: 67, gender: 'F', barangay: 'San Roque', address: 'Purok 3, San Roque, Bauan, Batangas', dob: '1959-11-30', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-02-15' },
  { id: 'SCB-2026-00447', name: 'Oscar Lopez', age: 74, gender: 'M', barangay: 'Barangay I (Poblacion)', address: 'Zone 7, Barangay I (Poblacion), Bauan, Batangas', dob: '1952-04-07', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&fit=crop&crop=face', regDate: '2026-02-14' },
  { id: 'SCB-2026-00446', name: 'Patricia Reyes', age: 70, gender: 'F', barangay: 'Manghinao Proper', address: 'Manghinao East, Bauan, Batangas', dob: '1956-01-24', status: 'Verified', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=face', regDate: '2026-02-13' },
  { id: 'SCB-2026-00445', name: 'Quintin Santos', age: 79, gender: 'M', barangay: 'Santa Maria', address: 'Santa Maria South, Bauan, Batangas', dob: '1947-08-31', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1439144764555-b7b0f2c89f92?w=128&fit=crop&crop=face', regDate: '2026-02-12' },
  { id: 'SCB-2026-00444', name: 'Rita Mendoza', age: 68, gender: 'F', barangay: 'San Diego', address: 'San Diego East, Bauan, Batangas', dob: '1958-05-18', status: 'Verified', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=128&fit=crop&crop=face', regDate: '2026-02-11' },
  { id: 'SCB-2026-00443', name: 'Santiago Ramirez', age: 76, gender: 'M', barangay: 'Aplaya', address: 'Aplaya South, Bauan, Batangas', dob: '1950-12-05', status: 'ID Issued', photo: 'https://images.unsplash.com/photo-1541544781258-2ff37d4f23b8?w=128&fit=crop&crop=face', regDate: '2026-02-10' },
  { id: 'SCB-2026-00442', name: 'Teresa Bautista', age: 65, gender: 'F', barangay: 'San Roque', address: 'Purok 4, San Roque, Bauan, Batangas', dob: '1961-09-12', status: 'Verified', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&fit=crop&crop=face', regDate: '2026-02-09' },
  { id: 'SCB-2026-00441', name: 'Ulysses Torres', age: 73, gender: 'M', barangay: 'Barangay I (Poblacion)', address: 'Zone 8, Barangay I (Poblacion), Bauan, Batangas', dob: '1953-06-29', status: 'Unverified', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&fit=crop&crop=face', regDate: '2026-02-08' },
  { id: 'SCB-2026-00440', name: 'Victoria Gomez', age: 80, gender: 'F', barangay: 'Manghinao Proper', address: 'Manghinao West, Bauan, Batangas', dob: '1946-03-16', status: 'Verified', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&crop=face', regDate: '2026-02-07' }
];

const APP_DB = {
  'SCB-2026-00421': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00421'),
  'SCB-2026-00418': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00418'),
  'SCB-2026-00415': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00415'),
  'SCB-2026-00410': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00410'),
  'SCB-2026-00408': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00408'),
  'SCB-2026-00502': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00502'),
  'SCB-2026-00503': FULL_APPLICANTS.find(a => a.id === 'SCB-2026-00503')
};

let CURRENT_APP_ID = null;

// Fill missing fields with coherent example data so every application
// shows a complete, accurate-looking detail (frontend demo, mock data).
function ensureExampleData(app) {
  const parts = (app.name || '').trim().replace(/\s+/g, ' ').split(' ');
  if (app.surname === undefined) {
    app.surname = parts.length > 1 ? parts[parts.length - 1] : (app.name || 'Applicant');
    app.firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : (app.name || '');
    app.middleName = '';
  }
  const age = app.age || 70;
  if (app.civilStatus === undefined) app.civilStatus = age >= 65 ? 'Widower' : 'Married';
  if (app.birthplace === undefined) app.birthplace = 'Bauan, Batangas';
  if (app.education === undefined) app.education = 'High School Graduate';
  if (app.religion === undefined) app.religion = 'Roman Catholic';
  if (app.occupation === undefined) app.occupation = 'Retired';
  if (app.contactNumber === undefined) app.contactNumber = '09' + String(Math.floor(Math.random() * 900000000 + 100000000));
  if (app.idOsca === undefined) app.idOsca = '';
  if (app.idSss === undefined) app.idSss = '34-0000000-0';
  if (app.idPhilhealth === undefined) app.idPhilhealth = '12-000000000-0';
  if (app.idGsis === undefined) app.idGsis = '';
  if (app.idTin === undefined) app.idTin = '';
  if (app.familyComposition === undefined) {
    app.familyComposition = [
      { name: 'Son/Daughter of ' + app.surname, relationship: 'Son/Daughter', age: Math.max(35, age - 28), civilStatus: 'Married', occupation: 'Self-employed', income: 15000 }
    ];
  }
  if (app.membership === undefined) {
    app.membership = {
      associationName: (app.barangay || 'Barangay') + ' Senior Citizens Association',
      associationAddress: (app.barangay || 'Barangay') + ', Bauan, Batangas',
      associationDate: '2019-01-15',
      position: 'Member'
    };
  }
  if (app.personalBackground === undefined) {
    app.personalBackground = {
      incomeSources: ['Pension', 'Dependent Of Children/Relatives'],
      assets: ['House'],
      monthlyIncome: '3,000 - 4,999',
      livingWith: ['Children'],
      skills: [],
      involvement: ['Friendly Visits']
    };
  }
  if (app.problemsNeeds === undefined) {
    app.problemsNeeds = {
      economic: [],
      social: ['Feeling of Loneliness & Isolation'],
      health: ['High Cost of Medicines', 'Lack/No Health Insurance'],
      housing: [],
      communityService: [],
      otherNeeds: ''
    };
  }
  if (app.confirmations === undefined) app.confirmations = { consentAll: true, assistedBy: '', relationToRegistrant: '' };
  if (app.documents === undefined) {
    app.documents = {
      idFront: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      idBack: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      photo: app.photo ? app.photo.replace('w=128', 'w=400') : '',
      bc: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&fit=crop',
      cedula: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&fit=crop',
      signature: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop'
    };
  }
  return app;
}

function openApplicationDetail(appId) {
  const app = ensureExampleData(APP_DB[appId] || FULL_APPLICANTS.find(a => a.id === appId) || { id: appId, name: 'Unknown', barangay: '—', status: 'Pending', reviewer: 'Unassigned', daysPending: 0, duplicate: null });
  CURRENT_APP_ID = appId;

  setText('modal-title', `Application Detail — ${app.name}`);
  setText('modal-sub', `${app.id} · Barangay: ${app.barangay} · Status: ${app.status}`);

  // Applicant summary header (accurate to the registration form)
  const detailPhoto = document.getElementById('detail-photo');
  const detailFb = document.getElementById('detail-photo-fb');
  const photoSrc = app.photo || '';
  if (detailPhoto) { detailPhoto.src = photoSrc; detailPhoto.style.display = photoSrc ? 'block' : 'none'; }
  if (detailFb) { detailFb.style.display = photoSrc ? 'none' : 'flex'; detailFb.textContent = (app.name || '--').trim().replace(/\s+/g, ' ').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
  setText('detail-name', `${app.firstName || ''} ${app.middleName || ''} ${app.surname || app.name}`.trim().replace(/\s+/g, ' ') || app.name || '—');
  setText('detail-id', app.id || '—');
  setText('detail-barangay', `Barangay: ${app.barangay || '—'}`);
  const detailStatusBadge = document.getElementById('detail-status');
  if (detailStatusBadge) {
    const st = (app.status || 'Pending').toLowerCase();
    const badgeClass = /reject/.test(st) ? 'badge-rejected' : /issue|complete/.test(st) ? 'badge-issued' : /approve|verified|ready/.test(st) ? 'badge-approved' : /review|process|under/.test(st) ? 'badge-review' : 'badge-pending';
    detailStatusBadge.className = 'badge ' + badgeClass;
    detailStatusBadge.textContent = app.status || 'Pending';
  }

  // Duplicate alert
  const dup = document.getElementById('dup-alert');
  if (dup) {
    if (app.duplicate) {
      dup.style.display = '';
      const dupText = document.getElementById('dup-text');
      if (dupText) dupText.textContent =
        `AI match score ${(app.duplicate.score * 100).toFixed(0)}% with ${app.duplicate.matchName} (${app.duplicate.matchId}). Review before approval.`;
    } else {
      dup.style.display = 'none';
    }
  }

  // Set status select + reviewer
  const statusSelect = document.getElementById('status-select');
  if (statusSelect) statusSelect.value = app.status;
  setText('assigned-reviewer', `Reviewer: ${app.reviewer || 'Unassigned'}`);
  const reviewerSelect = document.getElementById('reviewer-select');
  if (reviewerSelect) reviewerSelect.value = app.reviewer === 'Unassigned' || !app.reviewer ? 'Unassigned' : app.reviewer;

  // Update workflow UI
  renderWorkflow(app.status);

  // ── Applicant Information ──
  setText('info-fullname', `${app.firstName || ''} ${app.middleName || ''} ${app.surname || app.name}`.trim() || '—');
  setText('info-dob', app.dob || '—');
  setText('info-age', app.age ? `${app.age} years old` : '—');
  setText('info-sex', app.gender === 'M' ? 'Male' : app.gender === 'F' ? 'Female' : (app.gender || '—'));
  setText('info-birthplace', app.birthplace || '—');
  setText('info-civilstatus', app.civilStatus || '—');
  setText('info-address', app.address || '—');
  setText('info-barangay', app.barangay || '—');
  setText('info-education', app.education || '—');
  setText('info-religion', app.religion || '—');
  setText('info-occupation', app.occupation || '—');
  setText('info-contact', app.contactNumber || '—');

  // Government IDs
  setText('info-id-osca', app.idOsca || '—');
  setText('info-id-sss', app.idSss || '—');
  setText('info-id-philhealth', app.idPhilhealth || '—');
  setText('info-id-gsis', app.idGsis || '—');
  setText('info-id-tin', app.idTin || '—');

  // ── Family Composition ──
  const familyTbody = document.getElementById('family-tbody');
  if (familyTbody) {
    if (app.familyComposition && app.familyComposition.length > 0) {
      familyTbody.innerHTML = app.familyComposition.map(m => `
        <tr>
          <td><span class="cell-text">${m.name}</span></td>
          <td><span class="cell-text">${m.relationship}</span></td>
          <td><span class="cell-text">${m.age}</span></td>
          <td><span class="cell-text">${m.civilStatus}</span></td>
          <td><span class="cell-text">${m.occupation}</span></td>
          <td><span class="cell-text">₱${(m.income || 0).toLocaleString()}</span></td>
        </tr>
      `).join('');
    } else {
      familyTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:16px">No family composition data</td></tr>';
    }
  }

  // ── Membership ──
  if (app.membership) {
    setText('info-assoc-name', app.membership.associationName || '—');
    setText('info-assoc-address', app.membership.associationAddress || '—');
    setText('info-assoc-date', app.membership.associationDate || '—');
    setText('info-assoc-position', app.membership.position || '—');
  } else {
    setText('info-assoc-name', 'No membership data');
    setText('info-assoc-address', '—');
    setText('info-assoc-date', '—');
    setText('info-assoc-position', '—');
  }

  // ── Personal Background ──
  if (app.personalBackground) {
    renderChipList('info-income-sources', app.personalBackground.incomeSources);
    renderChipList('info-assets', app.personalBackground.assets);
    setText('info-monthly-income', app.personalBackground.monthlyIncome || '—');
    renderChipList('info-living-with', app.personalBackground.livingWith);
    renderChipList('info-skills', app.personalBackground.skills);
    renderChipList('info-involvement', app.personalBackground.involvement);
  } else {
    renderChipList('info-income-sources', []);
    renderChipList('info-assets', []);
    setText('info-monthly-income', '—');
    renderChipList('info-living-with', []);
    renderChipList('info-skills', []);
    renderChipList('info-involvement', []);
  }

  // ── Problems & Needs ──
  if (app.problemsNeeds) {
    renderChipList('info-problems-economic', app.problemsNeeds.economic);
    renderChipList('info-problems-social', app.problemsNeeds.social);
    renderChipList('info-problems-health', app.problemsNeeds.health);
    renderChipList('info-problems-housing', app.problemsNeeds.housing);
    renderChipList('info-problems-community', app.problemsNeeds.communityService);
    setText('info-problems-other', app.problemsNeeds.otherNeeds || 'None specified');
  } else {
    renderChipList('info-problems-economic', []);
    renderChipList('info-problems-social', []);
    renderChipList('info-problems-health', []);
    renderChipList('info-problems-housing', []);
    renderChipList('info-problems-community', []);
    setText('info-problems-other', '—');
  }

  // ── Documents (reset to pending + populate previews) ──
  resetDocStatuses();
  populateDocPreviews(app);

  // Add audit entry (view)
  appendAudit('Cindy B.', 'Opened application detail', 'Admin');

  // RBAC apply
  applyRoleToUI();

  // Show modal
  document.getElementById('app-modal').classList.add('show');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderChipList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!items || items.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">None</span>';
    return;
  }
  el.innerHTML = items.map(item =>
    `<span class="badge badge-review" style="font-size:11px">${item}</span>`
  ).join('');
}

function closeModal() {
  document.getElementById('app-modal')?.classList.remove('show');
  CURRENT_APP_ID = null;
}

function openPrintDetail(appId) {
  const app = APP_DB[appId] || FULL_APPLICANTS.find(a => a.id === appId);
  if (!app) { showToast('Applicant not found.', 'error'); return; }
  setText('pd-name', ((app.firstName || '') + ' ' + (app.middleName || '') + ' ' + (app.surname || app.name)).trim() || '—');
  setText('pd-dob', app.dob || '—');
  setText('pd-address', app.address || '—');
  setText('pd-sex', app.gender === 'M' ? 'Male' : app.gender === 'F' ? 'Female' : (app.gender || '—'));
  setText('pd-id', app.id || '—');
  setText('pd-barangay', app.barangay || '—');
  const photoEl = document.getElementById('pd-photo');
  const fbEl = document.getElementById('pd-photo-fb');
  const photoSrc = app.photo || '';
  if (photoEl) { photoEl.src = photoSrc; photoEl.style.display = photoSrc ? 'block' : 'none'; }
  if (fbEl) { fbEl.style.display = photoSrc ? 'none' : 'flex'; fbEl.textContent = (app.name || '--').slice(0, 2).toUpperCase(); }
  document.getElementById('print-detail-modal').classList.add('show');
}

function closePrintDetail() {
  document.getElementById('print-detail-modal').classList.remove('show');
}

function renderWorkflow(status) {
  const stepsWrap = document.getElementById('workflow-steps');
  if (!stepsWrap) return;
  const steps = stepsWrap.querySelectorAll('.step');
  steps.forEach(s => {
    s.classList.remove('completed', 'active', 'rejected');
  });

  if (status === 'Rejected') {
    stepsWrap.querySelectorAll('.step').forEach(el => el.classList.add('rejected'));
    return;
  }

  const order = ['Pending', 'Under Review', 'Verified', 'In Process', 'Ready for Release', 'ID Issued'];
  const idx = Math.max(0, order.indexOf(status));
  order.forEach((st, i) => {
    const el = stepsWrap.querySelector(`[data-step="${st}"]`);
    if (!el) return;
    if (i < idx) el.classList.add('completed');
    else if (i === idx) el.classList.add('active');
  });
}

/* ── Workflow step validation ── */
const WORKFLOW_STEPS = ['Pending', 'Unverified', 'Under Review', 'Verified', 'In Process', 'Ready for Release', 'ID Issued', 'Completed'];
function isValidStatusTransition(current, next) {
  if (next === 'Rejected') return true; // Rejection always allowed
  if (current === 'Rejected' && next !== 'Pending') return false; // Must reopen first
  const ci = WORKFLOW_STEPS.indexOf(current);
  const ni = WORKFLOW_STEPS.indexOf(next);
  // If either status is unknown (e.g. ID Issued, Unverified from demo data), allow transition
  if (ci === -1 || ni === -1) return true;
  return ni <= ci + 2; // Can advance up to 2 steps or stay/go back
}

function updateStatus(newStatus) {
  if (!CURRENT_APP_ID) return;
  const currentStatus = APP_DB[CURRENT_APP_ID].status;
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    showToast('Invalid transition: ' + currentStatus + ' → ' + newStatus + '. Follow the workflow sequence.', 'error');
    document.getElementById('status-select').value = currentStatus;
    return;
  }
  APP_DB[CURRENT_APP_ID].status = newStatus;
  renderWorkflow(newStatus);
  document.getElementById('modal-sub').textContent =
    `${APP_DB[CURRENT_APP_ID].id} · Barangay: ${APP_DB[CURRENT_APP_ID].barangay} · Status: ${newStatus}`;

  // Sync the applications table inline badge
  syncApplicationsTableBadge(CURRENT_APP_ID, newStatus);

  appendAudit(CURRENT_USER?.displayName || 'Staff', `Status set to: ${newStatus}`, CURRENT_ROLE);
  showToast('Status updated: ' + newStatus, 'success');
}

function updateTableStatus(appId, newStatus) {
  // Update the application status in the data
  if (APP_DB[appId]) {
    APP_DB[appId].status = newStatus;
  }
  // Keep the ID Maker production queue badge in sync
  const queueRow = document.querySelector('#id-maker-queue-tbody tr[data-app-id="' + appId + '"]');
  const queueBadge = queueRow ? queueRow.querySelector('.queue-status-badge') : null;
  if (queueBadge) {
    queueBadge.className = 'badge queue-status-badge ' + queueBadgeClass(newStatus);
    queueBadge.textContent = newStatus;
  }
  // Update status tab counts after changing status
  updateStatusTabCounts();
  // Show success message
  showToast(`Status updated to ${newStatus} for ${appId}`, 'success');
}

/* ═══════════════════════════════════
   DIGITAL ISSUANCE FORM (Small Form Modal)
═══════════════════════════════════ */
let DI_CURRENT_APP_ID = null;
let DI_MODE = 'idmaker'; // 'staff' | 'idmaker'

function openDigitalIssuance(appId) {
  DI_MODE = 'idmaker';
  _populateDigitalIssuance(appId);
}

function openIssuancePreview(appId) {
  DI_MODE = 'staff';
  _populateDigitalIssuance(appId);
}

function _populateDigitalIssuance(appId) {
  const app = ID_MAKER_QUEUE.find(a => a.id === appId) || APP_DB[appId] || FULL_APPLICANTS.find(a => a.id === appId);
  if (!app) { showToast('Applicant not found.', 'error'); return; }
  DI_CURRENT_APP_ID = appId;

  const fullName = ((app.firstName || '') + ' ' + (app.middleName || '') + ' ' + (app.surname || app.name)).trim() || '—';
  const dobFormatted = app.dob ? formatDateForForm(app.dob) : '________________';
  const sexVal = app.gender === 'M' ? 'Male' : app.gender === 'F' ? 'Female' : (app.gender || '________________');
  const controlNo = app.controlNo || ('CTL-' + (app.id || '').replace('SCB-', ''));

  // Photo
  const pPhoto = document.getElementById('di-preview-photo');
  const pPhotoFb = document.getElementById('di-preview-photo-fallback');
  const photoSrc = app.photo || '';
  if (pPhoto) { pPhoto.src = photoSrc; pPhoto.style.display = photoSrc ? 'block' : 'none'; }
  if (pPhotoFb) { pPhotoFb.style.display = photoSrc ? 'none' : 'block'; pPhotoFb.textContent = (app.name || '--').slice(0, 2).toUpperCase(); }

  // Small form lines
  document.getElementById('di-preview-name').textContent = fullName;
  document.getElementById('di-preview-address').textContent = app.address || '________________';
  document.getElementById('di-preview-dob').textContent = dobFormatted;
  document.getElementById('di-preview-sex').textContent = sexVal;
  document.getElementById('di-preview-date-issued').textContent = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('di-preview-control-no').textContent = controlNo;

  // Signature
  const pSig = document.getElementById('di-preview-signature');
  const pSigFb = document.getElementById('di-preview-sign-fallback');
  const sigSrc = app.signature || '';
  if (pSig) { pSig.src = sigSrc; pSig.style.display = sigSrc ? 'block' : 'none'; }
  if (pSigFb) { pSigFb.style.display = sigSrc ? 'none' : 'block'; }

  // Mode-specific UI
  var footer = document.getElementById('di-modal-footer');
  var title = document.getElementById('di-modal-title');
  var editableIds = ['di-preview-name', 'di-preview-address', 'di-preview-dob', 'di-preview-sex', 'di-preview-date-issued', 'di-preview-control-no'];

  if (DI_MODE === 'staff') {
    if (footer) footer.style.display = '';
    if (title) title.textContent = 'Generate Issuance Form';
    editableIds.forEach(function (id) { var el = document.getElementById(id); if (el) el.contentEditable = 'true'; });
  } else {
    if (footer) footer.style.display = 'none';
    if (title) title.textContent = 'Digital Issuance Form';
    editableIds.forEach(function (id) { var el = document.getElementById(id); if (el) el.contentEditable = 'false'; });
  }

  document.getElementById('digital-issuance-modal').classList.add('show');
}

function closeDigitalIssuance() {
  document.getElementById('digital-issuance-modal').classList.remove('show');
  // Reset contenteditable
  ['di-preview-name', 'di-preview-address', 'di-preview-dob', 'di-preview-sex', 'di-preview-date-issued', 'di-preview-control-no'].forEach(function (id) {
    var el = document.getElementById(id); if (el) el.contentEditable = 'false';
  });
  DI_CURRENT_APP_ID = null;
}

function sendToIdMaker() {
  if (!DI_CURRENT_APP_ID) return;
  var appId = DI_CURRENT_APP_ID;

  var app = APP_DB[appId] || ID_MAKER_QUEUE.find(function (a) { return a.id === appId; }) || FULL_APPLICANTS.find(function (a) { return a.id === appId; }) || {};

  // Read (possibly edited) field values from the form
  var editedName = document.getElementById('di-preview-name')?.textContent || app.name || '________________';
  var editedAddress = document.getElementById('di-preview-address')?.textContent || app.address || '________________';
  var editedControlNo = document.getElementById('di-preview-control-no')?.textContent || ('CTL-' + (appId || '').replace('SCB-', ''));

  // Data minimization: only send printing-relevant fields to ID Maker
  var queueEntry = {
    id: app.id || appId,
    name: app.name || editedName,
    firstName: app.firstName || '',
    middleName: app.middleName || '',
    surname: app.surname || app.name || '',
    address: editedAddress,
    barangay: app.barangay || '—',
    dob: app.dob || '',
    gender: app.gender || '',
    photo: app.photo || fallbackMedia(app.name),
    signature: app.signature || '',
    controlNo: editedControlNo,
    printStatus: 'Queued',
    regDate: app.regDate || ''
  };

  // Add to ID Maker queue (replace if already exists)
  var existingIdx = -1;
  for (var i = 0; i < ID_MAKER_QUEUE.length; i++) {
    if (ID_MAKER_QUEUE[i].id === appId) { existingIdx = i; break; }
  }
  if (existingIdx >= 0) {
    ID_MAKER_QUEUE[existingIdx] = queueEntry;
  } else {
    ID_MAKER_QUEUE.push(queueEntry);
  }

  // Transition status to In Process (production started). Direct update is used
  // (not the strict 1-step workflow validator) because sending to ID Maker always
  // legitimately means the application is now in production.
  var dbApp = APP_DB[appId];
  if (dbApp) {
    dbApp.status = 'In Process';
    renderWorkflow('In Process');
    document.getElementById('modal-sub').textContent =
      (dbApp.id || appId) + ' · Barangay: ' + (dbApp.barangay || '—') + ' · Status: In Process';
    syncApplicationsTableBadge(appId, 'In Process');
  }

  // Re-render ID Maker queue + KPIs (guarded — idmaker.js is only loaded in the ID Maker portal)
  if (typeof initIdMakerQueue === 'function') initIdMakerQueue();
  if (typeof updateIdMakerKPIs === 'function') updateIdMakerKPIs();

  // Audit + notify (DPA)
  appendAudit(CURRENT_USER?.displayName || 'Staff', 'Sent to ID Maker (In Process)', CURRENT_ROLE);
  addNotifyLog(appId, 'Sent to ID Maker', 'System', 'Delivered');

  // Close the issuance modal
  closeDigitalIssuance();
  showToast('Application sent to ID Maker (In Process)', 'success');
}

function syncApplicationsTableBadge(appId, newStatus) {
  var statusRoot = document.querySelector('.status-select[data-app-id="' + appId + '"]');
  if (!statusRoot) return;
  var label = statusRoot.querySelector('.status-select__label');
  var icon = statusRoot.querySelector('.status-select__icon');
  if (label) label.textContent = newStatus;
  var colorMap = {
    'Pending': '#C07A0A', 'Unverified': '#D97706', 'Under Review': '#1A4FBA',
    'Verified': '#059669', 'In Process': '#0B9E6C', 'Ready for Release': '#7C3AED',
    'ID Issued': '#6B5BD1', 'Completed': '#0B9E6C', 'Rejected': '#D9233A'
  };
  if (icon) icon.style.color = colorMap[newStatus] || '#666';
  // Refresh tab counts after status change
  updateStatusTabCounts();
}

function downloadDigitalIssuanceDocs() {
  const name = document.getElementById('di-preview-name')?.textContent || '________________';
  const address = document.getElementById('di-preview-address')?.textContent || '________________';
  const dob = document.getElementById('di-preview-dob')?.textContent || '________________';
  const sex = document.getElementById('di-preview-sex')?.textContent || '________________';
  const dateIssued = document.getElementById('di-preview-date-issued')?.textContent || '________________';
  const controlNo = document.getElementById('di-preview-control-no')?.textContent || '________________';
  const appId = DI_CURRENT_APP_ID || '—';

  const photoEl = document.getElementById('di-preview-photo');
  const photoSrc = (photoEl && photoEl.style.display !== 'none') ? photoEl.src : '';
  const sigEl = document.getElementById('di-preview-signature');
  const sigSrc = (sigEl && sigEl.style.display !== 'none') ? sigEl.src : '';

  var photoHTML = photoSrc
    ? '<p style="text-align:center;margin:0 0 10px"><img src="' + photoSrc + '" width="100" height="100" style="border:1px solid #222;display:block;margin:0 auto" alt="Photo"/></p>'
    : '<p style="text-align:center;margin:0 0 10px"><span style="display:inline-block;width:100px;height:100px;border:1px solid #222;line-height:100px;font-size:22px;font-weight:700">--</span></p>';

  var sigHTML = sigSrc
    ? '<img src="' + sigSrc + '" width="120" height="56" style="display:block;margin:0 auto 3px;border:1px solid #222" alt="Signature"/>'
    : '';

  var fieldRow = function (label, value) {
    return '<tr>' +
      '<td style="font-size:12px;font-weight:700;white-space:nowrap;vertical-align:bottom;padding:0 6px 4px 0;width:1px">' + label + '</td>' +
      '<td style="font-size:12px;border-bottom:1px solid #777;padding:0 0 3px 0;vertical-align:bottom">' + value + '</td>' +
      '</tr>';
  };

  var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC/html40">' +
    '<head><meta charset="utf-8"/><title>Digital Issuance Form</title>' +
    '<style>' +
    '@page{size:portrait;margin:0.75in}' +
    'body{margin:0;padding:0;font-family:Arial,sans-serif;font-size:12px;color:#111}' +
    'table{border-collapse:collapse}' +
    '</style></head><body>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">' +
    '<table width="400" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid #222;background:#fff">' +
    // Header
    '<tr><td style="text-align:center;line-height:1.3;padding:12px 14px 8px;font-size:12px;font-weight:700">' +
    'REPUBLIC OF THE PHILIPPINES<br/>' +
    'OFFICE OF THE SENIOR CITIZEN AFFAIRS - OSCA<br/>' +
    'MUNICIPALITY OF BAUAN' +
    '</td></tr>' +
    // Photo
    '<tr><td style="padding:0 14px 10px;text-align:center">' + photoHTML + '</td></tr>' +
    // Fields
    '<tr><td style="padding:0 14px 8px">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
    fieldRow('NAME:', name) +
    fieldRow('ADDRESS:', address) +
    fieldRow('DATE OF BIRTH:', dob) +
    fieldRow('SEX:', sex) +
    fieldRow('DATE ISSUED:', dateIssued) +
    fieldRow('CONTROL NO.:', controlNo) +
    '</table>' +
    '</td></tr>' +
    // Signature footer
    '<tr><td style="padding:40px 14px 14px;text-align:right">' +
    '<table cellpadding="0" cellspacing="0" border="0" align="right"><tr><td style="text-align:center">' +
    '<table width="120" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid #222"><tr><td style="height:56px;text-align:center;vertical-align:middle">' + sigHTML + '</td></tr></table>' +
    '<div style="font-size:11px;margin-top:3px">Signature</div>' +
    '</td></tr></table>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</body></html>';

  var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Digital_Issuance_' + (appId.replace(/[^a-zA-Z0-9-]/g, '_')) + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded issuance form as .doc', 'success');
}



function assignReviewer(name) {
  if (!CURRENT_APP_ID) return;
  if (name === 'Assign Reviewer') return;
  APP_DB[CURRENT_APP_ID].reviewer = name;
  document.getElementById('assigned-reviewer').textContent = `Reviewer: ${name}`;
  appendAudit('Cindy B.', `Assigned reviewer: ${name}`, 'Admin');
  showToast('Reviewer assigned: ' + name, 'success');
}

/* Rule-based validation (3.1) demo */
function runValidation() {
  if (!CURRENT_APP_ID) return;
  const app = APP_DB[CURRENT_APP_ID];
  const ageOk = true; // demo
  const residencyOk = app.barangay !== '—';
  const docsOk = false; // demo based on birth cert "blurry"

  const body = document.getElementById('validation-body');
  body.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span class="badge ${ageOk ? 'badge-approved' : 'badge-rejected'}">Age 60+ : ${ageOk ? 'Pass' : 'Fail'}</span>
      <span class="badge ${residencyOk ? 'badge-approved' : 'badge-review'}">Residency : ${residencyOk ? 'Likely Valid' : 'Needs Check'}</span>
      <span class="badge ${docsOk ? 'badge-approved' : 'badge-pending'}">Docs : ${docsOk ? 'Complete' : 'Incomplete'}</span>
      ${app.duplicate ? `<span class="badge badge-rejected">Duplicate Risk: ${(app.duplicate.score * 100).toFixed(0)}%</span>` : `<span class="badge badge-approved">Duplicate Risk: Low</span>`}
    </div>
    <div style="margin-top:10px;font-size:12.5px;color:var(--text-muted);line-height:1.5">
      Results are generated by rule checks and similarity matching (name/DOB/address).
    </div>
  `;
  appendAudit('System', 'Validation run', 'System');
  showToast('Validation completed (demo)', 'info');
}

/* Document status helpers */
const DOC_STATUS = { idFront: 'pending', idBack: 'pending', photo: 'pending', bc: 'pending', cedula: 'pending', signature: 'pending' };

/* Document label map for viewer */
const DOC_LABELS = {
  idFront: 'Valid ID (Front)',
  idBack: 'Valid ID (Back)',
  photo: 'Latest Photo',
  bc: 'Birth Certificate',
  cedula: 'Community Tax Certificate',
  signature: 'Signature'
};
const DOC_KEYS = ['idFront', 'idBack', 'photo', 'bc', 'cedula', 'signature'];
const DOC_PREVIEW_MAP = { idFront: 'doc-id-front-preview', idBack: 'doc-id-back-preview', photo: 'doc-photo-preview', bc: 'doc-bc-preview', cedula: 'doc-cedula-preview', signature: 'doc-signature-preview' };

/* Current viewer state */
let docViewerIndex = 0;
let docViewerDocs = [];

function resetDocStatuses() {
  Object.keys(DOC_STATUS).forEach(k => DOC_STATUS[k] = 'pending');
  DOC_KEYS.forEach(doc => {
    const el = document.getElementById('doc-' + doc.replace(/([A-Z])/g, '-$1').toLowerCase() + '-status');
    if (el) { el.className = 'doc-card__status pending'; el.textContent = 'Pending'; }
  });
  Object.values(DOC_PREVIEW_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = 'No preview';
      el.style.background = '';
      el.style.backgroundImage = '';
    }
  });
  ['bc', 'cedula'].forEach(doc => {
    const btn = document.getElementById('doc-' + doc + '-verify');
    if (btn) { btn.classList.remove('is-verified'); btn.innerHTML = 'Verified'; }
  });
  const sum = document.getElementById('docs-summary');
  if (sum) sum.textContent = 'All documents pending review';
}

/* Populate doc previews with thumbnails from applicant data */
function populateDocPreviews(app) {
  if (!app || !app.documents) return;
  DOC_KEYS.forEach(doc => {
    const url = app.documents[doc];
    const el = document.getElementById(DOC_PREVIEW_MAP[doc]);
    if (!el) return;
    if (url) {
      el.innerHTML = '';
      el.style.background = 'none';
      el.style.backgroundImage = 'url(' + url + ')';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    } else {
      el.textContent = 'No document uploaded';
      el.style.background = '';
      el.style.backgroundImage = '';
    }
  });
}

/* Open the document viewer lightbox */
function viewDocument(docKey) {
  if (!CURRENT_APP_ID) return;
  const app = APP_DB[CURRENT_APP_ID] || FULL_APPLICANTS.find(a => a.id === CURRENT_APP_ID);
  const docs = (app && app.documents) || {};
  docViewerDocs = DOC_KEYS.map(k => ({ key: k, label: DOC_LABELS[k], url: docs[k] || '' }));
  docViewerIndex = Math.max(0, docViewerDocs.findIndex(d => d.key === docKey));
  renderDocViewer();
  document.getElementById('doc-viewer-backdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
  appendAudit(CURRENT_USER?.displayName || 'Staff', 'Viewed document: ' + (DOC_LABELS[docKey] || docKey), CURRENT_ROLE);
}

function renderDocViewer() {
  const doc = docViewerDocs[docViewerIndex];
  if (!doc) return;
  const img = document.getElementById('doc-viewer-img');
  const empty = document.getElementById('doc-viewer-empty');
  const title = document.getElementById('doc-viewer-title');
  const counter = document.getElementById('doc-viewer-counter');
  const docname = document.getElementById('doc-viewer-docname');
  const applicant = document.getElementById('doc-viewer-applicant');
  const prevBtn = document.getElementById('doc-viewer-prev');
  const nextBtn = document.getElementById('doc-viewer-next');
  const app = APP_DB[CURRENT_APP_ID] || FULL_APPLICANTS.find(a => a.id === CURRENT_APP_ID);
  if (title) title.textContent = doc.label || 'Document Preview';
  if (counter) counter.textContent = (docViewerIndex + 1) + ' / ' + docViewerDocs.length;
  if (docname) docname.textContent = doc.label || '—';
  if (applicant) applicant.textContent = (app ? app.name : '') + ' · ' + (app ? app.id : '');
  if (prevBtn) prevBtn.disabled = docViewerIndex <= 0;
  if (nextBtn) nextBtn.disabled = docViewerIndex >= docViewerDocs.length - 1;
  if (doc.url) {
    if (img) { img.src = doc.url; img.style.display = 'block'; }
    if (empty) empty.style.display = 'none';
  } else {
    if (img) { img.src = ''; img.style.display = 'none'; }
    if (empty) empty.style.display = 'flex';
  }
}

function navDocViewer(dir) {
  docViewerIndex = Math.max(0, Math.min(docViewerDocs.length - 1, docViewerIndex + dir));
  renderDocViewer();
}

function closeDocViewer() {
  const bd = document.getElementById('doc-viewer-backdrop');
  if (bd) bd.classList.remove('show');
  document.body.style.overflow = '';
}

/* Keyboard navigation for doc viewer */
document.addEventListener('keydown', function (e) {
  var bd = document.getElementById('doc-viewer-backdrop');
  if (!bd || !bd.classList.contains('show')) return;
  if (e.key === 'Escape') closeDocViewer();
  else if (e.key === 'ArrowLeft') navDocViewer(-1);
  else if (e.key === 'ArrowRight') navDocViewer(1);
});

function setDocStatus(doc, state) {
  DOC_STATUS[doc] = state;
  const labels = { ok: 'Approved', warn: 'Re-upload', bad: 'Rejected', pending: 'Pending' };
  const elId = 'doc-' + doc.replace(/([A-Z])/g, '-$1').toLowerCase() + '-status';
  const el = document.getElementById(elId);
  if (el) {
    el.className = 'doc-card__status ' + (state === 'ok' ? 'ok' : state === 'warn' ? 'warn' : state === 'bad' ? 'bad' : 'ok');
    el.textContent = labels[state] || state;
  }
  updateDocsSummary();
  appendAudit('Cindy B.', `Document updated: ${doc} → ${state}`, 'Admin');
}

/* Simple checkmark toggle so staff can mark a requirement as verified before
   generating the issuance form. Toggles between 'ok' (verified) and 'pending'. */
function toggleDocVerified(doc) {
  var next = DOC_STATUS[doc] === 'ok' ? 'pending' : 'ok';
  setDocStatus(doc, next);
  var btn = document.getElementById('doc-' + doc + '-verify');
  if (btn) {
    btn.classList.toggle('is-verified', next === 'ok');
    btn.innerHTML = next === 'ok' ? '&#10003; Verified' : 'Verified';
  }
  if (next === 'ok') {
    var label = doc === 'bc' ? 'Birth Certificate' : doc === 'cedula' ? 'Community Tax Certificate' : doc;
    showToast(label + ' verified', 'success');
  }
}

function updateDocsSummary() {
  const sum = document.getElementById('docs-summary');
  if (!sum) return; // not every portal page has the docs summary card
  const vals = Object.values(DOC_STATUS);
  const allOk = vals.every(v => v === 'ok');
  const anyRejected = vals.some(v => v === 'bad');
  const anyReupload = vals.some(v => v === 'warn');
  const allPending = vals.every(v => v === 'pending');
  if (allPending) sum.textContent = 'All documents pending review';
  else if (allOk) sum.textContent = 'All required documents approved';
  else if (anyRejected) sum.textContent = 'One or more documents rejected';
  else if (anyReupload) sum.textContent = 'Re-upload requested for some documents';
  else sum.textContent = 'Some documents pending review';
}

function approveAllDocs() {
  ['idFront', 'idBack', 'photo', 'bc', 'cedula', 'signature'].forEach(d => setDocStatus(d, 'ok'));
  showToast('All documents approved', 'success');
}

function requestReupload() {
  ['idFront', 'idBack', 'photo', 'bc', 'cedula', 'signature'].forEach(d => setDocStatus(d, 'warn'));
  showToast('Re-upload requested for all documents (demo)', 'info');
  addNotifyLog(CURRENT_APP_ID, 'Document Re-upload Requested', 'SMS', 'Queued');
}

function generateIssuanceForm() {
  if (!CURRENT_APP_ID) return;
  var app = APP_DB[CURRENT_APP_ID];
  if (!app) return;
  if (app.duplicate) {
    showToast('Cannot generate form: duplicate risk flagged. Resolve first.', 'error');
    return;
  }
  // Block only if any doc was explicitly rejected
  var docVals = Object.values(DOC_STATUS);
  var anyBad = docVals.some(function (v) { return v === 'bad'; });
  if (anyBad) {
    showToast('Cannot generate form: one or more documents were rejected. Request re-upload first.', 'error');
    return;
  }
  // Require the core requirement attachments (Birth Certificate + Cedula) to be
  // explicitly marked verified before the form can be generated.
  var requiredDocs = { bc: 'Birth Certificate', cedula: 'Community Tax Certificate' };
  var missingVerified = Object.keys(requiredDocs).filter(function (d) { return DOC_STATUS[d] !== 'ok'; });
  if (missingVerified.length > 0) {
    var names = missingVerified.map(function (d) { return requiredDocs[d]; }).join(' and ');
    showToast('Verify ' + names + ' (mark them checked) before generating the form.', 'error');
    return;
  }
  // Auto-approve all pending docs — generating the issuance form implies staff has verified them
  Object.keys(DOC_STATUS).forEach(function (k) { DOC_STATUS[k] = 'ok'; });
  ['idFront', 'idBack', 'photo', 'bc', 'cedula', 'signature'].forEach(function (doc) {
    var el = document.getElementById('doc-' + doc.replace(/([A-Z])/g, '-$1').toLowerCase() + '-status');
    if (el) { el.className = 'doc-card__status ok'; el.textContent = 'Approved'; }
    var vbtn = document.getElementById('doc-' + doc + '-verify');
    if (vbtn) { vbtn.classList.add('is-verified'); vbtn.innerHTML = '&#10003; Verified'; }
  });
  appendAudit(CURRENT_USER?.displayName || 'Staff', 'Documents approved (issuance form generated)', CURRENT_ROLE);
  openIssuancePreview(CURRENT_APP_ID);
}

function rejectCurrent() {
  if (!CURRENT_APP_ID) return;
  updateStatus('Rejected');
  showToast('Application rejected', 'error');
  addNotifyLog(CURRENT_APP_ID, 'Status Updated: Rejected', 'SMS', 'Sent');
}

function saveCurrent() {
  if (!CURRENT_APP_ID) return;
  showToast('Changes saved (demo)', 'success');
  appendAudit('Cindy B.', 'Saved changes', 'Admin');
}

/* Audit log helper (DPA) */
function appendAudit(user, action, source) {
  const tbody = document.getElementById('audit-body');
  if (!tbody) return;
  const now = new Date();
  const ts = now.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const badge = source === 'System' ? 'badge-issued' : 'badge-review';
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><span class="cell-text">${ts}</span></td>
    <td><span class="cell-text">${user}</span></td>
    <td><span class="cell-text">${action}</span></td>
    <td style="text-align:right"><span class="badge ${badge}">${source}</span></td>
  `;
  tbody.prepend(tr);
}

/* Notifications log helper */
function addNotifyLog(appId, event, channel, result) {
  const tbody = document.getElementById('notify-log-body');
  if (!tbody) return;
  const now = new Date();
  const ts = now.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><span class="cell-text">${ts}</span></td>
    <td><span class="cell-text">${appId || '—'}</span></td>
    <td><span class="cell-text">${event}</span></td>
    <td><span class="badge badge-issued">${channel}</span></td>
    <td><span class="badge badge-approved">${result}</span></td>
    <td style="text-align:right"><button class="row-action always-visible" onclick="openApplicationDetail('${appId}')">Open</button></td>
  `;
  tbody.prepend(tr);
}

/* Bulk reminder (AI recommendation) */
function sendBulkReminder() {
  showToast('Bulk reminders queued for 156 applicants (demo)', 'success');
  addNotifyLog('—', 'Bulk Missing Document Reminder', 'SMS', 'Queued');
}

/* Exports — real CSV download, PDF/Excel as demo */
function exportPDF() { showToast('Exported PDF (demo)', 'success'); }
function exportExcel() { showToast('Exported Excel (demo)', 'success'); }
function exportCSV() {
  const data = analyticsScope();
  const scope = CURRENT_ROLE === 'Admin' ? FULL_APPLICANTS : FULL_APPLICANTS.slice(0, 30);
  const header = ['ID', 'Name', 'Age', 'Gender', 'Barangay', 'Civil Status', 'Occupation', 'Status', 'Date Registered'];
  const rows = scope.map(a => [
    a.id || '',
    (a.name || '').replace(/,/g, ';'),
    a.age || '',
    a.gender || '',
    (a.barangay || '').replace(/,/g, ';'),
    (a.civilStatus || '').replace(/,/g, ';'),
    (a.occupation || '').replace(/,/g, ';'),
    a.status || '',
    a.regDate || ''
  ]);
  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `osca-applicants-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  appendAudit(CURRENT_USER?.displayName || 'Staff', 'Exported applicant data (CSV)', 'System');
  showToast('CSV exported with ' + scope.length + ' records', 'success');
}
function exportData(format) {
  if (format === 'pdf') exportPDF();
  else if (format === 'excel') exportExcel();
  else if (format === 'csv') exportCSV();
}
function scheduleWeeklyReport() { showToast('Weekly report scheduled (every Monday 8:00 AM) — demo', 'success'); }

/* ── Small Form Issuance functions ── */
function fallbackMedia(text) {
  const initials = ((text || '--').replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()) || '--';
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90'><rect width='100%' height='100%' fill='rgb(243,244,246)'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' fill='rgb(17,24,39)' font-family='Arial' font-size='32' font-weight='700'>" + initials + "</text></svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function formatDateForForm(value) {
  if (!value) return '________________';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}
function getCurrentApplicant() {
  const sel = document.getElementById('id-applicant');
  if (!sel || !sel.value) return null;
  return APP_DB[sel.value] || null;
}
function updatePreview() {
  const app = getCurrentApplicant();
  const nameEl = document.getElementById('id-fullname');
  const addrEl = document.getElementById('id-address');
  const dobEl = document.getElementById('id-dob');
  const sexEl = document.getElementById('id-sex');

  if (app) {
    if (nameEl) nameEl.value = app.name || '';
    if (addrEl) addrEl.value = app.address || '';
    if (dobEl) dobEl.value = app.dob || '';
    if (sexEl) sexEl.value = app.gender === 'M' ? 'Male' : app.gender === 'F' ? 'Female' : app.gender || '';
  } else {
    if (nameEl) nameEl.value = '';
    if (addrEl) addrEl.value = '';
    if (dobEl) dobEl.value = '';
    if (sexEl) sexEl.value = '';
  }

  const nameVal = nameEl?.value || '';
  const addrVal = addrEl?.value || '';
  const dobVal = dobEl?.value || '';
  const sexVal = sexEl?.value || '';
  const dateIssuedVal = document.getElementById('id-date-issued')?.value || '';
  const controlNoVal = document.getElementById('id-control-no')?.value || '';

  // Spans
  const pName = document.getElementById('preview-name');
  const pAddr = document.getElementById('preview-address');
  const pDob = document.getElementById('preview-dob');
  const pSex = document.getElementById('preview-sex');
  const pDateIssued = document.getElementById('preview-date-issued');
  const pControlNo = document.getElementById('preview-control-no');

  if (pName) pName.textContent = nameVal || '________________';
  if (pAddr) pAddr.textContent = addrVal || '________________';
  if (pDob) pDob.textContent = dobVal ? formatDateForForm(dobVal) : '________________';
  if (pSex) pSex.textContent = sexVal || '________________';
  if (pDateIssued) pDateIssued.textContent = dateIssuedVal ? formatDateForForm(dateIssuedVal) : '________________';
  if (pControlNo) pControlNo.textContent = controlNoVal || '________________';

  // Photo
  const pPhoto = document.getElementById('preview-photo');
  const pPhotoFb = document.getElementById('preview-photo-fallback');
  if (pPhoto && pPhotoFb) {
    const photoSrc = app?.photo || '';
    if (photoSrc) {
      pPhoto.src = photoSrc;
      pPhoto.style.display = 'block';
      pPhotoFb.style.display = 'none';
    } else {
      pPhoto.src = '';
      pPhoto.style.display = 'none';
      pPhotoFb.style.display = 'block';
      pPhotoFb.textContent = (nameVal || '--').slice(0, 2).toUpperCase();
    }
  }

  // Signature
  const pSig = document.getElementById('preview-signature');
  const pSigFb = document.getElementById('preview-sign-fallback');
  if (pSig && pSigFb) {
    const sigSrc = app?.signature || '';
    if (sigSrc) {
      pSig.src = sigSrc;
      pSig.style.display = 'block';
      pSigFb.style.display = 'none';
    } else {
      pSig.src = '';
      pSig.style.display = 'none';
      pSigFb.style.display = 'block';
    }
  }
}
function initSmallFormIssuance() {
  const select = document.getElementById('id-applicant');
  if (!select) return;
  select.innerHTML = '<option value="">Select applicant</option>';
  Object.keys(APP_DB).forEach((id) => {
    const app = APP_DB[id];
    app.photo = app.photo || fallbackMedia(app.name);
    app.signature = app.signature || fallbackMedia(app.name);
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = app.name + ' (' + id + ')';
    select.appendChild(opt);
  });
}

/* ═══════════════════════════════════
   ID Card Preview & Print
═══════════════════════════════════ */
let currentCardSide = 'front';

function openIdCardModal(appId) {
  const app = APP_DB[appId] || FULL_APPLICANTS.find(a => a.id === appId);
  if (!app) { showToast('Applicant not found.', 'error'); return; }

  const dateIssued = document.getElementById('id-date-issued')?.value || '';
  const controlNo = document.getElementById('id-control-no')?.value || '';
  const fullName = app.name || '';
  const address = app.address || '';
  const dob = app.dob ? formatDateForForm(app.dob) : '';
  const sex = app.gender === 'M' ? 'Male' : app.gender === 'F' ? 'Female' : '';
  const scbId = app.id || '';

  // Calculate validity: 5 years from date issued or today
  let validity = '';
  if (dateIssued) {
    const d = new Date(dateIssued);
    d.setFullYear(d.getFullYear() + 5);
    validity = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 5);
    validity = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Fill front side
  document.getElementById('idcard-name').textContent = fullName || '________________';
  document.getElementById('idcard-address').textContent = address || '________________';
  document.getElementById('idcard-dob').textContent = dob || '________________';
  document.getElementById('idcard-sex').textContent = sex || '________________';
  document.getElementById('idcard-scb-id').textContent = scbId;
  document.getElementById('idcard-validity').textContent = validity;
  document.getElementById('idcard-control-no').textContent = controlNo || '________________';

  // Photo
  const photoSrc = app.photo || fallbackMedia(fullName);
  const photoImg = document.getElementById('idcard-photo');
  const photoFb = document.getElementById('idcard-photo-fb');
  photoImg.src = photoSrc;
  photoImg.style.display = photoSrc ? 'block' : 'none';
  photoFb.style.display = photoSrc ? 'none' : 'block';
  photoFb.textContent = (fullName || '--').slice(0, 2).toUpperCase();

  // Back side barcode text
  document.getElementById('idcard-barcode-text').textContent = scbId;
  // Reset to front
  switchCardSide('front');
  // Show modal
  document.getElementById('idcard-modal').classList.add('show');
}

function closeIdCardModal() {
  document.getElementById('idcard-modal').classList.remove('show');
}

function switchCardSide(side) {
  currentCardSide = side;
  document.getElementById('idcard-front-wrapper').style.display = side === 'front' ? 'flex' : 'none';
  document.getElementById('idcard-back-wrapper').style.display = side === 'back' ? 'flex' : 'none';
  document.getElementById('btn-card-front').classList.toggle('active', side === 'front');
  document.getElementById('btn-card-back').classList.toggle('active', side === 'back');
}

function printIdCard() {
  window.print();
}

function downloadIdCard() {
  showToast('PNG download requires html2canvas library. Use Print for now.', 'info');
}



/* ═══════════════════════════════════
   Existing generateID override
═══════════════════════════════════ */
function generateID() {
  var app = getCurrentApplicant();
  var dateIssued = document.getElementById('id-date-issued')?.value || '';
  var controlNo = document.getElementById('id-control-no')?.value || '';
  if (!app) { showToast('Please select an applicant first.', 'error'); return; }
  if (!dateIssued || !controlNo) { showToast('Date issued and control number are required.', 'error'); return; }
  updatePreview();
}

function sendFromIssuanceToIdMaker() {
  var app = getCurrentApplicant();
  if (!app) { showToast('Please select an applicant first.', 'error'); return; }
  var dateIssued = document.getElementById('id-date-issued')?.value || '';
  var controlNo = document.getElementById('id-control-no')?.value || '';
  if (!dateIssued || !controlNo) { showToast('Date issued and control number are required before sending.', 'error'); return; }

  // Build queue entry — only printing-relevant data (data minimization)
  var queueEntry = {
    id: app.id,
    name: app.name,
    firstName: app.firstName || '',
    middleName: app.middleName || '',
    surname: app.surname || app.name || '',
    address: app.address || '—',
    barangay: app.barangay || '—',
    dob: app.dob || '',
    gender: app.gender || '',
    photo: app.photo || fallbackMedia(app.name),
    signature: app.signature || fallbackMedia(app.name),
    controlNo: controlNo,
    dateIssued: dateIssued,
    printStatus: 'Queued',
    regDate: app.regDate || ''
  };

  // Add or replace in ID Maker queue
  var existingIdx = -1;
  for (var i = 0; i < ID_MAKER_QUEUE.length; i++) {
    if (ID_MAKER_QUEUE[i].id === app.id) { existingIdx = i; break; }
  }
  if (existingIdx >= 0) {
    ID_MAKER_QUEUE[existingIdx] = queueEntry;
  } else {
    ID_MAKER_QUEUE.push(queueEntry);
  }

  // Transition application status to In Process
  if (APP_DB[app.id]) {
    APP_DB[app.id].status = 'In Process';
    syncApplicationsTableBadge(app.id, 'In Process');
  }

  // Re-render ID Maker queue + KPIs (guarded — idmaker.js is only loaded in the ID Maker portal)
  if (typeof initIdMakerQueue === 'function') initIdMakerQueue();
  if (typeof updateIdMakerKPIs === 'function') updateIdMakerKPIs();

  // Audit + notify
  appendAudit(CURRENT_USER?.displayName || 'Staff', 'Sent to ID Maker via ID Issuance', CURRENT_ROLE);
  addNotifyLog(app.id, 'Sent to ID Maker', 'System', 'Delivered');

  showToast(app.name + ' sent to ID Maker (In Process)', 'success');
  clearIDForm();
}
function clearIDForm() {
  ['id-applicant', 'id-fullname', 'id-address', 'id-dob', 'id-sex', 'id-date-issued', 'id-control-no'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') el.value = '';
    else el.value = '';
  });
  document.getElementById('preview-name').textContent = '________________';
  document.getElementById('preview-address').textContent = '________________';
  document.getElementById('preview-dob').textContent = '________________';
  document.getElementById('preview-sex').textContent = '________________';
  document.getElementById('preview-date-issued').textContent = '________________';
  document.getElementById('preview-control-no').textContent = '________________';
  document.getElementById('preview-photo').src = '';
  document.getElementById('preview-photo').style.display = 'none';
  document.getElementById('preview-photo-fallback').style.display = 'block';
  document.getElementById('preview-photo-fallback').textContent = '--';
  document.getElementById('preview-signature').src = '';
  document.getElementById('preview-signature').style.display = 'none';
  document.getElementById('preview-sign-fallback').style.display = 'block';
  showToast('Small form cleared.', 'info');
}
/* ── Logout with confirmation ── */
function requestLogout() {
  const modal = document.getElementById('logout-confirm-modal');
  const userEl = document.getElementById('confirm-logout-user');
  const roleEl = document.getElementById('confirm-logout-role');
  if (userEl) userEl.textContent = CURRENT_USER?.displayName || document.getElementById('current-user-name')?.textContent || 'Current user';
  if (roleEl) roleEl.textContent = `${CURRENT_ROLE} account`;
  if (modal) modal.classList.add('show');
}

function closeLogoutConfirm() {
  document.getElementById('logout-confirm-modal')?.classList.remove('show');
}

function confirmLogout() {
  closeLogoutConfirm();
  logout();
}

function logout() {
  clearAuthSession();
  CURRENT_USER = null;
  CURRENT_ROLE = 'Staff';
  closeModal();
  closeLogoutConfirm();
  if (PAGE === 'login') {
    showLoginPage();
    showToast('Signed out successfully.', 'info');
  } else {
    location.href = 'login.html?loggedout=1';
  }
}

/* ── Toast (kept from your design language) ── */
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  const icons = {
    success: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" clip-rule="evenodd"/></svg>',
    error: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>',
    info: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>'
  };
  const titles = { success: 'Success', error: 'Error', info: 'Info' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `${icons[type]}<div class="toast-body"><div class="toast-title">${titles[type]}</div><div class="toast-desc">${msg}</div></div><button class="toast-close" onclick="removeToast(this.closest('.toast'))"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button>`;
  c.appendChild(t);
  setTimeout(() => removeToast(t), 4000);
}
function removeToast(t) { if (!t) return; t.classList.add('removing'); setTimeout(() => t.remove(), 280); }

/* Password visibility toggle */
function togglePwVis(btn) {
  const input = btn.closest('.auth-input-wrap').querySelector('.auth-input');
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fi fi-rr-eye-crossed';
  } else {
    input.type = 'password';
    icon.className = 'fi fi-rr-eye';
  }
}

function syncLoginPanel(role) {
  const shell = document.querySelector('#login-page .auth-shell');
  const title = document.getElementById('auth-panel-title');
  const desc = document.getElementById('auth-panel-desc');
  const action = document.getElementById('auth-panel-action');
  const loginTitle = document.getElementById('login-title');
  const loginSub = document.getElementById('login-subtitle');
  const isStaff = role === 'staff';
  const isIdMaker = role === 'id-maker';
  const isAdmin = !isStaff && !isIdMaker;
  shell?.classList.toggle('staff-mode', isStaff);

  // Hero panel (cross-navigation prompt)
  if (title) title.textContent = isStaff ? 'Admin account?' : (isIdMaker ? 'Staff or Admin account?' : 'Staff account?');
  if (desc) desc.textContent = isStaff
    ? 'Return to administrator access for user control, reports, audit logs, and system settings.'
    : (isIdMaker
      ? 'ID Maker access: review applications, update status, and manage ID printing.'
      : 'Switch to staff access for daily operations, application review, and ID release tasks.');
  if (action) {
    action.setAttribute('onclick', `selectLoginRole('${isStaff ? 'admin' : 'staff'}')`);
    action.querySelector('span').textContent = isStaff ? 'Admin Login' : 'Staff Login';
    action.querySelector('i').className = isStaff ? 'fi fi-sr-shield-check' : 'fi fi-rr-user';
  }

  // Login form title/subtitle — switch the visible form to the selected role so the
  // staff/admin/id-maker login forms clearly swap on the same screen.
  if (loginTitle) loginTitle.textContent = isAdmin ? 'Welcome back, Admin User!' : (isIdMaker ? 'Welcome back, Jayrold!' : 'Welcome back, Staff User!');
  if (loginSub) loginSub.textContent = isAdmin
    ? 'Sign in to manage users, settings, logs, and backups'
    : (isIdMaker
      ? 'Sign in to review applications, update status, and manage ID printing'
      : 'Sign in to manage applicants and daily processing work');
}

const baseSelectLoginRole = window.selectLoginRole;
window.selectLoginRole = function (role) {
  if (typeof baseSelectLoginRole === 'function') baseSelectLoginRole(role);
  syncLoginPanel(role);
};

const baseShowLoginPage = window.showLoginPage;
window.showLoginPage = function () {
  if (typeof baseShowLoginPage === 'function') baseShowLoginPage();
  requestAnimationFrame(() => {
    syncLoginPanel(document.querySelector('.login-role-card.active')?.dataset.loginRole || 'admin');
  });
};

/* ═══════════════════════════════════
   SESSION TIMEOUT (30 min inactivity)
═══════════════════════════════════ */
let inactivityTimer = null;
const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (!CURRENT_USER) return;
  inactivityTimer = setTimeout(() => {
    showToast('Session expired due to inactivity (DPA compliant).', 'error');
    logout();
  }, INACTIVITY_MS);
}
['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, resetInactivityTimer, { passive: true });
});

/* ═══════════════════════════════════
   ACTIVITY LOG FILTERING
═══════════════════════════════════ */

/* ═══════════════════════════════════
   USER MANAGEMENT CRUD
═══════════════════════════════════ */





/* ═══════════════════════════════════
   APPLICANTS BARANGAY FILTER
═══════════════════════════════════ */
function filterApplicantsByBarangay(barangay) {
  document.querySelectorAll('#applicants-tbody tr').forEach(r => {
    if (!barangay) { r.style.display = ''; return; }
    const rowBarangay = r.children[2]?.textContent?.trim() || '';
    r.style.display = rowBarangay === barangay ? '' : 'none';
  });
}

function filterApplicantsByStatus(status) {
  document.querySelectorAll('#applicants-tbody tr').forEach(r => {
    if (!status || status === 'All Status') { r.style.display = ''; return; }
    const badge = r.querySelector('.badge');
    const rowStatus = badge ? badge.textContent.trim() : '';
    r.style.display = rowStatus === status ? '' : 'none';
  });
}

/* Init */
/* ── Applications table dynamic renderer (frontend demo data) ── */
const APPL_AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#FDE68A,#D97706)',
  'linear-gradient(135deg,#34D399,#059669)',
  'linear-gradient(135deg,#93C5FD,#2563EB)',
  'linear-gradient(135deg,#F9A8D4,#DB2777)',
  'linear-gradient(135deg,#C4B5FD,#7C3AED)',
  'linear-gradient(135deg,#FCA5A5,#DC2626)',
  'linear-gradient(135deg,#6EE7B7,#10B981)',
  'linear-gradient(135deg,#86EFAC,#16A34A)'
];

function appInitials(name) {
  return (name || '--').trim().replace(/\s+/g, ' ').split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '--';
}

function appRegDate(id) {
  const a = APP_DB[id] || FULL_APPLICANTS.find(x => x.id === id);
  if (a && a.regDate) {
    const d = new Date(a.regDate + 'T00:00:00');
    if (!isNaN(d)) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return '—';
}

function mapStatusForDropdown(status) {
  const s = String(status || '').trim();
  // Return exact match if it's a known status
  const known = ['Pending', 'Unverified', 'Under Review', 'Verified', 'In Process', 'Ready for Release', 'ID Issued', 'Completed', 'Rejected'];
  if (known.includes(s)) return s;
  // Fallback mapping for legacy/variant strings
  const sl = s.toLowerCase();
  if (/reject/.test(sl)) return 'Rejected';
  if (/id.issued|issued/.test(sl)) return 'ID Issued';
  if (/completed/.test(sl)) return 'Completed';
  if (/ready.for.release|release/.test(sl)) return 'Ready for Release';
  if (/verified/.test(sl)) return 'Verified';
  if (/under.review/.test(sl)) return 'Under Review';
  if (/unverified/.test(sl)) return 'Unverified';
  if (/pending/.test(sl)) return 'Pending';
  return 'In Process';
}

function statusOptionCfg(status) {
  const map = {
    'Pending': ['clock', '#C07A0A'],
    'Unverified': ['document', '#D97706'],
    'Under Review': ['document', '#1A4FBA'],
    'Verified': ['checkmark', '#059669'],
    'In Process': ['checkmark', '#0B9E6C'],
    'Ready for Release': ['truck', '#7C3AED'],
    'ID Issued': ['check', '#6B5BD1'],
    'Completed': ['check', '#0B9E6C'],
    'Rejected': ['x', '#D9233A']
  };
  return map[status] || ['clock', '#C07A0A'];
}

function buildStatusSelect(appId, status) {
  const current = mapStatusForDropdown(status);
  const optionOrder = ['Pending', 'Under Review', 'Verified', 'In Process', 'Ready for Release', 'ID Issued', 'Completed', 'Rejected'];
  const opts = optionOrder.map(o => {
    const cfg = statusOptionCfg(o);
    const active = o === current ? ' active' : '';
    return '<button type="button" class="status-select__option' + active + '" data-status="' + o + '" data-icon="' + cfg[0] + '" data-color="' + cfg[1] + '" onclick="selectStatusOption(this,event)">' +
      '<span class="status-select__option-icon" style="color:' + cfg[1] + '"><svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + getStatusIconSvg(cfg[0]) + '</svg></span>' +
      '<span>' + o + '</span></button>';
  }).join('');
  const cur = statusOptionCfg(current);
  return '<div class="status-select" data-app-id="' + appId + '">' +
    '<button type="button" class="status-select__trigger" onclick="toggleStatusSelect(this,event)">' +
    '<span class="status-select__icon" style="color:' + cur[1] + '"><svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + getStatusIconSvg(cur[0]) + '</svg></span>' +
    '<span class="status-select__label">' + current + '</span>' +
    '<svg class="status-select__arrow" viewBox="0 0 12 12" fill="currentColor"><path d="M3 4l3 3 3-3"/></svg>' +
    '</button>' +
    '<div class="status-select__menu">' + opts + '</div>' +
    '</div>';
}

/* Update status tab counts based on visible table rows */
function updateStatusTabCounts() {
  const tbody = document.getElementById('applications-tbody');
  if (!tbody) return;
  const counts = { all: 0, pending: 0, unverified: 0, review: 0, verified: 0, process: 0, release: 0, issued: 0, completed: 0, rejected: 0 };
  const labelToKey = {
    'Pending': 'pending',
    'Unverified': 'unverified',
    'Under Review': 'review',
    'Verified': 'verified',
    'In Process': 'process',
    'Ready for Release': 'release',
    'ID Issued': 'issued',
    'Completed': 'completed',
    'Rejected': 'rejected'
  };
  tbody.querySelectorAll('tr').forEach(function (row) {
    counts.all++;
    const label = row.querySelector('.status-select__label');
    if (label) {
      const key = labelToKey[label.textContent.trim()];
      if (key) counts[key]++;
    }
  });
  // Update badge counts in the status tabs
  document.querySelectorAll('#mod-applications .chip-count').forEach(function (el) {
    const key = el.dataset.countKey;
    if (key && counts[key] !== undefined) el.textContent = counts[key];
  });
  // Update the 'All' tab data-count attribute
  const allTab = document.querySelector('#mod-applications .status-tab[data-key="all"]');
  if (allTab) allTab.dataset.count = counts.all;
}

function renderApplicationsTable() {
  const tbody = document.getElementById('applications-tbody');
  if (!tbody) return;
  const rows = FULL_APPLICANTS.map((a, i) => {
    const grad = APPL_AVATAR_GRADIENTS[i % APPL_AVATAR_GRADIENTS.length];
    return '<tr data-app-id="' + a.id + '">' +
      '<td style="width:40px"><input type="checkbox" class="row-check" data-app-id="' + a.id + '" aria-label="Select ' + (a.name || '') + '" onchange="updateBatchState()" /></td>' +
      '<td><div class="applicant-cell">' +
      '<div class="applicant-avatar" style="background:' + grad + '">' + appInitials(a.name) + '</div>' +
      '<div class="applicant-info"><span class="applicant-name">' + a.name + '</span><span class="applicant-id">' + a.id + '</span></div>' +
      '</div></td>' +
      '<td><span class="cell-text">' + appRegDate(a.id) + '</span></td>' +
      '<td><span class="cell-text">' + (a.barangay || '—') + '</span></td>' +
      '<td>' + buildStatusSelect(a.id, a.status) + '</td>' +
      '<td><span class="cell-text">' + (a.reviewer || 'Unassigned') + '</span></td>' +
      '<td style="text-align:right"><button class="row-action always-visible" onclick="openApplicationDetail(\'' + a.id + '\')">View →</button></td>' +
      '</tr>';
  }).join('');
  tbody.innerHTML = rows;
  // Update the status tab counts after rendering
  updateStatusTabCounts();
}

function runOptionalInit(label, fn) {
  try {
    if (typeof fn === 'function') fn();
  } catch (err) {
    console.error(label + ' failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  syncLoginPanel(document.querySelector('.login-role-card.active')?.dataset.loginRole || 'admin');

  // Standalone login page: session restore decides whether to show the login
  // screen, the logout confirmation, or to bounce an active session to its portal.
  if (PAGE === 'login') {
    restoreSession();
    return;
  }

  // --- Portal page initialization (admin.html / staff.html / idmaker.html) ---

  // Show the role dashboard first. Optional widgets below should never leave
  // the protected shell hidden if one widget has a browser-specific error.
  restoreSession();

  // Small form issuance initialization
  runOptionalInit('Small form issuance init', initSmallFormIssuance);
  runOptionalInit('Small form preview init', updatePreview);

  // ID Maker production queue initialization (only present in the ID Maker portal)
  runOptionalInit('ID Maker queue init', typeof initIdMakerQueue === 'function' ? initIdMakerQueue : null);

  // Role switcher toggle (sidebar) — available to all roles in the demo
  window.toggleRoleSwitcher = function () {
    const switcher = document.getElementById('role-switcher');
    if (!switcher) return;
    switcher.style.display = switcher.style.display === 'none' ? 'block' : 'none';
  };

  applyRoleToUI();
  applySessionContext();

  // Enable dashboard scorecard click state so cards stay highlighted after click
  runOptionalInit('Dashboard card init', initDashboardCardClick);

  // Docs summary default
  runOptionalInit('Documents summary init', updateDocsSummary);

  // Close modal on backdrop click (guarded — modals may not exist in every role portal)
  const appModalEl = document.getElementById('app-modal');
  if (appModalEl) appModalEl.addEventListener('click', (e) => {
    if (e.target.id === 'app-modal') closeModal();
  });
  const idcardModalEl = document.getElementById('idcard-modal');
  if (idcardModalEl) idcardModalEl.addEventListener('click', (e) => {
    if (e.target.id === 'idcard-modal') closeIdCardModal();
  });
  const printDetailModalEl = document.getElementById('print-detail-modal');
  if (printDetailModalEl) printDetailModalEl.addEventListener('click', (e) => {
    if (e.target.id === 'print-detail-modal') closePrintDetail();
  });

  // Start session inactivity timer
  runOptionalInit('Session timer init', resetInactivityTimer);

  // Applicants barangay + status filter wiring
  const applicantsBarangaySel = document.querySelector('#mod-applicants .filter-select');
  const applicantsStatusSel = document.querySelectorAll('#mod-applicants .filter-select')[1];
  if (applicantsBarangaySel) applicantsBarangaySel.addEventListener('change', function () { filterApplicantsByBarangay(this.value); });
  if (applicantsStatusSel) applicantsStatusSel.addEventListener('change', function () { filterApplicantsByStatus(this.value); });

  // Render the full applications table from the dataset so every record is viewable
  runOptionalInit('Applications table render', renderApplicationsTable);
});

/* ── Table Sort ── */
// Sort direction tracker per tbody:col key
const _sortState = {};

/**
 * Sort a data-table tbody by the given column index.
 * @param {string} tbodyId  – id of the <tbody>
 * @param {number} colIdx   – 0-based column indexr
 * @param {HTMLElement} thEl – the clicked <th> (for arrow toggle)
 */
function sortTable(tbodyId, colIdx, thEl) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const key = tbodyId + ':' + colIdx;
  const asc = _sortState[key] = !_sortState[key]; // toggle

  // Collect rows (skip hidden rows used by status filter)
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort(function (a, b) {
    let aVal = (a.cells[colIdx] || {}).innerText || '';
    let bVal = (b.cells[colIdx] || {}).innerText || '';

    aVal = aVal.trim().toLowerCase();
    bVal = bVal.trim().toLowerCase();

    // Detect numeric values (handles commas like "1,245")
    const aNum = parseFloat(aVal.replace(/,/g, ''));
    const bNum = parseFloat(bVal.replace(/,/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return asc ? aNum - bNum : bNum - aNum;
    }
n    // Detect dates ("Apr 7, 2026" style)
    const aDate = Date.parse(aVal);
    const bDate = Date.parse(bVal);
    if (!isNaN(aDate) && !isNaN(bDate)) {
      return asc ? aDate - bDate : bDate - aDate;
    }

    // Fall back to string comparison
    if (aVal < bVal) return asc ? -1 : 1;
    if (aVal > bVal) return asc ? 1 : -1;
    return 0;
  });
n  // Re-append rows in sorted order
  rows.forEach(function (row) { tbody.appendChild(row); });

  // Update sort arrows: reset all <th> in this table, then set active one
  const table = tbody.closest('table');
  if (table) {
    table.querySelectorAll('th .sort-icon').forEach(function (icon) {
      icon.textContent = '↕';
      icon.style.opacity = '';
    });
  }
  const activeIcon = thEl.querySelector('.sort-icon');
  if (activeIcon) {
    activeIcon.textContent = asc ? '↑' : '↓';
    activeIcon.style.opacity = '1';
  }
}

