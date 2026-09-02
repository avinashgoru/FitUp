# FITUP Phase 10: Workout System Architecture

## 1. Purpose

The Workout System is the first fully realized feature-domain inside FITUP. It connects the Phase 9 Personalization layer to deterministic training protocols, enabling authenticated users to browse, select, and interactively track workout sessions securely.

## 2. Domain Model

- **Exercise**: Functional foundational movements (e.g. "Bodyweight Squat"). Contains instructions, target `equipment` and `difficulty`.
- **Workout**: A prescriptive training block characterized by Phase 9 flags (`goal`, `experienceLevel`, `routinePreference`), and structured with an overall `durationMinutes` and `difficulty`.
- **WorkoutExercise**: Join model determining the sequential `order`, `sets`, `reps`, and `restSecs` for an Exercise within a Workout.
- **WorkoutSession**: Stateful tracker for a user's attempt at a Workout (`IN_PROGRESS`, `COMPLETED`, `ABANDONED`). Tied exclusively to `userId` from the Session Auth Layer.

## 3. Personalization & Matching Engine

Recommendations are processed purely server-side (`workout-matching.service.js`) bypassing any need for black-box LLMs.
Scoring is additive:

- **+3 points** for an exact ExperienceLevel match (e.g. BEGINNER -> BEGINNER)
- **+2 points** for an exact FitnessGoal match
- **+1 point** for an exact RoutinePreference match

This deterministic algorithm ensures that the same profile will *always* generate the exact same catalog of recommendations in order of safety and relevance.

## 4. API Endpoints

All protected endpoints rely on the previously built HttpOnly Session Auth wrapper.

- `GET /api/v1/workouts`: Paginated library.
- `GET /api/v1/workouts/recommended`: Evaluates `req.user.id`'s Profile, returns scored Top 4.
- `GET /api/v1/workouts/detail/:slug`: Resolves full relational hierarchy including ordered exercises.
- `POST /api/v1/workouts/sessions`: Starts a tracking session on a Workout.
- `POST /api/v1/workouts/sessions/:id/complete`: Marks a session completed. Prevents cross-user mutations.

## 5. Security & Authorization

- **No Client IDs**: A client cannot pass `?userId=X` to view another user's recommendations or sessions. Everything strictly resolves to `req.user.id`.
- **Idempotency**: Marking a completed session as completed again returns 200 without throwing 500 constraint violations.

## 6. Frontend Gating

`app-shell.js` now delegates into nested `dashboard-view`, `workout-library-shell`, `workout-detail-shell`, and `workout-session-shell` entirely based on hash routes.

## 7. Deferred Features

- Progress Analytics (calories, streak counts) (Phase 13/14)
- Wearable integrations
- AI Adaptive rep adjustments
- Video media URLs
