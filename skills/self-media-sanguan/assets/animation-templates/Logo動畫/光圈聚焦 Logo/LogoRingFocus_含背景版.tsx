import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const LogoRingFocus: React.FC = () => {
  const frame = useCurrentFrame();

  // frame 0-50：圓圈直徑從 600→160，border 從 1px→3px，opacity 0.3→1
  const ringDiameter = interpolate(frame, [0, 50], [600, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringBorder = interpolate(frame, [0, 50], [1, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [0, 50], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // glow 強度：隨著聚焦增強
  const glowBlur = interpolate(frame, [0, 50], [4, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowSpread = interpolate(frame, [0, 50], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 40-70：圓圈內部三條橫線出現（漢堡菜單圖示）
  const iconOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const iconScale = interpolate(frame, [40, 70], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 65-90：品牌名「FOCUS LABS」淡入
  const brandOpacity = interpolate(frame, [65, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 85-110：標語「See clearly.」淡入
  const taglineOpacity = interpolate(frame, [85, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* 圓形光圈 */}
      <div
        style={{
          position: "relative",
          width: ringDiameter,
          height: ringDiameter,
          borderRadius: "50%",
          background: "#0f172a",
          border: `${ringBorder}px solid #ffffff`,
          opacity: ringOpacity,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          filter: `drop-shadow(0 0 ${glowBlur}px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 ${glowSpread}px rgba(59, 130, 246, 0.4))`,
          flexShrink: 0,
        }}
      >
        {/* 漢堡選單圖示（三條橫線） */}
        <div
          style={{
            opacity: iconOpacity,
            transform: `scale(${iconScale})`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === 1 ? 32 : 44,
                height: 4,
                borderRadius: 2,
                background: "#ffffff",
              }}
            />
          ))}
        </div>
      </div>

      {/* 品牌名稱 */}
      <div
        style={{
          marginTop: 40,
          opacity: brandOpacity,
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "8px",
          whiteSpace: "nowrap",
        }}
      >
        FOCUS LABS
      </div>

      {/* 標語（斜體灰色） */}
      <div
        style={{
          marginTop: 14,
          opacity: taglineOpacity,
          fontSize: 20,
          fontWeight: 400,
          fontStyle: "italic",
          color: "#6b7280",
          fontFamily: "sans-serif",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        See clearly.
      </div>
    </AbsoluteFill>
  );
};