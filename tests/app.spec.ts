import Database from "better-sqlite3";
import { test, expect } from "@playwright/test";
const email = `test-${Date.now()}@example.com`;
const password = "Visitor@12345";
test("JSON API: access control, combined filters, persistence and validation", async ({
  request,
}) => {
  expect((await request.get("/api/admin/events")).status()).toBe(401);
  expect((await request.post("/api/admin/events", { data: {} })).status()).toBe(
    401,
  );
  expect(
    (
      await request.patch("/api/admin/events/sample-1", {
        data: { active: false },
      })
    ).status(),
  ).toBe(401);
  expect((await request.get("/api/feed")).status()).toBe(401);
  expect((await request.get("/api/events/sample-13")).status()).toBe(404);
  expect((await request.get("/api/events/sample-14")).status()).toBe(404);
  const combined = await (
    await request.get("/api/events?category=Music&city=Coimbatore&q=night")
  ).json();
  expect(combined.total).toBe(1);
  expect(combined.events[0].title).toBe("Jazz night at the courtyard");
  const first = await (await request.get("/api/events")).json();
  expect(first.total).toBe(12);
  expect(first.events).toHaveLength(6);
  const second = await (await request.get("/api/events?page=2")).json();
  expect(second.events).toHaveLength(6);
  expect(new Date(second.events[0].startsAt).getTime()).toBeGreaterThan(
    new Date(first.events[5].startsAt).getTime(),
  );
  const signup = await request.post("/api/auth/signup", {
    data: { email, password },
  });
  expect(signup.status()).toBe(201);
  const { token } = await signup.json();
  expect(token.split(".")).toHaveLength(3);
  expect((await request.get("/api/admin/events")).status()).toBe(403);
  expect(
    (
      await request.patch("/api/admin/events/sample-1", {
        data: { active: false },
      })
    ).status(),
  ).toBe(403);
  expect((await request.get("/api/feed")).ok()).toBeTruthy();
  expect((await (await request.get("/api/feed")).json()).total).toBe(0);
  await request.put("/api/favourites", {
    data: { categories: ["Music", "Food"] },
  });
  const feed = await (await request.get("/api/feed")).json();
  expect(feed.total).toBe(6);
  expect(
    feed.events.every((e: { category: string }) =>
      ["Music", "Food"].includes(e.category),
    ),
  ).toBeTruthy();
  expect(
    (
      await request.put("/api/reminders/sample-1", { data: { reminded: true } })
    ).ok(),
  ).toBeTruthy();
  expect(
    (await (await request.get("/api/events/sample-1")).json()).event.reminded,
  ).toBe(true);
  const design = { theme: "peach", stickers: ["✨", "🎵", "🌼"] };
  expect(
    (await request.put("/api/designs/sample-1", { data: design })).ok(),
  ).toBeTruthy();
  expect(
    (await (await request.get("/api/designs/sample-1")).json()).design,
  ).toEqual(design);
  expect(
    (
      await request.put("/api/designs/sample-1", {
        data: { ...design, stickers: ["✨", "✨", "✨", "✨"] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.put("/api/designs/sample-1", {
        data: { theme: "bogus", stickers: [] },
      })
    ).status(),
  ).toBe(400);
  await request.post("/api/auth/logout");
  expect(
    (
      await request.get("/api/feed", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).ok(),
  ).toBeTruthy();
  expect(
    (
      await request.get("/api/feed", {
        headers: { Authorization: "Bearer forged" },
      })
    ).status(),
  ).toBe(401);
  await request.post("/api/auth/login", {
    data: { email: "admin@community.local", password: "Admin@12345" },
  });
  const adminEvents = (await (await request.get("/api/admin/events")).json())
    .events;
  expect(
    adminEvents.filter((e: { id: string }) => e.id.startsWith("sample-")),
  ).toHaveLength(15);
  expect(
    (
      await request.post("/api/admin/events", { data: { title: "x" } })
    ).status(),
  ).toBe(400);
  const created = await request.post("/api/admin/events", {
    data: {
      title: "Test community meetup",
      category: "Food",
      city: "Test City",
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      price: 150000,
      description: "A test event used to verify admin creation.",
      imageUrl: "https://example.com/image.jpg",
    },
  });
  expect(created.status()).toBe(201);
  const { event } = await created.json();
  expect(
    (
      await request.patch(`/api/admin/events/${event.id}`, {
        data: { active: false },
      })
    ).ok(),
  ).toBeTruthy();
  expect((await request.get(`/api/events/${event.id}`)).status()).toBe(404);
  expect(
    (
      await request.post("/api/admin/events", {
        headers: { Origin: "https://other.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
});
test("browser: reminder rollback, refresh persistence, designer limit and responsive layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/favourites/);
  await page.goto("/events/sample-2");
  await expect(
    page.getByRole("heading", {
      name: "Clay, coffee & conversation",
      level: 1,
    }),
  ).toBeVisible();
  await page.route("**/api/reminders/*", async (route) => {
    await new Promise((r) => setTimeout(r, 500));
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Saving failed. Please try again." }),
    });
  });
  await page.getByRole("button", { name: "Remind me" }).click();
  await expect(
    page.getByRole("button", { name: "Reminder saved" }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({ hasText: "Saving failed" }),
  ).toContainText("Saving failed");
  await expect(page.getByRole("button", { name: "Remind me" })).toBeVisible();
  await page.unroute("**/api/reminders/*");
  await page.getByRole("button", { name: "Remind me" }).click();
  await expect(
    page.getByRole("button", { name: "Reminder saved" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "lavender theme" }).click();
  for (const s of ["🎵", "✨", "🌼"]) {
    const button = page.getByRole("button", { name: `Add ${s} sticker` });
    await expect(button).toBeEnabled();
    await button.click();
  }
  await expect(
    page.getByRole("button", { name: "Add 🍕 sticker" }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Reminder saved" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "lavender theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Remove 🎵 sticker 1" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Remove 🎵 sticker 1" }).click();
  await expect(
    page.getByRole("button", { name: "Add 🍕 sticker" }),
  ).toBeEnabled();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "What’s happening nearby" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".event-card")).toHaveCount(6);
  await page.screenshot({ path: "submission/phone.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".event-card")).toHaveCount(6);
  await page.screenshot({ path: "submission/laptop.png", fullPage: true });
  expect(errors).toEqual([]);
});

test.afterAll(() => {
  const db = new Database("prisma/dev.db");
  db.pragma("foreign_keys = ON");
  db.prepare('DELETE FROM "Event" WHERE title = ?').run(
    "Test community meetup",
  );
  db.prepare('DELETE FROM "User" WHERE email = ?').run(email);
  db.close();
});
