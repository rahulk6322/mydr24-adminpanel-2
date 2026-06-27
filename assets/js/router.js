/* ==========================================================================
   MyDR24 HOS — Hash Router
   Resolves #/<routeId> to a registered page renderer, or a generic module page.
   ========================================================================== */
(function (App) {
  'use strict';
  App.pages = App.pages || {};

  var Router = App.router = {};

  Router.current = null;

  Router.go = function (id) {
    if (('#/' + id) !== location.hash) { location.hash = '/' + id; }
    else Router.render(id);
  };

  Router.parse = function () {
    var h = location.hash.replace(/^#\/?/, '').trim();
    return h || App.defaultRoute;
  };

  Router.render = function (id) {
    var route = App.routes[id];
    if (!route) { id = App.defaultRoute; route = App.routes[id]; }
    App.state.route = id;
    Router.current = id;

    // teardown previous page resources
    App.ui.cleanup();

    var host = document.getElementById('page-host');
    if (!host) return;

    var page = App.pages[id] || App.pages._generic;
    var html;
    try {
      html = page.render(route);
    } catch (e) {
      console.error('Render error for', id, e);
      html = App.ui.placeholder('fa-triangle-exclamation', 'Page failed to render', 'An error occurred while building this module: ' + e.message);
    }
    host.innerHTML = '<div class="page-wrap stagger">' + html + '</div>';
    host.scrollTop = 0;
    window.scrollTo(0, 0);

    // run page init (charts, maps, tables) after DOM paints
    requestAnimationFrame(function () {
      try { if (page.init) page.init(route); } catch (e) { console.error('Init error for', id, e); }
    });

    // update shell chrome
    App.shell.syncActiveNav(id);
    App.shell.updateBreadcrumb(route);
    document.title = 'MyDR24 HOS · ' + (route.label || 'Dashboard');

    // close mobile nav
    document.body.classList.remove('nav-open');
  };

  window.addEventListener('hashchange', function () { Router.render(Router.parse()); });

})(window.MyDR24);
