import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const BlurFocusTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 40, stiffness: 35 } });
  const blur = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [1.25, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 108,
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "0.08em",
          filter: `blur(${blur}px)`,
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        IN FOCUS
      </div>
    </AbsoluteFill>
  );
};