"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { api } from "@/lib/api";
import { useAuth } from "./providers";
export default function AuthForm({ signup = false }: { signup?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await api(`/auth/${signup ? "signup" : "login"}`, "POST", {
        email: form.get("email"),
        password: form.get("password"),
      });
      await refresh();
      router.push("/favourites");
    } catch (e) {
      setError((e as Error).message);
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
        <p className="eyebrow">A LITTLE CLOSER TO COMMUNITY</p>
        <h1>{signup ? "Come on in." : "Welcome back."}</h1>
        <p>
          {signup
            ? "Create an account to save reminders and discover your kind of events."
            : "Log in to find your next plan and make it yours."}
        </p>
        <form onSubmit={submit} className="stack-form">
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email address"
            name="email"
            type="email"
            required
            autoComplete="email"
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            autoComplete={signup ? "new-password" : "current-password"}
            helperText={signup ? "At least 8 characters" : " "}
            slotProps={{ htmlInput: { minLength: 8, maxLength: 72 } }}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "One moment…" : signup ? "Create account" : "Log in"}
          </Button>
        </form>
        <p className="auth-switch">
          {signup ? "Already part of the community?" : "New around here?"}{" "}
          <Link href={signup ? "/login" : "/signup"}>
            {signup ? "Log in" : "Join in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
