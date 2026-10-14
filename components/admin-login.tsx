"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useAuth } from "./providers";
import { api } from "@/lib/api";
export default function AdminLogin() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/admin/login", "POST", {
        email: form.get("email"),
        password: form.get("password"),
      });
      await refresh();
      router.replace("/admin");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="form-page">
      <div className="auth-art">
        <span>✳</span>
        <h2>
          Good things.
          <br />
          Great neighbours.
        </h2>
        <p>Your next favourite memory might be just around the corner.</p>
      </div>
      <div className="form-panel">
        <p className="eyebrow">THE COMMUNITY DESK</p>
        <h1>Welcome back.</h1>
        <p>
          Log in to add local events and manage what’s visible to your
          neighbours.
        </p>
        <form onSubmit={login} className="stack-form">
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            slotProps={{ htmlInput: { minLength: 8, maxLength: 72 } }}
          />
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "One moment…" : "Log in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
