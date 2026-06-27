/* ==========================================================================
   MyDR24 HOS — Reusable Component Library + Chart Helpers
   ========================================================================== */
(function (App) {
  'use strict';
  var D = App.data;
  var ui = App.ui = {};

  /* ---- instance registries for cleanup on route change ---- */
  App._charts = [];
  App._maps = [];
  App._timers = [];
  App._dt = [];
  ui.cleanup = function () {
    App._charts.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    App._maps.forEach(function (m) { try { m.remove(); } catch (e) {} });
    App._timers.forEach(function (t) { clearInterval(t); });
    App._dt.forEach(function (t) { try { t.destroy(); } catch (e) {} });
    App._charts = []; App._maps = []; App._timers = []; App._dt = [];
    if (App.ui._tables) { App.ui._tables = {}; App.ui._lastTable = null; }
  };

  /* ---- color tokens read from CSS ---- */
  function cssVar(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v ? 'rgb(' + v.split(' ').join(',') + ')' : '#888';
  }
  ui.theme = function () {
    var dark = document.documentElement.classList.contains('dark');
    return {
      dark: dark,
      text: cssVar('--c-text'),
      muted: cssVar('--c-muted'),
      border: cssVar('--c-border'),
      surface: cssVar('--c-surface'),
      grid: dark ? 'rgba(148,170,210,0.08)' : 'rgba(15,23,42,0.06)',
    };
  };

  /* ====================== Simple HTML builders ====================== */

  ui.pageHeader = function (o) {
    var actions = (o.actions || []).map(function (a) {
      return '<button class="btn ' + (a.variant || 'btn-ghost') + '" data-action="' + (a.action || '') + '">' +
        (a.icon ? '<i class="fa-solid ' + a.icon + '"></i>' : '') + (a.label || '') + '</button>';
    }).join('');
    return '' +
      '<div class="flex flex-wrap items-end justify-between gap-4 mb-5 anim-fade">' +
        '<div class="min-w-0">' +
          (o.eyebrow ? '<div class="eyebrow mb-1.5">' + o.eyebrow + '</div>' : '') +
          '<h1 class="section-title text-[26px] sm:text-[30px] leading-tight">' + o.title + '</h1>' +
          (o.subtitle ? '<p class="text-muted text-sm mt-1.5 max-w-2xl">' + o.subtitle + '</p>' : '') +
        '</div>' +
        (actions ? '<div class="flex items-center gap-2.5 flex-wrap">' + actions + '</div>' : '') +
      '</div>';
  };

  ui.sectionTitle = function (title, sub, right) {
    return '<div class="flex items-center justify-between mb-3.5">' +
      '<div><h3 class="section-title text-lg">' + title + '</h3>' +
      (sub ? '<p class="text-muted text-xs mt-0.5">' + sub + '</p>' : '') + '</div>' +
      (right || '') + '</div>';
  };

  ui.badge = function (text, variant) { return '<span class="badge badge-' + (variant || 'slate') + '">' + text + '</span>'; };

  var statusMap = {
    'Online': 'green', 'Available': 'green', 'Compliant': 'green', 'Won': 'green', 'Healthy': 'green', 'Active': 'green',
    'On Call': 'blue', 'En Route': 'blue', 'Contacted': 'blue', 'Dispatched': 'blue', 'Monitoring': 'blue',
    'On Visit': 'violet', 'On Scene': 'violet', 'Qualified': 'violet', 'Proposal': 'violet',
    'Offline': 'slate', 'Off Shift': 'slate', 'Dormant': 'slate', 'New': 'slate', 'Returning': 'slate',
    'At-Risk': 'amber', 'Audit Due': 'amber', 'Negotiation': 'amber', 'Medium': 'amber',
    'P1': 'red', 'High': 'red', 'Critical': 'red', 'Lost': 'red',
    'P2': 'amber', 'P3': 'blue', 'Low': 'green', 'Gold': 'amber', 'Platinum': 'violet', 'Silver': 'slate',
  };
  ui.status = function (s) { return ui.badge(s, statusMap[s] || 'slate'); };

  ui.avatar = function (name, size) {
    size = size || 36;
    var fs = Math.round(size * 0.36);
    return '<span class="avatar" style="width:' + size + 'px;height:' + size + 'px;font-size:' + fs + 'px;background:' +
      D.color(name) + '">' + D.initials(name) + '</span>';
  };

  ui.trend = function (val, positiveGood) {
    if (positiveGood === undefined) positiveGood = true;
    var up = val >= 0;
    var good = up === positiveGood;
    var cls = good ? 'badge-green' : 'badge-red';
    var ico = up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
    return '<span class="badge ' + cls + '"><i class="fa-solid ' + ico + '"></i>' + Math.abs(val) + '%</span>';
  };

  /* ---- Stat card with mini sparkline canvas ---- */
  var statSeq = 0;
  ui.statCard = function (o) {
    var id = 'spark-' + (statSeq++);
    var trend = (o.trend !== undefined) ? ui.trend(o.trend, o.positiveGood) : '';
    return '' +
      '<div class="card card-hover p-5">' +
        '<div class="flex items-start justify-between">' +
          '<div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base" style="background:linear-gradient(135deg,' + (o.c1 || '#1b7df5') + ',' + (o.c2 || '#0a8b75') + ')"><i class="fa-solid ' + o.icon + '"></i></div>' +
          trend +
        '</div>' +
        '<div class="mt-4 metric-value text-[27px] leading-none">' + o.value + '</div>' +
        '<div class="text-muted text-[13px] mt-1.5 flex items-center gap-2">' + o.label +
          (o.sub ? '<span class="text-[11px] opacity-70">· ' + o.sub + '</span>' : '') + '</div>' +
        (o.spark ? '<canvas id="' + id + '" height="40" class="mt-3 w-full block"></canvas>' : '') +
      '</div>';
    // spark drawn separately via ui.drawSpark using returned id is complex;
    // instead use ui.statCardWithSpark below when sparks are needed.
  };

  /* ---- KPI ring (SVG) ---- */
  ui.ring = function (pct, label, value, color) {
    color = color || '#1b7df5';
    var r = 34, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
    return '' +
      '<div class="flex items-center gap-3.5">' +
        '<div class="relative" style="width:84px;height:84px">' +
          '<svg width="84" height="84" class="ring">' +
            '<circle class="ring-bg" cx="42" cy="42" r="' + r + '" fill="none" stroke-width="8"></circle>' +
            '<circle cx="42" cy="42" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"></circle>' +
          '</svg>' +
          '<div class="absolute inset-0 flex items-center justify-center font-display font-extrabold text-base">' + pct + '%</div>' +
        '</div>' +
        '<div><div class="metric-value text-xl">' + (value || '') + '</div><div class="text-muted text-xs mt-0.5">' + label + '</div></div>' +
      '</div>';
  };

  ui.progress = function (pct, color) {
    return '<div class="progress"><span style="width:' + pct + '%;' + (color ? 'background:' + color : '') + '"></span></div>';
  };

  /* ====================== Activity feed ====================== */
  ui.feed = function (items) {
    return '<div class="space-y-0">' + items.map(function (f, i) {
      return '<div class="feed-item pb-4 last:pb-0">' +
        (i < items.length - 1 ? '<span class="feed-line"></span>' : '') +
        '<div class="flex items-start justify-between gap-3">' +
          '<div class="min-w-0">' +
            '<div class="text-[13px] font-semibold flex items-center gap-2"><i class="fa-solid ' + f.icon + ' text-xs" style="color:' + f.color + '"></i>' + f.type + '</div>' +
            '<div class="text-muted text-xs mt-0.5 clamp-1">' + f.text + '</div>' +
          '</div>' +
          '<div class="text-muted text-[11px] whitespace-nowrap font-mono">' + f.time + '</div>' +
        '</div></div>';
    }).join('') + '</div>';
  };

  /* ====================== Charts ====================== */
  function register(ch) { App._charts.push(ch); return ch; }

  ui.lineChart = function (canvasId, labels, datasets, opts) {
    opts = opts || {};
    var el = document.getElementById(canvasId); if (!el) return;
    var t = ui.theme();
    var ds = datasets.map(function (d) {
      var ctx = el.getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, 240);
      grad.addColorStop(0, (d.color || '#1b7df5') + '55');
      grad.addColorStop(1, (d.color || '#1b7df5') + '00');
      return {
        label: d.label, data: d.data,
        borderColor: d.color || '#1b7df5',
        backgroundColor: d.fill ? grad : 'transparent',
        fill: !!d.fill, tension: 0.4, borderWidth: 2.5,
        pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: d.color || '#1b7df5',
      };
    });
    return register(new Chart(el, {
      type: 'line', data: { labels: labels, datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: opts.legend !== false, labels: { color: t.muted, usePointStyle: true, boxWidth: 8, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.muted, font: { size: 11 } } },
          y: { grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 }, callback: opts.yfmt || undefined }, beginAtZero: opts.zero !== false },
        },
      },
    }));
  };

  ui.barChart = function (canvasId, labels, datasets, opts) {
    opts = opts || {};
    var el = document.getElementById(canvasId); if (!el) return;
    var t = ui.theme();
    var ds = datasets.map(function (d) {
      return { label: d.label, data: d.data, backgroundColor: d.color || '#1b7df5', borderRadius: 6, maxBarThickness: 30, stack: opts.stacked ? 'a' : undefined };
    });
    return register(new Chart(el, {
      type: 'bar', data: { labels: labels, datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: opts.legend !== false, labels: { color: t.muted, usePointStyle: true, boxWidth: 8, font: { size: 11 } } } },
        scales: {
          x: { stacked: !!opts.stacked, grid: { display: false }, ticks: { color: t.muted, font: { size: 11 } } },
          y: { stacked: !!opts.stacked, grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true },
        },
      },
    }));
  };

  ui.donut = function (canvasId, data, opts) {
    opts = opts || {};
    var el = document.getElementById(canvasId); if (!el) return;
    var t = ui.theme();
    return register(new Chart(el, {
      type: 'doughnut',
      data: { labels: data.map(function (d) { return d.label; }), datasets: [{ data: data.map(function (d) { return d.value; }), backgroundColor: data.map(function (d) { return d.color; }), borderWidth: 0, hoverOffset: 6 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: opts.cutout || '70%',
        plugins: { legend: { position: opts.legend || 'right', labels: { color: t.muted, usePointStyle: true, boxWidth: 8, padding: 14, font: { size: 12 } } } },
      },
    }));
  };

  ui.radial = function (elId, value, label, color) {
    var el = document.getElementById(elId); if (!el || !window.ApexCharts) return;
    var t = ui.theme();
    var chart = new ApexCharts(el, {
      chart: { type: 'radialBar', height: 200, sparkline: { enabled: true } },
      series: [value], colors: [color || '#1b7df5'],
      plotOptions: { radialBar: {
        hollow: { size: '62%' },
        track: { background: t.border },
        dataLabels: {
          name: { offsetY: 22, color: t.muted, fontSize: '12px' },
          value: { offsetY: -14, color: t.text, fontSize: '26px', fontWeight: 800, formatter: function (v) { return v + '%'; } },
        },
      } },
      labels: [label || ''],
      stroke: { lineCap: 'round' },
    });
    chart.render(); App._charts.push(chart); return chart;
  };

  ui.areaSpark = function (elId, series, color) {
    var el = document.getElementById(elId); if (!el || !window.ApexCharts) return;
    var chart = new ApexCharts(el, {
      chart: { type: 'area', height: 60, sparkline: { enabled: true } },
      stroke: { curve: 'smooth', width: 2 }, fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
      series: [{ data: series }], colors: [color || '#1b7df5'], tooltip: { enabled: false },
    });
    chart.render(); App._charts.push(chart); return chart;
  };

  /* ====================== Data Table ====================== */
  // columns: [{key,label,render?,cls?,csv?}], rows: []
  App.ui._tables = {};      // id -> { columns, rows, title }
  App.ui._lastTable = null; // most recently rendered table id (for quick export)
  ui.table = function (id, columns, rows, opts) {
    opts = opts || {};
    // register for CSV export
    App.ui._tables[id] = { columns: columns, rows: rows, title: opts.title || id };
    App.ui._lastTable = id;
    var head = columns.map(function (c) { return '<th class="' + (c.cls || '') + '">' + c.label + '</th>'; }).join('');
    var body = rows.map(function (r) {
      return '<tr>' + columns.map(function (c) {
        var v = c.render ? c.render(r) : r[c.key];
        return '<td class="' + (c.cls || '') + '">' + (v == null ? '' : v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="card overflow-hidden">' +
      (opts.title ? '<div class="px-5 pt-5">' + ui.sectionTitle(opts.title, opts.subtitle) + '</div>' : '') +
      '<div class="overflow-x-auto px-2 pb-2"><table id="' + id + '" class="dt-table display"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div></div>';
  };

  // Strip HTML tags to plain text (for CSV cells derived from render())
  function stripHtml(html) {
    if (html == null) return '';
    return String(html).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }
  // Build a CSV string from a registered table and trigger a download
  ui.exportCSV = function (tableId) {
    var t = App.ui._tables[tableId || App.ui._lastTable];
    if (!t) { ui.toast({ title: 'Nothing to export', text: 'No data table is available on this view.', type: 'warn' }); return; }
    function cell(c, r) {
      var raw = c.csv ? c.csv(r) : (c.key != null ? r[c.key] : stripHtml(c.render ? c.render(r) : ''));
      raw = (raw == null ? '' : String(raw));
      return '"' + raw.replace(/"/g, '""') + '"';
    }
    var header = t.columns.map(function (c) { return '"' + (c.label || '').replace(/"/g, '""') + '"'; }).join(',');
    var lines = t.rows.map(function (r) { return t.columns.map(function (c) { return cell(c, r); }).join(','); });
    var csv = [header].concat(lines).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var name = (t.title || 'export').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-' + new Date().toISOString().slice(0, 10) + '.csv';
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    ui.toast({ title: 'Export ready', text: name + ' · ' + t.rows.length + ' rows downloaded.', type: 'success' });
  };

  ui.initDataTable = function (id, opts) {
    if (!window.jQuery || !jQuery.fn.dataTable) return;
    var t = jQuery('#' + id).DataTable(Object.assign({
      pageLength: 8, lengthMenu: [8, 15, 25, 50],
      order: [], dom: '<"flex flex-wrap items-center justify-between gap-3 px-3 pb-3"lf>rt<"flex flex-wrap items-center justify-between gap-3 px-3 pt-3"ip>',
      language: { search: '', searchPlaceholder: 'Search…' },
    }, opts || {}));
    App._dt.push(t); return t;
  };

  /* ====================== Kanban (drag & drop) ====================== */
  ui.kanban = function (columns, opts) {
    opts = opts || {};
    var html = '<div class="flex gap-4 overflow-x-auto pb-2" id="' + (opts.id || 'kanban') + '">';
    Object.keys(columns).forEach(function (col) {
      var cards = columns[col];
      var total = cards.reduce(function (s, c) { return s + (c.value || 0); }, 0);
      html += '<div class="kanban-col p-3 flex-shrink-0" data-col="' + col + '" style="width:300px">' +
        '<div class="flex items-center justify-between px-1 mb-3">' +
          '<div class="font-semibold text-sm flex items-center gap-2">' + col + '<span class="badge badge-slate">' + cards.length + '</span></div>' +
          '<span class="text-muted text-[11px] font-mono">' + D.inr(total) + '</span>' +
        '</div><div class="space-y-2.5 kanban-list" style="min-height:40px">';
      cards.forEach(function (c) {
        html += '<div class="kanban-card p-3" draggable="true" data-id="' + c.id + '">' +
          '<div class="flex items-center justify-between mb-2">' + ui.badge(c.tag, statusMap[c.tag] || 'blue') + '<span class="text-muted text-[10px] font-mono">' + c.id + '</span></div>' +
          '<div class="font-semibold text-sm">' + c.org + '</div>' +
          '<div class="text-muted text-xs mt-1">' + c.owner + '</div>' +
          '<div class="flex items-center justify-between mt-3 pt-2.5" style="border-top:1px solid rgb(var(--c-border))">' +
            '<span class="metric-value text-sm gradient-text">' + D.inr(c.value) + '</span>' +
            '<span class="text-muted text-xs"><i class="fa-regular fa-clock"></i></span>' +
          '</div></div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  };
  ui.initKanban = function (containerId) {
    var root = document.getElementById(containerId); if (!root) return;
    var dragged = null;
    root.querySelectorAll('.kanban-card').forEach(function (card) {
      card.addEventListener('dragstart', function () { dragged = card; card.classList.add('dragging'); });
      card.addEventListener('dragend', function () { card.classList.remove('dragging'); dragged = null; });
    });
    root.querySelectorAll('.kanban-col').forEach(function (col) {
      var list = col.querySelector('.kanban-list');
      col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('drop-target'); });
      col.addEventListener('dragleave', function () { col.classList.remove('drop-target'); });
      col.addEventListener('drop', function (e) {
        e.preventDefault(); col.classList.remove('drop-target');
        if (dragged) { list.appendChild(dragged); ui.toast({ title: 'Opportunity moved', text: 'Pipeline stage updated to "' + col.dataset.col + '"', type: 'success' }); }
      });
    });
  };

  /* ====================== Leaflet Map ====================== */
  ui.map = function (elId, opts) {
    opts = opts || {};
    var el = document.getElementById(elId); if (!el || !window.L) return null;
    var map = L.map(el, { zoomControl: true, attributionControl: false, scrollWheelZoom: false })
      .setView(opts.center || [22.9734, 78.6569], opts.zoom || 5);
    var dark = document.documentElement.classList.contains('dark');
    var url = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(url, { maxZoom: 19 }).addTo(map);
    App._maps.push(map);
    return map;
  };
  ui.mapPin = function (color, icon) {
    return L.divIcon({
      className: '', iconSize: [26, 26], iconAnchor: [13, 26],
      html: '<div class="map-pin" style="width:26px;height:26px;background:' + color + '"><i class="fa-solid ' + icon + '"></i></div>',
    });
  };

  /* ====================== Modal (accessible, focus-trapped) ====================== */
  ui.modal = function (o) {
    var host = document.getElementById('modal-host');
    var lastFocus = document.activeElement;
    var titleId = 'modal-title-' + Date.now();
    var foot = (o.buttons || [{ label: 'Close', variant: 'btn-ghost', close: true }]).map(function (b, i) {
      return '<button class="btn ' + (b.variant || 'btn-ghost') + '" data-mbtn="' + i + '">' + (b.icon ? '<i class="fa-solid ' + b.icon + '"></i>' : '') + b.label + '</button>';
    }).join('');
    host.innerHTML = '<div class="modal-overlay" data-overlay>' +
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '">' +
        '<div class="modal-head"><div class="flex items-center gap-3">' +
          (o.icon ? '<div class="w-9 h-9 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + o.icon + '"></i></div>' : '') +
          '<div><div class="section-title text-base" id="' + titleId + '">' + o.title + '</div>' + (o.subtitle ? '<div class="text-muted text-xs">' + o.subtitle + '</div>' : '') + '</div>' +
        '</div><button class="icon-btn" data-close aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button></div>' +
        '<div class="modal-body">' + (o.body || '') + '</div>' +
        '<div class="modal-foot">' + foot + '</div>' +
      '</div></div>';

    var modalEl = host.querySelector('.modal');
    function close() {
      host.innerHTML = '';
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
    }
    function focusables() {
      return Array.prototype.slice.call(modalEl.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'))
        .filter(function (el) { return el.offsetParent !== null; });
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);

    host.querySelector('[data-close]').onclick = close;
    host.querySelector('[data-overlay]').onclick = function (e) { if (e.target.hasAttribute('data-overlay')) close(); };
    (o.buttons || []).forEach(function (b, i) {
      var el = host.querySelector('[data-mbtn="' + i + '"]');
      if (el) el.onclick = function () { if (b.onClick) b.onClick(); if (b.close !== false) close(); };
    });
    if (!o.buttons) host.querySelector('[data-mbtn="0"]').onclick = close;

    // initial focus → first input, else first focusable
    setTimeout(function () {
      var f = focusables();
      var input = modalEl.querySelector('input,textarea,select');
      (input || f[0] || modalEl).focus();
    }, 60);

    return { close: close };
  };

  /* ====================== Toast ====================== */
  var toastIco = { success: { i: 'fa-circle-check', c: '#16ad8f' }, error: { i: 'fa-circle-exclamation', c: '#ef4444' }, info: { i: 'fa-circle-info', c: '#1b7df5' }, warn: { i: 'fa-triangle-exclamation', c: '#f59e0b' } };
  ui.toast = function (o) {
    var host = document.getElementById('toast-host');
    var t = toastIco[o.type || 'info'];
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<div class="toast-ico" style="background:' + t.c + '22;color:' + t.c + '"><i class="fa-solid ' + t.i + '"></i></div>' +
      '<div class="min-w-0 flex-1"><div class="font-semibold text-sm">' + o.title + '</div>' +
      (o.text ? '<div class="text-muted text-xs mt-0.5">' + o.text + '</div>' : '') + '</div>' +
      '<button class="icon-btn !w-7 !h-7 -mr-1 -mt-1"><i class="fa-solid fa-xmark text-xs"></i></button>';
    function remove() { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }
    el.querySelector('button').onclick = remove;
    host.appendChild(el);
    setTimeout(remove, o.duration || 4200);
  };

  /* ---- empty / placeholder block used by generic module pages ---- */
  ui.placeholder = function (icon, title, text) {
    return '<div class="card p-10 text-center"><div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl text-white mb-4" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + icon + '"></i></div>' +
      '<div class="section-title text-lg">' + title + '</div><p class="text-muted text-sm mt-2 max-w-md mx-auto">' + text + '</p></div>';
  };

  /* ---- small list-tile used in many panels ---- */
  ui.tile = function (o) {
    return '<div class="flex items-center gap-3 p-3 rounded-xl card-2 hairline border">' +
      '<div class="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-none" style="background:' + (o.color || '#1b7df5') + '"><i class="fa-solid ' + o.icon + '"></i></div>' +
      '<div class="min-w-0 flex-1"><div class="text-sm font-semibold clamp-1">' + o.title + '</div><div class="text-muted text-xs clamp-1">' + o.text + '</div></div>' +
      (o.right ? '<div class="text-right flex-none">' + o.right + '</div>' : '') + '</div>';
  };

})(window.MyDR24);
