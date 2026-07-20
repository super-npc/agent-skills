import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const LINE-COUNT = 120;
const BASE-RADIUS = 180;
const MAX-EXTRA = 160;
const CX = 960;
const CY = 540;

export const AudioCircleViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Breathing pulse
  const breathe = 1 + 0.04 * Math.sin(frame * 0.07);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background rings */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0, opacity: intro * 0.3 }}
      >
        {[240, 300, 360, 420].map((r) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="rgba(150,80,255,0.2)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Main spectrum SVG */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0, opacity: intro }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a040ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a040ff" stopOpacity="0" />
          </radialGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center glow */}
        <circle cx={CX} cy={CY} r={220} fill="url(#centerGlow)" />

        {/* Spectrum lines */}
        {Array.from({ length: LINE-COUNT }).map((_, i) => {
          const angle = (i / LINE-COUNT) * Math.PI * 2;
          const speed = 0.06 + (i % 7) * 0.012;
          const phase = i * (Math.PI * 2 / LINE-COUNT) * 2.5;
          const sinVal = (Math.sin(frame * speed + phase) + 1) / 2;
          const extra = sinVal * MAX-EXTRA * breathe;

          const r1 = BASE-RADIUS * breathe;
          const r2 = r1 + extra;

          const x1 = CX + Math.cos(angle) * r1;
          const y1 = CY + Math.sin(angle) * r1;
          const x2 = CX + Math.cos(angle) * r2;
          const y2 = CY + Math.sin(angle) * r2;

          // Color based on angle
          const hue = (angle / (Math.PI * 2)) * 360;
          const color = `hsl(${hue}, 100%, 70%)`;
          const lineWidth = 1.5 + sinVal * 2;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={lineWidth}
              opacity={0.7 + sinVal * 0.3}
              filter="url(#lineGlow)"
            />
          );
        })}

        {/* Inner circle fill */}
        <circle
          cx={CX}
          cy={CY}
          r={BASE-RADIUS * breathe - 4}
          fill="rgba(20,0,40,0.9)"
        />

        {/* Center icon — musical note via text */}
        <text
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          fontSize={72}
          fill="rgba(200,150,255,0.9)"
          style={{ filter: "drop-shadow(0 0 12px rgba(180,100,255,0.8))" }}
        >
          ♪
        </text>
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: intro,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textShadow: "0 0 30px rgba(160,64,255,0.7)",
          }}
        >
          圓形頻譜
        </div>
        <div style={{ fontSize: 20, color: "#8040cc", marginTop: 8, letterSpacing: "0.1em" }}>
          CIRCLE SPECTRUM
        </div>
      </div>
    </AbsoluteFill>
  );
};