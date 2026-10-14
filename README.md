# Community Events Board

A small app for local events. The admin can add events and make them active or inactive. Visitors can browse events, choose favourite categories, save reminders and design an event card.

Built with Next.js App Router, Material UI, Prisma and SQLite.

## Setup

Use Node.js 24 and npm.

```bash
npm install
npm run setup
npm run dev
```

Open http://localhost:3000.

The setup command creates the database, adds 15 sample events and creates the `.env` file. Running it again keeps the existing data.

## Admin login

Log in at `/login`, then open `/admin`.

- Email: `admin@community.local`
- Password: `Admin@12345`

The admin can add an event or change its status. Events are kept in the database when they are inactive.

## Visitor pages

- `/` — Browse events and filter by category, city and search text.
- `/signup` and `/login` — Create an account or log in.
- `/favourites` — Choose favourite categories.
- `/feed` — See upcoming events from those categories.
- `/events/:id` — View an event, save a reminder and design its card.

The event list shows active events that have not started yet, with the nearest date first. There are six events on each page.

Reminders and card designs stay saved after a refresh. If a reminder cannot be saved, the button goes back to its old state and shows an error.

## API list

All pages use the app's JSON APIs. Login returns a token called a JWT. A mobile app can send it as `Authorization: Bearer <token>`.

| Method | URL | What it does |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account with email and password |
| POST | `/api/auth/login` | Log in with email and password |
| POST | `/api/auth/logout` | Log out of the browser |
| GET | `/api/auth/me` | Get the logged-in user |
| GET | `/api/events` | Get events with filters and page number |
| GET | `/api/events/:id` | Get one event |
| GET | `/api/feed` | Get events from favourite categories |
| GET / PUT | `/api/favourites` | Read or save favourite categories |
| PUT | `/api/reminders/:id` | Save or remove a reminder |
| GET / PUT | `/api/designs/:id` | Read or save a card design |
| GET / POST | `/api/admin/events` | List all events or add an event |
| PATCH | `/api/admin/events/:id` | Make an event active or inactive |

Example filter:

```text
/api/events?category=Music&city=Coimbatore&q=night&page=1
```

Adding an event needs `title`, `category`, `city`, `startsAt`, `price`, `description` and `imageUrl`. `startsAt` is a date and time with a timezone. `price` is a whole number in rupees.

Favourite categories use `{ "categories": ["Music", "Food"] }`. Reminders use `{ "reminded": true }`. Card designs use `{ "theme": "sage", "stickers": ["✨"] }`.

## Database structure

- `User` stores the user ID, email, password hash and role.
- `Event` stores the event ID, title, category, city, date/time, price, description, image URL and status.
- `Favourite` stores a user ID and category. `Reminder` stores a user ID and event ID. `CardDesign` stores a user ID, event ID, theme and stickers.
- SQLite makes setup easy. Each saved choice belongs to a user. Unique keys stop the same reminder or design from being saved twice for one event.

## How do the filters work? What index would help?

- Category, city and search text are checked together. The text is searched in the title and description.
- Only active events with a future date are returned. They are sorted by date, with six events per page.
- My Feed also checks the user's saved categories.
- Indexes on `(active, startsAt)` and `(active, category, city, startsAt)` are included to help these queries. For more text data, a full-text search index would help.

## How are passwords and admin access protected?

- Passwords are saved as bcrypt hashes.
- Login creates a signed JWT that lasts for seven days.
- The browser keeps it in an HttpOnly cookie, which JavaScript cannot read.
- The server checks the admin role before showing the admin page and before running any admin API.

## Checks

```bash
npm run lint
npm run build
```

For browser and API tests, keep the app running in another terminal:

```bash
npx playwright install chromium
npm test
```

## What is left?

The app features are complete. The screen recording is not included in the GitHub repo yet.
