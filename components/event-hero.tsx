"use client";
import Link from "next/link";
import { Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

// Static page introduction; event fetching lives in EventList.
export default function EventHero({ feed }: { feed: boolean }) {
  return (
    <section className={`hero ${feed ? "feed-hero" : ""}`}>
      <div className="hero-copy">
        <p className="eyebrow">
          <span />
          {feed ? "CURATED FOR YOU" : "YOUR CITY. YOUR PEOPLE. YOUR PLANS."}
        </p>
        <h1>
          {feed ? (
            <>
              Your interests.
              <br />
              <em>Your kind of plans.</em>
            </>
          ) : (
            <>
              A little closer
              <br />
              to <em>local.</em>
            </>
          )}
        </h1>
        <p className="hero-description">
          {feed
            ? "A little music, a little food, a lot to look forward to. Upcoming events picked from your favourite categories."
            : "Discover the gigs, gatherings and little experiences that make your neighbourhood feel like home."}
        </p>
        {feed ? (
          <Button component={Link} href="/favourites" variant="outlined">
            Edit your interests
          </Button>
        ) : (
          <a className="hero-cta" href="#events">
            Find your next plan <ArrowOutwardIcon fontSize="small" />
          </a>
        )}
      </div>
      {!feed && (
        <div className="hero-art">
          <div className="art-orbit" />
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85"
              alt="Neighbours gathering for an outdoor celebration"
            />
            <span className="photo-caption">Better together. Always.</span>
          </div>
          <div className="floating-label">
            <span>✳</span> A good time, close to home
          </div>
          <span className="art-spark">✳</span>
          <span className="art-dot" />
        </div>
      )}
    </section>
  );
}
