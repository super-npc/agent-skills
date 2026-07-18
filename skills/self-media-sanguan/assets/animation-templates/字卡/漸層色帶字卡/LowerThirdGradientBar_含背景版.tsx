import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const LowerThirdGradientBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 22, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [60, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ transform: `translateY(${y}px)`, opacity, width: "100%", paddingBottom: 60 }}>
        <div
          style={{
            background: "linear-gradient(90deg, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.18) 100%)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingLeft: 100,
            paddingRight: 100,
            paddingTop: 20,
            paddingBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 4,
              height: 58,
              background: "linear-gradient(180deg, #06b6d4, #8b5cf6)",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, color: "#ffffff", fontFamily: "sans-serif", lineHeight: 1.1 }}>
              Maria Torres
            </div>
            <div style={{ fontSize: 18, color: "#a5f3fc", fontFamily: "sans-serif", marginTop: 3, letterSpacing: "0.04em" }}>
              Head of Innovation
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};