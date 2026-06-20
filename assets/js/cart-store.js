/**
 * Chill Express — cart store
 * Persists to localStorage so the cart survives navigation between pages.
 * Defensive JSON parsing throughout — never trusts stored data blindly.
 */
(function (window) {
  'use strict';

  var STORAGE_KEY = 'chillexpress_cart_v1';
  var listeners = [];

  function readRaw() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (line) {
        return line && typeof line.id === 'string' && Number.isFinite(line.qty) && line.qty > 0;
      });
    } catch (err) {
      return [];
    }
  }

  function writeRaw(lines) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (err) {
      /* localStorage unavailable (private mode / quota) — fail silently, cart just won't persist */
    }
    notify();
  }

  function notify() {
    var snapshot = getLines();
    listeners.forEach(function (fn) {
      try { fn(snapshot); } catch (err) { /* listener error must not break the store */ }
    });
  }

  function getLines() {
    return readRaw();
  }

  function getDetailedLines() {
    var CE = window.ChillExpress;
    return getLines().map(function (line) {
      var item = CE.getItemById(line.id);
      if (!item) return null;
      return { item: item, qty: line.qty };
    }).filter(Boolean);
  }

  function addItem(id) {
    var lines = readRaw();
    var existing = lines.find(function (l) { return l.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      lines.push({ id: id, qty: 1 });
    }
    writeRaw(lines);
  }

  function setQty(id, qty) {
    var lines = readRaw();
    if (qty <= 0) {
      lines = lines.filter(function (l) { return l.id !== id; });
    } else {
      var existing = lines.find(function (l) { return l.id === id; });
      if (existing) existing.qty = qty;
    }
    writeRaw(lines);
  }

  function decrementItem(id) {
    var lines = readRaw();
    var existing = lines.find(function (l) { return l.id === id; });
    if (!existing) return;
    if (existing.qty > 1) {
      existing.qty -= 1;
      writeRaw(lines);
    } else {
      removeItem(id);
    }
  }

  function removeItem(id) {
    var lines = readRaw().filter(function (l) { return l.id !== id; });
    writeRaw(lines);
  }

  function clear() {
    writeRaw([]);
  }

  function count() {
    return readRaw().reduce(function (sum, l) { return sum + l.qty; }, 0);
  }

  function total() {
    return getDetailedLines().reduce(function (sum, l) { return sum + l.item.price * l.qty; }, 0);
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  // Keep cart in sync across open tabs/pages
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) notify();
  });

  window.ChillExpress = window.ChillExpress || {};
  window.ChillExpress.cart = {
    getLines: getLines,
    getDetailedLines: getDetailedLines,
    addItem: addItem,
    setQty: setQty,
    decrementItem: decrementItem,
    removeItem: removeItem,
    clear: clear,
    count: count,
    total: total,
    onChange: onChange
  };
})(window);
