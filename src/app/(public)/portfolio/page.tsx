
import Image from "next/image";
import { getPublicData } from "@/lib/content";
import { ProjectGrid } from "@/components/cards";
import { SectionTitle } from "@/components/section-title";

export default async function Portfolio() {
    const d = await getPublicData();

    const portfolio = d.portfolio;
    const certifications = d.certifications ?? {};

    return (
        <div className="container section-pad">
            <SectionTitle
                eyebrow="The work"
                title={String(
                    portfolio.title || "Selected work"
                )}
                description={String(
                    portfolio.description ||
                    "A mix of products, experiments, and creative work."
                )}
            />

            <ProjectGrid projects={d.projects} />

            <section className="mt-24">
                <SectionTitle
                    eyebrow="Proof of learning"
                    title={String(
                        d.certifications.title || "Earned Certifications"
                    )}
                    description={String(
                        d.certifications.description ||
                        "Certifications and credentials reflecting my learning and skills."
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {d.certificates.map((c) => (
                        <article key={c.id} className="card">
                            {c.imageUrl && (
                                <div className="aspect-[4/3] bg-white/5">
                                    <Image
                                        src={c.imageUrl}
                                        alt={c.title}
                                        width={800}
                                        height={600}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-5">
                                <h3 className="font-bold">
                                    {c.title}
                                </h3>
                                <p className="mt-2 text-sm text-zinc-400">
                                    {c.issuer}
                                </p>
                                <p className="mt-3 text-xs text-[#A68B6B]">
                                    {c.date}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

