/* ==========================================================================
   MyDR24 HOS — Home Healthcare, Intelligence, Platform & Governance
   + generic module fallback template
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;
  App.actions = App.actions || {};

  /* ====================== HOME HEALTHCARE ====================== */
  P['home-services'] = {
    render: function () {
      var svcs = [
        ['Home Nursing', 'fa-user-nurse', '#1b7df5', 'Hourly + visit'], ['Doctor Home Visit', 'fa-user-doctor', '#16ad8f', '60-min dispatch'],
        ['Physiotherapy', 'fa-person-walking', '#8b5cf6', 'Per session'], ['Elder Care', 'fa-wheelchair', '#f59e0b', 'Daily package'],
        ['Mother & Child', 'fa-baby', '#ec4899', 'Program'], ['Post-Surgery Care', 'fa-bandage', '#0ea5e9', 'Recovery plan'],
        ['ICU @ Home', 'fa-bed-pulse', '#ef4444', 'Daily rate'], ['Palliative Care', 'fa-hand-holding-heart', '#14b8a6', 'Continuous'],
        ['Vaccination', 'fa-syringe', '#22c55e', 'Per dose'], ['Medical Equipment', 'fa-pump-medical', '#6366f1', 'Rental'],
        ['Diagnostics', 'fa-vial', '#f97316', 'Test bundle'], ['RPM Integration', 'fa-heart-pulse', '#e11d48', 'Subscription'],
      ];
      return ui.pageHeader({ eyebrow: 'Home Healthcare · Catalogue', title: 'Service Catalogue', subtitle: 'Planned and on-demand home healthcare across nursing, physiotherapy, elder care and ICU @ home.', actions: [{ label: 'Add Service', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-house-medical', value: D.num(38600), label: 'Home Visits (MTD)', trend: 9, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-star', value: '4.4/5', label: 'Patient CSAT', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-clock', value: '92%', label: 'On-Time Arrival', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-shield-heart', value: '1.4', label: 'Incidents /1K visits', sub: 'target <2', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-4 stagger">' + svcs.map(function (s) {
          return '<div class="card card-hover p-5"><div class="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-3 text-lg" style="background:' + s[2] + '"><i class="fa-solid ' + s[1] + '"></i></div><div class="font-semibold text-[14px]">' + s[0] + '</div><div class="text-muted text-[12px] mt-1">' + s[3] + ' · ' + D.rnd(40, 900) + ' active</div></div>';
        }).join('') + '</div>';
    },
    init: function () {},
  };

  P['home-visits'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Home Healthcare · Operations', title: 'Visit Management', subtitle: 'Scheduled and recurring visits with route optimisation and family status updates.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-route', value: '1,840', label: 'Visits Today', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-circle-check', value: '97%', label: 'Task Completion', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-location-check', value: '92%', label: 'Geofence Verified', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-comment-medical', value: '100%', label: 'Family Updates', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        ui.table('tbl-visits', [
          { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Service', render: function () { return D.pick(['Home Nursing', 'Physiotherapy', 'Elder Care', 'Post-Surgery', 'Vaccination']); } },
          { label: 'Caregiver', render: function () { return D.name(); } },
          { label: 'Time', render: function () { return D.rnd(8, 19) + ':' + D.pick(['00', '30']); } },
          { label: 'Status', render: function () { return ui.status(D.pick(['On Visit', 'En Route', 'Confirmed', 'Available'])); } },
        ], D.patients.slice(0, 16), { title: "Today's Visit Schedule" });
    },
    init: function () { ui.initDataTable('tbl-visits'); },
  };

  P['icu-home'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Home Healthcare · Critical', title: 'ICU @ Home', subtitle: 'Critical care at home: monitors, ventilator support and intensivist teleconsult.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-bed-pulse', value: '42', label: 'Active ICU @ Home', c1: '#ef4444', c2: '#b91c1c' }) +
          ui.statCard({ icon: 'fa-lungs', value: '18', label: 'On Ventilator', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-user-doctor', value: '24/7', label: 'Intensivist Cover', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-heart-pulse', value: '<15 min', label: 'Alert Response', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="card p-5">' + ui.sectionTitle('Active ICU @ Home Patients', 'Live vitals monitoring', '<span class="live-dot"></span>') +
          '<div class="grid-2">' + D.patients.slice(0, 6).map(function (p) {
            return '<div class="flex items-center gap-3 p-3.5 rounded-xl card-2 hairline border" style="border-left:3px solid #ef4444">' + ui.avatar(p.name, 38) +
              '<div class="min-w-0 flex-1"><div class="font-semibold clamp-1">' + p.name + '</div><div class="text-muted text-xs">BP ' + D.rnd(110, 150) + '/' + D.rnd(70, 95) + ' · SpO2 ' + D.rnd(92, 99) + '% · HR ' + D.rnd(68, 100) + '</div></div>' + ui.badge('Stable', 'green') + '</div>';
          }).join('') + '</div></div>';
    },
    init: function () {},
  };

  P['diagnostics'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Home Healthcare · Diagnostics', title: 'Diagnostics & Sample Collection', subtitle: 'Lab technician home visits with TAT SLA for blood, urine and culture samples.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-vial', value: D.num(12400), label: 'Samples (MTD)', trend: 8, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-clock', value: '6.2h', label: 'Avg TAT', sub: 'report turnaround', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-flask-vial', value: '142', label: 'Partner Labs', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-truck-fast', value: '98%', label: 'On-Time Collection', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        ui.table('tbl-diag', [
          { label: 'Order', render: function () { return '<span class="font-mono text-[12.5px] font-semibold">LAB-' + D.rnd(50000, 59999) + '</span>'; } },
          { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 28) + '<span>' + r.name + '</span></div>'; } },
          { label: 'Test', render: function () { return D.pick(['CBC', 'Lipid Profile', 'HbA1c', 'Thyroid Panel', 'Liver Function', 'Culture']); } },
          { label: 'TAT', render: function () { return D.rnd(2, 12) + 'h'; } },
          { label: 'Status', render: function () { return ui.status(D.pick(['Confirmed', 'En Route', 'On Visit'])); } },
        ], D.patients.slice(0, 14), { title: 'Sample Collection Orders' });
    },
    init: function () { ui.initDataTable('tbl-diag'); },
  };

  /* ====================== ANALYTICS PLATFORM ====================== */
  P['analytics'] = {
    render: function () {
      var cats = ['Executive', 'Clinical', 'Patient', 'Doctor', 'Caregiver', 'Emergency', 'Marketing', 'Finance', 'RPM', 'Operational', 'Predictive', 'Prescriptive'];
      return ui.pageHeader({ eyebrow: 'Intelligence · Analytics', title: 'Analytics Platform', subtitle: '40+ real-time dashboards · 1,000+ KPIs across a four-layer architecture (Descriptive → Diagnostic → Predictive → Prescriptive).', actions: [{ label: 'Build Report', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-chart-column', value: '40+', label: 'Live Dashboards', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-list-check', value: '1,000+', label: 'Tracked KPIs', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-layer-group', value: '4', label: 'Analytics Layers', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-bullseye', value: '94%', label: 'Forecast Accuracy', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Platform Growth', 'DAU / MAU · 12 months') + '<div style="height:260px"><canvas id="an-growth"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Engagement Funnel', 'Stickiness') +
            [['Registration', 100], ['KYC', 74], ['First Booking', 52], ['Consult Complete', 41], ['Subscription', 30]].map(function (r) { return '<div class="mb-3"><div class="flex justify-between text-[13px] mb-1.5"><span>' + r[0] + '</span><span class="text-muted">' + r[1] + '%</span></div>' + ui.progress(r[1]) + '</div>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div class="card p-5">' + ui.sectionTitle('Dashboard Library', 'Click to explore a domain') +
          '<div class="grid-4 stagger">' + cats.map(function (c) { return '<div class="card-2 hairline border rounded-xl p-4 card-hover cursor-pointer" data-action="noop"><i class="fa-solid fa-chart-pie text-lg mb-2" style="color:#1b7df5"></i><div class="font-semibold text-[13.5px]">' + c + ' Analytics</div><div class="text-muted text-[11.5px] mt-0.5">' + D.rnd(18, 84) + ' KPIs</div></div>'; }).join('') + '</div></div>';
    },
    init: function () {
      ui.lineChart('an-growth', D.months, [
        { label: 'MAU (10K)', data: D.months.map(function (m, i) { return 38 + i * 5 + D.rnd(0, 4); }), color: '#1b7df5', fill: true },
        { label: 'DAU (10K)', data: D.months.map(function (m, i) { return 12 + i * 1.5 + D.rnd(0, 2); }), color: '#16ad8f' },
      ], {});
    },
  };

  /* ====================== AI MODEL PERFORMANCE ====================== */
  P['ai-models'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Intelligence · MLOps', title: 'AI Model Performance', subtitle: '9 production models with live inference · performance tracking and retraining cadence.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-microchip', value: '9', label: 'Models in Production', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-bullseye', value: '89%', label: 'Avg Performance', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-bolt', value: '<60s', label: 'Inference Latency', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-arrows-rotate', value: 'Weekly', label: 'Fastest Retrain', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-cards">' + D.aiModels.map(function (m) {
          var pct = m.unit === '%' ? m.perf : 90;
          return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9)"><i class="fa-solid fa-brain"></i></div>' + ui.status(m.status) + '</div>' +
            '<div class="font-semibold text-[14px] clamp-1">' + m.name + '</div><div class="text-muted text-[11.5px] mb-3">' + m.kpi + (m.sub ? ' · ' + m.sub : '') + '</div>' +
            '<div class="flex items-end justify-between mb-2"><span class="metric-value text-2xl">' + m.perf + m.unit + '</span><span class="text-muted text-[11px]">retrain: ' + m.retrain + '</span></div>' + ui.progress(pct, m.status === 'Healthy' ? '#16ad8f' : '#f59e0b') + '</div>';
        }).join('') + '</div>';
    },
    init: function () {},
  };

  P['reports'] = genericRich('Custom Reports', 'fa-file-lines', 'Intelligence · Reporting', 'Drag-and-drop report builder with scheduled delivery, investor packs and board-ready exports.', [
    ['Investor Monthly Pack', 'fa-file-pdf', 'Scheduled · 1st of month'], ['Clinical Quality Report', 'fa-notes-medical', 'Weekly · CMO'],
    ['Financial Statement', 'fa-coins', 'Monthly · CFO'], ['Operations Scorecard', 'fa-gauge', 'Daily · COO'],
    ['Compliance Audit', 'fa-scale-balanced', 'Quarterly · DPO'], ['Marketing ROI', 'fa-bullhorn', 'Weekly · CMO'],
  ]);

  /* ====================== COMPLAINT CENTER ====================== */
  P['complaints'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Care · Support', title: 'Complaint & Care Command Center', subtitle: 'Multi-channel intake, AI classification, SLA-based resolution and escalation workflow.', actions: [{ label: 'Live Queue', icon: 'fa-circle-dot', variant: 'btn-soft' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-headset', value: '128', label: 'Open Tickets', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-stopwatch', value: '1.8h', label: 'Avg Resolution', sub: 'P1 <2h', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-face-smile', value: '4.3/5', label: 'CSAT', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-triangle-exclamation', value: '5', label: 'SLA Breach Risk', c1: '#ef4444', c2: '#b91c1c' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('By Category', 'AI-classified') + '<div style="height:220px"><canvas id="cmp-cat"></canvas></div></div>' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Live Ticket Queue', 'SLA countdown', '<span class="live-dot"></span>') +
            ['Clinical Quality', 'Billing', 'Caregiver Delay', 'Technology', 'Emergency'].map(function (t, i) {
              var pr = i === 0 ? 'P1' : i < 3 ? 'P2' : 'P3';
              return ui.tile({ icon: 'fa-ticket', color: pr === 'P1' ? '#ef4444' : pr === 'P2' ? '#f59e0b' : '#1b7df5', title: 'TKT-' + D.rnd(8000, 8999) + ' · ' + t, text: D.name() + ' · SLA ' + (pr === 'P1' ? '2h' : pr === 'P2' ? '24h' : '48h'), right: ui.badge(pr, pr === 'P1' ? 'red' : pr === 'P2' ? 'amber' : 'blue') });
            }).join('<div class="h-2"></div>') +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.donut('cmp-cat', [
        { label: 'Clinical', value: 22, color: '#ef4444' }, { label: 'Billing', value: 31, color: '#f59e0b' },
        { label: 'Caregiver', value: 18, color: '#8b5cf6' }, { label: 'Technology', value: 16, color: '#1b7df5' }, { label: 'Delay', value: 13, color: '#0ea5e9' },
      ], { legend: 'bottom' });
    },
  };

  /* ====================== SAAS ADMIN ====================== */
  P['saas-admin'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Platform · SaaS', title: 'SaaS Administration', subtitle: 'Multi-tenant architecture, subscription engine, pricing, white-label and API marketplace.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-layer-group', value: '248', label: 'Active Tenants', trend: 12, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-plug', value: '1.2 M', label: 'API Calls/day', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-palette', value: '64', label: 'White-Label Brands', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-gauge-high', value: '99.97%', label: 'Platform Uptime', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-3 stagger">' +
          ['Hospitals', 'Clinics', 'Franchises', 'Corporate Accounts', 'Insurance Partners', 'Government Programs'].map(function (t, i) {
            var icons = ['fa-hospital', 'fa-house-medical', 'fa-code-branch', 'fa-building', 'fa-building-shield', 'fa-landmark'];
            return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + icons[i] + '"></i></div>' + ui.badge('Live', 'green') + '</div><div class="metric-value text-2xl">' + D.rnd(8, 96) + '</div><div class="text-[13px] font-semibold mt-1">' + t + '</div><div class="text-muted text-[11.5px] mt-0.5">' + D.inr(D.rnd(20, 480) * 100000) + ' ARR</div></div>';
          }).join('') +
        '</div>';
    },
    init: function () {},
  };

  P['tenants'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Platform · Multi-Tenant', title: 'Tenants & Organizations', subtitle: 'Manage hospital, clinic, franchise, corporate and government tenant workspaces.', actions: [{ label: 'New Tenant', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        ui.table('tbl-tenants', [
          { label: 'Organization', render: function (r) { return '<div class="flex items-center gap-3"><span class="w-9 h-9 rounded-lg flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + r.icon + ' text-xs"></i></span><span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Type', render: function (r) { return ui.badge(r.type, 'blue'); } },
          { label: 'Users', render: function () { return D.num(D.rnd(40, 4800)); } },
          { label: 'ARR', render: function () { return D.inr(D.rnd(20, 480) * 100000); } },
          { label: 'Status', render: function () { return ui.status('Active'); } },
        ], App.tenants.concat(App.tenants).slice(0, 8).map(function (t, i) { return Object.assign({}, t, { name: t.name + (i > 4 ? ' #' + i : '') }); }), { title: 'All Tenants' });
    },
    init: function () { ui.initDataTable('tbl-tenants', { paging: false, info: false }); },
  };

  /* ====================== SECURITY & SIEM ====================== */
  P['security'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Governance · Security', title: 'Security & SIEM', subtitle: 'Zero Trust, 24/7 SOC, AI fraud monitoring, threat detection and immutable audit.', actions: [{ label: 'Incident Center', icon: 'fa-bug', variant: 'btn-ghost', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-shield-halved', value: '0', label: 'P1 Incidents', sub: '90 days', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-user-secret', value: '<0.2%', label: 'Fraud FP Rate', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-bell', value: '14', label: 'Threats Blocked', sub: 'today', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-key', value: '100%', label: 'MFA Coverage', sub: 'admins', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Threat Activity', 'Blocked events · 24h') + '<div style="height:260px"><canvas id="sec-threat"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Security Controls', '') +
            ctl('Zero Trust + mTLS', 'Active') + ctl('AES-256 at rest', 'Active') + ctl('TLS 1.3 in transit', 'Active') + ctl('Data Localisation (IN)', 'Active') + ctl('Hardware Keys (Super Admin)', 'Active') + ctl('GNN Fraud Detection', 'Active') +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('sec-threat', Array.from({ length: 12 }, function (_, i) { return (i * 2) + 'h'; }), [{ label: 'Blocked', data: Array.from({ length: 12 }, function () { return D.rnd(0, 6); }), color: '#ef4444' }], { legend: false });
    },
  };
  function ctl(label, status) { return '<div class="flex items-center justify-between py-2.5" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><span class="text-[13px]">' + label + '</span>' + ui.badge('<i class="fa-solid fa-check"></i> ' + status, 'green') + '</div>'; }

  /* ====================== COMPLIANCE ====================== */
  P['compliance'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Governance · Compliance', title: 'Compliance Center', subtitle: 'HIPAA, GDPR, ABDM/NDHM, DPDP Act 2023, NABH and ISO 27001 posture monitoring.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-scale-balanced', value: '6', label: 'Frameworks', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-circle-check', value: '95%', label: 'Avg Compliance', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-clock-rotate-left', value: '72h', label: 'Grievance SLA', sub: 'DPDP', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-triangle-exclamation', value: '1', label: 'Audit Due', sub: 'ISO 27001', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        ui.table('tbl-comp', [
          { label: 'Framework', render: function (r) { return '<span class="font-semibold">' + r.fw + '</span>'; } },
          { label: 'Region', key: 'region' },
          { label: 'Controls', render: function (r) { return '<span class="text-muted text-[12.5px]">' + r.controls + '</span>'; } },
          { label: 'Score', render: function (r) { return '<div class="flex items-center gap-2"><div class="progress w-16"><span style="width:' + r.score + '%"></span></div><span class="metric-value text-[12.5px]">' + r.score + '%</span></div>'; } },
          { label: 'Status', render: function (r) { return ui.status(r.status); } },
        ], D.compliance, { title: 'Regulatory Compliance Matrix' });
    },
    init: function () { ui.initDataTable('tbl-comp', { paging: false, info: false, searching: false }); },
  };

  /* ====================== AUDIT LOGS ====================== */
  P['audit'] = {
    render: function () {
      var actions = ['Viewed patient record', 'Updated care plan', 'Dispatched ambulance', 'Approved refund', 'Changed role permission', 'Exported report', 'Modified pricing rule', 'Resolved complaint'];
      var rows = [];
      for (var i = 0; i < 20; i++) rows.push({ user: D.name(), action: D.pick(actions), ip: D.rnd(10, 250) + '.' + D.rnd(0, 255) + '.' + D.rnd(0, 255) + '.' + D.rnd(1, 254), time: D.rnd(1, 59) + ' min ago', device: D.pick(['Chrome · macOS', 'Edge · Windows', 'Safari · iOS', 'Mobile App']) });
      return ui.pageHeader({ eyebrow: 'Governance · Audit', title: 'Audit Logs', subtitle: 'Immutable logs of every admin action — user, timestamp, IP, device — with 7-year retention.', actions: [{ label: 'Export', icon: 'fa-file-export', variant: 'btn-ghost', action: 'export' }] }) +
        ui.table('tbl-audit', [
          { label: 'User', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.user, 28) + '<span class="font-semibold">' + r.user + '</span></div>'; } },
          { label: 'Action', key: 'action' },
          { label: 'IP', render: function (r) { return '<span class="font-mono text-[12px]">' + r.ip + '</span>'; } },
          { label: 'Device', key: 'device' },
          { label: 'Time', render: function (r) { return '<span class="text-muted">' + r.time + '</span>'; } },
        ], rows, { title: 'Recent Activity' });
    },
    init: function () { ui.initDataTable('tbl-audit'); },
  };

  /* ====================== TASKS & WORKFLOW ====================== */
  P['tasks'] = {
    render: function () {
      var board = {
        'To Do': [{ id: 'T-101', org: 'Approve doctor credentials (12)', value: 0, owner: 'Compliance', tag: 'New' }, { id: 'T-102', org: 'Review Mumbai staffing plan', value: 0, owner: 'Ops', tag: 'New' }],
        'In Progress': [{ id: 'T-098', org: 'Q2 investor pack', value: 0, owner: 'Finance', tag: 'Proposal' }, { id: 'T-099', org: 'ISO 27001 audit prep', value: 0, owner: 'Security', tag: 'Negotiation' }],
        'Review': [{ id: 'T-090', org: 'New pricing rule · rural zones', value: 0, owner: 'Pricing', tag: 'Qualified' }],
        'Done': [{ id: 'T-085', org: 'Onboard Apollo Care Hub', value: 0, owner: 'Growth', tag: 'Won' }, { id: 'T-084', org: 'Launch chronic care journey', value: 0, owner: 'Marketing', tag: 'Won' }],
      };
      return ui.pageHeader({ eyebrow: 'Platform · Collaboration', title: 'Tasks & Workflow', subtitle: 'Approvals, SLA tracking, escalation chains and cross-team collaboration.', actions: [{ label: 'New Task', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="card p-5">' + ui.sectionTitle('Workflow Board', 'Drag tasks between columns') + ui.kanban(board, { id: 'task-kanban' }) + '</div>';
    },
    init: function () { ui.initKanban('task-kanban'); },
  };

  /* ====================== SETTINGS ====================== */
  P['settings'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Platform · Configuration', title: 'System Settings', subtitle: 'Organisation profile, branding, integrations, RBAC and notification preferences.' }) +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Organisation Profile', '') +
            '<div class="space-y-3">' +
              '<div><label class="field-label">Organisation</label><input class="input" value="' + App.meta.org + '" /></div>' +
              '<div><label class="field-label">Product Suite</label><input class="input" value="MyDR24 Healthcare Operating System" /></div>' +
              '<div class="grid-2" style="gap:12px"><div><label class="field-label">Contact Email</label><input class="input" value="' + App.meta.contact.email + '" /></div><div><label class="field-label">Phone</label><input class="input" value="' + App.meta.contact.phone + '" /></div></div>' +
              '<div><label class="field-label">Headquarters</label><input class="input" value="' + App.meta.contact.addr + '" /></div>' +
            '</div><button class="btn btn-primary mt-4" data-action="save-settings"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Preferences', '') +
            toggle('Dark mode', App.state.theme === 'dark') + toggle('Email notifications', true) + toggle('WhatsApp alerts', true) + toggle('Two-factor authentication', true) + toggle('AI insights digest', true) +
            '<div class="divider my-4"></div>' + ui.sectionTitle('Integrations', '') +
            integ('fa-whatsapp', 'WhatsApp Business API', '#16ad8f') + integ('fa-credit-card', 'Razorpay Payments', '#1b7df5') + integ('fa-hospital', 'ABDM / ABHA', '#8b5cf6') + integ('fa-chart-line', 'Google Analytics 4', '#f59e0b') +
          '</div>' +
        '</div>';
    },
    init: function () {},
  };
  function toggle(label, on) { return '<div class="flex items-center justify-between py-2.5" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><span class="text-[13.5px]">' + label + '</span><span class="inline-flex w-11 h-6 rounded-full p-0.5 transition-colors" style="background:' + (on ? '#16ad8f' : 'rgb(var(--c-border))') + '"><span class="w-5 h-5 rounded-full bg-white transition-transform" style="transform:translateX(' + (on ? '20px' : '0') + ')"></span></span></div>'; }
  function integ(icon, label, color) { return '<div class="flex items-center justify-between py-2.5"><div class="flex items-center gap-2.5"><i class="fa-brands ' + icon + ' fa-solid" style="color:' + color + '"></i><span class="text-[13.5px]">' + label + '</span></div>' + ui.badge('Connected', 'green') + '</div>'; }
  App.actions['save-settings'] = function () { ui.toast({ title: 'Settings saved', text: 'Your configuration has been updated.', type: 'success' }); };

  /* ====================== Helpers & Generic Fallback ====================== */
  function genericRich(title, icon, eyebrow, subtitle, tiles) {
    return {
      render: function () {
        return ui.pageHeader({ eyebrow: eyebrow, title: title, subtitle: subtitle }) +
          '<div class="grid-3 stagger">' + tiles.map(function (t) {
            return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + t[1] + '"></i></div>' + ui.badge('Ready', 'green') + '</div><div class="font-semibold">' + t[0] + '</div><div class="text-muted text-[12px] mt-1">' + t[2] + '</div></div>';
          }).join('') + '</div>';
      },
      init: function () {},
    };
  }

  // Generic fallback for any route not explicitly built
  P['_generic'] = {
    render: function (route) {
      route = route || {};
      return ui.pageHeader({ eyebrow: (route.section || 'Module'), title: route.label || 'Module', subtitle: 'This MyDR24 HOS module is part of the ' + (route.parent || route.section || 'platform') + ' suite.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: route.icon || 'fa-cube', value: D.num(D.rnd(1200, 98000)), label: 'Records', trend: D.rnd(2, 18), c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-bolt', value: D.rnd(70, 99) + '%', label: 'Efficiency', trend: D.rnd(1, 9), c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-clock', value: D.rnd(2, 12) + ' min', label: 'Avg Response', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-chart-line', value: D.inr(D.rnd(20, 800) * 10000), label: 'Value', trend: D.rnd(3, 22), c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-3"><div class="card p-5 col-span-2">' + ui.sectionTitle('Trend', 'Last 12 months') + '<div style="height:260px"><canvas id="gen-chart"></canvas></div></div>' +
        '<div class="card p-5">' + ui.sectionTitle('Activity', '', '<span class="live-dot"></span>') + ui.feed(D.makeFeed(6)) + '</div></div>';
    },
    init: function () {
      ui.lineChart('gen-chart', D.months, [{ label: 'Volume', data: D.months.map(function () { return D.rnd(40, 100); }), color: '#1b7df5', fill: true }], { legend: false });
    },
  };

})(window.MyDR24);
