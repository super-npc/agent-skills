import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SIMPLE-AI-PRODUCT-203-DURATION-FRAMES = 120;

export const Scene203-SimpleAIProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const cardSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const badgeSpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 10, stiffness: 100 } });

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
        針對這樣一個<span style={{ color: "#4DA3FF" }}>簡單的 AI 產品</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        For a simple AI product like this
      </div>

      <div style={{ opacity: cardSpring, transform: `scale(${cardSpring})`, position: "relative" }}>
        <div style={{ width: 400, height: 280, background: "rgba(77,163,255,0.08)", border: "2px solid rgba(77,163,255,0.35)", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ fontSize: 72 }}>💡</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#4DA3FF" }}>IdeaCheck</div>
          <div style={{ fontSize: 20, color: "rgba(77,163,255,0.5)" }}>AI 創業想法分析工具</div>
        </div>
        <div style={{ position: "absolute", top: -20, right: -20, opacity: badgeSpring, transform: `scale(${badgeSpring})`, background: "#10B981", borderRadius: 16, padding: "8px 20px", fontSize: 20, fontWeight: 700, color: "#FFFFFF" }}>
          簡單 ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};