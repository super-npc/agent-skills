import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoMinimalDot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-30：中央小圓點 scale(0)→scale(1) spring
  const dotInitScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 30,
  });

  // frame 25-60：圓點直徑從 12→120px（spring，輕微 overshoot）
  const dotExpandScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 160 },
    durationInFrames: 35,
  });

  // 圓點當前直徑
  const dotDiameter = interpolate(dotExpandScale, [0, 1], [12, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 最終視覺直徑（phase 1 先把點縮放出來，phase 2 再展開）
  const currentDiameter = frame < 25 ? 12 * dotInitScale : dotDiameter;

  // frame 55-80：icon 內部斜線 opacity 0→1
  const iconLineOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 70-95：品牌名「Dot Studio」淡入 + translateX
  const brandOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandX = interpolate(frame, [70, 95], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 88-108：品牌名下方細橫線展開（clip-path）
  const lineClip = interpolate(frame, [88, 108], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 102-120：tagline 淡入
  const taglineOpacity = interpolate(frame, [102, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 水平排列：icon 在左，文字在右
  const iconCenterX = 960 - 160;
  const iconCenterY = 540;

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 左側 icon 圓形 */}
      <div
        style={{
          position: "absolute",
          left: iconCenterX - currentDiameter / 2,
          top: iconCenterY - currentDiameter / 2,
          width: currentDiameter,
          height: currentDiameter,
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* 內部抽象「進展」符號：斜線從左下到右上 */}
        <svg
          width={currentDiameter}
          height={currentDiameter}
          viewBox="0 0 120 120"
          style={{ opacity: iconLineOpacity }}
        >
          {/* 左下到右上斜線 */}
          <line
            x1="28"
            y1="88"
            x2="92"
            y2="32"
            stroke="#0f0f0f"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* 右上端箭頭（短横線） */}
          <line
            x1="92"
            y1="32"
            x2="72"
            y2="30"
            stroke="#0f0f0f"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="92"
            y1="32"
            x2="90"
            y2="52"
            stroke="#0f0f0f"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 右側文字區 */}
      <div
        style={{
          position: "absolute",
          left: iconCenterX + 72,
          top: iconCenterY - 50,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* 品牌名 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 300,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            opacity: brandOpacity,
            transform: `translateX(${brandX}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Dot Studio
        </div>

        {/* 細橫線 */}
        <div
          style={{
            height: 1,
            background: "#ffffff",
            marginTop: 10,
            clipPath: `inset(0 ${lineClip}% 0 0)`,
            width: 260,
          }}
        />

        {/* tagline */}
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: 400,
            color: "#6b7280",
            fontFamily: "sans-serif",
            letterSpacing: "6px",
            opacity: taglineOpacity,
            whiteSpace: "nowrap",
          }}
        >
          Less. Better.
        </div>
      </div>
    </AbsoluteFill>
  );
};