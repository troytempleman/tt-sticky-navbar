// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const searchToggle = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');
const toggles = document.querySelectorAll('.arrow-toggle');

const setKeyboardMode = (isKeyboard) => {
  document.body.classList.toggle('using-keyboard', isKeyboard);
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') setKeyboardMode(true);
});

document.addEventListener('mousedown', () => setKeyboardMode(false));
document.addEventListener('touchstart', () => setKeyboardMode(false));

const setMobileMenuFocusability = (isOpen) => {
  const isMobile = window.innerWidth <= 768;
  const focusables = navMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  if (!isMobile) {
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
    } else if (el.dataset.origTabindex) {
      el.setAttribute('tabindex', el.dataset.origTabindex);
      delete el.dataset.origTabindex;
    } else {
      el.removeAttribute('tabindex');
    }
  });
};

const getMobileMenuFocusables = () => {
  return Array.from(navMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]'))
    .filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');
};

const focusFirstMobileItem = () => {
  const items = getMobileMenuFocusables();
  if (items.length) items[0].focus();
};
    
const keepFocusInMobileMenu = (e) => {
  if (window.innerWidth > 768 || !navMenu.classList.contains('active')) return;
  if (e.target === hamburger) return;
  if (!navMenu.contains(e.target)) {
    focusFirstMobileItem();
  }
};

const closeAllSubmenus = () => {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('is-open'));
  document.querySelectorAll('.arrow-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
};

// Toggle Submenus
const toggleSubmenu = (btn) => {
  const parent = btn.parentElement;
  const isOpen = parent.classList.contains('is-open');
  closeAllSubmenus();
  if (!isOpen) {
    parent.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  }
};

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

// Desktop Search Animation
searchToggle.addEventListener('click', (e) => {
  if (window.innerWidth > 768) {
    e.stopPropagation();
    searchInput.classList.toggle('active');
    searchToggle.setAttribute('aria-expanded', searchInput.classList.contains('active') ? 'true' : 'false');
    if (searchInput.classList.contains('active')) searchInput.focus();
  }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
  setMobileMenuFocusability(navMenu.classList.contains('active'));
  if (navMenu.classList.contains('active') && window.innerWidth <= 768) {
    requestAnimationFrame(() => focusFirstMobileItem());
  }
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
    setMobileMenuFocusability(navMenu.classList.contains('active'));
    if (navMenu.classList.contains('active') && window.innerWidth <= 768) {
      requestAnimationFrame(() => focusFirstMobileItem());
    }
  }
});

// Global Click-away
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-item')) {
    closeAllSubmenus();
  }
  if (window.innerWidth > 768 && !document.getElementById('search-wrapper').contains(e.target)) {
    searchInput.classList.remove('active');
    searchToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllSubmenus();
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      setMobileMenuFocusability(false);
      hamburger.focus();
    }
    searchInput.classList.remove('active');
    searchToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  if (window.innerWidth > 768 || !navMenu.classList.contains('active')) return;

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

document.addEventListener('focusin', keepFocusInMobileMenu);

window.addEventListener('resize', () => {
  setMobileMenuFocusability(navMenu.classList.contains('active'));
});

setMobileMenuFocusability(navMenu.classList.contains('active'));
