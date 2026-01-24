# Quiz Platform - Agent Documentation

This application is a **static-first, TDD-driven quiz platform** built with **Astro**, **Markdown**, and **Node.js**. It focuses on simplicity, maintainability, and a premium developer experience.

## 🚀 Application Overview

The platform allows educators and developers to author quizzes using standard Markdown files. At build-time, these quizzes are processed into a deterministic "correctness map" which the backend API uses to validate scores securely without reparsing content at runtime.

### Key Components
- **Markdown Quizzes**: Located in `/quizzes`. Uses YAML frontmatter and GFM task lists.
- **Build Pipeline**: A pre-build step (`scripts/build-quizzes.js`) that hashes questions and extracts correct answers.
- **Hybrid Rendering**:
  - **Static**: Quiz Hub and Quiz Pages are pre-rendered for maximum performance.
  - **Dynamic**: The `/api/submit` endpoint handles live score validation.
- **Deterministic IDs**: Question IDs are generated using a SHA-256 hash of the normalized question text, ensuring stability.

## 🛠️ Development & Commands

The project uses `pnpm` for package management and `vitest` for testing.

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the development server with hot-module replacement and auto-builds quizzes. |
| `pnpm build` | Compiles the application for production, generating static pages and the correctness map. |
| `pnpm test` | Runs the full Vitest suite (all 16+ tests). |
| `pnpm run build-quizzes` | Manually regenerates `src/data/correctness.json` from the Markdown files. |

## 🧪 Test-Driven Development (TDD) Approach

The codebase was developed strictly following the TDD lifecycle: **Write Test (Fail) ➔ Implement ➔ Pass ➔ Refactor.**

### Test Categories
1. **Markdown Parsing (`src/lib/parser.test.ts`)**: Ensures GFM task lists are correctly interpreted and frontmatter is strictly validated.
2. **Pipeline Logic (`src/lib/pipeline.test.ts`)**: Verifies that the discovery process handles duplicates and generates correct answer indices.
3. **API Validation (`src/lib/api.test.ts`)**: Pure logic tests for scoring algorithms, including partial scoring and error cases.
4. **Frontend State (`src/lib/frontend.test.ts`)**: Mocks the selection logic to ensure multi-choice vs single-choice behavior is consistent before UI implementation.

---

---

## 🗄️ Database Setup (Cloudflare D1)

The application uses Cloudflare D1 for persistent storage of quiz submissions.

### 1. Initial Setup
1. Create a D1 database: `npx wrangler d1 create quiz-db`
2. Update `wrangler.toml` with the `database_id` returned from the command.
3. Apply migrations: `npx wrangler d1 migrations apply quiz-db --local` (for local) or `npx wrangler d1 migrations apply quiz-db --remote` (for production).

### 2. Local Development Fallback
For `pnpm dev`, if a D1 binding is not detected, the app automatically falls back to a **local SQLite database** (`quiz.db`) using Node's built-in `node:sqlite` module. This ensures zero-config development for new contributors.

## 🧪 Testing Strategy

The project uses a tiered testing approach:

1. **Unit Tests (`*.test.ts`)**: Pure logic tests using Vitest and Mocks. Fast and deterministic.
2. **Integration Tests (`*.integration.test.ts`)**: Verifies data persistence using the local SQLite fallback. Ensures that the schema matches the code implementation.
3. **API Contracts**: The correctness map (`src/data/correctness.json`) acts as a contract between the static build and the live API.

---

## 🚀 Production Deployment

The application is designed to be deployed on **Cloudflare Pages** with **D1 database** integration.

### Quick Deploy Checklist
1. ✅ D1 database created and migrations applied (`npx wrangler d1 migrations apply quiz-db --remote`)
2. ✅ GitHub OAuth app configured for production domain
3. ✅ Environment variables set (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, AUTH_SECRET, AUTH_TRUST_HOST)
4. ✅ D1 database binding configured in Cloudflare Pages
5. ✅ Deploy via GitHub integration or `npx wrangler pages deploy dist`