import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TECH-BOOSTS-STABILITY-DURATION-FRAMES = 150;

const TECH-SKILLS = [
  { label: "測試覆蓋率", en: "Test Coverage", delay: 25, color: "#4DA3FF" },
  { label: "錯誤處理", en: "Error Handling", delay: 40, color: "#A78BFA" },
  { label: "效能優化", en: "Performance", delay: 55, color: "#10B981" },
];

export const Scene196-TechBoostsStability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const techSprings = TECH-SKILLS.map((s) =>
    spring({ frame: Math.max(0, frame - s.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const arrowSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 10, stiffness: 80 } });
  const stabSpring = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 12, stiffness: 90 } });
  const barRise = interpolate(frame, [95, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        產品穩定度可以透過提升<span style={{ color: "#4DA3FF" }}>技術力</span>增加
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Better tech skills → more stable product
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Tech skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TECH-SKILLS.map((skill, i) => (
            <div key={i} style={{ opacity: techSprings[i], transform: `translateX(${(1 - techSprings[i]) * -20}px)`, display: "flex", alignItems: "center", gap: 16, background: `${skill.color}10`, border: `2px solid ${skill.color}30`, borderRadius: 12, padding: "14px 28px" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: skill.color }} />
              <div style={{ fontSize: 24, fontWeight: 600, color: skill.color }}>{skill.label}</div>
              <div style={{ fontSize: 16, color: `${skill.color}50`, fontFamily: "'Inter', sans-serif" }}>{skill.en}</div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowSpring }}>
          <svg width={80} height={60} viewBox="0 0 80 60">
            <line x1={5} y1={30} x2={58} y2={30} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="58,22 72,30 58,38" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>

        {/* Stability rising bar */}
        <div style={{ opacity: stabSpring }}>
          <div style={{ width: 180, height: 200, background: "rgba(16,185,129,0.05)", border: "2px solid rgba(16,185,129,0.2)", borderRadius: 12, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${barRise * 100}%`, background: "linear-gradient(0deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 100%)", borderTop: "2px solid #10B981" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#10B981" }}>{Math.round(barRise * 95)}%</div>
              <div style={{ fontSize: 16, color: "rgba(16,185,129,0.6)" }}>穩定度</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};