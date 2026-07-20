import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const WAVE-LAYERS = [
  { amplitude: 80, frequency: 0.012, speed: 0.06, color: "#00d4ff", opacity: 0.9, blur: 0 },
  { amplitude: 55, frequency: 0.018, speed: 0.09, color: "#7b2fff", opacity: 0.7, blur: 2 },
  { amplitude: 40, frequency: 0.025, speed: 0.05, color: "#ff2d78", opacity: 0.55, blur: 4 },
  { amplitude: 25, frequency: 0.035, speed: 0.12, color: "#00ffaa", opacity: 0.4, blur: 6 },
];

const POINTS = 300;
const W = 1920;
const H = 1080;
const CENTER-Y = H / 2;

function buildPath(frame: number, layer: typeof WAVE-LAYERS[0]): string {
  const { amplitude, frequency, speed } = layer;
  const pts: string[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * W;
    const y =
      CENTER-Y +
      amplitude * Math.sin(x * frequency + frame * speed) +
      (amplitude * 0.4) * Math.sin(x * frequency * 2.3 + frame * speed * 1.7 + 1);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export const AudioWaveform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(intro, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0,180,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Waveform SVG */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0, opacity: intro }}
      >
        <defs>
          {WAVE-LAYERS.map((layer, i) => (
            <filter key={i} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation={layer.blur + 3} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Render layers back-to-front */}
        {[...WAVE-LAYERS].reverse().map((layer, ri) => {
          const i = WAVE-LAYERS.length - 1 - ri;
          const d = buildPath(frame, layer);
          return (
            <g key={i}>
              {/* glow copy */}
              <path
                d={d}
                fill="none"
                stroke={layer.color}
                strokeWidth={6}
                opacity={layer.opacity * 0.4}
                filter={`url(#glow-${i})`}
              />
              {/* main line */}
              <path
                d={d}
                fill="none"
                stroke={layer.color}
                strokeWidth={2}
                opacity={layer.opacity}
              />
            </g>
          );
        })}

        {/* Center reference line */}
        <line
          x1={0}
          y1={CENTER-Y}
          x2={W}
          y2={CENTER-Y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="8 12"
        />
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
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textShadow: "0 0 30px rgba(0,212,255,0.7)",
          }}
        >
          聲波視覺化
        </div>
        <div style={{ fontSize: 20, color: "#0099bb", marginTop: 8, letterSpacing: "0.1em" }}>
          AUDIO WAVEFORM
        </div>
      </div>
    </AbsoluteFill>
  );
};