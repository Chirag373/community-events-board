export const categories = [
  "Music",
  "Workshop",
  "Food",
  "Sports",
  "Kids",
] as const;
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
