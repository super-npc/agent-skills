import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 時間軸
const TITLE-IN        = 10;  // 「繼續觀看」淡入
const LEFT-CARD-IN    = 20;  // 左影片框滑入
const RIGHT-CARD-IN   = 30;  // 右影片框滑入
const AVATAR-IN       = 60;  // 頻道頭像彈出
const SUB-BTN-IN      = 80;  // 訂閱按鈕彈入

export const EndScreenOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── 標題 fade in ──
  const titleOpacity = interpolate(frame, [TITLE-IN, TITLE-IN + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 左影片框：從左滑入 ──
  const leftSpring = spring({
    frame: frame - LEFT-CARD-IN,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const leftX = interpolate(leftSpring, [0, 1], [-100, 0]);
  const leftOpacity = interpolate(leftSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── 右影片框：從右滑入 ──
  const rightSpring = spring({
    frame: frame - RIGHT-CARD-IN,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const rightX = interpolate(rightSpring, [0, 1], [100, 0]);
  const rightOpacity = interpolate(rightSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── 頻道頭像：scale 0→1 彈出 ──
  const avatarSpring = spring({
    frame: frame - AVATAR-IN,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 訂閱按鈕：彈入 ──
  const subSpring = spring({
    frame: frame - SUB-BTN-IN,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const subScale = interpolate(subSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* 頂部標題 */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 32,
          color: "#ffffff",
          letterSpacing: "4px",
          fontWeight: 600,
          marginBottom: 48,
        }}
      >
        繼續觀看
      </div>

      {/* 影片佔位框區域 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 40,
          marginBottom: 60,
        }}
      >
        {/* 左影片框 */}
        <div
          style={{
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
            width: 480,
            height: 270,
            borderRadius: 12,
            background: "#272727",
            border: "1px solid #404040",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* 縮圖佔位（上半部） */}
          <div
            style={{
              width: "100%",
              height: 180,
              background: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 縮圖紋理 */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #1f1f1f 25%, #252525 75%)",
              }}
            />
          </div>

          {/* 右上角 play 按鈕 */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: 16, marginLeft: 3 }}>▶</span>
          </div>

          {/* 下半部文字 */}
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                height: 16,
                width: "70%",
                borderRadius: 4,
                background: "#404040",
              }}
            />
            <div
              style={{
                height: 12,
                width: "40%",
                borderRadius: 4,
                background: "#333333",
              }}
            />
          </div>
        </div>

        {/* 右影片框 */}
        <div
          style={{
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
            width: 480,
            height: 270,
            borderRadius: 12,
            background: "#272727",
            border: "1px solid #404040",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* 縮圖佔位（上半部） */}
          <div
            style={{
              width: "100%",
              height: 180,
              background: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #1f2a1f 25%, #1f251f 75%)",
              }}
            />
          </div>

          {/* 右上角 play 按鈕 */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: 16, marginLeft: 3 }}>▶</span>
          </div>

          {/* 下半部文字 */}
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                height: 16,
                width: "60%",
                borderRadius: 4,
                background: "#404040",
              }}
            />
            <div
              style={{
                height: 12,
                width: "35%",
                borderRadius: 4,
                background: "#333333",
              }}
            />
          </div>
        </div>
      </div>

      {/* 底部：頻道頭像 + 訂閱按鈕 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* 頻道頭像圓形 */}
        <div
          style={{
            transform: `scale(${avatarScale})`,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#ff0000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 48, color: "#ffffff" }}>▶</span>
        </div>

        {/* 訂閱按鈕 */}
        <div
          style={{
            transform: `scale(${subScale})`,
            background: "#ff0000",
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 22,
            borderRadius: 40,
            padding: "16px 40px",
            whiteSpace: "nowrap",
            letterSpacing: "1px",
          }}
        >
          訂閱頻道
        </div>
      </div>
    </AbsoluteFill>
  );
};