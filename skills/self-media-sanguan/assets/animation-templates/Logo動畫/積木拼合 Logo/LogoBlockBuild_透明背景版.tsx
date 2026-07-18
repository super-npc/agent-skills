import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BLOCK-COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const BLOCK-OFFSETS = [0, 15, 30, 45]; // 每塊的 stagger 延遲（幀）

export const LogoBlockBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 4 個色塊各自的 spring scale
  const blockScales = BLOCK-OFFSETS.map((offset) =>
    spring({
      frame: frame - offset,
      fps,
      config: { damping: 18, stiffness: 220 },
      durationInFrames: 25,
    })
  );

  // frame 70-100：品牌名稱從右側滑入
  const brandX = interpolate(frame, [70, 100], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 90-115：副標語淡入
  const taglineOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blockSize = 100;
  const gap = 4;
  const gridSize = blockSize * 2 + gap;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 整體水平排列：色塊 grid + 文字 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
        }}
      >
        {/* 2×2 色塊 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${blockSize}px ${blockSize}px`,
            gridTemplateRows: `${blockSize}px ${blockSize}px`,
            gap: `${gap}px`,
            width: gridSize,
            height: gridSize,
          }}
        >
          {BLOCK-COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                width: blockSize,
                height: blockSize,
                borderRadius: 8,
                background: color,
                transform: `scale(${blockScales[i]})`,
                transformOrigin: "center center",
              }}
            />
          ))}
        </div>

        {/* 文字區塊 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transform: `translateX(${brandX}px)`,
            opacity: brandOpacity,
          }}
        >
          {/* 品牌名稱 */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
            }}
          >
            Colorblock
          </div>

          {/* 副標語 */}
          <div
            style={{
              opacity: taglineOpacity,
              fontSize: 20,
              fontWeight: 400,
              color: "#6b7280",
              fontFamily: "sans-serif",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            Bring your brand to life.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};