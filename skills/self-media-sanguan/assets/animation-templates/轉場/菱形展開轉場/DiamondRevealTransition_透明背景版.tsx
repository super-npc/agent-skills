import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const COLS = 11;
const ROWS = 6;
const DIAMOND-SIZE = 180;

const SceneB: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 80,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      Scene B
    </div>
  </AbsoluteFill>
);

export const DiamondRevealTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // 文字隨最後一批菱形（最大 delay = (10+5)*3 = 45）一起消失
  // 最後一個菱形在 delay=45 + 10 frames 開始，25 frames 結束 → frame 80 全部消失
  const textOpacity = interpolate(frame, [10, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const diamonds: React.ReactNode[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const delay = (col + row) * 3;
      const scale = interpolate(frame - delay - 10, [0, 25], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      // 均勻分佈：水平方向置中，垂直方向置中
      const totalWidth = COLS * DIAMOND-SIZE;
      const totalHeight = ROWS * DIAMOND-SIZE;
      const offsetX = (1920 - totalWidth) / 2;
      const offsetY = (1080 - totalHeight) / 2;

      const x = offsetX + col * DIAMOND-SIZE;
      const y = offsetY + row * DIAMOND-SIZE;

      diamonds.push(
        <div
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: DIAMOND-SIZE,
            height: DIAMOND-SIZE,
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      );
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 底層：場景 B */}
      <SceneB />

      {/* 菱形格子層：場景 A 的漸層色塊，逐個縮小消失 */}
      <AbsoluteFill>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {diamonds}
        </div>
      </AbsoluteFill>

      {/* 場景 A 文字：浮在菱形上方，隨菱形消失 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: textOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          Scene A
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};