# MyDR24 · Healthcare Operating System (HOS) — React Edition

An advanced, production-grade **Enterprise Super Admin Panel** for **MyDR24 (Accufly Healthcare Pvt. Ltd.)**, built with **React 18 + Vite + Tailwind CSS**. Role-based, multi-tenant, dark/light themed, accessible, and architected with clean component/context separation.

Every navigation item resolves to a real, styled page — flagship modules are fully built, and the long tail is handled by a consistent data-driven template.

---

## ▶️ Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build && npm run preview
```

> The app loads a few libraries from CDN at runtime (Leaflet maps, Font Awesome icons, Google Fonts), so keep an internet connection for the dev server.

---

## 🧱 Tech stack & principles

| Concern | Choice | Principle |
|--------|--------|-----------|
| Build | Vite 5 | Fast dev server + optimized builds |
| UI | React 18 (hooks, function components) | Composition over inheritance |
| Routing | react-router-dom 6 | Declarative, nested routes + redirects |
| Styling | Tailwind CSS 3 + CSS-variable design tokens | Theme-aware utilities (dark/light/accent) |
| Charts | Recharts | Pure-React, responsive, theme-driven |
| Maps | Leaflet (via CDN) wrapped in a React component | Imperative lib isolated behind a clean effect |
| State | React Context (`AppContext`, `ToastContext`) | Single source of truth, no prop drilling |
| Resilience | `ErrorBoundary` per route + global handling | One screen failing never crashes the app |
| A11y | Focus-visible rings, skip link, ARIA, focus-trapped modal, reduced-motion | Inclusive by default |

---

## 📁 Structure

```
src/
  main.jsx                 App entry
  App.jsx                  Providers + router + route table
  index.css                Design system: tokens, themes, shell, a11y, density, accent
  lib/
    format.js              inr/num/initials/colorFor/statusVariant + rng
    data.js                Mock data (v5.0 figures) shaped like API responses
    nav.js                 roles, tenants, accents, nav tree, flattened routes
  context/
    AppContext.jsx         theme/role/tenant/appearance prefs + useApp/useChartTheme
    ToastContext.jsx       ToastProvider + useToast
  components/
    ErrorBoundary.jsx
    MapView.jsx            Leaflet wrapper (markers, circles, theme tiles)
    ui/                    Primitives, Modal (focus-trap), DataTable, Kanban, Dropdown
    charts/Charts.jsx      AreaTrend, Bars, Donut (Recharts, theme-aware)
    layout/               Sidebar, Topbar, CommandPalette, Shell
  pages/
    dashboards/           Executive, Leadership (6 C-suite), LiveOps, AiInsights
    Patients.jsx, PatientProfile.jsx, Doctors.jsx, Caregivers.jsx, Emergency.jsx
    CRM.jsx (CRM + Leads), Pipeline.jsx, Finance.jsx, Intelligence.jsx
    GenericModule.jsx      Data-driven fallback for every other nav item
```

---

## ✨ Highlights

- **Executive Command Center** with revenue + AI forecast, health rings, live feed and AI insights.
- **Leadership dashboards** (CEO/COO/CFO/Medical Director/CTO/Growth) from a single config-driven component.
- **Live Operations** with auto-refreshing telemetry and activity feed.
- **Patient 360°** profile (routed via `/patients/:id`), **Emergency** command + live ambulance/heatmap **maps**, **AI triage** simulator.
- **Sales pipeline** with real drag-and-drop Kanban; **DataTable** with search, sort, pagination and **CSV export**.
- **Command palette** (`⌘/Ctrl + K`) searching modules + patients + doctors + leads with keyboard navigation.
- **Appearance controls**: accent color, density, sidebar rail, reduced-motion — all persisted.

---

## 🔌 Production wiring

`src/lib/data.js` is mock data shaped like API responses. Swap the exports for `fetch`/WebSocket calls (FHIR R4, ABDM/ABHA, payments, dispatch, RPM streams), enforce per-role navigation in `lib/nav.js`, and feed the live panels from your event stream.

---

© Accufly Healthcare Pvt. Ltd. · MyDR24 Healthcare Operating System. Original enterprise interface inspired by established product patterns.
