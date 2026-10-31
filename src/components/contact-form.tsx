"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
    const [state, setState] = useState<FormState>("idle");
    const [message, setMessage] = useState("");

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setState("loading");
        setMessage("");

        const form = e.currentTarget;
        const data = new FormData(form);

        // Honeypot spam protection
        if (data.get("Message for Rajat")) {
            setState("success");
            setMessage("Thanks! Your message has been received.");
            form.reset();
            return;
        }

        try {
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(Object.fromEntries(data.entries())),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Submission failed");
            }

            setState("success");
            setMessage("Thanks! Your message has been received.");
            form.reset();
        } catch {
            setState("error");
            setMessage(
                "Sorry, your message couldn't be sent. Please try again or email directly."
            );
        }
    }

    return (
        <form
            onSubmit={submit}
            className="card space-y-5 p-6 sm:p-8"
        >
            <input
                type="hidden"
                name="access_key"
                value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ""}
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <Field
                    label="Full name"
                    name="name"
                    placeholder="Your name"
                />

                <Field
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                />
            </div>

            <Field
                label="Subject"
                name="subject"
                placeholder="What would you like to build?"
            />

            <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                    Message
                </span>

                <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder="A little about your project..."
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--accent)]"
                />
            </label>

            {/* Honeypot spam protection */}
            <div
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                aria-hidden="true"
            >
                <label>
                    Leave this field empty
                    <input
                        name="Message for Rajat"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={state === "loading"}
                className="btn btn-primary w-full disabled:opacity-60"
            >
                {state === "loading" ? "Sending…" : "Send message"} ↗
            </button>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="status"
                        className={`text-sm ${
                            state === "error"
                                ? "text-[#B85C50] dark:text-[#E08A7F]"
                                : "text-[#527A52] dark:text-[#91B98B]"
                        }`}
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
        </form>
    );
}

function Field({
    label,
    name,
    placeholder,
    type = "text",
}: {
    label: string;
    name: string;
    placeholder: string;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold">
                {label}
            </span>

            <input
                name={name}
                type={type}
                required
                placeholder={placeholder}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--accent)]"
            />
        </label>
    );
}