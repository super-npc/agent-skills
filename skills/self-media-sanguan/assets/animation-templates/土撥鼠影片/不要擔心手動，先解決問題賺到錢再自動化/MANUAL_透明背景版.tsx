import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const MANUAL-FIRST-DURATION-FRAMES = 360;

const PHASES = [
  { label: "手動處理", en: "Manual Work", sub: "先解決問題", color: "#4DA3FF", icon: "✋" },
  { label: "賺到錢", en: "First Revenue", sub: "驗證市場", color: "#F59E0B", icon: "💰" },
  { label: "自動化", en: "Automate", sub: "擴大規模", color: "#10B981", icon: "⚙️" },
];

export const Scene170-ManualFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [340, 360], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });

  const phase1Spring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 90 } });
  const arrow1Spring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 10, stiffness: 100 } });
  const phase2Spring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 12, stiffness: 90 } });
  const arrow2Spring = spring({ frame: Math.max(0, frame - 200), fps, config: { damping: 10, stiffness: 100 } });
  const phase3Spring = spring({ frame: Math.max(0, frame - 220), fps, config: { damping: 12, stiffness: 90 } });

  const phaseSprings = [phase1Spring, phase2Spring, phase3Spring];
  const arrowSprings = [arrow1Spring, arrow2Spring];

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
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          fontSize: 63,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        不要擔心<span style={{ color: "#EF4444" }}>手動</span>，先解決問題賺到錢，再<span style={{ color: "#10B981" }}>自動化</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Don't fear manual work — earn first, then automate
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {PHASES.map((phase, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                opacity: phaseSprings[i],
                transform: `scale(${phaseSprings[i]})`,
                width: 320,
                height: 280,
                borderRadius: 24,
                background: `${phase.color}10`,
                border: `2px solid ${phase.color}50`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 72 }}>{phase.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: phase.color }}>{phase.label}</div>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{phase.sub}</div>
              <div style={{ fontSize: 18, color: `${phase.color}60`, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>{phase.en}</div>
            </div>
            {i < PHASES.length - 1 && (
              <div style={{ opacity: arrowSprings[i], transform: `scale(${arrowSprings[i]})`, margin: "0 20px" }}>
                <svg width={60} height={60} viewBox="0 0 60 60">
                  <line x1={5} y1={30} x2={42} y2={30} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeLinecap="round" />
                  <polygon points="42,22 55,30 42,38" fill="rgba(255,255,255,0.3)" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};