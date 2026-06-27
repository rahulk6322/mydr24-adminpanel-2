<!--
  MyDR24 Healthcare Operating System (HOS)
  Enterprise Super Admin Panel — Master Documentation
  © Accufly Healthcare Pvt. Ltd.
-->

<div align="center">

# ⚕️ MyDR24 — Healthcare Operating System (HOS)
### Enterprise Super Admin Panel · Master Documentation

**Accufly Healthcare Pvt. Ltd.**
Version 5.0 · Document Revision 1.0

</div>

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Scope](#2-product-vision--scope)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Design System](#5-design-system)
6. [Role-Based Access Control (RBAC)](#6-role-based-access-control-rbac)
7. [Multi-Tenant SaaS Model](#7-multi-tenant-saas-model)
8. [Module Catalogue](#8-module-catalogue)
9. [Key Performance Indicators](#9-key-performance-indicators)
10. [AI & Intelligence Layer](#10-ai--intelligence-layer)
11. [Security & Compliance](#11-security--compliance)
12. [Codebase & File Structure](#12-codebase--file-structure)
13. [How to Run](#13-how-to-run)
14. [Extending the Platform](#14-extending-the-platform)
15. [Production Wiring Roadmap](#15-production-wiring-roadmap)
16. [Glossary](#16-glossary)

---

## 1. Executive Summary

MyDR24 HOS is a **production-grade, enterprise, multi-tenant SaaS Super Admin Panel** that unifies the entire operations of a modern digital health platform into a single Healthcare Operating System. It is **not** a simple CRM or dashboard — it consolidates clinical workflows, field workforce, emergency dispatch, CRM, growth, finance, AI analytics and platform governance under one role-aware command surface.

The current deliverable is a **dependency-light single-page application (SPA)** with **60 purpose-built modules** — every navigation entry resolves to a real, styled, data-rich page (no empty placeholders). It is designed to be credible to investors, hospitals, government healthcare programs and large-scale SaaS deployments.

| Attribute | Detail |
|----------|--------|
| Product | MyDR24 Healthcare Operating System (HOS) |
| Owner | Accufly Healthcare Pvt. Ltd. |
| Type | Enterprise multi-tenant SaaS Super Admin Panel |
| Modules | 60 (across 7 functional sections) |
| Dashboards | 15+ (executive, leadership, operational, live) |
| KPIs surfaced | 1,000+ across 4 analytics layers |
| Themes | Dark & Light (persisted) |
| Responsiveness | Desktop / Tablet / Mobile |
| Accessibility | WCAG-oriented contrast, focus states, semantic structure |

---

## 2. Product Vision & Scope

### 2.1 Vision
A single operating system for healthcare delivery — enabling a platform operator to run hospitals, clinics, home healthcare, emergency services, diagnostics, corporates, insurance partners, franchises and government healthcare programs from one console.

### 2.2 In Scope (this deliverable)
- Complete front-end design system and application shell
- Role-based navigation across all functional domains
- Fully rendered modules with charts, tables, maps, kanban boards, forms, modals and notifications
- Realistic mock data layer shaped like production API responses
- Multi-tenant and multi-role switching

### 2.3 Out of Scope (future / backend)
- Live backend services, authentication providers and databases
- Real device/telemetry ingestion (RPM streams), payment gateways and dispatch radios
- Persistent storage beyond browser `localStorage` (theme/role/tenant preferences)

---

## 3. System Architecture

### 3.1 Architectural Style
A **modular SPA** built on a single global namespace (`window.MyDR24`, aliased `App`). Scripts are classic (non-module) and load in dependency order, so the application runs **without a build step or bundler**.

```
┌──────────────────────────────────────────────────────────────┐
│                         index.html                            │
│  (CDN libraries + ordered application scripts + mount points) │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
   config.js              data.js              components.js
 (roles, nav,          (mock data layer,     (UI builders + chart/
  routes, state)        KPIs, entities)       table/map/kanban/modal)
        │                     │                      │
        └──────────────┬──────┴───────────┬──────────┘
                       ▼                  ▼
                  pages/*.js          router.js
              (60 page renderers)   (#/route resolver
                       │             + resource cleanup)
                       └──────────────┬──────────────┘
                                      ▼
                                   app.js
                       (shell: sidebar, topbar, theme,
                        role/tenant switch, command palette)
```

### 3.2 Rendering Model
- Each module registers as `App.pages[id] = { render(route), init(route) }`.
- `render()` returns an **HTML string**; `init()` runs after paint to attach charts, maps and tables.
- The router resolves `#/<id>` → page; unknown routes fall back to `App.pages._generic`.

### 3.3 Lifecycle & Cleanup
On every route change, `App.ui.cleanup()` destroys tracked Chart.js/ApexCharts instances, Leaflet maps, DataTables and live `setInterval` timers — preventing memory leaks during navigation.

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|------|-----------|---------|
| Markup | HTML5 | Document structure |
| Styling | Tailwind CSS (Play CDN) + custom design system | Utility-first styling + tokens |
| Logic | Vanilla JavaScript (ES6+) | App logic on global namespace |
| Charts | Chart.js + ApexCharts | Line/bar/donut/scatter + radial/spark |
| Tables | DataTables (jQuery) | Sort/search/paginate data grids |
| Maps | Leaflet + CARTO tiles | Live geo-tracking, dispatch, heatmaps |
| Dates | Flatpickr | Date pickers in forms |
| Icons | Font Awesome 6 | Iconography |
| Fonts | Inter · Plus Jakarta Sans · JetBrains Mono | Typography system |

No compilation, transpilation or package install is required.

---

## 5. Design System

### 5.1 Tokens
Design tokens are CSS variables expressed as **RGB triplets** (for Tailwind `<alpha-value>` support), enabling theme-aware utilities. Surfaces: `--c-bg`, `--c-surface`, `--c-surface-2`, `--c-border`, `--c-text`, `--c-muted`.

### 5.2 Theming
Dark/Light mode toggles a `class` + `data-theme` on `<html>`, persisted to `localStorage('mydr24:theme')`. Charts re-render on theme change to pick up new palette values.

### 5.3 Core Visual Language
- **Premium glassmorphism** on sidebar/topbar (`backdrop-filter` blur + saturation)
- Soft elevation shadows, 16px radius surfaces, gradient brand marks
- **Brand palette**: Blue `#1b7df5` → Teal `#0a8b75` gradient; semantic badge colors for status
- Animated entrances (`stagger`, `anim-fade`), live pulse dots, KPI rings and sparkbars

### 5.4 Reusable Components (`components.js`)
`pageHeader`, `sectionTitle`, `statCard`, `ring`, `progress`, `badge/status`, `avatar`, `trend`, `feed`, `tile`, `lineChart`, `barChart`, `donut`, `radial`, `areaSpark`, `table` + `initDataTable`, `kanban` + `initKanban`, `map` + `mapPin`, `modal`, `toast`, `placeholder`.

---

## 6. Role-Based Access Control (RBAC)

Nine roles are switchable from the topbar; navigation is structured so production can scope items per authenticated role via `item.roles`.

| Role | Focus |
|------|-------|
| Super Admin | Full platform control |
| CEO / Founder | Executive command, valuation drivers |
| COO | Operations, fulfilment, SLAs |
| CFO | Revenue, margins, cash, forecast |
| Medical Director | Clinical governance & quality |
| CTO | Technology, reliability, AI/security |
| Operations Manager | Field operations |
| Emergency Coordinator | Dispatch command |
| CRM / Growth | CRM, sales, marketing |

---

## 7. Multi-Tenant SaaS Model

The platform supports a tenant workspace switcher (topbar). Sample tenant types:

| Tenant | Type |
|--------|------|
| MyDR24 · Global Network | Platform Owner |
| Apollo Care Hub | Hospital Tenant |
| Lifeline Clinics Group | Clinic Chain |
| CareNest Franchise · Pune | Franchise |
| Corporate · TCS Wellness | Corporate Account |

SaaS Administration covers tenants, subscription engine, dynamic pricing, white-label brands, API marketplace and usage analytics.

---

## 8. Module Catalogue

> 60 modules across 7 sections. Each item below is a fully rendered page.

### 8.1 Command Center
Executive Command · CEO/Founder · COO · CFO · Medical Director · CTO · CMO/Growth · Live Operations · AI Executive Insights

### 8.2 Clinical Operations
**Patients:** Directory · 360° Profile · Segmentation & Risk · RPM Monitoring · Care Plans
**Doctors:** Directory · Credentialing & KYC · Consultation Queue · Performance & KPI · Commission & Referral
**Caregivers:** Directory · Live Geo-Tracking · Requirement Center · Shift & Scheduling · AI Workforce Planning
**Home Healthcare:** Service Catalogue · Visit Management · ICU @ Home · Diagnostics & Samples

### 8.3 Emergency & Dispatch
Emergency Command · Live Ambulance Map · AI Triage Engine · Hospital Bed Network · Demand Heatmap

### 8.4 Growth & Revenue
Unified CRM · Corporate & Insurance · Partner & Vendor · Lead Management · Sales Pipeline (Kanban) · Referral & Commission · WhatsApp Business · Campaign Manager · Journey Builder · Marketing Analytics · Appointments

### 8.5 Business & Finance
Finance Dashboard · Billing & Invoices · Subscriptions & Plans · Dynamic Pricing Engine · HRMS & Payroll

### 8.6 Intelligence
Analytics Platform · AI Model Performance · Custom Reports · Complaint Center

### 8.7 Platform & Governance
SaaS Administration · Tenants & Organizations · Security & SIEM · Compliance Center · Audit Logs · Tasks & Workflow · System Settings

---

## 9. Key Performance Indicators

Representative KPIs surfaced across the platform (aligned to the v5.0 reference):

| Domain | Sample KPIs |
|--------|-------------|
| Executive | MRR ₹3.84 Cr · ARR ₹46.08 Cr · Business Health 92 · LTV:CAC 11.4x · Runway 18 mo · EBITDA 23.4% |
| Clinical | Quality Score 88 · Triage Accuracy 89% · Prescription Quality 92 · CSAT 4.6/5 · NPS 57 |
| Operations | Dispatch 3.1 min · On-Time Fulfilment 91.4% · Route Efficiency +28% · SLA 91.4% |
| Emergency | Ambulance ETA 8.2 min · Triage <10s · 847 partner beds · 92 ICU free |
| Finance | Gross Margin 57.2% · Cash ₹38.7 Cr · Forecast Accuracy 94% · Leakage 0.7% |
| Growth | Blended ROAS 4.7x · CAC ₹612 · NRR 112% · Conversion 24% |
| Reliability | Uptime 99.97% · API P99 182 ms · 0 P1 incidents (90d) |

The Analytics Platform organizes 1,000+ KPIs across **four layers**: Descriptive → Diagnostic → Predictive → Prescriptive.

---

## 10. AI & Intelligence Layer

Nine production models drive predictive and prescriptive features:

| Model | Metric | Performance | Retrain |
|-------|--------|-------------|---------|
| Emergency Demand Predictor | MAE accuracy | 86% | Monthly |
| Patient Deterioration Model | Precision / Recall | 87% (91% recall) | Quarterly |
| Churn Prediction Engine | Precision @ CPI>65 | 89% | Monthly |
| Disease Outbreak Detector | Advance warning | 72 hr | Continuous |
| Prescription Anomaly Detector | Recall | 92% (<1% FP) | Monthly |
| Fraud Detection System | False positive rate | 99.8% (<0.2% FP) | Weekly |
| AI Clinical Quality Scorer | CMO audit agreement | 88% | Quarterly |
| Revenue Forecast (30-day) | Accuracy | 94% | Quarterly |
| Smart Dispatch Engine | Decision latency | <60 sec | Continuous |

The **AI Executive Insights** module synthesizes these into prescriptive growth opportunities and risk mitigations with projected financial upside.

---

## 11. Security & Compliance

### 11.1 Compliance Matrix

| Framework | Region | Status | Score |
|-----------|--------|--------|-------|
| DPDP Act 2023 | India | Compliant | 98 |
| ABDM / NDHM | India | Compliant | 96 |
| NABH Telemedicine | India | Compliant | 94 |
| HIPAA | USA / Global | Compliant | 97 |
| GDPR | EU | Compliant | 95 |
| ISO 27001 | Global | Audit Due | 91 |

### 11.2 Security Controls
Zero Trust + mTLS · AES-256 at rest · TLS 1.3 in transit · data localisation (India) · hardware keys for Super Admin · GNN-based fraud detection · 24/7 SOC · immutable audit logs with 7-year retention.

---

## 12. Codebase & File Structure

```
index.html                     App shell, CDN includes, script load order
README.md                      Quickstart
docs/
  MyDR24-HOS-Documentation.md  This document
assets/
  css/
    design-system.css          Tokens, theming, glassmorphism, components
    layout.css                 Sidebar, topbar, modal, toast, responsive
  js/
    tailwind.config.js         Tailwind runtime config (CSS vars → utilities)
    config.js                  Roles, tenants, navigation tree, routes, state
    data.js                    Mock data layer (v5.0 figures)
    components.js              Reusable UI + chart/table/kanban/map/modal/toast
    router.js                  Hash router + resource cleanup
    app.js                     Shell bootstrap, theme/role/tenant, command palette
    pages/
      dashboards.js            Executive + leadership + live ops + AI insights
      patients.js              Patient suite
      doctors.js               Doctor suite
      caregivers.js            Caregiver suite (incl. live map)
      emergency.js             Emergency & dispatch (incl. maps)
      crm.js                   CRM, leads, pipeline, marketing, appointments
      finance.js               Finance, billing, subscriptions, pricing, payroll
      modules.js               Home care, analytics, governance + generic fallback
```

Total: ~3,570 lines across HTML, CSS and JS.

---

## 13. How to Run

This is a static front-end that loads CDN libraries, so run it through a local web server:

```bash
# from the project root
python3 -m http.server 8080
# open http://localhost:8080
```

Or open `index.html` directly in a modern browser. An internet connection is required for the CDN libraries.

**Keyboard shortcut:** `Cmd/Ctrl + K` opens the command palette to jump to any of the 60 modules.

---

## 14. Extending the Platform

To add a new module:

1. **Add a nav entry** in `config.js` under the appropriate `section` (or a parent's `children`), with a unique `id`, `label` and `icon`.
2. **Register a renderer** in any `pages/*.js`:
   ```js
   App.pages['my-module'] = {
     render: function (route) { return App.ui.pageHeader({ title: 'My Module' }) + '...'; },
     init: function () { /* charts, tables, maps */ }
   };
   ```
3. The router will automatically resolve `#/my-module`. If you skip step 2, the generic fallback renders a styled placeholder.

To add a button action, register `App.actions['my-action']` and reference it via `data-action="my-action"`.

---

## 15. Production Wiring Roadmap

| Area | Mock (now) | Production (next) |
|------|-----------|-------------------|
| Data | `App.data` getters | REST/GraphQL + WebSocket; FHIR R4, ABDM/ABHA |
| Auth | Role switcher | OIDC/SSO + MFA; enforce `item.roles` per user |
| Live panels | `setInterval` simulators | Event stream / SSE / WebSocket |
| Maps | Static mock coordinates | Live GPS telemetry from dispatch & caregivers |
| Payments | Static figures | Razorpay / payment gateway integration |
| RPM | Mock vitals | Device ingestion pipeline + alert thresholds |
| Persistence | `localStorage` prefs | Tenant-scoped backend storage |

---

## 16. Glossary

| Term | Meaning |
|------|---------|
| HOS | Healthcare Operating System |
| RBAC | Role-Based Access Control |
| RPM | Remote Patient Monitoring |
| FHIR R4 | Fast Healthcare Interoperability Resources (v4) |
| ABHA / ABDM | Ayushman Bharat Health Account / Digital Mission |
| DPDP | Digital Personal Data Protection Act, 2023 (India) |
| MRR / ARR | Monthly / Annual Recurring Revenue |
| LTV / CAC | Lifetime Value / Customer Acquisition Cost |
| NRR | Net Revenue Retention |
| SLA | Service Level Agreement |
| SIEM | Security Information and Event Management |
| TAT | Turnaround Time |

---

<div align="center">

© Accufly Healthcare Pvt. Ltd. · MyDR24 Healthcare Operating System
*Original enterprise interface inspired by established product patterns — no proprietary designs or code reproduced.*

</div>
