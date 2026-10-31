import Image from "next/image";
import Link from "next/link";

import {
    ArrowUpRight,
    ExternalLink,
} from "lucide-react";

import {
    Reveal,
    Stagger,
    StaggerItem,
} from "@/components/reveal";

type Project = {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    tags: string[];
    url: string | null;
    featured: boolean;
};

export function ProjectGrid({
    projects,
}: {
    projects: Project[];
}) {
    return (
        <Stagger className="grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
                <StaggerItem key={p.id}>
                    <article
                        id={p.slug}
                        className="card h-full"
                    >
                        {/* Project image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-secondary)]">
                            {p.imageUrl ? (
                                <Image
                                    src={p.imageUrl}
                                    alt={p.title}
                                    fill
                                    className="object-cover transition duration-700 hover:scale-105"
                                    sizes="(max-width:768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="grid h-full place-items-center text-5xl text-[var(--accent)]">
                                    ✳
                                </div>
                            )}

                            <span className="absolute left-4 top-4 rounded-full bg-[var(--surface)]/90 px-3 py-1 text-xs text-[var(--fg)] backdrop-blur">
                                {p.featured
                                    ? "Featured project"
                                    : "Selected work"}
                            </span>
                        </div>

                        {/* Project details */}
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-xl font-bold text-[var(--fg)]">
                                    {p.title}
                                </h3>

                                {p.url && (
                                    <a
                                        aria-label={`View ${p.title}`}
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-[var(--border)] p-2 text-[var(--fg)] transition-colors hover:bg-[var(--surface-tertiary)] hover:text-[var(--accent)]"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                                {p.description}
                            </p>

                            {/* Project tags */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {p.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs text-[var(--muted)]"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {p.url && (
                                <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                                >
                                    View Page
                                    <ArrowUpRight size={15} />
                                </a>
                            )}
                        </div>
                    </article>
                </StaggerItem>
            ))}
        </Stagger>
    );
}

export function BlogGrid({
    posts,
}: {
    posts: any[];
}) {
    return (
        <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
                <Reveal
                    key={p.id}
                    delay={i * 0.06}
                >
                    <Link
                        href={`/blog/${p.slug}`}
                        className="card block h-full"
                    >
                        {/* Blog cover image */}
                        <div className="aspect-[16/10] bg-[var(--surface-secondary)]">
                            {p.coverUrl && (
                                <Image
                                    src={p.coverUrl}
                                    alt={p.title}
                                    width={800}
                                    height={500}
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>

                        {/* Blog details */}
                        <div className="p-5">
                            <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
                                {p.category} ·{" "}
                                {p.publishedAt
                                    ? new Date(
                                          p.publishedAt
                                      ).toLocaleDateString("en", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "Draft"}
                            </p>

                            <h3 className="mt-3 text-lg font-bold leading-snug text-[var(--fg)]">
                                {p.title}
                            </h3>

                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                                {p.excerpt}
                            </p>

                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                                Read article
                                <ArrowUpRight size={15} />
                            </span>
                        </div>
                    </Link>
                </Reveal>
            ))}
        </div>
    );
}

export function ServiceGrid({
    services,
}: {
    services: any[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
                <Reveal
                    key={s.id}
                    delay={i * 0.06}
                >
                    <article className="card h-full p-6 sm:p-7">
                        {/* Service icon */}
                        <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface-tertiary)] text-2xl text-[var(--accent)]">
                            {s.icon || "✳"}
                        </div>

                        {/* Service details */}
                        <h3 className="text-xl font-bold text-[var(--fg)]">
                            {s.title}
                        </h3>

                        <p className="mt-3 min-h-10 text-sm leading-6 text-[var(--muted)]">
                            {s.description}
                        </p>

                        {/* Service links */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/contact"
                                className="btn btn-primary !py-2.5 text-sm"
                            >
                                Contact
                                <ArrowUpRight size={14} />
                            </Link>

                            {s.sampleUrl && (
                                <a
                                    href={s.sampleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost !py-2.5 text-sm"
                                >
                                    View Sample
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </article>
                </Reveal>
            ))}
        </div>
    );
}