import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SplitScreenIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 左格從左外側滑入：frame 0-40，spring damping 22 stiffness 120
  const leftSpring = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const leftX = interpolate(leftSpring, [0, 1], [-960, 0]);

  // 右格從右外側滑入：frame 0-40，同 spring
  const rightSpring = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const rightX = interpolate(rightSpring, [0, 1], [960, 0]);

  // 分隔線 frame 90 消失
  const dividerOpacity = interpolate(frame, [85, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 左格副標題 frame 30 fade in
  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右格主標題 frame 45 從下方滑入
  const titleSpring = spring({ frame: frame - 45, fps, config: { damping: 22, stiffness: 120 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 100：右格下方副標題淡入
  const bottomSubtitleOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        overflow: "hidden",
      }}
    >
      {/* 左格 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 960,
          height: 1080,
          background: "#1e293b",
          transform: `translateX(${leftX}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 28,
            color: "#94a3b8",
            fontFamily: "sans-serif",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Subtitle Text
        </div>
      </div>

      {/* 右格 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 960,
          width: 960,
          height: 1080,
          background: "#0f172a",
          transform: `translateX(${rightX}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          overflow: "hidden",
        }}
      >
        {/* 主標題 */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Main Title
        </div>

        {/* 右格下方副標題 */}
        <div
          style={{
            opacity: bottomSubtitleOpacity,
            fontSize: 24,
            color: "#94a3b8",
            fontFamily: "sans-serif",
            textAlign: "center",
            fontWeight: 300,
            letterSpacing: "2px",
          }}
        >
          Additional Subtitle
        </div>
      </div>

      {/* 中間分隔線（4px 亮線） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 958,
          width: 4,
          height: 1080,
          background: "#3b82f6",
          opacity: dividerOpacity,
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};