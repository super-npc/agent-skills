import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const START-SMALL-DURATION-FRAMES = 210;

const SMALL-STARTS = [
  { label: "趨勢報告", en: "Trend Report", icon: "📊", color: "#4DA3FF", delay: 110 },
  { label: "小工具", en: "Small Tool", icon: "🔧", color: "#10B981", delay: 135 },
  { label: "週報訂閱", en: "Newsletter", icon: "📧", color: "#F59E0B", delay: 160 },
];

export const Scene198-StartSmall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const xSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 8, stiffness: 120 } });
  const vsSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 10, stiffness: 80 } });
  const smallSprings = SMALL-STARTS.map((s) =>
    spring({ frame: Math.max(0, frame - s.delay), fps, config: { damping: 12, stiffness: 90 } })
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        不要一口氣做<span style={{ color: "#EF4444" }}>平台</span>，先從<span style={{ color: "#10B981" }}>小東西</span>開始
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Don't build a platform — start with something small
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Left: big platform */}
        <div style={{ opacity: leftSpring, position: "relative" }}>
          <div style={{ width: 320, height: 260, background: "rgba(239,68,68,0.05)", border: "2px solid rgba(239,68,68,0.25)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 64 }}>🏗️</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "rgba(239,68,68,0.7)" }}>大型平台</div>
            <div style={{ fontSize: 18, color: "rgba(239,68,68,0.4)" }}>從 0 開始做</div>
          </div>
          {xSpring > 0.1 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: xSpring * 0.5 }}>
              <svg width={320} height={260}>
                <line x1={20} y1={20} x2={300} y2={240} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
                <line x1={300} y1={20} x2={20} y2={240} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* VS */}
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})`, fontSize: 36, color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>VS</div>

        {/* Right: small starts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SMALL-STARTS.map((s, i) => (
            <div key={i} style={{ opacity: smallSprings[i], transform: `translateX(${(1 - smallSprings[i]) * 30}px)`, display: "flex", alignItems: "center", gap: 16, background: `${s.color}10`, border: `2px solid ${s.color}35`, borderRadius: 12, padding: "16px 28px" }}>
              <div style={{ fontSize: 32 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: 16, color: `${s.color}50`, fontFamily: "'Inter', sans-serif" }}>{s.en}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};