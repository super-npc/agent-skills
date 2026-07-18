import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

export const GROWTH-24-DURATION-FRAMES = 180;

export const Scene161-Growth24: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const cardSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, stiffness: 80 } });

  const countStart = 25;
  const countEnd = 70;
  const countProgress = interpolate(frame, [countStart, countEnd], [0, 24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayNum = Math.round(countProgress);

  const arrowSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 10, stiffness: 60 } });

  const bar1Spring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 80 } });
  const bar2Spring = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 12, stiffness: 80 } });
  const bar3Spring = spring({ frame: Math.max(0, frame - 36), fps, config: { damping: 12, stiffness: 80 } });
  const bar4Spring = spring({ frame: Math.max(0, frame - 44), fps, config: { damping: 12, stiffness: 80 } });
  const bar5Spring = spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 12, stiffness: 80 } });

  const glowPulse = frame > countEnd ? 0.3 + Math.sin(frame * 0.06) * 0.15 : 0;

  const bars = [
    { h: 80, sp: bar1Spring, color: "rgba(77,163,255,0.5)" },
    { h: 110, sp: bar2Spring, color: "rgba(77,163,255,0.6)" },
    { h: 95, sp: bar3Spring, color: "rgba(77,163,255,0.55)" },
    { h: 130, sp: bar4Spring, color: "rgba(77,163,255,0.65)" },
    { h: 170, sp: bar5Spring, color: "#10B981" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
      }}
    >
      <div
        style={{
          opacity: cardSpring,
          transform: `scale(${0.9 + cardSpring * 0.1}) translateY(${(1 - cardSpring) * 30}px)`,
          background: "rgba(10,14,20,0.95)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: 24,
          padding: "75px 105px",
          boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans TC', sans-serif" }}>
          比前一年增長
        </div>

        <div
          style={{
            fontSize: 210,
            fontWeight: 900,
            color: "#10B981",
            lineHeight: 1,
            letterSpacing: -4,
            textShadow: `0 0 ${glowPulse * 60}px rgba(16,185,129,${glowPulse})`,
          }}
        >
          {displayNum}
          <span style={{ fontSize: 120 }}>%</span>
        </div>

        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginTop: -15 }}>
          Year-over-year growth
        </div>

        <svg width={750} height={360} viewBox="0 0 500 240">
          {bars.map((bar, i) => {
            const x = 60 + i * 90;
            const barH = bar.h * bar.sp;
            return (
              <g key={i}>
                <rect x={x} y={210 - barH} width={55} height={barH} rx={8} fill={bar.color} />
                <text x={x + 27.5} y={228} textAnchor="middle" fontSize={12} fill="rgba(255,255,255,0.3)" fontFamily="'Inter', sans-serif">
                  {2021 + i}
                </text>
              </g>
            );
          })}

          {arrowSpring > 0.1 && (() => {
            const x1 = 60 + 3 * 90 + 55;
            const y1 = 210 - 130;
            const x2 = 60 + 4 * 90 + 27.5;
            const y2 = 210 - 170;
            const midX = (x1 + x2) / 2;
            const midY = Math.min(y1, y2) - 30;
            return (
              <g opacity={arrowSpring}>
                <path d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2 + 5}`} fill="none" stroke="#10B981" strokeWidth={3} strokeDasharray={`${arrowSpring * 200} 200`} />
                <polygon points={`${x2 - 6},${y2 + 12} ${x2},${y2} ${x2 + 6},${y2 + 12}`} fill="#10B981" opacity={arrowSpring > 0.7 ? 1 : 0} />
                <text x={midX} y={midY - 8} textAnchor="middle" fontSize={18} fontWeight={800} fill="#10B981" fontFamily="'Inter', sans-serif" opacity={arrowSpring > 0.5 ? arrowSpring : 0}>
                  +24%
                </text>
              </g>
            );
          })()}

          <line x1={40} y1={210} x2={480} y2={210} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};