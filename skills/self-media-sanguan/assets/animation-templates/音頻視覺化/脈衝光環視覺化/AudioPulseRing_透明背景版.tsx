import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const CX = 960;
const CY = 540;
const RING-COUNT = 6;
const PULSE-INTERVAL = 18; // frames between each pulse emit

interface PulseRing {
  startFrame: number;
  color: string;
  maxRadius: number;
}

const PULSE-RINGS: PulseRing[] = Array.from({ length: RING-COUNT }).map((_, i) => ({
  startFrame: i * PULSE-INTERVAL,
  color: `hsl(${180 + i * 25}, 90%, 65%)`,
  maxRadius: 420,
}));

export const AudioPulseRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Heartbeat / pulse modulation
  const beatPhase = (frame % PULSE-INTERVAL) / PULSE-INTERVAL;
  const beat = Math.pow(Math.sin(beatPhase * Math.PI), 2);

  const centerScale = 1 + beat * 0.12;

  return (
    <AbsoluteFill
      style={{
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
          <radialGradient id="pulseCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="centerGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Expanding pulse rings — looped */}
        {PULSE-RINGS.map((ring, idx) => {
          // Compute where this ring is in its cycle; loop with modulo
          const cycleDuration = RING-COUNT * PULSE-INTERVAL;
          const elapsed = (frame - ring.startFrame + cycleDuration * 10) % cycleDuration;
          const progress = Math.min(elapsed / (cycleDuration * 0.7), 1);

          const radius = progress * ring.maxRadius;
          const opacity = (1 - progress) * 0.8;

          if (opacity <= 0) return null;

          return (
            <circle
              key={idx}
              cx={CX}
              cy={CY}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={3 - progress * 2}
              opacity={opacity}
              filter="url(#ringGlow)"
            />
          );
        })}

        {/* Static guide rings */}
        {[100, 160, 220].map((r) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="rgba(0,200,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Center glow */}
        <circle cx={CX} cy={CY} r={180} fill="url(#pulseCenter)" />

        {/* Center circle */}
        <circle
          cx={CX}
          cy={CY}
          r={70 * centerScale}
          fill="rgba(0,20,40,0.95)"
          stroke="rgba(0,200,255,0.6)"
          strokeWidth={2}
          filter="url(#centerGlow)"
        />

        {/* Musical note symbol */}
        <text
          x={CX}
          y={CY + 20}
          textAnchor="middle"
          fontSize={64}
          fill="rgba(0,220,255,0.95)"
          style={{ filter: "drop-shadow(0 0 14px rgba(0,200,255,0.9))" }}
        >
          ♫
        </text>

        {/* Waveform strip at bottom of center circle */}
        {Array.from({ length: 14 }).map((_, i) => {
          const wH = 6 + Math.sin(frame * 0.12 + i * 0.6) * 12 + 12;
          const wX = CX - 52 + i * 8;
          return (
            <rect
              key={i}
              x={wX}
              y={CY + 36 - wH / 2}
              width={5}
              height={wH}
              rx={2}
              fill="rgba(0,220,255,0.5)"
            />
          );
        })}
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
            textShadow: "0 0 30px rgba(0,200,255,0.7)",
          }}
        >
          脈衝光環
        </div>
        <div style={{ fontSize: 20, color: "#007799", marginTop: 8, letterSpacing: "0.1em" }}>
          PULSE RING VISUALIZER
        </div>
      </div>
    </AbsoluteFill>
  );
};