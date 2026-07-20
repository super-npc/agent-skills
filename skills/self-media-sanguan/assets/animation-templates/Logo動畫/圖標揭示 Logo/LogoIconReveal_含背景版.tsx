import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoIconReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-25：圖標區塊從 scale(0) spring 彈入
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 25,
  });

  // frame 25-50：SVG 路徑描繪（stroke-dashoffset）
  const pathProgress = interpolate(frame, [25, 50], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 50-80：品牌名稱從右側滑入
  const brandX = interpolate(frame, [50, 80], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 75-100：副標語淡入
  const taglineOpacity = interpolate(frame, [75, 100], [0, 1], {
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
      {/* 圖標 + 文字水平並排 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 圖標區塊 */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* 閃電形 SVG 符號 */}
          <svg
            width="40"
            height="44"
            viewBox="0 0 40 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 2L6 26H20L16 42L34 18H20L24 2Z"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset={pathProgress}
            />
          </svg>
        </div>

        {/* 文字區塊 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            transform: `translateX(${brandX}px)`,
            opacity: brandOpacity,
          }}
        >
          {/* 品牌名稱 */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            Acme Studio
          </div>

          {/* 副標語 */}
          <div
            style={{
              opacity: taglineOpacity,
              fontSize: 20,
              fontWeight: 400,
              color: "#6b7280",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            Design · Build · Launch
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};