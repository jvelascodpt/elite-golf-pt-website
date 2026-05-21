/*
 * Live Google Reviews integration for Elite Golf PT.
 * Pulls reviews from the Google Places API (Place Details) and renders them
 * into the testimonials section. Caches results in localStorage for 6 hours
 * so each visitor triggers at most one API call. If the API call fails or is
 * blocked, the hardcoded fallback reviews already in the HTML remain visible.
 *
 * The Maps JS API script tag in index.html names this file's exported
 * `initGoogleReviews` as its callback.
 */
(function () {
    var PLACE_ID = 'ChIJ85dvEAMB3IARxdN1qYKsq4A';
    var CACHE_KEY = 'egpt_reviews_v1';
    var CACHE_TTL_MS = 6 * 60 * 60 * 1000;
    var MAX_REVIEWS = 3;
    var TRUNCATE_AT = 280;

    var STAR_SVG = '<svg class="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

    var GOOGLE_G_SVG =
        '<svg class="w-2.5 h-2.5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>' +
        '<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>' +
        '<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>' +
        '<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>' +
        '</svg>';

    var CHECK_SVG = '<svg class="w-3.5 h-3.5 text-brand-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

    var AVATAR_COLORS = ['bg-brand-700', 'bg-gold-600', 'bg-brand-600'];

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function truncate(s, max) {
        if (s.length <= max) return s;
        return s.substring(0, max).replace(/\s+\S*$/, '') + '…';
    }

    function readCache() {
        try {
            var raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (!parsed || !parsed.timestamp) return null;
            if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function writeCache(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: data }));
        } catch (e) {}
    }

    function buildCard(review, i) {
        var name = review.author_name || 'Google User';
        var initial = name.charAt(0).toUpperCase() || '?';
        var color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        var date = review.relative_time_description || '';
        var text = review.text || '';
        var rating = Math.max(0, Math.min(5, review.rating || 5));
        var hasPhoto = !!(review.profile_photo_url && review.profile_photo_url.indexOf('http') === 0);

        var stars = '';
        for (var s = 0; s < rating; s++) stars += STAR_SVG;

        var avatarHtml = hasPhoto
            ? '<img src="' + escapeHtml(review.profile_photo_url) + '" alt="" referrerpolicy="no-referrer" class="w-10 h-10 rounded-full object-cover">'
            : '<div class="w-10 h-10 rounded-full ' + color + ' flex items-center justify-center text-white font-medium text-sm">' + escapeHtml(initial) + '</div>';

        var isLong = text.length > TRUNCATE_AT;
        var textHtml;
        if (isLong) {
            textHtml =
                '<p class="text-white/60 text-sm leading-relaxed review-collapsed">&ldquo;' + escapeHtml(truncate(text, TRUNCATE_AT)) + '&rdquo;</p>' +
                '<p class="text-white/60 text-sm leading-relaxed review-expanded hidden">&ldquo;' + escapeHtml(text) + '&rdquo;</p>' +
                '<button type="button" class="review-toggle text-brand-400 hover:text-brand-300 text-xs font-medium uppercase tracking-wider mt-3 self-start transition-colors duration-200">Read more</button>';
        } else {
            textHtml = '<p class="text-white/60 text-sm leading-relaxed">&ldquo;' + escapeHtml(text) + '&rdquo;</p>';
        }

        var card = document.createElement('div');
        card.className = 'bg-dark-800 border border-white/5 p-6 reveal visible hover:border-brand-500/20 transition-all duration-500 flex flex-col';
        card.innerHTML =
            '<div class="flex items-center gap-3 mb-4">' +
                '<div class="relative flex-shrink-0">' + avatarHtml +
                    '<div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center ring-2 ring-dark-800">' + GOOGLE_G_SVG + '</div>' +
                '</div>' +
                '<div class="min-w-0 flex-1">' +
                    '<div class="flex items-center gap-1.5">' +
                        '<p class="text-sm font-medium text-white truncate">' + escapeHtml(name) + '</p>' + CHECK_SVG +
                    '</div>' +
                    '<p class="text-xs text-white/30">Google Review' + (date ? ' &middot; ' + escapeHtml(date) : '') + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="flex gap-0.5 mb-3">' + stars + '</div>' +
            textHtml;
        return card;
    }

    function wireReadMoreToggles(root) {
        var btns = (root || document).querySelectorAll('.review-toggle');
        btns.forEach(function (btn) {
            if (btn.dataset.wired === '1') return;
            btn.dataset.wired = '1';
            btn.addEventListener('click', function () {
                var card = btn.parentElement;
                var collapsed = card.querySelector('.review-collapsed');
                var expanded = card.querySelector('.review-expanded');
                if (!collapsed || !expanded) return;
                var isOpen = !expanded.classList.contains('hidden');
                if (isOpen) {
                    expanded.classList.add('hidden');
                    collapsed.classList.remove('hidden');
                    btn.textContent = 'Read more';
                } else {
                    expanded.classList.remove('hidden');
                    collapsed.classList.add('hidden');
                    btn.textContent = 'Read less';
                }
            });
        });
    }

    function render(data) {
        if (!data) return;

        var ratingEl = document.querySelector('[data-review-rating]');
        if (ratingEl && typeof data.rating === 'number') {
            ratingEl.textContent = data.rating.toFixed(1);
        }

        if (typeof data.total === 'number') {
            var wrappedEl = document.querySelector('[data-review-count-wrapped]');
            if (wrappedEl) wrappedEl.textContent = '(' + data.total + ')';
            document.querySelectorAll('[data-review-count]').forEach(function (el) {
                el.textContent = data.total;
            });
        }

        var grid = document.querySelector('[data-reviews-grid]');
        if (grid && data.reviews && data.reviews.length > 0) {
            grid.innerHTML = '';
            data.reviews.slice(0, MAX_REVIEWS).forEach(function (review, i) {
                grid.appendChild(buildCard(review, i));
            });
            wireReadMoreToggles(grid);
        }
    }

    // Render cached data immediately if available, before the Maps JS API loads
    var cached = readCache();
    if (cached) render(cached);

    // Called by Maps JS API script tag once google.maps.places is loaded
    window.initGoogleReviews = function () {
        if (cached) return;
        if (!window.google || !google.maps || !google.maps.places) return;

        var service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails(
            { placeId: PLACE_ID, fields: ['rating', 'user_ratings_total', 'reviews'] },
            function (place, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;
                var data = {
                    rating: place.rating || 5.0,
                    total: place.user_ratings_total || 0,
                    reviews: (place.reviews || []).map(function (r) {
                        return {
                            author_name: r.author_name,
                            relative_time_description: r.relative_time_description,
                            text: r.text || '',
                            rating: r.rating || 5,
                            profile_photo_url: r.profile_photo_url || ''
                        };
                    })
                };
                writeCache(data);
                render(data);
            }
        );
    };
})();
