/* ==========================================================================
   MyDR24 HOS — CRM, Leads, Pipeline, Referrals, Marketing, Appointments
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;
  App.actions = App.actions || {};

  /* ---- Unified CRM ---- */
  P['crm'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Growth · CRM', title: 'Unified CRM', subtitle: '360° relationship management across patients, doctors, hospitals, corporates, insurance and partners.', actions: [{ label: 'New Contact', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-address-book', value: '1.42 M', label: 'Total Contacts', trend: 11, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-funnel-dollar', value: '24%', label: 'Lead Conversion', trend: 3, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-headset', value: '70%', label: 'Bot Resolution', sub: 'no handoff', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-thumbs-up', value: '57', label: 'NPS Score', trend: 4, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-4 stagger mb-4">' +
          ['Patient CRM', 'Doctor CRM', 'Hospital CRM', 'Corporate CRM', 'Insurance CRM', 'Diagnostic CRM', 'Franchise CRM', 'Government CRM'].map(function (t, i) {
            var icons = ['fa-hospital-user', 'fa-user-doctor', 'fa-hospital', 'fa-building', 'fa-building-shield', 'fa-vial', 'fa-code-branch', 'fa-landmark'];
            return '<div class="card card-hover p-5"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + icons[i] + '"></i></div><div class="metric-value text-xl">' + D.num(D.rnd(120, 9800)) + '</div><div class="text-[13px] font-semibold mt-1">' + t + '</div></div>';
          }).join('') +
        '</div>' +
        ui.table('tbl-crm', [
          { label: 'Contact', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Source', render: function (r) { return ui.badge(r.source, 'blue'); } },
          { label: 'City', key: 'city' }, { label: 'Stage', render: function (r) { return ui.status(r.stage); } },
          { label: 'Score', render: function (r) { return '<span class="metric-value text-[13px]">' + r.score + '</span>'; } },
          { label: 'Value', render: function (r) { return D.inr(r.value); } }, { label: 'Owner', key: 'owner' },
        ], D.leads, { title: 'Recent Contacts & Leads' });
    },
    init: function () { ui.initDataTable('tbl-crm'); },
  };

  P['crm-corporate'] = corpInsurancePage();
  function corpInsurancePage() {
    return {
      render: function () {
        return ui.pageHeader({ eyebrow: 'Growth · B2B', title: 'Corporate & Insurance CRM', subtitle: 'Volume contracts, SLAs, wellness programs and insurance partner management.' }) +
          '<div class="grid-4 stagger mb-4">' +
            ui.statCard({ icon: 'fa-building', value: '184', label: 'Corporate Accounts', trend: 9, c1: '#1b7df5', c2: '#1465e1' }) +
            ui.statCard({ icon: 'fa-building-shield', value: '23', label: 'Insurance Partners', c1: '#16ad8f', c2: '#0a8b75' }) +
            ui.statCard({ icon: 'fa-users', value: '2.4 L', label: 'Covered Lives', trend: 14, c1: '#8b5cf6', c2: '#6d28d9' }) +
            ui.statCard({ icon: 'fa-file-contract', value: '₹42 Cr', label: 'Contract Value', trend: 18, c1: '#f59e0b', c2: '#d97706' }) +
          '</div>' +
          ui.table('tbl-corp', [
            { label: 'Account', render: function (r) { return '<span class="font-semibold">' + r[0] + '</span>'; } },
            { label: 'Type', render: function (r) { return ui.badge(r[1], 'blue'); } },
            { label: 'Lives', render: function (r) { return D.num(r[2]); } },
            { label: 'Contract', render: function (r) { return '<span class="metric-value text-[13px]">' + D.inr(r[3]) + '</span>'; } },
            { label: 'Status', render: function (r) { return ui.status(r[4]); } },
          ], [
            ['TCS Wellness', 'Corporate', 48000, 24000000, 'Active'], ['Infosys BPM', 'Corporate', 32000, 18000000, 'Active'],
            ['Star Health', 'Insurance', 120000, 56000000, 'Active'], ['HDFC Ergo', 'Insurance', 85000, 54000000, 'Active'],
            ['Wipro Health', 'Corporate', 41000, 67000000, 'Negotiation'], ['Reliance Foundation', 'Corporate', 28000, 41000000, 'Proposal'],
          ], { title: 'Corporate & Insurance Accounts' });
      },
      init: function () { ui.initDataTable('tbl-corp', { paging: false, info: false }); },
    };
  }

  P['crm-partners'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Growth · Ecosystem', title: 'Partner & Vendor CRM', subtitle: 'Franchises, diagnostic labs, pharmacies, equipment vendors and government programs.' }) +
        '<div class="grid-3 stagger">' +
          [['Franchises', 'fa-code-branch', 64, '#1b7df5'], ['Diagnostic Labs', 'fa-vial', 142, '#16ad8f'], ['Pharmacies', 'fa-prescription-bottle-medical', 380, '#8b5cf6'], ['Equipment Vendors', 'fa-wheelchair', 56, '#f59e0b'], ['Govt Programs', 'fa-landmark', 12, '#ef4444'], ['Ambulance Partners', 'fa-truck-medical', 210, '#0ea5e9']].map(function (p) {
            return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" style="background:' + p[3] + '"><i class="fa-solid ' + p[1] + '"></i></div>' + ui.badge('Active', 'green') + '</div><div class="metric-value text-2xl">' + p[2] + '</div><div class="text-[13px] font-semibold mt-1">' + p[0] + '</div></div>';
          }).join('') +
        '</div>';
    },
    init: function () {},
  };

  /* ---- Lead Management ---- */
  P['leads'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Growth · Acquisition', title: 'Lead Management', subtitle: 'Omni-channel lead capture, AI scoring, auto-assignment and pipeline automation.', actions: [{ label: 'Lead Automation', icon: 'fa-robot', variant: 'btn-ghost', action: 'noop' }, { label: 'Add Lead', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-filter', value: D.num(8420), label: 'Active Leads', trend: 12, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-bolt', value: '24%', label: 'Conversion Rate', trend: 3, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-phone-missed', value: '15 min', label: 'Avg Callback', sub: 'missed-call', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-star', value: '68', label: 'Avg Lead Score', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Leads by Source', 'Channel mix') + '<div style="height:240px"><canvas id="lead-src"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Lead Score Distribution', 'AI scoring') + '<div style="height:240px"><canvas id="lead-score"></canvas></div></div>' +
        '</div>' +
        ui.table('tbl-leads', [
          { label: 'Lead', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<div><div class="font-semibold">' + r.name + '</div><div class="text-muted text-xs font-mono">' + r.id + '</div></div></div>'; } },
          { label: 'Source', render: function (r) { return ui.badge(r.source, 'blue'); } },
          { label: 'Stage', render: function (r) { return ui.status(r.stage); } },
          { label: 'Score', render: function (r) { var c = r.score > 70 ? '#16ad8f' : r.score > 40 ? '#f59e0b' : '#ef4444'; return '<span class="metric-value text-[13px]" style="color:' + c + '">' + r.score + '</span>'; } },
          { label: 'Value', render: function (r) { return D.inr(r.value); } },
          { label: 'Owner', key: 'owner' }, { label: 'Created', key: 'created' },
        ], D.leads, { title: 'All Leads' });
    },
    init: function () {
      ui.donut('lead-src', [
        { label: 'Website', value: 24, color: '#1b7df5' }, { label: 'WhatsApp', value: 22, color: '#16ad8f' },
        { label: 'Referral', value: 18, color: '#8b5cf6' }, { label: 'Google Ads', value: 14, color: '#f59e0b' },
        { label: 'IVR', value: 12, color: '#0ea5e9' }, { label: 'Facebook', value: 10, color: '#ec4899' },
      ], { legend: 'bottom' });
      ui.barChart('lead-score', ['0-20', '21-40', '41-60', '61-80', '81-100'], [{ label: 'Leads', data: [620, 1240, 2380, 2640, 1540], color: '#8b5cf6' }], { legend: false });
      ui.initDataTable('tbl-leads');
    },
  };

  /* ---- Sales Pipeline (Kanban) ---- */
  P['pipeline'] = {
    render: function () {
      var total = Object.keys(D.pipeline).reduce(function (s, k) { return s + D.pipeline[k].reduce(function (a, c) { return a + c.value; }, 0); }, 0);
      return ui.pageHeader({ eyebrow: 'Growth · Sales', title: 'Sales Pipeline', subtitle: 'Drag opportunities across stages · ' + D.inr(total) + ' weighted pipeline · AI revenue prediction.', actions: [{ label: 'Forecast', icon: 'fa-chart-line', variant: 'btn-ghost', action: 'noop' }, { label: 'New Opportunity', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-diagram-project', value: D.inr(total), label: 'Total Pipeline', trend: 14, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-trophy', value: '₹1.43 Cr', label: 'Won (MTD)', trend: 22, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-percent', value: '32%', label: 'Win Rate', trend: 4, c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-hourglass', value: '24 days', label: 'Avg Cycle', trend: -8, positiveGood: false, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="card p-5">' + ui.sectionTitle('Opportunity Board', 'Drag cards between stages') + ui.kanban(D.pipeline, { id: 'sales-kanban' }) + '</div>';
    },
    init: function () { ui.initKanban('sales-kanban'); },
  };

  /* ---- Referral & Commission ---- */
  P['referrals'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Growth · Referral', title: 'Referral & Commission', subtitle: 'Multi-level referral attribution, dynamic commission rules, ROI and fraud detection.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-share-nodes', value: '0.42', label: 'Viral Coefficient', sub: 'target >0.4', trend: 6, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-hand-holding-dollar', value: '₹1.8 Cr', label: 'Referral Revenue', trend: 12, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-crown', value: '186', label: 'Gold Referrers', sub: '>25/mo', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-shield-halved', value: '0.2%', label: 'Fraud Flag Rate', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Referral by Type', 'Source mix') + '<div style="height:240px"><canvas id="ref-type"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Commission Rules', 'Multi-level') +
            ruleRow('L1 Referring Doctor', '10% of first consult', 'green') + ruleRow('L2 Referral-of-referral', '3%', 'blue') +
            ruleRow('Patient Referral', '8–12% · 180-day window', 'violet') + ruleRow('Corporate Deal Bonus', '₹5K–₹25K on signing', 'amber') +
            ruleRow('Gold Tier Unlock', '>25 referrals/mo', 'green') +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.donut('ref-type', [
        { label: 'Doctor', value: 34, color: '#1b7df5' }, { label: 'Patient', value: 28, color: '#16ad8f' },
        { label: 'Corporate', value: 18, color: '#8b5cf6' }, { label: 'Affiliate', value: 12, color: '#f59e0b' }, { label: 'Hospital', value: 8, color: '#ef4444' },
      ], { legend: 'bottom' });
    },
  };
  function ruleRow(label, val, color) { return '<div class="flex items-center justify-between py-3" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><span class="text-[13.5px] font-medium">' + label + '</span>' + ui.badge(val, color) + '</div>'; }

  /* ---- Marketing ---- */
  P['mkt-whatsapp'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Marketing · WABA', title: 'WhatsApp Business', subtitle: 'DPDP-compliant broadcast campaigns, AI journeys, catalogue and chatbot lead qualification.', actions: [{ label: 'New Broadcast', icon: 'fa-paper-plane', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-whatsapp', value: '78%', label: 'Open Rate', sub: '98% delivered', trend: 4, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-robot', value: '70%', label: 'Bot Resolution', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-diagram-next', value: '12', label: 'Active Journeys', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-comment-dots', value: '1.2 M', label: 'Messages (MTD)', trend: 18, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Journey Templates', 'Pre-built · AI-personalised') +
            ['Chronic Care', 'Post-Surgical', 'Maternal', 'Paediatric', 'Mental Health', 'Subscription Renewal'].map(function (t) { return ui.tile({ icon: 'fa-diagram-next', color: '#16ad8f', title: t + ' Journey', text: D.rnd(60, 95) + '% completion · ' + D.rnd(1, 9) + ' steps', right: ui.badge('Live', 'green') }); }).join('<div class="h-2"></div>') +
          '</div>' +
          '<div class="card p-5">' + ui.sectionTitle('Campaign Performance', 'Last 12 periods') + '<div style="height:280px"><canvas id="wa-perf"></canvas></div></div>' +
        '</div>';
    },
    init: function () {
      ui.lineChart('wa-perf', D.months, [
        { label: 'Open Rate %', data: D.months.map(function () { return D.rnd(72, 84); }), color: '#16ad8f', fill: true },
        { label: 'Click Rate %', data: D.months.map(function () { return D.rnd(28, 42); }), color: '#1b7df5' },
      ], { zero: false });
    },
  };

  P['mkt-campaigns'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Marketing · Campaigns', title: 'Campaign Manager', subtitle: 'Multi-channel campaigns with A/B testing, audience segmentation and ROAS tracking.', actions: [{ label: 'New Campaign', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-chart-line', value: '4.7x', label: 'Blended ROAS', trend: 8, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-indian-rupee-sign', value: '₹612', label: 'CAC', trend: -6, positiveGood: false, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-bullhorn', value: '18', label: 'Active Campaigns', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-vial-circle-check', value: '6', label: 'A/B Tests Running', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        ui.table('tbl-camp', [
          { label: 'Campaign', render: function (r) { return '<span class="font-semibold">' + r[0] + '</span>'; } },
          { label: 'Channel', render: function (r) { return ui.badge(r[1], 'blue'); } },
          { label: 'Spend', render: function (r) { return D.inr(r[2]); } },
          { label: 'ROAS', render: function (r) { return '<span class="metric-value text-[13px]" style="color:' + (r[3] > 4.5 ? '#16ad8f' : '#f59e0b') + '">' + r[3] + 'x</span>'; } },
          { label: 'Status', render: function (r) { return ui.status(r[4]); } },
        ], [
          ['Chronic Care Renewal', 'WhatsApp', 240000, 8.6, 'Active'], ['Monsoon Health Drive', 'Meta', 480000, 4.9, 'Active'],
          ['Corporate Wellness', 'Email', 120000, 6.2, 'Active'], ['Vaccination Reminder', 'SMS', 80000, 3.4, 'Active'],
          ['Diabetes Awareness', 'Google', 360000, 5.1, 'Active'], ['Elder Care Promo', 'Meta', 210000, 3.8, 'Paused'],
        ], { title: 'Campaign Performance' });
    },
    init: function () { ui.initDataTable('tbl-camp', { paging: false, info: false }); },
  };

  P['mkt-journeys'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Marketing · Automation', title: 'Journey Builder', subtitle: 'Visual lifecycle automation across WhatsApp, email, SMS and push.' }) +
        ui.placeholder('fa-diagram-next', 'Visual Journey Builder', 'Drag-and-drop lifecycle flows triggered by registration, first consult, RPM activation, renewal and health anniversaries — with AI send-time optimisation and branch logic.') +
        '<div class="grid-3 stagger mt-4">' +
          ['Welcome & Onboarding', 'Chronic Care Nurture', 'Win-Back (30/60/90d)', 'Renewal Sequence', 'Post-Consult NPS', 'Vaccination Drive'].map(function (t) {
            return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><i class="fa-solid fa-diagram-next text-xl" style="color:#8b5cf6"></i>' + ui.badge('Active', 'green') + '</div><div class="font-semibold">' + t + '</div><div class="text-muted text-xs mt-1">' + D.rnd(3, 8) + ' steps · ' + D.rnd(60, 94) + '% completion</div></div>';
          }).join('') +
        '</div>';
    },
    init: function () {},
  };

  P['mkt-analytics'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Marketing · Analytics', title: 'Marketing Analytics', subtitle: 'Attribution, funnel, ROAS, CAC and LTV across every acquisition channel.' }) +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Channel ROI', 'ROAS by channel') + '<div style="height:260px"><canvas id="ma-roi"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Acquisition Funnel', 'Conversion stages') +
            [['Visitors', 100], ['Registered', 42], ['KYC Complete', 31], ['First Booking', 22], ['Subscribed', 14]].map(function (r) { return '<div class="mb-3"><div class="flex justify-between text-[13px] mb-1.5"><span>' + r[0] + '</span><span class="text-muted">' + r[1] + '%</span></div>' + ui.progress(r[1]) + '</div>'; }).join('') +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('ma-roi', ['Google', 'Meta', 'WhatsApp', 'Referral', 'IVR', 'Email'], [{ label: 'ROAS (x)', data: [5.2, 4.1, 8.6, 11.2, 3.4, 6.2], color: '#16ad8f' }], { legend: false });
    },
  };

  /* ---- Appointments ---- */
  P['appointments'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Operations · Scheduling', title: 'Appointment Management', subtitle: 'Smart calendar, availability engine, queue, priority booking and multi-channel reminders.', actions: [{ label: 'Book Appointment', icon: 'fa-plus', variant: 'btn-primary', action: 'book-appt' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-calendar-check', value: D.num(2840), label: "Today's Appointments", trend: 6, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-clock', value: '8 min', label: 'Avg Wait Time', trend: -12, positiveGood: false, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-calendar-xmark', value: '4.2%', label: 'No-Show Rate', trend: -2, positiveGood: false, c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-bell', value: '94%', label: 'Reminder Delivery', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Bookings by Hour', 'Today') + '<div style="height:240px"><canvas id="appt-hours"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Reminder Channels', '') +
            chRow('WhatsApp', 98, '#16ad8f') + chRow('SMS', 99, '#1b7df5') + chRow('Email', 28, '#8b5cf6') + chRow('Push', 64, '#f59e0b') +
            '<div class="divider my-3"></div><div class="text-muted text-xs">Sequence: T-48h · T-24h · T-2h · T-15min with doctor profile card.</div>' +
          '</div>' +
        '</div>' +
        ui.table('tbl-appt', [
          { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Doctor', render: function () { return 'Dr. ' + D.name().split(' ')[1]; } },
          { label: 'Type', render: function () { return ui.badge(D.pick(['Video', 'Audio', 'Home Visit', 'In-Clinic']), 'blue'); } },
          { label: 'Time', render: function () { return D.rnd(9, 18) + ':' + D.pick(['00', '15', '30', '45']); } },
          { label: 'Status', render: function () { return ui.status(D.pick(['Confirmed', 'New', 'On Call'])); } },
        ], D.patients.slice(0, 14), { title: "Today's Schedule" });
    },
    init: function () {
      ui.barChart('appt-hours', ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'], [{ label: 'Bookings', data: [120, 180, 240, 160, 90, 140, 220, 280, 240, 160], color: '#1b7df5' }], { legend: false });
      ui.initDataTable('tbl-appt', { pageLength: 7 });
    },
  };
  function chRow(label, pct, color) { return '<div class="mb-3"><div class="flex justify-between text-[13px] mb-1.5"><span>' + label + '</span><span class="metric-value">' + pct + '%</span></div>' + ui.progress(pct, color) + '</div>'; }

  App.actions['book-appt'] = function () {
    ui.modal({ title: 'Book Appointment', subtitle: 'Smart availability engine', icon: 'fa-calendar-plus',
      body: '<div class="grid-2" style="gap:14px"><div><label class="field-label">Patient</label><input class="input" placeholder="Search patient" /></div>' +
        '<div><label class="field-label">Specialty</label><select class="select"><option>Cardiology</option><option>General Medicine</option><option>Paediatrics</option></select></div>' +
        '<div><label class="field-label">Date</label><input class="input" id="appt-date" placeholder="Select date" /></div>' +
        '<div><label class="field-label">Mode</label><select class="select"><option>Video</option><option>Audio</option><option>Home Visit</option><option>In-Clinic</option></select></div></div>',
      buttons: [{ label: 'Cancel', variant: 'btn-ghost', close: true }, { label: 'Confirm Booking', variant: 'btn-primary', icon: 'fa-check', onClick: function () { ui.toast({ title: 'Appointment booked', text: 'Confirmed · WhatsApp + SMS reminders scheduled.', type: 'success' }); } }] });
    setTimeout(function () { if (window.flatpickr) flatpickr('#appt-date', {}); }, 60);
  };

})(window.MyDR24);
