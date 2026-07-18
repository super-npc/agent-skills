import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const LogoMorphIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // frame 0-30：圓形從 scale(0) → scale(1) 出現
  const shapeScale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 30-70：border-radius 從 50% → 12px，顏色從白 → #3b82f6
  const morphProgress = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const borderRadius = interpolate(morphProgress, [0, 1], [50, 12]);
  // 顏色插值：白(255,255,255) → 藍(59,130,246)
  const r = Math.round(interpolate(morphProgress, [0, 1], [255, 59]));
  const g = Math.round(interpolate(morphProgress, [0, 1], [255, 130]));
  const b = Math.round(interpolate(morphProgress, [0, 1], [255, 246]));
  const shapeColor = `rgb(${r}, ${g}, ${b})`;

  // frame 70-100：縮寫文字 fade in
  const abbrevOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 100-130：品牌全名從右側滑入
  const brandX = interpolate(frame, [100, 130], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 120：副標題淡入
  const taglineOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Logo 方塊 + 品牌名稱 並排 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* 幾何形狀（圓形 → 圓角方形） */}
        <div
          style={{
            position: "relative",
            width: 120,
            height: 120,
            transform: `scale(${shapeScale})`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: `${borderRadius}%`,
              background: shapeColor,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 品牌縮寫 */}
            <span
              style={{
                opacity: abbrevOpacity,
                fontSize: 48,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "sans-serif",
                letterSpacing: "-0.02em",
                userSelect: "none",
              }}
            >
              RC
            </span>
          </div>
        </div>

        {/* 品牌名稱區塊 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            transform: `translateX(${brandX}px)`,
            opacity: brandOpacity,
          }}
        >
          {/* 品牌全名 */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            Remotion Community
          </div>

          {/* 副標題 */}
          <div
            style={{
              opacity: taglineOpacity,
              fontSize: 18,
              fontWeight: 400,
              color: "#64748b",
              fontFamily: "sans-serif",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            繁體中文社群入口網站
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};