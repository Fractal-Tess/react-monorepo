"use client";

import { LineWaves } from "./LineWaves.client";

export function LoginArtPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[#060606] lg:flex lg:items-end">
      <div className="absolute inset-0">
        <LineWaves
          brightness={0.15}
          enableMouseInteraction={false}
          warpIntensity={0.1}
        />
      </div>
      <div className="relative z-10 max-w-lg p-12">
        <h2 className="font-heading text-4xl text-white/90 leading-tight">
          Secure by default.
        </h2>
        <p className="mt-4 text-sm text-white/40 leading-relaxed">
          Better Auth handles tokens and sessions while Convex manages your data
          layer. One auth system across frontend and backend.
        </p>
      </div>
    </section>
  );
}
