"use client";
import Link from "next/link";
import { Chip } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import type { Event } from "@/lib/shared";
import { price, date } from "@/lib/shared";
import Reminder from "./reminder";
export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="event-card">
      <Link className="card-photo" href={`/events/${event.id}`}>
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
        <p className="event-date">{date(event.startsAt)}</p>
        <Link href={`/events/${event.id}`} className="card-title">
          {event.title}
        </Link>
        <p className="event-city">
          <PlaceOutlinedIcon sx={{ fontSize: 17 }} />
          {event.city}
        </p>
        <div className="card-bottom">
          <strong>{price(event.price)}</strong>
          <Reminder
            key={`${event.id}-${event.reminded}`}
            id={event.id}
            initial={event.reminded}
          />
        </div>
      </div>
    </article>
  );
}
