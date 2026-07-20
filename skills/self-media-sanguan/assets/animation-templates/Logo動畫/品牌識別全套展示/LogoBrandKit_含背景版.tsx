import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoBrandKit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-30：圖標 scale 0→1 spring 彈入
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 30,
  });

  // frame 30-55：品牌全名滑入 + 淡入
  const brandX = interpolate(frame, [30, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 50-70：類別標籤淡入
  const categoryOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 65-85：分隔線從左展開
  const dividerClip = interpolate(frame, [65, 85], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 色票顏色
  const swatchColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

  // frame 80-115：4 個色票依序 scale 0→1（各差 8 幀）
  const swatchScales = swatchColors.map((_, i) => {
    const startFrame = 80 + i * 8;
    return spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: { damping: 18, stiffness: 220 },
      durationInFrames: 20,
    });
  });

  // frame 108-128：tagline 淡入
  const taglineOpacity = interpolate(frame, [108, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 整體內容寬 860px，水平居中，垂直居中 */}
      <div
        style={{
          width: 860,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
        }}
      >
        {/* 左側 Logo 圖標區 */}
        <div
          style={{
            flexShrink: 0,
            transform: `scale(${iconScale})`,
            width: 120,
            height: 120,
            borderRadius: 20,
            background: "#6366f1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            B
          </span>
        </div>

        {/* 右側品牌資訊區 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
          }}
        >
          {/* 品牌全名 */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              opacity: brandOpacity,
              transform: `translateX(${brandX}px)`,
            }}
          >
            BrandKit
          </div>

          {/* 類別標籤 */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#6366f1",
              fontFamily: "sans-serif",
              letterSpacing: "4px",
              textTransform: "uppercase",
              opacity: categoryOpacity,
            }}
          >
            Design System
          </div>

          {/* 分隔線 */}
          <div
            style={{
              width: 320,
              height: 1,
              background: "#333333",
              clipPath: `inset(0 ${dividerClip}% 0 0)`,
            }}
          />

          {/* 4 個色票 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {swatchColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  background: color,
                  transform: `scale(${swatchScales[i]})`,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* tagline */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#6b7280",
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
              opacity: taglineOpacity,
              whiteSpace: "nowrap",
            }}
          >
            Build with confidence.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};