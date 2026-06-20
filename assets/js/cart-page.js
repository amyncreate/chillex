/**
 * Chill Express — cart page render logic
 */
(function () {
  'use strict';

  window.ChillExpressPageInit = function () {
    var CE = window.ChillExpress;
    var qs = CE.utils.qs;
    var qsa = CE.utils.qsa;
    var escapeHtml = CE.utils.escapeHtml;
    var openExternal = CE.utils.openExternal;
    var buildWhatsAppUrl = CE.utils.buildWhatsAppUrl;

    var emptyView = qs('#cart-empty-view');
    var filledView = qs('#cart-filled-view');
    var listEl = qs('#cart-list');
    var countLabel = qs('#cart-count-label');
    var totalLabel = qs('#cart-total-label');
    var clearBtn = qs('#cart-clear-btn');
    var sendBtn = qs('#cart-send-btn');

    if (!listEl) return;

    function render() {
      var lines = CE.cart.getDetailedLines();
      var hasItems = lines.length > 0;

      if (emptyView) emptyView.style.display = hasItems ? 'none' : 'block';
      if (filledView) filledView.style.display = hasItems ? 'block' : 'none';
      if (!hasItems) return;

      var totalQty = lines.reduce(function (sum, l) { return sum + l.qty; }, 0);
      if (countLabel) countLabel.textContent = totalQty + (totalQty === 1 ? ' item' : ' items');
      if (totalLabel) totalLabel.textContent = CE.formatNaira(CE.cart.total());

      listEl.innerHTML = lines.map(function (line) {
        var item = line.item;
        var meta = CE.CATEGORY_META[item.category] || { icon: 'icon-wrap', tint: 'cat-shawarma' };
        var photoHTML = item.image
          ? '<img class="item-photo" src="assets/images/menu/' + escapeHtml(item.image) + '" alt="" loading="lazy">'
          : '';
        return (
          '<div class="cart-item" data-line-id="' + escapeHtml(item.id) + '">' +
            '<span class="cart-item-icon ' + meta.tint + '">' +
              '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#' + meta.icon + '"></use></svg>' +
              photoHTML +
            '</span>' +
            '<span class="cart-item-info">' +
              '<span class="cart-item-name">' + escapeHtml(item.name) + '</span>' +
              '<span class="cart-item-price">' + CE.formatNaira(item.price) + '</span>' +
            '</span>' +
            '<span class="qty-stepper">' +
              '<button type="button" class="qty-remove" data-id="' + escapeHtml(item.id) + '" aria-label="Decrease quantity of ' + escapeHtml(item.name) + '">' +
                '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#icon-minus"></use></svg>' +
              '</button>' +
              '<span class="qty-value" aria-live="polite">' + line.qty + '</span>' +
              '<button type="button" class="qty-add" data-id="' + escapeHtml(item.id) + '" aria-label="Increase quantity of ' + escapeHtml(item.name) + '">' +
                '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#icon-plus"></use></svg>' +
              '</button>' +
            '</span>' +
          '</div>'
        );
      }).join('');
      CE.utils.wirePhotoFade(listEl);
    }

    listEl.addEventListener('click', function (e) {
      var addBtn = e.target.closest ? e.target.closest('.qty-add') : null;
      var removeBtn = e.target.closest ? e.target.closest('.qty-remove') : null;
      if (addBtn) {
        CE.cart.addItem(addBtn.getAttribute('data-id'));
        render();
        return;
      }
      if (removeBtn) {
        CE.cart.decrementItem(removeBtn.getAttribute('data-id'));
        render();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        CE.cart.clear();
        render();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var lines = CE.cart.getDetailedLines();
        if (!lines.length) return;
        var orderText = lines.map(function (l) {
          return l.qty + 'x ' + l.item.name + ' (' + CE.formatNaira(l.item.price) + ')';
        }).join('\n');
        var msg = 'Hello ' + CE.CONFIG.brandName + '!\n\nI would like to place an order:\n\n' + orderText +
          '\n\nTotal: ' + CE.formatNaira(CE.cart.total()) + '\n\nPlease confirm my order. Thank you!';
        openExternal(buildWhatsAppUrl(msg));
      });
    }

    CE.cart.onChange(render);
    render();
  };
})();
