# TT Sticky Navbar

TT Sticky Navbar is a small front-end demo project showcasing a sticky, responsive navbar with dropdown menus and a mobile hamburger toggle.

## About

This project demonstrates a precision grid-based sticky navigation bar that maintains strict alignment and consistent spacing across desktop and mobile devices. The navbar features folder-tab styled navigation items, dropdown menus, a responsive search interface, and accessibility-first keyboard behavior.

## Project Structure

```
tt-sticky-navbar/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── docs/
│   └── notes.md
└── readme.md
```

## Features

- Sticky navigation that stays at the top while scrolling
- Folder-tab styled navigation items with borders
- Dropdown submenus that align with header bottom
- Mobile hamburger menu with keyboard focus trap
- Search bar that expands on desktop, integrated on mobile
- Pure black text and borders with #2271b1 hover states
- Keyboard-only focus styles with `:focus-visible` fallbacks
- Skip link for quick content access
- Tokenized CSS variables for colors, spacing, and typography
- Mobile-first CSS with desktop overrides

## Usage

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Modify `css/styles.css` or `js/script.js` to customize the navbar.

## Demo (GitHub Pages)

This repo includes a demo page in `docs/index.html`. To publish it:

1. Go to **Settings → Pages** in GitHub.
2. Set **Source** to the `main` branch and **/docs** folder.
3. Save, then use the URL GitHub provides.

## Browser Support

Works on all modern browsers including Chrome, Firefox, Safari, and Edge.
