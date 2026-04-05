# Playwright TypeScript UI Test Framework

A portfolio-grade end-to-end test automation framework built with [Playwright](https://playwright.dev) and TypeScript.

## Target Application

The test suite runs against the [RealWorld](https://github.com/realworld-apps/realworld) demo app:

- **Frontend:** [realworld-react-fsd](https://github.com/tenthousandrpm/realworld-react-fsd) — React 18 + TypeScript
- **Backend:** [realworld-django-ninja](https://github.com/tenthousandrpm/realworld-django-ninja) — Django Ninja + PostgreSQL

## Project Structure

```
.
├── .github/workflows/  # CI workflow
├── config/             # Typed environment config
├── fixtures/           # Custom Playwright fixtures
├── pages/              # Page Object Models
├── tests/              # Test specs
├── Dockerfile          # Playwright test runner image
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

## CI

The framework ships with a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

1. Checks out the repo with submodules
2. Spins up the full stack via Docker Compose (when targeting localhost)
3. Builds and runs the Playwright container
4. Uploads the HTML report as a downloadable artifact

### Running against a different target

The workflow accepts `base_url` and `api_url` inputs via `workflow_dispatch`, so you can point it at any environment without changing code:

```
base_url: https://staging.myapp.com
api_url:  https://staging.myapp.com/api
```

When `base_url` is not localhost, the Docker Compose stack is skipped entirely.

### Running the container locally

```bash
docker build -t playwright-tests .
docker run --rm \
  --network host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -e BASE_URL=http://localhost:4100 \
  -e API_URL=http://localhost:8000/api \
  playwright-tests
```

## Design

- **Page Object Model** — all locators and actions live in `pages/`, tests never use raw selectors
- **Custom fixtures** — `authenticatedPage` logs in through the UI and navigates via nav links to preserve the Redux store across page transitions
- **Typed config** — `config/env.ts` is the single source of truth for environment variables
- **Portable test runner** — the `Dockerfile` packages the entire framework; point `BASE_URL` at any target
