export const categories = [
  "Music",
  "Workshop",
  "Food",
  "Sports",
  "Kids",
] as const;
export const stickers = ["🎵", "✨", "🌼", "🍕", "💚"];
export const themes = {
  sage: "#dce7dc",
  peach: "#f6ded0",
  lavender: "#e5dff3",
};
export type User = { id: string; email: string; role: string };
export type Event = {
  id: string;
  title: string;
  category: string;
  city: string;
  startsAt: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  reminded?: boolean;
};
export type Design = { theme: keyof typeof themes; stickers: string[] };
export function price(value: number) {
  return value === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
}
export function date(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
