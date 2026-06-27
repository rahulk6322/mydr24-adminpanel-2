/* ==========================================================================
   MyDR24 HOS — Application Shell + Bootstrap
   ========================================================================== */
(function (App) {
  'use strict';
  var ui = App.ui, D = App.data;
  var shell = App.shell = {};

  /* ---------------- Sidebar ---------------- */
  function navItemHtml(item) {
    if (item.children) {
      var kids = item.children.map(function (c) {
        return '<a class="nav-item" role="menuitem" data-route="' + c.id + '" data-tip="' + c.label + '" href="#/' + c.id + '"><i class="nav-ico fa-solid ' + c.icon + '" aria-hidden="true"></i><span>' + c.label + '</span>' +
          (c.badge ? '<span class="nav-badge">' + c.badge + '</span>' : '') + '</a>';
      }).join('');
      return '<div class="nav-parent" data-parent>' +
        '<div class="nav-item" data-toggle role="button" tabindex="0" aria-expanded="false" data-tip="' + item.label + '"><i class="nav-ico fa-solid ' + item.icon + '" aria-hidden="true"></i><span>' + item.label + '</span><i class="chev fa-solid fa-chevron-right" aria-hidden="true"></i></div>' +
        '<div class="nav-children" role="menu">' + kids + '</div></div>';
    }
    return '<a class="nav-item" role="menuitem" data-route="' + item.id + '" data-tip="' + item.label + '" href="#/' + item.id + '"><i class="nav-ico fa-solid ' + item.icon + '" aria-hidden="true"></i><span>' + item.label + '</span>' +
      (item.badge ? '<span class="nav-badge">' + item.badge + '</span>' : '') + '</a>';
  }

  function sidebarHtml() {
    var groups = App.nav.map(function (sec) {
      return '<div class="nav-group"><div class="nav-group-label">' + sec.section + '</div>' +
        sec.items.map(navItemHtml).join('') + '</div>';
    }).join('');
    var role = App.roles[App.state.role];
    return '' +
      '<aside class="sidebar" role="navigation" aria-label="Primary navigation">' +
        '<div class="sidebar-head">' +
          '<div class="brand-mark"><i class="fa-solid fa-staff-snake" aria-hidden="true"></i></div>' +
          '<div class="min-w-0"><div class="brand-name">MyDR24</div><div class="brand-sub">Healthcare OS</div></div>' +
          '<button class="icon-btn collapse-btn ml-auto !w-8 !h-8" data-collapse title="Collapse sidebar" aria-label="Collapse sidebar"><i class="fa-solid fa-angles-left text-xs"></i></button>' +
          '<button class="icon-btn mobile-only ml-auto" data-close-nav aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<div class="sidebar-scroll">' + groups + '</div>' +
        '<div class="sidebar-foot">' +
          '<div class="flex items-center gap-3 p-2.5 rounded-xl card-2 hairline border">' +
            ui.avatar(role.label, 36) +
            '<div class="min-w-0 flex-1"><div class="text-sm font-semibold clamp-1">Aryan Kapoor</div><div class="text-muted text-[11px] clamp-1">' + role.label + '</div></div>' +
            '<button class="icon-btn !w-8 !h-8" data-signout title="Sign out"><i class="fa-solid fa-arrow-right-from-bracket text-xs"></i></button>' +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  /* ---------------- Topbar ---------------- */
  function topbarHtml() {
    var role = App.roles[App.state.role];
    var tenant = App.tenants.find(function (t) { return t.id === App.state.tenant; }) || App.tenants[0];
    var dark = App.state.theme === 'dark';
    return '' +
      '<header class="topbar" role="banner">' +
        '<button class="icon-btn mobile-only" data-open-nav aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>' +
        '<div class="topbar-search hide-sm" data-search-open role="search">' +
          '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
          '<input readonly placeholder="Search patients, doctors, modules…" aria-label="Search" />' +
          '<kbd>⌘K</kbd>' +
        '</div>' +
        '<button class="icon-btn mobile-only" data-search-open aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>' +
        '<div class="flex items-center gap-2 ml-auto">' +
          '<button class="role-chip hide-sm" data-tenant title="Switch tenant" aria-label="Switch tenant">' +
            '<span class="w-8 h-8 rounded-lg flex items-center justify-center text-white" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + tenant.icon + ' text-xs"></i></span>' +
            '<span class="text-left leading-tight"><span class="block text-[12.5px] font-semibold">' + tenant.name.split(' · ')[0].split(' (')[0] + '</span><span class="block text-[10.5px] text-muted">' + tenant.type + '</span></span>' +
            '<i class="fa-solid fa-chevron-down text-[10px] text-muted ml-1"></i>' +
          '</button>' +
          '<button class="icon-btn" data-appearance title="Appearance" aria-label="Appearance settings"><i class="fa-solid fa-sliders"></i></button>' +
          '<button class="icon-btn" data-theme title="Toggle theme" aria-label="Toggle dark or light theme"><i class="fa-solid ' + (dark ? 'fa-sun' : 'fa-moon') + '"></i></button>' +
          '<button class="icon-btn" data-notif title="Notifications" aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="dot"></span></button>' +
          '<button class="role-chip" data-role title="Switch role" aria-label="Switch role">' +
            ui.avatar(role.label, 30) +
            '<span class="text-left leading-tight hide-sm"><span class="block text-[12.5px] font-semibold">' + role.label + '</span><span class="block text-[10.5px] text-muted">' + role.desc + '</span></span>' +
            '<i class="fa-solid fa-chevron-down text-[10px] text-muted ml-1 hide-sm"></i>' +
          '</button>' +
        '</div>' +
      '</header>';
  }

  function breadcrumbHtml() {
    return '<div class="flex items-center gap-2 text-[12.5px] text-muted px-1 mb-1" id="breadcrumb"></div>';
  }

  /* ---------------- Mount ---------------- */
  shell.render = function () {
    var root = document.getElementById('app-root');
    root.innerHTML =
      '<a href="#main-content" class="skip-link">Skip to main content</a>' +
      '<div class="scrim" data-close-nav></div>' +
      '<div class="shell">' +
        sidebarHtml() +
        '<div class="main">' +
          topbarHtml() +
          '<main id="main-content" class="content" role="main" tabindex="-1"><div class="page-wrap">' + breadcrumbHtml() + '</div><div id="page-host"></div></main>' +
        '</div>' +
      '</div>';
    shell.wire();
  };

  shell.updateBreadcrumb = function (route) {
    var bc = document.getElementById('breadcrumb'); if (!bc) return;
    var parts = ['<i class="fa-solid fa-house text-[11px]"></i>', route.section || 'Home'];
    if (route.parent) parts.push(route.parent);
    parts.push('<span class="text-app font-semibold">' + route.label + '</span>');
    bc.innerHTML = parts.join('<i class="fa-solid fa-chevron-right text-[9px] opacity-50"></i>');
  };

  shell.syncActiveNav = function (id) {
    document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); n.removeAttribute('aria-current'); });
    var active = document.querySelector('.nav-item[data-route="' + id + '"]');
    if (active) {
      active.classList.add('active');
      active.setAttribute('aria-current', 'page');
      var parent = active.closest('.nav-parent');
      if (parent) { parent.classList.add('open'); var tog = parent.querySelector('[data-toggle]'); if (tog) tog.setAttribute('aria-expanded', 'true'); }
    }
  };

  /* ---------------- Wiring ---------------- */
  shell.wire = function () {
    var root = document.getElementById('app-root');

    // collapsible nav parents (mouse + keyboard)
    root.querySelectorAll('[data-toggle]').forEach(function (t) {
      function toggle() {
        var p = t.closest('.nav-parent');
        p.classList.toggle('open');
        t.setAttribute('aria-expanded', p.classList.contains('open') ? 'true' : 'false');
      }
      t.addEventListener('click', toggle);
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });

    // sidebar collapse (rail) toggle
    var cb = root.querySelector('[data-collapse]');
    if (cb) cb.onclick = function () { App.store.toggle('sidebar', 'expanded', 'rail'); };

    // appearance menu
    var ap = root.querySelector('[data-appearance]');
    if (ap) ap.onclick = function (e) { e.stopPropagation(); shell.openAppearance(ap); };

    // mobile nav open/close
    root.querySelectorAll('[data-open-nav]').forEach(function (b) { b.onclick = function () { document.body.classList.add('nav-open'); }; });
    root.querySelectorAll('[data-close-nav]').forEach(function (b) { b.onclick = function () { document.body.classList.remove('nav-open'); }; });

    // theme toggle
    var tt = root.querySelector('[data-theme]');
    if (tt) tt.onclick = shell.toggleTheme;

    // notifications
    var nb = root.querySelector('[data-notif]');
    if (nb) nb.onclick = function (e) { e.stopPropagation(); shell.openNotif(nb); };

    // role switcher
    var rb = root.querySelector('[data-role]');
    if (rb) rb.onclick = function (e) { e.stopPropagation(); shell.openRoleMenu(rb); };

    // tenant switcher
    var tb = root.querySelector('[data-tenant]');
    if (tb) tb.onclick = function (e) { e.stopPropagation(); shell.openTenantMenu(tb); };

    // search palette
    root.querySelectorAll('[data-search-open]').forEach(function (b) { b.onclick = shell.openSearch; });

    // signout (demo)
    var so = root.querySelector('[data-signout]');
    if (so) so.onclick = function () { ui.toast({ title: 'Demo mode', text: 'Sign-out is disabled in this preview.', type: 'info' }); };

    // page action delegation (toasts/modals from headers)
    document.getElementById('page-host').addEventListener('click', shell.handlePageAction);
  };

  shell.handlePageAction = function (e) {
    var btn = e.target.closest('[data-action]'); if (!btn) return;
    var a = btn.getAttribute('data-action');
    if (App.actions && App.actions[a]) { App.actions[a](btn); return; }
    // default: friendly toast
    ui.toast({ title: btn.textContent.trim() || 'Action', text: 'This is a demo action in the MyDR24 HOS preview.', type: 'info' });
  };

  /* ---- Global actions available on every page ---- */
  App.actions['export'] = function () { ui.exportCSV(); };
  App.actions['export-ledger'] = function () { ui.exportCSV(); };
  App.actions['noop'] = function (btn) { ui.toast({ title: btn ? btn.textContent.trim() : 'Action', text: 'Demo action — wired for production integration.', type: 'info' }); };

  /* ---- Theme ---- */
  shell.toggleTheme = function () {
    var next = App.state.theme === 'dark' ? 'light' : 'dark';
    App.state.theme = next;
    localStorage.setItem('mydr24:theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.setAttribute('data-theme', next);
    // re-render shell chrome + current page (charts pick up theme colors)
    shell.render();
    App.router.render(App.router.current || App.defaultRoute);
    ui.toast({ title: next === 'dark' ? 'Dark mode' : 'Light mode', text: 'Theme preference saved.', type: 'success' });
  };

  /* ---- Floating menu helper ---- */
  function floatMenu(anchor, html) {
    closeMenus();
    var m = document.createElement('div');
    m.className = 'menu'; m.setAttribute('data-menu', '');
    m.innerHTML = html;
    document.body.appendChild(m);
    var r = anchor.getBoundingClientRect();
    var w = m.offsetWidth;
    m.style.top = (r.bottom + 8) + 'px';
    m.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
    setTimeout(function () { document.addEventListener('click', closeMenus, { once: true }); }, 0);
    return m;
  }
  function closeMenus() { document.querySelectorAll('[data-menu]').forEach(function (m) { m.remove(); }); }

  shell.openNotif = function (anchor) {
    var items = D.notifications.map(function (n) {
      return '<div class="menu-item items-start"><span class="w-8 h-8 rounded-lg flex items-center justify-center flex-none" style="background:' + n.color + '22;color:' + n.color + '"><i class="fa-solid ' + n.icon + ' text-xs"></i></span>' +
        '<span class="min-w-0"><span class="block text-[13px] font-semibold">' + n.title + '</span><span class="block text-muted text-[11.5px] clamp-2">' + n.text + '</span></span>' +
        '<span class="text-muted text-[10px] ml-auto whitespace-nowrap">' + n.time + '</span></div>';
    }).join('');
    floatMenu(anchor, '<div class="px-3 py-2 flex items-center justify-between"><span class="font-semibold text-sm">Notifications</span><span class="badge badge-red">5 new</span></div><div class="menu-sep"></div>' + items +
      '<div class="menu-sep"></div><div class="menu-item justify-center text-brand text-[13px]" style="color:rgb(var(--c-brand))">View all activity</div>');
  };

  shell.openRoleMenu = function (anchor) {
    var items = Object.keys(App.roles).map(function (key) {
      var r = App.roles[key];
      var active = key === App.state.role;
      return '<div class="menu-item" data-pick-role="' + key + '">' + ui.avatar(r.label, 28) +
        '<span class="min-w-0"><span class="block text-[13px] font-semibold">' + r.label + '</span><span class="block text-muted text-[11px]">' + r.desc + '</span></span>' +
        (active ? '<i class="fa-solid fa-check ml-auto" style="color:rgb(var(--c-brand))"></i>' : '') + '</div>';
    }).join('');
    var m = floatMenu(anchor, '<div class="px-3 py-2 font-semibold text-sm">Switch role · RBAC</div><div class="menu-sep"></div>' + items);
    m.querySelectorAll('[data-pick-role]').forEach(function (el) {
      el.onclick = function () {
        App.state.role = el.getAttribute('data-pick-role');
        localStorage.setItem('mydr24:role', App.state.role);
        closeMenus(); shell.render(); App.router.render(App.router.current);
        ui.toast({ title: 'Role switched', text: 'Now viewing as ' + App.roles[App.state.role].label, type: 'success' });
      };
    });
  };

  shell.openTenantMenu = function (anchor) {
    var items = App.tenants.map(function (t) {
      var active = t.id === App.state.tenant;
      return '<div class="menu-item" data-pick-tenant="' + t.id + '"><span class="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-none" style="background:linear-gradient(135deg,#1b7df5,#0a8b75)"><i class="fa-solid ' + t.icon + ' text-xs"></i></span>' +
        '<span class="min-w-0"><span class="block text-[13px] font-semibold clamp-1">' + t.name + '</span><span class="block text-muted text-[11px]">' + t.type + '</span></span>' +
        (active ? '<i class="fa-solid fa-check ml-auto" style="color:rgb(var(--c-brand))"></i>' : '') + '</div>';
    }).join('');
    var m = floatMenu(anchor, '<div class="px-3 py-2 font-semibold text-sm">Multi-Tenant Workspace</div><div class="menu-sep"></div>' + items);
    m.querySelectorAll('[data-pick-tenant]').forEach(function (el) {
      el.onclick = function () {
        App.state.tenant = el.getAttribute('data-pick-tenant');
        localStorage.setItem('mydr24:tenant', App.state.tenant);
        closeMenus(); shell.render(); App.router.render(App.router.current);
        ui.toast({ title: 'Workspace switched', text: 'Context: ' + (App.tenants.find(function (x) { return x.id === App.state.tenant; }).name), type: 'success' });
      };
    });
  };

  /* ---- Appearance preferences menu ---- */
  shell.openAppearance = function (anchor) {
    var p = App.prefs;
    function seg(key, opts) {
      return '<div class="flex gap-1.5 p-1 rounded-xl card-2 hairline border">' + opts.map(function (o) {
        var on = p[key] === o.v;
        return '<button class="btn btn-sm ' + (on ? 'btn-primary' : 'btn-ghost') + ' flex-1" data-pref="' + key + '" data-val="' + o.v + '">' + (o.i ? '<i class="fa-solid ' + o.i + '"></i>' : '') + o.l + '</button>';
      }).join('') + '</div>';
    }
    var swatches = App.accents.map(function (a) {
      return '<span class="swatch ' + (p.accent === a.id ? 'active' : '') + '" data-accent="' + a.id + '" title="' + a.id + '" style="background:' + a.hex + '"></span>';
    }).join('');
    var m = floatMenu(anchor, '<div class="px-3 py-2 font-semibold text-sm">Appearance</div><div class="menu-sep"></div>' +
      '<div class="px-3 py-2 space-y-3" style="min-width:280px">' +
        '<div><div class="text-muted text-[11.5px] font-semibold mb-1.5">Density</div>' + seg('density', [{ v: 'comfortable', l: 'Comfortable', i: 'fa-up-right-and-down-left-from-center' }, { v: 'compact', l: 'Compact', i: 'fa-compress' }]) + '</div>' +
        '<div><div class="text-muted text-[11.5px] font-semibold mb-1.5">Sidebar</div>' + seg('sidebar', [{ v: 'expanded', l: 'Expanded' }, { v: 'rail', l: 'Rail' }]) + '</div>' +
        '<div><div class="text-muted text-[11.5px] font-semibold mb-1.5">Motion</div>' + seg('motion', [{ v: 'full', l: 'Full' }, { v: 'reduced', l: 'Reduced' }]) + '</div>' +
        '<div><div class="text-muted text-[11.5px] font-semibold mb-1.5">Accent color</div><div class="flex gap-2.5 px-0.5" data-accent-row>' + swatches + '</div></div>' +
      '</div>');
    m.querySelectorAll('[data-pref]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        App.store.set(b.getAttribute('data-pref'), b.getAttribute('data-val'));
        // refresh segmented active states in place
        var key = b.getAttribute('data-pref');
        m.querySelectorAll('[data-pref="' + key + '"]').forEach(function (x) {
          var on = x.getAttribute('data-val') === App.prefs[key];
          x.className = 'btn btn-sm ' + (on ? 'btn-primary' : 'btn-ghost') + ' flex-1';
        });
      };
    });
    m.querySelectorAll('[data-accent]').forEach(function (s) {
      s.onclick = function (e) {
        e.stopPropagation();
        App.store.set('accent', s.getAttribute('data-accent'));
        m.querySelectorAll('[data-accent]').forEach(function (x) { x.classList.toggle('active', x === s); });
      };
    });
  };

  /* ---- Command palette / search (modules + live entities, keyboard nav) ---- */
  shell.buildIndex = function () {
    var idx = [];
    idx.push({ kind: 'Help', icon: 'fa-book', label: 'Help & Documentation', sub: 'Open the MyDR24 HOS documentation', go: function () { window.open('docs/index.html', '_blank'); } });
    Object.keys(App.routes).forEach(function (id) {
      var r = App.routes[id];
      idx.push({ kind: 'Modules', icon: r.icon || 'fa-circle', label: r.label, sub: (r.parent ? r.parent + ' · ' : '') + r.section, go: function () { App.router.go(id); } });
    });
    (D.patients || []).slice(0, 40).forEach(function (p) {
      idx.push({ kind: 'Patients', icon: 'fa-hospital-user', label: p.name, sub: p.id + ' · ' + p.condition + ' · ' + p.city, go: function () { App._p360 = p; App.router.go('patient-360'); } });
    });
    (D.doctors || []).slice(0, 30).forEach(function (d) {
      idx.push({ kind: 'Doctors', icon: 'fa-user-doctor', label: d.name, sub: d.id + ' · ' + d.specialty, go: function () { App.router.go('doctors'); } });
    });
    (D.leads || []).slice(0, 20).forEach(function (l) {
      idx.push({ kind: 'Leads', icon: 'fa-filter', label: l.name, sub: l.id + ' · ' + l.source + ' · ' + l.stage, go: function () { App.router.go('leads'); } });
    });
    return idx;
  };

  shell.openSearch = function () {
    var index = shell.buildIndex();
    var order = ['Help', 'Modules', 'Patients', 'Doctors', 'Leads'];

    function renderResults(q) {
      q = (q || '').toLowerCase().trim();
      var matches = index.filter(function (it) { return !q || (it.label + ' ' + it.sub).toLowerCase().indexOf(q) > -1; });
      // cap per group for performance
      var html = '', flat = [];
      order.forEach(function (group) {
        var rows = matches.filter(function (m) { return m.kind === group; }).slice(0, q ? 8 : 6);
        if (!rows.length) return;
        html += '<div class="cmd-group-label">' + group + '</div>';
        rows.forEach(function (it) {
          var i = flat.length; flat.push(it);
          html += '<div class="menu-item" data-search-go data-i="' + i + '"><i class="fa-solid ' + it.icon + '"></i><span class="flex-1 min-w-0"><span class="block text-[13px] font-medium clamp-1">' + it.label + '</span><span class="block text-muted text-[11px] clamp-1">' + it.sub + '</span></span><i class="fa-solid fa-arrow-turn-down text-[10px] text-muted opacity-0"></i></div>';
        });
      });
      if (!flat.length) html = '<div class="p-6 text-center text-muted text-sm">No results for "<b class="text-app">' + q + '</b>"</div>';
      return { html: html, flat: flat };
    }

    var initial = renderResults('');
    ui.modal({
      title: 'Command Palette', subtitle: 'Search ' + index.length + ' modules & records · ↑ ↓ to navigate · ↵ to open', icon: 'fa-magnifying-glass',
      body: '<input id="cmd-input" class="input mb-3" placeholder="Type a module, patient, doctor or lead…" autocomplete="off" aria-label="Search command palette" />' +
        '<div id="cmd-results" class="max-h-[46vh] overflow-y-auto -mx-1" role="listbox">' + initial.html + '</div>',
      buttons: [{ label: 'Close', variant: 'btn-ghost', close: true }],
    });

    var input = document.getElementById('cmd-input');
    var results = document.getElementById('cmd-results');
    var flat = initial.flat, sel = 0;

    function paintSelection() {
      var items = results.querySelectorAll('[data-search-go]');
      items.forEach(function (el, i) {
        el.classList.toggle('kbd-active', i === sel);
        if (i === sel) el.scrollIntoView({ block: 'nearest' });
      });
    }
    function rebuild() {
      var r = renderResults(input.value);
      results.innerHTML = r.html; flat = r.flat; sel = 0;
      bindRows(); paintSelection();
    }
    function activate(i) {
      var it = flat[i]; if (!it) return;
      document.getElementById('modal-host').innerHTML = '';
      it.go();
    }
    function bindRows() {
      results.querySelectorAll('[data-search-go]').forEach(function (el) {
        el.onclick = function () { activate(+el.getAttribute('data-i')); };
        el.onmousemove = function () { sel = +el.getAttribute('data-i'); paintSelection(); };
      });
    }

    input.addEventListener('input', rebuild);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, flat.length - 1); paintSelection(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); paintSelection(); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(sel); }
    });
    bindRows(); paintSelection();
    setTimeout(function () { input.focus(); }, 50);
  };

  /* ---- Global shortcuts ---- */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); shell.openSearch(); }
    if (e.key === 'Escape') { document.getElementById('modal-host').innerHTML = ''; closeMenus(); }
  });

  /* ---------------- Global error handling ---------------- */
  var lastErrAt = 0;
  window.addEventListener('error', function (e) {
    var now = Date.now();
    if (now - lastErrAt < 4000) return; // throttle noisy errors
    lastErrAt = now;
    if (ui && ui.toast) ui.toast({ title: 'Something went wrong', text: (e.message || 'Unexpected error') + ' — the rest of the panel keeps working.', type: 'warn' });
    console.error('[MyDR24]', e.error || e.message);
  });
  window.addEventListener('unhandledrejection', function (e) {
    console.error('[MyDR24] Unhandled promise rejection', e.reason);
  });

  /* ---------------- Boot ---------------- */
  function boot() {
    try {
      document.documentElement.classList.toggle('dark', App.state.theme === 'dark');
      document.documentElement.setAttribute('data-theme', App.state.theme);
      if (App.store) App.store.apply(); // re-assert appearance prefs (accent/density/sidebar/motion)
      shell.render();
      App.router.render(App.router.parse());
    } catch (err) {
      console.error('[MyDR24] Boot failure', err);
      var rootEl = document.getElementById('app-root');
      if (rootEl) rootEl.innerHTML = '<div style="padding:40px;text-align:center"><h2>MyDR24 HOS failed to start</h2><p style="opacity:.7">' + (err.message || err) + '</p></div>';
    }
    setTimeout(function () {
      var s = document.getElementById('boot-splash');
      if (s) s.classList.add('hide');
    }, 650);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window.MyDR24);
