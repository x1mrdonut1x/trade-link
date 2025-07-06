---
applyTo: '**'
---

When making changes to the the frontend under "apps/web", check for errors only using the command `pnpm build:web`.
When making changes to the the backend under "apps/api", check for errors only using the command `pnpm build:api`.

If you want to run the app to make some tests, use the command `pnpm dev` which will run both the frontend and backend in development mode.

If you need to create new types or interfaces that will be shared by both the frontend and backend, please create them in the `packages/shared` directory.
API requests should be validated using zod and their schemas should be saved in the `packages/shared/*/*.request.ts`.
API responses should be typescript types or interfaces defined in the `packages/shared/*/*.response.ts`.

Follow existing code style and conventions.

Do not write summaries at the end of your work.

When writing tests and you need to make a request to the API, always use helper defined it `apps/api/test/helpers/[module].helper.ts`.
Even if you will be using a different module than the one currently being tested, use the helper for that module.

When writing tests on the backend, do not build the app. Run `pnpm test -- [module]` to run tests for a specific module, or `pnpm tests --  --testNamePattern=<test-name-pattern>` to run a specific test.
