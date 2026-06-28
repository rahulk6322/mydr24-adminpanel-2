# MyDR24 · Healthcare Super Admin Panel (React)

A clean, fully-functional hospital **super admin panel** built with **React 18 + Vite + Tailwind CSS + Recharts**. Dark/light theme, responsive layout, charts, searchable tables, and 8 working pages.

## 🚀 Easiest way to run (no commands)

> Install **Node.js** once from [nodejs.org](https://nodejs.org) (LTS).

1. **Download** and **EXTRACT** the ZIP (right-click → *Extract All*). Don't run from inside the ZIP.
2. Open this **`admin-react`** folder.
3. **Windows:** double-click **`start-windows.bat`**.
   It auto-installs everything and opens the app in your browser at **http://localhost:5173**.
4. To stop: press **Ctrl + C** in the black window.

## ▶️ Or run with a terminal
```bash
npm install
npm run dev
```

## 📦 Pages
Dashboard · Patients · Doctors · Appointments · Departments · Pharmacy · Reports · Settings

## 🧱 Structure
```
src/
  main.jsx, App.jsx        Entry + router
  index.css                Design tokens + theme + components
  theme.jsx                Dark/light theme context
  data.js                  Mock data (patients, doctors, appointments…)
  components/
    Layout.jsx             Sidebar + Topbar shell
    ui.jsx                 Card, StatCard, Badge, Avatar, DataTable, Progress
    Charts.jsx             Recharts (area, bar, donut) — theme aware
  pages/                   Dashboard, Patients, Doctors, Appointments,
                           Departments, Pharmacy, Reports, Settings
```

Mock data lives in `src/data.js` — swap it for real API calls to go live.
