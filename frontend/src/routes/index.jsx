import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import LandingCanvas from "@/components/LandingCanvas";
import { getReduceMotion, subscribeReduceMotion } from "@/lib/preferences";
import { useTransition } from "@/lib/transitions";

export const Route = createFileRoute("/")({
  component: Home
});

// Two empty wall patches (percent of viewport). Tuned to the reference image:
// - CREATE ROOM: lit patch between the handprint and the seated figure (upper-center-right)
// - JOIN ROOM: darker patch to the left of the blood stain
const HOTSPOTS = {
  create: { xPct: 50, yPct: 62, w: 280, h: 64, to: "/create-room" },
  join: { xPct: 50, yPct: 74, w: 280, h: 64, to: "/join-room" }
};

function Home() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(getReduceMotion());
    return subscribeReduceMotion(setReduceMotion);
  }, []);

  return (
    <main className="min-h-screen bg-[color:var(--color-bg-base)] text-[color:var(--color-text-primary)] flex flex-col relative">
      <LandingCanvas reduceMotion={reduceMotion} />
      
      {/* Persistent Top Bar */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-[#0a0809]/90 border-b-4 border-[#1a1113] z-30 flex items-center justify-between px-6 md:px-10 shadow-[0px_4px_0px_rgba(0,0,0,0.5)]">
        <span className="font-['VT323'] text-xl tracking-widest text-[#9c9186]">CASE FILE &middot; PROLOGUE</span>
        <div className="flex gap-4">
          {/* Optional top-right space for future additions */}
        </div>
      </header>

      <section className="relative flex-1 w-full overflow-hidden select-none flex flex-col items-center justify-center pointer-events-none z-10" style={{ minHeight: 640 }}>
        <div className="flex flex-col items-center mt-[-5vh]">
          
          <h1 className="font-['VT323'] text-7xl md:text-8xl lg:text-9xl tracking-wide text-[#e8e1d3] drop-shadow-2xl text-center leading-none" style={{ textShadow: '0px 4px 0px #0a0503' }}>
            The Last<br />Witness
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl font-['VT323'] text-[#9c9186] max-w-md text-center" style={{ textShadow: '0px 2px 0px #0a0503' }}>
            Four remain. One is guilty. The truth lies buried in the dark.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 pointer-events-auto">
            <Link
              to="/create-room"
              className="group relative px-8 py-4 bg-[#8a2029] hover:bg-[#a62631] transition-colors"
              style={{ boxShadow: 'inset -4px -4px 0px rgba(0,0,0,0.5), inset 4px 4px 0px rgba(255,255,255,0.2)' }}
            >
              <div className="absolute inset-0 border-4 border-[#1a1113]" />
              <span className="font-['VT323'] text-2xl md:text-3xl tracking-widest text-[#e8e1d3] group-hover:text-white transition-colors" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>CREATE ROOM</span>
            </Link>

            <Link
              to="/join-room"
              className="group relative px-8 py-4 bg-[#4a4541] hover:bg-[#655d56] transition-colors"
              style={{ boxShadow: 'inset -4px -4px 0px rgba(0,0,0,0.5), inset 4px 4px 0px rgba(255,255,255,0.2)' }}
            >
              <div className="absolute inset-0 border-4 border-[#1a1113]" />
              <span className="font-['VT323'] text-2xl md:text-3xl tracking-widest text-[#e8e1d3] group-hover:text-white transition-colors" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>JOIN ROOM</span>
            </Link>
          </div>

          <div className="mt-8 flex gap-6 pointer-events-auto">
            <Link
              to="/profile"
              className="font-['VT323'] text-xl tracking-widest text-[#9c9186] hover:text-white transition-colors flex items-center gap-2"
            >
              PROFILE
            </Link>
            <Link
              to="/settings"
              className="font-['VT323'] text-xl tracking-widest text-[#9c9186] hover:text-white transition-colors flex items-center gap-2"
            >
              SETTINGS
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );

}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-base)] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="tracked-caps text-[10px] text-[color:var(--color-text-tertiary)] opacity-70">
          The Last Witness — Filed under confidential
        </span>
        <span className="tracked-caps text-[10px] text-[color:var(--color-text-tertiary)] opacity-70">
          MMXXVI
        </span>
      </div>
    </footer>);

}