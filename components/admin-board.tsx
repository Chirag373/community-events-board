"use client";
import { Button, TextField, MenuItem, Switch } from "@mui/material";

const categories = ["Music", "Workshop", "Food", "Sports", "Kids"];
// Static examples for the UI preview. Database integration comes in a later stage.
const events = [
  {
    title: "Indie under the stars",
    category: "Music",
    city: "Coimbatore",
    date: "Fri, 16 Oct, 6:30 PM",
    active: true,
  },
  {
    title: "Clay, coffee & conversation",
    category: "Workshop",
    city: "Bengaluru",
    date: "Sat, 17 Oct, 6:30 PM",
    active: true,
  },
  {
    title: "Printmaking together",
    category: "Workshop",
    city: "Coimbatore",
    date: "Thu, 29 Oct, 6:30 PM",
    active: false,
  },
];

export default function AdminBoard() {
  return (
    <main className="container admin-page">
      <p className="eyebrow">THE COMMUNITY DESK</p>
      <h1>Make something happen.</h1>
      <p>Add a local event, or manage what’s visible to your neighbours.</p>
      <section className="admin-form-panel">
        <h2>Add an event</h2>
        <div className="admin-form">
          <TextField name="title" label="Event title" required />
          <TextField
            name="category"
            select
            label="Category"
            defaultValue="Music"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField name="city" label="City" required />
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
          />
          <TextField name="imageUrl" label="Image URL" type="url" required />
          <TextField
            className="form-wide"
            name="description"
            label="Description"
            required
            multiline
            rows={3}
          />
          <Button type="button" variant="contained">
            Add active event
          </Button>
        </div>
      </section>
      <section className="admin-events">
        <h2>
          All events <span className="muted">({events.length})</span>
        </h2>
        <p>Inactive and past events stay here. Nothing is deleted.</p>
        <div className="admin-table">
          {events.map((event) => (
            <div key={event.title} className="admin-row">
              <div>
                <strong>{event.title}</strong>
                <p>
                  {event.category} · {event.city} · {event.date}
                </p>
              </div>
              <label>
                <span>{event.active ? "Active" : "Inactive"}</span>
                <Switch
                  checked={event.active}
                  slotProps={{
                    input: {
                      readOnly: true,
                      "aria-label": `Toggle ${event.title}`,
                    },
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
