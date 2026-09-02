# FITUP Personalization Architecture

## 1. Overview

The Personalization system in Phase 9 establishes the foundational context for the authenticated user, allowing subsequent systems (Workouts, Meals, Progress) to adapt dynamically without interrogating the user continuously.

## 2. Profile Model

The `Profile` entity is an extension of the `User` identity, adhering to strict bounds defined by Prisma Enums to ensure robust state management and safe type consumption downstream.

### Allowed Preferences

**Fitness Goal (`FitnessGoal`):**

- `STRENGTH`
- `WEIGHT_MANAGEMENT`
- `MOBILITY`
- `GENERAL_FITNESS`

**Experience Level (`ExperienceLevel`):**

- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

**Routine Preference (`RoutinePreference`):**

- `QUICK`
- `BALANCED`
- `DEDICATED`

## 3. Endpoints

The following endpoints encapsulate all profile mutations and retrievals. They rely exclusively on the `req.user.id` assigned by the authentication middleware to guarantee secure, bounded scope.

- `GET /api/v1/profile`: Returns the public representation of the authenticated user's profile.
- `PATCH /api/v1/profile`: Modifies the profile. Protected by Zod validations that rigidly enforce allowed Enum permutations and express-rate-limit to prevent abuse.

## 4. Frontend State Mapping

`js/app/app-state.js` segregates the generic `user` identity from the `profile` preferences. A derived state slice `isProfileComplete` dictates authentication routing bounds:

- **Complete**: Authenticated user seamlessly transitions to `#/app`.
- **Incomplete**: Authenticated user is diverted to `#/onboarding` and locked into the wizard flow until the required fields are completed.

## 5. Security Guardrails

- **Idempotent Ownership:** User IDs are never accepted in request payloads. The profile manipulated is always inherently tied to the session token's owner.
- **Data Scarcity:** No unnecessary biometric, PII, or diagnostic medical information is collected.
- **Server Authority:** Validation acts strictly on the backend, bypassing any malicious frontend manipulation vectors.

## 6. Future Consumers (Phase 10+)

The Workouts and Meals generation engines will construct context maps by joining the Profile configuration natively. 
Example Context Matrix: `(goal: STRENGTH) x (experienceLevel: BEGINNER) x (routinePreference: QUICK)` -> Generates short, focused foundational tutorials.
