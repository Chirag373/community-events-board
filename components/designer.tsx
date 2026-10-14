"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Button, CircularProgress } from "@mui/material";
import { api } from "@/lib/api";
import {
  themes,
  stickers,
  price,
  date,
  type Event,
  type Design,
} from "@/lib/shared";
import { useAuth } from "./providers";
export default function Designer({ event }: { event: Event }) {
  const { user, loading } = useAuth();
  const [design, setDesign] = useState<Design>({ theme: "sage", stickers: [] });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let ignoreResponse = false;
    async function loadDesign() {
      try {
        const result = await api<{ design: Design }>(`/designs/${event.id}`);
        if (ignoreResponse) return;
        setDesign(result.design);
        setReady(true);
      } catch (error) {
        if (!ignoreResponse) setError((error as Error).message);
      }
    }
    loadDesign();
    // Ignore a response if we have already left this event.
    return () => {
      ignoreResponse = true;
    };
  }, [user, event.id, retry]);
  async function saveDesign(next: Design) {
    const previousDesign = design;
    setDesign(next);
    setBusy(true);
    setError("");
    try {
      await api(`/designs/${event.id}`, "PUT", next);
    } catch (e) {
      setDesign(previousDesign);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function chooseTheme(theme: Design["theme"]) {
    saveDesign({ ...design, theme });
  }
  function addSticker(sticker: string) {
    if (design.stickers.length === 3) return;
    saveDesign({ ...design, stickers: [...design.stickers, sticker] });
  }
  function removeSticker(position: number) {
    const remaining = design.stickers.filter((_, index) => index !== position);
    saveDesign({ ...design, stickers: remaining });
  }

  return (
    <section className="designer">
      <div className="designer-controls">
        <p className="eyebrow">A LITTLE TOUCH OF YOU</p>
        <h2>Design your card</h2>
        <p>Set the mood. Add a little personality.</p>
        {error && (
          <Alert
            severity="error"
            action={
              !ready && (
                <Button
                  onClick={() => {
                    setError("");
                    setRetry((v) => v + 1);
                  }}
                >
                  Retry
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}
        {loading || (user && !ready && !error) ? (
          <CircularProgress size={24} />
        ) : !user ? (
          <Button component={Link} href="/login" variant="outlined">
            Log in to personalise
          </Button>
        ) : (
          <>
            <h4>1. Pick a background</h4>
            <div className="theme-options">
              {Object.entries(themes).map(([name, color]) => (
                <button
                  key={name}
                  disabled={!ready || busy}
                  aria-pressed={design.theme === name}
                  aria-label={`${name} theme`}
                  className={design.theme === name ? "theme-selected" : ""}
                  style={{ background: color }}
                  onClick={() => chooseTheme(name as Design["theme"])}
                >
                  {design.theme === name ? "✓" : ""}
                </button>
              ))}
            </div>
            <h4>
              2. Add stickers <small>(up to 3)</small>
            </h4>
            <div className="sticker-options">
              {stickers.map((s) => (
                <button
                  key={s}
                  aria-label={`Add ${s} sticker`}
                  disabled={busy || !ready || design.stickers.length >= 3}
                  onClick={() => addSticker(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="muted" aria-live="polite">
              {busy
                ? "Saving your card…"
                : "Saved automatically. Tap a sticker on the card to remove it."}
            </p>
          </>
        )}
      </div>
      <div
        className="design-preview"
        style={{ background: themes[design.theme] }}
      >
        <span className="preview-label">
          COMMUNITY / {event.category.toUpperCase()}
        </span>
        <span className="preview-star">✳</span>
        <h3>{event.title}</h3>
        <p>
          {date(event.startsAt)}
          <br />
          {event.city} · {price(event.price)}
        </p>
        <div className="preview-stickers">
          {design.stickers.map((s, i) => (
            <button
              key={`${i}-${s}`}
              className="placed-sticker"
              aria-label={`Remove ${s} sticker ${i + 1}`}
              disabled={busy || !user}
              onClick={() => removeSticker(i)}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="preview-footer">GOOD THINGS HAPPEN NEARBY ↗</span>
      </div>
    </section>
  );
}
