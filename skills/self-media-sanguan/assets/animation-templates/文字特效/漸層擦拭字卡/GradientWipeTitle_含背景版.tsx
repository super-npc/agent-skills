import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const GradientWipeTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 30, stiffness: 50 } });
  const clipRight = interpolate(progress, [0, 1], [100, 0]);

  const textStyle: React.CSSProperties = {
    fontSize: 96,
    fontWeight: 900,
    fontFamily: "sans-serif",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{
        background: "#030712",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Gray base text */}
        <div style={{ ...textStyle, color: "#1f2937" }}>
          Your Story Starts Here
        </div>

        {/* Colorful text revealed by wipe */}
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${clipRight}% 0 0)`,
            background: "linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Story Starts Here
        </div>
      </div>
    </AbsoluteFill>
  );
};