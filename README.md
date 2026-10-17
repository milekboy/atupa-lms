This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Session foundation (Step 3)

See [session setup and test instructions](docs/step-03-review.md). Configure the server-only variables in `.env.example`; production requires Redis and APP_ORIGIN. Use `/login` for the session checkpoint and `/dashboard` to verify route protection. Registration, recovery and profile workflows are now available; the role-aware dashboard shell is implemented.


## Account workflows (Step 4)

See [review routes, test commands and outstanding email verification](docs/step-04-review.md). Registration is available at `/register` and `/register/school`, recovery at `/forgot-password`, and protected profile/security at `/dashboard/profile`. The local Next.js MCP diagnostics endpoint is disabled to avoid the observed development log/recompilation loop.

## Public discovery (Step 6)

The public homepage is `/`; browse `/courses` using languageCode, level and page URL parameters. Course outlines live at `/courses/[courseId]`. Data is loaded anonymously on the server through API_BASE_URL; no bearer tokens or authoring fields are sent to public clients. Premium flags are informational and do not grant lesson access. See [Step 6 review](docs/step-06-review.md) for evidence, manual checks and local Postman failure simulation instructions.

Checks: `npm run test:contracts`, `npm run test:catalog-http` (normal server on 3000), `npm run test:catalog-failures` (opt-in local simulation and test server on 3100), `npm run lint`, `npm run build`.
