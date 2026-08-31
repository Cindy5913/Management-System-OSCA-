// Role-based KPI Switcher - Staff Dashboard with Visible Icons & Trends
// All icons verified, Pending trend now '+3', Rejected uses clear X icon

// Staff KPI data (5 cards - accurate icons)
const STAFF_KPIS = [
  {
    label: 'Total applications',
    value: '1,245',
    sub: 'System Volume',
    icon: 'fi fi-rr-apps',
    trend: '+12 %',
    trendClass: 'trend-up',
    iconWrap: 'iwrap-blue'
  },
  {
    label: 'Pending Review',
    value: '8',
    sub: 'Awaiting action',
    icon: 'fi fi-rr-clock',
    trend: '+3',
    trendClass: 'trend-up',
    iconWrap: 'iwrap-warn'
  },
  {
    label: 'Approved Today',
    value: '4',
    sub: 'Completed this shift',
    icon: 'fi fi-rr-check-double',
    trend: '+4 today',
    trendClass: 'trend-good',
    iconWrap: 'iwrap-green'
  },
  {
    label: 'Applications processed',
    value: '180',
    sub: 'This month',
    icon: 'fi fi-rr-chart-line-up',
    trend: '+15 %',
    trendClass: 'trend-good',
    iconWrap: 'iwrap-teal'
  },
  {
    label: 'Rejected Applications',
    value: '8',
    sub: 'This month',
    icon: 'fi fi-rr-x',
    trend: '+2',
    trendClass: 'trend-down',
    iconWrap: 'iwrap-red'
  }
];

function switchKPIs(role) {
  const adminStrip = document.querySelector('.admin-kpi-strip');
  const staffStrip = document.getElementById('staff-kpi-strip');
  
  if (role === 'Staff') {
    adminStrip.style.display = 'none';
    
    if (!staffStrip) {
      const staffContainer = document.createElement('div');
      staffContainer.id = 'staff-kpi-strip';
      staffContainer.className = 'admin-kpi-strip';
      
      STAFF_KPIS.forEach((kpi, i) => {
        const card = document.createElement('div');
        card.className = `stat-card${i === 1 ? ' stat-card--warn' : ''}`;
        card.innerHTML = `
          <div class="stat-card__top">
            <div class="stat-card__icon-wrap iwrap-${kpi.iconWrap}">
              <i class="${kpi.icon} ic-${kpi.iconWrap === 'iwrap-blue' ? 'blue' : kpi.iconWrap.replace('iwrap-','')}"></i>
            </div>
            <div class="stat-card__meta">
              <div class="stat-card__trend ${kpi.trendClass}">${kpi.trend || kpi.trendText || ''}</div>
            </div>
          </div>
          <div class="stat-card__body">
            <div class="stat-card__label">${kpi.label}</div>
            <div class="stat-card__value">${kpi.value}</div>
            <div class="stat-card__sub">${kpi.sub}</div>
          </div>
        `;
        staffContainer.appendChild(card);
      });
      
      adminStrip.parentNode.insertBefore(staffContainer, adminStrip.nextSibling);
    } else {
      staffStrip.style.display = 'grid';
    }
    
    document.querySelectorAll('.admin-only-panel, .ai-panel').forEach(el => el.style.display = 'none');
    document.getElementById('dashboard-role-badge').textContent = 'Staff View';
    document.getElementById('dashboard-title').textContent = 'Staff Dashboard';
    
  } else if (role === 'ID Maker') {
    adminStrip.style.display = 'none';
    const idMakerStaffStrip = document.getElementById('staff-kpi-strip');
    if (idMakerStaffStrip) idMakerStaffStrip.style.display = 'none';
    document.querySelectorAll('.admin-only-panel, .ai-panel').forEach(el => el.style.display = 'none');
    const idBadge = document.getElementById('dashboard-role-badge');
    const idTitle = document.getElementById('dashboard-title');
    if (idBadge) idBadge.textContent = 'ID Maker View';
    if (idTitle) idTitle.textContent = 'ID Maker Dashboard';
  } else {
    adminStrip.style.display = 'grid';
    const staffStrip = document.getElementById('staff-kpi-strip');
    if (staffStrip) staffStrip.remove();
    
    document.querySelectorAll('.admin-only-panel, .ai-panel').forEach(el => el.style.display = '');
    document.getElementById('dashboard-role-badge').textContent = 'Admin View';
    document.getElementById('dashboard-title').textContent = 'Dashboard';
  }
}

// Override setRole if exists
const originalSetRole = window.setRole || (() => {});
window.setRole = function(role, silent = false) {
  originalSetRole(role, silent);
  switchKPIs(role);
};

// Auto-init — apply the correct KPI display based on the logged-in role
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CURRENT_ROLE !== 'undefined' && CURRENT_ROLE) {
    switchKPIs(CURRENT_ROLE);
  }
});
