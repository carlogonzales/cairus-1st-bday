"use client";

import { useMemo, useState } from "react";
import invitationsData from "@/assets/data/invitations.json";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const InvitationsPage = () => {
  const invitations = invitationsData?.invitations ?? [];
  const [copiedCode, setCopiedCode] = useState(null);

  const rows = useMemo(() => {
    return invitations.map((inv) => {
      const code = String(inv.code || "").trim();
      const name = String(inv.name || "").trim();
      const link = `${BASE_URL}/?code=${encodeURIComponent(code)}`;
      return { name, code, link };
    });
  }, [invitations]);

  const copyToClipboard = async (text, code) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1200);
    } catch (e) {
      // Fallback for older browsers / non-secure contexts
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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Invitations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Share the generated invitation links. Click “Copy” to copy the full URL.
          </p>
        </div>

        <div className="text-sm text-slate-600">
          Total: <span className="font-semibold text-slate-900">{rows.length}</span>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                Name
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                Code
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                Invitation Link
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                Actions
              </th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-600" colSpan={4}>
                  No invitations found in <code className="rounded bg-slate-50 px-1.5 py-0.5">invitations.json</code>.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {row.name}
                  </td>

                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-700">{row.code}</code>
                  </td>

                  <td className="px-4 py-3">
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block max-w-[520px] truncate text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                      title={row.link}
                    >
                      {row.link}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">
                      Opens in a new tab
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(row.link, row.code)}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
                      >
                        {copiedCode === row.code ? "Copied!" : "Copy"}
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
            https://cairus.carlogonzales.com/?code=&lt;UUID&gt;
          </code>
        </p>
      </div>
    </main>
  );
};

export default InvitationsPage;
