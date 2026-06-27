/* ==========================================================================
   MyDR24 HOS — Patient Management
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;

  /* ---- Patient Directory ---- */
  P['patients'] = {
    render: function () {
      var cols = [
        { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-3">' + ui.avatar(r.name, 34) + '<div><div class="font-semibold">' + r.name + '</div><div class="text-muted text-xs font-mono">' + r.id + ' · ' + r.age + r.gender[0] + '</div></div></div>'; } },
        { label: 'ABHA', render: function (r) { return '<span class="font-mono text-xs">' + r.abha + '</span>'; } },
        { label: 'Condition', render: function (r) { return r.condition; } },
        { label: 'Risk', render: function (r) { return ui.status(r.risk); } },
        { label: 'Plan', render: function (r) { return ui.status(r.plan); } },
        { label: 'Health', render: function (r) { return scoreCell(r.healthScore, true); } },
        { label: 'Churn', render: function (r) { return scoreCell(r.churn, false); } },
        { label: 'LTV', render: function (r) { return '<span class="metric-value text-[13px]">' + D.inr(r.ltv) + '</span>'; } },
        { label: '', render: function (r) { return '<button class="btn btn-sm btn-soft" data-action="view-patient" data-id="' + r.id + '">360°</button>'; } },
      ];
      return ui.pageHeader({ eyebrow: 'Clinical · Patient Management', title: 'Patient Directory', subtitle: D.num(D.exec.activePatients) + ' active patients · FHIR R4 · ABHA-linked · DPDP compliant.', actions: [{ label: 'Import', icon: 'fa-file-import', variant: 'btn-ghost', action: 'import' }, { label: 'New Patient', icon: 'fa-user-plus', variant: 'btn-primary', action: 'new-patient' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-users', value: D.num(D.exec.activePatients), label: 'Active Patients', trend: 12, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-heart-pulse', value: D.num(D.exec.rpmActive), label: 'RPM Monitored', trend: 9, c1: '#ef4444', c2: '#b91c1c' }) +
          ui.statCard({ icon: 'fa-triangle-exclamation', value: '1,840', label: 'High-Risk Tier', sub: 'auto-flagged', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-indian-rupee-sign', value: '₹2,840', label: 'Avg Patient LTV', trend: 6, c1: '#16ad8f', c2: '#0a8b75' }) +
        '</div>' +
        ui.table('tbl-patients', cols, D.patients, { title: 'All Patients', subtitle: 'Click 360° to open the full longitudinal record' });
    },
    init: function () { ui.initDataTable('tbl-patients'); },
  };

  function scoreCell(v, positiveGood) {
    var color = positiveGood ? (v >= 75 ? '#16ad8f' : v >= 50 ? '#f59e0b' : '#ef4444') : (v <= 30 ? '#16ad8f' : v <= 60 ? '#f59e0b' : '#ef4444');
    return '<div class="flex items-center gap-2"><div class="progress w-14"><span style="width:' + v + '%;background:' + color + '"></span></div><span class="metric-value text-[12.5px]" style="color:' + color + '">' + v + '</span></div>';
  }

  App.actions = App.actions || {};
  App.actions['view-patient'] = function (btn) { openPatient360(btn.getAttribute('data-id')); };
  App.actions['new-patient'] = function () {
    ui.modal({ title: 'Register New Patient', subtitle: 'Identity · KYC · ABHA', icon: 'fa-user-plus',
      body: '<div class="grid-2" style="gap:14px"><div><label class="field-label">Full Name</label><input class="input" placeholder="Patient name" /></div>' +
        '<div><label class="field-label">Date of Birth</label><input class="input" id="np-dob" placeholder="Select date" /></div>' +
        '<div><label class="field-label">Gender</label><select class="select"><option>Male</option><option>Female</option><option>Other</option></select></div>' +
        '<div><label class="field-label">ABHA / Aadhaar</label><input class="input" placeholder="14-digit ABHA" /></div>' +
        '<div><label class="field-label">City</label><select class="select">' + D.cities.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
        '<div><label class="field-label">Plan</label><select class="select"><option>Silver</option><option>Gold</option><option>Platinum</option><option>PMJAY</option></select></div></div>',
      buttons: [{ label: 'Cancel', variant: 'btn-ghost', close: true }, { label: 'Verify & Create', variant: 'btn-primary', icon: 'fa-check', onClick: function () { ui.toast({ title: 'Patient created', text: 'Identity verified · ABHA linked · record initialised.', type: 'success' }); } }] });
    setTimeout(function () { if (window.flatpickr) flatpickr('#np-dob', {}); }, 60);
  };

  function openPatient360(id) {
    var p = D.patients.find(function (x) { return x.id === id; }) || D.patients[0];
    App.router.go('patient-360');
    App._p360 = p;
  }

  /* ---- 360 Patient Profile ---- */
  P['patient-360'] = {
    render: function () {
      var p = App._p360 || D.patients[0];
      return ui.pageHeader({ eyebrow: 'Clinical · 360° Profile', title: '360° Patient Profile', subtitle: 'Longitudinal FHIR R4 record · vitals, history, AI scores, care plan and billing.', actions: [{ label: 'Timeline', icon: 'fa-timeline', variant: 'btn-ghost', action: 'noop' }, { label: 'Start Consult', icon: 'fa-video', variant: 'btn-primary', action: 'consult' }] }) +
        '<div class="grid-3 mb-4">' +
          // identity card
          '<div class="card p-5">' +
            '<div class="flex items-center gap-4">' + ui.avatar(p.name, 64) + '<div><div class="section-title text-lg">' + p.name + '</div><div class="text-muted text-[13px]">' + p.age + ' yrs · ' + p.gender + ' · ' + p.city + '</div><div class="mt-2 flex gap-2">' + ui.status(p.plan) + ui.status(p.risk + ' Risk') + '</div></div></div>' +
            '<div class="divider my-4"></div>' +
            kv('Patient ID', p.id) + kv('ABHA', p.abha) + kv('Blood Group', D.pick(['O+', 'A+', 'B+', 'AB+'])) + kv('Primary Condition', p.condition) + kv('Last Visit', p.lastVisit) +
          '</div>' +
          // AI scores
          '<div class="card p-5">' + ui.sectionTitle('AI Health Scores', 'Updated daily') +
            '<div class="grid grid-cols-2 gap-3">' +
              miniScore('Health Score', p.healthScore, '#16ad8f') + miniScore('Churn Risk', p.churn, '#ef4444') +
              miniScore('Emergency Score', p.emgScore, '#f59e0b') + miniScore('Engagement', D.rnd(40, 95), '#1b7df5') +
            '</div>' +
            '<div class="divider my-3"></div><div class="flex items-center justify-between"><span class="text-muted text-[13px]">Patient Lifetime Value</span><span class="metric-value gradient-text">' + D.inr(p.ltv) + '</span></div>' +
          '</div>' +
          // vitals
          '<div class="card p-5">' + ui.sectionTitle('Latest Vitals', 'RPM stream') + '<div style="height:140px"><canvas id="p360-vitals"></canvas></div>' +
            '<div class="grid grid-cols-2 gap-2 mt-3">' + vital('BP', '128/82', 'fa-heart-pulse', '#ef4444') + vital('SpO2', '97%', 'fa-lungs', '#1b7df5') + vital('HR', '78 bpm', 'fa-wave-square', '#16ad8f') + vital('Glucose', '104', 'fa-droplet', '#f59e0b') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="grid-3">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Medical Timeline', 'Consultations · diagnoses · prescriptions') + timeline() + '</div>' +
          '<div class="card p-5">' + ui.sectionTitle('Care Plan & Meds', 'Active') +
            ui.tile({ icon: 'fa-pills', color: '#8b5cf6', title: 'Metformin 500mg', text: 'Twice daily · with meals' }) + '<div class="h-2"></div>' +
            ui.tile({ icon: 'fa-pills', color: '#1b7df5', title: 'Telmisartan 40mg', text: 'Once daily · morning' }) + '<div class="h-2"></div>' +
            ui.tile({ icon: 'fa-calendar-check', color: '#16ad8f', title: 'Physiotherapy', text: '3x weekly · home visit' }) + '<div class="h-2"></div>' +
            ui.tile({ icon: 'fa-vial', color: '#f59e0b', title: 'HbA1c Test', text: 'Due in 14 days' }) +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.lineChart('p360-vitals', ['', '', '', '', '', '', ''], [
        { label: 'HR', data: [76, 80, 78, 82, 77, 79, 78], color: '#16ad8f', fill: true },
      ], { legend: false, zero: false });
    },
  };
  function kv(k, v) { return '<div class="flex justify-between py-1.5 text-[13px]"><span class="text-muted">' + k + '</span><span class="font-semibold font-mono">' + v + '</span></div>'; }
  function miniScore(label, v, color) { return '<div class="p-3 rounded-xl card-2 hairline border text-center"><div class="metric-value text-2xl" style="color:' + color + '">' + v + '</div><div class="text-muted text-[11px] mt-1">' + label + '</div></div>'; }
  function vital(label, v, icon, color) { return '<div class="flex items-center gap-2 p-2.5 rounded-lg card-2 hairline border"><i class="fa-solid ' + icon + '" style="color:' + color + '"></i><div><div class="font-semibold text-[13px]">' + v + '</div><div class="text-muted text-[10.5px]">' + label + '</div></div></div>'; }
  function timeline() {
    var events = [
      { icon: 'fa-video', color: '#1b7df5', t: 'Video consultation · Dr. Sharma (Cardiology)', d: '2 days ago', x: 'BP well controlled. Continue current regimen.' },
      { icon: 'fa-vial', color: '#f59e0b', t: 'Lab report uploaded · Lipid Profile', d: '5 days ago', x: 'LDL 112 mg/dL · slightly elevated.' },
      { icon: 'fa-prescription', color: '#8b5cf6', t: 'Prescription issued', d: '5 days ago', x: 'Atorvastatin 10mg added.' },
      { icon: 'fa-house-medical', color: '#16ad8f', t: 'Home nursing visit completed', d: '8 days ago', x: 'Vitals recorded · wound dressing changed.' },
      { icon: 'fa-truck-medical', color: '#ef4444', t: 'Emergency · chest pain (resolved)', d: '22 days ago', x: 'ECG normal · discharged after observation.' },
    ];
    return '<div class="space-y-0">' + events.map(function (e, i) {
      return '<div class="feed-item pb-4 last:pb-0">' + (i < events.length - 1 ? '<span class="feed-line"></span>' : '') +
        '<div class="flex items-start justify-between gap-3"><div><div class="text-[13.5px] font-semibold flex items-center gap-2"><i class="fa-solid ' + e.icon + ' text-xs" style="color:' + e.color + '"></i>' + e.t + '</div><div class="text-muted text-xs mt-0.5">' + e.x + '</div></div><div class="text-muted text-[11px] whitespace-nowrap">' + e.d + '</div></div></div>';
    }).join('') + '</div>';
  }

  /* ---- Segmentation & Risk ---- */
  P['patient-segments'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Clinical · Intelligence', title: 'Patient Segmentation & Risk', subtitle: 'Multi-dimensional classification: clinical, risk tier, behavioural, geographic and commercial.' }) +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Risk Tier Distribution', 'AI-classified') + '<div style="height:240px"><canvas id="seg-risk"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Behavioural Segments', 'Engagement model') + '<div style="height:240px"><canvas id="seg-behav"></canvas></div></div>' +
        '</div>' +
        '<div class="grid-4 stagger">' +
          segCard('Chronic Care', '38,400', 'fa-heart-pulse', '#ef4444', 'Diabetes, HTN, Cardiac') +
          segCard('Maternal & Child', '12,800', 'fa-baby', '#8b5cf6', 'ANC, paediatric') +
          segCard('Power Users', '24,100', 'fa-bolt', '#f59e0b', '>8 sessions/mo') +
          segCard('At-Risk Churn', '4,200', 'fa-arrow-trend-down', '#fb7185', 'CPI > 65%') +
        '</div>';
    },
    init: function () {
      ui.donut('seg-risk', [{ label: 'High Risk', value: 14, color: '#ef4444' }, { label: 'Medium', value: 31, color: '#f59e0b' }, { label: 'Low', value: 55, color: '#16ad8f' }], { legend: 'bottom' });
      ui.barChart('seg-behav', ['Power', 'Engaged', 'At-Risk', 'Dormant', 'New'], [{ label: 'Patients (K)', data: [24, 186, 42, 38, 64], color: '#1b7df5' }], { legend: false });
    },
  };
  function segCard(title, val, icon, color, sub) {
    return '<div class="card card-hover p-5"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style="background:' + color + '"><i class="fa-solid ' + icon + '"></i></div><div class="metric-value text-2xl">' + val + '</div><div class="text-[13px] font-semibold mt-1">' + title + '</div><div class="text-muted text-[11.5px] mt-0.5">' + sub + '</div></div>';
  }

  /* ---- RPM ---- */
  P['rpm'] = {
    render: function () {
      var rpmP = D.patients.filter(function (p) { return p.rpm; }).slice(0, 12);
      return ui.pageHeader({ eyebrow: 'Clinical · Remote Monitoring', title: 'RPM Monitoring', subtitle: D.num(D.exec.rpmActive) + ' patients actively monitored · connected device streams with alert thresholds.', actions: [{ label: 'Alert Settings', icon: 'fa-bell', variant: 'btn-ghost', action: 'configure' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-heart-pulse', value: D.num(D.exec.rpmActive), label: 'Patients Monitored', trend: 9, c1: '#ef4444', c2: '#b91c1c' }) +
          ui.statCard({ icon: 'fa-plug-circle-check', value: '92%', label: 'Device Connectivity', sub: '24h sync', trend: 2, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-bell', value: '12', label: 'Active Alerts', sub: '3 critical', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-hospital', value: '32%', label: 'Hospitalisation Avoided', trend: 5, c1: '#1b7df5', c2: '#1465e1' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Cohort Vitals Trend', 'Aggregate · 24h') + '<div style="height:260px"><canvas id="rpm-trend"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Critical Alerts', 'Threshold breaches', '<span class="live-dot"></span>') +
            ['SpO2 86% · PT-10293', 'BP 168/102 · PT-10311', 'Glucose 312 · PT-10288'].map(function (a) { return ui.tile({ icon: 'fa-triangle-exclamation', color: '#ef4444', title: a.split(' · ')[0], text: a.split(' · ')[1] + ' · escalated', right: ui.badge('High', 'red') }); }).join('<div class="h-2"></div>') +
          '</div>' +
        '</div>' +
        ui.table('tbl-rpm', [
          { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Condition', key: 'condition' },
          { label: 'Device Sync', render: function () { return ui.badge('Connected', 'green'); } },
          { label: 'Health', render: function (r) { return scoreCell(r.healthScore, true); } },
          { label: 'Adherence', render: function () { return scoreCell(D.rnd(60, 98), true); } },
          { label: 'Status', render: function (r) { return ui.status(r.healthScore < 55 ? 'High' : 'Low'); } },
        ], rpmP, { title: 'Monitored Patients' });
    },
    init: function () {
      ui.lineChart('rpm-trend', Array.from({ length: 24 }, function (_, i) { return i + 'h'; }), [
        { label: 'Avg HR', data: Array.from({ length: 24 }, function () { return D.rnd(70, 88); }), color: '#16ad8f', fill: true },
        { label: 'Avg SpO2', data: Array.from({ length: 24 }, function () { return D.rnd(94, 99); }), color: '#1b7df5' },
      ], { zero: false });
      ui.initDataTable('tbl-rpm', { pageLength: 6 });
    },
  };

  /* ---- Care Plans ---- */
  P['care-plans'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Clinical · Continuous Care', title: 'Care Plans', subtitle: 'AI-generated, CMO-approved care plans for chronic, post-surgical and elderly cohorts.', actions: [{ label: 'New Care Plan', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-3 stagger">' +
          ['Post-Surgical Recovery', 'Diabetes Management', 'Elderly Care', 'Maternal · ANC', 'Cardiac Rehab', 'Palliative Care'].map(function (t, i) {
            var prog = D.rnd(40, 95);
            return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid fa-clipboard-list"></i></div>' + ui.badge(D.rnd(80, 400) + ' active', 'blue') + '</div>' +
              '<div class="section-title text-base">' + t + '</div><div class="text-muted text-[12.5px] mt-1 mb-3">AI-generated · reviewed by Dr. ' + D.name().split(' ')[1] + '</div>' +
              '<div class="flex justify-between text-[12px] mb-1.5"><span class="text-muted">Avg adherence</span><span class="metric-value">' + prog + '%</span></div>' + ui.progress(prog) + '</div>';
          }).join('') +
        '</div>';
    },
    init: function () {},
  };

})(window.MyDR24);
