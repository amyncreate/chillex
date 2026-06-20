/**
 * Chill Express — home page render logic
 */
(function () {
  'use strict';

  window.ChillExpressPageInit = function () {
    var CE = window.ChillExpress;
    var qs = CE.utils.qs;
    var escapeHtml = CE.utils.escapeHtml;

    /* Feature strip */
    var featureGrid = qs('#feature-grid');
    var featureTints = ['tint-1', 'tint-2', 'tint-3', 'tint-4'];
    if (featureGrid) {
      featureGrid.innerHTML = CE.FEATURES.map(function (f, idx) {
        return (
          '<div class="feature-card">' +
            '<span class="feature-icon ' + featureTints[idx % featureTints.length] + '">' +
              '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#' + f.icon + '"></use></svg>' +
            '</span>' +
            '<p class="feature-title">' + escapeHtml(f.title) + '</p>' +
            '<p class="feature-sub">' + escapeHtml(f.sub) + '</p>' +
          '</div>'
        );
      }).join('');
    }

    /* Featured items */
    var featuredGrid = qs('#featured-grid');
    if (featuredGrid) {
      var featured = CE.MENU_ITEMS.filter(function (i) { return i.featured; }).slice(0, 6);
      featuredGrid.innerHTML = featured.map(CE.utils.itemCardHTML).join('');
      CE.utils.wirePhotoFade(featuredGrid);
    }

    /* Testimonials */
    var testimonialRail = qs('#testimonial-rail');
    if (testimonialRail) {
      var avatarTints = ['tint-1', 'tint-2', 'tint-3', 'tint-4', 'tint-5'];
      testimonialRail.innerHTML = CE.TESTIMONIALS.map(function (t, idx) {
        var stars = '';
        for (var s = 0; s < 5; s++) {
          stars += '<svg class="icon" aria-hidden="true"><use href="assets/icons/icons.svg#icon-star"></use></svg>';
        }
        return (
          '<div class="testimonial-card">' +
            '<div class="testimonial-top">' +
              '<span class="avatar ' + avatarTints[idx % avatarTints.length] + '">' + escapeHtml(t.initials) + '</span>' +
              '<div>' +
                '<p class="testimonial-name">' + escapeHtml(t.name) + '</p>' +
                '<div class="testimonial-stars" aria-hidden="true">' + stars + '</div>' +
              '</div>' +
            '</div>' +
            '<p class="testimonial-text">&ldquo;' + escapeHtml(t.text) + '&rdquo;</p>' +
          '</div>'
        );
      }).join('');
    }
  };
})();
