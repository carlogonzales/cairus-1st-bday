import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";


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
