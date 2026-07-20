import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const PARTICLE-COUNT = 40;
const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b"];

export const ParticleBurstIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // 粒子爆發：frame 0-40 從中心向外，frame 40-80 向中心匯聚
  const burstProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gatherProgress = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 標題：frame 80-120 淡入 + scale
  const titleOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [80, 120], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = Array.from({ length: PARTICLE-COUNT }, (_, index) => {
    const angleDeg = (index / PARTICLE-COUNT) * 360;
    const angleRad = (angleDeg * Math.PI) / 180;
    const distance = 100 + (index % 5) * 80;

    const targetX = Math.cos(angleRad) * distance;
    const targetY = Math.sin(angleRad) * distance;

    // 爆發階段：0 → 最終位置
    // 匯聚階段：最終位置 → 0
    let currentX: number;
    let currentY: number;

    if (frame <= 40) {
      currentX = interpolate(burstProgress, [0, 1], [0, targetX]);
      currentY = interpolate(burstProgress, [0, 1], [0, targetY]);
    } else {
      currentX = interpolate(gatherProgress, [0, 1], [targetX, 0]);
      currentY = interpolate(gatherProgress, [0, 1], [targetY, 0]);
    }

    const size = 8 + (index % 3) * 4;
    const color = COLORS[index % COLORS.length];
    const particleOpacity = frame < 80 ? 1 : interpolate(frame, [80, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
      <div
        key={index}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          transform: `translate(${currentX}px, ${currentY}px)`,
          opacity: particleOpacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 粒子容器，相對於畫面中心 */}
      <div
        style={{
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        {particles}
      </div>

      {/* 標題文字 */}
      <div
        style={{
          position: "absolute",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          fontSize: 80,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        YOUR TITLE
      </div>
    </AbsoluteFill>
  );
};