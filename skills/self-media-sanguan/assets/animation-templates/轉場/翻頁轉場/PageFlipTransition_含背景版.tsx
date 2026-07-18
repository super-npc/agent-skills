import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

export const PageFlipTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 22, stiffness: 90 },
  });

  const aRotateY = progress * -180;
  const bRotateY = 180 - progress * 180;

  return (
    <AbsoluteFill style={{ perspective: "1200px" }}>
      <SceneB />
      <AbsoluteFill
        style={{
          transform: `rotateY(${aRotateY}deg)`,
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
        }}
      >
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `rotateY(${bRotateY}deg)`,
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
        }}
      >
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};