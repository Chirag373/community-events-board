"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useAuth } from "./providers";
import { api } from "@/lib/api";
import { useState } from "react";
export default function Header() {
  const { user, refresh, loading } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const [error, setError] = useState("");
  async function logout() {
    try {
      await api("/auth/logout", "POST");
      await refresh();
      router.push(user?.role === "ADMIN" ? "/admin/login" : "/");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
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
            <Link className={path === "/" ? "nav-active" : ""} href="/">
              Explore events
            </Link>
            <Link className={path === "/feed" ? "nav-active" : ""} href="/feed">
              My Feed
            </Link>
            {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link className="preferences-link" href="/favourites">
                  Your interests
                </Link>
                <Button onClick={logout} size="small" variant="outlined">
                  Log out
                </Button>
              </>
            ) : (
              !loading && (
                <>
                  <Link className="login-link" href="/login">
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
                </>
              )
            )}
          </div>
        </div>
      </header>
      {error && (
        <p role="alert" className="header-error">
          {error}
        </p>
      )}
    </>
  );
}
