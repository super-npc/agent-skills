import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const LogoLineDraw: React.FC = () => {
  const frame = useCurrentFrame();

  // frame 0-60：六邊形描邊動畫，strokeDashoffset 從 780→0
  const strokeOffset = interpolate(frame, [0, 60], [780, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 55-90：fillOpacity 0→0.85（品牌色 #3b82f6）
  const hexFillOpacity = interpolate(frame, [55, 90], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 60-90：六邊形內部白色三角形 opacity 0→1
  const triangleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 90-115：品牌名展開，clip-path inset(0 100% 0 0)→inset(0 0% 0 0)
  const clipRight = interpolate(frame, [90, 115], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 110-130：副標語淡入
  const taglineOpacity = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* SVG 六邊形 */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 六邊形 */}
        <polygon
          points="960,310 1073,375 1073,505 960,570 847,505 847,375"
          stroke="white"
          strokeWidth="3"
          fill="#3b82f6"
          fillOpacity={hexFillOpacity}
          strokeDasharray="780"
          strokeDashoffset={strokeOffset}
        />

        {/* 內部白色正三角形（中心 960,440，高約 70px） */}
        <polygon
          points="960,400 993,458 927,458"
          fill="white"
          opacity={triangleOpacity}
        />
      </svg>

      {/* 品牌名稱與副標語（絕對定位，置中） */}
      <div
        style={{
          position: "absolute",
          top: 590,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 品牌名展開 */}
        <div
          style={{
            width: 400,
            overflow: "hidden",
            clipPath: `inset(0 ${clipRight}% 0 0)`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Hexagon Labs
          </div>
        </div>

        {/* 副標語淡入 */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#6b7280",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
            opacity: taglineOpacity,
            whiteSpace: "nowrap",
          }}
        >
          Precision Engineered.
        </div>
      </div>
    </AbsoluteFill>
  );
};