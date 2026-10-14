import { z } from "zod";
import { categories } from "./shared";
export const credentials = z.object({
  email: z
    .email()
    .max(254)
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters.")
    .max(72)
    .refine(
      (v) => Buffer.byteLength(v, "utf8") <= 72,
      "Password must be at most 72 bytes.",
    ),
});
export const eventInput = z.object({
  title: z.string().trim().min(3).max(120),
  category: z.enum(categories),
  city: z.string().trim().min(2).max(80),
  startsAt: z.iso.datetime({ offset: true }).transform((v) => new Date(v)),
  price: z.number().int().min(0).max(100000000),
  description: z.string().trim().min(10).max(5000),
  imageUrl: z
    .url()
    .max(2000)
    .refine((v) => /^https?:\/\//.test(v), "Use an http or https image URL."),
  active: z.boolean().default(true),
});
