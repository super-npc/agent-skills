import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const NewsBroadcastIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 頂部頻道名稱 frame 5-25 fade in
  const channelOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 中央主標題 frame 20-55 從右側滑入 + opacity
  const titleSpring = spring({ frame: frame - 20, fps, config: { damping: 22, stiffness: 100 } });
  const titleX = interpolate(titleSpring, [0, 1], [200, 0]);
  const titleOpacity = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 中央副標題 frame 50-80 fade in
  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 底部跑馬燈條 frame 60 滑入（translateY 52→0）
  const tickerSpring = spring({ frame: frame - 60, fps, config: { damping: 22, stiffness: 120 } });
  const tickerY = interpolate(tickerSpring, [0, 1], [52, 0]);

  // 跑馬燈文字：frame 60-150 線性移動 translateX 1920→-3000
  const tickerX = interpolate(frame, [60, 150], [1920, -3000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* 頂部紅色橫條（全寬，高 8px） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 8,
          background: "#dc2626",
          zIndex: 10,
        }}
      />

      {/* 頂部頻道名稱 */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          width: 1920,
          textAlign: "center",
          opacity: channelOpacity,
          fontSize: 24,
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "6px",
          textTransform: "uppercase",
        }}
      >
        NEWS CHANNEL
      </div>

      {/* 中央主標題 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "2px",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Breaking News
        </div>

        {/* 中央副標題 */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 28,
            color: "#fbbf24",
            letterSpacing: "2px",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          今日頭條 ● LIVE
        </div>
      </div>

      {/* 底部跑馬燈條 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 52,
          background: "#dc2626",
          transform: `translateY(${tickerY}px)`,
          overflow: "hidden",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            whiteSpace: "nowrap",
            transform: `translateX(${tickerX}px)`,
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "2px",
          }}
        >
          BREAKING NEWS ● 重大新聞 ● BREAKING NEWS ● 重大新聞 ● BREAKING NEWS ● 重大新聞 ● BREAKING NEWS ● 重大新聞 ●
        </div>
      </div>
    </AbsoluteFill>
  );
};