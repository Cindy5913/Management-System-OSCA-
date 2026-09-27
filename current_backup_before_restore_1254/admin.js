// ============================================================
// ADMIN — role-specific module: user management, system backup,
// activity/audit log filtering, and settings panel switching.
// Loaded after app.js (shared core).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    renderUserMgmtTable();
    renderAuditTable();
    renderBackupHistory();
  }, 100);

  ['approval','rejection'].forEach(kind => {
    const ta = document.getElementById('tpl-sms-' + kind);
    if(ta) ta.addEventListener('input', () => updateSmsCount('tpl-sms-' + kind, 'tpl-counter-' + kind));
  });
  updateSmsCount('tpl-sms-approval', 'tpl-counter-approval');
  updateSmsCount('tpl-sms-rejection', 'tpl-counter-rejection');
});

function inviteUser(){
  showToast('User invitation sent! (demo)', 'success');
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Invited new user', 'Admin');
}

function toggleUserStatus(key){
  const user = DEMO_USERS[key];
  if(!user) return;
  user.status = user.status === 'Inactive' ? 'Active' : 'Inactive';
  appendAudit(CURRENT_USER?.displayName || 'Admin', `${user.status === 'Inactive' ? 'Disabled' : 'Enabled'} user: ${user.displayName}`, 'Admin');
  showToast(`User ${user.displayName} ${user.status === 'Inactive' ? 'disabled' : 'enabled'}`, user.status === 'Inactive' ? 'error' : 'success');
  renderUserTable();
}

function editUser(key){
  const user = DEMO_USERS[key];
  if(!user) return;
  showToast(`Editing ${user.displayName} (demo — form would open here)`, 'info');
}

function updateUserRole(key, newRole){
  if(!DEMO_USERS[key]) return;
  DEMO_USERS[key].role = newRole;
  appendAudit(CURRENT_USER?.displayName || 'Admin', `Changed ${DEMO_USERS[key].displayName} role to ${newRole}`, 'Admin');
  showToast(`Role updated: ${DEMO_USERS[key].displayName} → ${newRole}`, 'success');
}

function runSystemBackup(){
  showToast('Manual encrypted backup started. You can keep working while it runs.','info');
  setTimeout(()=>showToast('Backup completed successfully. Restore point verified.','success'), 900);
}

function exportActivityLogs(){
  showToast('Activity logs exported with DPA-safe metadata.','success');
}

/* ══════════════════════════════════════════════════════════════
   NEW: Dedicated Admin Console modules (B / C / D / E)
══════════════════════════════════════════════════════════════ */

// Expanded personnel accounts for Module B (RBAC)
const ADMIN_USER_ACCOUNTS = [
  { key:'cindy', fullName:'Cindy H. Bulanhagui', username:'cindy', designation:'OSCA Administrator', role:'Admin', email:'cindy.bulanhagui@scb.gov.ph', status:'Active', lastActive:'Today 10:48 AM' },
  { key:'ramon', fullName:'Ramon Punzalan', username:'ramon', designation:'Frontline Staff', role:'Staff', email:'ramon.punzalan@scb.gov.ph', status:'Active', lastActive:'Today 09:30 AM' },
  { key:'ana', fullName:'Ana Dela Cruz', username:'ana', designation:'Application Reviewer', role:'Staff', email:'ana.delacruz@scb.gov.ph', status:'Active', lastActive:'Yesterday 04:12 PM' },
  { key:'jayrold', fullName:'Jayrold Manalo', username:'jayrold', designation:'ID Card Producer', role:'ID Maker', email:'jayrold.manalo@scb.gov.ph', status:'Active', lastActive:'Today 10:05 AM' },
  { key:'ding', fullName:'Ding Reyes', username:'ding', designation:'ID Card Producer', role:'ID Maker', email:'ding.reyes@scb.gov.ph', status:'Inactive', lastActive:'Apr 2, 2026' },
  { key:'marilou', fullName:'Marilou Santos', username:'marilou', designation:'Frontline Staff', role:'Staff', email:'marilou.santos@scb.gov.ph', status:'Inactive', lastActive:'Mar 28, 2026' },
  { key:'pedro', fullName:'Pedro Gomez', username:'pedro', designation:'Data Encoder', role:'Staff', email:'pedro.gomez@scb.gov.ph', status:'Inactive', lastActive:'Mar 20, 2026' },
  { key:'lena', fullName:'Elena Ramirez', username:'lena', designation:'Application Reviewer', role:'Staff', email:'elena.ramirez@scb.gov.ph', status:'Inactive', lastActive:'Mar 12, 2026' }
];
let editingUserKey = null;

function roleColorMap(role){
  const colors = { Admin:'linear-gradient(135deg,#E0E9FF,#93B4FF)', Staff:'linear-gradient(135deg,#FDE68A,#D97706)', 'ID Maker':'linear-gradient(135deg,#C4B5FD,#7140D8)' };
  return colors[role] || colors.Staff;
}

function renderUserMgmtTable(){
  const tbody = document.getElementById('user-mgmt-tbody');
  if(!tbody) return;
  const q = (document.getElementById('user-search')?.value || '').toLowerCase();
  const roleF = document.getElementById('user-role-filter')?.value || '';
  const statusF = document.getElementById('user-status-filter')?.value || '';

  const filtered = ADMIN_USER_ACCOUNTS.filter(u => {
    const matchQ = !q || (u.fullName + ' ' + u.username + ' ' + u.role + ' ' + u.designation).toLowerCase().includes(q);
    const matchRole = !roleF || u.role === roleF;
    const matchStatus = !statusF || u.status === statusF;
    return matchQ && matchRole && matchStatus;
  });

  tbody.innerHTML = '';
  filtered.forEach(u => {
    const initials = u.fullName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const isActive = u.status === 'Active';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="applicant-cell"><div class="applicant-avatar" style="background:${roleColorMap(u.role)}">${initials}</div><div class="applicant-info"><span class="applicant-name" title="${u.fullName}">${u.fullName}</span><span class="applicant-id" title="${u.email}">${u.email}</span></div></div></td>
      <td><span class="cell-text" title="${u.username}">${u.username}</span></td>
      <td><span class="badge ${u.role==='Admin'?'badge-issued':u.role==='Staff'?'badge-active':'badge-review'}">${u.role}</span></td>
      <td><span class="cell-text" title="${u.designation}">${u.designation}</span></td>
      <td><span class="badge status-pill ${u.status==='Active'?'badge-active':'badge-inactive'}"><span class="status-dot ${isActive?'dot-active':'dot-inactive'}"></span>${u.status}</span></td>
      <td><span class="cell-text" title="${u.lastActive}">${u.lastActive}</span></td>
      <td style="text-align:right;white-space:nowrap">
        <div class="row-actions">
          <button class="icon-btn" title="Edit Account" aria-label="Edit Account" onclick="editUser('${u.key}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
          <button class="icon-btn" title="Reset Password" aria-label="Reset Password" onclick="openUserActions('${u.key}')"><i class="fi fi-rr-rotate-left"></i></button>
          <button class="icon-btn ${isActive?'danger':'success'}" title="${isActive?'Disable Account':'Enable Account'}" aria-label="${isActive?'Disable':'Enable'} Account" onclick="toggleMgmtUserStatus('${u.key}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg></button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  const footer = document.getElementById('user-mgmt-footer');
  if(footer) footer.textContent = `Showing ${filtered.length} of ${ADMIN_USER_ACCOUNTS.length} accounts`;
  const totalEl = document.getElementById('users-total'); if(totalEl) totalEl.textContent = ADMIN_USER_ACCOUNTS.length;
  const activeEl = document.getElementById('users-active'); if(activeEl) activeEl.textContent = ADMIN_USER_ACCOUNTS.filter(u=>u.status==='Active').length;
  const inactiveEl = document.getElementById('users-inactive'); if(inactiveEl) inactiveEl.textContent = ADMIN_USER_ACCOUNTS.filter(u=>u.status!=='Active').length;
  const idmEl = document.getElementById('users-idmaker'); if(idmEl) idmEl.textContent = ADMIN_USER_ACCOUNTS.filter(u=>u.role==='ID Maker').length;
}

function filterUsers(){
  renderUserMgmtTable();
}

function openUserModal(mode, key){
  editingUserKey = (mode === 'edit') ? key : null;
  const title = document.getElementById('user-modal-title');
  const sub = document.getElementById('user-modal-sub');
  title.textContent = editingUserKey ? 'Edit User' : 'Add New User';
  sub.textContent = editingUserKey ? 'Update OSCA personnel account' : 'Register OSCA personnel';

  if(editingUserKey){
    const u = ADMIN_USER_ACCOUNTS.find(x=>x.key===key);
    if(u){
      document.getElementById('um-fullname').value = u.fullName;
      document.getElementById('um-designation').value = u.designation;
      document.getElementById('um-username').value = u.username;
      document.getElementById('um-email').value = u.email;
      document.getElementById('um-role').value = u.role;
      document.getElementById('um-status').value = u.status;
      document.getElementById('um-password').value = '';
    }
  } else {
    ['um-fullname','um-designation','um-username','um-email','um-password'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('um-role').value = 'Staff';
    document.getElementById('um-status').value = 'Active';
  }
  updateRolePermHint();
  document.getElementById('user-modal').classList.add('show');
}

function closeUserModal(){
  document.getElementById('user-modal')?.classList.remove('show');
}

function updateRolePermHint(){
  const role = document.getElementById('um-role')?.value || 'Staff';
  const textEl = document.getElementById('role-perm-hint-text');
  if(!textEl) return;
  if(role === 'ID Maker'){
    textEl.textContent = 'OSCA ID Maker accounts are locked to printing functionalities (print queue, status updates, and card production only). No application review or export access.';
  } else if(role === 'Admin'){
    textEl.textContent = 'Admin accounts receive full access: user management, audit logs, system configuration, backups, and all review capabilities.';
  } else {
    textEl.textContent = 'OSCA Staff accounts receive application review access (approve/reject/export), applicant management, and ID issuance.';
  }
}

function saveUser(){
  const fullName = document.getElementById('um-fullname').value.trim();
  const username = document.getElementById('um-username').value.trim();
  if(!fullName || !username){
    showToast('Full Name and Username are required.', 'error');
    return;
  }
  const role = document.getElementById('um-role').value;
  const status = document.getElementById('um-status').value;
  const designation = document.getElementById('um-designation').value.trim() || (role === 'ID Maker' ? 'ID Card Producer' : 'OSCA Staff');

  if(editingUserKey){
    const u = ADMIN_USER_ACCOUNTS.find(x=>x.key===editingUserKey);
    if(u){
      u.fullName = fullName; u.username = username; u.role = role; u.status = status;
      u.designation = designation;
      u.email = document.getElementById('um-email').value.trim() || u.email;
    }
    appendAudit(CURRENT_USER?.displayName || 'Admin', `Updated user: ${fullName} (role → ${role})`, 'Admin');
    showToast(`User ${fullName} updated successfully`, 'success');
  } else {
    ADMIN_USER_ACCOUNTS.push({ key:'u'+Date.now(), fullName, username, designation, role, email: document.getElementById('um-email').value.trim(), status, lastActive:'Never logged in' });
    appendAudit(CURRENT_USER?.displayName || 'Admin', `Created user: ${fullName} (${role})`, 'Admin');
    showToast(`User ${fullName} created successfully`, 'success');
  }
  closeUserModal();
  renderUserMgmtTable();
}

function editUser(key){
  openUserModal('edit', key);
}

function toggleMgmtUserStatus(key){
  const u = ADMIN_USER_ACCOUNTS.find(x=>x.key===key);
  if(!u) return;
  u.status = u.status === 'Active' ? 'Inactive' : 'Active';
  appendAudit(CURRENT_USER?.displayName || 'Admin', `${u.status==='Inactive'?'Deactivated':'Reactivated'} user: ${u.fullName}`, 'Admin');
  showToast(`${u.fullName} ${u.status==='Inactive'?'deactivated':'reactivated'} (history preserved)`, u.status==='Inactive'?'error':'success');
  renderUserMgmtTable();
}

function openUserActions(key){
  window._resetUserKey = key;
  const u = ADMIN_USER_ACCOUNTS.find(x=>x.key===key);
  document.getElementById('ua-modal-title').textContent = `Reset Credentials — ${u ? u.fullName : ''}`;
  document.getElementById('ua-modal-desc').textContent = 'Force a secure login credential update for this account.';
  document.getElementById('user-actions-modal').classList.add('show');
}

function closeUserActionsModal(){
  document.getElementById('user-actions-modal')?.classList.remove('show');
}

function resetUserCredentials(){
  const key = window._resetUserKey;
  const u = ADMIN_USER_ACCOUNTS.find(x=>x.key===key);
  if(u){
    appendAudit(CURRENT_USER?.displayName || 'Admin', `Reset credentials for: ${u.fullName}`, 'Admin');
    showToast(`Credentials reset for ${u.fullName}. Password change forced.`, 'success');
  }
  closeUserActionsModal();
}

function exportUsers(){
  showToast('User list exported with DPA-safe metadata (demo).', 'success');
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Exported user accounts list (CSV)', 'Admin');
}

/* ── Module C: Audit Logs & Activity Monitor (FR-19) ── */
const AUDIT_LOG_DATA = [
  { ts:'Apr 8, 2026 10:48 AM', user:'Cindy Bulanhagui', role:'Admin', action:'Approved Application SCB-2026-00421', ip:'192.168.1.25', device:'Win11 · Chrome' },
  { ts:'Apr 8, 2026 10:15 AM', user:'Cindy Bulanhagui', role:'Admin', action:'Exported CSV Report (PII masked)', ip:'192.168.1.25', device:'Win11 · Chrome' },
  { ts:'Apr 8, 2026 10:05 AM', user:'Jayrold', role:'ID Maker', action:'Updated Card Status to Printed — SCB-2026-00418', ip:'192.168.1.34', device:'Win10 · Edge' },
  { ts:'Apr 8, 2026 09:56 AM', user:'Ramon Punzalan', role:'Staff', action:'Applicant record viewed (5x) — SCB-2026-00502', ip:'192.168.1.40', device:'Win11 · Firefox' },
  { ts:'Apr 8, 2026 09:40 AM', user:'System', role:'System', action:'Encrypted backup completed (postgres)', ip:'cloud', device:'AWS · Region AP-South' },
  { ts:'Apr 8, 2026 09:12 AM', user:'Ana Dela Cruz', role:'Staff', action:'Application status updated to In Review — SCB-2026-00415', ip:'192.168.1.41', device:'Win11 · Chrome' },
  { ts:'Apr 8, 2026 08:56 AM', user:'Cindy Bulanhagui', role:'Admin', action:'Changed Staff role for Ramon Punzalan', ip:'192.168.1.25', device:'Win11 · Chrome' },
  { ts:'Apr 8, 2026 08:30 AM', user:'Unknown', role:'—', action:'Failed Login Attempt (3x) — username: admin', ip:'203.177.88.19', device:'Android · Mobile' },
  { ts:'Apr 7, 2026 05:20 PM', user:'Jayrold', role:'ID Maker', action:'Updated Card Status to Queued — SCB-2026-00421', ip:'192.168.1.34', device:'Win10 · Edge' },
  { ts:'Apr 7, 2026 05:02 PM', user:'Cindy Bulanhagui', role:'Admin', action:'Enabled Two-Factor Authentication policy', ip:'192.168.1.25', device:'Win11 · Chrome' },
  { ts:'Apr 7, 2026 04:12 PM', user:'Ana Dela Cruz', role:'Staff', action:'Export of applicant report (Excel)', ip:'192.168.1.41', device:'Win11 · Chrome' },
  { ts:'Apr 7, 2026 02:00 AM', user:'System', role:'System', action:'Automated daily backup executed', ip:'cloud', device:'AWS · Region AP-South' }
];

function determineAuditActionType(action){
  const a = action.toLowerCase();
  if(a.includes('approve') || a.includes('rejected')) return 'approve';
  if(a.includes('status') || a.includes('print')) return 'status';
  if(a.includes('export')) return 'export';
  if(a.includes('login') || a.includes('failed')) return 'login';
  if(a.includes('backup') || a.includes('restor')) return 'backup';
  if(a.includes('user') || a.includes('role') || a.includes('password') || a.includes('two-factor')) return 'user';
  return 'other';
}

function renderAuditTable(){
  const tbody = document.getElementById('audit-logs-tbody');
  if(!tbody) return;
  const q = (document.getElementById('audit-search')?.value || '').toLowerCase();
  const userF = document.getElementById('audit-user-filter')?.value || '';
  const actionF = document.getElementById('audit-action-filter')?.value || '';
  const from = document.getElementById('audit-date-from')?.value || '';
  const to = document.getElementById('audit-date-to')?.value || '';

  const filtered = AUDIT_LOG_DATA.filter(e => {
    const matchQ = !q || (e.action + ' ' + e.user + ' ' + e.role + ' ' + e.ip).toLowerCase().includes(q);
    const matchUser = !userF || e.user === userF;
    const matchAction = !actionF || determineAuditActionType(e.action) === actionF;
    return matchQ && matchUser && matchAction;
  });

  tbody.innerHTML = filtered.map(e => {
    const roleBadge = e.role === 'Admin' ? 'badge-issued' : (e.role === 'ID Maker' ? 'badge-review' : (e.role === 'System' ? 'badge-inactive' : 'badge-active'));
    return `<tr>
      <td><span class="cell-text">${e.ts}</span></td>
      <td><span class="cell-text">${e.user}</span></td>
      <td><span class="badge ${roleBadge}">${e.role}</span></td>
      <td><span class="cell-text">${e.action}</span></td>
      <td><span class="cell-text" style="font-family:var(--font-data)">${e.ip}</span></td>
      <td><span class="cell-text">${e.device}</span></td>
    </tr>`;
  }).join('');

  const footer = document.getElementById('audit-logs-footer');
  if(footer) footer.textContent = `Showing ${filtered.length} of ${AUDIT_LOG_DATA.length} events`;
  const label = document.getElementById('audit-count-label');
  if(label) label.textContent = `${filtered.length} of ${AUDIT_LOG_DATA.length} system events`;
}

function filterAuditLogs(){ renderAuditTable(); }

function filterAuditLog(period){
  const bar = document.querySelector('[data-period-bar]');
  if(bar){
    bar.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.period === period));
  }
  const rows = document.querySelectorAll('#audit-summary-tbody tr');
  rows.forEach(r => {
    const tags = (r.dataset.period || '').split(',');
    r.style.display = (!r.dataset.period || tags.includes(period)) ? '' : 'none';
  });
  const label = document.getElementById('audit-summary-sub');
  if(label){
    const visible = Array.from(rows).filter(r => r.style.display !== 'none').length;
    label.textContent = period === '5' ? 'Last 5 sensitive actions' : (period === '24h' ? 'Sensitive actions (last 24h)' : 'Sensitive actions (last 7d)');
    const total = rows.length;
    if(period !== '5' && visible < total) label.textContent += ` · ${visible}/${total} shown`;
  }
}

function exportAuditLog(){
  const rows = Array.from(document.querySelectorAll('#audit-summary-tbody tr')).filter(r => r.style.display !== 'none');
  const header = ['Time','User','Action'];
  const data = rows.map(r => {
    const cells = Array.from(r.querySelectorAll('td')).slice(0, 3).map(td => td.textContent.trim().replace(/,/g, ';'));
    return cells.join(',');
  });
  const csv = [header.join(','), ...data].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-summary-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Exported audit summary (CSV)', 'Admin');
  showToast('Audit summary exported (' + rows.length + ' rows) — DPA-safe CSV','success');
}

function resetAuditFilters(){
  ['audit-search','audit-user-filter','audit-action-filter','audit-date-from','audit-date-to'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  renderAuditTable();
}

function exportAuditReport(){
  showToast('Audit report exported with DPA metadata (demo).', 'success');
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Exported audit trail report', 'Admin');
}

/* ── Module D: System Configuration ── */
function saveSystemConfig(){
  const open = document.getElementById('cfg-open-time')?.value || '07:00';
  const close = document.getElementById('cfg-close-time')?.value || '18:00';
  appendAudit(CURRENT_USER?.displayName || 'Admin', `Updated system configuration (office hours ${open}–${close})`, 'Admin');
  showToast('System configuration saved successfully.', 'success');
}

/* ── Module D: SMS template counters & actions ── */
const DEFAULT_SMS_TEMPLATES = {
  approval: 'Dear {name}, your Senior Citizen ID application (ID: {id}) has been APPROVED. Please visit the OSCA office within 7 days to claim your ID card. - OSCA {barangay}',
  rejection: 'Dear {name}, your Senior Citizen ID application (ID: {id}) requires additional documentation. Please visit OSCA office with the required papers. - OSCA {barangay}'
};

function countSmsSegments(text){
  const len = (text || '').length;
  if(len === 0) return { len:0, segments:0, capacity:160 };
  const segments = len <= 160 ? 1 : Math.ceil(len / 153);
  const capacity = segments === 1 ? 160 : segments * 153;
  return { len, segments, capacity };
}

function updateSmsCount(taId, counterId){
  const el = document.getElementById(taId);
  const counter = document.getElementById(counterId);
  if(!el || !counter) return;
  const { len, segments, capacity } = countSmsSegments(el.value);
  counter.textContent = `${len}/${capacity} characters • ${segments} SMS`;
  counter.classList.toggle('over', len > 160);
}

function tplReset(){
  const approval = document.getElementById('tpl-sms-approval');
  const rejection = document.getElementById('tpl-sms-rejection');
  const barangay = document.getElementById('tpl-barangay-select');
  if(approval) approval.value = DEFAULT_SMS_TEMPLATES.approval;
  if(rejection) rejection.value = DEFAULT_SMS_TEMPLATES.rejection;
  if(barangay) barangay.value = '';
  updateSmsCount('tpl-sms-approval', 'tpl-counter-approval');
  updateSmsCount('tpl-sms-rejection', 'tpl-counter-rejection');
  showToast('SMS templates reset to defaults', 'info');
}

function tplSave(){
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Updated SMS notification templates', 'Admin');
  showToast('SMS templates saved successfully', 'success');
}

/* ── Module E: Backup & Recovery (FR-20) ── */
let backupIsRunning = false;
const BACKUP_HISTORY = [
  { ts:'Apr 8, 2026 02:00 AM', type:'Automatic · Daily', size:'1.8 GB', status:'Success', loc:'gs://osca-backups/daily/2026-04-08' },
  { ts:'Apr 7, 2026 02:00 AM', type:'Automatic · Daily', size:'1.7 GB', status:'Success', loc:'gs://osca-backups/daily/2026-04-07' },
  { ts:'Apr 6, 2026 02:00 AM', type:'Automatic · Daily', size:'1.7 GB', status:'Success', loc:'gs://osca-backups/daily/2026-04-06' },
  { ts:'Apr 4, 2026 02:00 AM', type:'Weekly · Archive', size:'9.4 GB', status:'Success', loc:'gs://osca-backups/weekly/2026-04-04' },
  { ts:'Apr 1, 2026 03:10 PM', type:'Manual · Snapshot', size:'1.6 GB', status:'Success', loc:'gs://osca-backups/manual/2026-04-01' }
];

function renderBackupHistory(){
  const tbody = document.getElementById('backup-history-tbody');
  if(!tbody) return;
  tbody.innerHTML = BACKUP_HISTORY.map(b => {
    const typeBadge = b.type.includes('Manual') ? 'badge-review' : (b.type.includes('Weekly') ? 'badge-issued' : 'badge-active');
    return `<tr>
      <td><span class="cell-text">${b.ts}</span></td>
      <td><span class="badge ${typeBadge}">${b.type}</span></td>
      <td><span class="cell-text" style="font-family:var(--font-data)">${b.size}</span></td>
      <td><span class="badge badge-approved">${b.status}</span></td>
      <td><span class="cell-text" style="font-family:var(--font-data)">${b.loc}</span></td>
      <td style="text-align:right"><button class="row-action always-visible" onclick="restoreFromHistory('${b.ts}')">Restore</button></td>
    </tr>`;
  }).join('');
}

function executeBackup(){
  if(backupIsRunning) return;
  backupIsRunning = true;
  const btn = document.getElementById('btn-execute-backup');
  if(btn) { btn.disabled = true; btn.style.opacity = '.6'; }
  const orig = btn ? btn.textContent : '';
  if(btn) btn.innerHTML = '<i class="fi fi-rr-loader" style="margin-right:8px"></i> Creating point-in-time snapshot…';
  showToast('Manual encrypted backup started. You can keep working while it runs.', 'info');

  setTimeout(() => {
    const now = new Date().toLocaleString('en-US', { month:'short', day:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
    BACKUP_HISTORY.unshift({ ts:now, type:'Manual · Snapshot', size:'1.6 GB', status:'Success', loc:'gs://osca-backups/manual/latest' });
    renderBackupHistory();
    const title = document.getElementById('bk-last-title');
    if(title) title.textContent = `Last backup: ${now}`;
    const kpi = document.getElementById('kpi-backup');
    if(kpi) kpi.textContent = 'Just now';
    appendAudit(CURRENT_USER?.displayName || 'Admin', 'Executed immediate database backup', 'Admin');
    showToast('Backup completed successfully. Restore point verified.', 'success');
    if(btn){ btn.disabled = false; btn.style.opacity = ''; btn.textContent = 'Execute Immediate Database Backup'; }
    backupIsRunning = false;
  }, 1500);
}

function restoreFromHistory(ts){
  showToast(`Restoration initiated from snapshot: ${ts} (demo)`, 'info');
  appendAudit(CURRENT_USER?.displayName || 'Admin', `Initiated restore from ${ts}`, 'Admin');
}

function initiateRestore(){
  const sel = document.getElementById('restore-point-select');
  const point = sel ? sel.value : 'Latest restore point';
  showToast(`Restoration from "${point}" started. Database will restart shortly (demo).`, 'info');
  appendAudit(CURRENT_USER?.displayName || 'Admin', `Initiated database restoration from ${point}`, 'Admin');
}

function verifyRestorePoint(){
  showToast('Restore point verified. Integrity check passed.', 'success');
  appendAudit(CURRENT_USER?.displayName || 'Admin', 'Verified database restore point', 'Admin');
}
