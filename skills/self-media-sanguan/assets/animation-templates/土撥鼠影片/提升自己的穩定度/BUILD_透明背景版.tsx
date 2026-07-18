import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const BUILD-STABILITY-DURATION-FRAMES = 180;

export const Scene193-BuildStability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const shakeAmt = frame < 60 ? Math.sin(frame * 0.8) * interpolate(frame, [0, 60], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const stabilizeSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 16, stiffness: 90 } });
  const checkSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 10, stiffness: 100 } });

  const LAYERS = [
    { label: "技術能力", width: 340, color: "#4DA3FF" },
    { label: "持續輸出", width: 280, color: "#A78BFA" },
    { label: "內容品質", width: 220, color: "#10B981" },
    { label: "準時交付", width: 160, color: "#F59E0B" },
  ];

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        2. 提升自己的<span style={{ color: "#10B981" }}>穩定度</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Build your personal stability
      </div>

      {/* Stability pyramid */}
      <div style={{ transform: `rotate(${shakeAmt}deg)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {[...LAYERS].reverse().map((layer, i) => (
          <div
            key={i}
            style={{
              opacity: stabilizeSpring,
              transform: `scale(${0.8 + stabilizeSpring * 0.2})`,
              width: layer.width,
              height: 52,
              background: `${layer.color}15`,
              border: `2px solid ${layer.color}50`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
              color: layer.color,
            }}
          >
            {layer.label}
          </div>
        ))}
      </div>

      {checkSpring > 0.1 && (
        <div style={{ opacity: checkSpring, transform: `scale(${checkSpring})`, marginTop: 40, fontSize: 36, fontWeight: 700, color: "#10B981" }}>
          ✓ 穩定可信賴
        </div>
      )}
    </AbsoluteFill>
  );
};