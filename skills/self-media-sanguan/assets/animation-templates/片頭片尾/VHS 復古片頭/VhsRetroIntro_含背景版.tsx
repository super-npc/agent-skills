import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

function frameToTimecode(frame: number, fps: number): string {
  const totalSeconds = Math.floor(frame / fps);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const frames = frame % fps;
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export const VhsRetroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 畫面水平抖動
  const jitterX = frame % 7 === 0 ? 3 : frame % 7 === 1 ? -2 : 0;

  // REC 指示：frame 0-15 fade in，然後每 20 frames 閃爍
  const recFadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recBlink = Math.floor(frame / 20) % 2 === 0 ? 1 : 0;
  const recOpacity = frame < 15 ? recFadeIn : recBlink;

  // 主標題：frame 30-60 fade in（用 spring）
  const titleSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副標題：frame 80-110 fade in
  const subtitleOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 底部 PLAY：frame 120 fade in
  const playOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timecode = frameToTimecode(frame, fps);

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* 主要內容（含水平抖動） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${jitterX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 主標題（RGB 色差三層） */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* 紅色偏移層 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: titleOpacity * 0.6,
              fontSize: 80,
              fontWeight: 700,
              color: "#ff0000",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transform: "translate(-4px, 2px)",
              mixBlendMode: "screen",
            }}
          >
            YOUR CHANNEL
          </div>
          {/* 藍色偏移層 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: titleOpacity * 0.6,
              fontSize: 80,
              fontWeight: 700,
              color: "#0000ff",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transform: "translate(4px, -2px)",
              mixBlendMode: "screen",
            }}
          >
            YOUR CHANNEL
          </div>
          {/* 主白色層 */}
          <div
            style={{
              position: "relative",
              opacity: titleOpacity,
              fontSize: 80,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            YOUR CHANNEL
          </div>
        </div>

        {/* 副標題 */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 28,
            color: "#aaaaaa",
            fontFamily: "sans-serif",
            fontWeight: 400,
            letterSpacing: "0.1em",
            marginTop: 24,
            textTransform: "uppercase",
          }}
        >
          Est. 2024 · Video Production
        </div>

        {/* 底部 PLAY */}
        <div
          style={{
            opacity: playOpacity,
            fontSize: 20,
            color: "#ffffff",
            fontFamily: "monospace",
            letterSpacing: "4px",
            marginTop: 60,
            textTransform: "uppercase",
          }}
        >
          PLAY ▶
        </div>
      </div>

      {/* 掃描線層（覆蓋全畫面，不受抖動影響） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* HUD 層（REC + 時間碼，不受抖動影響） */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 48,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: recOpacity,
        }}
      >
        {/* 紅點 */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#ff2222",
            boxShadow: "0 0 8px #ff2222",
          }}
        />
        {/* REC 文字 */}
        <span
          style={{
            fontSize: 24,
            color: "#ffffff",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          REC
        </span>
      </div>

      {/* 左上角時間碼 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 48,
          fontSize: 22,
          color: "#ffffff",
          fontFamily: "monospace",
          letterSpacing: "2px",
          opacity: 0.85,
        }}
      >
        {timecode}
      </div>
    </AbsoluteFill>
  );
};