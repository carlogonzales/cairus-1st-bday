-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('YES', 'NO');

-- CreateTable
CREATE TABLE "InvitationRsvp" (
    "id" UUID NOT NULL,
    "code" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "rsvp" "RsvpStatus" NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER,
    "email" VARCHAR(255),
    "phone" VARCHAR(40),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitationRsvp_code_key" ON "InvitationRsvp"("code");

-- CreateIndex
CREATE INDEX "InvitationRsvp_code_idx" ON "InvitationRsvp"("code");
