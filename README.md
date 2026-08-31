Senior Citizens Bureau — ID Management System

A web-based management portal designed for the Office of the Senior Citizens Affairs (OSCA), Municipality of Bauan. The system streamlines citizen record administration, application processing, and ID issuance while ensuring operational transparency and data privacy compliance (RA 10173 and RA 9994).

Key Features

- Role-Based Access (RBAC): Tailored dashboards for Applicants, Staff, ID Makers, and Administrators.
- Application Processing: Fast review, approval, rejection, and tracking of senior citizen records.
- System Monitoring & Security: Real-time storage tracking, visual audit logging with PII masking, automated backups, and security alerts.

Quick Start
Run instantly on any HTTP server (no database or backend configuration required):

1. Node.js: `node local-server.js --port=5500`
2. Python: `python -m http.server 5500`
3. VS Code Live Server: Right-click `login.html` → *Open with Live Server*

Open [`http://localhost:5500/login.html`](http://localhost:5500/login.html) to access the system.

Demo Credentials

| Role      | Username | Password   |
|   Admin   |  admin   |  admin123  |
|   Staff   |  staff   |  staff123  |
| ID Maker  |  idmaker |  idmaker123|


Project Structure
├── login.html         Portal entry point & role authentication
├── admin.html         Admin dashboard (users, settings, logs, backups)
├── staff.html         Staff dashboard (application processing & intake)
├── idmaker.html       ID Maker dashboard (production queue & card layout)
├── app.js             Core architecture (auth, RBAC, modal control, state)
├── admin.js           Admin logic (user lifecycle, backups, audit system)
├── staff.js           Staff logic (KPI tracking, application evaluation)
├── idmaker.js         ID Maker logic (print queue, card rendering, analytics)
├── base.css           Global design tokens, layout grid, and shared UI components
├── admin.css          Dedicated styling for Admin portal
├── staff.css          Dedicated styling for Staff portal
├── idmaker.css        Dedicated styling for ID Maker portal
├── portal-logo.jpg    Official OSCA municipal logo
└── local-server.js    Built-in Node.js development server

Created by: Cindy B.
