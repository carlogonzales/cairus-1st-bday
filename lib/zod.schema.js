// /lib/validation/rsvp.schema.js
import { z } from "zod";

const trimOrUndefined = (v) => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

const normalizePhone = (raw) => {
  const v = raw.trim();
  const plus = v.startsWith("+") ? "+" : "";
  const digits = v.replace(/[^\d]/g, "");
  return (plus + digits) || undefined;
};

export const InvitationRsvpCreateSchema = z.object({
  code: z.uuid(),

  name: z.string().min(1).max(120),

  // ✅ normalized RSVP
  rsvp: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.enum(["yes", "no"]))
    .transform((v) => v.toUpperCase()),

  adults: z.coerce.number().int().min(0),

  children: z.coerce.number().int().min(0).optional(),

  email: z
    .preprocess(trimOrUndefined, z.email().max(255).optional())
    .transform((v) => (typeof v === "string" ? v.toLowerCase() : v))
    .optional(),

  phone: z
    .preprocess(trimOrUndefined, z.string().optional())
    .transform((v) => (typeof v === "string" ? normalizePhone(v) : v))
    .optional(),

  message: z.string().max(1000).optional(),
});
