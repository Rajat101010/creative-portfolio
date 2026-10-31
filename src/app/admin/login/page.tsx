"use client";

import { FormEvent, useState } from "react";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));

      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(j.error || `Login failed (${r.status})`);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-5 text-[var(--fg)]">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]"
      >
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent)] font-bold text-[var(--bg)]">
          R.
        </div>

        <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
          Private area
        </p>

        <h1 className="mt-3 text-3xl font-bold">Admin sign in</h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Manage the content of your portfolio.
        </p>

        <label className="mt-7 block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="Enter your email"
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3 text-[var(--fg)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3 text-[var(--fg)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-[var(--accent)] p-3 font-bold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}