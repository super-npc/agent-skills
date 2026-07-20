import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoTriangleForm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 大三角形等邊，高 220px，中心約 960, 430
  // 頂點：頂部 (960, 320)；左下 (833, 540)；右下 (1087, 540)
  // 四個小三角形組成：
  // 左下小三角：(833,540) (960,540) (896,430) → 藍色
  // 右下小三角：(960,540) (1087,540) (1024,430) → 紫色
  // 頂部小三角：(896,430) (1024,430) (960,320) → 青色
  // 中央倒三角（負空間）：(896,430) (1024,430) (960,540) → 背景色

  // spring helper：對每個三角形計算 spring 進度
  const makeSpring = (startFrame: number) =>
    spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 18, stiffness: 120, mass: 1 },
      durationInFrames: 40,
    });

  // 各三角形 spring 進度（stagger 12 幀）
  const prog0 = makeSpring(0);  // 左下
  const prog1 = makeSpring(12); // 右下
  const prog2 = makeSpring(24); // 頂部

  // 左下三角：從 (-300, 200) → (0, 0)
  const blTx = interpolate(prog0, [0, 1], [-300, 0]);
  const blTy = interpolate(prog0, [0, 1], [200, 0]);

  // 右下三角：從 (300, 200) → (0, 0)
  const brTx = interpolate(prog1, [0, 1], [300, 0]);
  const brTy = interpolate(prog1, [0, 1], [200, 0]);

  // 頂部三角 Y 軸偏移（從 -300 飛入 0）
  const topTriY = interpolate(prog2, [0, 1], [-300, 0]);

  // frame 60-90：中央倒三角（負空間）scale 0→1
  const negTriScale = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 80-105：品牌名 y:+30→0，opacity 0→1
  const brandY = interpolate(frame, [80, 105], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [80, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 100-120：副標語淡入
  const taglineOpacity = interpolate(frame, [100, 120], [0, 1], {
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
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 左下小三角（藍色）：從左下飛入 */}
        <polygon
          points="833,540 960,540 896,430"
          fill="#3b82f6"
          transform={`translate(${blTx}, ${blTy})`}
        />

        {/* 右下小三角（紫色）：從右下飛入 */}
        <polygon
          points="960,540 1087,540 1024,430"
          fill="#8b5cf6"
          transform={`translate(${brTx}, ${brTy})`}
        />

        {/* 頂部小三角（青色）：從頂部飛入 */}
        <polygon
          points="896,430 1024,430 960,320"
          fill="#06b6d4"
          transform={`translate(0, ${topTriY})`}
        />

        {/* 中央倒三角（負空間，背景色）：scale 0→1 */}
        <polygon
          points="896,430 1024,430 960,540"
          fill="#0f0f0f"
          transform={`translate(960, 485) scale(${negTriScale}) translate(-960, -485)`}
        />
      </svg>

      {/* 品牌名與副標語 */}
      <div
        style={{
          position: "absolute",
          top: 570,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
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
              fontSize: 44,
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Triform
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
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            Built to last.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};