# FITUP Application Architecture (Phase 6)

## 1. Architecture Overview

FITUP utilizes a disciplined Vanilla JavaScript modular architecture, separating the application into distinct layers: Application Core, Features, Components, Services, and Utilities. This prevents spaghetti code without requiring external frameworks.

## 2. Current Technology

- **HTML5/CSS3** (Responsive, Native properties)
- **Vanilla JavaScript (ES Modules)**
- No build steps or UI frameworks.

## 3. Project Structure

- `js/app/`: Application bootstrap, routing, global state, shell management.
- `js/components/`: Reusable UI primitives (Navigation, Modals, Toasts).
- `js/features/`: Domain-specific product logic (Meals, Yoga, Events).
- `js/services/`: External boundaries (API, Storage, Configuration).
- `js/utils/`: Pure helper functions (DOM, Validation).

## 4. Public vs Application Architecture

The architecture strictly enforces a boundary between:

- **Public Marketing Experience**: Focused on discovery (`/`). Handled by the current static layouts.
- **Protected Application Experience**: Focused on user actions (`/app/*`).

## 5. Route Strategy

FITUP uses a **Hash-based Routing System**. This avoids complex server-side redirects for a static deployment while providing deterministic application states (`#/app`).

## 6. Route Access Levels

- `public`: Accessible to anyone (e.g., `#`, `#/login`).
- `protected`: Requires an active user session (deferred to Phase 8). Attempting access redirects back to public with a warning.
- `admin`: Requires specific role authorization (deferred to Phase 15).

## 7. Application Shell

`app-shell.js` orchestrates mounting/unmounting. When a user navigates to an `isApp: true` route, the marketing UI hides, and the authenticated App Dashboard UI mounts.

## 8. Component Boundaries

Components (`components/`) are generic UI primitives (Modals, Toasts, States) that do not know about backend data, user identity, or specific domain rules.

## 9. Feature Boundaries

Features (`features/`) encapsulate vertical slices of the application. The `Meals` feature owns its DOM interaction, its data mapping, and eventually, its backend integration via services. Features do not cross-import each other to avoid circular dependencies.

## 10. State Model

Global state is managed by `app-state.js`, utilizing a lightweight ES6 Publisher/Subscriber pattern (e.g., `globalState.subscribe('currentRoute', callback)`). This guarantees deterministic single-source-of-truth reactivity.

## 11. State Ownership

- **Router**: Owns `currentRoute`.
- **App Shell**: Consumes `currentRoute`.
- **Features**: Own local DOM-driven states (e.g., Yoga expansion state, Meals selected tab).
- **Global**: `isReady`, `isAuthenticated`, `user`.

## 12. Service Layer

All external side-effects (Network calls, LocalStorage interactions) flow through `services/`. UI components never invoke `fetch` directly.

## 13. API Contract Conventions

API calls flow through `api.js`.

- **Success Contract**: `{ success: true, data: { ... } }`
- **Error Contract**: `{ success: false, error: { code: '...', message: '...' } }`

## 14. Configuration

`config.js` stores safe constants (`API_BASE_URL`). Secrets are never committed to the repository.

## 15. Storage Strategy

`storage.js` securely wraps `localStorage`. It is reserved for non-sensitive UI preferences (e.g., theme toggle). Tokens/Auth will rely on secure HttpOnly cookies managed by the backend (Phase 8).

## 16. Error Handling

Global errors are caught and surfaced via standard `toast.js` or `states.js` messages using the premium, calm FITUP tone ("Something went wrong. Please try again."). No stack traces are ever exposed to the UI.

## 17. Loading / Empty / Error / Success States

Standardized primitives in `states.js`.

- **Loading**: CSS Skeletons.
- **Empty/Error**: Meaningful microcopy + CTA recovery.

## 18. Authentication Boundary

Authentication is delegated to Phase 8. The router correctly isolates `protected` routes and actively rejects unauthorized hash navigations.

## 19. Authorization Boundary

Authorization (Admin vs User) acts as a secondary gate past Authentication, strictly enforced server-side.

## 20. Domain Model

Conceptual entities expected by the frontend:

- `User`: Identity profile.
- `Workout`: Exercise logs and programs.
- `MealPlan`: Selected nutrition.
- `YogaSession`: Viewed media.
- `Reservation`: Event bookings.

## 21. Testing Strategy

- **Unit**: Validation rules, string formatters.
- **Integration**: Routing states, Service boundaries.
- **E2E**: Complete authentication and application shell flows.

## 22. Security Principles

- Never store secrets in JS.
- Rely on HttpOnly cookies for session state.
- Sanitize all text before injecting it to prevent XSS.

## 23. Future Backend Integration

Backend engineers (Phase 7) should intercept `js/services/api.js` to begin wiring real endpoints. The frontend expects JSON payloads mapped to the domain model.

## 24. Decisions Made

- Chose **Hash-based routing** due to static deployment safety.
- Chose **Vanilla JS** because the application scales elegantly through strict ES module boundaries without requiring React/Vue.

## 25. Deliberately Deferred Items

- Real Authentication (Phase 8)
- Actual API endpoints / backend (Phase 7)
- Personalization / ML logic (Phase 9)

## 26. Phase 7 Handoff Notes

The architecture is solid. To begin Phase 7, instantiate the backend server, define the CORS policy against the static frontend domain, and point `config.js` `API_BASE_URL` to the active server. Build the API against the Service/Domain expectations defined herein.
