import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene153-SolveFirstPoint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const numSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 10, stiffness: 110 } });
  const titleSpring = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 14, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", alignItems: "center", justifyContent: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 42 }}>
          <div style={{ opacity: numSpring, transform: `scale(${numSpring})`, width: 150, height: 150, borderRadius: "50%", background: "linear-gradient(135deg, #4DA3FF, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 84, fontWeight: 900, color: "#FFFFFF", flexShrink: 0, boxShadow: "0 0 40px rgba(77,163,255,0.3)" }}>
            1
          </div>
          <div style={{ opacity: titleSpring, transform: `translateX(${(1 - titleSpring) * 30}px)`, fontSize: 96, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3, whiteSpace: "nowrap" }}>
            我們先解決<span style={{ color: "#4DA3FF" }}>第一點</span>
          </div>
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 39, color: "rgba(255,255,255,0.4)", marginTop: 21, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          Let's solve the first issue first
        </div>
        <div style={{ width: 500 * lineSpring, height: 3, background: "linear-gradient(90deg, #4DA3FF, #60A5FA)", borderRadius: 2, marginTop: 30, opacity: 0.5 }} />
      </div>
    </AbsoluteFill>
  );
};