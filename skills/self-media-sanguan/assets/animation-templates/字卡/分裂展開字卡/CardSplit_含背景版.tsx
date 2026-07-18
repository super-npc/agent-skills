import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const splitProgress = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 130 } });
  const textProgress = spring({ frame: frame - 20, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-700, 0]);
  const splitY = interpolate(splitProgress, [0, 1], [0, 45]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0a1a 0%, #1a0f2a 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px)`,
          display: "flex",
          flexDirection: "column",
          width: 520,
          overflow: "visible",
        }}
      >
        <div
          style={{
            transform: `translateY(-${splitY}px)`,
            background: "rgba(46, 16, 101, 0.95)",
            paddingLeft: 24,
            paddingRight: 52,
            height: 45,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              opacity: textOpacity,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            David Kim
          </div>
        </div>
        <div
          style={{
            transform: `translateY(${splitY}px)`,
            background: "rgba(88, 28, 135, 0.90)",
            paddingLeft: 24,
            paddingRight: 52,
            height: 45,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#d8b4fe",
              fontFamily: "sans-serif",
              opacity: textOpacity,
              whiteSpace: "nowrap",
            }}
          >
            Brand Strategist
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};