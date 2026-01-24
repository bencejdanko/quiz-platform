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

## 🔧 Maintenance & Troubleshooting

### Adding a Quiz
1. Create a `.md` file in `/quizzes/`.
2. Add a `title` and a unique `slug` in the frontmatter.
3. Write questions using `- [ ]` for options and `- [x]` for correct answers.
4. Run `pnpm run build-quizzes` or restart `pnpm dev`.
