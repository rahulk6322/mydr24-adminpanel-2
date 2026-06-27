/* ==========================================================================
   MyDR24 HOS — Finance, Billing, Subscriptions, Pricing, Payroll
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;

  P['finance'] = {
    render: function () {
      var e = D.exec;
      return ui.pageHeader({ eyebrow: 'Business · Finance', title: 'Finance Dashboard', subtitle: 'Revenue, billing, GST/TDS, refunds, cash flow and AI forecast.', actions: [{ label: 'Export Ledger', icon: 'fa-file-export', variant: 'btn-ghost', action: 'export' }, { label: 'Reconcile', icon: 'fa-scale-balanced', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-sack-dollar', value: D.inr(e.mrr), label: 'MRR', sub: 'ARR ' + D.inr(e.arr), trend: 20, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-chart-pie', value: e.grossMargin + '%', label: 'Gross Margin', trend: 3, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-money-bill-transfer', value: '₹38.7 Cr', label: 'Cash in Bank', sub: e.runwayMonths + 'mo runway', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-receipt', value: '0.7%', label: 'Revenue Leakage', sub: 'of GMV', trend: -2, positiveGood: false, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Cash Flow', 'Inflow vs Outflow · ₹M') + '<div style="height:280px"><canvas id="fin-cash"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Statutory', 'Current period') +
            kv('GST Collected', '₹4.2 Cr') + kv('TDS Deducted', '₹86 L') + kv('Refunds Issued', '₹12 L') + kv('Commission Payable', '₹4.2 Cr') + kv('Net Payable', '₹3.1 Cr') +
          '</div>' +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Revenue by Service', '') + '<div style="height:240px"><canvas id="fin-mix"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Expense Breakdown', '') +
            [['Workforce & Commission', 42], ['Technology & Cloud', 18], ['Marketing & CAC', 22], ['Operations', 12], ['G&A', 6]].map(function (r) { return '<div class="mb-3"><div class="flex justify-between text-[13px] mb-1.5"><span>' + r[0] + '</span><span class="metric-value">' + r[1] + '%</span></div>' + ui.progress(r[1]) + '</div>'; }).join('') +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('fin-cash', D.months, [
        { label: 'Inflow', data: D.revenueSeries, color: '#16ad8f' },
        { label: 'Outflow', data: D.revenueSeries.map(function (v) { return +(v * 0.78).toFixed(1); }), color: '#fb7185' },
      ], {});
      ui.donut('fin-mix', D.serviceMix, { legend: 'right' });
    },
  };
  function kv(k, v) { return '<div class="flex items-center justify-between py-2.5" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><span class="text-muted text-[13px]">' + k + '</span><span class="metric-value text-[15px]">' + v + '</span></div>'; }

  P['billing'] = {
    render: function () {
      var rows = D.patients.slice(0, 18).map(function (p) {
        return { id: 'INV-' + D.rnd(40000, 49999), name: p.name, amount: D.rnd(2, 80) * 100, status: D.pick(['Paid', 'Paid', 'Pending', 'Refunded']), date: D.rnd(1, 28) + ' Jun', plan: p.plan };
      });
      return ui.pageHeader({ eyebrow: 'Business · Billing', title: 'Billing & Invoices', subtitle: 'Automated invoicing, wallet, GST-compliant billing and refund management.', actions: [{ label: 'Create Invoice', icon: 'fa-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-file-invoice-dollar', value: D.num(48200), label: 'Invoices (MTD)', trend: 9, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-circle-check', value: '94.6%', label: 'Collection Rate', trend: 2, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-hourglass-half', value: '₹64 L', label: 'Outstanding', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-rotate-left', value: '₹12 L', label: 'Refunds (MTD)', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        ui.table('tbl-bill', [
          { label: 'Invoice', render: function (r) { return '<span class="font-mono text-[12.5px] font-semibold">' + r.id + '</span>'; } },
          { label: 'Patient', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 28) + '<span>' + r.name + '</span></div>'; } },
          { label: 'Plan', render: function (r) { return ui.status(r.plan); } },
          { label: 'Amount', render: function (r) { return '<span class="metric-value text-[13px]">₹' + D.num(r.amount) + '</span>'; } },
          { label: 'Date', key: 'date' },
          { label: 'Status', render: function (r) { return ui.badge(r.status, r.status === 'Paid' ? 'green' : r.status === 'Pending' ? 'amber' : 'violet'); } },
        ], rows, { title: 'Recent Invoices' });
    },
    init: function () { ui.initDataTable('tbl-bill'); },
  };

  P['subscriptions'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Business · Recurring', title: 'Subscriptions & Plans', subtitle: 'Silver / Gold / Platinum / Corporate / PMJAY plans · MRR, churn and expansion.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-crown', value: D.num(184200), label: 'Active Subscribers', trend: 11, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-arrow-rotate-left', value: '112%', label: 'Net Revenue Retention', trend: 3, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-user-minus', value: '2.4%', label: 'Monthly Churn', trend: -1, positiveGood: false, c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-indian-rupee-sign', value: '₹912', label: 'ARPU', trend: 5, c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Subscribers by Plan', '') + '<div style="height:240px"><canvas id="sub-plan"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('MRR Movement', 'New / Expansion / Churn · ₹M') + '<div style="height:240px"><canvas id="sub-mrr"></canvas></div></div>' +
        '</div>' +
        '<div class="grid-4 stagger">' +
          planCard('Silver', '₹299/mo', '92,400', '#94a3b8') + planCard('Gold', '₹699/mo', '58,200', '#f59e0b') +
          planCard('Platinum', '₹1,499/mo', '21,800', '#8b5cf6') + planCard('Corporate / PMJAY', 'Contract', '11,800', '#16ad8f') +
        '</div>';
    },
    init: function () {
      ui.donut('sub-plan', [{ label: 'Silver', value: 50, color: '#94a3b8' }, { label: 'Gold', value: 31, color: '#f59e0b' }, { label: 'Platinum', value: 12, color: '#8b5cf6' }, { label: 'Corp/PMJAY', value: 7, color: '#16ad8f' }], { legend: 'bottom' });
      ui.barChart('sub-mrr', D.months.slice(6), [
        { label: 'New', data: [2.1, 2.4, 2.2, 2.8, 2.6, 3.1], color: '#16ad8f' },
        { label: 'Expansion', data: [0.8, 1.1, 0.9, 1.3, 1.2, 1.5], color: '#1b7df5' },
        { label: 'Churn', data: [-0.6, -0.7, -0.5, -0.8, -0.6, -0.7], color: '#fb7185' },
      ], { stacked: true });
    },
  };
  function planCard(name, price, subs, color) {
    return '<div class="card card-hover p-5"><div class="flex items-center justify-between mb-3"><span class="badge" style="background:' + color + '22;color:' + color + ';border-color:' + color + '44">' + name + '</span><i class="fa-solid fa-crown" style="color:' + color + '"></i></div><div class="metric-value text-xl">' + subs + '</div><div class="text-muted text-[12px] mt-0.5">subscribers · ' + price + '</div></div>';
  }

  P['pricing-engine'] = {
    render: function () {
      var rows = [
        ['PIN Code Zone', 'Metro / Urban / Semi-Urban / Rural multipliers', 'Admin floor/ceiling per zone'],
        ['Distance from Caregiver', 'Per-km above base radius, decays with tier', 'Max 50 km / dispatch'],
        ['Day / Night Differential', 'Night rate 10PM–6AM', '1.3x–1.6x · DPDP-disclosed'],
        ['Time on Task', 'Hourly billing beyond standard visit', '15-min increments'],
        ['Demand Surge', 'AI peak pricing when demand > supply', '1.5x cap · disclosure mandatory'],
        ['Subscription Discount', 'Plans lock flat rates, waive surge', 'Plan-specific override'],
        ['Govt Scheme Override', 'PMJAY / Ayushman auto eligibility', 'Scheme billing codes'],
        ['Corporate B2B Rate', 'Volume contract pricing', 'Contract-term tracked'],
      ];
      return ui.pageHeader({ eyebrow: 'Business · Pricing', title: 'Dynamic Pricing Engine', subtitle: 'Multi-variable geo-intelligence pricing benchmarked to surge architecture — affordable in rural, viable in metro.', actions: [{ label: 'Simulate', icon: 'fa-flask', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-sliders', value: '8', label: 'Pricing Variables', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-location-dot', value: '4', label: 'Zone Tiers', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-bolt', value: '1.5x', label: 'Surge Cap', sub: 'disclosed', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-landmark', value: '45%', label: 'PMJAY Penetration', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        ui.table('tbl-price', [
          { label: 'Variable', render: function (r) { return '<span class="font-semibold">' + r[0] + '</span>'; } },
          { label: 'Logic', render: function (r) { return '<span class="text-muted">' + r[1] + '</span>'; } },
          { label: 'Cap / Rule', render: function (r) { return ui.badge(r[2], 'blue'); } },
        ], rows, { title: 'Pricing Variables' });
    },
    init: function () { ui.initDataTable('tbl-price', { paging: false, info: false, searching: false }); },
  };

  P['payroll'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Business · HRMS', title: 'HRMS & Payroll', subtitle: 'Recruitment, attendance, leave, shift, payroll, appraisal and asset management.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-people-roof', value: '4,820', label: 'Total Workforce', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-money-check-dollar', value: '₹6.8 Cr', label: 'Monthly Payroll', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-user-clock', value: '96%', label: 'Attendance', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-user-plus', value: '142', label: 'Open Positions', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-3">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Headcount by Function', '') + '<div style="height:260px"><canvas id="hr-head"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Payroll Run', 'June 2026') +
            kv('Gross', '₹6.8 Cr') + kv('Deductions', '₹84 L') + kv('Net Payable', '₹5.96 Cr') + kv('PF + ESI', '₹52 L') +
            '<button class="btn btn-primary w-full mt-4" data-action="run-payroll"><i class="fa-solid fa-play"></i> Run Payroll</button>' +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('hr-head', ['Caregivers', 'Doctors', 'Ops', 'Tech', 'CRM', 'Support', 'G&A'], [{ label: 'Headcount', data: [2180, 320, 480, 240, 360, 680, 180], color: '#1b7df5' }], { legend: false });
    },
  };
  App.actions = App.actions || {};
  App.actions['run-payroll'] = function () { ui.toast({ title: 'Payroll initiated', text: '4,820 employees · ₹5.96 Cr net · processing via bank API.', type: 'success' }); };

})(window.MyDR24);
