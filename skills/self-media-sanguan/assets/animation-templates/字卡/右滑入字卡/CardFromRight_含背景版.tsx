import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardFromRight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [700, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0f0a 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: 80,
        paddingRight: 0,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px)`,
          display: "flex",
          alignItems: "stretch",
          height: 90,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            paddingRight: 24,
            paddingLeft: 52,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              textAlign: "right",
            }}
          >
            Alex Johnson
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fdba74",
              fontFamily: "sans-serif",
              marginTop: 2,
              textAlign: "right",
            }}
          >
            Lead Engineer
          </div>
        </div>
        <div style={{ width: 4, background: "#f97316", flexShrink: 0 }} />
      </div>
    </AbsoluteFill>
  );
};