import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TITLE-TEXT = "YOUR CHANNEL NAME";

export const TypewriterIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 每 4 frames 打出一個字元
  const charsToShow = Math.min(Math.floor(frame / 4), TITLE-TEXT.length);
  const displayText = TITLE-TEXT.slice(0, charsToShow);

  // 游標每 15 frames 切換顯示/隱藏
  const showCursor = Math.floor(frame / 15) % 2 === 0;

  // 副標題：frame 100-130 fade in（用 spring）
  const subtitleSpring = spring({
    frame: frame - 100,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* 主標題打字區域 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 90,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "monospace",
          letterSpacing: "4px",
          lineHeight: 1,
        }}
      >
        <span>{displayText}</span>
        {/* 游標 */}
        <span
          style={{
            opacity: showCursor ? 1 : 0,
            color: "#ffffff",
            marginLeft: 2,
          }}
        >
          |
        </span>
      </div>

      {/* 副標題 */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 22,
          color: "#888888",
          fontFamily: "monospace",
          letterSpacing: "6px",
          marginTop: 32,
          textTransform: "uppercase",
        }}
      >
        SUBSCRIBE &amp; STAY TUNED
      </div>
    </AbsoluteFill>
  );
};