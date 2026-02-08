# Notes

This project is intended as a reusable template for projects with a sticky navbar. No external libraries are used, only vanilla HTML, CSS, and JS.

## Accessibility + Interaction

- Skip link for quick navigation to main content.
- ARIA attributes for menu and submenu toggles.
- Keyboard-only focus styles using `:focus-visible` with a `using-keyboard` fallback.
- Mobile menu focus trap and Escape-to-close support.

## Styling Conventions

- Design tokens live in `:root` for colors, spacing, and typography.
- Mobile-first layout with desktop overrides at 769px.
