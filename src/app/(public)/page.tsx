import Link from "next/link";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { getPublicData } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionTitle } from "@/components/section-title";
import {
    ProjectGrid,
    BlogGrid,
    ServiceGrid,
} from "@/components/cards";

export default async function Home() {
    const d = await getPublicData();
    const featured = d.projects.filter((p) => p.featured).slice(0, 4);
    const posts = d.posts.slice(0, 3);

    return (
        <>
            <section className="grid-bg relative overflow-hidden">
                <div className="pointer-events-none absolute -right-20 top-12 h-80 w-80 rounded-full bg-[var(--accent)]/15 blur-[100px]" />
                <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-[100px]" />

                <div className="container relative grid min-h-[78vh] items-center gap-12 py-20 lg:grid-cols-[1.3fr_.7fr]">
                    <div>
                        <Reveal>
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs tracking-wider text-[var(--muted)]">
                                <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-glow" />
                                {String(d.hero.eyebrow || "DESIGNER × DEVELOPER")}
                            </div>

                            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-.05em] sm:text-7xl lg:text-[88px]">
                                {String(d.hero.name || d.settings.siteTitle)
                                    .split(" ")
                                    .slice(0, -1)
                                    .join(" ")}
                                {" "}
                                <span className="text-gradient">
                                    {String(d.hero.name || d.settings.siteTitle)
                                        .split(" ")
                                        .slice(-1)
                                        .join("")}
                                </span>
                            </h1>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
                                {String(d.hero.intro || d.settings.tagline)}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={String(d.hero.primaryHref || "/portfolio")}
                                    className="btn btn-primary"
                                >
                                    {String(d.hero.primaryLabel || "Explore my work")}
                                    <ArrowUpRight size={17} />
                                </Link>

                                <Link
                                    href={String(d.hero.secondaryHref || "/contact")}
                                    className="btn btn-ghost"
                                >
                                    {String(d.hero.secondaryLabel || "Let's talk")}
                                    <ArrowRight size={17} />
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-2">
                                {(Array.isArray(d.hero.roles)
                                    ? d.hero.roles
                                    : typeof d.hero.roles === "string"
                                        ? d.hero.roles.split(",").map((role: string) => role.trim()).filter(Boolean)
                                        : []
                                ).map((role: string, index: number) => (
                                    <span
                                        key={`${role}-${index}`}
                                        className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={0.15} className="relative mx-4 sm:mx-0">
                        <div className="relative mx-auto aspect-square max-w-[390px] rounded-[36px] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-secondary)] p-5 shadow-[var(--shadow)]">
                            <div className="grid-bg flex h-full flex-col justify-between overflow-hidden rounded-[25px] border border-[var(--border)] p-6">
                                <div className="flex justify-between text-xs uppercase tracking-[.2em] text-[var(--muted)]">
                                    <span>Portfolio / Rajat</span>
                                    <Sparkles size={17} className="text-[var(--accent)]" />
                                </div>

                                <div>
                                    <p className="text-sm text-[var(--muted)]">
                                        Multicreative
                                    </p>
                                    <p className="mt-2 text-4xl font-bold leading-tight">
                                        Idea into
                                        <br />
                                        <span className="text-gradient">INTERFACES</span>
                                    </p>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div className="flex -space-x-2">
                                        <span className="h-9 w-9 rounded-full border-2 border-[var(--surface)] bg-[var(--accent)]" />
                                        <span className="h-9 w-9 rounded-full border-2 border-[var(--surface)] bg-[var(--border-strong)]" />
                                        <span className="h-9 w-9 rounded-full border-2 border-[var(--surface)] bg-[var(--surface-tertiary)]" />
                                    </div>
                                    <span className="text-xs text-[var(--muted)]">
                                        Design · Code · Strategy
                                    </span>
                                </div>
                            </div>

                            <div className="absolute -right-4 top-1/4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow)]">
                                <p className="text-xs text-[var(--muted)]">CURRENT FOCUS</p>
                                <p className="mt-1 text-sm font-semibold">
                                    Digital experiences
                                </p>
                            </div>

                            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-[var(--accent)] p-4 text-[var(--bg)]">
                                <ArrowDownRight size={25} />
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="container pb-7"></div>
            </section>

            {/* Projects */}
            <section className="section-pad container">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <SectionTitle
                        eyebrow="Selected projects"
                        title={String(d.home.projectsTitle || "Selected work")}
                        description={String(
                            d.home.projectsIntro ||
                            "A few things I've designed and built."
                        )}
                    />

                    <Link
                        href="/portfolio"
                        className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)]"
                    >
                        All projects <ArrowUpRight size={16} />
                    </Link>
                </div>

                <ProjectGrid projects={featured.length ? featured : d.projects.slice(0, 4)} />
            </section>

            {/* Services */}
            <section className="section-pad border-y border-[var(--border)] bg-[var(--surface-secondary)]">
                <div className="container">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <SectionTitle
                            eyebrow="Services"
                            title={String(d.home.servicesTitle || "Ways I can help")}
                            description={String(
                                d.home.servicesIntro ||
                                "Thoughtful design and dependable development, from the first sketch to the final launch."
                            )}
                        />

                        <Link
                            href="/services"
                            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)]"
                        >
                            All services <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <ServiceGrid services={d.services.slice(0, 3)} />
                </div>
            </section>

            {/* Blog */}
            {posts.length > 0 && (
                <section className="section-pad container">
                    <div className="flex items-end justify-between">
                        <SectionTitle
                            eyebrow="Journal"
                            title={String(d.home.blogTitle || "Notes & ideas")}
                            description={String(
                                d.home.blogIntro ||
                                "Things I'm learning, making, and thinking about."
                            )}
                        />

                        <Link
                            href="/blog"
                            className="mb-10 hidden items-center gap-2 text-sm font-bold text-[var(--accent)] sm:flex"
                        >
                            All articles <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <BlogGrid posts={posts} />
                </section>
            )}

            {/* Contact CTA */}
            <section className="container pb-24">
                <div className="card grid-bg relative overflow-hidden p-8 sm:p-14">
                    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                    <div className="relative max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[.25em] text-[var(--accent)]">
                            Have a project in mind?
                        </p>

                        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                            Let's make something worth remembering.
                        </h2>

                        <Link
                            href="/contact"
                            className="btn btn-primary mt-7"
                        >
                            Start a conversation <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}