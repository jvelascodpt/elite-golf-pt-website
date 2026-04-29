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

function updateStickyCta() {
    if (window.scrollY > 600) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateStickyCta, { passive: true });
updateStickyCta();

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
