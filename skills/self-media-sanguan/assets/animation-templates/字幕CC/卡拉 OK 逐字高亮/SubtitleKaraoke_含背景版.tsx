import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const LYRICS = "月亮代表我的心";
const TOTAL-FRAMES = 210;
// 每個字的高亮起始幀（共 7 個字）
const CHAR-HIGHLIGHT-START = [15, 40, 65, 90, 115, 140, 165];
const HIGHLIGHT-DURATION = 28;

export const SubtitleKaraoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 整體進度（0~1）用於進度條
  const progress = Math.min(
    Math.max(0, (frame - 10) / (TOTAL-FRAMES - 30)),
    1
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0d0d1a 0%, #1a0a2e 100%)",
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 背景光暈 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(250,204,21,0.08) 0%, transparent 65%)",
        }}
      />

      {/* 標題 */}
      <div
        style={{
          fontSize: 28,
          color: "#9ca3af",
          fontFamily: "sans-serif",
          letterSpacing: 6,
          marginBottom: 60,
        }}
      >
        月亮代表我的心
      </div>

      {/* 歌詞區 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          marginBottom: 80,
        }}
      >
        {LYRICS.split("").map((char, i) => {
          const highlightStart = CHAR-HIGHLIGHT-START[i] ?? 999;
          const charProgress = interpolate(
            frame,
            [highlightStart, highlightStart + HIGHLIGHT-DURATION],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const isHighlighted = frame >= highlightStart;

          // 從灰色到亮黃色
          const r = Math.round(interpolate(charProgress, [0, 1], [156, 250]));
          const g = Math.round(interpolate(charProgress, [0, 1], [163, 204]));
          const b = Math.round(interpolate(charProgress, [0, 1], [175, 21]));
          const color = isHighlighted
            ? `rgb(${r},${g},${b})`
            : "#4b5563";

          const scale = isHighlighted
            ? 1 + interpolate(charProgress, [0, 0.5, 1], [0, 0.12, 0])
            : 1;

          return (
            <div
              key={i}
              style={{
                fontSize: 88,
                fontWeight: 700,
                color,
                fontFamily: "sans-serif",
                transform: `scale(${scale})`,
                textShadow: isHighlighted
                  ? "0 0 24px rgba(250,204,21,0.6)"
                  : "none",
                transition: "none",
              }}
            >
              {char}
            </div>
          );
        })}
      </div>

      {/* 進度條容器 */}
      <div
        style={{
          width: 640,
          height: 6,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #facc15, #f97316)",
            borderRadius: 3,
          }}
        />
      </div>

      {/* 音符裝飾 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 180,
          fontSize: 40,
          color: "rgba(250,204,21,0.2)",
        }}
      >
        ♪
      </div>
      <div
        style={{
          position: "absolute",
          top: 160,
          right: 200,
          fontSize: 52,
          color: "rgba(250,204,21,0.15)",
        }}
      >
        ♫
      </div>
    </AbsoluteFill>
  );
};