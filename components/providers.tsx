"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);
export function Providers({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    try { const saved = localStorage.getItem("atupa-theme"); if (saved === "dark" || saved === "light") value = saved === "dark"; } catch { /* Theme remains available when storage is disabled. */ }
    document.documentElement.classList.toggle("dark", value);
    const frame = requestAnimationFrame(() => setDark(value)); return () => cancelAnimationFrame(frame);
  }, []);
  const toggle = () => { const next = !dark; setDark(next); document.documentElement.classList.toggle("dark", next); try { localStorage.setItem("atupa-theme", next ? "dark" : "light"); } catch { /* Preference is optional. */ } };
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}<ToastContainer position="bottom-right" theme={dark ? "dark" : "light"} autoClose={4000} limit={3} pauseOnFocusLoss closeOnClick={false} /></ThemeContext.Provider>;
}
