import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

// You can replace these with actual local paths once you have your final .mp3 files
const TRACK_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Landing & Create Room
const TRACK_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"; // Lobby

export function AudioManager() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let targetTrack = null;
    
    // Determine which track should play based on the route
    if (pathname === "/" || pathname === "/create-room" || pathname === "/join-room") {
      targetTrack = TRACK_1;
    } else if (pathname.startsWith("/lobby")) {
      targetTrack = TRACK_2;
    } else {
      // In investigation or other scenes, we might want no global track or a different one
      targetTrack = null;
    }

    if (currentTrack !== targetTrack) {
      setCurrentTrack(targetTrack);
      
      if (audioRef.current) {
        if (targetTrack) {
          audioRef.current.src = targetTrack;
          // Play might fail if the user hasn't interacted with the page yet due to browser autoplay policies
          audioRef.current.play().catch(err => {
            console.log("Audio autoplay prevented by browser. User interaction needed:", err);
          });
        } else {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
      }
    }
  }, [pathname, currentTrack]);

  return (
    <audio 
      ref={audioRef}
      loop 
      style={{ display: "none" }} 
      autoPlay 
    />
  );
}
