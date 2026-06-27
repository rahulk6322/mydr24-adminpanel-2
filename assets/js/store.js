/* ==========================================================================
   MyDR24 HOS — Reactive Store + Event Bus + Appearance Preferences
   Principle: single source of truth, observer pattern, progressive enhancement.
   Loaded immediately after config.js so preferences apply before first paint.
   ========================================================================== */
(function (App) {
  'use strict';

  /* ---------------- Tiny event bus (pub/sub) ---------------- */
  var handlers = {};
  App.bus = {
    on: function (evt, fn) { (handlers[evt] = handlers[evt] || []).push(fn); return function () { App.bus.off(evt, fn); }; },
    off: function (evt, fn) { handlers[evt] = (handlers[evt] || []).filter(function (h) { return h !== fn; }); },
    emit: function (evt, payload) { (handlers[evt] || []).forEach(function (h) { try { h(payload); } catch (e) { console.error(e); } }); },
  };

  /* ---------------- Appearance preferences ---------------- */
  var ACCENTS = [
    { id: 'blue', hex: '#1b7df5', rgb: '27 125 245' },
    { id: 'teal', hex: '#0a8b75', rgb: '10 139 117' },
    { id: 'violet', hex: '#8b5cf6', rgb: '139 92 246' },
    { id: 'emerald', hex: '#16ad8f', rgb: '22 173 143' },
    { id: 'rose', hex: '#e11d48', rgb: '225 29 72' },
    { id: 'amber', hex: '#f59e0b', rgb: '245 158 11' },
  ];
  App.accents = ACCENTS;

  var DEFAULTS = { density: 'comfortable', accent: 'blue', sidebar: 'expanded', motion: 'full' };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('mydr24:prefs') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  App.prefs = load();

  // Respect OS "reduce motion" on first run if the user hasn't chosen.
  try {
    if (!localStorage.getItem('mydr24:prefs') && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      App.prefs.motion = 'reduced';
    }
  } catch (e) {}

  var store = App.store = {};

  store.accentRgb = function (id) {
    var a = ACCENTS.find(function (x) { return x.id === (id || App.prefs.accent); }) || ACCENTS[0];
    return a.rgb;
  };
  store.accentHex = function (id) {
    var a = ACCENTS.find(function (x) { return x.id === (id || App.prefs.accent); }) || ACCENTS[0];
    return a.hex;
  };

  store.apply = function () {
    var el = document.documentElement;
    el.setAttribute('data-density', App.prefs.density);
    el.setAttribute('data-sidebar', App.prefs.sidebar);
    el.setAttribute('data-motion', App.prefs.motion);
    // Accent drives the brand token used across nav, focus rings and links.
    el.style.setProperty('--c-brand', store.accentRgb());
    el.style.setProperty('--c-accent', store.accentRgb());
  };

  store.set = function (key, val) {
    if (App.prefs[key] === val) return;
    App.prefs[key] = val;
    try { localStorage.setItem('mydr24:prefs', JSON.stringify(App.prefs)); } catch (e) {}
    store.apply();
    App.bus.emit('prefs:change', { key: key, value: val });
    App.bus.emit('prefs:' + key, val);
  };

  store.toggle = function (key, a, b) { store.set(key, App.prefs[key] === a ? b : a); };

  // Apply as early as possible (documentElement exists during parse).
  store.apply();

})(window.MyDR24);
