# Community Events Board

A small, responsive Next.js App Router app with Material UI, Prisma 7 and SQLite. Browse local events, choose interests, save reminders and personalise an event card. Admins can add events and switch them active/inactive; there is no delete endpoint.

## Run locally (about 2 minutes)

Requires Node.js **22.12+** (or Node 24) and npm. No database service or paid account required.

```bash
npm install
npm run setup
npm run dev
```

Open http://localhost:3000. Setup generates Prisma Client, applies the checked-in migration, creates a random JWT secret in `.env`, and seeds 15 events. Re-running setup does not overwrite users or events. Sample dates are relative to the first setup date. To start fresh later, stop the server, remove `prisma/dev.db`, and run setup again (this removes all local data).

Admin: **admin@community.local** / **Admin@12345**. Log in at `/admin/login`, then open `/admin`. The shared `/login` also accepts the admin account. Visitors create their own account at `/signup`. After login they choose categories at `/favourites`, then see `/feed`.

```bash
npm run lint
npm run build
npm start
```

`npm start` uses the production build. Production needs a persistent writable SQLite file and the same `.env` values. Use HTTPS for the secure session cookie. Change the seeded admin password before a public deployment.

## JSON API

All UI data reads and writes use `/api`. Responses are JSON; errors use `{ "error": "message" }` and appropriate HTTP status codes. Auth endpoints return `{ token, user }`. Browser auth uses an HttpOnly cookie; a mobile client can send `Authorization: Bearer <token>`. Tokens expire after 7 days. No password hash is returned.

| Method     | Endpoint                                                    | Purpose                                                                 |
| ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| POST       | `/api/auth/signup`                                          | `{email,password}`; create account and return JWT                       |
| POST       | `/api/auth/login`                                           | `{email,password}`; return JWT and set browser cookie                   |
| GET        | `/api/auth/me`                                              | Current user, or null                                                   |
| POST       | `/api/auth/logout`                                          | Clear browser session cookie                                            |
| GET        | `/api/events?category=Music&city=Coimbatore&q=night&page=1` | Combined filters, upcoming active events, 6 per page                    |
| GET        | `/api/events/:id`                                           | Upcoming active event and current user's reminder state                 |
| GET        | `/api/feed`                                                 | Same filters/pagination, restricted to saved categories; login required |
| GET / PUT  | `/api/favourites`                                           | Read/replace `{categories:["Music","Food"]}`; login required            |
| PUT        | `/api/reminders/:id`                                        | Save `{reminded:true}` or false; login required                         |
| GET / PUT  | `/api/designs/:id`                                          | Read/save `{theme:"sage",stickers:["✨"]}`; login required              |
| POST       | `/api/admin/login`                                          | Dedicated admin login; `{email,password}` → `{token,user}`              |
| POST       | `/api/admin/logout`                                         | Clear the admin browser session                                         |
| GET / POST | `/api/admin/events`                                         | List all / create event; admin required                                 |
| PATCH      | `/api/admin/events/:id`                                     | `{active:false}`; admin required                                        |

Create-event body: `title`, `category`, `city`, `startsAt` (ISO 8601 timestamp with timezone), `price` (integer rupees), `description`, `imageUrl` (HTTP/S), optional `active`. Valid categories: Music, Workshop, Food, Sports, Kids. Themes: sage, peach, lavender. Stickers: 🎵 ✨ 🌼 🍕 💚; maximum 3. Dates display in India time and prices use `en-IN` formatting.

## Three short answers

### Database structure — why this design?

`User(id,email,passwordHash,role)` and `Event(id,title,category,city,startsAt,price,description,imageUrl,active)` hold the core records.<br />
`Favourite(userId,category)`, `Reminder(userId,eventId)` and `CardDesign(userId,eventId,theme,stickers)` reference their owners.<br />
Composite primary keys prevent duplicate favourites, reminders or designs. Stickers use a small JSON array; foreign keys keep relations valid.<br />
SQLite keeps setup simple, with no service to configure. Integer rupees avoid floating-point price errors.

### How do filters work, and what index would you add?

Prisma builds one `AND` query: active + future start + optional category + exact city + title/description substring search.<br />
The feed adds a category `IN` condition based on saved favourites; pagination applies `skip`/`take` to that same query.<br />
Results sort by `startsAt`, then `id` for stable ties. Count and page queries run in one transaction.<br />
Indexes on `(active,startsAt)` and `(active,category,city,startsAt)` are already included. For larger text datasets, add SQLite FTS5; ordinary indexes do not accelerate substring search.

### Password storage and admin protection

Passwords use bcrypt with a random salt and cost 12; input is limited to 8–72 characters. JWT signatures use a generated secret and validate issuer, audience and expiry.<br />
The browser cookie is HttpOnly, SameSite=Lax and Secure in production; write APIs reject a mismatched Origin. Mobile clients use Bearer auth.<br />
The `/admin` server component checks the database user role before rendering, and every admin API independently checks it before reading or writing.<br />
Role and ownership come from the verified session, never from client request fields. Logout clears the cookie; issued mobile JWTs expire naturally.

## Code map

- `app/api/`: small JSON route handlers; `lib/`: database, auth, validation and shared query helpers.
- `components/`: Material UI forms, responsive lists, optimistic reminder button and live card designer.
- `prisma/`: schema, initial migration and 15 sample events (12 active upcoming, 1 inactive upcoming, 2 past).
- `tests/app.spec.ts`: API access/filter/persistence tests and browser checks for reminder rollback, designer limits and responsive layout.

The visitor migration adds only the favourites, reminders and card-design tables; existing admin accounts and events are preserved. Run `npm run setup` after pulling this stage.

The UI uses Material UI's [official Next.js integration](https://mui.com/material-ui/integrations/nextjs/). Images are external Unsplash URLs, with a coloured fallback if unavailable. Plain image tags intentionally support arbitrary admin image URLs without a remote-host allowlist.

## Browser tests

With the app running in another terminal:

```bash
npx playwright install chromium
npm test
```

Both admin and visitor suites create temporary users/events and clean them up afterward. `TEST_URL` can point to another local port. Phone/laptop screenshots are in `submission/`.

## Submission and remaining work

Repository: https://github.com/Chirag373/community-events-board<br />
A captioned walkthrough and narration outline have been prepared locally for a separate submission stage. Add your own voice to meet the assignment’s “in your own words” requirement.

All requested application features are implemented. “Remind me” saves an in-app flag; email/push delivery is outside the requested scope. Card personalisation requires login so choices belong to the user and persist across devices. Public hosting is not configured.

`npm audit` reports advisories in the Prisma CLI / ESLint dependency chains. Four also appear with `--omit=dev` because Prisma Client includes the CLI as a peer dependency. They involve config merging and an unused MySQL driver, rather than the SQLite query path; an upstream dependency update is still needed. No forced major downgrade was applied.

## How to explain the code in an interview

The application follows one flow: **button → JSON API → database → response → screen update**. There is no Redux, custom state framework or separate service layer.

| File                         | Plain explanation                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `lib/api.ts`                 | Calls `fetch`, sends JSON, and throws an error when the response fails. Screens call `api(path, method, body)`.                      |
| `lib/auth.ts`                | Reads a cookie or Bearer token, verifies it, and looks up the user. `requireUser` checks login; `requireAdmin` also checks the role. |
| `lib/http.ts`                | A shared `try/catch` for API routes. It converts validation, login and server errors into JSON, and rejects cross-origin writes.     |
| `lib/validation.ts`          | Lists the allowed fields and values. Zod checks these before a database write.                                                       |
| `lib/events.ts`              | Starts with active future events, then adds each filter with an `if`. Prisma combines those conditions with AND.                     |
| `components/event-list.tsx`  | Keeps filters in React state and reloads the list when they change. Loading, error and empty states render separately.               |
| `components/reminder.tsx`    | Stores the old value, updates the button immediately, saves through the API, and restores the old value if saving fails.             |
| `components/designer.tsx`    | `chooseTheme`, `addSticker` and `removeSticker` build the next design. `saveDesign` updates the preview and saves it.                |
| `components/admin-board.tsx` | Reads named form fields, sends a create request, and reloads the list. A switch sends an active/inactive update.                     |

Read the login route first, then the events query, then the reminder button. These three files show most of the application's patterns.

A few small safeguards are intentional:

- `ignoreResponse` becomes true when an effect is cleaned up. This stops an older filter response from replacing newer results.
- A database transaction groups writes that belong together. Replacing favourites removes the old rows and inserts the new rows as one operation.
- Composite keys such as `(userId,eventId)` ensure one reminder or design per user and event. `upsert` means “update if it exists; otherwise create”.
- Password hashing, JWT verification and input validation use libraries. The app calls their functions rather than implementing cryptography itself.
- `lib/db.ts` reuses the database client during Next.js development reloads. `connection()` in the API helper tells Next.js to run the handler for a real request.
