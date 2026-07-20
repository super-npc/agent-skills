import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const colors = {
  background: "#0A0E14",
  backgroundGradient: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  danger: "#FF6B6B",
  dimmed: "rgba(255, 255, 255, 0.6)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const TOOLS = [
  { num: 1, name: "Banana 2", desc: "圖片生成", color: "#00D4AA", delay: 30 },
  { num: 2, name: "Grok", desc: "圖生影片", color: "#FFB547", delay: 75 },
  { num: 3, name: "Suno", desc: "生成音樂", color: "#2ECC71", delay: 120 },
  { num: 4, name: "Blender", desc: "影片去背", color: "#9B59B6", delay: 165 },
];

export const Scene35-FourToolsReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [240, 270], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 60, maxWidth: 1350 }}>
          {TOOLS.map((tool) => {
            const tSpring = spring({ frame: Math.max(0, frame - tool.delay), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
            const tScale = interpolate(tSpring, [0, 1], [0.3, 1]);
            const tOp = interpolate(tSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const hover = Math.sin(frame * 0.04 + tool.num * 1.5) * 3;

            return (
              <div key={tool.num} style={{ width: 570, height: 300, borderRadius: 28, background: `${tool.color}10`, border: `3px solid ${tool.color}35`, display: "flex", alignItems: "center", gap: 42, padding: "0 54px", opacity: tOp, transform: `scale(${tScale}) translateY(${hover}px)` }}>
                <div style={{ width: 75, height: 75, borderRadius: "50%", background: `${tool.color}25`, border: `2px solid ${tool.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 39, fontWeight: 800, fontFamily: fonts.main, color: tool.color, flexShrink: 0 }}>
                  {tool.num}
                </div>
                <div style={{ width: 120, height: 120, borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#FFFFFF08" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill={`${tool.color}20`} stroke={`${tool.color}60`} strokeWidth="2" />
                    <text x="40" y="48" textAnchor="middle" fontSize="24" fontFamily={fonts.main} fill={tool.color} fontWeight="800">
                      {tool.num}
                    </text>
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={{ fontSize: 45, fontWeight: 800, fontFamily: fonts.main, color: "#FFFFFFdd", whiteSpace: "nowrap" }}>{tool.name}</span>
                  <span style={{ fontSize: 33, fontWeight: 600, fontFamily: fonts.main, color: `${tool.color}cc` }}>{tool.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};