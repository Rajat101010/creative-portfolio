"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { BiLogoGmail } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";

import {
    ArrowUpRight,
    Globe,
    Menu,
    X,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const iconMap: Record<string, any> = {
    github: FiGithub,
    linkedin: FaLinkedinIn,
    instagram: GrInstagram,
    globe: Globe,
    x: RiTwitterXFill,
    twitte: RiTwitterXFill,
    gmail: BiLogoGmail,
    email: BiLogoGmail,
    mail: BiLogoGmail,
};

const navLinks = [
    ["About", "/about"],
    ["Portfolio", "/portfolio"],
    ["Services", "/services"],
    ["Blog", "/blog"],
    ["Contact", "/contact"],
];

export function Header({
    settings,
}: {
    settings: { siteTitle: string; logoUrl: string | null };
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent | TouchEvent) {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) {
                setMenuOpen(false);
            }
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-xl"
        >
            <div className="container flex h-[74px] items-center justify-between">
                {/* Logo and site title */}
                <Link
                    href="/"
                    aria-label="Home"
                    className="flex min-w-0 items-center gap-3 font-bold tracking-tight"
                    onClick={() => setMenuOpen(false)}
                >
                    {settings.logoUrl ? (
                        <img
                            src={settings.logoUrl}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-xl object-cover"
                        />
                    ) : (
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-[var(--bg)]">
                            R
                        </span>
                    )}

                    <span className="truncate text-[var(--fg)]">
                        {settings.siteTitle}
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-7 text-sm md:flex">
                    {navLinks.map(([label, href]) => {
                        const isActive =
                            pathname === href ||
                            (href !== "/" && pathname.startsWith(`${href}/`));

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative py-1 transition-colors hover:text-[var(--accent)] ${
                                    isActive
                                        ? "font-semibold text-[var(--accent)] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:content-['']"
                                        : "text-[var(--muted)]"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Header actions */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Desktop theme toggle */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>

                    {/* Contact button */}
                    <Link
                        href="/contact"
                        className="btn btn-primary hidden !px-4 !py-2.5 text-sm sm:inline-flex"
                    >
                        Let's talk <ArrowUpRight size={15} />
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-[var(--fg)] transition-colors hover:text-[var(--accent)] md:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={
                            menuOpen ? "Close navigation" : "Open navigation"
                        }
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile navigation */}
            {menuOpen && (
                <nav
                    id="mobile-navigation"
                    className="border-t border-[var(--border)] bg-[var(--bg)] px-6 py-4 shadow-xl md:hidden"
                >
                    {navLinks.map(([label, href]) => {
                        const isActive =
                            pathname === href ||
                            (href !== "/" && pathname.startsWith(`${href}/`));

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`block border-b border-[var(--border)] py-3.5 text-sm transition-colors last:border-0 hover:text-[var(--accent)] ${
                                    isActive
                                        ? "font-semibold text-[var(--accent)]"
                                        : "text-[var(--muted)]"
                                }`}
                            >
                                {label}
                                {isActive && (
                                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Mobile contact */}
                    <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
                    >
                        Let's talk <ArrowUpRight size={15} />
                    </Link>

                    {/* Mobile theme toggle */}
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                        <span className="text-sm text-[var(--muted)]">
                            Change the Theme
                        </span>
                        <ThemeToggle />
                    </div>
                </nav>
            )}
        </header>
    );
}

export function Footer({
    settings,
    projects,
    socials,
}: {
    settings: { siteTitle: string; footerText: string };
    projects: { id: string; title: string; slug: string }[];
    socials: { id: string; label: string; url: string; icon: string }[];
}) {
    return (
        <footer className="border-t border-[var(--border)] py-10 sm:py-14">
            <div className="container">
                {/* Footer columns */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
                    {/* Brand and social links */}
                    <div className="col-span-2 min-w-0 md:col-span-1">
                        <Link
                            href="/"
                            className="text-xl font-bold text-[var(--fg)]"
                        >
                            {settings.siteTitle}
                            <span className="text-[var(--accent)]">.</span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
                            {settings.footerText}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {socials.map((s) => {
                                const Icon =
                                    iconMap[s.icon.toLowerCase()] || Globe;

                                return (
                                    <a
                                        key={s.id}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="rounded-full bg-[var(--surface-tertiary)] p-2.5 text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                                    >
                                        <Icon size={16} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explore links */}
                    <div className="min-w-0">
                        <h3 className="mb-4 text-sm font-bold text-[var(--fg)]">
                            Explore
                        </h3>

                        {[
                            ["Home", "/"],
                            ["About", "/about"],
                            ["Portfolio", "/portfolio"],
                            ["Services", "/services"],
                            ["Blog", "/blog"],
                            ["Contact", "/contact"],
                        ].map(([label, href]) => (
                            <div key={href} className="mb-1">
                                <Link href={href}>
                                    <span className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                                        {label}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Selected projects */}
                    <div className="min-w-0">
                        <h3 className="mb-4 text-sm font-bold text-[var(--fg)]">
                            Selected Projects
                        </h3>

                        {projects.slice(0, 7).map((p) => (
                            <div key={p.id} className="mb-1.5">
                                <Link href={`/portfolio#${p.slug}`}>
                                    <span className="inline-flex items-start gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                                        <span className="min-w-0 break-words">
                                            {p.title}
                                        </span>

                                        <ArrowUpRight
                                            size={12}
                                            className="mt-1 shrink-0"
                                        />
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="col-span-2 min-w-0 md:col-span-1">
                        <h3 className="mb-4 text-sm font-bold text-[var(--fg)]">
                            Have a project?
                        </h3>

                        <p className="text-sm leading-6 text-[var(--muted)]">
                            Have an idea that needs design and code? Let's make
                            it real.
                        </p>

                        <Link
                            href="/contact"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                            Start a conversation <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-center text-xs leading-5 text-[var(--muted)] sm:flex-row sm:text-left">
                    <span>
                        © {new Date().getFullYear()} {settings.siteTitle}. All
                        rights reserved.
                    </span>

                    <span>Designed with intent. Built with care.</span>
                </div>
            </div>
        </footer>
    );
}