import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TOOL-SELECTION-DURATION-FRAMES = 180;

const CRITERIA = [
  { label: "免費額度多", en: "Generous free tier", icon: "💰", color: "#10B981", delay: 20 },
  { label: "效果好", en: "Works well", icon: "⭐", color: "#F59E0B", delay: 50 },
];

const TOOLS = [
  { name: "Gemini", badge: "免費", color: "#4DA3FF", delay: 90 },
  { name: "Cloudflare", badge: "免費", color: "#F59E0B", delay: 110 },
  { name: "Tavily", badge: "試用", color: "#A78BFA", delay: 130 },
  { name: "Resend", badge: "免費", color: "#10B981", delay: 150 },
];

export const Scene205-ToolSelection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const critSprings = CRITERIA.map((c) =>
    spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const toolSprings = TOOLS.map((t) =>
    spring({ frame: Math.max(0, frame - t.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const vsSpring = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 10, stiffness: 80 } });

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
        挑工具的標準：<span style={{ color: "#10B981" }}>免費額度多</span>且<span style={{ color: "#F59E0B" }}>效果好</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 26, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Pick tools with generous free tiers and good results
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Criteria */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {CRITERIA.map((c, i) => (
            <div key={i} style={{ opacity: critSprings[i], transform: `translateX(${(1 - critSprings[i]) * -20}px)`, display: "flex", alignItems: "center", gap: 16, background: `${c.color}10`, border: `2px solid ${c.color}35`, borderRadius: 16, padding: "18px 32px" }}>
              <div style={{ fontSize: 36 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.label}</div>
                <div style={{ fontSize: 16, color: `${c.color}50`, fontFamily: "'Inter', sans-serif" }}>{c.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ opacity: vsSpring }}>
          <svg width={60} height={50} viewBox="0 0 60 50">
            <line x1={5} y1={25} x2={42} y2={25} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="42,17 55,25 42,33" fill="rgba(255,255,255,0.25)" />
          </svg>
        </div>

        {/* Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {TOOLS.map((tool, i) => (
            <div key={i} style={{ opacity: toolSprings[i], transform: `translateX(${(1 - toolSprings[i]) * 20}px)`, display: "flex", alignItems: "center", gap: 12, background: `${tool.color}08`, border: `1.5px solid ${tool.color}30`, borderRadius: 12, padding: "12px 24px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: tool.color }}>{tool.name}</div>
              <div style={{ background: tool.color, borderRadius: 8, padding: "2px 10px", fontSize: 14, color: "#fff", fontWeight: 600 }}>{tool.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};