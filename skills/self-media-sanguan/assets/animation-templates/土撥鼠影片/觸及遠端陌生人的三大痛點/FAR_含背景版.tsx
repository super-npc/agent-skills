import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FAR-STRANGER-PAINS-DURATION-FRAMES = 210;

const PAINS = [
  {
    label: "觸及成本高",
    en: "High Reach Cost",
    desc: "不認識你，要靠 SEO、內容、廣告",
    descEn: "SEO, content, ads needed",
    icon: "💸",
    color: "#EF4444",
    delay: 25,
  },
  {
    label: "競爭激烈",
    en: "Fierce Competition",
    desc: "公開訊號人人看得到",
    descEn: "Public signals visible to everyone",
    icon: "⚔️",
    color: "#F59E0B",
    delay: 70,
  },
  {
    label: "不在圈內",
    en: "Outside the Circle",
    desc: "不懂他們的真正語言和情境",
    descEn: "Don't understand their context",
    icon: "🚫",
    color: "#A78BFA",
    delay: 115,
  },
];

export const Scene177-FarStrangerPains: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const painSprings = PAINS.map((p) =>
    spring({ frame: Math.max(0, frame - p.delay), fps, config: { damping: 12, stiffness: 90 } })
  );

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 69, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        觸及<span style={{ color: "#EF4444" }}>遠端陌生人</span>的三大挑戰
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Three challenges of reaching far strangers
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {PAINS.map((pain, i) => (
          <div
            key={i}
            style={{
              opacity: painSprings[i],
              transform: `scale(${painSprings[i]}) translateY(${(1 - painSprings[i]) * 30}px)`,
              width: 400,
              background: `${pain.color}08`,
              border: `2px solid ${pain.color}40`,
              borderRadius: 20,
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 60 }}>{pain.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: pain.color, textAlign: "center" }}>{pain.label}</div>
            <div style={{ fontSize: 18, color: `${pain.color}60`, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>{pain.en}</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.5 }}>{pain.desc}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};