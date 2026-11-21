# Repository Guidelines

## Project Structure & Module Organization

This is a CommonJS Express application. `server.js` wires middleware, API routes, and the printable invoice page; `config.js` holds shop and application settings. HTTP handlers live in `routes/`, while business logic and JSON persistence helpers live in `lib/` (pricing, tax, inventory, orders, ledger, and reports). The browser UI is under `public/` (`index.html`, `css/`, and `js/`). `data/db.json` is the local application store, and `docs/architecture.svg` documents the design. Keep new business rules in `lib/` and keep route modules focused on HTTP input/output.

## Build, Test, and Development Commands

- `npm install` installs the dependencies declared in `package.json`.
- `npm start` runs the server at `http://localhost:3000` (or the `PORT` environment variable).
- `npm test` is currently a placeholder that exits with an error because no test suite is configured. Do not treat it as a passing test command; add a test runner and meaningful tests when introducing a suite.

There is no separate build or lint command configured. The application runs directly on Node.js.

## Coding Style & Naming Conventions

Use the existing ES5-style CommonJS conventions: `require`/`module.exports`, `var`, and callback-based handlers. Indent JavaScript with two spaces and terminate statements with semicolons. Use lower camel case for variables and functions, descriptive lower-case filenames (for example, `lib/inventory.js`), and route modules named for their resource. Keep API behavior consistent with the existing Express routes and avoid adding dependencies without a clear need.

## Testing Guidelines

No testing framework, test directory, or coverage requirement is configured. If adding tests, use clear names tied to behavior (for example, `orders.test.js`) and cover relevant success and failure cases, especially calculations and updates to `data/db.json`. Never use the real local store for destructive test cases; use an isolated fixture or temporary copy.

## Commit & Pull Request Guidelines

Recent commits use short, lower-case descriptive subjects (for example, `express routes for products and orders`); follow that style and summarize the user-visible change. Pull requests should explain the behavior changed, list relevant routes or modules, note manual verification performed, and include screenshots for changes to `public/`. Link an issue when one exists and call out any data format or configuration changes.

## Configuration & Data Safety

`config.js` contains application defaults and `data/db.json` is mutable local state. Keep machine-specific or secret values out of commits, and preserve existing data shape when changing persistence behavior. Use a copy of the JSON store when manually exercising data-changing flows.
