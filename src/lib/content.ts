
import { db } from "@/lib/db";

export async function getSettings() {
    return db.siteSettings.upsert({
        where: { id: "main" },
        create: { id: "main" },
        update: {},
    });
}

export async function getPage(
    page: string,
    section: string,
    fallback: Record<string, unknown> = {}
) {
    const item = await db.pageContent.findUnique({
        where: {
            page_section: { page, section },
        },
    });

    return (
        (item?.content as Record<string, unknown> | undefined) ??
        fallback
    );
}

export async function getPublicData() {
    const [
        settings,
        hero,
        projects,
        skills,
        experience,
        education,
        certificates,
        services,
        posts,
        socials,
        home,
        about,
        portfolio,
        certifications,
        servicePage,
        contact,
    ] = await Promise.all([
        getSettings(),

        getPage("home", "hero", {
            name: "Rajat Raj Shah",
            eyebrow: "DESIGNER × DEVELOPER",
            roles: [
                "Web Developer",
                "Software Engineer",
                "Graphic Designer",
            ],
            intro: "I build digital experiences that are thoughtful, useful, and a little unexpected.",
            primaryLabel: "Explore my work",
            primaryHref: "/portfolio",
            secondaryLabel: "Let's talk",
            secondaryHref: "/contact",
        }),

        db.project.findMany({
            orderBy: [
                { sortOrder: "asc" },
                { createdAt: "desc" },
            ],
        }),

        db.skill.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        db.experience.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        db.education.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        db.certificate.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        db.service.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        db.blogPost.findMany({
            where: {
                status: "PUBLISHED",
                publishedAt: { lte: new Date() },
            },
            orderBy: { publishedAt: "desc" },
        }),

        db.socialLink.findMany({
            orderBy: { sortOrder: "asc" },
        }),

        getPage("home", "sections", {
            projectsTitle: "Selected work",
            projectsIntro: "A few things I've designed and built.",
            servicesTitle: "Ways I can help",
            blogTitle: "Notes & ideas",
        }),

        getPage("about", "main", {
            title: "A curious mind, a practical builder.",
            bio: "I'm a developer and designer who enjoys turning complex ideas into clear, useful digital experiences.",
        }),

        // Portfolio projects heading and introduction
        getPage("portfolio", "main", {
            title: "Selected work",
            description:
                "A mix of products, experiments, and creative work.",
        }),

        // Portfolio certifications heading and introduction
        getPage("portfolio", "certifications", {
            title: "Earned Certifications",
            description:
                "Certifications and credentials reflecting my learning and skills.",
        }),

        getPage("services", "main", {
            title: "What I can help you build",
            description: "From first idea to polished launch.",
        }),

        getPage("contact", "main", {
            title: "Have a good project in mind?",
            description:
                "Tell me a little about it. I'll get back to you soon.",
        }),
    ]);

    return {
        settings,
        hero,
        projects,
        skills,
        experience,
        education,
        certificates,
        services,
        posts,
        socials,
        home,
        about,
        portfolio,
        certifications,
        servicePage,
        contact,
    };
}
