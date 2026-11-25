/*
 * "We're Moving!" announcement popup (new facility at Werk Fitness, from Dec 2, 2026).
 * Self-contained: injects its own styles, so no Tailwind rebuild is needed.
 * Shows once per browser session, on whichever page the visitor lands on.
 * Stops showing automatically after HIDE_AFTER. Delete this file + its <script> tags to retire it.
 */
(function () {
    var HIDE_AFTER = Date.parse('2027-01-15T00:00:00-08:00');
    var KEY = 'egpt-move-2026-seen';
    if (Date.now() >= HIDE_AFTER) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

    // Pages live at the root and in /blog/, so resolve the image relative to this script.
    var src = (document.currentScript && document.currentScript.src) || '';
    var img = src ? src.replace(/js\/move-announcement\.js.*$/, 'images/new-facility.jpg') : 'images/new-facility.jpg';
    var MAPS = 'https://www.google.com/maps/dir/?api=1&destination=1205+W+Morena+Blvd,+San+Diego,+CA+92110';
    var BOOK = 'https://app.acuityscheduling.com/schedule/d80e0bff';

    var css = '' +
        '.mv-back{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;' +
        'background:rgba(5,10,7,.78);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .35s ease}' +
        '.mv-back.mv-in{opacity:1}' +
        '.mv-card{position:relative;width:100%;max-width:520px;max-height:calc(100vh - 32px);overflow:auto;background:#0d1410;color:#fff;' +
        'border:1px solid rgba(201,168,76,.45);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1px rgba(90,226,140,.08);' +
        'transform:translateY(24px) scale(.94);transition:transform .5s cubic-bezier(.2,1.3,.4,1)}' +
        '.mv-in .mv-card{transform:none}' +
        '.mv-x{position:absolute;top:10px;right:10px;z-index:3;width:38px;height:38px;border:0;border-radius:50%;cursor:pointer;' +
        'background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:38px;text-align:center}' +
        '.mv-x:hover,.mv-x:focus-visible{background:#c9a84c;color:#0d1410;outline:none}' +
        '.mv-photo{position:relative;aspect-ratio:612/380;background:#1a1a1a center/cover no-repeat;overflow:hidden}' +
        '.mv-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,20,16,0) 45%,#0d1410 100%)}' +
        '.mv-tag{position:absolute;top:14px;left:14px;z-index:2;padding:6px 14px;background:#5ae28c;color:#0d1410;transform:skewX(-12deg);' +
        'font:800 13px/1 "Barlow Condensed",Impact,sans-serif;letter-spacing:.2em;text-transform:uppercase}' +
        '.mv-tag span{display:inline-block;transform:skewX(12deg)}' +
        '.mv-body{position:relative;z-index:2;margin-top:-64px;padding:0 28px 28px;text-align:center}' +
        '.mv-h{margin:0;font:italic 900 clamp(48px,12vw,72px)/.9 "Barlow Condensed",Impact,sans-serif;text-transform:uppercase;letter-spacing:.005em;' +
        'text-shadow:0 4px 24px rgba(0,0,0,.6)}' +
        '.mv-h em{color:#d4b95f}' +
        '.mv-date{display:inline-block;margin:14px 0 16px;padding:6px 14px;border:1px solid rgba(90,226,140,.5);color:#5ae28c;' +
        'font:700 16px/1.2 "Barlow Condensed",Impact,sans-serif;letter-spacing:.14em;text-transform:uppercase}' +
        '.mv-p{margin:0 0 14px;color:rgba(255,255,255,.75);font:400 15px/1.6 Inter,system-ui,sans-serif}' +
        '.mv-p a{color:#d4b95f;text-decoration:underline;text-underline-offset:3px}' +
        '.mv-p strong{color:#fff;font-weight:600}' +
        '.mv-addr{margin:0 0 22px;color:#fff;font:600 15px/1.5 Inter,system-ui,sans-serif}' +
        '.mv-addr small{display:block;color:rgba(255,255,255,.45);font-weight:400;font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:2px}' +
        '.mv-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}' +
        '.mv-btn{flex:1 1 180px;display:inline-block;padding:13px 18px;text-decoration:none;cursor:pointer;border:0;' +
        'font:800 15px/1 "Barlow Condensed",Impact,sans-serif;letter-spacing:.15em;text-transform:uppercase;transition:background .2s,color .2s}' +
        '.mv-gold{background:#c9a84c;color:#0d1410}.mv-gold:hover{background:#d4b95f}' +
        '.mv-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}.mv-ghost:hover{box-shadow:inset 0 0 0 1px #5ae28c;color:#5ae28c}' +
        '.mv-conf{position:absolute;top:-12px;width:8px;height:14px;opacity:0;z-index:4;pointer-events:none;animation:mv-fall 2.6s ease-in forwards}' +
        '@keyframes mv-fall{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(520px) rotate(720deg)}}' +
        '@media (max-width:420px){.mv-body{padding:0 18px 20px}.mv-date{font-size:14px;letter-spacing:.1em}.mv-p{font-size:14px}}' +
        '.mv-nw{white-space:nowrap}' +
        '@media (prefers-reduced-motion:reduce){.mv-back,.mv-card{transition:none}.mv-conf{display:none}}';

    function show() {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        var back = document.createElement('div');
        back.className = 'mv-back';
        back.innerHTML =
            '<div class="mv-card" role="dialog" aria-modal="true" aria-labelledby="mv-h">' +
            '<button type="button" class="mv-x" aria-label="Close announcement">&times;</button>' +
            '<div class="mv-photo" style="background-image:url(\'' + img + '\')" role="img" aria-label="Our new training facility">' +
            '<div class="mv-tag"><span>Big News</span></div></div>' +
            '<div class="mv-body">' +
            '<h2 class="mv-h" id="mv-h">We&rsquo;re <em>Moving!</em></h2>' +
            '<div class="mv-date">Starting Wednesday, Dec 2nd, 2026</div>' +
            '<p class="mv-p">Elite Golf Physical Therapy has a <strong>new home!</strong> Starting December 2nd, all sessions will take place at ' +
            '<a href="' + MAPS + '" target="_blank" rel="noopener">Werk Fitness Personal Training &ndash; San Diego</a>, 10 minutes south of our original location. ' +
            'We&rsquo;ve got more room to move, train, and swing. <strong>Same one-on-one care, upgraded space.</strong></p>' +
            '<p class="mv-addr"><small>New address</small>1205 W Morena Blvd, <span class="mv-nw">San Diego, CA 92110</span></p>' +
            '<div class="mv-btns">' +
            '<a class="mv-btn mv-gold" href="' + BOOK + '" target="_blank" rel="noopener" data-mv="book">Book a Session</a>' +
            '<a class="mv-btn mv-ghost" href="' + MAPS + '" target="_blank" rel="noopener" data-mv="directions">Get Directions</a>' +
            '</div></div></div>';
        document.body.appendChild(back);

        var card = back.querySelector('.mv-card');
        var closeBtn = back.querySelector('.mv-x');
        var lastFocus = document.activeElement;
        var prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function track(action) {
            if (typeof window.gtag === 'function') window.gtag('event', 'move_popup', { action: action });
        }
        function close() {
            try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
            back.classList.remove('mv-in');
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            setTimeout(function () { back.remove(); style.remove(); }, 350);
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        function onKey(e) {
            if (e.key === 'Escape') { track('dismiss'); close(); }
            if (e.key === 'Tab') { // keep focus inside the dialog
                var f = card.querySelectorAll('a,button');
                var first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        }
        closeBtn.addEventListener('click', function () { track('dismiss'); close(); });
        back.addEventListener('click', function (e) { if (e.target === back) { track('dismiss'); close(); } });
        back.querySelectorAll('[data-mv]').forEach(function (a) {
            a.addEventListener('click', function () { track(a.getAttribute('data-mv')); close(); });
        });
        document.addEventListener('keydown', onKey);

        requestAnimationFrame(function () {
            back.classList.add('mv-in');
            closeBtn.focus({ preventScroll: true });
        });
        track('shown');

        // A quick burst of brand-colored confetti over the card
        var colors = ['#5ae28c', '#c9a84c', '#ffffff', '#d4b95f'];
        for (var i = 0; i < 36; i++) {
            var c = document.createElement('span');
            c.className = 'mv-conf';
            c.style.left = (Math.random() * 100) + '%';
            c.style.background = colors[i % colors.length];
            c.style.animationDelay = (0.25 + Math.random() * 0.7) + 's';
            c.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
            card.appendChild(c);
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
})();
