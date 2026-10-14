"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  MenuItem,
  Switch,
  CircularProgress,
} from "@mui/material";
import { api } from "@/lib/api";
import { categories, date, type Event } from "@/lib/shared";
export default function AdminBoard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [toggling, setToggling] = useState("");
  async function loadEvents() {
    setLoading(true);
    try {
      setEvents((await api<{ events: Event[] }>("/admin/events")).events);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // Load the admin list once when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, []);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    setSuccess("");
    // The form explicitly uses India time, independent of the visitor's device timezone.
    const body = {
      title: data.get("title"),
      category: data.get("category"),
      city: data.get("city"),
      startsAt: new Date(`${data.get("startsAt")}:00+05:30`).toISOString(),
      price: Number(data.get("price")),
      description: data.get("description"),
      imageUrl: data.get("imageUrl"),
      active: true,
    };
    try {
      await api("/admin/events", "POST", body);
      form.reset();
      setSuccess("Event added. It is now active.");
      await loadEvents();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function toggle(event: Event) {
    setToggling(event.id);
    setError("");
    try {
      await api(`/admin/events/${event.id}`, "PATCH", {
        active: !event.active,
      });
      setEvents((all) =>
        all.map((e) => (e.id === event.id ? { ...e, active: !e.active } : e)),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setToggling("");
    }
  }
  async function logout() {
    try {
      await api("/admin/logout", "POST");
      router.replace("/admin/login");
    } catch (error) {
      setError((error as Error).message);
    }
  }

  return (
    <main className="container admin-page">
      <p className="eyebrow">THE COMMUNITY DESK</p>
      <h1>Make something happen.</h1>
      <p>Add a local event, or manage what’s visible to your neighbours.</p>
      <Button type="button" variant="outlined" onClick={logout}>
        Log out
      </Button>
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => {
                setError("");
                loadEvents();
              }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {success && <Alert severity="success">{success}</Alert>}
      <section className="admin-form-panel">
        <h2>Add an event</h2>
        <form onSubmit={add} className="admin-form">
          <TextField
            name="title"
            label="Event title"
            required
            slotProps={{ htmlInput: { minLength: 3, maxLength: 120 } }}
          />
          <TextField
            name="category"
            select
            label="Category"
            defaultValue="Music"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="city"
            label="City"
            required
            slotProps={{ htmlInput: { minLength: 2, maxLength: 80 } }}
          />
          <TextField
            name="startsAt"
            label="Date & time (IST)"
            type="datetime-local"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            name="price"
            label="Price in rupees"
            type="number"
            required
            defaultValue={0}
            slotProps={{ htmlInput: { min: 0, max: 100000000, step: 1 } }}
          />
          <TextField name="imageUrl" label="Image URL" type="url" required />
          <TextField
            className="form-wide"
            name="description"
            label="Description"
            required
            multiline
            rows={3}
            slotProps={{ htmlInput: { minLength: 10, maxLength: 5000 } }}
          />
          <Button type="submit" disabled={busy} variant="contained">
            {busy ? "Adding…" : "Add active event"}
          </Button>
        </form>
      </section>
      <section className="admin-events">
        <h2>
          All events <span className="muted">({events.length})</span>
        </h2>
        <p>Inactive and past events stay here. Nothing is deleted.</p>
        {loading ? (
          <CircularProgress />
        ) : !events.length ? (
          <div className="empty-state">
            No events yet. Add your first one above.
          </div>
        ) : (
          <div className="admin-table">
            {events.map((event) => (
              <div key={event.id} className="admin-row">
                <div>
                  <strong>{event.title}</strong>
                  <p>
                    {event.category} · {event.city} · {date(event.startsAt)}
                  </p>
                </div>
                <label>
                  <span>{event.active ? "Active" : "Inactive"}</span>
                  <Switch
                    checked={event.active}
                    disabled={!!toggling}
                    onChange={() => toggle(event)}
                    slotProps={{
                      input: { "aria-label": `Toggle ${event.title}` },
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
