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

## PHASE 8: FUTURE PRODUCT ARCHITECTURE

### Frontend Architecture

FitUp currently functions as an exceptional presentation-tier static application. The frontend architecture isolates concerns via modular CSS tokens (`variables.css`) and modular vanilla JavaScript files (`meals.js`, `yoga.js`, `events.js`) providing a highly stable ground for future framework adoption or API integration without tearing down the existing DOM structures or UI styling.

### Data Architecture (Conceptual Models)

- **USER:** `id`, `name`, `email`, `preferences`, `savedFavorites`
- **MEAL:** `id`, `name`, `calories`, `dietaryType` (Vegan/Non-Vegan)
- **YOGA_SESSION:** `id`, `title`, `duration`, `image_url`, `description`
- **EVENT:** `id`, `title`, `date`, `location`, `capacity`
- **RESERVATION:** `id`, `user_id`, `event_id`, `status` (Confirmed/Waitlisted)

### Future Backend Boundaries

- **Authentication:** Token-based (JWT) auth boundary protecting a future dashboard.
- **Reservations & Transactions:** Secure server-side processing for Event RSVPs to prevent capacity race conditions.
- **Content APIs:** Delivering dynamic payload responses for `GET /meals`, `GET /yoga`, and `GET /events` allowing non-engineers to publish new content via CMS.

### Future Product Modules

- **User Dashboard & Profile:** A secure routing area reflecting individual progress, personalized meal recommendations, and upcoming RSVP'd events.
- **Favorites System:** Persistent saving logic allowing users to bookmark Yoga classes.
- **Notifications Engine:** Real-time push or email notifications regarding event confirmations.

### Recommended Next Technical Steps

1. **API Integration Readiness:** Introduce a lightweight `fetch` wrapper inside `main.js` to begin mocking API payload ingestion for Meals and Yoga components.
2. **Component Framework Migration (Optional):** If the data surface area grows significantly (e.g. User Dashboards, complex state filtering), consider porting the native DOM components into a lightweight VDOM framework (like Preact or Vue) while 100% preserving the existing CSS architecture.
3. **Database Prototyping:** Stand up a headless CMS or BaaS (e.g. Supabase, Firebase) to convert hardcoded HTML grid items into dynamic collections.

## PHASE 10: DEPLOYMENT & REAL APPLICATION ARCHITECTURE

### Architecture Strategy

To cross the boundary from "Static MVP" to "Real Application", FitUp proposes migrating to **Next.js (App Router)** as the Meta-Framework and **Supabase (PostgreSQL)** as the Backend-as-a-Service (BaaS). This stack allows us to preserve the existing CSS architecture globally while converting the native DOM nodes into React Server Components for robust data fetching and authentication.

### Database Strategy (Supabase/PostgreSQL)

A relational database is mandatory to manage strict constraints around Event RSVPs (capacity limits).

- **Core Schema:** `users`, `profiles`, `meals`, `yoga_sessions`, `events`, `reservations`
- **Security:** Utilize Postgres Row Level Security (RLS) to ensure users can only mutate their own `reservations` and `profiles`.

### Authentication

Authentication will be handled via **Supabase Auth** (JWT-based). Sessions will be securely managed in HTTP-only cookies to allow Next.js middleware to protect private routes (e.g., `/dashboard`) and hydrate the user profile server-side before rendering.

### Environment Setup & Deployment

- **Deployment:** Vercel (Edge-optimized for Next.js).
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (Never commit the `SUPABASE_SERVICE_ROLE_KEY` to the frontend).
- **Development Workflow:** A `.env.example` file will be provided containing placeholder keys. Local development will utilize the Supabase CLI to spin up a local Dockerized Postgres instance to ensure parity with production.
