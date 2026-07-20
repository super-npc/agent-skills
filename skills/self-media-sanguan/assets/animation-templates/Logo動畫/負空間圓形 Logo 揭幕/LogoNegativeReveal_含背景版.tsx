import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const LogoNegativeReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // frame 0-5：掃描線快速掃過（translateX -200 → +200）
  const scanLineX = interpolate(frame, [0, 5], [-200, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanLineOpacity = interpolate(frame, [0, 2, 5, 6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 0-40：遮罩圓形 scale 3→0（先快後慢，使用 easeOut 效果）
  const maskScale = interpolate(frame, [0, 40], [3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // frame 35-65：外圍細邊框 SVG circle strokeDashoffset 描繪
  const circlePerimeter = 2 * Math.PI * 88; // r=88 的周長
  const circleStrokeOffset = interpolate(frame, [35, 65], [circlePerimeter, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 60-85：品牌名 y 偏移 +20→0，opacity 0→1
  const brandY = interpolate(frame, [60, 85], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 80-100：副標語淡入
  const taglineOpacity = interpolate(frame, [80, 100], [0, 1], {
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
      {/* 底層：白色圓形 Logo 本體（直徑 160px，中央「N」字） */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) translateY(-80px)",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "#0f0f0f",
            fontFamily: "sans-serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          N
        </span>
      </div>

      {/* 遮罩圓形（背景色，scale 3→0 逐漸收縮露出白色 logo） */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(-80px) scale(${maskScale})`,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "#0f0f0f",
        }}
      />

      {/* SVG：外圍細邊框 circle 描繪 */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* 中心點：960, 460（畫面正中偏上 80px） */}
        <circle
          cx="960"
          cy="460"
          r="88"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={circlePerimeter}
          strokeDashoffset={circleStrokeOffset}
        />
      </svg>

      {/* 掃描線（白色細線，快速掃過） */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(-80px) translateX(${scanLineX}px)`,
          width: 2,
          height: 200,
          background: "linear-gradient(to bottom, transparent, white, transparent)",
          opacity: scanLineOpacity,
        }}
      />

      {/* 品牌名與副標語 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          transform: "translateY(80px)",
        }}
      >
        <div
          style={{
            opacity: brandOpacity,
            transform: `translateY(${brandY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Negative Space
          </span>
        </div>

        <div
          style={{
            opacity: taglineOpacity,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#6b7280",
              fontFamily: "sans-serif",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            Less is more.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};