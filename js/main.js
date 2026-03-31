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

        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
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
