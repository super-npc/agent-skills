import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

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
        fontSize: 80,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
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
        fontSize: 80,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      Scene B
    </div>
  </AbsoluteFill>
);

export const FlashWhiteTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // 閃光前半段：frame 30-45，opacity 0→1
  const flashIn = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 閃光後半段：frame 45-60，opacity 1→0
  const flashOut = interpolate(frame, [45, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame < 45 時用 flashIn，frame >= 45 時用 flashOut
  const flashOpacity = frame < 45 ? flashIn : flashOut;

  return (
    <AbsoluteFill>
      {/* 場景切換點在 flash 最白的瞬間（frame 45） */}
      {frame < 45 ? <SceneA /> : <SceneB />}

      {/* 白色 overlay */}
      <AbsoluteFill
        style={{
          background: "white",
          opacity: flashOpacity,
        }}
      />
    </AbsoluteFill>
  );
};