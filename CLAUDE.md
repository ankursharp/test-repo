# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

Intentionally vulnerable full-stack web application used for practicing advanced web threats and writing security reports. Backend is a Spring Boot API with PostgreSQL, frontend is a React SPA served via Nginx, with Docker Compose wiring everything together.

## How to Run the App

### Docker (Recommended)

```bash
# Copy environment template and configure secrets
cp .env.example .env
# Edit .env to set DB_PASSWORD, DB_NAME, JWT_SECRET, SPRING_PROFILES_ACTIVE, etc.

# Build and start all services (backend, frontend, db, etc.)
docker compose up -d --build

# Stop all services
docker compose down
```

### Backend Only (Spring Boot)

Backend lives in `backend/` and is a Maven-based Spring Boot app.

```bash
cd backend

# Run backend tests
./mvnw test

# Run a single test class
./mvnw -Dtest=SomeTestClass test

# Build backend jar
./mvnw clean package

# Run Spring Boot app directly (uses application.properties)
./mvnw spring-boot:run
```

### Frontend Only (React)

Frontend lives in `frontend/` and is a React SPA built with Node and served by Nginx in production.

```bash
cd frontend

# Install dependencies (uses package-lock.json for exact versions)
npm install

# Start React dev server (if configured in package.json scripts)
npm start

# Run frontend tests (if/when added)
npm test

# Build frontend assets
npm run build
```

## Application Access

Once Docker stack is running:

- Frontend: http://localhost:3000
- Backend API base: http://localhost:8080/api/...
- Optional pgAdmin (if enabled in compose): http://localhost:5050

Default users (intentionally weak for training):

- Admin: `superadmin@email.com` / `admin123`
- Base user: register any username/email/password via frontend.

## High-Level Architecture

### Top-Level Layout

- `backend/` — Spring Boot application with JWT-based auth and PostgreSQL persistence.
- `frontend/` — React SPA that talks to backend APIs and is served by Nginx in Docker.
- `docker-compose.yml` — Orchestrates backend, frontend, database, and optional pgAdmin.

### Backend Architecture (Spring Boot)

Located under `backend/src/main/java/com/dvelupmint/app/`:

- Entry point: `DemoApplication.java` — Spring Boot main class.
- Config:
  - `config/WebConfig.java` — Web MVC configuration (CORS, view resolvers, etc.).
  - `config/RestTemplateConfig.java` — RestTemplate bean configuration.
  - `config/AdminInitializer.java` — Admin seeding/initialization on startup.
- Controllers:
  - `controller/AuthController.java` — Handles authentication, registration, login, token issuance.
  - `controller/AdminController.java` — Admin-only operations/endpoints.
  - `controller/ClientController.java` — Client-related CRUD or business endpoints.
- Security:
  - `security/SecurityConfig.java` — Spring Security configuration (filters, endpoint protection, password encoding).
  - `security/JwtAuthenticationFilter.java` — JWT extraction/validation for incoming requests.
  - `security/JwtUtil.java` — JWT creation and parsing helpers.
  - `security/UserDetailsServiceImpl.java` — Integrates user data with Spring Security.
- Domain:
  - `model/User.java`, `model/Client.java` — JPA entities / domain models.
  - `repository/UserRepository.java`, `repository/ClientRepository.java` — Spring Data repositories.
  - `payload/RegisterRequest.java`, `dto/SmallBody.java` — Request/response DTOs.
- Config file: `src/main/resources/application.properties` — DB connection, server port, profiles.

The backend exposes RESTful endpoints under `/api/...`, secured by JWT and role-based access, though many controls are intentionally weak or misconfigured for training.

### Frontend Architecture (React)

Located under `frontend/src/`:

- Entry: `index.js` — Boots React app and renders `App`.
- Root: `App.js` — Main application component and routing hub; `AppNotes.js` contains additional views/notes.
- Pages (under `pages/`):
  - `homePg.jsx` — Landing/dashboard page.
  - `loginPg.jsx` — Login form and auth flow.
  - `regPg.jsx` — Registration flow.
  - `adminPg.jsx` — Admin dashboard / admin-only views.
  - `clientsPg.jsx` — Client listing and management.
- Routing & auth:
  - `routes/ProtectedRoute.jsx` — Higher-order component guarding routes that require auth / specific roles.
  - `hooks/UseAuth.js` — Custom hook to manage auth state (tokens, current user, etc.).
- API access:
  - `apiService.js` — Centralized HTTP client to call backend API (auth headers, base URL from config).
  - `config.js` — Frontend configuration (API base URLs, environment flags).
- UI:
  - `components/navBar.js` — Navigation bar with auth-aware links.
  - Styles: `App.css`, `index.css`, Tailwind config (`tailwind.config.js`), `postcss.config.js`.
  - Static assets: `assets/` (logos, background images).

In production, `Dockerfile` and `nginx.conf` in `frontend/` build the React app and serve static files via Nginx.

### Docker & Environment

- `docker-compose.yml` runs:
  - Spring Boot backend container built from `backend/Dockerfile`.
  - React+Nginx frontend container built from `frontend/Dockerfile`.
  - PostgreSQL DB (and optionally pgAdmin) configured via `.env`.
- `.env.example` at repo root defines all required environment variables. Copy to `.env` and fill in secrets for local runs.

## Notes for Future Claude Code Sessions

- This application is intentionally vulnerable for security training; do not "fix" vulnerabilities unless explicitly asked, as they may be relied upon by exercises.
- When adding or modifying features, keep the separation of concerns: controllers delegate to repositories/DTOs on the backend, and pages/hooks/services on the frontend.
- For security-related tasks, review both backend `SecurityConfig`/JWT components and frontend auth flows (`UseAuth`, `ProtectedRoute`) together to understand end-to-end behavior.