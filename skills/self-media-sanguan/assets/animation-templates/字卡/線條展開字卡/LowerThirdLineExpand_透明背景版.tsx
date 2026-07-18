import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const LowerThirdLineExpand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({ frame, fps, config: { damping: 25, stiffness: 180 } });
  const nameProgress = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 100 } });
  const titleProgress = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 100 } });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 480]);
  const nameY = interpolate(nameProgress, [0, 1], [20, 0]);
  const nameOpacity = interpolate(nameProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleProgress, [0, 1], [-20, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 90,
        paddingLeft: 100,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
            fontSize: 42,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          Jane Smith
        </div>
        <div style={{ height: 3, width: lineWidth, background: "#f59e0b", borderRadius: 2 }} />
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            fontSize: 18,
            color: "#fcd34d",
            fontFamily: "sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Chief Executive Officer
        </div>
      </div>
    </AbsoluteFill>
  );
};