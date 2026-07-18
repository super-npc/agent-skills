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

export const WipeClockTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [15, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene A clips from right side shrinking — reveals Scene B underneath
  const rightInset = (1 - progress) * 100;
  const clipPath = `inset(0 ${rightInset}% 0 0)`;

  return (
    <AbsoluteFill>
      {/* Scene B at the bottom — revealed as A wipes away */}
      <SceneB />
      {/* Scene A on top, clipped from the left expanding rightward */}
      <AbsoluteFill style={{ clipPath }}>
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};