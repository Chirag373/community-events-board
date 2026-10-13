# Community Events Board — Admin UI

First stage: responsive admin interface built with Next.js App Router and Material UI.

## Run

Requires Node.js 22.12+ or 24.

```bash
npm install
npm run dev
```

Open http://localhost:3000/admin (the home page also shows the admin preview).

## Included

- Admin header and matching green/neutral theme.
- Event form with title, category, city, date/time, price, description and image URL.
- Event list with three static preview rows and active/inactive switch visuals.
- Phone and laptop layouts.

This is a UI preview. The add button and status switches do not save or change events. Login, server protection, JSON APIs, database integration and visitor pages are deferred to later stages. No credentials are needed for this preview.

Validation: `npm run lint` and `npm run build`.
