import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

const SceneA: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 96,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
        letterSpacing: 8,
        textShadow: "0 4px 32px rgba(59,130,246,0.5)",
      }}
    >
      Scene A
    </div>
  </AbsoluteFill>
);

const SceneB: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #1a0533 0%, #0f0a1a 100%)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 96,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
        letterSpacing: 8,
        textShadow: "0 4px 32px rgba(168,85,247,0.5)",
      }}
    >
      Scene B
    </div>
  </AbsoluteFill>
);

export const PixelateTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const blurRadius = interpolate(frame, [20, 40, 60], [0, 24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aOpacity = interpolate(frame, [20, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bOpacity = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: bOpacity }}>
        <SceneB />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: aOpacity,
          filter: `blur(${blurRadius}px)`,
        }}
      >
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};