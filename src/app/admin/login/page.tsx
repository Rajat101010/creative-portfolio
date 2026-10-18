
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
    <main className="grid min-h-screen place-items-center bg-[#101014] px-5 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[.04] p-8"
      >
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-lime font-bold text-black">
          R.
        </div>

        <p className="text-xs uppercase tracking-[.25em] text-lime">
          Private area
        </p>
        <h1 className="mt-3 text-3xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage the content of your portfolio.
        </p>

        <label className="mt-7 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-lime"
          />
        </label>

        <label className="mt-4 block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-lime"
          />
        </label>

        {error && (
          <p className="mt-4 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-lime p-3 font-bold text-black disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
