import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const EASY-CHANNEL-HARD-DIST-DURATION-FRAMES = 180;

const CHANNELS = [
  { label: "網路陌生人", en: "Strangers", y: 0 },
  { label: "社群媒體", en: "Social Media", y: 70 },
  { label: "論壇 / 社團", en: "Forums", y: 140 },
];

export const Scene176-EasyChannelHardDist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const ch1 = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 90 } });
  const ch2 = spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 12, stiffness: 90 } });
  const ch3 = spring({ frame: Math.max(0, frame - 54), fps, config: { damping: 12, stiffness: 90 } });
  const chSprings = [ch1, ch2, ch3];
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
        找題目的<span style={{ color: "#10B981" }}>管道多</span>，但 <span style={{ color: "#EF4444" }}>Distribution 很挑戰</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 48 }}>
        Easy to find topics, hard to distribute
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
        {/* Left: easy channels */}
        <div style={{ opacity: leftSpring, transform: `scale(${leftSpring})` }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#10B981", marginBottom: 24, textAlign: "center" }}>容易找題目 ✓</div>
          {CHANNELS.map((ch, i) => (
            <div key={i} style={{ opacity: chSprings[i], transform: `translateX(${(1 - chSprings[i]) * -20}px)`, background: "rgba(16,185,129,0.06)", border: "1.5px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "14px 32px", marginBottom: 12, fontSize: 26, color: "rgba(255,255,255,0.7)" }}>
              {ch.label}
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)", marginLeft: 12, fontFamily: "'Inter', sans-serif" }}>{ch.en}</span>
            </div>
          ))}
        </div>

        {/* VS */}
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})`, fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>→</div>

        {/* Right: distribution hard */}
        <div style={{ opacity: rightSpring, transform: `scale(${rightSpring})` }}>
          <div style={{ width: 360, height: 240, background: "rgba(239,68,68,0.06)", border: "2px solid rgba(239,68,68,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#EF4444" }}>Distribution</div>
            <div style={{ fontSize: 32, color: "rgba(239,68,68,0.7)" }}>很有挑戰 ⚠️</div>
            <div style={{ fontSize: 20, color: "rgba(239,68,68,0.4)", fontFamily: "'Inter', sans-serif" }}>The real challenge</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};