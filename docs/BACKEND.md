# FITUP Backend Architecture (Phase 7)

## 1. Backend Purpose

The backend provides a secure, reliable foundation for data persistence and API services, acting as the source of truth for business domains such as Users, Workouts, and Meals. It decouples the static frontend from the database.

## 2. Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: Database provider migration to MongoDB Atlas is pending.
- **Key Dependencies**: `dotenv` (configuration), `cors` (security)

## 3. Directory Structure

```text
backend/
├── src/
│   ├── config/       # Environment loading and validation
│   ├── controllers/  # Request/response handling
│   ├── middleware/   # Express middlewares (error handling, etc.)
│   ├── routes/       # API routing definitions
│   ├── services/     # Business logic
│   ├── repositories/ # Future direct DB operations abstractions
│   ├── utils/        # Generic backend utilities
│   ├── app.js        # Express application configuration
│   └── server.js     # HTTP Server boot and shutdown
├── prisma/
│   └── schema.prisma # Database models
└── .env.example
```

## 4. How to Install

```bash
cd backend
npm install
npm run prisma:generate
```

## 5. Environment Variables

Copy `.env.example` to `.env`.

Key variables:

- `PORT` (Default: 3000)
- `FRONTEND_ORIGIN` (Default: `http://localhost:5500`)
- `DATABASE_URL` (Database connection string)

## 6. Database Setup

Database provider migration to MongoDB Atlas is pending.

## 7. Prisma Setup

Prisma is used as the ORM. The schema defines `User`, `Profile`, and catalog elements like `Meal`.

## 8. Migration Commands

To apply the schema to the database (development):

```bash
npm run prisma:migrate
```

## 9. Seed Commands (Deferred)

Seed strategies will be introduced as the domain schema is completed in future phases.

## 10. Development Server

```bash
npm run dev
```

Starts `nodemon` to watch for file changes on `localhost:3000`.

## 11. API Base URL

All routes are prefixed with `/api/v1`.

## 12. Health Endpoint

`GET /api/v1/health`

Returns system status, ensuring the router and database connection (if configured) are operational.

## 13. API Versioning

Explicitly versioned at `v1` to allow for future breaking changes without disrupting older clients.

## 14. Request Conventions

- JSON bodies strictly limited to 100kb.
- Expected to pass standard `application/json` headers.

## 15. Response Conventions

- **Success**: `{ "data": { ... } }`
- **Error**: `{ "error": { "code": "...", "message": "..." } }`

## 16. Error Conventions

Centralized in `middleware/error.middleware.js`. Errors return standardized HTTP status codes without leaking stack traces. Prisma errors are intercepted and generalized.

## 17. Validation

Controllers will eventually employ validation schemas (e.g. Joi or Zod) to verify request payloads before passing them to Services.

## 18. CORS

Configured to strictly allow `FRONTEND_ORIGIN` in production, protecting the API from cross-site exploitation.

## 19. Logging

Minimal console logging for startup and shutdown sequences. Intentionally quiet during operations unless errors occur.

## 20. Database Architecture

The architecture isolates Prisma knowledge to the Service/Repository layers; Controllers remain ignorant of the ORM.

## 21. Domain Model (Initial)

- `User`: Identity (future auth).
- `Profile`: User preferences (future personalization).
- `Meal`: Foundation catalog item.

## 22. Frontend Integration

The frontend accesses the backend exclusively via `js/services/api.js`. The `API_BASE_URL` in `js/services/config.js` directs traffic to the server.

## 23. Security Baseline

- `dotenv` ensures secrets are ignored by Git.
- `cors` prevents unauthorized browser access.
- JSON payload limits prevent Denial-of-Service.
- Generic error messages prevent database schema leaks.

## 24. Testing

Future integration tests will target the `/api/v1/health` endpoint and controller units.

## 25. Phase 8 Authentication Handoff

Authentication logic should be injected into:

- `backend/src/middleware/auth.middleware.js` (for route protection)
- `backend/src/services/auth.service.js` (for JWT/Session generation)
- The `User` model in `schema.prisma` will need password/salt or token fields.
