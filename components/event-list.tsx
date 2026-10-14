"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Skeleton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { categories, type Event } from "@/lib/shared";
import { api } from "@/lib/api";
import { useAuth } from "./providers";
import EventCard from "./event-card";
import EventHero from "./event-hero";
type Results = {
  events: Event[];
  total: number;
  pages: number;
  cities: string[];
};
export default function EventList({ feed = false }: { feed?: boolean }) {
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (authLoading) return;
    if (feed && !user) return;
    let ignoreResponse = false;
    async function loadEvents() {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        category,
        city,
        q,
        page: String(page),
      });
      try {
        const result = await api<Results>(
          `${feed ? "/feed" : "/events"}?${params}`,
        );
        if (!ignoreResponse) setData(result);
      } catch (error) {
        if (!ignoreResponse) setError((error as Error).message);
      } finally {
        if (!ignoreResponse) setLoading(false);
      }
    }
    // Loading belongs to this request; the initial render already shows a skeleton.
    loadEvents();
    // An older request must not replace the results of a newer filter selection.
    return () => {
      ignoreResponse = true;
    };
  }, [category, city, q, page, feed, user, authLoading, retry]);
  function clear() {
    setCategory("");
    setCity("");
    setSearch("");
    setQ("");
    setPage(1);
  }
  function renderEvents() {
    if (error)
      return (
        <Alert
          severity="error"
          action={<Button onClick={() => setRetry((v) => v + 1)}>Retry</Button>}
        >
          {error}
        </Alert>
      );
    if (loading)
      return (
        <div className="event-grid">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="rounded" height={380} />
          ))}
        </div>
      );
    if (!data || data.events.length === 0)
      return (
        <div className="empty-state">
          <span>✳</span>
          <h3>
            {feed ? "Good plans are on their way" : "No plans found just yet"}
          </h3>
          <p>
            {feed
              ? "Choose your interests, or try a different filter. Your next favourite event might be just around the corner."
              : "Try another city, category or search. There’s more to discover."}
          </p>
          <Button onClick={clear}>Clear filters</Button>
          {feed && (
            <Button component={Link} href="/favourites">
              Choose interests
            </Button>
          )}
        </div>
      );
    return (
      <>
        <div className="event-grid">
          {data.events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        {data.pages > 1 && (
          <Pagination
            className="pagination"
            count={data.pages}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              document
                .getElementById("events")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            color="primary"
          />
        )}
      </>
    );
  }

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
        {feed && !authLoading && !user ? (
          <div className="empty-state">
            <span>♡</span>
            <h3>Make this space yours</h3>
            <p>
              Log in and pick your favourite categories to find your next plan.
            </p>
            <Button component={Link} href="/login" variant="contained">
              Log in
            </Button>
          </div>
        ) : (
          <>
            <div className="filters">
              <TextField
                className="search-field"
                placeholder="Search events, find your thing…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="city-field"
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (value) => String(value || "All cities"),
                  },
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
                <MenuItem value="">All cities</MenuItem>
                {data?.cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="category-filters">
              {["", ...categories].map((c, i) => (
                <Chip
                  key={c}
                  label={`${["✳", "♫", "✎", "♨", "↗", "☀"][i]}  ${c || "All events"}`}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                  className={category === c ? "selected-filter" : ""}
                  variant={category === c ? "filled" : "outlined"}
                />
              ))}
            </div>
            <div className="results-label" aria-live="polite">
              {loading
                ? "Finding your next plan…"
                : `${data?.total || 0} events to look forward to`}
              {(category || city || search) && (
                <button onClick={clear}>Clear filters</button>
              )}
            </div>
            {renderEvents()}
          </>
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
            href={user ? "/favourites" : "/signup"}
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
