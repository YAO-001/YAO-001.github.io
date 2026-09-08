"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { View } from "./persona";
import { usePreferences } from "./preferences";

const asset = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/persona/optimized/${file}`;
type Connection = { saveData?: boolean; effectiveType?: string };

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function Background({ scene }: { scene: View }) {
  const { paused } = usePreferences();
  const intro = useRef<HTMLVideoElement>(null);
  const loop = useRef<HTMLVideoElement>(null);
  const [mediaAllowed, setMediaAllowed] = useState(false);
  const pageHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [loopRequested, setLoopRequested] = useState(false);
  const [loopVisible, setLoopVisible] = useState(false);
  const isMenu = scene === "home" || scene === "sideproj";
  const file = scene === "about" ? "main1.mp4" : scene === "resume" ? "main2.mp4" : "main3.mp4";
  const poster = isMenu ? "menu-poster.webp" : `${scene}-poster.webp`;

  useEffect(() => {
    if (paused || pageHidden || mediaAllowed) return;
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "")) return;

    // A source-less first render lets the poster, fonts and menu win the network.
    // The second animation frame guarantees an opportunity to paint first.
    let frame = 0;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const allowMedia = () => {
      if (!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMediaAllowed(true);
      }
    };
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(allowMedia, { timeout: 1200 });
        else timer = setTimeout(allowMedia, 150);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, [paused, pageHidden, mediaAllowed]);

  useEffect(() => {
    const videos = [intro.current, loop.current];
    for (const [index, video] of videos.entries()) {
      if (!video) continue;
      const shouldPlay = !paused && !pageHidden && (index === 0 ? !introFinished : introFinished);
      if (shouldPlay) {
        // Autoplay can be denied. The already-visible poster remains usable.
        void video.play().catch(() => {});
      } else video.pause();
    }
  }, [paused, pageHidden, mediaAllowed, introFinished, loopRequested]);

  return <div className="scene-background" aria-hidden="true">
    <Image className="scene-poster" src={asset(poster)} alt="" fill sizes="100vw" preload />
    {mediaAllowed && <video ref={intro} src={asset(isMenu ? "Mainn.mp4" : file)}
      preload="none" muted playsInline loop={!isMenu} disablePictureInPicture
      onPlaying={() => setIntroVisible(true)}
      onTimeUpdate={(event) => {
        const video = event.currentTarget;
        if (isMenu && !paused && video.duration - video.currentTime <= 1.5) setLoopRequested(true);
      }}
      onEnded={isMenu ? () => { setLoopRequested(true); setIntroFinished(true); } : undefined}
      onError={() => setIntroVisible(false)}
      style={{ opacity: introVisible && !loopVisible ? 1 : 0, zIndex: 1 }} />}
    {mediaAllowed && loopRequested && <video ref={loop} src={asset("Mainn_1.mp4")}
      preload="auto" loop muted playsInline disablePictureInPicture
      onPlaying={() => setLoopVisible(true)} onError={() => setLoopVisible(false)}
      style={{ opacity: loopVisible ? 1 : 0, zIndex: 2 }} />}
  </div>;
}
