// app/api/rsvp/route.js  (Next.js App Router, ESM)
// Assumes you have:
// - Prisma client at "@/lib/prisma.js" exporting `prisma`
// - Zod schema at "@/lib/validation/rsvp.schema.js" exporting `InvitationRsvpCreateSchema`

import {NextResponse} from "next/server";
import {InvitationRsvpCreateSchema} from "@/lib/zod.schema.js";
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

// Get all RSVPs
export const GET = async () => {
  try {
    const rsvps = await prisma.invitationRsvp.findMany({
      orderBy: {createdAt: "asc"},
    });

    return NextResponse.json(
      {ok: true, data: rsvps},
      {status: 200}
    );
  } catch (err) {
    console.error("RSVP GET all error:", err);

    return NextResponse.json(
      {ok: false, error: "SERVER_ERROR"},
      {status: 500}
    );
  }
}
