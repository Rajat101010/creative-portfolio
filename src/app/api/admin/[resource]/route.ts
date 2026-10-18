
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const models: Record<string, string> = {
    projects: "project",
    skills: "skill",
    experience: "experience",
    education: "education",
    certificates: "certificate",
    services: "service",
    posts: "blogPost",
    socials: "socialLink",
};

type RouteContext = {
    params: Promise<{ resource: string }>;
};

function modelFor(resource: string): string | undefined {
    return models[resource];
}

function prismaModel(client: any, name: string): any {
    const model = client[name];

    if (
        !model ||
        typeof model.findMany !== "function" ||
        typeof model.create !== "function" ||
        typeof model.update !== "function" ||
        typeof model.delete !== "function"
    ) {
        throw new Error(
            `Prisma model "${name}" is unavailable. Check schema.prisma and regenerate Prisma Client.`
        );
    }

    return model;
}

function prepareData(resource: string, body: Record<string, any>) {
    const data = { ...body };

    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data._resource;
    delete data._uploadField;

    if (resource === "posts" && "publishedAt" in data) {
        if (data.publishedAt === "") {
            data.publishedAt = null;
        } else if (data.publishedAt != null) {
            const date = new Date(data.publishedAt);

            if (Number.isNaN(date.getTime())) {
                throw new Error("Invalid publishedAt date.");
            }

            data.publishedAt = date;
        }
    }

    return data;
}

function validateBody(body: unknown): body is Record<string, any> {
    return (
        body !== null &&
        typeof body === "object" &&
        !Array.isArray(body)
    );
}

function errorResponse(message: string, error: unknown) {
    console.error(`[Admin API] ${message}`, error);

    const details =
        error instanceof Error ? error.message : String(error);

    const code =
        error &&
            typeof error === "object" &&
            "code" in error &&
            typeof error.code === "string"
            ? error.code
            : undefined;

    let friendlyDetails = details;

    if (code === "P2002") {
        friendlyDetails = "A record with this unique value already exists.";
    } else if (code === "P2003") {
        friendlyDetails = "A related record is missing or violates a database relation.";
    } else if (code === "P2025") {
        friendlyDetails = "The requested record was not found.";
    } else if (code === "P2011" || code === "P2012") {
        friendlyDetails = "A required database field is missing.";
    } else if (code === "P2021" || code === "P2022") {
        friendlyDetails = "A database table or column is missing. Check your migrations.";
    }

    return NextResponse.json(
        {
            error: message,
            details:
                process.env.NODE_ENV === "development"
                    ? friendlyDetails
                    : undefined,
            code,
        },
        { status: code === "P2025" ? 404 : 400 }
    );
}

function unknownResource() {
    return NextResponse.json(
        { error: "Unknown resource." },
        { status: 404 }
    );
}

export async function GET(
    _req: NextRequest,
    { params }: RouteContext
) {
    const { resource } = await params;
    const model = modelFor(resource);

    if (!model) return unknownResource();

    try {
        const orderBy =
            resource === "posts"
                ? { createdAt: "desc" }
                : { sortOrder: "asc" };

        const rows = await prismaModel(db, model).findMany({ orderBy });

        return NextResponse.json(rows);
    } catch (error) {
        return errorResponse("Could not load items.", error);
    }
}

export async function POST(
    req: NextRequest,
    { params }: RouteContext
) {
    const { resource } = await params;
    const model = modelFor(resource);

    if (!model) return unknownResource();

    try {
        const body: unknown = await req.json();

        if (!validateBody(body)) {
            return NextResponse.json(
                { error: "Invalid JSON body." },
                { status: 400 }
            );
        }

        const data = prepareData(resource, body);
        const row = await prismaModel(db, model).create({ data });

        return NextResponse.json(row, { status: 201 });
    } catch (error) {
        return errorResponse("Could not create item.", error);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: RouteContext
) {
    const { resource } = await params;
    const model = modelFor(resource);

    if (!model) return unknownResource();

    try {
        const body: unknown = await req.json();

        if (
            !validateBody(body) ||
            typeof body.id !== "string" ||
            !body.id.trim()
        ) {
            return NextResponse.json(
                { error: "A valid string item id is required." },
                { status: 400 }
            );
        }

        const { id } = body;
        const data = prepareData(resource, body);

        const row = await db.$transaction(async (tx) => {
            if (resource === "posts" && data.pinned === true) {
                await tx.blogPost.updateMany({
                    where: {
                        pinned: true,
                        NOT: { id },
                    },
                    data: { pinned: false },
                });
            }

            return prismaModel(tx, model).update({
                where: { id },
                data,
            });
        });

        return NextResponse.json(row);
    } catch (error) {
        return errorResponse("Could not update item.", error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: RouteContext
) {
    const { resource } = await params;
    const model = modelFor(resource);

    if (!model) return unknownResource();

    try {
        const id = new URL(req.url).searchParams.get("id");

        if (!id?.trim()) {
            return NextResponse.json(
                { error: "An id is required." },
                { status: 400 }
            );
        }

        await prismaModel(db, model).delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return errorResponse("Could not delete item.", error);
    }
}
