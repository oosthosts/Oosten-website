/**
 * Main JavaScript — James D. Oosten, MD Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Set current year in footer ---
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Mobile navigation toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
        });

        // Close the panel once an actual destination link is tapped.
        navMenu.querySelectorAll('.dropdown-link, li:not(.nav-item-dropdown) > .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Mobile: tap a parent item to expand its submenu downward ---
    // Desktop keeps the CSS :hover behaviour; below 768px the parent link
    // becomes a toggle so the submenu can never be opened off-screen.
    const isMobileNav = () => window.matchMedia('(max-width: 768px)').matches;

    document.querySelectorAll('.nav-item-dropdown > .nav-link').forEach(parent => {
        parent.addEventListener('click', (e) => {
            if (!isMobileNav()) return;
            e.preventDefault();
            const li = parent.parentElement;
            const wasOpen = li.classList.contains('open');
            document.querySelectorAll('.nav-item-dropdown.open').forEach(o => o.classList.remove('open'));
            li.classList.toggle('open', !wasOpen);
        });
    });

    // Reset mobile submenu state when returning to desktop widths
    window.addEventListener('resize', () => {
        if (!isMobileNav()) {
            document.querySelectorAll('.nav-item-dropdown.open').forEach(o => o.classList.remove('open'));
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // --- Active nav link on scroll ---
    // Only in-page (#hash) links participate; cross-page links keep whatever
    // .active the page itself set, so interior pages stay highlighted.
    const sections = document.querySelectorAll('section[id]');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'))
        .filter(l => (l.getAttribute('href') || '').startsWith('#'));

    function updateActiveNav() {
        if (!navLinks.length) return;
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Hero photo handling ---
    const heroPhoto = document.getElementById('heroPhoto');
    const placeholder = document.getElementById('photoPlaceholder');

    if (heroPhoto && placeholder) {
        heroPhoto.addEventListener('error', () => {
            heroPhoto.style.display = 'none';
            placeholder.style.display = 'flex';
        });

        heroPhoto.addEventListener('load', () => {
            heroPhoto.style.display = 'block';
            placeholder.style.display = 'none';
        });

        // If image src is placeholder or empty, show placeholder
        if (!heroPhoto.src || heroPhoto.src.includes('placeholder')) {
            heroPhoto.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }

    // --- Filter chips that target a named grid (e.g. the protocols grid) ---
    // resources.js only wires up chips WITHOUT data-target; this handles the rest.
    const targetedChips = document.querySelectorAll('.filter-btn[data-target]');
    targetedChips.forEach(btn => {
        btn.addEventListener('click', () => {
            const gridId = btn.dataset.target;
            const grid = document.getElementById(gridId);
            if (!grid) return;

            document.querySelectorAll(`.filter-btn[data-target="${gridId}"]`)
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            grid.querySelectorAll('.resource-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
            });
        });
    });

    // --- Smooth reveal on scroll (intersection observer) ---
    const revealElements = document.querySelectorAll('.timeline-item, .pillar, .interest-card, .resource-card, .video-card, .disclosure-box');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
});
