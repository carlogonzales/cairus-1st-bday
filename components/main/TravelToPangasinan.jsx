"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import placesJson from "@/assets/data/places.json";

const TravelToPangasinan = (props) => {
  // --- DATA (from your script) ---
  const DATA = useMemo(
    () => placesJson,
    []
  );

  const mapSrcForQuery = useCallback((q) => {
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  }, []);

  const mapsLink = useCallback((q) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      q
    )}`;
  }, []);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("places");
  const [mapSrc, setMapSrc] = useState(
    "https://www.google.com/maps?q=Pangasinan%2C%20Philippines&output=embed"
  );
  const [focusedQuery, setFocusedQuery] = useState(null);

  const items = useMemo(() => DATA[activeTab] || [], [DATA, activeTab]);

  // default tab map: Pangasinan (and keep it stable on mount)
  useEffect(() => {
    // nothing needed; state already has the default map
  }, []);

  const onPickItem = useCallback(
    (q) => {
      setFocusedQuery(q);
      setMapSrc(mapSrcForQuery(q));

      // helpful: scroll map into view on mobile (mimics your script)
      // We scroll the wrapper of the iframe.
      const el = document.getElementById("pangasinanMapWrap");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [mapSrcForQuery]
  );

  const tabClass = useCallback(
    (tab) => {
      const active = tab === activeTab;
      return active
        ? "tab-btn rounded-2xl bg-[#AB8653] px-4 py-2 text-xs font-extrabold text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-[#AB8653]/30"
        : "tab-btn border-[#AB8653] rounded-2xl bg-[#F8EDD7] px-4 py-2 text-xs font-extrabold text-[#AB8653] hover:bg-[#AB8653]/80 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#AB8653]/30";
    },
    [activeTab]
  );

  return (
    <section
      id="pangasinan"
      className="relative z-30 mt-10 rounded-3xl border-4 border-[#AB8653] bg-gradient-to-b from-[#FEF6E1] to-transparent p-6 shadow-sm backdrop-blur sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#78350F]">
            Where to go after the celebration in{" "}
            <span className="text-[#AB8653] text-2xl underline decoration-[#AB8653]/40 underline-offset-4">
              Pangasinan
            </span>
          </h2>
          <p className="mt-2 text-sm text-[#78350F]">
            A quick mini-guide for beaches, landmarks, and places to stay. Tap a
            card to update the map.
          </p>
        </div>

        <a
          id="openMapAll"
          href="https://www.google.com/maps?q=Pangasinan%2C%20Philippines"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-[#78350F] ring-emerald-600/20 hover:bg-emerald-100 focus:outline-none focus:ring-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.5 3.5a1 1 0 0 0-.95-.08l-5.55 2.22-6-2.4a1 1 0 0 0-.74 0L3.5 4.5a1 1 0 0 0-.5.87v14a1 1 0 0 0 1.45.9l5.55-2.22 6 2.4a1 1 0 0 0 .74 0l3.76-1.5a1 1 0 0 0 .5-.87v-14a1 1 0 0 0-.5-.58ZM10 18.62l-4 1.6V6.38l4-1.6Zm6 1l-4-1.6V5.38l4 1.6Zm4-1.4-2 0.8V6.38l2-0.8Z" />
          </svg>
          Open Pangasinan Map
        </a>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            id="pangasinanMapWrap"
            className="overflow-hidden rounded-3xl border border-[#EFD9BB] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#EFD9BB] bg-[#E2CDB5] px-4 py-3">
              <div>
                <p className="text-sm font-extrabold text-[#78350F]">
                  Map Preview
                </p>
                <p className="text-xs text-[#78350F]">
                  Click any card to focus the map.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#D7B07B] px-3 py-1 text-xs font-semibold text-[#78350F]">
                🗺️ Interactive
              </span>
            </div>

            <div className="aspect-[16/11] sm:aspect-[16/10]">
              <iframe
                id="pangasinanMap"
                title="Pangasinan map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-[#AB8653]">
            Note: The embedded map uses a simple “search query” embed (no API key
            needed).
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-[#EFD9BB] bg-[#FBF2DC] p-4 shadow-sm">
            <p className="text-sm font-extrabold text-[#78350F]">Browse</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                data-tab="places"
                className={tabClass("places")}
                onClick={() => setActiveTab("places")}
              >
                Places &amp; Beaches
              </button>
              <button
                type="button"
                data-tab="landmarks"
                className={tabClass("landmarks")}
                onClick={() => setActiveTab("landmarks")}
              >
                Landmarks
              </button>
              <button
                type="button"
                data-tab="stays"
                className={tabClass("stays")}
                onClick={() => setActiveTab("stays")}
              >
                Hotels &amp; Stays
              </button>
            </div>

            <div
              id="pangasinanCards"
              className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              {items.map((x, idx) => {
                const isFocused = focusedQuery === x.query;
                return (
                  <button
                    key={`${activeTab}-${idx}-${x.query}`}
                    type="button"
                    className={[
                      // base
                      "group w-full text-left rounded-2xl border border-[#EFD9BB] p-3 shadow-sm transition cursor-pointer",
                      "focus:outline-none focus:ring-4 focus:ring-[#AB8653]/30",

                      // hover
                      "hover:-translate-y-0.5 hover:border-[#AB8653] hover:bg-[#CBA673]/40",

                      // focus / selected
                      isFocused
                        ? "border-[#AB8653] bg-[#F4E6C9] text-[#5F2F0C] ring-4 ring-[#AB8653]/20"
                        : "bg-[#FBF2DC]",
                    ].join(" ")}
                    data-query={x.query}
                    onClick={() => onPickItem(x.query)}
                  >
                    {/* top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-[#78350F] leading-snug line-clamp-2">
                          {x.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-[#78350F]">
                          {x.area}, Pangasinan
                        </p>
                      </div>
                    </div>

                    {/* note (clamped so it doesn't expand too tall) */}
                    <p className="mt-2 text-xs text-[#78350F] leading-snug line-clamp-2">
                      {x.note}
                    </p>

                    {/* tags + link in one compact row */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex flex-wrap gap-1.5">
                        {x.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-[#FFE8B2] px-2 py-0.5 text-[10px] font-semibold text-[#78350F]"
                          >{t}</span>
                        ))}
                      </div>

                      <a
                        href={mapsLink(x.query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#78350F] hover:text-emerald-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Maps
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
                        </svg>
                      </a>
                    </div>
                  </button>

                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-[#FFEEC6] bg-[#FFEEC6]/90 p-4">
            <p className="text-sm font-extrabold text-[#78350F]">Quick tip</p>
            <p className="mt-1 text-sm text-[#78350F]">
              If you’re doing a day trip, pick <strong>one area</strong> (e.g.,
              Alaminos / Bolinao / Manaoag) to avoid too much travel time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelToPangasinan;
