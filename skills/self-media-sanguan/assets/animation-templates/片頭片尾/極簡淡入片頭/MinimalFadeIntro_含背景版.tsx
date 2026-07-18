import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const MinimalFadeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Logo 文字：frame 10-30 淡入
  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 主標題：frame 40-70 從下方滑入 + 淡入
  const titleOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [40, 70], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 細線：frame 70-90 scale 0→1
  const lineScale = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副標題：frame 90-120 淡入
  const subtitleOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Logo 文字 */}
      <div
        style={{
          opacity: logoOpacity,
          fontSize: 14,
          color: "#ffffff",
          letterSpacing: "0.5em",
          fontFamily: "sans-serif",
          fontWeight: 400,
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        YOUR LOGO
      </div>

      {/* 主標題 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          color: "#ffffff",
          fontFamily: "sans-serif",
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        Main Title Here
      </div>

      {/* 細線分隔 */}
      <div
        style={{
          width: 80,
          height: 1,
          background: "#ffffff",
          marginTop: 28,
          marginBottom: 28,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "center",
        }}
      />

      {/* 副標題 */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 24,
          color: "#888888",
          fontFamily: "sans-serif",
          fontWeight: 400,
          letterSpacing: "0.05em",
          textAlign: "center",
        }}
      >
        Subtitle goes here
      </div>
    </AbsoluteFill>
  );
};