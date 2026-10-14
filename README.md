# Community Events Board — UI Preview

Next.js App Router and Material UI. This stage adds the visitor screens to the existing admin UI.

## Run

Requires Node.js 22.12+ or Node 24.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Screens

- `/`: event cards, search/city/category controls and pagination visuals.
- `/feed`: fixed sample of the personalised feed layout.
- `/login` and `/signup`: email/password form designs.
- `/favourites`: favourite-category selection design.
- `/events/sample-1`: event detail, reminder button and card designer preview.
- `/admin`: previously added admin form and static event list.

The green/neutral theme and responsive phone/laptop layouts are shared throughout. Preview data is hard-coded in `components/preview-data.ts`. The card links open the same sample detail preview.

This commit contains display components only. Search, filtering, pagination, authentication, category selection, reminders, card editing and admin saves are not implemented yet. Buttons and chips are visual placeholders. There are no JSON APIs, database dependencies or saved state. The complete application logic will be added in later stages.

## Checks

```bash
npm run lint
npm run build
```
