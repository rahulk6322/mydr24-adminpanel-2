# MyDR24 · Healthcare Operating System (HOS) — Enterprise Super Admin Panel

A production-grade, enterprise, **multi-tenant SaaS** super admin panel for **MyDR24 (Accufly Healthcare Pvt. Ltd.)** — unifying clinical operations, CRM, finance, emergency dispatch, AI analytics, field workforce and platform governance into a single Healthcare Operating System.

Built as a fast, dependency-light **single-page application** with a custom enterprise design system, role-based navigation, dark/light theming, and **60 purpose-built modules** (no empty placeholders — every navigation item resolves to a real, styled page).

---

## ▶️ Running it

This is a static front-end. Because it uses CDN libraries, open it through a local web server (recommended) so the browser can load everything cleanly:

```bash
# from the project root
python3 -m http.server 8080
# then open http://localhost:8080
```

Or simply open `index.html` in a modern browser. An internet connection is required for the CDN libraries (Tailwind, Chart.js, ApexCharts, DataTables, Leaflet, Font Awesome, Google Fonts).

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Markup | HTML5 |
| Styling | Tailwind CSS (Play CDN) + custom design-system tokens |
| Logic | Vanilla JavaScript (ES6+), classic scripts on a global `MyDR24` namespace |
| Charts | Chart.js + ApexCharts |
| Tables | DataTables (jQuery) |
| Maps | Leaflet (CARTO tiles) |
| Dates | Flatpickr |
| Icons / Fonts | Font Awesome 6 · Inter / Plus Jakarta Sans / JetBrains Mono |

No build step required.

---

## 📁 Project Structure

```
index.html                     App shell, CDN includes, script load order
assets/
  css/
    design-system.css          Tokens, theming (dark/light), glassmorphism, components
    layout.css                 App shell: sidebar, topbar, modal, toast, responsive
  js/
    tailwind.config.js         Tailwind runtime config → maps CSS variables to utilities
    config.js                  Roles (RBAC), tenants, navigation tree, route lookup, state
    data.js                    Mock data layer (aligned to the v5.0 reference figures)
    components.js              Reusable UI + chart/table/kanban/map/modal/toast helpers
    router.js                  Hash router (#/route) with resource cleanup
    app.js                     Shell bootstrap: sidebar, topbar, theme/role/tenant switch,
                               command palette (Cmd/Ctrl+K), notifications
    pages/
      dashboards.js            Executive Command Center + CEO/COO/CFO/CMO/CTO/Growth, Live Ops, AI Insights
      patients.js              Patient directory, 360° profile, segmentation, RPM, care plans
      doctors.js               Directory, credentialing, consult queue, performance, commission
      caregivers.js            Directory, live geo-tracking (map), requirement center, shifts, AI planning
      emergency.js             Command center, live ambulance map, AI triage, hospital beds, demand heatmap
      crm.js                   CRM, corporate/insurance, partners, leads, sales pipeline (kanban),
                               referrals, marketing suite, appointments
      finance.js               Finance dashboard, billing, subscriptions, dynamic pricing, HRMS/payroll
      modules.js               Home healthcare, analytics, AI models, complaints, SaaS admin,
                               tenants, security/SIEM, compliance, audit, tasks, settings + generic fallback
```

---

## 🧭 Architecture Notes

- **Single namespace** — everything attaches to `window.MyDR24` (`App`). Scripts are classic (non-module) and load in dependency order, so the app works without a bundler.
- **Routing** — `App.router` maps `#/<id>` to a registered page. Each page is `App.pages[id] = { render(route), init(route) }`. `render` returns an HTML string; `init` wires charts/maps/tables after paint. Any unregistered route falls back to `App.pages._generic`.
- **Navigation** — declared once in `config.js` as a tree of sections → items → children, then flattened into `App.routes`. Add a nav entry and a matching `App.pages` renderer to extend the panel.
- **Resource cleanup** — charts, maps, DataTables and live timers are tracked and destroyed on every route change (`App.ui.cleanup`) to prevent leaks.
- **Theming** — design tokens are CSS variables (RGB triplets) consumed by Tailwind utilities; dark/light is a `class`/`data-theme` toggle persisted to `localStorage`. Charts re-render on theme change to pick up new colors.
- **RBAC scaffolding** — 9 roles and 5 tenants are switchable from the topbar; navigation is structured so production can scope items per role.

---

## ✨ Highlights

- **Executive Command Center** with revenue trajectory + AI forecast, business/org health rings, live activity feed and AI executive insights.
- **Emergency dispatch** with live ambulance map, AI triage simulator, hospital bed network and PIN-level demand heatmap.
- **Caregiver live geo-tracking** with status-coded map pins, geofence verification and field alerts.
- **Sales pipeline & workflow boards** with real drag-and-drop kanban.
- **Dynamic pricing engine, subscriptions, finance, compliance matrix, SIEM, audit logs** and a full **multi-tenant SaaS admin**.
- **Command palette** (Cmd/Ctrl+K) to jump to any of the 60 modules.

---

## 🚀 Advanced Capabilities & Engineering Principles

Beyond the module set, the panel ships an advanced platform layer built on solid front-end principles:

- **Reactive store + event bus** (`store.js`) — a single source of truth for appearance preferences using the observer pattern (`App.bus.on/emit`), persisted to `localStorage` and applied before first paint (no flash).
- **Appearance controls** (topbar ⚙ slider icon) — live **accent color** theming (6 palettes), **density** (Comfortable/Compact via rem-grid scaling), **sidebar rail/collapse** mode, and **motion** (Full/Reduced). All persist across reloads.
- **Accessibility (a11y)** — skip-to-content link, ARIA roles/labels (`navigation`, `banner`, `main`, `search`, `dialog`), `aria-current` on the active route, keyboard-operable nav groups, visible focus-visible rings, and **`prefers-reduced-motion`** honored automatically.
- **Accessible modals** — `role="dialog"` + `aria-modal`, full **focus trap** (Tab/Shift+Tab cycle), Escape to close, and focus restoration to the triggering element.
- **Upgraded command palette** (`⌘/Ctrl + K`) — searches **modules + live records** (patients, doctors, leads) with grouped results and full **keyboard navigation** (↑ ↓ to move, ↵ to open).
- **Working CSV export** — every "Export" button streams a real, correctly-escaped `.csv` of the current view's data table (`ui.exportCSV`), with the table registry reset on each navigation to avoid stale exports.
- **Resilience** — global `error` / `unhandledrejection` handlers surface a throttled toast instead of crashing; boot and per-page render/init are wrapped in `try/catch` so one failing widget never takes down the panel.
- **Lifecycle hygiene** — charts, maps, DataTables, live timers and the export registry are tracked and torn down on every route change (`App.ui.cleanup`) to prevent leaks.

## 🔌 Production Wiring (next steps)
The `data.js` layer is mock data shaped like real API responses. To productionise: replace the `App.data` getters with `fetch`/WebSocket calls to your backend (FHIR R4, ABDM/ABHA, payments, dispatch, RPM streams), enforce `item.roles` in the navigation per authenticated user, and feed the live panels from your event stream.

---

© Accufly Healthcare Pvt. Ltd. · MyDR24 Healthcare Operating System. Built as an original enterprise interface inspired by established product patterns — no proprietary designs or code reproduced.
