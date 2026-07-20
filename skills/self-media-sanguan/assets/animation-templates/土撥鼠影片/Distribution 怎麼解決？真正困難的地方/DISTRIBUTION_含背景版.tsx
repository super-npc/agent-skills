import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const DISTRIBUTION-HARD-DURATION-FRAMES = 210;

export const Scene172-DistributionHard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const card1Spring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 90 } });
  const hardSpring = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 10, stiffness: 120 } });
  const linkSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 12, stiffness: 80 } });

  const glowPulse = frame > 80 ? 0.2 + Math.sin(frame * 0.08) * 0.15 : 0;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        <span style={{ color: "#4DA3FF" }}>Distribution</span> 怎麼解決？
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 33, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        How do we solve the distribution problem?
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48, flexDirection: "column" }}>
        {/* Main question card */}
        <div style={{ opacity: card1Spring, transform: `scale(${card1Spring})`, background: "rgba(77,163,255,0.06)", border: "2px solid rgba(77,163,255,0.3)", borderRadius: 20, padding: "32px 64px", textAlign: "center" }}>
          <div style={{ fontSize: 42, fontWeight: 700, color: "#4DA3FF" }}>痛點在哪裡？</div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", marginTop: 8, fontFamily: "'Inter', sans-serif" }}>Where does the pain come from?</div>
        </div>

        {/* Hard badge */}
        <div
          style={{
            opacity: hardSpring,
            transform: `scale(${hardSpring})`,
            background: "rgba(239,68,68,0.08)",
            border: "2px solid rgba(239,68,68,0.4)",
            borderRadius: 20,
            padding: "28px 72px",
            textAlign: "center",
            boxShadow: `0 0 ${glowPulse * 60}px rgba(239,68,68,${glowPulse})`,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: "#EF4444" }}>真正困難的地方</div>
          <div style={{ fontSize: 24, color: "rgba(239,68,68,0.5)", marginTop: 8, fontFamily: "'Inter', sans-serif" }}>The truly hard part</div>
        </div>

        {/* Link to pain source */}
        <div style={{ opacity: linkSpring, transform: `translateY(${(1 - linkSpring) * 20}px)`, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.6)" }}>跟痛點來源一起看</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};