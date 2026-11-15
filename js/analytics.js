/* GA4 event tracking for elitegolfphysicaltherapy.com
   The Google tag (G-HGG7VCXDXZ) is loaded in each page's <head>; this file only sends events.
   Clicks are classified automatically from the link itself, so new pages and articles
   are tracked with no extra markup:
     booking_click  - any Acuity scheduling link (booking_type: pt_evaluation | power_assessment | other)
     phone_click    - tel: links
     email_click    - mailto: links
   The contact form sends generate_lead on a successful submit (see index.html).
   Never send form contents or anything a visitor types: page URLs and link types only.
   Design rule: never call preventDefault or delay navigation. */
(function () {
    'use strict';

    function send(name, params) {
        if (typeof window.gtag !== 'function') return;
        var payload = params || {};
        payload.transport_type = 'beacon';
        window.gtag('event', name, payload);
    }

    // Where on the page the click happened: nearest section/header/footer id, else its tag.
    function locationOf(el) {
        var node = el;
        while (node && node !== document.body) {
            if (node.id && /^(SECTION|HEADER|FOOTER|NAV|DIV)$/.test(node.tagName) && node.id !== 'mobile-menu') {
                return node.id;
            }
            if (node.id === 'mobile-menu') return 'mobile_menu';
            if (node.tagName === 'FOOTER') return 'footer';
            node = node.parentElement;
        }
        return 'page';
    }

    function bookingType(href) {
        if (/appointmentType=100302653/.test(href)) return 'power_assessment';
        if (/schedule\/d80e0bff/.test(href)) return 'pt_evaluation';
        return 'other';
    }

    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        var where = locationOf(a);
        var label = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);

        if (/acuityscheduling\.com/.test(href)) {
            send('booking_click', { booking_type: bookingType(href), cta_location: where, cta_text: label });
        } else if (/^tel:/i.test(href)) {
            send('phone_click', { cta_location: where });
        } else if (/^mailto:/i.test(href)) {
            send('email_click', { cta_location: where });
        }
    }, true);

    /* ---------- Scroll depth (25/50/75; GA4 enhanced measurement already records 90%) ---------- */
    var THRESHOLDS = [25, 50, 75];
    var fired = {};
    var ticking = false;

    function pageHeight() {
        var d = document.documentElement, b = document.body;
        return Math.max(b.scrollHeight, d.scrollHeight, b.offsetHeight, d.offsetHeight, d.clientHeight);
    }

    function checkDepth() {
        ticking = false;
        var total = pageHeight();
        if (total <= 0) return;
        var seen = (window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight;
        var pct = (seen / total) * 100;
        for (var i = 0; i < THRESHOLDS.length; i++) {
            var t = THRESHOLDS[i];
            if (pct >= t && !fired[t]) {
                fired[t] = true;
                send('scroll_depth', { percent: t });
            }
        }
        if (fired[THRESHOLDS[THRESHOLDS.length - 1]]) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(checkDepth);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    checkDepth();
})();
