# Community Events Board

Next.js App Router, Material UI, Prisma 7 and SQLite. The admin is functional in this stage; visitor screens remain UI previews.

## Run locally

Requires Node.js 22.12+ or Node 24. No database service needed.

```bash
npm install
npm run setup
npm run dev
```

Open http://localhost:3000/admin. Unauthenticated visitors are redirected to `/admin/login`.

**Admin:** `admin@community.local` / `Admin@12345`

Setup generates a random JWT secret in `.env`, applies the checked-in migration and creates 15 sample events. Re-running it does not overwrite existing records. Sample dates are relative to the first setup date.

## Functional admin features

- Admin login with bcrypt password checks and a signed, seven-day JWT.
- Server protection on `/admin` and every event-management API.
- Add an event: title, category, city, India date/time, integer rupee price, description and image URL.
- Set an event Active or Inactive. Records are retained; there is no delete API.
- Loading, empty, error and success states, plus logout.

The browser uses an HttpOnly, SameSite=Lax session cookie (Secure in production). A mobile client can use the returned JWT as a Bearer token. The server verifies the token and looks up the database role; it never accepts an admin role from the request body. Write requests with a mismatched Origin are rejected.

## Admin JSON API

| Method | Path                    | Body / result                                       |
| ------ | ----------------------- | --------------------------------------------------- |
| POST   | `/api/admin/login`      | `{email,password}` → `{token,user}`                 |
| POST   | `/api/admin/logout`     | Clear the browser session cookie                    |
| GET    | `/api/admin/events`     | All events, including past/inactive; admin required |
| POST   | `/api/admin/events`     | Create an event; admin required                     |
| PATCH  | `/api/admin/events/:id` | `{active:true}` or false; admin required            |

Create-event body: `title`, `category`, `city`, `startsAt` (ISO timestamp with timezone), `price` (integer rupees), `description`, `imageUrl` (HTTP/S), optional `active`. Categories: Music, Workshop, Food, Sports, Kids. Errors return JSON `{error}` and an appropriate status code. Dates display in India time.

## Simple code flow

`components/admin-login.tsx` submits credentials through `lib/api.ts` and opens the admin page on success. `components/admin-board.tsx` has three main functions: `loadEvents`, `add` and `toggle`. Each calls its JSON endpoint and updates the screen.

`lib/auth.ts` verifies JWTs and checks the database role. `lib/validation.ts` validates request fields. `lib/http.ts` is the shared try/catch that turns failures into JSON errors. `lib/db.ts` reuses one Prisma client during development reloads.

## Database and design choices

`User(id,email,passwordHash,role)` stores the admin account. `Event(id,title,category,city,startsAt,price,description,imageUrl,active)` stores event records. SQLite keeps setup short, passwords are bcrypt hashes, prices are integer rupees and dates are stored as timestamps. Indexes on `(active,startsAt)` and `(active,category,city,startsAt)` prepare the events table for the later visitor queries.

## Checks

```bash
npm run lint
npm run build
npm start
```

With the app running, browser/API tests can be run using:

```bash
npx playwright install chromium
npm test
```

`TEST_URL` can point tests at a different local port. Tests check authentication/role restrictions, event creation, persistence, invalid input, cross-origin rejection and logout. They create and clean up their own test records.

## Remaining stages

Explore, My Feed, visitor login/signup, favourites, reminders and card designer still use static preview data. Their authentication, APIs, filtering, pagination and persistence are not included in this commit. Admin changes do not yet update the visitor preview cards. The complete visitor logic remains local for a later push.

For production, use HTTPS, a persistent writable SQLite file and a stable secret. Change the demo admin password before public deployment. There is no public hosting configured. Dependency advisories remain through the Prisma CLI and ESLint chains; no forced major downgrade has been applied.
