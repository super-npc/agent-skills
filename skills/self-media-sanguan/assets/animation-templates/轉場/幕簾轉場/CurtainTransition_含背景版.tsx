import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const SceneA: React.FC = () => (
  <div
    style={{
      width: 1920,
      height: 1080,
      background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      display: "flex",
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
  </div>
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

export const CurtainTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const leftTranslateX = interpolate(frame, [20, 70], [0, -960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightTranslateX = interpolate(frame, [20, 70], [0, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 底層：場景 B */}
      <SceneB />

      {/* 上層左半門 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 960,
          height: 1080,
          overflow: "hidden",
          transform: `translateX(${leftTranslateX}px)`,
        }}
      >
        {/* 場景 A 靠左，顯示左半部 */}
        <SceneA />
      </div>

      {/* 上層右半門 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 960,
          width: 960,
          height: 1080,
          overflow: "hidden",
          transform: `translateX(${rightTranslateX}px)`,
        }}
      >
        {/* 場景 A 向左偏移 960px，顯示右半部 */}
        <div style={{ marginLeft: -960 }}>
          <SceneA />
        </div>
      </div>
    </AbsoluteFill>
  );
};