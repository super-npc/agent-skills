import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardFromTop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const y = interpolate(slideProgress, [0, 1], [-200, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0f1a 0%, #1a1a2e 100%)",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            paddingLeft: 48,
            paddingRight: 48,
            paddingTop: 20,
            paddingBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
            }}
          >
            Maria Chen
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fde68a",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Motion Designer
          </div>
        </div>
        <div style={{ height: 4, background: "#f59e0b", width: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};