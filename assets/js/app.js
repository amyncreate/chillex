/**
 * Chill Express — shared app behavior
 * Runs on every page. Depends on data.js and cart-store.js being loaded first.
 */
(function () {
  'use strict';

  var CE = window.ChillExpress;
  var CONFIG = CE.CONFIG;

  /* ----------------------------------------------------------------------
   * Utilities
   * ------------------------------------------------------------------- */

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function buildWhatsAppUrl(message) {
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function openExternal(url) {
    var win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
  }

  function itemCardHTML(item) {
    var meta = CE.CATEGORY_META[item.category] || { icon: 'icon-wrap', tint: 'cat-shawarma' };
    var popularFlag = item.popular
      ? '<span class="popular-flag"><svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#icon-fire"></use></svg>Popular</span>'
      : '';
    var photoHTML = item.image
      ? '<img class="item-photo" src="assets/images/menu/' + escapeHtml(item.image) + '" alt="" loading="lazy">'
      : '';
    return (
      '<div class="item-card" role="button" tabindex="0" data-open-item="' + escapeHtml(item.id) + '" aria-label="View details for ' + escapeHtml(item.name) + ', ' + CE.formatNaira(item.price) + '">' +
        '<span class="item-card-icon ' + meta.tint + '">' +
          '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#' + meta.icon + '"></use></svg>' +
          photoHTML +
        '</span>' +
        '<span class="item-card-body">' +
          '<span class="item-card-top">' +
            '<span class="item-card-name">' + escapeHtml(item.name) + '</span>' +
            popularFlag +
          '</span>' +
          '<span class="item-card-desc">' + escapeHtml(item.description) + '</span>' +
          '<span class="item-card-bottom">' +
            '<span class="item-card-price">' + CE.formatNaira(item.price) + '</span>' +
            '<button type="button" class="add-btn" data-add-item="' + escapeHtml(item.id) + '" aria-label="Add ' + escapeHtml(item.name) + ' to cart">' +
              '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#icon-plus"></use></svg>' +
            '</button>' +
          '</span>' +
        '</span>' +
      '</div>'
    );
  }

  function wirePhotoFade(root) {
    qsa('.item-photo', root || document).forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('is-loaded'); });
      }
      // No error handler needed: a missing/broken photo just never gets
      // .is-loaded, so it stays invisible and the icon underneath shows through.
    });
  }

  CE.utils = {
    qs: qs,
    qsa: qsa,
    escapeHtml: escapeHtml,
    buildWhatsAppUrl: buildWhatsAppUrl,
    openExternal: openExternal,
    itemCardHTML: itemCardHTML,
    wirePhotoFade: wirePhotoFade
  };

  /* ----------------------------------------------------------------------
   * Loader screen — hides once the page (and webfonts) are ready
   * ------------------------------------------------------------------- */

  function hideLoader() {
    var loader = qs('.loader');
    if (!loader) return;
    loader.classList.add('is-hidden');
    window.setTimeout(function () {
      if (loader.parentNode) loader.setAttribute('aria-hidden', 'true');
    }, 550);
  }

  function initLoader() {
    var minDelay = new Promise(function (resolve) { window.setTimeout(resolve, 420); });
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(function () {}) : Promise.resolve();
    Promise.all([minDelay, fontsReady]).then(hideLoader);
    // Hard safety net so the loader never traps a user if something above fails
    window.setTimeout(hideLoader, 2500);
  }

  /* ----------------------------------------------------------------------
   * Mobile navigation (hamburger panel)
   * ------------------------------------------------------------------- */

  function initMobileNav() {
    var openBtn = qs('.hamburger-btn');
    var nav = qs('.mobile-nav');
    if (!openBtn || !nav) return;

    var closeBtn = qs('.mobile-nav-close', nav);
    var backdrop = qs('.mobile-nav-backdrop', nav);
    var panel = qs('.mobile-nav-panel', nav);
    var lastFocused = null;

    function focusableEls() {
      return qsa('a, button', panel);
    }

    function open() {
      lastFocused = document.activeElement;
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      openBtn.setAttribute('aria-expanded', 'true');
      var first = focusableEls()[0];
      if (first) first.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      else openBtn.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab') {
        var items = focusableEls();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    qsa('a', panel).forEach(function (a) { a.addEventListener('click', close); });
  }

  /* ----------------------------------------------------------------------
   * Active nav link — marks the current page in both nav menus
   * ------------------------------------------------------------------- */

  function initActiveNav() {
    var currentPage = document.body.getAttribute('data-page');
    qsa('[data-nav-link]').forEach(function (link) {
      var target = link.getAttribute('data-nav-link');
      if (currentPage && target === currentPage) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /* ----------------------------------------------------------------------
   * Cart badge sync — every page shows a live item count
   * ------------------------------------------------------------------- */

  function syncCartBadges() {
    var count = CE.cart.count();
    qsa('.cart-badge').forEach(function (badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.classList.toggle('is-visible', count > 0);
    });
  }

  /* ----------------------------------------------------------------------
   * Toast notifications
   * ------------------------------------------------------------------- */

  var toastTimer = null;
  function showToast(message) {
    var toast = qs('#toast');
    if (!toast) return;
    qs('span', toast).textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }
  CE.showToast = showToast;

  /* ----------------------------------------------------------------------
   * Item detail modal — populated generically from data-item-id
   * ------------------------------------------------------------------- */

  function initItemModal() {
    var modal = qs('#item-modal');
    if (!modal) return;

    var closeBtn = qs('.modal-close', modal);
    var backdrop = qs('.modal-backdrop', modal);
    var iconEl = qs('.modal-icon', modal);
    var iconUse = iconEl ? qs('use', iconEl) : null;
    var photoEl = iconEl ? qs('.item-photo', iconEl) : null;
    var nameEl = qs('.modal-name', modal);
    var priceEl = qs('.modal-price', modal);
    var descEl = qs('.modal-desc', modal);
    var flagEl = qs('.modal-flag', modal);
    var addBtn = qs('.modal-add-btn', modal);
    var orderBtn = qs('.modal-order-btn', modal);
    var lastFocused = null;
    var currentItem = null;

    function open(item) {
      currentItem = item;
      var meta = CE.CATEGORY_META[item.category] || { icon: 'icon-wrap', tint: 'cat-shawarma' };
      if (iconUse) iconUse.setAttribute('href', 'assets/icons/icons.svg#' + meta.icon);
      if (iconEl) iconEl.className = 'modal-icon ' + meta.tint;
      if (nameEl) nameEl.textContent = item.name;
      if (priceEl) priceEl.textContent = CE.formatNaira(item.price);
      if (descEl) descEl.textContent = item.description;
      if (flagEl) flagEl.style.display = item.popular ? 'inline-flex' : 'none';
      if (photoEl) {
        photoEl.classList.remove('is-loaded');
        if (item.image) {
          photoEl.src = 'assets/images/menu/' + item.image;
          CE.utils.wirePhotoFade(iconEl);
        } else {
          photoEl.removeAttribute('src');
        }
      }

      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      document.body.classList.add('nav-open');
      document.addEventListener('keydown', onKeydown);
      window.setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 50);
    }

    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      currentItem = null;
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (!currentItem) return;
        CE.cart.addItem(currentItem.id);
        showToast(currentItem.name + ' added to cart');
        close();
      });
    }

    if (orderBtn) {
      orderBtn.addEventListener('click', function () {
        if (!currentItem) return;
        var msg = 'Hello ' + CONFIG.brandName + '! I would like to order:\n\n1x ' + currentItem.name + ' (' + CE.formatNaira(currentItem.price) + ')\n\nPlease confirm. Thank you!';
        openExternal(buildWhatsAppUrl(msg));
      });
    }

    // Event delegation: any element with [data-open-item] opens the modal
    // (but a click that lands on the nested add-to-cart button should not also open it)
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-add-item]')) return;
      var trigger = e.target.closest ? e.target.closest('[data-open-item]') : null;
      if (!trigger) return;
      var id = trigger.getAttribute('data-open-item');
      var item = CE.getItemById(id);
      if (item) open(item);
    });

    // Keyboard activation for the div-based item cards (role="button")
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var target = e.target;
      if (target && target.matches && target.matches('[role="button"][data-open-item]')) {
        e.preventDefault();
        target.click();
      }
    });
  }

  /* ----------------------------------------------------------------------
   * Quick add-to-cart buttons (event delegation, used on item cards)
   * ------------------------------------------------------------------- */

  function initQuickAdd() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-add-item]') : null;
      if (!btn) return;
      e.stopPropagation();
      var id = btn.getAttribute('data-add-item');
      var item = CE.getItemById(id);
      if (!item) return;
      CE.cart.addItem(id);
      btn.classList.remove('is-added');
      window.requestAnimationFrame(function () { btn.classList.add('is-added'); });
      showToast(item.name + ' added to cart');
    });
  }

  /* ----------------------------------------------------------------------
   * WhatsApp / call CTAs that are data-driven (keeps numbers out of markup)
   * ------------------------------------------------------------------- */

  function initGlobalCtas() {
    qsa('[data-whatsapp-cta]').forEach(function (el) {
      var customMsg = el.getAttribute('data-whatsapp-cta');
      var msg = customMsg && customMsg.length ? customMsg : ('Hello ' + CONFIG.brandName + '! I would like to place an order.');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openExternal(buildWhatsAppUrl(msg));
      });
      el.setAttribute('href', buildWhatsAppUrl(msg));
    });

    qsa('[data-call-cta]').forEach(function (el) {
      el.setAttribute('href', 'tel:' + CONFIG.phoneNumber);
    });

    qsa('[data-directions-cta]').forEach(function (el) {
      el.setAttribute('href', 'https://maps.google.com/?q=' + CONFIG.lat + ',' + CONFIG.lng);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });

    qsa('[data-phone-display]').forEach(function (el) { el.textContent = CONFIG.phoneDisplay; });
  }

  /* ----------------------------------------------------------------------
   * Click-to-load map embed (privacy-friendly: no third-party request
   * until the person explicitly asks to see the map)
   * ------------------------------------------------------------------- */

  function initMapLoader() {
    var wrap = qs('.map-frame-wrap');
    if (!wrap) return;
    var btn = qs('.map-load-btn', wrap);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=' + CONFIG.lat + ',' + CONFIG.lng + '&z=16&output=embed';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.title = CONFIG.brandName + ' location map';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  }

  /* ----------------------------------------------------------------------
   * Service worker registration (PWA)
   * ------------------------------------------------------------------- */

  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        /* registration failure should never block the page */
      });
    });
  }

  function initFooterYear() {
    var el = qs('#current-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initMobileNav();
    initActiveNav();
    initFooterYear();
    syncCartBadges();
    initItemModal();
    initQuickAdd();
    initGlobalCtas();
    initMapLoader();
    initServiceWorker();
    CE.cart.onChange(syncCartBadges);

    if (typeof window.ChillExpressPageInit === 'function') {
      window.ChillExpressPageInit();
    }
  });
})();
