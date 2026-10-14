"use client";
import { Button } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
export default function Reminder() {
  return (
    <Button type="button" size="small" startIcon={<NotificationsNoneIcon />}>
      Remind me
    </Button>
  );
}
