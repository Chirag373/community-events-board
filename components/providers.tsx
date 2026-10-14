"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { User } from "@/lib/shared";
import { api } from "@/lib/api";
const theme = createTheme({
  palette: {
    primary: { main: "#285d47" },
    secondary: { main: "#cb764c" },
    background: { default: "#f8f8f3", paper: "#ffffff" },
    text: { primary: "#23382f", secondary: "#737b74" },
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, padding: "10px 20px" } },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});
const Auth = createContext<{
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}>({ user: null, loading: true, refresh: async () => {} });
export const useAuth = () => useContext(Auth);
export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  async function refresh() {
    try {
      setUser((await api<{ user: User | null }>("/auth/me")).user);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth.Provider value={{ user, loading, refresh }}>
          {children}
        </Auth.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
