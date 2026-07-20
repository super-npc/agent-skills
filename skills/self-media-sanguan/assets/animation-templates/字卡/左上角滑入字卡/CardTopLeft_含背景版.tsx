import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardTopLeft: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-600, 0]);
  const y = interpolate(slideProgress, [0, 1], [-100, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: 60,
        paddingLeft: 0,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px) translateY(${y}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "#0f172a",
            paddingLeft: 24,
            paddingRight: 52,
            paddingTop: 16,
            paddingBottom: 16,
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
              color: "#bae6fd",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Creative Director
          </div>
        </div>
        <div style={{ height: 4, background: "#38bdf8", flexShrink: 0 }} />
      </div>
    </AbsoluteFill>
  );
};