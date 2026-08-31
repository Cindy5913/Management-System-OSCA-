# 🏛️ Senior Citizens Bureau — ID Management System

A web-based portal for managing senior citizen applications, ID issuance, and staff operations for the **Office of the Senior Citizens Affairs (OSCA)**, Municipality of Bauan.

Compliant with **RA 10173** (Data Privacy Act) and **RA 9994** (Expanded Senior Citizens Act).

---

## ✨ Features

- **Dashboard** — Real-time KPIs, charts, and AI-powered analytics
- **Application Management** — Review, approve, or reject senior citizen applications
- **ID Printing** — CR80 credit card–sized ID generation with front/back preview and batch printing
- **User Management** — Role-based access control (Admin, Staff, ID Maker)
- **System Settings** — Office hours, barangay list, age threshold, SMS templates
- **Backup & Recovery** — Manual and scheduled backups with cloud sync
- **Audit Logs** — Filterable activity trail with PII masking for DPA compliance
- **Notifications** — SMS/email logs and applicant tracking

---

## 🚀 Quick Start

### Option 1 — Node.js (recommended)

```bash
node local-server.js --port=5500
```

Open [http://localhost:5500/login.html](http://localhost:5500/login.html)

### Option 2 — Python

```bash
python -m http.server 5500
```

### Option 3 — VS Code Live Server

Install the **Live Server** extension → right-click `login.html` → *Open with Live Server*.

> **No backend or database required.** The app is 100% static HTML/CSS/JS with relative paths — it works on any HTTP server.

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Staff | `staff` | `staff123` |
| ID Maker | `idmaker` | `idmaker123` |

---

## 📁 Project Structure

```
├── login.html        # Login page with role selector
├── admin.html        # Admin portal (dashboard, users, settings, logs, backups)
├── staff.html        # Staff portal (daily operations, application review)
├── idmaker.html      # ID Maker portal (production queue, ID printing)
├── app.js            # Core JS — auth, RBAC, navigation, charts, modals, data
├── admin.js          # Admin logic — user mgmt, backups, activity logs, settings
├── staff.js          # Staff logic — KPI switcher
├── idmaker.js        # ID Maker logic — production queue, print status, analytics
├── base.css          # Shared design system (tokens, layout, components)
├── admin.css         # Admin-specific styles
├── staff.css         # Staff-specific styles
├── idmaker.css       # ID Maker-specific styles
├── portal-logo.jpg   # OSCA logo
└── local-server.js   # Built-in dev server (Node.js)
```

---

## 🛡️ Compliance

| Requirement | Implementation |
|---|---|
| **RA 10173** (Data Privacy Act) | PII masking in logs, consent tracking, data encryption, access audits |
| **RA 9994** (Senior Citizens Act) | ID card format, privilege reminders, barcode generation |
| **Session Security** | 30-min timeout, login audit logging, role-based access |

---

## 🌐 Server Compatibility

Works on **any** HTTP server with zero configuration:

| Server | How to use |
|---|---|
| VS Code Live Server | Right-click `login.html` → Open with Live Server |
| Node.js | `node local-server.js --port=5500` |
| Python | `python -m http.server 5500` |
| Nginx / Apache | Copy files to web root |
| GitHub Pages | Push to `gh-pages` branch |
| Netlify / Vercel | Drag & drop the folder |

---

## 🛠️ Tech Stack

- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Chart.js** — Data visualization
- **Flaticon Uicons** — Icon library
- **Google Fonts** — Plus Jakarta Sans, DM Sans, Space Grotesk
- **Puppeteer Core** — PDF generation (server-side, optional)

---

## 📄 License

This is a capstone project implementation for educational purposes.
