// ==================== HEADER SCROLL EFFECT ====================
const header = document.getElementById('header');

function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ==================== MOBILE MENU ====================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

let menuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('hidden', !menuOpen);

    if (menuOpen) {
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
});

// ==================== SCROLL REVEAL ====================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ==================== FAQ ACCORDION ====================
document.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
        });

        // Open clicked (if it wasn't already open)
        if (!isActive) {
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ==================== STICKY MOBILE CTA ====================
const stickyCta = document.getElementById('sticky-cta');
if (stickyCta) {
    const updateStickyCta = () => {
        stickyCta.classList.toggle('visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    updateStickyCta();
}

// ==================== AMBIENT SIDE GLOW ====================
// On the home page (hero has a background video) the glow fades in after the
// user scrolls past the hero so the video isn't tinted. On other pages there's
// no video to protect, so the glow shows from the start and just fades in via
// the CSS opacity transition.
const sideGlows = document.querySelectorAll('.side-glow');
if (sideGlows.length) {
    const hasHeroVideo = document.querySelector('section video') !== null;
    if (hasHeroVideo) {
        const updateSideGlows = () => {
            const show = window.scrollY > window.innerHeight * 0.85;
            sideGlows.forEach(g => g.classList.toggle('visible', show));
        };
        window.addEventListener('scroll', updateSideGlows, { passive: true });
        updateSideGlows();
    } else {
        // Defer one frame so the initial opacity:0 paints first and the
        // transition to opacity:1 actually runs (instead of snapping on).
        requestAnimationFrame(() => {
            sideGlows.forEach(g => g.classList.add('visible'));
        });
    }
}

// ==================== REVIEW READ MORE TOGGLE ====================
document.querySelectorAll('.review-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.parentElement;
        const collapsed = card.querySelector('.review-collapsed');
        const expanded = card.querySelector('.review-expanded');
        const isExpanded = !expanded.classList.contains('hidden');
        if (isExpanded) {
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

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
