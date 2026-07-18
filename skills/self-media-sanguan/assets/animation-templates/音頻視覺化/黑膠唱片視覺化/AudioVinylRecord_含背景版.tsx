import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const CX = 680;
const CY = 540;
const RECORD-R = 320;
const LABEL-R = 110;
const BAR-COUNT = 24;

export const AudioVinylRecord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const rotation = frame * 1.2; // degrees per frame

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #0d0010 100%)",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0, opacity: intro }}
      >
        <defs>
          {/* Vinyl groove gradient */}
          <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="40%" stopColor="#111111" />
            <stop offset="70%" stopColor="#0d0d0d" />
            <stop offset="100%" stopColor="#080808" />
          </radialGradient>
          {/* Label gradient */}
          <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cc3300" />
            <stop offset="60%" stopColor="#991100" />
            <stop offset="100%" stopColor="#660800" />
          </radialGradient>
          <filter id="vinylShadow">
            <feDropShadow dx="8" dy="12" stdDeviation="20" floodOpacity="0.6" />
          </filter>
          <filter id="barGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Record body */}
        <g transform={`rotate(${rotation}, ${CX}, ${CY})`} filter="url(#vinylShadow)">
          <circle cx={CX} cy={CY} r={RECORD-R} fill="url(#vinylGrad)" />

          {/* Groove rings */}
          {Array.from({ length: 18 }).map((_, i) => {
            const r = 130 + i * 10;
            return (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            );
          })}

          {/* Outer ring highlight */}
          <circle
            cx={CX}
            cy={CY}
            r={RECORD-R - 8}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={4}
          />

          {/* Label */}
          <circle cx={CX} cy={CY} r={LABEL-R} fill="url(#labelGrad)" />
          <circle cx={CX} cy={CY} r={LABEL-R - 10} fill="none" stroke="rgba(255,180,100,0.3)" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={LABEL-R - 24} fill="none" stroke="rgba(255,180,100,0.2)" strokeWidth={1} />

          {/* Center hole */}
          <circle cx={CX} cy={CY} r={10} fill="#000000" />
          <circle cx={CX} cy={CY} r={8} fill="#1a1a1a" />
        </g>

        {/* Tonearm */}
        <g opacity={intro}>
          <line
            x1={CX + 370}
            y1={CY - 280}
            x2={CX + 250}
            y2={CY - 40}
            stroke="rgba(200,180,120,0.8)"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle cx={CX + 370} cy={CY - 280} r={18} fill="#333" stroke="rgba(200,180,120,0.5)" strokeWidth={2} />
        </g>

        {/* Audio bars on the right side */}
        {Array.from({ length: BAR-COUNT }).map((_, i) => {
          const speed = 0.07 + (i % 5) * 0.018;
          const phase = i * 0.38;
          const sinVal = (Math.sin(frame * speed + phase) + 1) / 2;
          const barH = 20 + sinVal * 200;

          const BAR-W = 20;
          const GAP = 6;
          const totalW = BAR-COUNT * (BAR-W + GAP) - GAP;
          const startX = 1920 - 80 - totalW;
          const x = startX + i * (BAR-W + GAP);
          const y = CY + barH / 2;

          const hue = 20 + (i / BAR-COUNT) * 40;
          const color = `hsl(${hue}, 90%, 60%)`;

          return (
            <rect
              key={i}
              x={x}
              y={CY - barH / 2}
              width={BAR-W}
              height={barH}
              rx={4}
              fill={color}
              opacity={0.85 * intro}
              filter="url(#barGlow)"
            />
          );
        })}
      </svg>

      {/* Text panel */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 80,
          transform: "translateY(-50%)",
          textAlign: "right",
          opacity: intro,
          width: 460,
          marginRight: 20,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            textShadow: "0 0 24px rgba(220,100,40,0.5)",
          }}
        >
          黑膠唱片
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#cc6622",
            marginTop: 12,
            letterSpacing: "0.12em",
          }}
        >
          VINYL RECORD VISUALIZER
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "#6b5040",
            lineHeight: 1.8,
          }}
        >
          復古音頻視覺化
          <br />
          旋轉唱片 × 頻譜律動
        </div>
      </div>
    </AbsoluteFill>
  );
};