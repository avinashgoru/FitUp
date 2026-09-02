# FITUP Product UX Foundation

This document establishes the user experience rules, boundaries, and product states for FITUP as it transitions from a marketing landing page into a fully functional web application.

## 1. Product Principles

- **Clarity over cleverness:** Users must instantly understand what action to take next.
- **Premium feedback:** Every interaction should provide immediate, subtle visual feedback without excessive motion.
- **Data truthfulness:** We never show fake progress, fake streaks, or fake community statistics. If data does not exist, the UI gracefully falls back to an empty state.
- **Respectful language:** We use confident, calm, and motivating microcopy. We do not use aggressive, shame-based, or hyper-promotional fitness jargon.

## 2. User Journeys

### The Public Experience (Current)

The public experience is focused on **Discovery & Trust**.
Flow: `Landing Page` → `Explore Value (Why FITUP)` → `Discover Modalities (Meals/Yoga)` → `Build Trust (Events)` → `Primary CTA (Get Started)`.

### The Future Product Experience (Phase 6+)

The authenticated experience will focus on **Action & Consistency**.
Flow: `Welcome Back` → `Today's Primary Recommendation` → `Continue Program` → `Track Progress`.

## 3. Primary CTAs & Destinations

- **"Get Started" (Hero):** Currently anchors to `#why-fitup` for exploration. *Future:* Will route to `/onboarding` to capture goals and preferences.
- **"Reserve Your Spot" (Events):** Currently anchors to `#events` (intentional placeholder). *Future:* Will open a reservation dialog bridging to the event/booking service.
- **"Check All" (Yoga):** Toggles visual expansion of the grid. *Future:* Will route to `/yoga-library` for authenticated users.

## 4. Product States

All future dynamic UI components must account for the following states:

- **Loading:** Render a subtle CSS skeleton using existing brand colors. No chaotic spinners.
- **Empty:** Display a concise headline, a brief explanation, and a clear primary action. (e.g., "No workouts yet. / Start your first routine to build momentum. / [Explore Workouts]").
- **Error:** Human-readable explanations. Never expose raw API errors. (e.g., "We couldn't load your plan right now. / [Try Again]").
- **Success:** Inline confirmation via green/check icon or non-intrusive toast. Avoid full-page celebration modals.
- **Unauthorized:** Graceful redirect to `/login` or a clear boundary message rather than silently failing.

## 5. Mobile UX Principles

- All primary actions (CTAs) must have a minimum touch target of `44px` by `44px`.
- Hover-only interactions (like the Yoga card arrows) must have a persistent or tap-revealed equivalent on touch devices.
- Focus rings (`:focus-visible`) must never be suppressed on mobile for users navigating via assistive technology.

## 6. Onboarding Concept (Future Implementation)

Authentication and personalization will rely on the backend. When implemented, the onboarding flow will be:

1. **Welcome:** "Let's build your better routine."
2. **Goal Selection:** (e.g., Build strength, Improve flexibility).
3. **Experience Level:** (Beginner, Intermediate, Advanced).
4. **Routine Capacity:** (How many days per week?).
5. **Account Creation:** The backend stores preferences and generates the initial personalized dashboard.

## 7. Microcopy Guidelines

- **Tone:** Confident, Calm, Motivating.
- **Good:** "Build a routine that fits your life."
- **Bad:** "Destroy your body in 30 days!"
- **Good:** "Explore Yoga"
- **Bad:** "Click Here to see more"

## 8. Future Dependencies

- **`/onboarding`:** Depends on Authentication (Phase 8) and Personalization (Phase 9).
- **`/dashboard`:** Depends on Backend (Phase 7) and Workout System (Phase 10).
- **`/meals` (Saved Plans):** Depends on Meal System (Phase 11).
- **`/events` (Reservations):** Depends on Event System (Phase 14).
