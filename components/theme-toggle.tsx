"use client";

import { useState } from "react";

type Theme = "light" | "dark";

function getCurrentTheme(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-amber-400 hover:text-amber-600 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-200"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
