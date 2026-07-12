import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import LandingCanvas from "@/components/LandingCanvas";
import { PixelSlider } from "@/components/PixelSlider";
import { PixelToggle } from "@/components/PixelToggle";
import { getReduceMotion, setReduceMotion as saveReduceMotion } from "@/lib/preferences";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Settings
});

function usePersistedState(key, initialValue, isBoolean = false) {
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return isBoolean ? stored === "1" : parseInt(stored, 10);
      }
    }
    return initialValue;
  });

  const setPersistedState = (value) => {
    setState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, isBoolean ? (value ? "1" : "0") : value);
      window.dispatchEvent(new CustomEvent(key, { detail: value }));
    }
  };

  return [state, setPersistedState];
}

function Settings() {
  const [reduceMotionGlobal, setReduceMotionGlobal] = useState(false);

  // Audio Settings
  const [masterVol, setMasterVol] = usePersistedState("tlw:master-volume", 100);
  const [musicVol, setMusicVol] = usePersistedState("tlw:music-volume", 100);
  const [sfxVol, setSfxVol] = usePersistedState("tlw:sfx-volume", 80);
  const [voiceVol, setVoiceVol] = usePersistedState("tlw:voice-volume", 100);
  const [footstepVol, setFootstepVol] = usePersistedState("tlw:footstep-volume", 50);
  
  // Gameplay Settings
  const [muteAmbient, setMuteAmbient] = usePersistedState("tlw:mute-ambient", false, true);
  
  // Accessibility Settings
  const [colorblind, setColorblind] = usePersistedState("tlw:colorblind-mode", false, true);
  const [subtitles, setSubtitles] = usePersistedState("tlw:subtitles", true, true);

  useEffect(() => {
    setReduceMotionGlobal(getReduceMotion());
  }, []);

  const handleReduceMotion = (val) => {
    saveReduceMotion(val);
    setReduceMotionGlobal(val);
  };

  return (
    <main className="min-h-[100dvh] bg-[color:var(--color-bg-base)] px-4 py-8 md:py-12 flex flex-col items-center relative overflow-x-hidden overflow-y-auto">
      <LandingCanvas reduceMotion={reduceMotionGlobal} focusRoom="library" />
      
      <div className="mx-auto max-w-2xl w-full z-10 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-['VT323'] text-xl text-[#9c9186] hover:text-[#e8e1d3] transition-colors duration-200 mb-6 group drop-shadow-md"
        >
          <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          &larr; RETURN
        </Link>

        {/* Case File Panel */}
        <div className="border-4 border-[#1a1113] bg-[#0a0809]/95 p-6 md:p-8 shadow-[15px_15px_0px_rgba(0,0,0,0.8)] relative">
          
          <div className="absolute top-0 left-8 px-4 py-0.5 bg-stone-800/80 border-b border-stone-950 font-['VT323'] text-sm text-stone-400 select-none tracking-widest">
            SETTINGS &middot; PREFERENCES
          </div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[color:var(--color-accent-blood)] to-transparent opacity-40 animate-pulse" />

          <h1 className="font-['VT323'] text-4xl md:text-5xl text-white drop-shadow-md mb-8 mt-2 border-b-2 border-[#1a1113] pb-2">
            Investigation Parameters
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="font-['VT323'] text-3xl text-[#8a2029] drop-shadow-sm mb-4">AUDIO</h2>
              <PixelSlider label="Master Volume" value={masterVol} onChange={setMasterVol} />
              <PixelSlider label="Music Volume" value={musicVol} onChange={setMusicVol} />
              <PixelSlider label="SFX Volume" value={sfxVol} onChange={setSfxVol} />
              <PixelSlider label="Voice / NPC Audio" value={voiceVol} onChange={setVoiceVol} />
              <PixelSlider label="Footstep Sounds" value={footstepVol} onChange={setFootstepVol} />
            </section>

            <section>
              <h2 className="font-['VT323'] text-3xl text-[#8a2029] drop-shadow-sm mb-4">GAMEPLAY</h2>
              <PixelToggle label="Mute Ambient Room Sounds" checked={muteAmbient} onChange={setMuteAmbient} />
              <PixelToggle 
                label="Reduce Motion / Screen-shake" 
                description="Disables jump-scares and heavy camera shakes"
                checked={reduceMotionGlobal} 
                onChange={handleReduceMotion} 
              />
            </section>

            <section>
              <h2 className="font-['VT323'] text-3xl text-[#8a2029] drop-shadow-sm mb-4">ACCESSIBILITY</h2>
              <PixelToggle 
                label="Colorblind-Friendly Indicators" 
                description="Uses shapes instead of purely color for suspicion/vote UI"
                checked={colorblind} 
                onChange={setColorblind} 
              />
              <PixelToggle 
                label="Enable Subtitles" 
                description="Show text for all voice and NPC audio lines"
                checked={subtitles} 
                onChange={setSubtitles} 
              />
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
