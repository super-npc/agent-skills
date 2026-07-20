import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

// Deterministic flicker pattern (pre-calculated, no Math.random())
const FLICKER = [1,0,1,1,0,1,0,1,1,0,0,1,1,0,1,1,1,0,1,0,1,1,1,0,0,1,1,1,0,1];

export const NeonGlowTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const isFlickering = frame < 45;
  const flickerOpacity = isFlickering
    ? FLICKER[frame % FLICKER.length] === 1 ? 1 : 0.05
    : 1;

  const glowProgress = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textShadow = [
    `0 0 ${7 * glowProgress}px #fff`,
    `0 0 ${10 * glowProgress}px #fff`,
    `0 0 ${21 * glowProgress}px #fff`,
    `0 0 ${42 * glowProgress}px #f0abfc`,
    `0 0 ${82 * glowProgress}px #f0abfc`,
    `0 0 ${102 * glowProgress}px #d946ef`,
  ].join(", ");

  return (
    <AbsoluteFill
      style={{
        background: "#050008",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 100,
          fontWeight: 400,
          color: "#f5d0fe",
          fontFamily: "'Courier New', Courier, monospace",
          letterSpacing: "0.15em",
          opacity: flickerOpacity,
          textShadow,
        }}
      >
        NEON GLOW
      </div>
    </AbsoluteFill>
  );
};