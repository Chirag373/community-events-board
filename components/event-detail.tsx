"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Button, Chip, Skeleton } from "@mui/material";
import { api } from "@/lib/api";
import { date, price, type Event } from "@/lib/shared";
import { useAuth } from "./providers";
import Reminder from "./reminder";
import Designer from "./designer";
export default function EventDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let ignoreResponse = false;
    async function loadEvent() {
      try {
        const result = await api<{ event: Event }>(`/events/${id}`);
        if (!ignoreResponse) setEvent(result.event);
      } catch (error) {
        if (!ignoreResponse) setError((error as Error).message);
      }
    }
    loadEvent();
    return () => {
      ignoreResponse = true;
    };
  }, [id, user, retry]);
  return (
    <main className="container detail-page">
      <Link href="/" className="back-link">
        ← Back to events
      </Link>
      {error ? (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => {
                setError("");
                setRetry((v) => v + 1);
              }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : !event ? (
        <Skeleton variant="rounded" height={440} />
      ) : (
        <>
          <div className="detail-main">
            <div className="detail-photo">
              <img
                src={event.imageUrl}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
            <div className="detail-copy">
              <Chip label={event.category} color="primary" variant="outlined" />
              <h1>{event.title}</h1>
              <p className="event-date">{date(event.startsAt)}</p>
              <p>⌖ {event.city}</p>
              <p className="detail-description">{event.description}</p>
              <div className="detail-price">
                <strong>{price(event.price)}</strong>
                <Reminder
                  key={`${event.id}-${event.reminded}`}
                  id={event.id}
                  initial={event.reminded}
                />
              </div>
              <small className="muted">
                Reminders are saved to your account.
              </small>
            </div>
          </div>
          <Designer key={event.id} event={event} />
        </>
      )}
    </main>
  );
}
