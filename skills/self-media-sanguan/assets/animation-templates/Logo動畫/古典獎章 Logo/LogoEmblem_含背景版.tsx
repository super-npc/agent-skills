import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoEmblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-35：外圓邊框描繪（strokeDashoffset）
  const outerCircumference = 2 * Math.PI * 155;
  const outerStrokeDash = interpolate(frame, [0, 35], [outerCircumference, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 20-55：內圓描繪
  const innerCircumference = 2 * Math.PI * 120;
  const innerStrokeDash = interpolate(frame, [20, 55], [innerCircumference, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 40-70：8 個裝飾圓點依序 scale 0→1
  const dotScales = Array.from({ length: 8 }, (_, i) => {
    const startFrame = 40 + i * 3.75;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 18, stiffness: 220 },
      durationInFrames: 20,
    });
  });

  // 8 個圓點的位置（半徑 137px，從圓心計算絕對位置）
  const dotPositions = Array.from({ length: 8 }, (_, i) => {
    const angle = i * ((2 * Math.PI) / 8) - Math.PI / 2;
    return {
      x: 960 + Math.cos(angle) * 137,
      y: 540 + Math.sin(angle) * 137,
    };
  });

  // frame 60-85：中央星形 scale 0→1（5角星）
  const starScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 15, stiffness: 200 },
    durationInFrames: 25,
  });

  // 5角星的 polygon points（中心在原點，外半徑 40，內半徑 16）
  const starPoints = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (i * (2 * Math.PI)) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = Math.cos(outerAngle) * 40;
    const oy = Math.sin(outerAngle) * 40;
    const ix = Math.cos(innerAngle) * 16;
    const iy = Math.sin(innerAngle) * 16;
    return `${ox},${oy} ${ix},${iy}`;
  }).join(" ");

  // frame 80-105：「PR」品牌縮寫淡入
  const abbrevOpacity = interpolate(frame, [80, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 95-120：底部絲帶展開（clip-path）
  const ribbonClip = interpolate(frame, [95, 120], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 「PREMIUM」文字淡入（frame 100-120）
  const premiumOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 110-130：頂部「AWARD OF EXCELLENCE」淡入
  const topTextOpacity = interpolate(frame, [110, 130], [0, 1], {
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
      {/* 全畫面 SVG 層——外圓、內圓、裝飾點、星形 */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 外圓邊框 */}
        <circle
          cx="960"
          cy="540"
          r="155"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerStrokeDash}
          strokeLinecap="round"
          transform="rotate(-90 960 540)"
        />

        {/* 內圓 */}
        <circle
          cx="960"
          cy="540"
          r="120"
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerStrokeDash}
          strokeLinecap="round"
          transform="rotate(-90 960 540)"
        />

        {/* 8 個裝飾圓點 */}
        {dotPositions.map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={4}
            fill="#d97706"
            transform={`scale(${dotScales[i]}) translate(${pos.x * (1 - 1 / Math.max(dotScales[i], 0.001))},${pos.y * (1 - 1 / Math.max(dotScales[i], 0.001))})`}
          />
        ))}

        {/* 中央星形（5角，在 960,540 中心） */}
        <g transform={`translate(960,540) scale(${starScale})`}>
          <polygon
            points={starPoints}
            fill="#d97706"
          />
        </g>
      </svg>

      {/* 品牌縮寫「PR」—— 覆蓋在星形上方 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 52,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-0.02em",
          opacity: abbrevOpacity,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        PR
      </div>

      {/* 底部絲帶 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 540 + 130 + 28,
          transform: "translateX(-50%)",
          width: 300,
          height: 40,
          background: "#d97706",
          clipPath: `polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* 絲帶展開遮罩 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#d97706",
            clipPath: `inset(0 ${ribbonClip}% 0 0)`,
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 13,
            fontWeight: 800,
            color: "#0f0f0f",
            letterSpacing: "0.2em",
            fontFamily: "sans-serif",
            opacity: premiumOpacity,
          }}
        >
          PREMIUM
        </span>
      </div>

      {/* 頂部「AWARD OF EXCELLENCE」 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 540 - 155 - 40,
          transform: "translateX(-50%)",
          opacity: topTextOpacity,
          fontSize: 11,
          fontWeight: 500,
          color: "#d97706",
          fontFamily: "sans-serif",
          letterSpacing: "3px",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        AWARD OF EXCELLENCE
      </div>
    </AbsoluteFill>
  );
};