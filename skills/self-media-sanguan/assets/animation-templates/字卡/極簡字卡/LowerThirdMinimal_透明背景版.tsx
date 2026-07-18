import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const LowerThirdMinimal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 28, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [30, 0]);
  const lineWidth = interpolate(progress, [0, 1], [0, 320]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 80,
        paddingLeft: 100,
      }}
    >
      <div style={{ transform: `translateY(${y}px)`, opacity }}>
        <div style={{ fontSize: 44, fontWeight: 600, color: "#ffffff", fontFamily: "sans-serif", lineHeight: 1 }}>
          Sarah Park
        </div>
        <div style={{ marginTop: 8, height: 2, width: lineWidth, background: "#e4e4e7" }} />
        <div style={{ marginTop: 8, fontSize: 18, color: "#a1a1aa", fontFamily: "sans-serif", letterSpacing: "0.06em" }}>
          Creative Director
        </div>
      </div>
    </AbsoluteFill>
  );
};