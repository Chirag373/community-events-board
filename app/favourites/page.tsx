"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Chip, CircularProgress } from "@mui/material";
import { api } from "@/lib/api";
import { categories } from "@/lib/shared";
import { useAuth } from "@/components/providers";
export default function Favourites() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let ignoreResponse = false;
    async function loadFavourites() {
      try {
        const result = await api<{ categories: string[] }>("/favourites");
        if (ignoreResponse) return;
        setSelected(result.categories);
        setReady(true);
      } catch (error) {
        if (!ignoreResponse) setError((error as Error).message);
      }
    }
    loadFavourites();
    return () => {
      ignoreResponse = true;
    };
  }, [user, retry]);
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api("/favourites", "PUT", { categories: selected });
      router.push("/feed");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function toggleCategory(category: string) {
    if (selected.includes(category)) {
      setSelected(selected.filter((name) => name !== category));
    } else {
      setSelected([...selected, category]);
    }
  }

  return (
    <main className="narrow-page">
      <p className="eyebrow">MAKE IT PERSONAL</p>
      <h1>What’s your thing?</h1>
      <p>
        Pick the categories you love. We’ll fill your feed with upcoming events
        that feel like you.
      </p>
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
        <CircularProgress />
      ) : !user ? (
        <Button component={Link} href="/login" variant="contained">
          Log in to choose interests
        </Button>
      ) : (
        <>
          <div className="interest-options">
            {categories.map((c, i) => (
              <Chip
                key={c}
                label={`${["♫", "✎", "♨", "↗", "☀"][i]} ${c}`}
                onClick={() => toggleCategory(c)}
                aria-pressed={selected.includes(c)}
                color={selected.includes(c) ? "primary" : "default"}
                variant={selected.includes(c) ? "filled" : "outlined"}
              />
            ))}
          </div>
          <p className="muted">
            {selected.length} selected · You can change these anytime.
          </p>
          <Button variant="contained" onClick={save} disabled={busy || !ready}>
            {busy ? "Saving…" : "Save & see My Feed"}
          </Button>
        </>
      )}
    </main>
  );
}
