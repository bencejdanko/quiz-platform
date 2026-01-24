---
description: Check the integrity and syntax of Astro components and TypeScript files.
---

To ensure there are no syntax errors or type mismatches in the Astro components (which can cause runtime transform errors), run the following command:

// turbo
1. Run the astro check command:
```bash
pnpm run check
```

This will perform static analysis on all `.astro` and `.ts` files and report any errors that would otherwise only be caught at runtime or build-time.
