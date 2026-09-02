# FITUP — Meal System (Phase 11)

## 1. Purpose

The Nutrition domain extends the FITUP application beyond workouts into holistic wellness. Phase 11 implements a robust, deterministic meal catalog and recommendation engine, allowing users to browse meals aligned with their goals, diet, and routines, and log their nutritional intake.

## 2. Domain Model

The Meal domain strictly enforces referential integrity through Prisma.

- `Meal`: Represents the primary catalog item with embedded macros.
- `MealGoal`: Many-to-many junction enabling a single meal to satisfy `STRENGTH`, `GENERAL_FITNESS`, etc.
- `MealIngredient`: Represents specific quantities of ingredients required for preparation.
- `MealLog`: User-owned telemetry logging consumption with timestamps and serving counts.

## 3. Schemas

### Meal Schema

- `slug` (Unique)
- `mealType` (BREAKFAST, LUNCH, DINNER, SNACK)
- `dietaryType` (VEGAN, VEGETARIAN, NON_VEGETARIAN)
- Macros (Int/Float): `calories`, `protein`, `carbohydrates`, `fats`
- `preparationTimeMinutes`
- `servings`
- `instructions`

### Ingredient Schema

- `name`
- `quantity` (Float)
- `unit`

### MealLog Schema

- `userId` (Protected foreign key to User)
- `mealId` (Foreign key to Meal)
- `servingCount` (Float, supports partial servings)
- `loggedAt` (DateTime)

## 4. Nutrition Fields

All nutrition fields (`calories`, `protein`, etc.) are implemented as standard numerics (Int/Float) natively in the database rather than free-text strings, ensuring they can be aggregated and analyzed by future phases (e.g., Progress Dashboard).

## 5. Dietary Classification

Supported types are encapsulated in the `DietaryType` enum:

- `VEGAN`
- `VEGETARIAN`
- `NON_VEGETARIAN`

*Note: Phase 9's Profile was expanded during Phase 11 to persist `dietaryPreference`.*

## 6. Goal Alignment

Meals map to `FitnessGoal` enums via `MealGoal`. This design prevents dirty comma-separated strings (e.g. `"STRENGTH,ENDURANCE"`) and allows safe many-to-many JOIN indexing.

## 7. Recommendation Algorithm

Recommendations are strictly **deterministic** and computed entirely server-side (`meal-matching.service.js`). No external AI APIs are utilized.

**Scoring Model:**

- **+3 Points**: Profile `goal` matches any of the meal's `goals`.
- **+2 Points**: Profile `dietaryPreference` matches the meal's `dietaryType`.
- **+1 Point**: Profile `routinePreference` aligns with the meal's `preparationTimeMinutes` (e.g. `QUICK` awards a point for prep times <= 15 minutes).

Results are sorted descending by score and capped at the top 4.

## 8. API Endpoints

Base path: `/api/v1`

- `GET /meals`: Public library, accepts query params (page, limit, mealType, dietaryType).
- `GET /meals/detail/:slug`: Public detail retrieval.
- `GET /meals/recommended`: **Protected**. Requires authenticated user ID; evaluates profile scoring.
- `POST /meals/log`: **Protected**. Inserts a `MealLog` linked securely to `req.user.id`.
- `GET /meals/logs`: **Protected**. Retrieves recent user logs.

## 9. Authentication & Authorization

Uses the standard Phase 8 HTTP-Only Cookie strategy via `requireAuth` middleware. Ownership over logs is explicitly bound on insertion and retrieval to `req.user.id`, preventing clients from spoofing IDs in the payload.

## 10. Logging Flow

1. User enters `servingCount` on the Meal Detail view.
2. Zod validates the input on `POST /api/v1/meals/log`.
3. Prisma creates a `MealLog` assigned to the `req.user.id`.
4. Client UI transitions to a success state indicating the action is logged.

## 11. UI States

- **Loading Skeleton**: Prevents UI flicker while fetching `/meals` or `/meals/detail`.
- **Empty State**: Handled elegantly via descriptive messages if the catalog/library misses filters.
- **Error Boundaries**: Fetch wrapper catches network failures and renders human-readable recovery buttons ("Retry").

## 12. Seed Data

Deterministic seed located in `backend/prisma/seed.js` featuring realistic, scientifically plausible mock data across all meal and dietary types (e.g., High-Protein Oatmeal, Tofu Scramble, Chicken Quinoa Bowl).

## 13. Testing

Tests locate in `backend/tests/meal.test.js` validating the specific deterministic weighting engine and API constraints.

## 14. Known Limitations

- Real DB connection remains blocked by the local environment infrastructure. Migrations and client generation were successfully emulated locally.

## 15. Deferred Features

The following features are slated for future phases (Phase 13+):

- Calorie tracking dashboards
- Grocery list generation
- Macro analytics charts
- Recipe ingredient scaling engines
