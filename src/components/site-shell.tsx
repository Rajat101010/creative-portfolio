
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { BiLogoGmail } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";


import {
    ArrowUpRight,
    Github,
    Linkedin,
    Instagram,
    Globe,
    Menu,
    X,
    Mail,
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

    // Close the mobile menu when clicking or tapping outside the header.
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

    // Close the mobile menu when switching to desktop width.
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
            className="sticky top-0 z-40 border-b border-white/10 bg-[#101014]/90 backdrop-blur-xl"
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
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lime text-black">
                            R.
                        </span>
                    )}

                    <span className="truncate">{settings.siteTitle}</span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
                    {navLinks.map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            className="transition hover:text-lime"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Header actions */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Desktop theme toggle */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>

                    {/* Desktop contact button */}
                    <Link
                        href="/contact"
                        className="btn btn-primary hidden !px-4 !py-2.5 text-sm sm:inline-flex"
                    >
                        Let's talk <ArrowUpRight size={15} />
                    </Link>

                    {/* Mobile hamburger button */}
                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:text-lime md:hidden"
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

            {/* Mobile navigation dropdown */}
            {menuOpen && (
                <nav
                    id="mobile-navigation"
                    className="border-t border-white/10 bg-[#101014] px-6 py-4 shadow-xl md:hidden"
                >
                    {navLinks.map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="block border-b border-white/5 py-3.5 text-sm text-zinc-300 transition last:border-0 hover:text-lime"
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Mobile contact link */}
                    <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime"
                    >
                        Let's talk <ArrowUpRight size={15} />
                    </Link>

                    {/* Mobile theme toggle */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-sm text-zinc-300">
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
        <footer className="border-t border-white/10 py-10 sm:py-14">
            <div className="container">
                {/* Responsive footer columns */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
                    {/* Brand and social links */}
                    <div className="col-span-2 min-w-0 md:col-span-1">
                        <Link
                            href="/"
                            className="text-xl font-bold"
                        >
                            {settings.siteTitle}
                            <span className="text-lime">.</span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
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
                                        className="glass rounded-full p-2.5"
                                    >
                                        <Icon size={16} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explore links */}
                    <div className="min-w-0">
                        <h3 className="mb-4 text-sm font-bold">
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
                            <Link
                                key={href}
                                href={href}
                                className="mb-3 block break-words text-sm text-zinc-400 transition hover:text-lime"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Selected projects */}
                    <div className="min-w-0">
                        <h3 className="mb-4 text-sm font-bold">
                            Selected Projects
                        </h3>

                        {projects.slice(0, 7).map((p) => (
                            <Link
                                key={p.id}
                                href={`/portfolio#${p.slug}`}
                                className="mb-3 flex min-w-0 items-start gap-1 text-sm text-zinc-400 transition hover:text-lime"
                            >
                                <span className="min-w-0 break-words">
                                    {p.title}
                                </span>

                                <ArrowUpRight
                                    size={12}
                                    className="mt-1 shrink-0"
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="col-span-2 min-w-0 md:col-span-1">
                        <h3 className="mb-4 text-sm font-bold">
                            Have a project?
                        </h3>

                        <p className="text-sm leading-6 text-zinc-400">
                            Have an idea that needs design and code? Let's make
                            it real.
                        </p>

                        <Link
                            href="/contact"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime"
                        >
                            Start a conversation <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                {/* Copyright and footer message */}
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs leading-5 text-zinc-500 sm:flex-row sm:text-left">
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
