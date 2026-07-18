import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const CORE-FLOW-DURATION-FRAMES = 210;

const STEPS = [
  { label: "使用者輸入", en: "User Input", sub: "填寫創業想法", icon: "📝", color: "#4DA3FF", delay: 20 },
  { label: "搜尋資料", en: "Search", sub: "爬取相關資訊", icon: "🔍", color: "#F59E0B", delay: 70 },
  { label: "AI 分析", en: "AI Analysis", sub: "產生可行性報告", icon: "🤖", color: "#10B981", delay: 120 },
];

export const Scene202-CoreFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const stepSprings = STEPS.map((s) =>
    spring({ frame: Math.max(0, frame - s.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const arrowSprings = STEPS.slice(0, -1).map((s) =>
    spring({ frame: Math.max(0, frame - s.delay - 15), fps, config: { damping: 10, stiffness: 100 } })
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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 60, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        核心功能：<span style={{ color: "#4DA3FF" }}>輸入</span>→<span style={{ color: "#F59E0B" }}>搜尋</span>→<span style={{ color: "#10B981" }}>AI 分析</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        User Input → Search → AI Analysis
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                opacity: stepSprings[i],
                transform: `scale(${stepSprings[i]})`,
                width: 280,
                height: 260,
                borderRadius: 20,
                background: `${step.color}10`,
                border: `2px solid ${step.color}40`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 60 }}>{step.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: step.color }}>{step.label}</div>
              <div style={{ fontSize: 18, color: `${step.color}60`, fontFamily: "'Inter', sans-serif" }}>{step.en}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>{step.sub}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ opacity: arrowSprings[i], margin: "0 16px" }}>
                <svg width={50} height={40} viewBox="0 0 50 40">
                  <line x1={2} y1={20} x2={35} y2={20} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeLinecap="round" />
                  <polygon points="35,13 48,20 35,27" fill="rgba(255,255,255,0.25)" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};