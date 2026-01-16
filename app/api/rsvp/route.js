// app/api/rsvp/route.js  (Next.js App Router, ESM)
// Assumes you have:
// - Prisma client at "@/lib/prisma.js" exporting `prisma`
// - Zod schema at "@/lib/validation/rsvp.schema.js" exporting `InvitationRsvpCreateSchema`

import {NextResponse} from "next/server";
import {InvitationRsvpCreateSchema} from "@/lib/zod.schema.js";
import {z} from "zod";
import {prisma} from "@/lib/prisma";

export const POST = async (request) => {
  try {
    const body = await request.json();

    // Validate + normalize (rsvp/email/phone normalization happens in schema)
    const parsed = InvitationRsvpCreateSchema.parse(body);

    // If your Prisma enum is RsvpStatus { YES, NO }, this expects parsed.rsvp === "YES" | "NO"
    // If your schema currently returns "yes" | "no" (lowercase), update the schema normalization.
    const saved = await prisma.invitationRsvp.create({
      data: {
        code: parsed.code, // UUID string
        name: parsed.name,
        rsvp: parsed.rsvp, // "YES" | "NO"
        adults: parsed.adults,
        children: parsed.children ?? null,
        email: parsed.email ?? null,
        phone: parsed.phone ?? null,
        message: parsed.message ?? null,
      },
      select: {
        id: true,
        code: true,
        name: true,
        rsvp: true,
        adults: true,
        children: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {ok: true, data: saved},
      {status: 201}
    );
  } catch (err) {
    // Zod validation errors
    if (err?.name === "ZodError") {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          details: err.issues?.map((i) => ({
            path: i.path?.join(".") || "",
            message: i.message,
          })),
        },
        {status: 400}
      );
    }

    // Prisma known errors
    // Unique constraint (e.g., code already used if you made code @unique)
    if (err?.code === "P2002") {
      return NextResponse.json(
        {ok: false, error: "DUPLICATE", message: "RSVP already exists for this code."},
        {status: 409}
      );
    }

    // Log server error (don’t leak internals to client)
    console.error("RSVP POST error:", err);

    return NextResponse.json(
      {ok: false, error: "SERVER_ERROR"},
      {status: 500}
    );
  }
};

// simple query validator
const CodeQuerySchema = z.object({
  code: z.string().uuid(),
});

export const GET = async (request) => {
  try {
    const {searchParams} = new URL(request.url);
    const rawCode = searchParams.get("code");

    const {code} = CodeQuerySchema.parse({code: rawCode});

    const exists = await prisma.invitationRsvp.findFirst({
      where: {code},
      select: {id: true}, // minimal payload
    });

    return NextResponse.json(
      {
        ok: true,
        exists: Boolean(exists),
      },
      {status: 200}
    );
  } catch (err) {
    // Zod validation error (missing / invalid UUID)
    if (err?.name === "ZodError") {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_CODE",
          message: "A valid invitation code (UUID) is required.",
        },
        {status: 400}
      );
    }

    console.error("RSVP GET error:", err);

    return NextResponse.json(
      {ok: false, error: "SERVER_ERROR"},
      {status: 500}
    );
  }
};
