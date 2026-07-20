import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const credits = [
  { role: "製作人 Producer", name: "張小明" },
  { role: "導演 Director", name: "李美麗" },
  { role: "攝影 Cinematographer", name: "王大偉" },
  { role: "剪輯 Editor", name: "陳志強" },
  { role: "音樂 Music", name: "林雅婷" },
];

export const CreditsRollOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // translateY 從 1080 → -800，在整個 210 frames 內線性移動
  const translateY = interpolate(frame, [0, durationInFrames], [1080, -800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 左側細線裝飾 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: -320,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {/* 右側細線裝飾 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: 320,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.12)",
        }}
      />

      {/* 捲動文字區塊 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {credits.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: "#888888",
                fontFamily: "sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {item.role}
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#ffffff",
                fontFamily: "sans-serif",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              {item.name}
            </div>
          </div>
        ))}

        {/* 分隔線 */}
        <div
          style={{
            width: 120,
            height: 1,
            background: "rgba(255,255,255,0.25)",
            margin: "20px 0 40px",
          }}
        />

        {/* 感謝觀看 */}
        <div
          style={{
            fontSize: 28,
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: 12,
          }}
        >
          感謝觀看
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#888888",
            fontFamily: "sans-serif",
            letterSpacing: "3px",
          }}
        >
          Thank you for watching
        </div>
      </div>
    </AbsoluteFill>
  );
};