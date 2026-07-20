import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const SUBTITLES = [
  { speaker: "旁白", text: "在這個故事開始之前", start: 15, end: 65 },
  { speaker: "林小雨", text: "我從來不相信命運的安排", start: 80, end: 130 },
  { speaker: "旁白", text: "直到那個雨夜，他們相遇了", start: 145, end: 195 },
  { speaker: "陳明宇", text: "有些相遇，是一輩子的緣分", start: 210, end: 260 },
];

export const SubtitleCinematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const LETTERBOX-HEIGHT = 135; // 2.39:1 CinemaScope 黑邊高度

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        width,
        height,
      }}
    >
      {/* 電影畫面區域 */}
      <div
        style={{
          position: "absolute",
          top: LETTERBOX-HEIGHT,
          left: 0,
          right: 0,
          bottom: LETTERBOX-HEIGHT,
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          overflow: "hidden",
        }}
      >
        {/* 場景氛圍光 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 60%, rgba(100,149,237,0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* 上方電影黑邊 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: LETTERBOX-HEIGHT,
          background: "#000",
          zIndex: 10,
        }}
      />

      {/* 下方電影黑邊 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: LETTERBOX-HEIGHT,
          background: "#000",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {SUBTITLES.map((sub, i) => {
          const fadeIn = interpolate(frame, [sub.start, sub.start + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(frame, [sub.end - 15, sub.end], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = Math.min(fadeIn, fadeOut);

          if (opacity <= 0) return null;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity,
              }}
            >
              {/* 說話者名稱 */}
              <div
                style={{
                  fontSize: 22,
                  fontStyle: "italic",
                  color: "#a0aec0",
                  fontFamily: "serif",
                  marginBottom: 6,
                  letterSpacing: 3,
                }}
              >
                {sub.speaker}
              </div>
              {/* 字幕主文字 */}
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 400,
                  color: "#ffffff",
                  fontFamily: "serif",
                  letterSpacing: 4,
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                {sub.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};