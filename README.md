# FitUp

FitUp is a premium fitness and wellness platform designed with a modern, editorial aesthetic. This project focuses on delivering a sophisticated user experience with clean code and high performance.

## Technology Stack
- HTML5
- CSS3 (Vanilla, custom properties)
- Vanilla JavaScript (ES6+)

No frameworks or external UI libraries are used in this project to ensure a lightweight and maintainable codebase.

## Folder Structure
```text
fitup/
├── index.html
├── css/             # Modular CSS files
├── js/              # Modular JavaScript files
├── assets/          # Images, icons, and logos
└── README.md
```

## Development Phases
- **Phase 0:** Project Foundation & Architecture (Current)
- **Phase 1-X:** Implementation of individual sections (Navbar, Hero, Why FitUp, Meals, Yoga, Events, Footer)

## How to Run Locally
Since this is a vanilla HTML/CSS/JS project, you can simply serve the project directory using any local development server. 
For example, using Python or Node.js:
- Python 3: `python -m http.server 8000`
- Node.js (npx): `npx serve`
- Or use the "Live Server" extension in VS Code.

## Architecture Decisions
- **CSS Modularity:** Each section has its own CSS file to prevent conflicts and ensure maintainability.
- **Variables:** A global design system is established in `variables.css`.
- **Responsive Design:** Breakpoints are managed centrally, adopting a mobile-responsive approach.
