import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FOCUS-ONE-TOPIC-DURATION-FRAMES = 210;

const SCATTERED = ["Game Dev", "Web Design", "AI Tools", "Music", "Cooking"];

export const Scene197-FocusOneTopic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const scatterSprings = SCATTERED.map((_, i) =>
    spring({ frame: Math.max(0, frame - 30 - i * 10), fps, config: { damping: 10, stiffness: 80 } })
  );
  const xSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 8, stiffness: 120 } });
  const vsSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 10, stiffness: 80 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 12, stiffness: 90 } });
  const checkSpring = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 10, stiffness: 100 } });

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 60, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        深耕<span style={{ color: "#10B981" }}>一個主題</span>，不要今天這個明天那個
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 26, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Go deep on one topic — don't scatter your focus
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Left: scattered */}
        <div style={{ opacity: leftSpring, position: "relative" }}>
          <div style={{ width: 380, height: 280, background: "rgba(239,68,68,0.05)", border: "2px solid rgba(239,68,68,0.25)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 20 }}>
            {SCATTERED.map((topic, i) => (
              <div key={i} style={{ opacity: scatterSprings[i], fontSize: 20, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 20px" }}>
                {topic}
              </div>
            ))}
          </div>
          {xSpring > 0.1 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: xSpring * 0.5 }}>
              <svg width={380} height={280}>
                <line x1={20} y1={20} x2={360} y2={260} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
                <line x1={360} y1={20} x2={20} y2={260} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* VS */}
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})`, fontSize: 36, color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>VS</div>

        {/* Right: focused */}
        <div style={{ opacity: rightSpring, transform: `scale(${rightSpring})` }}>
          <div style={{ width: 380, height: 280, background: "rgba(16,185,129,0.06)", border: "2px solid rgba(16,185,129,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontSize: 72 }}>🎯</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#10B981" }}>AI 開發</div>
            <div style={{ fontSize: 20, color: "rgba(16,185,129,0.6)", fontStyle: "italic" }}>One focused topic</div>
            {checkSpring > 0.1 && (
              <div style={{ opacity: checkSpring, fontSize: 22, fontWeight: 700, color: "#10B981" }}>✓ 建立專業聲譽</div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};