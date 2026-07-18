import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const SEGMENT = 30; // 每個數字佔 30 frames
const CIRCLE-RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE-RADIUS;

const COUNT-COLORS: Record<number, string> = {
  3: "#ef4444",
  2: "#f59e0b",
  1: "#22c55e",
  0: "#3b82f6", // GO
};

export const Countdown3Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0: frame 0-29 顯示 3
  // 1: frame 30-59 顯示 2
  // 2: frame 60-89 顯示 1
  // 3: frame 90-119 顯示 GO
  const countIndex = Math.min(Math.floor(frame / SEGMENT), 3);
  const currentCount = 3 - countIndex; // 3, 2, 1, 0（GO）

  const frameInSegment = frame % SEGMENT;

  // 每個數字的進場 scale：1.2 → 1
  const scale = interpolate(frameInSegment, [0, 10], [1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 每個數字的退場 opacity：frame 25-30 淡出
  const opacity = interpolate(frameInSegment, [25, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 最後一個 GO 不退場
  const finalOpacity = countIndex === 3 ? 1 : opacity;

  // 圓環進度：在每個 30 frames 週期內從 full → 0（strokeDashoffset）
  // strokeDashoffset = CIRCUMFERENCE 時為空圓環，= 0 時為滿圓環
  const ringProgress = interpolate(frameInSegment, [0, SEGMENT - 1], [CIRCUMFERENCE, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const color = COUNT-COLORS[currentCount];
  const displayText = currentCount === 0 ? "GO!" : String(currentCount);

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
          opacity: finalOpacity,
        }}
      >
        {/* 圓環 SVG */}
        <svg
          width={300}
          height={300}
          style={{
            position: "absolute",
            transform: "rotate(-90deg)",
          }}
        >
          {/* 背景圓環（暗色） */}
          <circle
            cx={150}
            cy={150}
            r={CIRCLE-RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={6}
          />
          {/* 進度圓環 */}
          <circle
            cx={150}
            cy={150}
            r={CIRCLE-RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={ringProgress}
            strokeLinecap="round"
          />
        </svg>

        {/* 數字 / GO 文字 */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {displayText}
        </div>
      </div>
    </AbsoluteFill>
  );
};