"use client";
import { themes, stickers, type EventPreview } from "./preview-data";
export default function Designer({ event }: { event: EventPreview }) {
  return (
    <section className="designer">
      <div className="designer-controls">
        <p className="eyebrow">A LITTLE TOUCH OF YOU</p>
        <h2>Design your card</h2>
        <p>Set the mood. Add a little personality.</p>
        <h4>1. Pick a background</h4>
        <div className="theme-options">
          {Object.entries(themes).map(([name, color]) => (
            <button
              type="button"
              key={name}
              aria-label={`${name} theme`}
              aria-pressed={name === "sage"}
              className={name === "sage" ? "theme-selected" : ""}
              style={{ background: color }}
            >
              {name === "sage" ? "✓" : ""}
            </button>
          ))}
        </div>
        <h4>
          2. Add stickers <small>(up to 3)</small>
        </h4>
        <div className="sticker-options">
          {stickers.map((sticker) => (
            <button
              type="button"
              key={sticker}
              aria-label={`Add ${sticker} sticker`}
            >
              {sticker}
            </button>
          ))}
        </div>
        <p className="muted">
          UI preview · Your card choices will be saved in a later stage.
        </p>
      </div>
      <div className="design-preview" style={{ background: themes.sage }}>
        <span className="preview-label">
          COMMUNITY / {event.category.toUpperCase()}
        </span>
        <span className="preview-star">✳</span>
        <h3>{event.title}</h3>
        <p>
          {event.date}
          <br />
          {event.city} · {event.price}
        </p>
        <div className="preview-stickers">
          {["🎵", "✨"].map((sticker) => (
            <button
              type="button"
              key={sticker}
              className="placed-sticker"
              aria-label={`Remove ${sticker} sticker`}
            >
              {sticker}
            </button>
          ))}
        </div>
        <span className="preview-footer">GOOD THINGS HAPPEN NEARBY ↗</span>
      </div>
    </section>
  );
}
