/**
 * Project: TT Sticky Navbar
 * File: js/script.js
 * Description: Behavior for menu, submenu, search, and accessibility.
 * Author: Troy Templeman
 * Date: February 8, 2026
 * License: MIT (https://opensource.org/licenses/MIT)
 */

// DOM references
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const searchToggle = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');
const toggles = document.querySelectorAll('.arrow-toggle');
const focusableSelector = 'a, button, input, select, textarea, [tabindex]';
const isMenuOpen = () => navMenu.classList.contains('active');

// Shared helpers
const isMobile = () => window.innerWidth <= 768;
const setKeyboardMode = (isKeyboard) => document.body.classList.toggle('using-keyboard', isKeyboard);
const setAriaExpanded = (el, expanded) => el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
const closeSearch = () => {
    searchInput.classList.remove('active');
    setAriaExpanded(searchToggle, false);
};

// Mobile menu focus management
const setMobileMenuFocusability = (isOpen) => {
    const focusables = navMenu.querySelectorAll(focusableSelector);
    if (!isMobile()) {
        navMenu.removeAttribute('aria-hidden');
        focusables.forEach(el => {
            if (el.dataset.origTabindex) {
                el.setAttribute('tabindex', el.dataset.origTabindex);
                delete el.dataset.origTabindex;
            } else {
                el.removeAttribute('tabindex');
            }
        });
        return;
    }

    navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    focusables.forEach(el => {
        if (!isOpen) {
            if (el.hasAttribute('tabindex')) {
                el.dataset.origTabindex = el.getAttribute('tabindex');
            }
            el.setAttribute('tabindex', '-1');
            return;
        }
        if (el.dataset.origTabindex) {
            el.setAttribute('tabindex', el.dataset.origTabindex);
            delete el.dataset.origTabindex;
        } else {
            el.removeAttribute('tabindex');
        }
    });
};

// Get focusable items in the mobile menu
const getMobileMenuFocusables = () => Array.from(navMenu.querySelectorAll(focusableSelector))
    .filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');

// Focus the first available item when opening the mobile menu
const focusFirstMobileItem = () => {
    const items = getMobileMenuFocusables();
    if (items.length) items[0].focus();
};

// Toggle mobile menu state (visual + accessibility)
const setMobileMenuState = (open) => {
    navMenu.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    setAriaExpanded(hamburger, open);
    setMobileMenuFocusability(open);
    if (open && isMobile()) requestAnimationFrame(focusFirstMobileItem);
};

const toggleMenu = () => setMobileMenuState(!isMenuOpen());

// Submenu controls
const closeAllSubmenus = () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('is-open'));
    document.querySelectorAll('.arrow-toggle').forEach(t => setAriaExpanded(t, false));
};

// Toggle a single submenu
const toggleSubmenu = (btn) => {
    const parent = btn.parentElement;
    const isOpen = parent.classList.contains('is-open');
    closeAllSubmenus();
    if (!isOpen) {
        parent.classList.add('is-open');
        setAriaExpanded(btn, true);
    }
};

// Submenu toggle events
toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSubmenu(btn);
    });
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSubmenu(btn);
        }
    });
});

// Search controls
searchToggle.addEventListener('click', (e) => {
    if (isMobile()) return;
    e.stopPropagation();
    const active = searchInput.classList.toggle('active');
    setAriaExpanded(searchToggle, active);
    if (active) searchInput.focus();
});

// Mobile menu controls
hamburger.addEventListener('click', toggleMenu);

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

// Global click/key handling
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) closeAllSubmenus();
    if (!isMobile() && !document.getElementById('search-wrapper').contains(e.target)) closeSearch();
});

// Keyboard handling (focus mode, escape, focus trap)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') setKeyboardMode(true);

    if (e.key === 'Escape') {
        closeAllSubmenus();
        if (isMenuOpen()) {
            setMobileMenuState(false);
            hamburger.focus();
        }
        closeSearch();
    }

    if (e.key !== 'Tab' || !isMenuOpen() || !isMobile()) return;

    const items = getMobileMenuFocusables();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (active !== hamburger && !navMenu.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
    }

    if (e.shiftKey) {
        if (active === first) {
            e.preventDefault();
            hamburger.focus();
        } else if (active === hamburger) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (active === hamburger) {
            e.preventDefault();
            first.focus();
        } else if (active === last) {
            e.preventDefault();
            hamburger.focus();
        }
    }
});

// Focus mode + traps
document.addEventListener('mousedown', () => setKeyboardMode(false));
document.addEventListener('touchstart', () => setKeyboardMode(false));

// Keep focus inside the mobile menu when open
document.addEventListener('focusin', (e) => {
    if (!isMobile() || !isMenuOpen()) return;
    if (e.target === hamburger) return;
    if (!navMenu.contains(e.target)) focusFirstMobileItem();
});

// Initialization + resize
window.addEventListener('resize', () => {
    setMobileMenuFocusability(isMenuOpen());
});

// Initialize focusability on load
setMobileMenuFocusability(isMenuOpen());
