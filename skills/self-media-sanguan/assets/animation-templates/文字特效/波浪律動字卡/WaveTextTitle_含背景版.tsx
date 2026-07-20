import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

const TEXT = "MOTION";
const AMPLITUDE = 28;
const PERIOD = 40;
const COLORS = ["#f472b6", "#c084fc", "#818cf8", "#38bdf8", "#34d399", "#fbbf24"];

export const WaveTextTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0a1a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", opacity }}>
        {TEXT.split("").map((char, i) => {
          const phase =
            (frame / PERIOD) * Math.PI * 2 + (i / TEXT.length) * Math.PI * 2;
          const y = Math.sin(phase) * AMPLITUDE;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${y}px)`,
                fontSize: 140,
                fontWeight: 900,
                color: COLORS[i % COLORS.length],
                fontFamily: "sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};