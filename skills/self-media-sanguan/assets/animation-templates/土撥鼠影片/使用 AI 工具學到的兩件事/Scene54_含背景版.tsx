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

const LESSONS = [
  {
    num: 1, label: "隨意下 Prompt", sub: "→ 做出 2014 年以前風格的網站", subHighlight: "2014 年以前", color: "#FF6B6B", delay: 50,
    icon: (
      <svg width="75" height="75" viewBox="-25 -25 50 50">
        <polygon points="0,-18 20,16 -20,16" fill="none" stroke="#FFFFFFcc" strokeWidth="2.5" strokeLinejoin="round" />
        <text x="0" y="12" textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#FFFFFFcc" fontWeight="800">!</text>
      </svg>
    ),
  },
  {
    num: 2, label: "要透過 Skill 的方式", sub: "→ 才能再優化網站的風格", subHighlight: "優化網站的風格", color: "#00D4AA", delay: 130,
    icon: (
      <svg width="75" height="75" viewBox="-25 -25 50 50">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#FFFFFFcc" strokeWidth="2.5" />
        <path d="M-10 0 L-3 7 L12 -8" fill="none" stroke="#FFFFFFcc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const Scene54-TwoLessons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ fontSize: 66, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 4, opacity: titleOpacity, transform: `scale(${titleScale})` }}>
          <span style={{ color: "#FFFFFFcc" }}>學到兩件事</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 45 }}>
          {LESSONS.map((lesson) => {
            const tSpring = spring({ frame: Math.max(0, frame - lesson.delay), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
            const tScale = interpolate(tSpring, [0, 1], [0.3, 1]);
            const tOp = interpolate(tSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const slideX = interpolate(tSpring, [0, 1], [80, 0]);
            const subParts = lesson.sub.split(lesson.subHighlight);
            return (
              <div key={lesson.num} style={{ display: "flex", alignItems: "center", gap: 42, padding: "33px 66px", borderRadius: 22, background: `${lesson.color}10`, border: `3px solid ${lesson.color}30`, minWidth: 1050, opacity: tOp, transform: `scale(${tScale}) translateX(${slideX}px)` }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${lesson.color}20`, border: `2.5px solid ${lesson.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 45, fontWeight: 800, fontFamily: fonts.main, color: lesson.color, flexShrink: 0 }}>
                  {lesson.num}
                </div>
                <div style={{ flexShrink: 0 }}>{lesson.icon}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={{ fontSize: 51, fontWeight: 700, fontFamily: fonts.main, color: "#FFFFFFdd", whiteSpace: "nowrap" }}>{lesson.label}</span>
                  <span style={{ fontSize: 36, fontWeight: 500, fontFamily: fonts.main, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                    {subParts[0]}
                    <span style={{ color: lesson.color, fontWeight: 700 }}>{lesson.subHighlight}</span>
                    {subParts[1] || ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};