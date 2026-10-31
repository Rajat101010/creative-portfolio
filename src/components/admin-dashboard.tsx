"use client";

import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    GraduationCap,
    FolderKanban,
    Award,
    Layers,
    BookOpen,
    Share2,
    Settings,
    FileText,
    Upload,
    Plus,
    Trash2,
    Save,
    LogOut,
    RefreshCw,
    Image as ImageIcon,
    X,
    LoaderCircle,
} from "lucide-react";

type Item = Record<string, any>;

const resources = [
    ["projects", "Projects", FolderKanban],
    ["skills", "Skills", Layers],
    ["experience", "Experience", BriefcaseBusiness],
    ["education", "Education", GraduationCap],
    ["certificates", "Certificates", Award],
    ["services", "Services", Layers],
    ["posts", "Blog posts", BookOpen],
    ["socials", "Social links", Share2],
] as const;

const fields: Record<string, string[]> = {
    projects: ["title", "slug", "description", "imageUrl", "tags", "url", "featured", "sortOrder"],
    skills: ["name", "category", "level", "sortOrder"],
    experience: ["role", "company", "description", "startDate", "endDate", "sortOrder"],
    education: ["institution", "qualification", "description", "startDate", "endDate", "sortOrder"],
    certificates: ["title", "issuer", "date", "imageUrl", "url", "sortOrder"],
    services: ["title", "description", "icon", "imageUrl", "sampleUrl", "sortOrder"],
    posts: ["title", "slug", "excerpt", "content", "coverUrl", "category", "status", "pinned", "publishedAt"],
    socials: ["label", "url", "icon", "sortOrder"],
};

const blank: Record<string, Item> = {
    projects: { title: "", slug: "", description: "", imageUrl: "", tags: [], url: "", featured: false, sortOrder: 0 },
    skills: { name: "", category: "Development", level: 80, sortOrder: 0 },
    experience: { role: "", company: "", description: "", startDate: "", endDate: "", sortOrder: 0 },
    education: { institution: "", qualification: "", description: "", startDate: "", endDate: "", sortOrder: 0 },
    certificates: { title: "", issuer: "", date: "", imageUrl: "", url: "", sortOrder: 0 },
    services: { title: "", description: "", icon: "✳", imageUrl: "", sampleUrl: "", sortOrder: 0 },
    posts: { title: "", slug: "", excerpt: "", content: "", coverUrl: "", category: "Insights", status: "DRAFT", pinned: false },
    socials: { label: "", url: "", icon: "globe", sortOrder: 0 },
};

const imagePattern = /image|photo|picture|avatar|thumbnail|cover|banner|logo|profile|portrait/i;

const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--fg)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10";

const defaultHomeSections: Item = {
    blogTitle: "Notes & ideas",
    blogIntro: "Things I'm learning, making, and thinking about.",
    projectsTitle: "Selected work",
    projectsIntro: "A few things I've designed and built.",
    servicesTitle: "Ways I can help",
    servicesIntro: "Thoughtful design and dependable development, from the first sketch to the final launch.",
};

const defaultPortfolioSections: Item = {
    title: "Selected work",
    description: "A mix of products, experiments, and creative work.",
};

const defaultCertificationSections: Item = {
    title: "Earned Certifications",
    description: "Certifications and credentials reflecting my learning and skills.",
};

const defaultHomeHero: Item = {
    name: "Rajat Raj Shah",
    eyebrow: "DESIGNER × DEVELOPER",
    roles: ["Web Developer", "Software Engineer", "Graphic Designer"],
    intro: "I build digital experiences that are thoughtful, useful, and a little unexpected.",
    primaryLabel: "Explore my work",
    primaryHref: "/portfolio",
    secondaryLabel: "Let's talk",
    secondaryHref: "/contact",
};

const defaultAboutSections: Item = {
    title: "A curious mind, a practical builder.",
    bio: "I'm a developer and designer who enjoys turning complex ideas into clear, useful digital experiences.",
};

const defaultServicesSections: Item = {
    title: "What I can help you build",
    description: "From first idea to polished launch.",
};

const defaultContactSections: Item = {
    title: "Have a good project in mind?",
    description: "Tell me a little about it. I'll get back to you soon.",
};

async function readResponse(response: Response): Promise<any> {
    const text = await response.text();
    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { rawResponse: text };
    }

    console.log("[Admin API]", {
        url: response.url,
        status: response.status,
        response: data,
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("Admin authentication failed. Please sign in again.");
    }

    if (!response.ok) {
        throw new Error(
            [data?.error, data?.details, data?.message, data?.rawResponse]
                .filter(Boolean)
                .join(" — ") || `Request failed (${response.status})`
        );
    }

    return data;
}

function asArray(data: any): Item[] {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.pages)) return data.pages;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
}

function humanize(key: string) {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}

function parseContent(record: Item | undefined): Item {
    try {
        const parsed =
            typeof record?.content === "string"
                ? JSON.parse(record.content || "{}")
                : record?.content;

        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed
            : {};
    } catch {
        return {};
    }
}

async function uploadImageFile(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image.");
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be 10 MB or less.");
    }

    const form = new FormData();
    form.set("file", file);

    const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
    });

    const data = await readResponse(response);

    if (!data?.url) {
        throw new Error("The upload API did not return an image URL.");
    }

    return data.url;
}

function ImageUploader({
    value,
    onChange,
}: {
    value: string;
    onChange: (url: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setUploading(true);
        setError("");

        try {
            onChange(await uploadImageFile(file));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
                    <img src={value} alt="Image preview" className="h-48 w-full object-cover" />

                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="Remove image"
                        className="absolute right-2 top-2 rounded-full bg-black/75 p-2 text-white transition hover:bg-red-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex h-32 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-secondary)] text-sm text-[var(--muted)]">
                    <ImageIcon size={25} />
                    No image selected
                </div>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-strong)] px-4 py-2.5 text-sm text-[var(--accent)] transition hover:bg-[var(--surface-secondary)]">
                {uploading ? (
                    <LoaderCircle size={15} className="animate-spin" />
                ) : (
                    <Upload size={15} />
                )}

                {uploading ? "Uploading..." : value ? "Change image" : "Upload from device"}

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleUpload}
                />
            </label>

            <p className="text-xs text-[var(--muted)]">Maximum file size: 10 MB.</p>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

function Field({
    name,
    value,
    onChange,
}: {
    name: string;
    value: any;
    onChange: (value: any) => void;
}) {
    const key = name.toLowerCase();
    const isImage = imagePattern.test(name);
    const isBoolean = typeof value === "boolean" || ["featured", "pinned"].includes(key);
    const isNumber = typeof value === "number" || ["sortorder", "level"].includes(key);
    const isArray = Array.isArray(value);

    const isLongText = [
        "description",
        "content",
        "excerpt",
        "bio",
        "about",
        "intro",
    ].some((word) => key.includes(word));

    return (
        <label
            className={`block space-y-2 text-sm ${
                isImage || isLongText || isArray ? "sm:col-span-2" : ""
            }`}
        >
            <span className="block font-medium text-[var(--fg)]">
                {humanize(name)}
            </span>

            {isImage ? (
                <ImageUploader
                    value={typeof value === "string" ? value : ""}
                    onChange={onChange}
                />
            ) : isBoolean ? (
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(event) => onChange(event.target.checked)}
                    className="h-5 w-5 cursor-pointer accent-[var(--accent)]"
                />
            ) : key === "status" ? (
                <select
                    value={value || "DRAFT"}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                </select>
            ) : isNumber ? (
                <input
                    type="number"
                    value={value ?? 0}
                    onChange={(event) =>
                        onChange(
                            event.target.value === ""
                                ? ""
                                : Number(event.target.value)
                        )
                    }
                    className={inputClass}
                />
            ) : key === "tags" ? (
                <textarea
                    rows={3}
                    value={Array.isArray(value) ? value.join(", ") : value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Separate items with commas"
                    className={inputClass}
                />
            ) : isArray ? (
                <textarea
                    rows={3}
                    value={value.join(", ")}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                                .split(",")
                                .map((item: string) => item.trim())
                                .filter(Boolean)
                        )
                    }
                    placeholder="Separate items with commas"
                    className={inputClass}
                />
            ) : isLongText ? (
                <textarea
                    rows={key === "content" ? 8 : 4}
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                />
            ) : (
                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                />
            )}
        </label>
    );
}

function ContentSectionCard({
    title,
    description,
    page,
    section,
    content,
    onChange,
    onSave,
    saving,
}: {
    title: string;
    description: string;
    page: string;
    section: string;
    content: Item;
    onChange: (content: Item) => void;
    onSave: () => void;
    saving: boolean;
}) {
    const [expanded, setExpanded] = useState(true);
    const pageLabel = humanize(page);
    const sectionLabel = humanize(section);

    return (
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                            {pageLabel}
                        </span>

                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                            {sectionLabel}
                        </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[var(--fg)]">{title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--surface-secondary)]"
                >
                    {expanded ? "Collapse" : "Edit content"}
                </button>
            </div>

            {expanded && (
                <div className="p-5 sm:p-6">
                    {Object.keys(content).length === 0 ? (
                        <p className="text-sm text-[var(--muted)]">
                            This section has no editable fields.
                        </p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {Object.entries(content).map(([key, value]) => (
                                <div key={key} className="min-w-0">
                                    <Field
                                        name={key}
                                        value={value}
                                        onChange={(nextValue) =>
                                            onChange({ ...content, [key]: nextValue })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
                        <p className="text-xs text-[var(--muted)]">
                            Page: {pageLabel} · Section: {sectionLabel}
                        </p>

                        <button
                            type="button"
                            onClick={onSave}
                            disabled={saving}
                            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                                <Save size={15} />
                            )}
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function PageEditor({
    page,
    onSave,
    saving,
}: {
    page: Item;
    onSave: (page: Item) => void;
    saving: boolean;
}) {
    const [content, setContent] = useState<Item>({});
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        setContent(parseContent(page));
    }, [page.id, page.page, page.section, page.content]);

    const pageLabel = humanize(String(page.page || "General"));
    const sectionLabel = humanize(String(page.section || page.key || "Content"));
    const title = page.title || `${sectionLabel} section`;

    return (
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                            {pageLabel}
                        </span>

                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                            {sectionLabel}
                        </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[var(--fg)]">{title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Edit the content for this section of your website.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--surface-secondary)]"
                >
                    {expanded ? "Collapse" : "Edit content"}
                </button>
            </div>

            {expanded && (
                <div className="p-5 sm:p-6">
                    {Object.keys(content).length === 0 ? (
                        <p className="text-sm text-[var(--muted)]">
                            This section has no editable fields.
                        </p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {Object.entries(content).map(([key, value]) => (
                                <div key={key} className="min-w-0">
                                    <Field
                                        name={key}
                                        value={value}
                                        onChange={(nextValue) =>
                                            setContent((prev) => ({
                                                ...prev,
                                                [key]: nextValue,
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
                        <p className="text-xs text-[var(--muted)]">
                            Page: {pageLabel} · Section: {sectionLabel}
                        </p>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => onSave({ ...page, content })}
                            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                                <Save size={15} />
                            )}
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export function AdminDashboard() {
    const [tab, setTab] = useState("overview");
    const [rows, setRows] = useState<Item[]>([]);
    const [settings, setSettings] = useState<Item>({});
    const [pages, setPages] = useState<Item[]>([]);

    const [homeSections, setHomeSections] = useState<Item>(defaultHomeSections);
    const [portfolioSections, setPortfolioSections] = useState<Item>(defaultPortfolioSections);
    const [certificationSections, setCertificationSections] = useState<Item>(defaultCertificationSections);
    const [homeHero, setHomeHero] = useState<Item>(defaultHomeHero);
    const [aboutSections, setAboutSections] = useState<Item>(defaultAboutSections);
    const [servicesSections, setServicesSections] = useState<Item>(defaultServicesSections);
    const [contactSections, setContactSections] = useState<Item>(defaultContactSections);

    const [editing, setEditing] = useState<Item | null>(null);
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        setNotice("");

        try {
            if (tab === "settings") {
                const response = await fetch("/api/admin/settings");
                const data = await readResponse(response);
                const result = data?.settings ?? data?.data ?? data;

                setSettings(
                    result && typeof result === "object" && !Array.isArray(result)
                        ? result
                        : {}
                );
            } else if (tab === "pages") {
                const response = await fetch("/api/admin/pages");
                const records = asArray(await readResponse(response));

                function getSection(page: string, section: string, fallback: Item) {
                    const record = records.find(
                        (item) => item.page === page && item.section === section
                    );

                    return { ...fallback, ...parseContent(record) };
                }

                setHomeHero(getSection("home", "hero", defaultHomeHero));
                setHomeSections(getSection("home", "sections", defaultHomeSections));
                setAboutSections(getSection("about", "main", defaultAboutSections));
                setPortfolioSections(getSection("portfolio", "main", defaultPortfolioSections));
                setCertificationSections(
                    getSection("portfolio", "certifications", defaultCertificationSections)
                );
                setServicesSections(getSection("services", "main", defaultServicesSections));
                setContactSections(getSection("contact", "main", defaultContactSections));

                const dedicatedSections = new Set([
                    "home:hero",
                    "home:sections",
                    "about:main",
                    "portfolio:main",
                    "portfolio:certifications",
                    "services:main",
                    "contact:main",
                ]);

                setPages(
                    records.filter(
                        (item) =>
                            !dedicatedSections.has(`${item.page}:${item.section}`)
                    )
                );
            } else if (resources.some((resource) => resource[0] === tab)) {
                const response = await fetch(`/api/admin/${tab}`);
                setRows(asArray(await readResponse(response)));
            } else {
                const results = await Promise.all(
                    resources.map(async ([key]) => {
                        const response = await fetch(`/api/admin/${key}`);
                        return [key, asArray(await readResponse(response))] as const;
                    })
                );

                setRows(
                    results.flatMap(([key, items]) =>
                        items.map((item) => ({ ...item, _resource: key }))
                    )
                );
            }
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Could not load data.");

            if (tab === "overview" || resources.some((resource) => resource[0] === tab)) {
                setRows([]);
            }

            if (tab === "pages") setPages([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    async function save() {
        if (!editing || saving) return;

        setSaving(true);
        setNotice("");

        const data = { ...editing };
        const resource = String(data._resource || tab);

        if (resource === "projects" && typeof data.tags === "string") {
            data.tags = data.tags
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean);
        }

        delete data._resource;
        delete data._uploadField;

        try {
            const response = await fetch(`/api/admin/${resource}`, {
                method: data.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            await readResponse(response);
            setEditing(null);
            setNotice("Item saved successfully.");
            await load();
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Could not save item.");
        } finally {
            setSaving(false);
        }
    }

    async function remove(row: Item, resource = tab) {
        if (!confirm("Delete this item? This cannot be undone.")) return;

        try {
            const response = await fetch(
                `/api/admin/${resource}?id=${encodeURIComponent(row.id)}`,
                { method: "DELETE" }
            );

            await readResponse(response);
            setNotice("Item deleted.");
            await load();
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Delete failed.");
        }
    }

    async function saveSettings() {
        setSaving(true);
        setNotice("");

        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            await readResponse(response);
            setNotice("Settings saved.");
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Could not save settings.");
        } finally {
            setSaving(false);
        }
    }

    async function savePage(page: Item) {
        if (saving) return;

        setSaving(true);
        setNotice("");

        try {
            const response = await fetch("/api/admin/pages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(page),
            });

            await readResponse(response);
            setNotice("Page content saved successfully.");
            await load();
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Could not save page content.");
        } finally {
            setSaving(false);
        }
    }

    async function saveCustomSection(page: string, section: string, content: Item) {
        if (saving) return;

        setSaving(true);
        setNotice("");

        try {
            const response = await fetch("/api/admin/pages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page, section, content }),
            });

            await readResponse(response);
            setNotice(`${humanize(page)} — ${humanize(section)} saved successfully.`);
            await load();
        } catch (error) {
            setNotice(error instanceof Error ? error.message : "Could not save page content.");
        } finally {
            setSaving(false);
        }
    }

    const current = resources.find((resource) => resource[0] === tab);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] md:flex">
            <aside className="border-b border-[var(--border)] bg-[var(--surface)] p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
                <a href="/" className="flex items-center gap-3 px-2 py-3 font-bold text-[var(--fg)]">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-[var(--bg)]">
                        R
                    </span>
                    Portfolio CMS
                </a>

                <p className="mb-3 mt-7 px-3 text-[10px] font-bold uppercase tracking-[.25em] text-[var(--muted)]">
                    Workspace
                </p>

                <nav className="flex gap-2 overflow-x-auto md:flex-col">
                    {[
                        ["overview", "Overview", LayoutDashboard],
                        ["settings", "Site settings", Settings],
                        ["pages", "Page content", FileText],
                        ...resources.map(([key, label, Icon]) => [key, label, Icon] as const),
                    ].map(([key, label, Icon]: any) => (
                        <button
                            key={key}
                            onClick={() => {
                                setTab(key);
                                setEditing(null);
                            }}
                            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                tab === key
                                    ? "bg-[var(--accent)] font-bold text-[var(--bg)]"
                                    : "text-[var(--muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--fg)]"
                            }`}
                        >
                            <Icon size={17} />
                            {label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={async () => {
                        await fetch("/api/admin/logout", { method: "POST" });
                        window.location.href = "/admin/login";
                    }}
                    className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-secondary)] hover:text-[var(--fg)]"
                >
                    <LogOut size={17} />
                    Sign out
                </button>
            </aside>

            <main className="min-w-0 flex-1 p-5 pb-10 sm:p-8">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[.25em] text-[var(--accent)]">
                            Control center
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-[var(--fg)]">
                            {current?.[1] ||
                                ({
                                    overview: "Overview",
                                    settings: "Site settings",
                                    pages: "Page content",
                                } as Record<string, string>)[tab]}
                        </h1>

                        <p className="mt-2 text-sm text-[var(--muted)]">
                            Manage the content of your portfolio.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => void load()}
                            className="glass rounded-full p-3 text-[var(--fg)] transition hover:bg-[var(--surface-secondary)]"
                            aria-label="Refresh"
                        >
                            <RefreshCw size={16} />
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[var(--border-strong)] px-4 py-2.5 text-sm text-[var(--fg)] transition hover:bg-[var(--surface-secondary)]"
                        >
                            View site ↗
                        </a>
                    </div>
                </header>

                {notice && (
                    <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--fg)]">
                        <span>{notice}</span>
                        <button
                            onClick={() => setNotice("")}
                            aria-label="Dismiss message"
                            className="text-[var(--muted)] transition hover:text-[var(--fg)]"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading ? (
                    <p className="text-[var(--muted)]">Loading…</p>
                ) : tab === "overview" ? (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {resources.map(([key, label, Icon]) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className="card rounded-2xl p-5 text-left transition hover:-translate-y-0.5"
                                >
                                    <Icon className="text-[var(--accent)]" size={20} />

                                    <p className="mt-5 text-2xl font-bold text-[var(--fg)]">
                                        {rows.filter((row) => row._resource === key).length}
                                    </p>

                                    <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
                                </button>
                            ))}
                        </div>

                        <div className="card mt-6 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-[var(--fg)]">Quick start</h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Manage projects, skills, experience, certificates, services, blog posts and social links.
                                Update site settings and page content to control your public portfolio.
                            </p>

                            <button
                                onClick={() => setTab("settings")}
                                className="btn btn-primary mt-5"
                            >
                                Configure site <Settings size={15} />
                            </button>
                        </div>
                    </>
                ) : tab === "settings" ? (
                    <div className="card max-w-3xl rounded-2xl p-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[
                                "siteTitle",
                                "tagline",
                                "logoUrl",
                                "profileUrl",
                                "seoTitle",
                                "seoDescription",
                                "primaryColor",
                                "backgroundColor",
                                "navText",
                                "footerText",
                                "contactEmail",
                                "contactLocation",
                            ].map((key) => (
                                <label
                                    key={key}
                                    className={`block space-y-2 text-sm ${
                                        imagePattern.test(key) || key === "seoDescription"
                                            ? "sm:col-span-2"
                                            : ""
                                    }`}
                                >
                                    <span className="block capitalize text-[var(--muted)]">
                                        {humanize(key)}
                                    </span>

                                    {imagePattern.test(key) ? (
                                        <ImageUploader
                                            value={settings[key] ?? ""}
                                            onChange={(url) =>
                                                setSettings((prev) => ({ ...prev, [key]: url }))
                                            }
                                        />
                                    ) : ["seoDescription", "tagline", "footerText", "navText"].includes(key) ? (
                                        <textarea
                                            rows={3}
                                            value={settings[key] ?? ""}
                                            onChange={(event) =>
                                                setSettings({
                                                    ...settings,
                                                    [key]: event.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    ) : (
                                        <input
                                            value={settings[key] ?? ""}
                                            onChange={(event) =>
                                                setSettings({
                                                    ...settings,
                                                    [key]: event.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    )}
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={() => void saveSettings()}
                            disabled={saving}
                            className="btn btn-primary mt-6 disabled:opacity-50"
                        >
                            {saving ? (
                                <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                                <Save size={15} />
                            )}
                            Save settings
                        </button>
                    </div>
                ) : tab === "pages" ? (
                    <div className="space-y-6">
                        <div className="card rounded-2xl p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)]">
                                    <FileText size={21} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-[var(--fg)]">
                                        Manage page content
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                        Edit headings, descriptions, and other content displayed across your portfolio.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ContentSectionCard
                            title="Homepage — Hero"
                            description="Edit your homepage introduction, role labels, and call-to-action buttons."
                            page="home"
                            section="hero"
                            content={homeHero}
                            onChange={setHomeHero}
                            onSave={() => void saveCustomSection("home", "hero", homeHero)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="Homepage — Sections"
                            description="Edit the titles and introductions displayed on your homepage."
                            page="home"
                            section="sections"
                            content={homeSections}
                            onChange={setHomeSections}
                            onSave={() => void saveCustomSection("home", "sections", homeSections)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="About — Main"
                            description="Edit the main heading and biography on your About page."
                            page="about"
                            section="main"
                            content={aboutSections}
                            onChange={setAboutSections}
                            onSave={() => void saveCustomSection("about", "main", aboutSections)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="Portfolio — Projects"
                            description="Edit the heading and introduction above your portfolio projects."
                            page="portfolio"
                            section="main"
                            content={portfolioSections}
                            onChange={setPortfolioSections}
                            onSave={() => void saveCustomSection("portfolio", "main", portfolioSections)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="Portfolio — Certifications"
                            description="Edit the heading and introduction above your certifications."
                            page="portfolio"
                            section="certifications"
                            content={certificationSections}
                            onChange={setCertificationSections}
                            onSave={() => void saveCustomSection("portfolio", "certifications", certificationSections)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="Services — Main"
                            description="Edit the main heading and introduction on your Services page."
                            page="services"
                            section="main"
                            content={servicesSections}
                            onChange={setServicesSections}
                            onSave={() => void saveCustomSection("services", "main", servicesSections)}
                            saving={saving}
                        />

                        <ContentSectionCard
                            title="Contact — Main"
                            description="Edit the main heading and introduction on your Contact page."
                            page="contact"
                            section="main"
                            content={contactSections}
                            onChange={setContactSections}
                            onSave={() => void saveCustomSection("contact", "main", contactSections)}
                            saving={saving}
                        />

                        {pages.length > 0 ? (
                            <div className="space-y-5">
                                {pages.map((page, index) => (
                                    <PageEditor
                                        key={page.id ?? `${page.page}-${page.section}-${index}`}
                                        page={page}
                                        onSave={savePage}
                                        saving={saving}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="card rounded-2xl p-6">
                                <p className="text-sm text-[var(--muted)]">
                                    No additional page content records were found. The dedicated page editors are available above.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => void load()}
                                    className="btn btn-primary mt-4"
                                >
                                    <RefreshCw size={15} />
                                    Reload content
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex justify-end">
                            <button
                                onClick={() =>
                                    setEditing({ ...blank[tab], _resource: tab })
                                }
                                className="btn btn-primary"
                            >
                                <Plus size={16} />
                                Add {current?.[1]?.replace(/s$/, " item") || "item"}
                            </button>
                        </div>

                        {editing && (
                            <div className="card mb-6 rounded-2xl p-5 sm:p-7">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-[var(--fg)]">
                                        {editing.id ? "Edit item" : "New item"}
                                    </h2>

                                    <button
                                        onClick={() => setEditing(null)}
                                        className="text-sm text-[var(--muted)] transition hover:text-[var(--fg)]"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {(fields[tab] || []).map((key) => (
                                        <Field
                                            key={key}
                                            name={key}
                                            value={editing[key] ?? blank[tab]?.[key] ?? ""}
                                            onChange={(value) =>
                                                setEditing((prev) =>
                                                    prev
                                                        ? { ...prev, [key]: value }
                                                        : prev
                                                )
                                            }
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => void save()}
                                    disabled={saving}
                                    className="btn btn-primary mt-6 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <LoaderCircle size={15} className="animate-spin" />
                                    ) : (
                                        <Save size={15} />
                                    )}
                                    Save item
                                </button>
                            </div>
                        )}

                        <div className="grid gap-3">
                            {rows.map((row, index) => {
                                const title =
                                    row.title ||
                                    row.name ||
                                    row.role ||
                                    row.label ||
                                    row.institution ||
                                    "Untitled item";

                                const image = row.imageUrl || row.coverUrl || "";

                                return (
                                    <div
                                        key={row.id ?? row.slug ?? index}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-[var(--shadow)]"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt=""
                                                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[var(--surface-secondary)] text-[var(--muted)]">
                                                    <ImageIcon size={18} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-[var(--fg)]">
                                                    {title}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-[var(--muted)]">
                                                    {row.company ||
                                                        row.category ||
                                                        row.issuer ||
                                                        row.url ||
                                                        row.slug ||
                                                        row.status ||
                                                        row.description ||
                                                        row.qualification}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() =>
                                                    setEditing({ ...row, _resource: tab })
                                                }
                                                className="rounded-full border border-[var(--border-strong)] px-3 py-2 text-xs text-[var(--fg)] transition hover:bg-[var(--surface-secondary)]"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => void remove(row)}
                                                aria-label="Delete item"
                                                className="rounded-full border border-red-400/30 p-2 text-red-500 transition hover:bg-red-500/10"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}