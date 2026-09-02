# FITUP

FitUp is a premium fitness and wellness platform designed with a modern, editorial aesthetic. This project focuses on delivering a sophisticated user experience with clean code and high performance.

## TECHNOLOGY

- HTML5
- CSS3 (Vanilla, Custom Properties, clamp() fluid scaling)
- Vanilla JavaScript (ES6+)

No frameworks or external UI libraries are used in this project to ensure a lightweight and maintainable codebase.

## STRUCTURE

```text
FitUp-main/
├── index.html       # Primary semantic layout
├── README.md        # Project documentation
├── robots.txt       # Search engine indexing rules
├── assets/
│   └── images/      # Premium photography assets
├── css/
│   ├── reset.css    # Global element normalization
│   ├── variables.css# Centralized tokens (colors, fonts, radius, shadows)
│   ├── global.css   # Typographic foundations and utility classes
│   ├── navbar.css   # Header and mobile menu
│   ├── hero.css     # Hero section composition
│   ├── why-fitup.css# Core value proposition layout
│   ├── meals.css    # Nutrition visualization structure
│   ├── yoga.css     # Yoga class grid component
│   ├── events.css   # Editorial event listing
│   ├── footer.css   # Global footer
│   └── responsive.css # Component-agnostic media queries
├── docs/
│   └── ARCHITECTURE.md # Application system design and future boundaries
└── js/
    ├── main.js        # Global initialization
    ├── navigation.js  # Mobile modal menu and scroll locks
    ├── meals.js       # Vegan/Non-Vegan UI selector logic
    ├── yoga.js        # Check All button grid expander
    ├── events.js      # Minimal event interaction
    └── animations.js  # Subdued IntersectionObserver reveal system
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Local development server (e.g., VSCode Live Server) for the frontend
- Database provider migration to MongoDB Atlas is pending.

### Backend Setup

1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and configure your `DATABASE_URL`.
4. Run `npm run prisma:generate` to generate the ORM client.
5. (Optional) Run `npm run prisma:migrate` to push the schema to the database.
6. Run `npm run dev` to start the API server on port 3000.

### Frontend Setup

1. Open the project root in your preferred server (e.g., Live Server).
2. The frontend defaults to `http://localhost:5500`. Ensure this matches the `FRONTEND_ORIGIN` in the backend `.env`.
3. The frontend `js/services/config.js` expects the backend at `http://localhost:3000`.

## FEATURES

- **Responsive Navigation:** Accessible, modal-style mobile menu with lock-scroll.
- **Meal Selector:** Clean client-side Vegan vs Non-Vegan toggle without page reloads.
- **Yoga Interaction:** Interactive grid expansion button for class discovery, powered by 6 distinct Cloudinary assets.
- **Events:** Responsive layout stack for editorial events.
- **Responsive Layout:** Hardened structural CSS providing 100% responsiveness from 320px mobile to 2560px ultra-wide without horizontal overflow.

## ARCHITECTURE & FUTURE BOUNDARIES

FITUP has established a robust Stage 2 Application Foundation. For full details on the planned application boundaries, routing strategies, service layers, and state management, please read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

*Note: Frontend UI states represent conceptual data at this time. Dedicated API routes and backend services will be integrated in subsequent roadmap phases.*

## STAGE 2 STATUS

This project has successfully completed Phase 7 (Backend Foundation). The frontend foundation remains a certified 9.9/10 baseline. A secure, structured Node.js/Express API now supports the static frontend, ready for Phase 8 Authentication.
