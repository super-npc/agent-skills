import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BAR-HEIGHT = 216; // 畫面的 20%（1080 * 0.2 = 216px）

export const CinematicBarsIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // 上方黑邊：frame 0-40 translateY(-216) → 0（收合進來）
  const topBarY = interpolate(frame, [0, 40], [-BAR-HEIGHT, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 下方黑邊：frame 0-40 translateY(216) → 0（收合進來）
  const bottomBarY = interpolate(frame, [0, 40], [BAR-HEIGHT, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 150-180：黑邊再次展開（退場）
  const topBarExitY = interpolate(frame, [150, 180], [0, -BAR-HEIGHT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomBarExitY = interpolate(frame, [150, 180], [0, BAR-HEIGHT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalTopY = frame < 150 ? topBarY : topBarExitY;
  const finalBottomY = frame < 150 ? bottomBarY : bottomBarExitY;

  // 主標題：frame 50-90 淡入
  const titleOpacity = interpolate(frame, [50, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副標題：frame 100-130 淡入
  const subtitleOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #111111 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 內容區域（在黑邊之間顯示） */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          zIndex: 1,
        }}
      >
        {/* 主標題 */}
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          Cinematic Title
        </div>

        {/* 副標題 */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 28,
            fontWeight: 300,
            color: "#aaaaaa",
            fontFamily: "sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          A Film by Your Name
        </div>
      </div>

      {/* 上方黑邊 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: BAR-HEIGHT,
          background: "black",
          transform: `translateY(${finalTopY}px)`,
          zIndex: 10,
        }}
      />

      {/* 下方黑邊 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: BAR-HEIGHT,
          background: "black",
          transform: `translateY(${finalBottomY}px)`,
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};