/**
 * Chill Express — menu page render logic
 */
(function () {
  'use strict';

  window.ChillExpressPageInit = function () {
    var CE = window.ChillExpress;
    var qs = CE.utils.qs;
    var escapeHtml = CE.utils.escapeHtml;

    var rail = qs('#category-rail');
    var grid = qs('#menu-grid');
    var emptyState = qs('#menu-empty');
    if (!rail || !grid) return;

    function categoryToSlug(cat) {
      return cat.toLowerCase().replace(/\s+/g, '-');
    }

    function slugToCategory(slug) {
      var match = CE.CATEGORIES.find(function (c) { return categoryToSlug(c) === slug; });
      return match || 'All';
    }

    var initialSlug = window.location.hash ? window.location.hash.replace('#', '') : '';
    var activeCategory = initialSlug ? slugToCategory(initialSlug) : 'All';

    function renderPills() {
      rail.innerHTML = CE.CATEGORIES.map(function (cat) {
        var pressed = cat === activeCategory ? 'true' : 'false';
        return (
          '<button type="button" class="category-pill" data-category="' + escapeHtml(cat) + '" aria-pressed="' + pressed + '">' +
            escapeHtml(cat) +
          '</button>'
        );
      }).join('');
    }

    function renderGrid() {
      var items = activeCategory === 'All'
        ? CE.MENU_ITEMS
        : CE.MENU_ITEMS.filter(function (i) { return i.category === activeCategory; });

      grid.innerHTML = items.map(CE.utils.itemCardHTML).join('');
      CE.utils.wirePhotoFade(grid);
      if (emptyState) emptyState.style.display = items.length ? 'none' : 'block';
    }

    rail.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-category]') : null;
      if (!btn) return;
      activeCategory = btn.getAttribute('data-category');
      var slug = activeCategory === 'All' ? '' : categoryToSlug(activeCategory);
      if (window.history && window.history.replaceState) {
        var newUrl = window.location.pathname + (slug ? '#' + slug : '');
        window.history.replaceState(null, '', newUrl);
      }
      renderPills();
      renderGrid();
      qs('#category-rail [aria-pressed="true"]').focus();
    });

    renderPills();
    renderGrid();
  };
})();
