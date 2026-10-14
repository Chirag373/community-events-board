import "dotenv/config";
import Database from "better-sqlite3";
import { SignJWT } from "jose";
import { test, expect } from "@playwright/test";
const visitorId = "admin-stage-test-visitor";
const eventTitle = "Admin stage test event";
const browserEventTitle = "Admin stage browser test event";
test.beforeAll(() => {
  const db = new Database("prisma/dev.db");
  db.prepare(
    "INSERT OR REPLACE INTO User (id,email,passwordHash,role) VALUES (?,?,?,?)",
  ).run(visitorId, "admin-stage-test@example.com", "unused-test-hash", "USER");
  db.close();
});
test.afterAll(() => {
  const db = new Database("prisma/dev.db");
  db.prepare("DELETE FROM Event WHERE title IN (?, ?)").run(
    eventTitle,
    browserEventTitle,
  );
  db.prepare("DELETE FROM User WHERE id = ?").run(visitorId);
  db.close();
});
test("admin APIs require a verified admin and retain inactive events", async ({
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
  expect(
    (
      await request.get("/api/admin/events", {
        headers: { Authorization: "Bearer forged" },
      })
    ).status(),
  ).toBe(401);
  const visitorToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(visitorId)
    .setIssuer("community-events")
    .setAudience("community-events-api")
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  const visitorHeaders = { Authorization: `Bearer ${visitorToken}` };
  expect(
    (
      await request.get("/api/admin/events", { headers: visitorHeaders })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/admin/events", {
        headers: visitorHeaders,
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.patch("/api/admin/events/sample-1", {
        headers: visitorHeaders,
        data: { active: false },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/admin/login", {
        data: { email: "admin@community.local", password: "Wrong@12345" },
      })
    ).status(),
  ).toBe(401);
  const login = await request.post("/api/admin/login", {
    data: { email: "admin@community.local", password: "Admin@12345" },
  });
  expect(login.ok()).toBeTruthy();
  expect((await login.json()).token.split(".")).toHaveLength(3);
  const list = await (await request.get("/api/admin/events")).json();
  expect(
    list.events.filter((event: { id: string }) =>
      event.id.startsWith("sample-"),
    ),
  ).toHaveLength(15);
  expect(
    (
      await request.post("/api/admin/events", { data: { title: "x" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/admin/events", {
        headers: { Origin: "https://other.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  const body = {
    title: eventTitle,
    category: "Music",
    city: "Coimbatore",
    startsAt: new Date(Date.now() + 86400000).toISOString(),
    price: 150000,
    description: "Test admin event created to check the database-backed API.",
    imageUrl: "https://example.com/event.jpg",
    active: true,
  };
  const created = await request.post("/api/admin/events", { data: body });
  expect(created.status()).toBe(201);
  const { event } = await created.json();
  expect(
    (
      await request.patch(`/api/admin/events/${event.id}`, {
        data: { active: false },
      })
    ).ok(),
  ).toBeTruthy();
  const saved = (
    await (await request.get("/api/admin/events")).json()
  ).events.find((item: { id: string }) => item.id === event.id);
  expect(saved.active).toBe(false);
  expect(saved.price).toBe(150000);
  expect((await request.delete(`/api/admin/events/${event.id}`)).status()).toBe(
    405,
  );
  await request.post("/api/admin/logout");
  expect((await request.get("/api/admin/events")).status()).toBe(401);
});
test("admin page is protected; login, status changes and logout work on screen", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Email address").fill("admin@community.local");
  await page.getByLabel("Password").fill("Admin@12345");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.locator('input[name="title"]').fill(browserEventTitle);
  await page.locator('input[name="city"]').fill("Coimbatore");
  await page
    .locator('input[name="startsAt"]')
    .fill(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  await page.locator('input[name="price"]').fill("499");
  await page
    .locator('input[name="imageUrl"]')
    .fill("https://example.com/event.jpg");
  await page
    .locator('textarea[name="description"]')
    .fill("A local event created to verify the admin form.");
  await page.getByRole("button", { name: "Add active event" }).click();
  await expect(page.getByText("Event added. It is now active.")).toBeVisible();
  const toggle = page.getByLabel(`Toggle ${browserEventTitle}`);
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  await page.reload();
  await expect(toggle).not.toBeChecked();
  await toggle.click();
  await expect(toggle).toBeChecked();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect(errors).toEqual([]);
});
