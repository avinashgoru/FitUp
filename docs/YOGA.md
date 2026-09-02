# FITUP Phase 12: Yoga Platform

## Overview

The Yoga Platform introduces a fully functional Yoga module into FITUP.
It shares similar design philosophies as the Workout and Meal systems but uses distinct, decoupled Prisma models (`YogaPose`, `YogaPractice`, `YogaPracticePose`, `YogaPracticeSession`) to maintain strict domain boundaries.

## Architecture

### Backend

1. **Prisma Schema**: `schema.prisma` holds the 4 core models + `YogaLevel` and `YogaStyle` enums. It reuses the `SessionStatus` enum.
2. **Services**:
   - `yoga.service.js`: Fetches library and specific details.
   - `yoga-matching.service.js`: Server-side deterministic scoring based on `Profile` (Goal, Experience Level, Routine Preference).
   - `yoga-session.service.js`: Handles start and completion of `YogaPracticeSession` tracking.
3. **Controller & Routes**: Found under `/api/v1/yoga`, strictly guarded by `requireAuth`.

### Frontend

1. **Routing**: `js/app/router.js` maps `/app/yoga`, `/app/yoga/:slug`, and `/app/yoga/:slug/session`.
2. **Shell**: `js/app/app-shell.js` controls mounting of the new views.
3. **UI Components**:
   - `yoga-library-ui.js`: Grid layout showing recommended vs all practices.
   - `yoga-detail-ui.js`: Premium overview of a specific practice, duration, poses, and sequence.
   - `yoga-session-ui.js`: Interactive timer-based playback of the yoga poses.

## Seeding

The application is seeded with 15 unique yoga poses and 8 complete practices using the predefined Cloudinary images. The `seed.js` script enforces idempotency.
