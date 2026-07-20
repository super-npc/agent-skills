import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

export const ShimmerTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const shimmerCenter = interpolate(frame, [5, 85], [-25, 125], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const maskGradient = `linear-gradient(
    105deg,
    transparent ${shimmerCenter - 20}%,
    rgba(0,0,0,0.4) ${shimmerCenter - 8}%,
    black ${shimmerCenter}%,
    rgba(0,0,0,0.4) ${shimmerCenter + 8}%,
    transparent ${shimmerCenter + 20}%
  )`;

  const textStyle: React.CSSProperties = {
    fontSize: 100,
    fontWeight: 900,
    fontFamily: "sans-serif",
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{
        background: "#0c0c0c",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", opacity }}>
        {/* Base: dark gold */}
        <div style={{ ...textStyle, color: "#8b6914" }}>GOLDEN HOUR</div>
        {/* Shimmer: bright gold, revealed by moving mask */}
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            color: "#fff8dc",
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
          }}
        >
          GOLDEN HOUR
        </div>
      </div>
    </AbsoluteFill>
  );
};