/* ==========================================================================
   MyDR24 HOS — Caregiver Workforce
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;

  P['caregivers'] = {
    render: function () {
      var cols = [
        { label: 'Caregiver', render: function (r) { return '<div class="flex items-center gap-3">' + ui.avatar(r.name, 34) + '<div><div class="font-semibold">' + r.name + '</div><div class="text-muted text-xs font-mono">' + r.id + '</div></div></div>'; } },
        { label: 'Skill', key: 'skill' },
        { label: 'City', key: 'city' },
        { label: 'Status', render: function (r) { return ui.status(r.status); } },
        { label: 'Rating', render: function (r) { return '<span class="badge badge-amber"><i class="fa-solid fa-star"></i>' + r.rating + '</span>'; } },
        { label: 'On-Time', render: function (r) { return r.onTime + '%'; } },
        { label: 'Visits/mo', render: function (r) { return r.visitsMonth; } },
        { label: 'Burnout', render: function (r) { var c = r.burnout > 60 ? '#ef4444' : r.burnout > 35 ? '#f59e0b' : '#16ad8f'; return '<div class="flex items-center gap-2"><div class="progress w-12"><span style="width:' + r.burnout + '%;background:' + c + '"></span></div></div>'; } },
      ];
      return ui.pageHeader({ eyebrow: 'Workforce · Caregivers', title: 'Caregiver Directory', subtitle: 'Recruitment, verification, scheduling, performance and AI burnout prediction.', actions: [{ label: 'Recruit', icon: 'fa-user-plus', variant: 'btn-primary', action: 'noop' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-user-nurse', value: '2,180', label: 'Active Caregivers', trend: 6, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-clock', value: '92%', label: 'On-Time Arrival', trend: 2, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-heart-crack', value: '14', label: 'Burnout Risk', sub: 'AI-flagged', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-arrows-rotate', value: '75%', label: '6-Month Retention', trend: 3, c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        ui.table('tbl-cg', cols, D.caregivers, { title: 'All Caregivers' });
    },
    init: function () { ui.initDataTable('tbl-cg'); },
  };

  /* ---- Live Geo-Tracking ---- */
  P['caregiver-live'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Workforce · Real-Time', title: 'Caregiver Live Geo-Tracking', subtitle: 'GPS plot of active caregivers · geofence visit verification · route deviation alerts.', actions: [{ label: 'Live', icon: 'fa-circle-dot', variant: 'btn-soft' }] }) +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-0 overflow-hidden col-span-2"><div id="cg-map" style="height:480px"></div></div>' +
          '<div class="space-y-4">' +
            '<div class="card p-5">' + ui.sectionTitle('Status Legend', '') +
              legend('#16ad8f', 'Available', D.caregivers.filter(function (c) { return c.status === 'Available'; }).length) +
              legend('#f59e0b', 'En Route', D.caregivers.filter(function (c) { return c.status === 'En Route'; }).length) +
              legend('#1b7df5', 'On Visit', D.caregivers.filter(function (c) { return c.status === 'On Visit'; }).length) +
            '</div>' +
            '<div class="card p-5">' + ui.sectionTitle('Field Alerts', '', '<span class="live-dot"></span>') +
              ui.tile({ icon: 'fa-route', color: '#f59e0b', title: 'Route deviation', text: D.caregivers[2].name + ' · >500m off-route' }) + '<div class="h-2"></div>' +
              ui.tile({ icon: 'fa-battery-quarter', color: '#ef4444', title: 'Low battery', text: D.caregivers[5].name + ' · 12% · mid-shift' }) + '<div class="h-2"></div>' +
              ui.tile({ icon: 'fa-location-check', color: '#16ad8f', title: 'Geofence check-in', text: D.caregivers[1].name + ' · arrived (<50m)' }) +
            '</div>' +
          '</div>' +
        '</div>' +
        ui.table('tbl-cglive', [
          { label: 'Caregiver', render: function (r) { return '<div class="flex items-center gap-2">' + ui.avatar(r.name, 30) + '<span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'Skill', key: 'skill' },
          { label: 'Status', render: function (r) { return ui.status(r.status); } },
          { label: 'Battery', render: function (r) { var c = r.battery < 20 ? '#ef4444' : '#16ad8f'; return '<span style="color:' + c + '"><i class="fa-solid fa-battery-half"></i> ' + r.battery + '%</span>'; } },
          { label: 'Visits Today', key: 'visitsToday' },
        ], D.caregivers.filter(function (c) { return c.status !== 'Off Shift'; }).slice(0, 10), { title: 'Active Field Workforce' });
    },
    init: function () {
      var map = ui.map('cg-map', { center: [28.6139, 77.2090], zoom: 11 });
      if (!map) return;
      var colors = { 'Available': '#16ad8f', 'En Route': '#f59e0b', 'On Visit': '#1b7df5' };
      D.caregivers.forEach(function (c) {
        if (c.status === 'Off Shift') return;
        L.marker([c.lat, c.lng], { icon: ui.mapPin(colors[c.status] || '#1b7df5', 'fa-user-nurse') }).addTo(map)
          .bindPopup('<b>' + c.name + '</b><br>' + c.skill + '<br>Status: ' + c.status);
      });
      ui.initDataTable('tbl-cglive', { pageLength: 6 });
    },
  };
  function legend(color, label, count) {
    return '<div class="flex items-center justify-between py-2"><div class="flex items-center gap-2.5"><span class="w-3 h-3 rounded-full" style="background:' + color + '"></span><span class="text-[13.5px]">' + label + '</span></div><span class="metric-value text-[15px]">' + count + '</span></div>';
  }

  /* ---- Requirement Center ---- */
  P['caregiver-requirement'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Workforce · Demand', title: 'Caregiver Requirement Center', subtitle: 'Live supply–demand gap by zone with skill matching, on-call activation and predictive staffing.', actions: [{ label: 'Activate Standby Pool', icon: 'fa-bolt', variant: 'btn-primary', action: 'activate-pool' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-people-arrows', value: '248', label: 'Available Now', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-triangle-exclamation', value: '4', label: 'Zones Understaffed', sub: '<80% coverage', c1: '#f59e0b', c2: '#d97706' }) +
          ui.statCard({ icon: 'fa-bell-concierge', value: '71', label: 'On Standby', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-gift', value: '₹24K', label: 'Surge Incentives', sub: 'today', c1: '#8b5cf6', c2: '#6d28d9' }) +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Supply vs Demand by Zone', 'Coverage shortfall flagged red') +
            D.zonesGeo.map(function (z) {
              var demand = z.util, supply = Math.max(50, 100 - z.util + D.rnd(-8, 12));
              var gap = supply < 80;
              return '<div class="py-3" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><div class="flex justify-between text-[13.5px] mb-2"><span class="font-medium">' + z.name + '</span>' + (gap ? ui.badge('Shortfall', 'red') : ui.badge('Healthy', 'green')) + '</div>' +
                '<div class="flex items-center gap-2 text-xs"><span class="text-muted w-14">Coverage</span>' + ui.progress(supply, gap ? '#ef4444' : '#16ad8f') + '<span class="metric-value w-9 text-right">' + supply + '%</span></div></div>';
            }).join('') +
          '</div>' +
          '<div class="card p-5">' + ui.sectionTitle('Requirement by Skill', 'Demand breakdown') + '<div style="height:240px"><canvas id="req-skill"></canvas></div>' +
            '<div class="divider my-3"></div><div class="text-muted text-xs">48-hour predictive staffing model suggests <b class="text-app">+32 caregivers</b> in Mumbai & Delhi NCR for tomorrow.</div>' +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('req-skill', ['Gen Nursing', 'ICU', 'Elderly', 'Paediatric', 'Physio', 'Post-Surg'], [
        { label: 'Demand', data: [42, 18, 36, 14, 22, 28], color: '#fb7185' },
        { label: 'Available', data: [38, 12, 40, 16, 24, 20], color: '#16ad8f' },
      ], {});
    },
  };
  App.actions = App.actions || {};
  App.actions['activate-pool'] = function () { ui.toast({ title: 'Standby pool activated', text: '14 caregivers notified · surge incentive offered for Mumbai zone.', type: 'success' }); };

  /* ---- Shift Planning ---- */
  P['shift-planning'] = {
    render: function () {
      var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      var shifts = ['Morning', 'Afternoon', 'Night'];
      return ui.pageHeader({ eyebrow: 'Workforce · Scheduling', title: 'Shift & Scheduling', subtitle: 'Weekly shift builder with patient–caregiver matching by skill, language and proximity.', actions: [{ label: 'Auto-Schedule', icon: 'fa-wand-magic-sparkles', variant: 'btn-primary', action: 'auto-schedule' }] }) +
        '<div class="card p-5 overflow-x-auto"><table class="w-full" style="min-width:720px"><thead><tr><th class="text-left p-3 text-muted text-xs uppercase tracking-wider">Shift</th>' +
          days.map(function (d) { return '<th class="p-3 text-muted text-xs uppercase tracking-wider">' + d + '</th>'; }).join('') + '</tr></thead><tbody>' +
          shifts.map(function (s) {
            return '<tr><td class="p-3 font-semibold text-[13px]">' + s + '</td>' + days.map(function () {
              var n = D.rnd(8, 28); var full = n > 20;
              return '<td class="p-2"><div class="rounded-lg p-2.5 text-center" style="background:' + (full ? 'rgb(16 173 143 / .12)' : 'rgb(245 158 11 / .12)') + '"><div class="metric-value text-base">' + n + '</div><div class="text-[10px] text-muted">caregivers</div></div></td>';
            }).join('') + '</tr>';
          }).join('') +
        '</tbody></table></div>';
    },
    init: function () {},
  };
  App.actions['auto-schedule'] = function () { ui.toast({ title: 'AI scheduling complete', text: 'Optimised 1,420 shifts · 28% travel time reduction · skill-matched.', type: 'success' }); };

  /* ---- AI Workforce Planning ---- */
  P['workforce-ai'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Workforce · Intelligence', title: 'AI Workforce Planning', subtitle: 'Demand forecasting, burnout prediction and route optimisation across the field workforce.' }) +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('72-Hour Demand Forecast', 'By zone · predictive model') + '<div style="height:280px"><canvas id="wf-forecast"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Burnout Risk', 'AI-flagged caregivers') +
            D.caregivers.slice().sort(function (a, b) { return b.burnout - a.burnout; }).slice(0, 6).map(function (c) { return '<div class="flex items-center justify-between py-2.5" style="border-bottom:1px solid rgb(var(--c-border)/.5)"><div class="flex items-center gap-2">' + ui.avatar(c.name, 28) + '<span class="text-[13px] font-medium">' + c.name + '</span></div><span class="metric-value text-[13px]" style="color:' + (c.burnout > 60 ? '#ef4444' : '#f59e0b') + '">' + c.burnout + '%</span></div>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div class="grid-3 stagger">' +
          segMetric('fa-route', '#16ad8f', '+28%', 'Route Efficiency Gain', 'vs unoptimised') +
          segMetric('fa-clock', '#1b7df5', '92%', 'On-Time Arrival', 'within 15 min') +
          segMetric('fa-arrows-rotate', '#8b5cf6', '75%', 'Retention (6mo)', 'workforce stability') +
        '</div>';
    },
    init: function () {
      ui.lineChart('wf-forecast', Array.from({ length: 12 }, function (_, i) { return '+' + (i * 6) + 'h'; }), [
        { label: 'Delhi NCR', data: Array.from({ length: 12 }, function () { return D.rnd(40, 90); }), color: '#1b7df5', fill: true },
        { label: 'Mumbai', data: Array.from({ length: 12 }, function () { return D.rnd(35, 85); }), color: '#fb7185' },
      ], {});
    },
  };
  function segMetric(icon, color, val, title, sub) {
    return '<div class="card card-hover p-5"><div class="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style="background:' + color + '"><i class="fa-solid ' + icon + '"></i></div><div class="metric-value text-2xl">' + val + '</div><div class="text-[13px] font-semibold mt-1">' + title + '</div><div class="text-muted text-[11.5px]">' + sub + '</div></div>';
  }

})(window.MyDR24);
