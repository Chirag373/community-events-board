// Display-only fixture data. No database, filtering or saved preferences in this stage.
export const categories = ["Music", "Workshop", "Food", "Sports", "Kids"];
export const stickers = ["🎵", "✨", "🌼", "🍕", "💚"];
export const themes = {
  sage: "#dce7dc",
  peach: "#f6ded0",
  lavender: "#e5dff3",
};
export const events = [
  {
    id: "sample-1",
    title: "Indie under the stars",
    category: "Music",
    city: "Coimbatore",
    date: "Fri, 16 Oct, 6:30 PM",
    price: "₹499",
    description:
      "An evening of acoustic sets, local indie bands and good company beneath the open sky.",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sample-2",
    title: "Clay, coffee & conversation",
    category: "Workshop",
    city: "Bengaluru",
    date: "Sat, 17 Oct, 6:30 PM",
    price: "₹1,200",
    description:
      "Slow down and make something with your hands. A beginner-friendly pottery workshop with all materials included.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sample-3",
    title: "The neighbourhood food fair",
    category: "Food",
    city: "Chennai",
    date: "Sun, 18 Oct, 6:30 PM",
    price: "Free",
    description:
      "Meet local cooks and discover delicious street food, regional favourites and fresh bakes.",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sample-4",
    title: "Sunday morning run club",
    category: "Sports",
    city: "Coimbatore",
    date: "Mon, 19 Oct, 6:30 PM",
    price: "Free",
    description: "A friendly five-kilometre run for every pace.",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sample-5",
    title: "Little artists, big ideas",
    category: "Kids",
    city: "Bengaluru",
    date: "Tue, 20 Oct, 6:30 PM",
    price: "₹350",
    description: "A colourful afternoon of painting and playful creativity.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sample-6",
    title: "Jazz night at the courtyard",
    category: "Music",
    city: "Coimbatore",
    date: "Wed, 21 Oct, 6:30 PM",
    price: "₹750",
    description: "Live jazz, soulful melodies and a relaxed courtyard setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1000&q=80",
  },
];
export type EventPreview = (typeof events)[number];
// Fixed feed example, not a query or preference calculation.
export const feedPreview = [events[0], events[2], events[5]];
