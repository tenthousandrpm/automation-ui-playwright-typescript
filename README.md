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
| -------- | -------------------------- |
| Frontend | http://localhost:4100      |
| API      | http://localhost:8000/api  |
| API Docs | http://localhost:8000/docs |

### 2. Run tests

```bash
npm install
npx playwright install
npm test
```

### Named scripts

| Script                    | What it runs                               |
| ------------------------- | ------------------------------------------ |
| `npm test`                | All tests                                  |
| `npm run test:smoke`      | `@smoke` tests only                        |
| `npm run test:regression` | `@regression` tests only                   |
| `npm run test:headed`     | All tests in headed mode                   |
| `npm run test:debug`      | All tests in debug mode                    |
| `npm run check:flaky`     | Fail if any test passed only after retries |
| `npm run lint`            | Check for lint errors                      |
| `npm run lint:fix`        | Auto-fix lint errors                       |
| `npm run format`          | Format all files with Prettier             |
| `npm run format:check`    | Check formatting without writing           |

### Run a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View reports

Each test run produces three reports:

| Report          | Command                          | Notes                          |
| --------------- | -------------------------------- | ------------------------------ |
| Playwright HTML | `npx playwright show-report`     | Built-in interactive report    |
| Allure          | See below                        | Rich dashboard with trends     |
| JUnit XML       | `test-results/junit-results.xml` | For CI/CD platform integration |

**Allure report (devcontainer):**

```bash
npx allure generate allure-results --clean
npx allure open --port 5252
```

Then open `http://localhost:5252` in your browser. Port 5252 is pre-forwarded by the devcontainer.

Traces, screenshots, and videos are captured automatically on failure.

## Test Tagging

Tests are tagged with `@smoke` or `@regression` using Playwright's annotation API:

- **`@smoke`** — critical happy-path tests; run on every CI push/PR
- **`@regression`** — broader coverage; run locally or on a scheduled basis

## Test setup requirements

The test fixtures use `GET /csrf/` on the backend to acquire Django's CSRF cookie before running any mutating API calls. This endpoint is defined in `config/urls.py` and must be reachable at `serverUrl` (derived from `API_URL`). It does not require the Django admin panel to be enabled.

## Configuration

Copy `.env.example` to `.env` and adjust as needed.

| Variable             | Default                     | Description                        |
| -------------------- | --------------------------- | ---------------------------------- |
| `BASE_URL`           | `http://localhost:4100`     | Frontend URL for Playwright        |
| `API_URL`            | `http://localhost:8000/api` | Backend API URL for fixtures       |
| `HEADLESS`           | `true`                      | Run browsers headlessly            |
| `TEST_USER_USERNAME` | `testuser`                  | Test user seeded before suite runs |
| `TEST_USER_EMAIL`    | `test@example.com`          | Test user seeded before suite runs |
| `TEST_USER_PASSWORD` | `password123`               | Test user seeded before suite runs |
| `FRONTEND_PORT`      | `4100`                      | Frontend port                      |
| `DB_USER`            | `postgres`                  | PostgreSQL user                    |
| `DB_PASSWORD`        | `postgres`                  | PostgreSQL password                |
| `DB_NAME`            | `realworld`                 | PostgreSQL database name           |
| `SECRET_KEY`         | `dev-secret-key-...`        | Django secret key                  |

## CI

The framework ships with a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

1. Runs ESLint and Prettier checks (tests are blocked if this fails)
2. Checks out the repo with submodules
3. Spins up the full stack via Docker Compose (when targeting localhost)
4. Builds and runs the Playwright container (smoke tests only)
5. Fails the build if any test passed only after retries (`check:flaky`)
6. Generates an Allure report from the raw results
7. Uploads four downloadable artifacts: `playwright-report`, `allure-report`, `junit-results`, and `json-results`

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
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/allure-results:/app/allure-results \
  -e BASE_URL=http://localhost:4100 \
  -e API_URL=http://localhost:8000/api \
  playwright-tests
```

## Contributing

### Pre-commit hooks

This repo uses [husky](https://typicode.github.io/husky/) to run type checking and linting before every commit. The hooks run on the **host machine**, not inside Docker, so Node.js must be installed locally even if you run tests via Docker.

**macOS (Homebrew):**

```bash
brew install node
```

**Verify:**

```bash
node --version  # should print v20 or higher
```

Once node is available, run `npm install` from the repo root — husky wires itself up automatically via the `prepare` script. From that point on, every `git commit` will:

1. Type-check the whole project with `tsc --noEmit`
2. Auto-fix and re-stage any lint or formatting issues on staged `.ts` files

If node is not found on the host, the hook prints a warning and exits cleanly so commits are never blocked.

## Design

- **Page Object Model** — all locators and actions live in `pages/`, tests never use raw selectors
- **Custom fixtures** — `authenticatedPage` logs in through the UI and navigates via nav links to preserve the Redux store across page transitions
- **Typed config** — `config/env.ts` is the single source of truth for environment variables
- **Portable test runner** — the `Dockerfile` packages the entire framework; point `BASE_URL` at any target
- **Linting & formatting** — ESLint + Prettier enforce consistent code style; run `npm run lint` and `npm run format:check` in CI
