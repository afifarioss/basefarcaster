"use client";

import React, { useEffect, useState } from "react";

type Stats = {
  tipCount: number;
  totalVolumeUsdc: number;
  supporterCount: number;
  windowHours: number;
  error?: boolean;
};

function formatUsdc(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  if (value < 1) return value.toFixed(2);

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}
function StatBox({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-white/10 bg-black/20 px-3 py-3",
    },
    React.createElement(
      "div",
      { className: "text-xl font-bold text-white" },
      value
    ),
    React.createElement(
      "div",
      { className: "mt-1 text-[11px] text-white/45" },
      label
    )
  );
}
export function BetaStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const endpoint = "/" + "api" + "/" + "stats";
        const res = await fetch(endpoint);
        const data = (await res.json()) as Stats;

        if (!cancelled) {
          setStats(data);
        }
      } catch {
        if (!cancelled) {
          setStats({
            tipCount: 0,
            totalVolumeUsdc: 0,
            supporterCount: 0,
            windowHours: 3,
            error: true,
          });
        }
      }
    }
loadStats();

    const interval = window.setInterval(loadStats, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const tipCount = stats?.tipCount ?? 0;
  const totalVolumeUsdc = stats?.totalVolumeUsdc ?? 0;
  const supporterCount = stats?.supporterCount ?? 0;
  const windowHours = stats?.windowHours ?? 3;

  return React.createElement(
    "section",
    {
      className:
        "mx-auto mt-6 w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-center shadow-2xl backdrop-blur",
    },
    React.createElement(
      "div",
      {
className:
          "text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/80",
      },
      "Beta stats"
    ),
    React.createElement(
      "div",
      { className: "mt-3 grid grid-cols-3 gap-2" },
      React.createElement(StatBox, {
        value: tipCount,
        label: "tips sent",
      }),
      React.createElement(StatBox, {
        value: formatUsdc(totalVolumeUsdc),
        label: "USDC tipped",
      }),
      React.createElement(StatBox, {
        value: supporterCount,
        label: "supporters",
      })
    ),
    React.createElement(
      "p",
      { className: "mt-3 text-xs text-white/35" },
      "Real onchain activity from the last ~" + windowHours + " hours."
    )
  );
}
