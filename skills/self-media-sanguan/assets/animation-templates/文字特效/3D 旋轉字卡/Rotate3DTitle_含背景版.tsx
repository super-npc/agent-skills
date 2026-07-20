import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const Rotate3DTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const rotateY = interpolate(progress, [0, 1], [-90, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#18181b",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg)`,
          opacity,
          fontSize: 110,
          fontWeight: 900,
          color: "#fafafa",
          fontFamily: "sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        3D ROTATE
      </div>
    </AbsoluteFill>
  );
};