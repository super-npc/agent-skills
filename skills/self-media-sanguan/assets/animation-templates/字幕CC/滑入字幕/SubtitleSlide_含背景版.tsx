import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const SUBTITLES = [
  { text: "大家好，今天來介紹 Remotion 框架", start: 10, end: 60, color: "#60a5fa" },
  { text: "它讓你用 React 寫出動態影片", start: 70, end: 120, color: "#34d399" },
  { text: "支援 TypeScript，開發體驗極佳", start: 130, end: 180, color: "#f59e0b" },
  { text: "快來加入繁體中文社群一起學習！", start: 190, end: 240, color: "#f472b6" },
];

export const SubtitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#111827",
        width,
        height,
      }}
    >
      {/* 背景網格 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {SUBTITLES.map((sub, i) => {
        const isVisible = frame >= sub.start && frame <= sub.end;
        const slideIn = spring({
          frame: frame - sub.start,
          fps,
          config: { damping: 20, stiffness: 120 },
        });
        const slideOut = spring({
          frame: frame - (sub.end - 18),
          fps,
          config: { damping: 20, stiffness: 180 },
        });

        const yIn = interpolate(slideIn, [0, 1], [80, 0]);
        const xOut = interpolate(slideOut, [0, 1], [0, 200]);
        const opacityOut = interpolate(slideOut, [0, 0.6], [1, 0], {
          extrapolateRight: "clamp",
        });

        if (!isVisible && frame > sub.end) return null;
        if (frame < sub.start) return null;

        const y = frame >= sub.end - 18 ? 0 : yIn;
        const opacity = frame >= sub.end - 18 ? opacityOut : 1;
        const x = frame >= sub.end - 18 ? xOut : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 110,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "flex-start",
              paddingLeft: 120,
              transform: `translateY(${y}px) translateX(${x}px)`,
              opacity,
            }}
          >
            {/* 左側顏色邊線 */}
            <div
              style={{
                width: 6,
                borderRadius: 3,
                background: sub.color,
                marginRight: 24,
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            />
            <div
              style={{
                background: "rgba(17,24,39,0.88)",
                borderRadius: 8,
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 32,
                paddingRight: 48,
                backdropFilter: "blur(8px)",
                border: `1px solid ${sub.color}33`,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 600,
                  color: "#f1f5f9",
                  fontFamily: "sans-serif",
                  letterSpacing: 1.5,
                }}
              >
                {sub.text}
              </span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};