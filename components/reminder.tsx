"use client";
import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";
import { api } from "@/lib/api";
export default function Reminder({
  id,
  initial = false,
}: {
  id: string;
  initial?: boolean;
}) {
  const [reminded, setReminded] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  async function toggle() {
    if (!user) {
      router.push("/login");
      return;
    }
    // 1. Save the old value, 2. update now, 3. restore it if the API fails.
    const previousValue = reminded;
    setReminded(!previousValue);
    setPending(true);
    try {
      await api(`/reminders/${id}`, "PUT", { reminded: !previousValue });
    } catch (e) {
      setReminded(previousValue);
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <Button
        size="small"
        disabled={pending}
        onClick={toggle}
        startIcon={reminded ? <CheckIcon /> : <NotificationsNoneIcon />}
        aria-pressed={reminded}
      >
        {reminded ? "Reminder saved" : "Remind me"}
      </Button>
      <Snackbar
        open={!!error}
        onClose={() => setError("")}
        autoHideDuration={6000}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
