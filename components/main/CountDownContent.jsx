'use client';
import { useEffect, useMemo, useState } from "react";

const CountDownContent = () => {
  const [countdownLabel, setCountdownLabel] = useState("Loading countdown…");
  const [cdDays, setCdDays] = useState("--");
  const [cdHours, setCdHours] = useState("--");
  const [cdMins, setCdMins] = useState("--");
  const [cdSecs, setCdSecs] = useState("--");

  // Compute party date once on mount (local timezone)
  const partyDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();

    // Feb is month index 1 (0=Jan, 1=Feb)
    const d = new Date(year, 1, 7, 15, 0, 0);

    // If already passed for this year, set next year
    if (d.getTime() < now.getTime()) d.setFullYear(year + 1);

    return d;
  }, []);

  useEffect(() => {
    function pad2(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const t = partyDate.getTime() - Date.now();

      if (t <= 0) {
        setCdDays("00");
        setCdHours("00");
        setCdMins("00");
        setCdSecs("00");
        setCountdownLabel("It’s party time! 🎉");
        return;
      }

      const totalSeconds = Math.floor(t / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      setCdDays(pad2(days));
      setCdHours(pad2(hours));
      setCdMins(pad2(mins));
      setCdSecs(pad2(secs));

      const partyText = partyDate.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setCountdownLabel("Party starts: " + partyText);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [partyDate]);

  return (
    <div className="rounded-3xl border-4 border-[#AB8653] bg-[#FFFBEB] p-6 shadow-sm backdrop-blur sm:p-8">
      <p className="text-base text-[#78350F]">
        We’re celebrating with a cozy jungle party—good food, fun photos, and lots of smiles.
        Please RSVP so we can prepare everything for you.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#AB8653] bg-[#FFFBEB] p-4">
          <p className="text-xs font-semibold text-[#78350F]">Celebrant’s Birthday</p>
          <p className="mt-1 text-lg font-bold text-[#78350F]">Feb 5</p>
          <p className="mt-1 text-sm text-[#78350F]">This is his actual birth date.</p>
        </div>
        <div className="rounded-2xl border border-[#69A04F] bg-[#FFFBEB] p-4">
          <p className="text-xs font-semibold text-[#38802E]">Party Celebration Date</p>
          <p className="mt-1 text-lg font-bold text-[#38802E]">Feb 7</p>
          <p className="mt-1 text-sm text-[#38802E]">
            <span className="font-semibold">We celebrate on Feb 7</span>—please plan for this date.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#AB8653] bg-[#FEF6E1] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#78350F]">Countdown to the Party (Feb 7)</p>
            <p className="text-xs text-[#78350F]">We’re counting down to celebration day.</p>
          </div>
          <div className="text-xs font-semibold text-[#38802E]">{countdownLabel}</div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          <div className="rounded-2xl bg-[#E2CDB5] p-3 text-center">
            <div className="text-2xl font-extrabold text-[#78350F]">{cdDays}</div>
            <div className="text-[11px] font-semibold text-[#78350F]">Days</div>
          </div>
          <div className="rounded-2xl bg-[#E2CDB5] p-3 text-center">
            <div className="text-2xl font-extrabold text-[#78350F]">{cdHours}</div>
            <div className="text-[11px] font-semibold text-[#78350F]">Hours</div>
          </div>
          <div className="rounded-2xl bg-[#E2CDB5] p-3 text-center">
            <div className="text-2xl font-extrabold text-[#78350F]">{cdMins}</div>
            <div className="text-[11px] font-semibold text-[#78350F]">Minutes</div>
          </div>
          <div className="rounded-2xl bg-[#E2CDB5] p-3 text-center">
            <div className="text-2xl font-extrabold text-[#78350F]">{cdSecs}</div>
            <div className="text-[11px] font-semibold text-[#78350F]">Seconds</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#78350F]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#A7824E] px-3 py-1 font-semibold text-white">
            🕒 Suggested arrival: <span className="font-bold">3:00 PM</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#A7824E] px-3 py-1 font-semibold text-white">
            📸 Photo time: <span className="font-bold">4:00 PM</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#A7824E] px-3 py-1 font-semibold text-white">
            🍰 Cake moment: <span className="font-bold">5:00 PM</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountDownContent;
