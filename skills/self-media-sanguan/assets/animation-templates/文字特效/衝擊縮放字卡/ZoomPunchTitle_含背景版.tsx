import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const ZoomPunchTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 250, mass: 0.7 },
  });
  const scale = interpolate(progress, [0, 1], [6, 1]);
  const opacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#dc2626",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontSize: 130,
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-0.03em",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        IMPACT
      </div>
    </AbsoluteFill>
  );
};