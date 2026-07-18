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

export const ZoomThroughTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const aScale = interpolate(frame, [20, 55], [1, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aOpacity = interpolate(frame, [20, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bScale = interpolate(frame, [20, 55], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bOpacity = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: bOpacity,
          transform: `scale(${bScale})`,
        }}
      >
        <SceneB />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: aOpacity,
          transform: `scale(${aScale})`,
        }}
      >
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};