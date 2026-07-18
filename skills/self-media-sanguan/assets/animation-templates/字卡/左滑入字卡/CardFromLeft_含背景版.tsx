import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardFromLeft: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-700, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0a0a 0%, #0f172a 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 80,
        paddingLeft: 0,
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
        <div style={{ width: 4, background: "#ef4444", flexShrink: 0 }} />
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            paddingLeft: 24,
            paddingRight: 52,
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
            }}
          >
            Jane Smith
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fca5a5",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Creative Director
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};