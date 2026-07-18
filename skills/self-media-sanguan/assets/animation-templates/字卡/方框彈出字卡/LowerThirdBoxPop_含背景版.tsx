import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const LowerThirdBoxPop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.8 } });
  const nameProgress = spring({ frame: frame - 8, fps, config: { damping: 25, stiffness: 100 } });
  const titleProgress = spring({ frame: frame - 18, fps, config: { damping: 25, stiffness: 100 } });

  const boxScale = interpolate(boxProgress, [0, 1], [0, 1]);
  const nameOpacity = interpolate(nameProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(titleProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0533 0%, #0f0a1a 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 85,
        paddingLeft: 90,
      }}
    >
      <div style={{ transform: `scale(${boxScale})`, transformOrigin: "left bottom" }}>
        <div
          style={{
            background: "#7c3aed",
            paddingLeft: 24,
            paddingRight: 36,
            paddingTop: 14,
            paddingBottom: 14,
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <div style={{ opacity: nameOpacity, fontSize: 38, fontWeight: 700, color: "#ffffff", fontFamily: "sans-serif", lineHeight: 1.15 }}>
            Alex Chen
          </div>
          <div style={{ opacity: titleOpacity, fontSize: 18, color: "#ddd6fe", fontFamily: "sans-serif", marginTop: 3 }}>
            Lead Engineer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};