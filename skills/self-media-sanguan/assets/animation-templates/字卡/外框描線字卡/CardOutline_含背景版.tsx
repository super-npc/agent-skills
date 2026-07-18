import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const CardOutline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-700, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)",
        justifyContent: "flex-end",
        paddingBottom: 80,
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
        <div style={{ width: 4, background: "#f59e0b", flexShrink: 0 }} />
        <div
          style={{
            border: "3px solid #f59e0b",
            borderLeft: "none",
            background: "transparent",
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
              lineHeight: 1.15,
            }}
          >
            Jane Smith
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fcd34d",
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