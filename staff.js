// Role-based KPI Switcher - Staff Dashboard with Visible Icons & Trends
// All icons verified. Values zeroed until integrated with the live system.

// Staff KPI data (5 cards - accurate icons)
// TODO(integration): populate value/trend from the other application system.
const STAFF_KPIS = [
  {
    label: 'Total applications',
    value: '0',
    sub: 'System Volume',
    icon: 'fi fi-rr-apps',
    trend: '—',
    trendClass: 'trend-up',
    iconWrap: 'iwrap-blue'
  },
  {
    label: 'Pending Review',
    value: '0',
    sub: 'Awaiting action',
    icon: 'fi fi-rr-clock',
    trend: '—',
    trendClass: 'trend-up',
    iconWrap: 'iwrap-warn'
  },
  {
    label: 'Approved Today',
    value: '0',
    sub: 'Completed this shift',
    icon: 'fi fi-rr-check-double',
    trend: '—',
    trendClass: 'trend-good',
    iconWrap: 'iwrap-green'
  },
  {
    label: 'Applications processed',
    value: '0',
    sub: 'This month',
    icon: 'fi fi-rr-chart-line-up',
    trend: '—',
    trendClass: 'trend-good',
    iconWrap: 'iwrap-teal'
  },
  {
    label: 'Rejected Applications',
    value: '0',
    sub: 'This month',
    icon: 'fi fi-rr-x',
    trend: '—',
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
  // Only restyle the KPI strips for the role the core actually adopted —
  // a gated (blocked) switch must not change the dashboard view.
  if (typeof CURRENT_ROLE !== 'undefined') switchKPIs(CURRENT_ROLE);
};

// Auto-init — apply the correct KPI display based on the logged-in role
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CURRENT_ROLE !== 'undefined' && CURRENT_ROLE) {
    switchKPIs(CURRENT_ROLE);
  }
});

async function loadApplicationsFromDatabase() {
  try {
    const response = await fetch("http://localhost:5000/api/applications");

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load applications");
    }

    console.log("Applications loaded from database:", result.applications);

    displayApplications(result.applications);

  } catch (error) {
    console.error("Error loading applications:", error);

    if (typeof showToast === "function") {
      showToast("Failed to load applications.", "error");
    }
  }
}

function displayApplications(applications) {
  const tbody = document.getElementById("applications-tbody");

  if (!tbody) {
    console.error("applications-tbody not found.");
    return;
  }

  tbody.innerHTML = "";

  applications.forEach((application) => {

    const fullName = [
      application.first_name,
      application.middle_name,
      application.surname
    ]
      .filter(Boolean)
      .join(" ");

    const date = application.created_at
      ? new Date(application.created_at).toLocaleDateString()
      : "—";

    const barangay = application.barangay_district || "—";

    const status = application.status || "Pending";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <input
          type="checkbox"
          class="row-check"
          data-app-id="${application.application_id}"
        >
      </td>

      <td>
        <div class="applicant-name">${fullName || "Unnamed Applicant"}</div>
        <div class="applicant-id">${application.application_id || "—"}</div>
      </td>

      <td>${date}</td>

      <td data-label="Barangay">
        ${barangay}
      </td>

      <td>
        <span class="status-select__label">
          ${status}
        </span>
      </td>
    `;

    tbody.appendChild(row);
  });

  console.log(`${applications.length} applications displayed.`);
}

// Load complete application details when the existing Open button is used
async function loadApplicationDetails(applicationId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applications/${encodeURIComponent(applicationId)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch application details");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Failed to load application details"
      );
    }

    console.log("Complete application details:", result);

    return result;

  } catch (error) {
    console.error("Error loading application details:", error);

    if (typeof showToast === "function") {
      showToast("Failed to load application details.", "error");
    }

    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadApplicationsFromDatabase();
});