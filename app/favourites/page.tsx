"use client";
import { Button, Chip } from "@mui/material";
import { categories } from "@/components/preview-data";
export default function FavouritesPage() {
  return (
    <main className="narrow-page">
      <p className="eyebrow">MAKE IT PERSONAL</p>
      <h1>What’s your thing?</h1>
      <p>
        Pick the categories you love. We’ll fill your feed with upcoming events
        that feel like you.
      </p>
      <div className="interest-options">
        {categories.map((category, index) => (
          <Chip
            key={category}
            label={`${["♫", "✎", "♨", "↗", "☀"][index]} ${category}`}
            color={
              category === "Music" || category === "Food"
                ? "primary"
                : "default"
            }
            variant={
              category === "Music" || category === "Food"
                ? "filled"
                : "outlined"
            }
          />
        ))}
      </div>
      <p className="muted">2 selected · You can change these anytime.</p>
      <Button type="button" variant="contained">
        Save & see My Feed
      </Button>
    </main>
  );
}
