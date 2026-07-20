import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoShieldCrest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-50：盾牌外框描邊 strokeDashoffset 1200→0
  const shieldStrokeOffset = interpolate(frame, [0, 50], [1200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 40-70：盾牌填色 fillOpacity 0→0.9
  const shieldFillOpacity = interpolate(frame, [40, 70], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 60-90：「AC」縮寫 scale 0→1（spring）
  const acScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
    durationInFrames: 30,
  });

  // frame 80-105：彩帶 clip-path 從中間展開，inset 從 50%→0%
  const bannerInset = interpolate(frame, [80, 105], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 95-120：「ACME CORP」文字淡入
  const corpTextOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 110-130：副標語淡入
  const taglineOpacity = interpolate(frame, [110, 130], [0, 1], {
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
      {/* SVG 盾牌 */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 盾牌形狀：頂部寬 240px，高 280px，底部收尖 */}
        <path
          d="M 960 260 L 1080 310 L 1080 470 Q 1080 560 960 590 Q 840 560 840 470 L 840 310 Z"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="#1e3a5f"
          fillOpacity={shieldFillOpacity}
          strokeDasharray="1200"
          strokeDashoffset={shieldStrokeOffset}
          strokeLinejoin="round"
        />
      </svg>

      {/* 「AC」品牌縮寫，盾牌中央 */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${acScale})`,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          AC
        </span>
      </div>

      {/* 彩帶/橫幅（梯形效果用 clip-path） */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 44,
          background: "#f59e0b",
          clipPath: `inset(0 ${bannerInset}%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#1a1a1a",
            fontFamily: "sans-serif",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            opacity: corpTextOpacity,
          }}
        >
          ACME CORP
        </span>
      </div>

      {/* 副標語 */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: taglineOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "#9ca3af",
            fontFamily: "sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Est. 2024
        </span>
      </div>
    </AbsoluteFill>
  );
};