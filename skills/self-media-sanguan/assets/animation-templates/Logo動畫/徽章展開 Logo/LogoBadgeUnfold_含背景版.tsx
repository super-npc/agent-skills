import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoBadgeUnfold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-30：整個徽章從 scale(0) spring 彈出
  const badgeScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 180 },
    durationInFrames: 30,
  });

  // frame 20-70：外圈環形描邊（strokeDashoffset 從全長→0）
  const circleCircumference = 2 * Math.PI * 130; // r=130
  const strokeDashoffset = interpolate(frame, [20, 70], [circleCircumference, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 50-80：徽章內「AC」大字 scale(0)→scale(1)
  const abbrevScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 20, stiffness: 220 },
    durationInFrames: 30,
  });

  // frame 80-110：品牌全名水平展開（clip-path）
  const clipRight = interpolate(frame, [80, 110], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 100-120：年份淡入 + 字距拉開
  const yearOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yearLetterSpacing = interpolate(frame, [100, 120], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* 徽章主體 */}
      <div
        style={{
          position: "relative",
          width: 280,
          height: 280,
          transform: `scale(${badgeScale})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 外圈 SVG */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* 徽章底圓 */}
          <circle cx="140" cy="140" r="130" fill="#1e3a5f" />
          {/* 裝飾性內圈（靜態） */}
          <circle
            cx="140"
            cy="140"
            r="118"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            opacity="0.4"
          />
          {/* 動態外圈描邊 */}
          <circle
            cx="140"
            cy="140"
            r="130"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 140 140)"
          />
        </svg>

        {/* 品牌縮寫「AC」 */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            transform: `scale(${abbrevScale})`,
            fontSize: 100,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          AC
        </div>
      </div>

      {/* 品牌全名 */}
      <div
        style={{
          marginTop: 32,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#f59e0b",
            fontFamily: "sans-serif",
            letterSpacing: "0.2em",
            whiteSpace: "nowrap",
            clipPath: `inset(0 ${clipRight}% 0 0)`,
          }}
        >
          ACME CORP
        </div>
      </div>

      {/* 年份 */}
      <div
        style={{
          marginTop: 12,
          opacity: yearOpacity,
          fontSize: 16,
          fontWeight: 400,
          color: "#6b7280",
          fontFamily: "sans-serif",
          letterSpacing: `${yearLetterSpacing}px`,
          whiteSpace: "nowrap",
        }}
      >
        EST. 2024
      </div>
    </AbsoluteFill>
  );
};