"use client";
import Link from "next/link";
import { Button, TextField } from "@mui/material";
export default function AuthForm({ signup = false }: { signup?: boolean }) {
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
        <div className="stack-form">
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
          <Button type="button" variant="contained">
            {signup ? "Create account" : "Log in"}
          </Button>
        </div>
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
