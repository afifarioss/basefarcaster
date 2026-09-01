"use client";

import { useEffect, useState } from "react";

const CAST_URL_RE =
  /(?:farcaster\.xyz|warpcast\.com)\/([a-zA-Z0-9_.-]+)\/0x[a-f0-9]+/i;

const BASENAME_RE =
  /^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.base\.eth$/i;

type ResolvedRecipient = {
  username: string;
  displayName: string;
  pfpUrl: string;
  address: `0x${string}`;
  fid?: number;
};

function normalizeInput(value: string): string {
  return value.trim().replace(/^@/, "");
}

export function UsernameInput({
  onResolve,
}: {
  onResolve: (user: ResolvedRecipient | null) => void;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "found" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resolved, setResolved] =
    useState<ResolvedRecipient | null>(null);

  useEffect(() => {
    const trimmed = input.trim();

    const castMatch = trimmed.match(CAST_URL_RE);
    const cleaned = castMatch
      ? castMatch[1]
      : normalizeInput(trimmed);

    if (!cleaned) {
      setStatus("idle");
      setResolved(null);
      setErrorMsg("");
      onResolve(null);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const timeout = setTimeout(async () => {
      try {
        /*
         * Basename resolution.
         *
         * Route:
         * /api/basename/resolve
         */
        if (BASENAME_RE.test(cleaned)) {
          const res = await fetch(
            `/api/basename/resolve?name=${encodeURIComponent(cleaned)}`
          );

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setErrorMsg(
              res.status === 404
                ? "That Basename could not be resolved."
                : data.error ||
                    "Something went wrong resolving that Basename."
            );
            setResolved(null);
            onResolve(null);
            return;
          }

          const basenameUser: ResolvedRecipient = {
            username: data.name,
            displayName: data.name,
            pfpUrl: "",
            address: data.address,
          };

          setStatus("found");
          setResolved(basenameUser);
          onResolve(basenameUser);
          return;
        }

        /*
         * Farcaster username / cast URL resolution.
         */
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
            setErrorMsg(
              data.error ||
                "Something went wrong looking that up."
            );
          }

          setResolved(null);
          onResolve(null);
          return;
        }

        const farcasterUser: ResolvedRecipient = {
          username: data.username,
          displayName: data.displayName,
          pfpUrl: data.pfpUrl,
          address: data.address,
          fid: data.fid,
        };

        setStatus("found");
        setResolved(farcasterUser);
        onResolve(farcasterUser);
      } catch {
        setStatus("error");
        setErrorMsg("Failed to look up that recipient.");
        setResolved(null);
        onResolve(null);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [input, onResolve]);

  const normalizedInput = normalizeInput(input);
  const isCurrentBasename = BASENAME_RE.test(normalizedInput);

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
          placeholder="@username, Basename, or cast link"
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
          {isCurrentBasename
            ? `Resolving ${normalizedInput}…`
            : `Looking up @${
                input.trim().match(CAST_URL_RE)?.[1] ??
                normalizedInput
              }…`}
        </p>
      )}

      {status === "found" && resolved && (
        <div className="mt-2 rounded-lg border border-base-blue/25 bg-base-blue/5 px-3 py-3">
          <div className="flex items-center gap-3">
            {resolved.pfpUrl ? (
              <img
                src={resolved.pfpUrl}
                width={40}
                height={40}
                className="rounded-full"
                alt=""
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-blue/15 text-sm font-bold text-base-blueLight">
                {(resolved.username ?? "B").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {resolved.displayName || `@${resolved.username}`}
              </p>
              <p className="truncate text-xs text-white/50">
                @{resolved.username} · {resolved.address.slice(0, 8)}…{resolved.address.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
