
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const themes = {
  light: {
    "--bg": "#F3EEE5",
    "--fg": "#69635a",
    "--muted": "#70675C",
    "--accent": "#3b2914",
    "--accent-hover": "#62472E",
    "--surface": "#FFFCF7",
    "--surface-secondary": "#E8DFD1",
    "--surface-tertiary": "#DDD1BF",
    "--border": "#D3C5B2",
    "--border-strong": "#BFAE98",
    "--glass-bg": "rgba(255,252,247,0.90)",
    "--glass-border": "#D3C5B2",
    "--card-bg": "#FFFCF7",
    "--card-border": "#D3C5B2",
    "--card-shadow": "0 8px 28px rgba(66,49,30,0.09)",
  },
  dark: {
    "--bg": "#171512",
    "--fg": "#F5EFE6",
    "--muted": "#C0B3A1",
    "--accent": "#face95",
    "--accent-hover": "#E6CBA7",
    "--surface": "#29241E",
    "--surface-secondary": "#302920",
    "--surface-tertiary": "#3B3227",
    "--border": "#514638",
    "--border-strong": "#76634D",
    "--glass-bg": "rgba(41,36,30,0.94)",
    "--glass-border": "#514638",
    "--card-bg": "#29241E",
    "--card-border": "#514638",
    "--card-shadow": "0 8px 28px rgba(0,0,0,0.30)",
  },
};

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  function applyTheme(theme: Theme) {
    const root = document.documentElement;

    root.classList.toggle("light", theme === "light");

    Object.entries(themes[theme]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    localStorage.setItem("portfolio-theme", theme);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const theme: Theme = savedTheme === "light" ? "light" : "dark";

    setLight(theme === "light");
    applyTheme(theme);
  }, []);

  function toggle() {
    const nextTheme: Theme = light ? "dark" : "light";

    setLight(nextTheme === "light");
    applyTheme(nextTheme);
  }

  return (
    <button
      aria-label="Toggle color theme"
      onClick={toggle}
      className="bg-[var(--surface-tertiary)] rounded-full p-2.5 transition-all duration-300 hover:scale-105"
    >
      {light ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
