import "dotenv/config";
import { hash } from "bcryptjs";
import { db } from "../lib/db";
const samples = [
  [
    "Indie under the stars",
    "Music",
    "Coimbatore",
    3,
    499,
    "1516280440614-37939bbacd81",
    "An evening of acoustic sets, local indie bands and good company beneath the open sky.",
  ],
  [
    "Clay, coffee & conversation",
    "Workshop",
    "Bengaluru",
    4,
    1200,
    "1455390582262-044cdead277a",
    "Slow down and make something with your hands. A beginner-friendly pottery workshop with all materials included.",
  ],
  [
    "The neighbourhood food fair",
    "Food",
    "Chennai",
    5,
    0,
    "1555939594-58d7cb561ad1",
    "Meet local cooks and discover delicious street food, regional favourites and fresh bakes.",
  ],
  [
    "Sunday morning run club",
    "Sports",
    "Coimbatore",
    6,
    0,
    "1552674605-db6ffd4facb5",
    "A friendly five-kilometre run for every pace. Bring water, comfortable shoes and your neighbours.",
  ],
  [
    "Little artists, big ideas",
    "Kids",
    "Bengaluru",
    7,
    350,
    "1513364776144-60967b0f800f",
    "A colourful afternoon of painting and playful creativity for children aged five to twelve.",
  ],
  [
    "Jazz night at the courtyard",
    "Music",
    "Coimbatore",
    8,
    750,
    "1415201364774-f6f0bb35f28f",
    "Live jazz, soulful melodies and a relaxed courtyard setting. Spend your evening with our local quartet.",
  ],
  [
    "Bake your first sourdough",
    "Workshop",
    "Chennai",
    9,
    1800,
    "1509440159596-0249088772ff",
    "Learn to mix, shape and bake a beautiful loaf. Take home your starter and a simple recipe.",
  ],
  [
    "Chai & street bites",
    "Food",
    "Coimbatore",
    10,
    150,
    "1504674900247-0877df9cc836",
    "A tasting trail of neighbourhood snacks, fragrant chai and the stories behind them.",
  ],
  [
    "Weekend badminton social",
    "Sports",
    "Bengaluru",
    11,
    250,
    "1622279457486-62dcc4a431d6",
    "Friendly doubles games for beginners and regular players. Courts and shuttles are included.",
  ],
  [
    "Stories in the park",
    "Kids",
    "Chennai",
    12,
    0,
    "1503676260728-1c00da094a0b",
    "Join an interactive storytelling circle with songs, imagination and a little outdoor adventure.",
  ],
  [
    "Garden music night",
    "Music",
    "Chennai",
    14,
    600,
    "1470229722913-7c0e2dbbafd3",
    "Local musicians share their favourite songs in an intimate garden concert.",
  ],
  [
    "A taste of the harvest",
    "Food",
    "Bengaluru",
    15,
    150000,
    "1414235077428-338989a2e8c0",
    "A special community dining experience celebrating seasonal produce and regional flavours.",
  ],
  [
    "Printmaking together",
    "Workshop",
    "Coimbatore",
    16,
    900,
    "1455390582262-044cdead277a",
    "Explore block printing in a relaxed studio session. This upcoming event is currently inactive.",
  ],
  [
    "Last season’s football meetup",
    "Sports",
    "Chennai",
    -5,
    100,
    "1574629810360-7efbbe195018",
    "A past community football meetup, kept as a sample for upcoming-event filtering.",
  ],
  [
    "Summer art camp",
    "Kids",
    "Coimbatore",
    -12,
    500,
    "1513364776144-60967b0f800f",
    "A past, inactive art camp retained in the admin board.",
  ],
] as const;
async function main() {
  await db.user.upsert({
    where: { email: "admin@community.local" },
    update: {},
    create: {
      email: "admin@community.local",
      passwordHash: await hash("Admin@12345", 12),
      role: "ADMIN",
    },
  });
  for (const [
    i,
    [title, category, city, days, price, photo, description],
  ] of samples.entries()) {
    const startsAt = new Date();
    startsAt.setUTCDate(startsAt.getUTCDate() + days);
    startsAt.setUTCHours(13, 0, 0, 0);
    await db.event.upsert({
      where: { id: `sample-${i + 1}` },
      update: {},
      create: {
        id: `sample-${i + 1}`,
        title,
        category,
        city,
        startsAt,
        price,
        description,
        imageUrl: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1000&q=80`,
        active: i !== 12 && i !== 14,
      },
    });
  }
  console.log("15 sample events ready. Admin: admin@community.local");
}
main().finally(() => db.$disconnect());
