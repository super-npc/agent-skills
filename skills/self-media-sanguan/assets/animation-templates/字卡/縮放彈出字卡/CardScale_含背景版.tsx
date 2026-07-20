import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const CardScale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });
  const textProgress = spring({ frame: frame - 8, fps, config: { damping: 25, stiffness: 110 } });

  const scale = interpolate(scaleProgress, [0, 1], [0, 1]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a1a0a 0%, #0f1a0f 100%)",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "stretch",
          height: 90,
        }}
      >
        <div
          style={{
            background: "rgba(5, 46, 22, 0.95)",
            paddingLeft: 40,
            paddingRight: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
            }}
          >
            Liam Park
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#86efac",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Full-Stack Developer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};