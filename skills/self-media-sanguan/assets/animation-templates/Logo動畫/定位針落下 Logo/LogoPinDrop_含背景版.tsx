import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoPinDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-20：定位針從 y:-300 落下到 y:0
  const pinY = interpolate(frame, [0, 20], [-300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t, // 緩入（加速落下）
  });

  // frame 18-28：落地衝擊垂直方向壓縮彈跳（scaleY）
  const impactScaleY = interpolate(
    frame,
    [18, 21, 24, 28],
    [1.0, 1.08, 0.96, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // frame 20-30：落地陰影圓圈從 scale(0)→scale(1)
  const shadowScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 25, stiffness: 300 },
    durationInFrames: 10,
  });

  // frame 30-65：圓形部分從 120→200px（spring）
  const circleExpand = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 35,
  });
  const circleDiameter = interpolate(circleExpand, [0, 1], [120, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 55-85：圓形內「LC」縮寫 scale(0)→(1)
  const abbrevScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 30,
  });

  // frame 80-105：「LocationCo.」文字從 y:+20→0 淡入
  const nameOpacity = interpolate(frame, [80, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [80, 105], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 98-118：副標語淡入
  const taglineOpacity = interpolate(frame, [98, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 定位針組合的中心 X/Y
  const pinCenterX = 960;
  const pinCenterY = 540 - 60;

  // 尖角高度
  const tipHeight = 50;
  const tipBaseY = pinCenterY + circleDiameter / 2;
  const tipTopY = tipBaseY + tipHeight;
  const tipWidth = circleDiameter * 0.4;

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 落地陰影（扁橢圓） */}
      <div
        style={{
          position: "absolute",
          left: pinCenterX - 60,
          top: tipTopY + 4,
          width: 120,
          height: 20,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.6)",
          transform: `scaleX(${shadowScale})`,
          transformOrigin: "center center",
        }}
      />

      {/* 定位針整體容器（含落地動畫） */}
      <div
        style={{
          position: "absolute",
          left: pinCenterX,
          top: pinCenterY,
          transform: `translateX(-50%) translateY(${pinY}px) scaleY(${impactScaleY})`,
          transformOrigin: "bottom center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 圓形部分 */}
        <div
          style={{
            width: circleDiameter,
            height: circleDiameter,
            borderRadius: "50%",
            background: "#ef4444",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* 品牌縮寫「LC」 */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              transform: `scale(${abbrevScale})`,
              userSelect: "none",
            }}
          >
            LC
          </div>
        </div>

        {/* 尖角（等邊三角形，指向下方） */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${tipWidth / 2}px solid transparent`,
            borderRight: `${tipWidth / 2}px solid transparent`,
            borderTop: `${tipHeight}px solid #ef4444`,
            marginTop: -2,
            flexShrink: 0,
          }}
        />
      </div>

      {/* 品牌名「LocationCo.」 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: tipTopY + 36,
          transform: `translateX(-50%) translateY(${nameY}px)`,
          fontSize: 44,
          fontWeight: 600,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-0.01em",
          opacity: nameOpacity,
          whiteSpace: "nowrap",
        }}
      >
        LocationCo.
      </div>

      {/* 副標語 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: tipTopY + 36 + 56,
          transform: "translateX(-50%)",
          fontSize: 16,
          fontWeight: 400,
          color: "#6b7280",
          fontFamily: "sans-serif",
          letterSpacing: "2px",
          opacity: taglineOpacity,
          whiteSpace: "nowrap",
        }}
      >
        Find your place.
      </div>
    </AbsoluteFill>
  );
};