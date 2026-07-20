import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const THREE-DIMENSIONS-DURATION-FRAMES = 150;

const DIMENSIONS = [
  { label: "Skill", sub: "技能", desc: "Superpowers、OWASP 等", icon: "🧠", color: "#4DA3FF", delay: 20 },
  { label: "工具", sub: "Tools", desc: "Cloudflare、Gemini 等", icon: "🔧", color: "#F59E0B", delay: 45 },
  { label: "流程", sub: "Process", desc: "Spec → Dev → Deploy", icon: "⚙️", color: "#10B981", delay: 70 },
];

export const Scene204-ThreeDimensions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const dimSprings = DIMENSIONS.map((d) =>
    spring({ frame: Math.max(0, frame - d.delay), fps, config: { damping: 12, stiffness: 90 } })
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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        分成三個面向來拆解
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Three dimensions: Skill, Tools, Process
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {DIMENSIONS.map((dim, i) => (
          <div
            key={i}
            style={{
              opacity: dimSprings[i],
              transform: `scale(${dimSprings[i]}) translateY(${(1 - dimSprings[i]) * 30}px)`,
              width: 320,
              height: 320,
              borderRadius: 24,
              background: `${dim.color}10`,
              border: `2px solid ${dim.color}40`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 64 }}>{dim.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: dim.color }}>{dim.label}</div>
            <div style={{ fontSize: 20, color: `${dim.color}60`, fontFamily: "'Inter', sans-serif" }}>{dim.sub}</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 16px" }}>{dim.desc}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};