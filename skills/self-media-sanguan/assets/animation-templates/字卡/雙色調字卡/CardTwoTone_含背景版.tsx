import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export const CardTwoTone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-700, 0]);
  const textOpacity = interpolate(textProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f0e1a 100%)",
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px)`,
          display: "flex",
          alignItems: "stretch",
          height: 90,
        }}
      >
        {/* 左側強調色塊 */}
        <div
          style={{
            width: 80,
            background: "#f97316",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ width: 32, height: 3, background: "rgba(255,255,255,0.9)" }} />
          <div style={{ width: 24, height: 3, background: "rgba(255,255,255,0.6)" }} />
          <div style={{ width: 32, height: 3, background: "rgba(255,255,255,0.9)" }} />
        </div>
        {/* 右側深色主內容 */}
        <div
          style={{
            background: "#1e1b4b",
            paddingLeft: 24,
            paddingRight: 52,
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
              lineHeight: 1.15,
            }}
          >
            Jane Smith
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fb923c",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Creative Director
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};