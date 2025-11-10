"use client";

import { Spinner } from "../spinner";

type Props = {
  text: string;
};

export function SubmittingOverlay({ text }: Props) {
  return (
    <div
      className="absolute inset-0 rounded-xl z-60 grid place-items-center bg-black/40 backdrop-blur-[2px] cursor-not-allowed"
      aria-hidden="false"
      role="status"
    >
      <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 shadow-lg ring-1 ring-border">
        <Spinner />
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}
