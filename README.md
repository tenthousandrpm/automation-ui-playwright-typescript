# Playwright TypeScript UI Test Framework

A portfolio-grade end-to-end test automation framework built with [Playwright](https://playwright.dev) and TypeScript.

## Target Application

The test suite runs against the [RealWorld](https://github.com/realworld-apps/realworld) demo app:

- **Frontend:** [realworld-react-fsd](https://github.com/tenthousandrpm/realworld-react-fsd) — React 18 + TypeScript
- **Backend:** [realworld-django-ninja](https://github.com/tenthousandrpm/realworld-django-ninja) — Django Ninja + PostgreSQL

## Project Structure

```
.
├── config/             # Typed environment config
├── fixtures/           # Custom Playwright fixtures
├── pages/              # Page Object Models
├── tests/              # Test specs
├── playwright.config.ts
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js 20+

### 1. Start the application

```bash
cp .env.example .env
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:4100       |
| API      | http://localhost:8000/api  |
| API Docs | http://localhost:8000/docs |

### 2. Run tests

```bash
npm install
npx playwright install
npx playwright test
```

### Run a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View the HTML report

```bash
npx playwright show-report
```

Traces, screenshots, and videos are captured automatically on failure.

## Configuration

Copy `.env.example` to `.env` and adjust as needed.

| Variable              | Default                         | Description                          |
|-----------------------|---------------------------------|--------------------------------------|
| `BASE_URL`            | `http://localhost:4100`         | Frontend URL for Playwright          |
| `API_URL`             | `http://localhost:8000/api`     | Backend API URL for fixtures         |
| `HEADLESS`            | `true`                          | Run browsers headlessly              |
| `TEST_USER_USERNAME`  | `testuser`                      | Test user seeded before suite runs   |
| `TEST_USER_EMAIL`     | `test@example.com`              | Test user seeded before suite runs   |
| `TEST_USER_PASSWORD`  | `password123`                   | Test user seeded before suite runs   |
| `API_PORT`            | `8000`                          | Backend port                         |
| `FRONTEND_PORT`       | `4100`                          | Frontend port                        |
| `DB_USER`             | `postgres`                      | PostgreSQL user                      |
| `DB_PASSWORD`         | `postgres`                      | PostgreSQL password                  |
| `DB_NAME`             | `realworld`                     | PostgreSQL database name             |
| `SECRET_KEY`          | `dev-secret-key-...`            | Django secret key                    |

## Design

- **Page Object Model** — all locators and actions live in `pages/`, tests never use raw selectors
- **Custom fixtures** — `authenticatedPage` logs in through the UI and navigates via nav links to preserve the Redux store across page transitions
- **Typed config** — `config/env.ts` is the single source of truth for environment variables
