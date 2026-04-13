"use client";

import LineWaves from "@/components/LineWaves";

export function LoginArtPanel() {
  return (
    <section className="relative hidden min-h-svh overflow-hidden bg-[#060606] lg:block">
      <div className="absolute inset-0">
        <LineWaves
          brightness={0.55}
          color1="#89e6ff"
          color2="#d2fff7"
          color3="#ffffff"
          enableMouseInteraction={false}
          innerLineCount={28}
          outerLineCount={24}
          warpIntensity={0.16}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,24,39,0.1),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.24))]" />
    </section>
  );
}
