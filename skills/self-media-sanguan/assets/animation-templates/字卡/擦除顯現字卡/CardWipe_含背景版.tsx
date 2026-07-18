import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeProgress = spring({ frame, fps, config: { damping: 20, stiffness: 130 } });
  const textProgress = spring({ frame: frame - 15, fps, config: { damping: 25, stiffness: 110 } });

  const clipRight = interpolate(wipeProgress, [0, 1], [100, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0a1f 0%, #0a0f2a 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          clipPath: `inset(0 ${clipRight}% 0 0)`,
          display: "flex",
          alignItems: "stretch",
          height: 90,
        }}
      >
        <div
          style={{
            background: "rgba(49, 46, 129, 0.95)",
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
            Sofia Rossi
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a5b4fc",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            UX Researcher
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};