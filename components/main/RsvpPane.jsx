'use client';
import {useEffect, useMemo, useState} from "react";
import invitationsData from "@/assets/data/invitations.json";
import {useSearchParams} from "next/dist/client/components/navigation";

const RsvpPane = () => {
  const searchParams = useSearchParams();
  const [attending, setAttending] = useState(true);

  const [invitationCode, setInvitationCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [nameDisabled, setNameDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [messageForCelebrant, setMessageForCelebrant] = useState("");

  const [adultCount, setAdultCount] = useState(1);
  const [kidCount, setKidCount] = useState(0);
  const [noCode, setNoCode] = useState(false);

  const [submitResult, setSubmitResult] = useState("");
  const [calendarHref, setCalendarHref] = useState("#");
  const [calendarFilename, setCalendarFilename] = useState("CairusEiinzig-1st-Birthday-Feb7.ics");

  // On component load, check for code in query params to pre-fill name (if found) in invitations.json
  useEffect(() => {
    const checkCode = async () => {
      const codeParam = searchParams.get("code") || "";

      if (codeParam) {
        const invitations = invitationsData?.invitations ?? [];
        const matchedInv = invitations.find(
          (inv) => String(inv.code || "").trim().toLowerCase() === codeParam.trim().toLowerCase()
        );

        if (matchedInv && matchedInv.name) {
          setFullName(String(matchedInv.name).trim());
          setInvitationCode(codeParam.trim().toLowerCase());
          // Disable editing name if matched
          // Optionally, you can uncomment the next line to disable editing
          setNameDisabled(true);
        } else {
          setNoCode(true);
        }
      } else {
        setNoCode(true);
      }
    };
    checkCode();
  }, []);

  const totalGuests = adultCount + kidCount;

  const attendingPillClass = useMemo(() => {
    return (
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
      (attending ? "bg-[#38802E]/10 text-[#38802E]" : "bg-slate-100 text-[#78350F]")
    );
  }, [attending]);

  // Button styling (replaces the old `.selected` class)
  const guestBtnBase =
    "guest-btn rounded-xl border border-[#EFD9BB] bg-white px-3 py-2 text-sm font-bold text-[#78350F] " +
    "shadow-sm transition hover:bg-[#FFFBEB] focus:outline-none focus:ring-4 focus:ring-[#AB8653]/20";

  const guestBtnSelected =
    "border-[#78350F] bg-[#FFFBEB] ring-2 ring-[#AB8653]/30";

  function selectGuest(type, value) {
    const v = Number(value);
    const nextAdults = type === "adult" ? v : adultCount;
    const nextKids = type === "kid" ? v : kidCount;

    if (nextAdults + nextKids > 8) return;

    if (type === "adult") setAdultCount(v);
    if (type === "kid") setKidCount(v);
  }

  // =========================
  // Add to Calendar (.ics)
  // =========================
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();

    let start = new Date(year, 1, 7, 14, 0, 0); // Feb 7 3:00 PM
    let end = new Date(year, 1, 7, 18, 0, 0); // Feb 7 6:00 PM

    // If already passed, move to next year (keep same Feb 7)
    if (start.getTime() < Date.now()) {
      start = new Date(year + 1, 1, 7, 15, 0, 0);
      end = new Date(year + 1, 1, 7, 18, 0, 0);
    }

    function fmt(d) {
      const pad = (n) => String(n).padStart(2, "0");
      return (
        d.getFullYear() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds())
      );
    }

    const title = "Cairus Eiizig Gonzales 1st Birthday Celebration (Party Date)";
    const description =
      "Birthday is Feb 5, but the celebration party is on Feb 7. See you there!";
    const location = "Party Venue (with pool)"; // replace with actual venue

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JungleRSVP//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@junglersvp
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], {type: "text/calendar;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    const filename =
      start.getFullYear() +
      "-CairusEiinzig-1st-Birthday-Feb7.ics";

    setCalendarHref(url);
    setCalendarFilename(filename);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    // Get code from queryString
    const code = searchParams.get("code");
    const cleanName = fullName.trim();
    const nameForMsg = cleanName || "guest";
    const adultCountSafe = Number(adultCount) || 0;
    const kidCountSafe = Number(kidCount) || 0;
    const phoneSafe = mobile.trim();
    const emailSafe = email.trim();
    const messageSafe = messageForCelebrant.trim();
    const rsvpStatus = attending ? "YES" : "NO";

    // Basic validation
    if (attending && adultCountSafe + kidCountSafe > 8) {
      setSubmitResult("❌ Error: Total guests cannot exceed 8.");
      return;
    }

    // Prepare payload
    const payload = {
      code: code || invitationCode,
      name: cleanName,
      rsvp: rsvpStatus,
      adults: adultCountSafe,
      children: kidCountSafe,
      email: emailSafe,
      phone: phoneSafe,
      message: messageSafe,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.message || "An error occurred while submitting your RSVP.";
        setSubmitResult(`❌ Error: ${errorMsg}`);
        return;
      }
    } catch (err) {
      setSubmitResult("❌ Error: Network error or server is unreachable.");
      return;
    }
    if (!attending) {
      setSubmitResult(`Thanks, ${nameForMsg}! ✅ Noted that you can’t make it.`);
      return;
    }

    const total = adultCount + kidCount;
    setSubmitResult(
      `Thanks, ${nameForMsg}! ✅ Headcount: ${adultCount} adult(s), ${kidCount} kid(s) • Total ${total}/8`
    );
  }

  // When toggling to NOT attending, mimic script behavior by "disabling" and clearing attending-only data
  useEffect(() => {
    if (!attending) {
      setEmail("");
      setMobile("");
      setMessageForCelebrant("");
      setAdultCount(1);
      setKidCount(0);
    }
  }, [attending]);

  return (
    <aside className="lg:col-span-5">
      <div
        id="rsvp"
        className="sticky top-6 rounded-3xl border-4 border-[#AB8653] bg-[#FEF6E1] p-6 shadow-sm backdrop-blur sm:p-8"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#78350F]">RSVP</h2>
            <p className="mt-1 text-sm text-[#78350F]">
              Please confirm your attendance for <span className="font-semibold">Feb 7</span>.
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full whitespace-nowrap bg-[#AB8653] px-3 py-1 text-xs font-bold text-white">
            🐵 Jungle Crew
          </span>
        </div>
        {noCode && (
          <div className="mt-6 rounded-2xl border border-[#D97706] bg-[#FEF3C7] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-[#F59E0B] text-[#78350F] shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V6h2Z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#78350F]">
                  RSVP link required
                </p>
                <p className="mt-1 text-sm text-[#451A03]">
                  Please contact{" "}
                  <span className="font-extrabold underline decoration-[#B45309] decoration-2 underline-offset-2">
                    Carlo Gonzales / April Joy Gonzales
                  </span>{" "} to get your personal RSVP link.
                </p>
              </div>
            </div>
          </div>
        )}
        {!noCode && (
          <>
            <form className={"mt-6 space-y-4 " + (!submitResult ? "" : "hidden")} onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="text-sm font-semibold text-[#78350F]">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  disabled={nameDisabled}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Juan Dela Cruz"
                  className="mt-2 w-full rounded-2xl border border-[#EFD9BB] bg-white px-4 py-3 text-sm outline-none ring-[#AB8653]/30 placeholder:text-[#AB8653] focus:ring-4 disabled:opacity-100 disabled:bg-[#EFD9BB] disabled:border-[#EFD9BB] disabled:text-slate-900 disabled:placeholder:text-[#AB8653] disabled:cursor-not-allowed"
                />
              </div>

              <div className="rounded-2xl border border-[#EFD9BB] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#78350F]">RSVP</p>
                    <p id="rsvpHelp" className="mt-0.5 text-xs text-[#78350F]">
                      Toggle on if you can join us on <strong>Feb 7</strong>.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      id="attending"
                      name="attending"
                      type="checkbox"
                      className="peer sr-only"
                      checked={attending}
                      onChange={(e) => setAttending(e.target.checked)}
                    />
                    <span
                      className="h-7 w-12 rounded-full bg-slate-200 transition peer-checked:bg-[#748F52] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#748F52]/30"></span>
                    <span
                      className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
                  </label>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs">
              <span id="attendingPill" className={attendingPillClass}>
                {attending ? "✅ Attending" : "❌ Not attending"}
              </span>
                  <span className="text-[#AB8653]">Switch off if you can’t make it.</span>
                </div>
              </div>

              <hr className="my-4 border-t border-[#AB8653]/20"/>

              {/* Attending-only fields */}
              <div id="attendingFields" className={"space-y-4 " + (!attending ? "hidden" : "")}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-[#78350F]">
                      Email <span className="font-normal text-[#AB8653]">(optional)</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!attending}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-[#EFD9BB] bg-white px-4 py-3 text-sm outline-none ring-[#AB8653]/30 placeholder:text-[#AB8653] focus:ring-4 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className="text-sm font-semibold text-[#78350F]">
                      Mobile <span className="font-normal text-[#AB8653]">(optional)</span>
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      disabled={!attending}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="09xx xxx xxxx"
                      className="mt-2 w-full rounded-2xl border border-[#EFD9BB] bg-white px-4 py-3 text-sm outline-none ring-[#AB8653]/30 placeholder:text-[#AB8653] focus:ring-4 disabled:opacity-60"
                    />
                  </div>
                </div>

                <hr className="my-4 border-t border-[#AB8653]/20"/>

                <div id="guestSection" className="rounded-2xl border border-[#EFD9BB] bg-[#E2CDB5] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#78350F]">Guests</p>
                      <p className="mt-0.5 text-xs text-[#78350F]">
                        Select counts below (max <strong>8</strong> total).
                      </p>
                    </div>
                    <span
                      id="guestTotalPill"
                      className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-[#78350F]"
                    >
                  Total: <span className="ml-1 font-extrabold" id="guestTotal">{totalGuests}</span>/8
                </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[#78350F]">Adults</p>
                      <input type="hidden" id="adultCount" name="adultCount" value={adultCount}/>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                          <button
                            key={"adult-" + v}
                            type="button"
                            className={
                              guestBtnBase +
                              " " +
                              (adultCount === v ? `selected ${guestBtnSelected}` : "")
                            }
                            data-type="adult"
                            data-value={v}
                            disabled={!attending}
                            onClick={() => selectGuest("adult", v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#78350F]">Kids</p>
                      <input type="hidden" id="kidCount" name="kidCount" value={kidCount}/>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                          <button
                            key={"kid-" + v}
                            type="button"
                            className={
                              guestBtnBase +
                              " " +
                              (kidCount === v ? `selected ${guestBtnSelected}` : "")
                            }
                            data-type="kid"
                            data-value={v}
                            disabled={!attending}
                            onClick={() => selectGuest("kid", v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#AB8653]">
                    Tip: We recommend at least <strong>1 adult</strong> selected.
                  </p>

                  {totalGuests > 8 && (
                    <p className="mt-2 text-xs font-semibold text-red-700">
                      Max total is 8 guests.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="messageForCelebrant" className="text-sm font-semibold text-[#78350F]">
                    Message for the celebrant <span className="font-normal text-[#AB8653]">(optional)</span>
                  </label>
                  <textarea
                    id="messageForCelebrant"
                    name="messageForCelebrant"
                    rows={3}
                    disabled={!attending}
                    value={messageForCelebrant}
                    onChange={(e) => setMessageForCelebrant(e.target.value)}
                    placeholder="Leave a sweet message for the birthday boy…"
                    className="mt-2 w-full resize-none rounded-2xl border border-[#EFD9BB] bg-white px-4 py-3 text-sm outline-none ring-[#AB8653]/30 placeholder:text-[#AB8653] focus:ring-4 disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#78350F] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#92400E] focus:outline-none focus:ring-4 focus:ring-[#AB8653]/30"
              >
                Submit RSVP
              </button>
            </form>


            <div
              id="submitResult"
              className={
                "mt-6 relative rounded-2xl border border-[#8C6A3E] bg-[#F3D8A8] p-4 pl-5 text-sm font-semibold text-[#5A3A12] shadow-md " +
                "before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:rounded-l-2xl before:bg-[#AB8653] " +
                (submitResult ? "" : "hidden")
              }
            >
              {submitResult}
            </div>

            <hr className="my-6 border-t-2 border-[#AB8653]/40"/>

            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-amber-200/60 text-amber-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V6h2Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-amber-900">
                    Important: Please plan for{" "}
                    <span className="underline decoration-amber-400 decoration-2 underline-offset-2">Feb 7</span>
                  </p>
                  <p className="mt-1 text-sm text-[#78350F]">
                    His birthday is <span className="font-semibold">Feb 5</span>, but the celebration party is on{" "}
                    <span className="font-extrabold text-[#78350F]">Feb 7</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#EFD9BB] bg-[#E2CDB5] p-4">
              <p className="text-sm font-semibold text-[#78350F]">Add to Calendar</p>
              <p className="mt-0.5 text-xs text-[#78350F]">Save the party date so you don’t miss it.</p>

              <a
                id="addToCalendarBtn"
                href={calendarHref}
                download={calendarFilename}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#78350F] px-4 py-3 text-sm font-bold text-white ring-[#AB8653]/30 hover:bg-[#92400E] focus:outline-none focus:ring-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"/>
                </svg>
                Add Feb 7 to calendar
              </a>

              <p className="mt-2 text-[11px] text-[#AB8653]">
                Works with Google/Apple/Outlook (downloads an .ics file).
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default RsvpPane;
