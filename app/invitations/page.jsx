"use client";

import { useEffect, useMemo, useState } from "react";
import invitationsData from "@/assets/data/invitations.json";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const InvitationsPage = () => {
  const invitations = invitationsData?.invitations ?? [];
  const [copiedCode, setCopiedCode] = useState(null);

  // RSVP API state
  const [rsvpLoading, setRsvpLoading] = useState(true);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpRows, setRsvpRows] = useState([]);

  // Modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setRsvpLoading(true);
        setRsvpError("");

        const res = await fetch("/api/rsvp", { method: "GET" });
        const json = await res.json();

        if (!alive) return;

        if (!res.ok || !json?.ok) {
          setRsvpError(json?.error || "Failed to load RSVP data.");
          setRsvpRows([]);
          return;
        }

        setRsvpRows(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        if (!alive) return;
        setRsvpError("Failed to load RSVP data.");
        setRsvpRows([]);
      } finally {
        if (!alive) return;
        setRsvpLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const rsvpByCode = useMemo(() => {
    const map = new Map();
    for (const r of rsvpRows || []) {
      if (r?.code) map.set(String(r.code).trim(), r);
    }
    return map;
  }, [rsvpRows]);

  const rows = useMemo(() => {
    return invitations.map((inv) => {
      const code = String(inv.code || "").trim();
      const name = String(inv.name || "").trim();
      const link = `${BASE_URL}/?code=${encodeURIComponent(code)}`;

      const r = rsvpByCode.get(code);

      return {
        name,
        code,
        link,
        hasRsvp: Boolean(r),
        rsvp: r?.rsvp ?? "",
        adults: typeof r?.adults === "number" ? r.adults : null,
        children: typeof r?.children === "number" ? r.children : null,
        email: r?.email ?? "",
        phone: r?.phone ?? "",
        message: (r?.message ?? "").toString(),
        createdAt: r?.createdAt ?? "",
        updatedAt: r?.updatedAt ?? "",
      };
    });
  }, [invitations, rsvpByCode]);

  const copyToClipboard = async (text, code) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1200);
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);

        setCopiedCode(code);
        window.setTimeout(() => setCopiedCode(null), 1200);
      } catch {
        alert("Copy failed. Please copy the link manually.");
      }
    }
  };

  const badgeForRsvp = (rsvp, hasRsvp) => {
    if (!hasRsvp) {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
          No response
        </span>
      );
    }
    if (rsvp === "YES") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-900">
          YES
        </span>
      );
    }
    if (rsvp === "NO") {
      return (
        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-900">
          NO
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900">
        Unknown
      </span>
    );
  };

  const openDetails = (row) => {
    setDetailsRow(row);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setDetailsRow(null);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Invitations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Invitations come from <code className="rounded bg-slate-50 px-1.5 py-0.5">invitations.json</code>. RSVP
            details come from <code className="rounded bg-slate-50 px-1.5 py-0.5">GET /api/rsvp</code>, matched by{" "}
            <code className="rounded bg-slate-50 px-1.5 py-0.5">code</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <div>
            Total: <span className="font-semibold text-slate-900">{rows.length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            Responded:{" "}
            <span className="font-semibold text-slate-900">{rows.filter((r) => r.hasRsvp).length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            {rsvpLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                Loading RSVPs…
              </span>
            ) : rsvpError ? (
              <span className="text-rose-700">{rsvpError}</span>
            ) : (
              <span className="text-slate-600">RSVPs loaded</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Code</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Invitation Link</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">RSVP</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Details</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">Actions</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                  No invitations found in{" "}
                  <code className="rounded bg-slate-50 px-1.5 py-0.5">invitations.json</code>.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.name}</td>

                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-700">{row.code}</code>
                  </td>

                  <td className="px-4 py-3">
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block max-w-[420px] truncate text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                      title={row.link}
                    >
                      {row.link}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">Opens in a new tab</p>
                  </td>

                  <td className="px-4 py-3">{badgeForRsvp(row.rsvp, row.hasRsvp)}</td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openDetails(row)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                    >
                      View details
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(row.link, row.code)}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
                      >
                        {copiedCode === row.code ? "Copied!" : "Copy link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(row.code, row.code)}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                      >
                        Copy code
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-600">
          Link format:{" "}
          <code className="rounded bg-white px-1.5 py-0.5">
            {BASE_URL}/?code=&lt;UUID&gt;
          </code>
        </p>
      </div>

      {/* Modal */}
      {detailsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="RSVP details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDetails();
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900">RSVP Details</p>
                <p className="mt-1 text-xs text-slate-600">
                  {detailsRow?.name} • <span className="font-semibold">{detailsRow?.rsvp || "No response"}</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-500 break-all">
                  Code: <span className="font-mono">{detailsRow?.code}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Adults</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {detailsRow?.hasRsvp ? detailsRow?.adults ?? 0 : "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Children</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {detailsRow?.hasRsvp ? detailsRow?.children ?? 0 : "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">E-mail</p>
                  <p className="mt-1 text-sm text-slate-900 break-all">
                    {detailsRow?.email ? detailsRow.email : <span className="text-slate-400">—</span>}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Phone</p>
                  <p className="mt-1 text-sm text-slate-900 break-all">
                    {detailsRow?.phone ? detailsRow.phone : <span className="text-slate-400">—</span>}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Message</p>
                <div className="mt-2 max-h-[280px] overflow-auto rounded-lg bg-slate-50 p-3 text-sm text-slate-900 whitespace-pre-wrap">
                  {detailsRow?.message && detailsRow.message.trim().length ? (
                    detailsRow.message
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(detailsRow?.link || "", detailsRow?.code || "")}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={closeDetails}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Esc key close */}
          <ModalEscCloser onClose={closeDetails} />
        </div>
      ) : null}
    </main>
  );
};

// Small helper component for ESC-to-close (client-only)
const ModalEscCloser = ({ onClose }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return null;
};

export default InvitationsPage;
