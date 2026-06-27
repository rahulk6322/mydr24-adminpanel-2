/* ==========================================================================
   MyDR24 HOS — Doctor Management
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;

  P['doctors'] = {
    render: function () {
      var cols = [
        { label: 'Doctor', render: function (r) { return '<div class="flex items-center gap-3">' + ui.avatar(r.name, 34) + '<div><div class="font-semibold flex items-center gap-1.5">' + r.name + (r.verified ? '<i class="fa-solid fa-circle-check text-xs" style="color:#1b7df5" title="Verified"></i>' : '') + '</div><div class="text-muted text-xs font-mono">' + r.id + '</div></div></div>'; } },
        { label: 'Specialty', key: 'specialty' },
        { label: 'City', key: 'city' },
        { label: 'Status', render: function (r) { return ui.status(r.status); } },
        { label: 'Rating', render: function (r) { return '<span class="badge badge-amber"><i class="fa-solid fa-star"></i>' + r.rating + '</span>'; } },
        { label: 'Utilisation', render: function (r) { return '<div class="flex items-center gap-2"><div class="progress w-14"><span style="width:' + r.utilisation + '%"></span></div><span class="text-[12px]">' + r.utilisation + '%</span></div>'; } },
        { label: 'Revenue', render: function (r) { return '<span class="metric-value text-[13px]">' + D.inr(r.revenue) + '</span>'; } },
        { label: 'Tier', render: function (r) { return ui.status(r.tier); } },
      ];
      return ui.pageHeader({ eyebrow: 'Clinical · Doctor Management', title: 'Doctor Directory', subtitle: D.doctors.length + '+ verified physicians · credentialing, scheduling, performance and commission.', actions: [{ label: 'Onboard Doctor', icon: 'fa-user-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-user-doctor', value: '3,420', label: 'Verified Doctors', trend: 7, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-circle-dot', value: '312', label: 'Online Now', sub: '64 on-call', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-gauge', value: '74%', label: 'Avg Utilisation', trend: 3, c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-star', value: '4.6/5', label: 'Avg Rating', sub: 'NPS 57', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        ui.table('tbl-doctors', cols, D.doctors, { title: 'All Doctors' });
    },
    init: function () { ui.initDataTable('tbl-doctors'); },
  };

  P['doctor-credentialing'] = {
    render: function () {
      var queue = D.doctors.slice(0, 8);
      return ui.pageHeader({ eyebrow: 'Clinical · Compliance', title: 'Credentialing & KYC', subtitle: 'Medical council verification, KYC, contracts and document audit workflow.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-id-badge', value: '3,420', label: 'Fully Credentialed', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-hourglass-half', value: '47', label: 'In Verification', sub: 'avg 2.1 days', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-file-signature', value: '12', label: 'Contracts Pending', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-triangle-exclamation', value: '3', label: 'Expiring Licences', sub: '<30 days', c1: '#ef4444', c2: '#b91c1c' }) +
        '</div>' +
        '<div class="card p-5">' + ui.sectionTitle('Verification Queue', 'Medical Council of India lookup · KYC · documents') +
          queue.map(function (d) {
            var steps = ['MCI Lookup', 'KYC', 'Documents', 'Contract'];
            var done = D.rnd(1, 4);
            return '<div class="flex items-center justify-between py-3.5 gap-4" style="border-bottom:1px solid rgb(var(--c-border)/.5)">' +
              '<div class="flex items-center gap-3 min-w-0">' + ui.avatar(d.name, 36) + '<div class="min-w-0"><div class="font-semibold clamp-1">' + d.name + '</div><div class="text-muted text-xs">' + d.specialty + ' · ' + d.city + '</div></div></div>' +
              '<div class="flex items-center gap-1.5 flex-none">' + steps.map(function (s, i) { return '<span class="badge ' + (i < done ? 'badge-green' : 'badge-slate') + '">' + (i < done ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-regular fa-circle"></i>') + ' ' + s + '</span>'; }).join('') + '</div>' +
              '<button class="btn btn-sm btn-soft flex-none" data-action="noop">Review</button></div>';
          }).join('') +
        '</div>';
    },
    init: function () {},
  };

  P['consult-queue'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Clinical · Live', title: 'Consultation Queue', subtitle: 'Video, audio and chat consultations · <3 min target first response · 24/7.', actions: [{ label: 'Live', icon: 'fa-circle-dot', variant: 'btn-soft' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-video', value: '38', label: 'Video Active', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-phone', value: '64', label: 'Audio Active', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-comments', value: '40', label: 'Chat Active', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-stopwatch', value: '2.4 min', label: 'Avg First Response', sub: 'target <3 min', c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="card p-5">' + ui.sectionTitle('Active & Waiting Consultations', '', '<span class="live-dot"></span>') +
          '<div class="grid-2">' +
            D.patients.slice(0, 8).map(function (p, i) {
              var mode = D.pick(['Video', 'Audio', 'Chat']);
              var modeIco = mode === 'Video' ? 'fa-video' : mode === 'Audio' ? 'fa-phone' : 'fa-comments';
              var waiting = i % 3 === 0;
              return '<div class="flex items-center gap-3 p-3.5 rounded-xl card-2 hairline border">' + ui.avatar(p.name, 38) +
                '<div class="min-w-0 flex-1"><div class="font-semibold clamp-1">' + p.name + '</div><div class="text-muted text-xs">' + p.condition + ' · with Dr. ' + D.name().split(' ')[1] + '</div></div>' +
                '<div class="flex items-center gap-2 flex-none">' + ui.badge('<i class="fa-solid ' + modeIco + '"></i> ' + mode, 'blue') + ui.status(waiting ? 'New' : 'On Call') + '</div></div>';
            }).join('') +
          '</div></div>';
    },
    init: function () {},
  };

  P['doctor-performance'] = {
    render: function () {
      var top = D.doctors.slice().sort(function (a, b) { return b.revenue - a.revenue; }).slice(0, 6);
      return ui.pageHeader({ eyebrow: 'Clinical · Analytics', title: 'Doctor Performance & KPI', subtitle: 'Utilisation, quality score, NPS, ratings and revenue contribution.' }) +
        '<div class="grid-2 mb-4">' +
          '<div class="card p-5">' + ui.sectionTitle('Quality vs Utilisation', 'Top performers') + '<div style="height:280px"><canvas id="dp-scatter"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Top Earning Doctors', 'This month') +
            top.map(function (d) { return ui.tile({ icon: 'fa-user-doctor', color: D.color(d.name), title: d.name, text: d.specialty + ' · ' + d.consults + ' consults', right: '<div class="metric-value text-sm">' + D.inr(d.revenue) + '</div>' }); }).join('<div class="h-2"></div>') +
          '</div>' +
        '</div>' +
        ui.table('tbl-dperf', [
          { label: 'Doctor', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Specialty', key: 'specialty' },
          { label: 'Consults', render: function (r) { return D.num(r.consults); } },
          { label: 'Quality', render: function (r) { return '<span class="metric-value text-[13px]">' + r.qualityScore + '</span>'; } },
          { label: 'NPS', render: function (r) { return r.nps; } },
          { label: 'Utilisation', render: function (r) { return r.utilisation + '%'; } },
          { label: 'Revenue', render: function (r) { return '<span class="metric-value text-[13px]">' + D.inr(r.revenue) + '</span>'; } },
        ], D.doctors, { title: 'Performance Leaderboard' });
    },
    init: function () {
      var el = document.getElementById('dp-scatter'); if (!el) return;
      var t = ui.theme();
      App._charts.push(new Chart(el, {
        type: 'scatter',
        data: { datasets: [{ label: 'Doctors', data: D.doctors.map(function (d) { return { x: d.utilisation, y: d.qualityScore }; }), backgroundColor: '#1b7df5aa', pointRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Utilisation %', color: t.muted }, grid: { color: t.grid }, ticks: { color: t.muted } }, y: { title: { display: true, text: 'Quality Score', color: t.muted }, grid: { color: t.grid }, ticks: { color: t.muted } } } },
      }));
      ui.initDataTable('tbl-dperf');
    },
  };

  P['commission'] = {
    render: function () {
      var rows = [
        ['Quick Video Consult', '60–70%', '30–40%', 'Sliding scale by seniority'],
        ['Audio Consult', '65%', '35%', 'Standard rate'],
        ['Chat / Text Consult', '50%', '50%', 'High volume'],
        ['Home Visit', '55%', '45%', '+ travel allowance'],
        ['Emergency On-Call', '70%', '30%', 'Premium availability'],
        ['RPM Care Plan Review', '60%', '40%', 'Monthly contract'],
        ['ICU @ Home · Intensivist', '65%', '35%', 'High-skill premium'],
        ['Corporate B2B', '55%', '45%', 'Volume-based'],
        ['Diagnostic Referral', '10–15%', '85–90%', 'Affiliate model'],
      ];
      return ui.pageHeader({ eyebrow: 'Finance · Doctor Earnings', title: 'Commission & Referral', subtitle: 'Dynamic commission by service type, referral attribution and fraud detection.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-hand-holding-dollar', value: '₹4.2 Cr', label: 'Commission Paid (MTD)', trend: 11, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-share-nodes', value: '1,840', label: 'Referrals Converted', trend: 8, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-crown', value: '186', label: 'Gold Doctors', sub: '>25 referrals/mo', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-shield-halved', value: '0.2%', label: 'Fraud Flag Rate', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        ui.table('tbl-comm', [
          { label: 'Service Type', render: function (r) { return '<span class="font-semibold">' + r[0] + '</span>'; } },
          { label: 'Doctor %', render: function (r) { return ui.badge(r[1], 'green'); } },
          { label: 'Platform %', render: function (r) { return ui.badge(r[2], 'slate'); } },
          { label: 'Notes', render: function (r) { return '<span class="text-muted">' + r[3] + '</span>'; } },
        ], rows, { title: 'Commission Structure by Service' });
    },
    init: function () { ui.initDataTable('tbl-comm', { paging: false, searching: false, info: false }); },
  };

})(window.MyDR24);
