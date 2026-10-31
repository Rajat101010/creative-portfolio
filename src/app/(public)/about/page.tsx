
import Image from "next/image";
import { getPublicData } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionTitle } from "@/components/section-title";

export default async function About() {
    const d = await getPublicData();

    return (
        <div className="container section-pad">
            <Reveal>
                <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#A68B6B]">
                    A little about me
                </p>

                <h1 className="w-full text-4xl font-bold leading-tight sm:text-6xl">
                    {String(
                        d.about.title ||
                        "A curious mind, a practical builder."
                    )}
                </h1>

                <div className="mt-10">
                    <p className="w-full text-lg leading-8 text-[var(--muted)]">
                        {String(d.about.bio || "")}
                    </p>

                    <div className="mt-10 grid gap-10 md:grid-cols-[0.65fr_1.35fr]">
                        {d.settings.profileUrl && (
                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                                <Image
                                    src={d.settings.profileUrl}
                                    alt={d.settings.siteTitle}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-col justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="card p-5">
                                    <p className="text-3xl font-bold text-[#A68B6B]">
                                        {d.projects.length}+
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        Projects & Builds
                                    </p>
                                </div>

                                <div className="card p-5">
                                    <p className="text-3xl font-bold text-[#A68B6B]">
                                        {d.skills.length}+
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        Skills in my toolkit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            <section className="mt-20">
                <SectionTitle eyebrow="Toolkit" title="Skills & tools" />
                <div className="grid gap-4 sm:grid-cols-2">
                    {d.skills.map((s) => (
                        <div key={s.id} className="card p-5">
                            <div className="flex justify-between gap-3">
                                <span className="font-semibold">{s.name}</span>
                                <span className="text-xs text-zinc-500">
                                    {s.category}
                                </span>
                            </div>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface-tertiary)]">
                                <div
                                    className="h-full rounded-full bg-[var(--accent)]"
                                    style={{
                                        width: `${Math.max(0, Math.min(100, s.level))}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-20">
                <SectionTitle
                    eyebrow="Experience"
                    title="Where I've contributed"
                />
                <div className="grid gap-4 md:grid-cols-2">
                    {d.experience.map((e) => (
                        <div key={e.id} className="card p-6">
                            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                {e.startDate} — {e.endDate || "Present"}
                            </p>
                            <h3 className="mt-3 text-xl font-bold">
                                {e.role}
                            </h3>
                            <p className="mt-1 text-sm text-zinc-400">
                                {e.company}
                            </p>
                            <p className="mt-4 text-sm leading-6 text-zinc-400 text-[var(--muted)]">
                                {e.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-20">
                <SectionTitle
                    eyebrow="Education"
                    title="Learning by design"
                />
                <div className="grid gap-4 md:grid-cols-2">
                    {d.education.map((e) => (
                        <div key={e.id} className="card p-6">
                            <p className="text-xs text-[#A68B6B]">
                                {e.startDate} — {e.endDate}
                            </p>
                            <h3 className="mt-3 text-xl font-bold">
                                {e.qualification}
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                {e.institution}
                            </p>
                            {e.description && (
                                <p className="mt-3 text-sm text-zinc-500 text-[var(--muted)]">
                                    {e.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
