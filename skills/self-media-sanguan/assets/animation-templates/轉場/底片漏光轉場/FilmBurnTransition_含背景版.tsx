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

export const FilmBurnTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // 場景切換點：frame 45 前顯示場景 A，之後顯示場景 B
  const showSceneA = frame < 45;

  // 漏光層 opacity：frame 30-45 從 0→1，frame 45-60 從 1→0
  const burnOpacity = interpolate(
    frame,
    [30, 45, 60],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 漏光層 scale：frame 30-60 從 0.5→2
  const burnScale = interpolate(frame, [30, 60], [0.5, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 橘色 overlay opacity：frame 40-45 從 0→1，frame 45-50 從 1→0
  const overlayOpacity = interpolate(
    frame,
    [40, 45, 50],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      {/* 底層場景 */}
      {showSceneA ? <SceneA /> : <SceneB />}

      {/* 漏光層：橘紅色光暈 */}
      <AbsoluteFill
        style={{
          opacity: burnOpacity,
          transform: `scale(${burnScale})`,
          background:
            "radial-gradient(ellipse at center, #ff6b00 0%, #ff2200 30%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 橘色 overlay：漏光最強時疊加 */}
      <AbsoluteFill
        style={{
          opacity: overlayOpacity,
          background: "rgba(255,120,0,0.3)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};