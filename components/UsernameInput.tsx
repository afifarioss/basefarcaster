"use client";

import { useEffect, useState } from "react";

const CAST_URL_RE = /(?:farcaster\.xyz|warpcast\.com)\/([a-zA-Z0-9_.-]+)\/0x[a-f0-9]+/i;

type ResolvedUser = {
  username: string;
  displayName: string;
  pfpUrl: string;
  address: `0x${string}`;
  fid: number;
};

export function UsernameInput({
  onResolve,
}: {
  onResolve: (user: ResolvedUser | null) => void;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [resolved, setResolved] = useState<ResolvedUser | null>(null);

  useEffect(() => {
    const castMatch = input.trim().match(CAST_URL_RE);
    const cleaned = castMatch
      ? castMatch[1]
      : input.trim().replace(/^@/, "");

    if (!cleaned) {
      setStatus("idle");
      setResolved(null);
      onResolve(null);
      return;
    }

    setStatus("loading");
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/resolve-user?username=${encodeURIComponent(cleaned)}`
        );
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          if (res.status === 404) {
            setErrorMsg(
              "Couldn't find that user — check the exact spelling, or paste their profile link."
            );
          } else if (res.status === 422) {
            setErrorMsg(
              "This user hasn't connected a wallet to Farcaster yet."
            );
          } else {
            setErrorMsg(data.error || "Something went wrong looking that up.");
          }
          setResolved(null);
          onResolve(null);
          return;
        }

        setStatus("found");
        setResolved(data);
        onResolve(data);
      } catch {
        setStatus("error");
        setErrorMsg("Failed to look up user");
        setResolved(null);
        onResolve(null);
      }
    }, 500); // debounce so we don't hit the API on every keystroke

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div className="w-full">
      <div className="relative">
        {!input.trim().match(CAST_URL_RE) && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            @
          </span>
        )}
        <input
          type="text"
          inputMode="text"
          placeholder="@username or cast link"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-base-blue/50"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {status === "loading" && (
        <p className="mt-2 text-xs text-white/40">
          Looking up @{input.trim().match(CAST_URL_RE)?.[1] ?? input}…
        </p>
      )}

      {status === "found" && resolved && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-base-blue/25 bg-base-blue/5 px-3 py-2">
          <img
            src={resolved.pfpUrl}
            width={28}
            height={28}
            className="rounded-full"
            alt=""
          />
          <span className="text-sm text-white/85">
            {resolved.displayName || `@${resolved.username}`}
          </span>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
