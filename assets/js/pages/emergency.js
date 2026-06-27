/* ==========================================================================
   MyDR24 HOS — Emergency & Dispatch
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data, P = App.pages;

  P['emergency-center'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Emergency · Command', title: 'Emergency Command Center', subtitle: 'Live feed of all active emergencies with AI triage, dispatch and escalation controls · 99.99% uptime.', actions: [{ label: 'Mass Casualty Mode', icon: 'fa-tower-broadcast', variant: 'btn-ghost', action: 'mass-casualty' }, { label: 'New Emergency', icon: 'fa-plus', variant: 'btn-primary', action: 'new-emergency' }] }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-truck-medical', value: '3.1 min', label: 'Dispatch Response', sub: 'target <5 min', trend: 12, c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-route', value: '8.2 min', label: 'Avg Ambulance ETA', sub: 'metro', trend: 4, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-hospital', value: '847', label: 'Partner Hospital Beds', sub: 'live network', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-gauge-high', value: '91.4%', label: 'SLA Compliance', trend: 2, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-3 mb-4">' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Active Emergencies', 'Colour-coded by priority', '<span class="live-dot"></span>') +
            '<div class="space-y-2.5" id="emg-list">' + emgRows() + '</div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Dispatch Workflow', 'T+0 to resolution') + workflow() + '</div>' +
        '</div>' +
        '<div class="grid-3">' +
          '<div class="card p-5">' + ui.sectionTitle('Emergency Types', 'MTD distribution') + '<div style="height:220px"><canvas id="emg-types"></canvas></div></div>' +
          '<div class="card p-5 col-span-2">' + ui.sectionTitle('Response Time Trend', 'Dispatch & ETA · minutes') + '<div style="height:220px"><canvas id="emg-trend"></canvas></div></div>' +
        '</div>';
    },
    init: function () {
      ui.donut('emg-types', [
        { label: 'Cardiac', value: 28, color: '#ef4444' }, { label: 'Trauma', value: 22, color: '#f59e0b' },
        { label: 'Respiratory', value: 18, color: '#1b7df5' }, { label: 'Obstetric', value: 14, color: '#8b5cf6' },
        { label: 'Paediatric', value: 10, color: '#16ad8f' }, { label: 'Stroke', value: 8, color: '#0ea5e9' },
      ], { legend: 'bottom' });
      ui.lineChart('emg-trend', D.months, [
        { label: 'Dispatch (min)', data: D.months.map(function () { return +(2.5 + Math.random() * 1.5).toFixed(1); }), color: '#16ad8f', fill: true },
        { label: 'ETA (min)', data: D.months.map(function () { return +(7 + Math.random() * 3).toFixed(1); }), color: '#fb7185' },
      ], { zero: false });
    },
  };

  function emgRows() {
    var pc = { P1: '#ef4444', P2: '#f59e0b', P3: '#1b7df5' };
    return D.emergencies.slice(0, 6).map(function (e) {
      return '<div class="flex items-center gap-3 p-3.5 rounded-xl card-2 hairline border" style="border-left:3px solid ' + pc[e.priority] + '">' +
        '<div class="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-none" style="background:' + pc[e.priority] + '"><i class="fa-solid fa-truck-medical"></i></div>' +
        '<div class="min-w-0 flex-1"><div class="font-semibold text-[13.5px] flex items-center gap-2">' + e.type + ' · ' + e.zone + ' ' + ui.badge(e.priority, e.priority === 'P1' ? 'red' : e.priority === 'P2' ? 'amber' : 'blue') + '</div>' +
        '<div class="text-muted text-xs font-mono mt-0.5">' + e.id + ' · ' + e.ambulance + ' · triage ' + e.triageSec + 's</div></div>' +
        '<div class="text-right flex-none"><div class="metric-value text-[13px]">' + e.eta + '</div>' + ui.status(e.status) + '</div></div>';
    }).join('');
  }
  function workflow() {
    var steps = [
      ['T+0s', 'Request received · AI triage <10s', 'fa-bolt', '#ef4444'],
      ['T+60s', 'Nearest ambulance dispatched', 'fa-truck-medical', '#f59e0b'],
      ['T+2m', 'ER pre-alerted with vitals & ETA', 'fa-hospital', '#1b7df5'],
      ['T+5m', 'Coordinator assigned · family notified', 'fa-headset', '#8b5cf6'],
      ['Arrival', 'FHIR R4 digital handover to ER', 'fa-right-left', '#16ad8f'],
      ['T+24h', 'Outcome logged · SLA validated', 'fa-clipboard-check', '#0ea5e9'],
    ];
    return '<div class="space-y-0">' + steps.map(function (s, i) {
      return '<div class="feed-item pb-4 last:pb-0">' + (i < steps.length - 1 ? '<span class="feed-line"></span>' : '') +
        '<div class="flex items-center gap-3"><div class="min-w-0"><div class="text-[13px] font-semibold flex items-center gap-2"><i class="fa-solid ' + s[2] + ' text-xs" style="color:' + s[3] + '"></i>' + s[1] + '</div><div class="text-muted text-[11px] font-mono mt-0.5">' + s[0] + '</div></div></div></div>';
    }).join('') + '</div>';
  }

  App.actions = App.actions || {};
  App.actions['mass-casualty'] = function () { ui.toast({ title: 'Mass Casualty Mode armed', text: 'All responders & hospitals plotted on unified incident map. Coordination overlay active.', type: 'warn' }); };
  App.actions['new-emergency'] = function () {
    ui.modal({ title: 'Log Emergency', subtitle: 'AI triage will score severity P1–P5', icon: 'fa-truck-medical',
      body: '<div class="grid-2" style="gap:14px"><div><label class="field-label">Patient / Caller</label><input class="input" placeholder="Name or phone" /></div>' +
        '<div><label class="field-label">Emergency Type</label><select class="select"><option>Cardiac</option><option>Trauma</option><option>Respiratory</option><option>Obstetric</option><option>Stroke</option></select></div>' +
        '<div class="col-span-2"><label class="field-label">Location / PIN</label><input class="input" placeholder="Address or PIN code" /></div>' +
        '<div class="col-span-2"><label class="field-label">Chief Complaint</label><textarea class="input" rows="2" placeholder="Symptoms…"></textarea></div></div>',
      buttons: [{ label: 'Cancel', variant: 'btn-ghost', close: true }, { label: 'Triage & Dispatch', variant: 'btn-primary', icon: 'fa-bolt', onClick: function () { ui.toast({ title: 'P1 · Dispatched', text: 'AI triage P1 in 7s · nearest ALS ambulance en route · ER pre-alerted.', type: 'error' }); } }] });
  };

  /* ---- Live Ambulance Map ---- */
  P['ambulance-map'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Emergency · Real-Time', title: 'Live Ambulance Map', subtitle: 'All active ambulances plotted with status and priority · GPS updated every 5 seconds.', actions: [{ label: 'Live', icon: 'fa-circle-dot', variant: 'btn-soft' }] }) +
        '<div class="grid-3">' +
          '<div class="card p-0 overflow-hidden col-span-2"><div id="amb-map" style="height:520px"></div></div>' +
          '<div class="space-y-4">' +
            '<div class="grid-2" style="gap:12px">' +
              miniStat('#ef4444', D.liveOps.emgBreak.crit, 'Critical') + miniStat('#f59e0b', D.liveOps.emgBreak.high, 'High') +
              miniStat('#1b7df5', D.liveOps.ambulancesReady, 'Ready') + miniStat('#8b5cf6', D.liveOps.ambulancesDeployed, 'Deployed') +
            '</div>' +
            '<div class="card p-5">' + ui.sectionTitle('Active Dispatches', '', '<span class="live-dot"></span>') +
              '<div class="space-y-2">' + D.emergencies.slice(0, 6).map(function (e) { return ui.tile({ icon: 'fa-truck-medical', color: e.priority === 'P1' ? '#ef4444' : '#f59e0b', title: e.ambulance + ' · ' + e.type, text: e.zone + ' · ETA ' + e.eta, right: ui.status(e.status) }); }).join('<div class="h-2"></div>') + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    },
    init: function () {
      var map = ui.map('amb-map', { center: [28.6139, 77.2090], zoom: 10 });
      if (!map) return;
      D.emergencies.forEach(function (e) {
        var color = e.priority === 'P1' ? '#ef4444' : e.priority === 'P2' ? '#f59e0b' : '#1b7df5';
        L.marker([e.lat, e.lng], { icon: ui.mapPin(color, 'fa-truck-medical') }).addTo(map)
          .bindPopup('<b>' + e.ambulance + '</b><br>' + e.type + ' · ' + e.priority + '<br>' + e.status + ' · ETA ' + e.eta);
      });
      // hospital markers
      D.zonesGeo.slice(0, 5).forEach(function (z) {
        L.marker([z.lat + 0.02, z.lng + 0.02], { icon: ui.mapPin('#16ad8f', 'fa-hospital') }).addTo(map).bindPopup('<b>Partner Hospital</b><br>' + z.name);
      });
    },
  };
  function miniStat(color, val, label) { return '<div class="card p-4 text-center"><div class="metric-value text-2xl" style="color:' + color + '">' + val + '</div><div class="text-muted text-[11.5px] mt-1">' + label + '</div></div>'; }

  /* ---- AI Triage ---- */
  P['ai-triage'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Emergency · AI', title: 'AI Triage Engine', subtitle: 'ESI-aligned NLP scoring from symptoms + RPM vitals + history · severity P1–P5 in under 10 seconds.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-stopwatch', value: '7.2s', label: 'Avg Triage Time', sub: 'target <10s', c1: '#16ad8f', c2: '#0a8b75' }) +
          ui.statCard({ icon: 'fa-bullseye', value: '89%', label: 'Triage Accuracy', sub: 'vs ED nurse', trend: 2, c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-arrows-rotate', value: '6.4%', label: 'Reclassification Rate', sub: 'target <8%', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-list-ol', value: '4,120', label: 'Triaged (MTD)', trend: 9, c1: '#f59e0b', c2: '#d97706' }) +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card p-5">' + ui.sectionTitle('Severity Distribution', 'P1–P5 breakdown') + '<div style="height:260px"><canvas id="triage-sev"></canvas></div></div>' +
          '<div class="card p-5">' + ui.sectionTitle('Triage Simulator', 'Enter symptoms for instant scoring') +
            '<textarea id="triage-input" class="input mb-3" rows="3" placeholder="e.g. 58yo male, crushing chest pain radiating to left arm, sweating, SpO2 91%"></textarea>' +
            '<button class="btn btn-primary w-full" data-action="run-triage"><i class="fa-solid fa-bolt"></i> Run AI Triage</button>' +
            '<div id="triage-result" class="mt-4"></div>' +
          '</div>' +
        '</div>';
    },
    init: function () {
      ui.barChart('triage-sev', ['P1 Critical', 'P2 Emergent', 'P3 Urgent', 'P4 Less Urgent', 'P5 Non-Urgent'], [{ label: 'Cases', data: [320, 680, 1240, 980, 900], color: '#1b7df5' }], { legend: false });
    },
  };
  App.actions['run-triage'] = function () {
    var el = document.getElementById('triage-result'); if (!el) return;
    el.innerHTML = '<div class="p-4 rounded-xl" style="background:rgb(239 68 68 / .1);border:1px solid rgb(239 68 68 / .3)"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl" style="background:#ef4444">P1</div><div><div class="font-semibold">Critical · Immediate dispatch</div><div class="text-muted text-xs">Suspected acute coronary syndrome · 96% confidence · scored in 7.1s</div></div></div><div class="mt-3 text-[13px] text-muted">Recommended: ALS ambulance + cardiac-capable hospital + ER pre-alert.</div></div>';
    ui.toast({ title: 'Triage complete', text: 'P1 Critical · 7.1s · recommend immediate dispatch.', type: 'error' });
  };

  /* ---- Hospital Beds ---- */
  P['hospital-beds'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Emergency · Network', title: 'Hospital Bed Network', subtitle: 'Live general, ICU, NICU and ventilator availability across the partner hospital network.' }) +
        '<div class="grid-4 stagger mb-4">' +
          ui.statCard({ icon: 'fa-bed', value: '847', label: 'General Beds', c1: '#1b7df5', c2: '#1465e1' }) +
          ui.statCard({ icon: 'fa-bed-pulse', value: '92', label: 'ICU Available', c1: '#ef4444', c2: '#b91c1c' }) +
          ui.statCard({ icon: 'fa-baby', value: '34', label: 'NICU Available', c1: '#8b5cf6', c2: '#6d28d9' }) +
          ui.statCard({ icon: 'fa-lungs', value: '58', label: 'Ventilators Free', c1: '#16ad8f', c2: '#0a8b75' }) +
        '</div>' +
        ui.table('tbl-beds', [
          { label: 'Hospital', render: function (r) { return '<div class="flex items-center gap-2"><i class="fa-solid fa-hospital" style="color:#16ad8f"></i><span class="font-semibold">' + r.name + '</span></div>'; } },
          { label: 'General', key: 'general' }, { label: 'ICU', key: 'icu' }, { label: 'NICU', key: 'nicu' }, { label: 'Ventilators', key: 'ventilators' },
          { label: 'Occupancy', render: function (r) { var c = r.occupancy > 90 ? '#ef4444' : r.occupancy > 75 ? '#f59e0b' : '#16ad8f'; return '<div class="flex items-center gap-2"><div class="progress w-16"><span style="width:' + r.occupancy + '%;background:' + c + '"></span></div><span class="text-[12px]">' + r.occupancy + '%</span></div>'; } },
          { label: 'Status', render: function (r) { return ui.status(r.occupancy > 90 ? 'High' : 'Available'); } },
        ], D.hospitals, { title: 'Partner Hospital Capacity' });
    },
    init: function () { ui.initDataTable('tbl-beds', { paging: false, info: false }); },
  };

  /* ---- Demand Heatmap ---- */
  P['demand-heatmap'] = {
    render: function () {
      return ui.pageHeader({ eyebrow: 'Operations · Geo-Intelligence', title: 'Live Demand Heatmap', subtitle: 'PIN-code level demand visualisation with resource overlays and AI pre-positioning alerts.', actions: [{ label: 'Service Layer', icon: 'fa-layer-group', variant: 'btn-ghost', action: 'noop' }] }) +
        '<div class="grid-3">' +
          '<div class="card p-0 overflow-hidden col-span-2"><div id="heat-map" style="height:520px"></div></div>' +
          '<div class="space-y-4">' +
            '<div class="card p-5">' + ui.sectionTitle('Demand Intensity', '5-tier scale') +
              ['Critical', 'Surge', 'High', 'Moderate', 'Low'].map(function (l, i) { var c = ['#ef4444', '#fb7185', '#f59e0b', '#0ea5e9', '#16ad8f'][i]; return '<div class="flex items-center gap-2.5 py-1.5"><span class="w-4 h-4 rounded" style="background:' + c + '"></span><span class="text-[13px]">' + l + '</span></div>'; }).join('') +
            '</div>' +
            '<div class="card p-5">' + ui.sectionTitle('Pre-Positioning Alerts', '', '<span class="live-dot"></span>') +
              ui.tile({ icon: 'fa-fire', color: '#ef4444', title: 'Delhi NCR · Surge', text: '88% utilisation · pre-deploy 6 units' }) + '<div class="h-2"></div>' +
              ui.tile({ icon: 'fa-cloud-bolt', color: '#f59e0b', title: 'Weather risk · Mumbai', text: 'Heavy rain · reroute advisory' }) +
            '</div>' +
          '</div>' +
        '</div>';
    },
    init: function () {
      var map = ui.map('heat-map', { center: [22.9734, 78.6569], zoom: 5 });
      if (!map) return;
      D.zonesGeo.forEach(function (z) {
        var color = z.util > 85 ? '#ef4444' : z.util > 70 ? '#f59e0b' : z.util > 55 ? '#0ea5e9' : '#16ad8f';
        L.circleMarker([z.lat, z.lng], { radius: 10 + z.util / 4, color: color, fillColor: color, fillOpacity: 0.45, weight: 1.5 }).addTo(map)
          .bindPopup('<b>' + z.name + '</b><br>Demand: ' + z.demand + '<br>Utilisation: ' + z.util + '%');
      });
    },
  };

})(window.MyDR24);
