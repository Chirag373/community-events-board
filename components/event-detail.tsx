"use client";
import Link from "next/link";
import { Chip } from "@mui/material";
import { events } from "./preview-data";
import Reminder from "./reminder";
import Designer from "./designer";
export default function EventDetail() {
  const event = events[0];
  return (
    <main className="container detail-page">
      <Link href="/" className="back-link">
        ← Back to events
      </Link>
      <div className="detail-main">
        <div className="detail-photo">
          <img src={event.imageUrl} alt={event.title} />
        </div>
        <div className="detail-copy">
          <Chip label={event.category} color="primary" variant="outlined" />
          <h1>{event.title}</h1>
          <p className="event-date">{event.date}</p>
          <p>⌖ {event.city}</p>
          <p className="detail-description">{event.description}</p>
          <div className="detail-price">
            <strong>{event.price}</strong>
            <Reminder />
          </div>
          <small className="muted">Reminders are saved to your account.</small>
        </div>
      </div>
      <Designer event={event} />
    </main>
  );
}
