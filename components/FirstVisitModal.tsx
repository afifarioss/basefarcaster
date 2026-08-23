"use client";
import { useState, useEffect } from "react";

export function FirstVisitModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("basezap_intro_seen");
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("basezap_intro_seen", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-white mb-2">
          New to BaseZap?
        </h2>
        <p className="text-sm text-zinc-400 mb-5">
          Send real USDC tips on Base in seconds. See how it works before you dive in.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://base-zap.mintlify.site/introduction"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="bg-white text-black rounded-lg py-2 text-sm font-medium"
          >
            How it works
          </a>
          <button
            onClick={dismiss}
            className="text-zinc-500 text-sm py-2"
          >
            Skip, take me to the app
          </button>
        </div>
      </div>
    </div>
  );
}
