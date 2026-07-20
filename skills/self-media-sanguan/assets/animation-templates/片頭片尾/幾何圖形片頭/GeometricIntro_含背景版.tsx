import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const GeometricIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 共用 spring 設定
  const springConfig = { damping: 18, stiffness: 100 };

  // 圖形 1：左上方小方塊（40×40px，#3b82f6），從 (-200,-200) → (300, 200)，frame 0-35
  const shape1Spring = spring({ frame, fps, config: springConfig });
  const shape1X = interpolate(shape1Spring, [0, 1], [-200, 300]);
  const shape1Y = interpolate(shape1Spring, [0, 1], [-200, 200]);

  // 圖形 2：右下菱形（50×50px，#8b5cf6，rotate 45deg），從 (2200, 1000) → (1600, 750)，frame 5-40
  const shape2Spring = spring({ frame: frame - 5, fps, config: springConfig });
  const shape2X = interpolate(shape2Spring, [0, 1], [2200, 1600]);
  const shape2Y = interpolate(shape2Spring, [0, 1], [1000, 750]);

  // 圖形 3：右上圓形（60px，#f59e0b），從 (2000, -100) → (1500, 200)，frame 10-45
  const shape3Spring = spring({ frame: frame - 10, fps, config: springConfig });
  const shape3X = interpolate(shape3Spring, [0, 1], [2000, 1500]);
  const shape3Y = interpolate(shape3Spring, [0, 1], [-100, 200]);

  // 圖形 4：左下小方塊（30×30px，#10b981），從 (-100, 1200) → (350, 850)，frame 15-50
  const shape4Spring = spring({ frame: frame - 15, fps, config: springConfig });
  const shape4X = interpolate(shape4Spring, [0, 1], [-100, 350]);
  const shape4Y = interpolate(shape4Spring, [0, 1], [1200, 850]);

  // 圖形 5：左側菱形（45×45px，#ec4899，rotate 45deg），從 (-200, 500) → (200, 540)，frame 20-55
  const shape5Spring = spring({ frame: frame - 20, fps, config: springConfig });
  const shape5X = interpolate(shape5Spring, [0, 1], [-200, 200]);
  const shape5Y = interpolate(shape5Spring, [0, 1], [500, 540]);

  // 圖形 6：右側圓形（35px，#f97316），從 (2100, 500) → (1700, 540)，frame 25-60
  const shape6Spring = spring({ frame: frame - 25, fps, config: springConfig });
  const shape6X = interpolate(shape6Spring, [0, 1], [2100, 1700]);
  const shape6Y = interpolate(shape6Spring, [0, 1], [500, 540]);

  // 主標題 frame 55-85 縮放進場（scale 0.8→1 + opacity 0→1）
  const titleSpring = spring({ frame: frame - 55, fps, config: { damping: 18, stiffness: 100 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);
  const titleOpacity = interpolate(frame, [55, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副標題 frame 80-110 fade in
  const subtitleOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* 圖形 1：左上方小方塊 */}
      <div
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          background: "#3b82f6",
          left: shape1X,
          top: shape1Y,
        }}
      />

      {/* 圖形 2：右下菱形 */}
      <div
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          background: "#8b5cf6",
          left: shape2X,
          top: shape2Y,
          transform: "rotate(45deg)",
        }}
      />

      {/* 圖形 3：右上圓形 */}
      <div
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#f59e0b",
          left: shape3X,
          top: shape3Y,
        }}
      />

      {/* 圖形 4：左下小方塊 */}
      <div
        style={{
          position: "absolute",
          width: 30,
          height: 30,
          background: "#10b981",
          left: shape4X,
          top: shape4Y,
        }}
      />

      {/* 圖形 5：左側菱形 */}
      <div
        style={{
          position: "absolute",
          width: 45,
          height: 45,
          background: "#ec4899",
          left: shape5X,
          top: shape5Y,
          transform: "rotate(45deg)",
        }}
      />

      {/* 圖形 6：右側圓形 */}
      <div
        style={{
          position: "absolute",
          width: 35,
          height: 35,
          borderRadius: "50%",
          background: "#f97316",
          left: shape6X,
          top: shape6Y,
        }}
      />

      {/* 主標題 + 副標題（置中） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontSize: 80,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Geometric Title
        </div>

        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            fontWeight: 400,
            letterSpacing: "2px",
          }}
        >
          Creative Subtitle
        </div>
      </div>
    </AbsoluteFill>
  );
};