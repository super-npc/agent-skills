import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoOrbitReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 中央圖標 scale 0→1（frame 0-35），spring
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 160 },
    durationInFrames: 35,
  });

  // 軌道圓點顏色
  const dotColors = ["#3b82f6", "#8b5cf6", "#ec4899"];

  // 軌道半徑：frame 0-50 時 100px，frame 50-75 時從 100→0
  const orbitRadius = interpolate(
    frame,
    [0, 50, 75],
    [100, 100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 圓點 opacity：frame 60-75 從 1→0
  const dotOpacity = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 品牌名「Vertex」spring 入場（frame 70-100）
  const brandY = interpolate(frame, [70, 100], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副標語淡入（frame 90-115）
  const taglineOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 計算 3 個軌道圓點的位置（不使用 Math.random）
  const dots = dotColors.map((color, i) => {
    const baseAngle = i * ((2 * Math.PI) / 3);
    const angle = baseAngle + frame * 0.06;
    const x = 960 + Math.cos(angle) * orbitRadius;
    const y = 540 + Math.sin(angle) * orbitRadius;
    return { x, y, color };
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 軌道圓點（SVG） */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={7}
            fill={dot.color}
            opacity={dotOpacity}
          />
        ))}
      </svg>

      {/* 中央圖標 */}
      <div
        style={{
          position: "absolute",
          left: 960 - 60,
          top: 540 - 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${iconScale})`,
        }}
      >
        <span
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          V
        </span>
      </div>

      {/* 品牌名 + 副標語，垂直居中在圖標正下方 */}
      <div
        style={{
          position: "absolute",
          top: 540 + 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* 品牌名 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.02em",
            opacity: brandOpacity,
            transform: `translateY(${brandY}px)`,
          }}
        >
          Vertex
        </div>

        {/* 副標語 */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#6b7280",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
            opacity: taglineOpacity,
          }}
        >
          Motion by design.
        </div>
      </div>
    </AbsoluteFill>
  );
};