import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const SceneA: React.FC = () => (
  <AbsoluteFill
    style={{
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

const STRIPE-COUNT = 8;
const STRIPE-HEIGHT = 1080 / STRIPE-COUNT; // 135px

export const BlindsTransition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* 底層：場景 B */}
      <SceneB />

      {/* 上層：8 條百葉窗條紋（場景 A 的顏色） */}
      {Array.from({ length: STRIPE-COUNT }).map((_, i) => {
        const scaleY = interpolate(frame - i * 8, [15, 45], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * STRIPE-HEIGHT,
              left: 0,
              width: 1920,
              height: STRIPE-HEIGHT,
              background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
              transform: `scaleY(${scaleY})`,
              transformOrigin: "top center",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};