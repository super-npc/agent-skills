import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SubscribeCtaOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 頻道名稱：frame 10-40 從下方滑入
  const channelSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 22, stiffness: 120 },
    durationInFrames: 30,
  });
  const channelY = interpolate(channelSpring, [0, 1], [80, 0]);
  const channelOpacity = interpolate(channelSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 訂閱按鈕：frame 40-70 scale 0→1 彈出
  const subscribeSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 16, stiffness: 180 },
    durationInFrames: 30,
  });
  const subscribeScale = interpolate(subscribeSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 鈴鐺搖擺：frame 70-100
  const bellProgress = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 搖擺：0→1 映射至旋轉角度（-20 → 20 → 0 的來回）
  const bellRotate = interpolate(
    Math.sin(bellProgress * Math.PI * 3),
    [-1, 1],
    [-20, 20]
  );
  const bellOpacity = interpolate(frame, [65, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 按讚圖示：frame 100-130 scale 0→1
  const likeSpring = spring({
    frame: frame - 100,
    fps,
    config: { damping: 16, stiffness: 180 },
    durationInFrames: 30,
  });
  const likeScale = interpolate(likeSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 提示文字：frame 130-160 fade in
  const hintOpacity = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 純 CSS 鈴鐺
  const Bell: React.FC = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `rotate(${bellRotate}deg)`,
        transformOrigin: "top center",
      }}
    >
      {/* 鈴鐺圓弧頂部 */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50% 50% 0 0",
          background: "#ffffff",
          position: "relative",
        }}
      />
      {/* 鈴鐺身體矩形 */}
      <div
        style={{
          width: 52,
          height: 20,
          background: "#ffffff",
          borderRadius: "0 0 6px 6px",
          marginTop: -2,
        }}
      />
      {/* 鈴鐺底部小圓 */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#ffffff",
          marginTop: -2,
        }}
      />
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* 頻道名稱 */}
      <div
        style={{
          transform: `translateY(${channelY}px)`,
          opacity: channelOpacity,
          fontSize: 72,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-1px",
          marginBottom: 48,
        }}
      >
        我的頻道名稱
      </div>

      {/* 訂閱按鈕 + 鈴鐺 + 按讚 水平排列 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 48,
        }}
      >
        {/* 訂閱按鈕 */}
        <div
          style={{
            transform: `scale(${subscribeScale})`,
            background: "#ff0000",
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 28,
            borderRadius: 4,
            padding: "16px 32px",
            letterSpacing: "1px",
          }}
        >
          訂閱
        </div>

        {/* 純 CSS 鈴鐺 */}
        <div style={{ opacity: bellOpacity }}>
          <Bell />
        </div>

        {/* 按讚圖示 */}
        <div
          style={{
            transform: `scale(${likeScale})`,
            fontSize: 56,
            lineHeight: 1,
          }}
        >
          👍
        </div>
      </div>

      {/* 提示文字 */}
      <div
        style={{
          opacity: hintOpacity,
          fontSize: 24,
          color: "#aaaaaa",
          fontFamily: "sans-serif",
          letterSpacing: "0.5px",
        }}
      >
        記得開啟通知，不錯過任何新影片！
      </div>
    </AbsoluteFill>
  );
};