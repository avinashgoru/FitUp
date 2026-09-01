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
│   └── images/      # Premium photography assets (hero.jpg, why-fitup.jpg, meals.jpg)
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
└── js/
    ├── main.js        # Global initialization
    ├── navigation.js  # Mobile modal menu and scroll locks
    ├── meals.js       # Vegan/Non-Vegan UI selector logic
    ├── yoga.js        # Check All button grid expander
    ├── events.js      # Minimal event interaction
    └── animations.js  # Subdued IntersectionObserver reveal system
```

## RUNNING LOCALLY
Since this is a vanilla HTML/CSS/JS project, you can simply serve the project directory using any local development server. 
For example, using Python or Node.js:
- Node.js (npx): `npx serve`
- Python 3: `python -m http.server 8000`
- Or use the "Live Server" extension in VS Code.

## FEATURES
- **Responsive Navigation:** Accessible, modal-style mobile menu with lock-scroll.
- **Meal Selector:** Clean client-side Vegan vs Non-Vegan toggle without page reloads.
- **Yoga Interaction:** Interactive grid expansion button for class discovery.
- **Events:** Responsive layout stack for editorial events.
- **Responsive Layout:** Hardened structural CSS providing 100% responsiveness from 320px mobile to 2560px ultra-wide without horizontal overflow.

## KNOWN LIMITATIONS
- **Yoga Assets:** Dedicated physical photography assets for all 6 Yoga cards are not currently present in the workspace. To satisfy layout constraints without producing broken grid visuals, the section elegantly loops the existing premium fitness photography (`hero.jpg`, `why-fitup.jpg`) until distinct assets are provided.
- **Static Form Actions:** The "Contact Us" and "Reserve Your Spot" buttons do not have backend endpoints connected.
