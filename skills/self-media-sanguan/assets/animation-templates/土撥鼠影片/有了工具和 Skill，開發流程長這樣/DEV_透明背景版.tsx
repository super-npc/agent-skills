import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const DEV-FLOW-INTRO-206-DURATION-FRAMES = 120;

export const Scene206-DevFlowIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const skillSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const toolSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 90 } });
  const arrow1Spring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 10, stiffness: 80 } });
  const arrow2Spring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 10, stiffness: 80 } });
  const processSpring = spring({ frame: Math.max(0, frame - 72), fps, config: { damping: 12, stiffness: 90 } });

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 66, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        有了<span style={{ color: "#4DA3FF" }}>工具</span>和 <span style={{ color: "#F59E0B" }}>Skill</span>，開發流程長這樣
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        With tools & skills, the dev flow looks like this
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        {/* Skill */}
        <div style={{ opacity: skillSpring, transform: `scale(${skillSpring})` }}>
          <div style={{ width: 200, height: 140, background: "rgba(245,158,11,0.1)", border: "2px solid rgba(245,158,11,0.35)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 40 }}>🧠</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F59E0B" }}>Skill</div>
          </div>
        </div>

        {/* Arrows converging */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ opacity: arrow1Spring }}>
            <svg width={80} height={25} viewBox="0 0 80 25">
              <line x1={2} y1={12} x2={58} y2={12} stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} strokeLinecap="round" />
              <polygon points="58,6 72,12 58,18" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>
          <div style={{ opacity: arrow2Spring }}>
            <svg width={80} height={25} viewBox="0 0 80 25">
              <line x1={2} y1={12} x2={58} y2={12} stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} strokeLinecap="round" />
              <polygon points="58,6 72,12 58,18" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>
        </div>

        {/* Tool */}
        <div style={{ opacity: toolSpring, transform: `scale(${toolSpring})` }}>
          <div style={{ width: 200, height: 140, background: "rgba(77,163,255,0.1)", border: "2px solid rgba(77,163,255,0.35)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 40 }}>🔧</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#4DA3FF" }}>工具</div>
          </div>
        </div>

        {/* Arrow to process */}
        <div style={{ opacity: processSpring }}>
          <svg width={60} height={40} viewBox="0 0 60 40">
            <line x1={5} y1={20} x2={42} y2={20} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="42,12 55,20 42,28" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>

        {/* Process */}
        <div style={{ opacity: processSpring, transform: `scale(${processSpring})` }}>
          <div style={{ width: 220, height: 180, background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.4)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 48 }}>⚡</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#10B981" }}>開發流程</div>
            <div style={{ fontSize: 16, color: "rgba(16,185,129,0.5)", fontFamily: "'Inter', sans-serif" }}>Dev Process</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};