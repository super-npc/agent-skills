import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const RINGS = [
  { label: "完成率", percent: 87, color: "#3b82f6", trackColor: "#1e3a5f" },
  { label: "滿意度", percent: 94, color: "#10b981", trackColor: "#064e3b" },
  { label: "留存率", percent: 76, color: "#8b5cf6", trackColor: "#2e1065" },
];

const RADIUS = 120;
const STROKE-WIDTH = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RingProps {
  label: string;
  percent: number;
  color: string;
  trackColor: string;
  frame: number;
  fps: number;
  startFrame: number;
}

const Ring: React.FC<RingProps> = ({
  label,
  percent,
  color,
  trackColor,
  frame,
  fps,
  startFrame,
}) => {
  const fillProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 26, stiffness: 90 },
  });

  const appearProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 22, stiffness: 130 },
  });

  const filledPercent = interpolate(fillProgress, [0, 1], [0, percent], {
    extrapolateRight: "clamp",
  });

  const dashOffset = CIRCUMFERENCE - (filledPercent / 100) * CIRCUMFERENCE;

  const scale = interpolate(appearProgress, [0, 1], [0.6, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(appearProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const displayPercent = Math.floor(filledPercent);

  const size = (RADIUS + STROKE-WIDTH) * 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{
            filter: `drop-shadow(0 0 18px ${color}88)`,
          }}
        >
          {/* 軌道 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={RADIUS}
            fill="none"
            stroke={trackColor}
            strokeWidth={STROKE-WIDTH}
          />
          {/* 進度弧 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE-WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* 中心數字 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            {displayPercent}
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#9ca3af",
              fontFamily: "sans-serif",
            }}
          >
            %
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#d1d5db",
          fontFamily: "sans-serif",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ProgressRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 標題 */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#4b5563",
          fontFamily: "sans-serif",
          letterSpacing: 4,
          marginBottom: 80,
        }}
      >
        服務品質指標
      </div>
      {/* 環形圖列 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 120,
        }}
      >
        {RINGS.map((ring, index) => (
          <Ring
            key={ring.label}
            {...ring}
            frame={frame}
            fps={fps}
            startFrame={index * 15}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};