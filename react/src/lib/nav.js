// MyDR24 HOS — App configuration: roles, tenants, accents, navigation, routes

export const meta = {
  product: 'MyDR24',
  suite: 'Healthcare Operating System',
  org: 'Accufly Healthcare Pvt. Ltd.',
  version: '5.0',
  contact: { email: 'info@mydr24.com', phone: '+91 9667378887', addr: 'IIIT Delhi, Okhla Phase III' },
};

export const roles = {
  super_admin: { label: 'Super Admin', color: '#1b7df5', desc: 'Full platform control' },
  ceo: { label: 'CEO / Founder', color: '#8b5cf6', desc: 'Executive command' },
  coo: { label: 'COO', color: '#0ea5e9', desc: 'Operations' },
  cfo: { label: 'CFO', color: '#16ad8f', desc: 'Finance' },
  cmo: { label: 'Medical Director', color: '#ef4444', desc: 'Clinical governance' },
  cto: { label: 'CTO', color: '#f59e0b', desc: 'Technology & security' },
  ops_manager: { label: 'Operations Mgr', color: '#0ea5e9', desc: 'Field operations' },
  emergency: { label: 'Emergency Coord.', color: '#fb7185', desc: 'Dispatch command' },
  crm_manager: { label: 'CRM / Growth', color: '#22c55e', desc: 'CRM, sales, marketing' },
};

export const tenants = [
  { id: 'mydr24-prod', name: 'MyDR24 · Global Network', type: 'Platform Owner', icon: 'fa-staff-snake' },
  { id: 'apollo-hub', name: 'Apollo Care Hub (Hospital)', type: 'Hospital Tenant', icon: 'fa-hospital' },
  { id: 'lifeline-clinics', name: 'Lifeline Clinics Group', type: 'Clinic Chain', icon: 'fa-house-medical' },
  { id: 'carenest-fr', name: 'CareNest Franchise · Pune', type: 'Franchise', icon: 'fa-code-branch' },
  { id: 'tcs-corp', name: 'Corporate · TCS Wellness', type: 'Corporate Account', icon: 'fa-building' },
];

export const accents = [
  { id: 'blue', hex: '#1b7df5', rgb: '27 125 245' },
  { id: 'teal', hex: '#0a8b75', rgb: '10 139 117' },
  { id: 'violet', hex: '#8b5cf6', rgb: '139 92 246' },
  { id: 'emerald', hex: '#16ad8f', rgb: '22 173 143' },
  { id: 'rose', hex: '#e11d48', rgb: '225 29 72' },
  { id: 'amber', hex: '#f59e0b', rgb: '245 158 11' },
];

// Navigation tree. Leaf: { id, label, icon, badge? }. Parent: { label, icon, children }.
export const nav = [
  {
    section: 'Command Center',
    items: [
      { id: 'exec', label: 'Executive Command', icon: 'fa-gauge-high', badge: 'LIVE' },
      {
        label: 'Leadership Dashboards', icon: 'fa-chess-king',
        children: [
          { id: 'dash-ceo', label: 'CEO / Founder', icon: 'fa-crown' },
          { id: 'dash-coo', label: 'COO · Operations', icon: 'fa-sitemap' },
          { id: 'dash-cfo', label: 'CFO · Finance', icon: 'fa-coins' },
          { id: 'dash-cmo', label: 'Medical Director', icon: 'fa-user-doctor' },
          { id: 'dash-cto', label: 'CTO · Technology', icon: 'fa-microchip' },
          { id: 'dash-growth', label: 'CMO · Growth', icon: 'fa-bullhorn' },
        ],
      },
      { id: 'live-ops', label: 'Live Operations', icon: 'fa-satellite-dish', badge: 'LIVE' },
      { id: 'ai-insights', label: 'AI Executive Insights', icon: 'fa-brain' },
    ],
  },
  {
    section: 'Clinical Operations',
    items: [
      {
        label: 'Patient Management', icon: 'fa-hospital-user',
        children: [
          { id: 'patients', label: 'Patient Directory', icon: 'fa-users' },
          { id: 'patient-segments', label: 'Segmentation & Risk', icon: 'fa-layer-group' },
          { id: 'rpm', label: 'RPM Monitoring', icon: 'fa-heart-pulse', badge: '12' },
          { id: 'care-plans', label: 'Care Plans', icon: 'fa-clipboard-list' },
        ],
      },
      {
        label: 'Doctor Management', icon: 'fa-user-doctor',
        children: [
          { id: 'doctors', label: 'Doctor Directory', icon: 'fa-stethoscope' },
          { id: 'doctor-credentialing', label: 'Credentialing & KYC', icon: 'fa-id-badge' },
          { id: 'consult-queue', label: 'Consultation Queue', icon: 'fa-video', badge: '38' },
          { id: 'commission', label: 'Commission & Referral', icon: 'fa-hand-holding-dollar' },
        ],
      },
      {
        label: 'Caregiver Workforce', icon: 'fa-user-nurse',
        children: [
          { id: 'caregivers', label: 'Caregiver Directory', icon: 'fa-users-gear' },
          { id: 'caregiver-live', label: 'Live Geo-Tracking', icon: 'fa-location-crosshairs', badge: 'LIVE' },
          { id: 'shift-planning', label: 'Shift & Scheduling', icon: 'fa-calendar-week' },
        ],
      },
      {
        label: 'Home Healthcare', icon: 'fa-house-medical',
        children: [
          { id: 'home-services', label: 'Service Catalogue', icon: 'fa-kit-medical' },
          { id: 'home-visits', label: 'Visit Management', icon: 'fa-route' },
          { id: 'icu-home', label: 'ICU @ Home', icon: 'fa-bed-pulse' },
          { id: 'diagnostics', label: 'Diagnostics & Samples', icon: 'fa-vial' },
        ],
      },
    ],
  },
  {
    section: 'Emergency & Dispatch',
    items: [
      { id: 'emergency-center', label: 'Emergency Command', icon: 'fa-truck-medical', badge: '8' },
      { id: 'ambulance-map', label: 'Live Ambulance Map', icon: 'fa-map-location-dot', badge: 'LIVE' },
      { id: 'ai-triage', label: 'AI Triage Engine', icon: 'fa-wave-square' },
      { id: 'hospital-beds', label: 'Hospital Bed Network', icon: 'fa-hospital' },
      { id: 'demand-heatmap', label: 'Demand Heatmap', icon: 'fa-fire' },
    ],
  },
  {
    section: 'Growth & Revenue',
    items: [
      { id: 'crm', label: 'Unified CRM', icon: 'fa-address-book' },
      { id: 'leads', label: 'Lead Management', icon: 'fa-filter', badge: 'NEW' },
      { id: 'pipeline', label: 'Sales Pipeline', icon: 'fa-diagram-project' },
      { id: 'referrals', label: 'Referral & Commission', icon: 'fa-share-nodes' },
      {
        label: 'Marketing Suite', icon: 'fa-bullhorn',
        children: [
          { id: 'mkt-whatsapp', label: 'WhatsApp Business', icon: 'fa-whatsapp' },
          { id: 'mkt-campaigns', label: 'Campaign Manager', icon: 'fa-rectangle-ad' },
          { id: 'mkt-journeys', label: 'Journey Builder', icon: 'fa-diagram-next' },
        ],
      },
      { id: 'appointments', label: 'Appointments', icon: 'fa-calendar-check' },
    ],
  },
  {
    section: 'Business & Finance',
    items: [
      { id: 'finance', label: 'Finance Dashboard', icon: 'fa-coins' },
      { id: 'billing', label: 'Billing & Invoices', icon: 'fa-file-invoice-dollar' },
      { id: 'subscriptions', label: 'Subscriptions & Plans', icon: 'fa-crown' },
      { id: 'pricing-engine', label: 'Dynamic Pricing Engine', icon: 'fa-sliders' },
      { id: 'payroll', label: 'HRMS & Payroll', icon: 'fa-people-roof' },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { id: 'analytics', label: 'Analytics Platform', icon: 'fa-chart-column' },
      { id: 'ai-models', label: 'AI Model Performance', icon: 'fa-microchip' },
      { id: 'reports', label: 'Custom Reports', icon: 'fa-file-lines' },
      { id: 'complaints', label: 'Complaint Center', icon: 'fa-headset', badge: '5' },
    ],
  },
  {
    section: 'Platform & Governance',
    items: [
      { id: 'saas-admin', label: 'SaaS Administration', icon: 'fa-layer-group' },
      { id: 'tenants', label: 'Tenants & Organizations', icon: 'fa-sitemap' },
      { id: 'security', label: 'Security & SIEM', icon: 'fa-shield-halved' },
      { id: 'compliance', label: 'Compliance Center', icon: 'fa-scale-balanced' },
      { id: 'audit', label: 'Audit Logs', icon: 'fa-clipboard-check' },
      { id: 'tasks', label: 'Tasks & Workflow', icon: 'fa-list-check' },
      { id: 'settings', label: 'System Settings', icon: 'fa-gear' },
    ],
  },
];

// Flatten nav into a route lookup keyed by id.
export const routes = {};
nav.forEach((sec) => {
  sec.items.forEach((item) => {
    if (item.id) routes[item.id] = { ...item, section: sec.section };
    if (item.children) item.children.forEach((c) => { routes[c.id] = { ...c, section: sec.section, parent: item.label }; });
  });
});

export const defaultRoute = 'exec';
