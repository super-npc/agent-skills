import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FIRST-DEAL-HARD-DURATION-FRAMES = 180;

export const Scene183-FirstDealHard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 90 } });
  const vsSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 10, stiffness: 80 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12, stiffness: 90 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 60, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        要促成<span style={{ color: "#EF4444" }}>第一筆合作</span>並不容易
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        The first deal is always the hardest
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        {/* Left: Empty portfolio */}
        <div style={{ opacity: leftSpring, transform: `scale(${leftSpring})` }}>
          <div style={{ width: 380, height: 280, background: "rgba(239,68,68,0.06)", border: "2px solid rgba(239,68,68,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontSize: 72, opacity: 0.4 }}>📁</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "rgba(239,68,68,0.7)" }}>空白作品集</div>
            <div style={{ fontSize: 20, color: "rgba(239,68,68,0.4)" }}>沒有成功案例</div>
            <div style={{ fontSize: 18, color: "rgba(239,68,68,0.3)", fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>No track record</div>
          </div>
        </div>

        {/* VS arrow */}
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})` }}>
          <svg width={60} height={60} viewBox="0 0 60 60">
            <line x1={5} y1={30} x2={45} y2={30} stroke="rgba(255,255,255,0.2)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="45,22 55,30 45,38" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>

        {/* Right: Trust needed */}
        <div style={{ opacity: rightSpring, transform: `scale(${rightSpring})` }}>
          <div style={{ width: 380, height: 280, background: "rgba(77,163,255,0.06)", border: "2px solid rgba(77,163,255,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontSize: 72 }}>🤝</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#4DA3FF" }}>需要建立信任感</div>
            <div style={{ fontSize: 20, color: "rgba(77,163,255,0.6)" }}>Trust building required</div>
            <div style={{ fontSize: 18, color: "rgba(77,163,255,0.4)" }}>KOL 合作的第一關</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};