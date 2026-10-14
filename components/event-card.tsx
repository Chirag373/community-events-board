"use client";
import Link from "next/link";
import { Chip } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import type { EventPreview } from "./preview-data";
import Reminder from "./reminder";
export default function EventCard({ event }: { event: EventPreview }) {
  return (
    <article className="event-card">
      <Link className="card-photo" href="/events/sample-1">
        <div className="photo-fallback" />
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <Chip
          label={event.category}
          size="small"
          className={`category-tag tag-${event.category.toLowerCase()}`}
        />
        <span className="photo-arrow">
          <ArrowOutwardIcon fontSize="small" />
        </span>
      </Link>
      <div className="card-body">
        <p className="event-date">{event.date}</p>
        <Link href="/events/sample-1" className="card-title">
          {event.title}
        </Link>
        <p className="event-city">
          <PlaceOutlinedIcon sx={{ fontSize: 17 }} />
          {event.city}
        </p>
        <div className="card-bottom">
          <strong>{event.price}</strong>
          <Reminder />
        </div>
      </div>
    </article>
  );
}
