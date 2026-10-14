"use client";
import Link from "next/link";
import { Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            c<span>·</span>
          </span>
          <span>
            community<span className="brand-sub">EVENTS BOARD</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/">Explore events</Link>
          <Link href="/feed">My Feed</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="login-link">
            Log in
          </Link>
          <Button
            component={Link}
            href="/signup"
            variant="contained"
            endIcon={<ArrowOutwardIcon fontSize="small" />}
          >
            Join in
          </Button>
        </div>
      </div>
    </header>
  );
}
