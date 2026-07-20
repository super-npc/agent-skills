import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const BAR-COUNT = 20;

const COLORS = [
  "#ff0080",
  "#ff2060",
  "#ff4040",
  "#ff6020",
  "#ff8000",
  "#ffa000",
  "#ffc000",
  "#ffe000",
  "#e0ff00",
  "#a0ff00",
  "#60ff00",
  "#00ff40",
  "#00ff80",
  "#00ffc0",
  "#00e0ff",
  "#00a0ff",
  "#0060ff",
  "#2040ff",
  "#6000ff",
  "#a000ff",
];

export const AudioBarSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const BAR-MAX-HEIGHT = 420;
  const BAR-WIDTH = 44;
  const BAR-GAP = 12;
  const TOTAL-WIDTH = BAR-COUNT * (BAR-WIDTH + BAR-GAP) - BAR-GAP;
  const ORIGIN-X = (1920 - TOTAL-WIDTH) / 2;
  const BASELINE-Y = 700;

  const globalScale = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0010 0%, #000820 100%)",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: globalScale,
          transform: `translateY(${interpolate(globalScale, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textShadow: "0 0 40px rgba(180,100,255,0.6)",
          }}
        >
          頻譜視覺化
        </div>
        <div style={{ fontSize: 20, color: "#7c5cbc", marginTop: 8, letterSpacing: "0.1em" }}>
          AUDIO SPECTRUM
        </div>
      </div>

      {/* Bars */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {Array.from({ length: BAR-COUNT }).map((_, i) => {
          const speed = 0.08 + (i % 5) * 0.015;
          const phase = i * 0.45;
          const rawSin = Math.sin(frame * speed + phase);
          const rawHeight =
            ((rawSin + 1) / 2) * BAR-MAX-HEIGHT * 0.85 + BAR-MAX-HEIGHT * 0.1;
          const barHeight = rawHeight * globalScale;

          const x = ORIGIN-X + i * (BAR-WIDTH + BAR-GAP);
          const y = BASELINE-Y - barHeight;
          const color = COLORS[i];

          return (
            <g key={i}>
              {/* top bar */}
              <rect
                x={x}
                y={y}
                width={BAR-WIDTH}
                height={barHeight}
                rx={6}
                fill={`url(#grad-${i})`}
                style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
              />
              {/* mirror (faded) */}
              <rect
                x={x}
                y={BASELINE-Y}
                width={BAR-WIDTH}
                height={barHeight * 0.3}
                rx={4}
                fill={color}
                opacity={0.15}
              />
              <defs>
                <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={ORIGIN-X - 10}
          y1={BASELINE-Y}
          x2={ORIGIN-X + TOTAL-WIDTH + 10}
          y2={BASELINE-Y}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />
      </svg>
    </AbsoluteFill>
  );
};