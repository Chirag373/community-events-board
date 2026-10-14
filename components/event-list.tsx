"use client";
import Link from "next/link";
import {
  Button,
  Chip,
  MenuItem,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { categories, events, feedPreview } from "./preview-data";
import EventHero from "./event-hero";
import EventCard from "./event-card";
export default function EventList({ feed = false }: { feed?: boolean }) {
  const preview = feed ? feedPreview : events;
  return (
    <main className="container">
      <EventHero feed={feed} />
      <section id="events" className="events-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">MAKE ROOM FOR SOMETHING GOOD</p>
            <h2>{feed ? "My Feed" : "What’s happening nearby"}</h2>
          </div>
          <span className="sorted-label">Upcoming · Soonest first</span>
        </div>
        <div className="filters">
          <TextField
            className="search-field"
            placeholder="Search events, find your thing…"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Search events" },
            }}
          />
          <TextField
            select
            label="City"
            defaultValue="all"
            className="city-field"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          >
            <MenuItem value="all">All cities</MenuItem>
            {["Bengaluru", "Chennai", "Coimbatore"].map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="category-filters">
          <Chip label="✳ All events" className="selected-filter" />
          {categories.map((category, index) => (
            <Chip
              key={category}
              label={`${["♫", "✎", "♨", "↗", "☀"][index]} ${category}`}
              variant="outlined"
            />
          ))}
        </div>
        <div className="results-label">
          {preview.length} events to look forward to
        </div>
        <div className="event-grid">
          {preview.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {!feed && (
          <Pagination
            className="pagination"
            count={2}
            page={1}
            color="primary"
          />
        )}
      </section>
      {!feed && (
        <aside className="bottom-note">
          <span>✳</span>
          <div>
            <h3>Less scrolling. More showing up.</h3>
            <p>Pick your interests and let your next great plan find you.</p>
          </div>
          <Button
            component={Link}
            href="/signup"
            variant="outlined"
            endIcon={<ArrowOutwardIcon />}
          >
            Make it personal
          </Button>
        </aside>
      )}
    </main>
  );
}
