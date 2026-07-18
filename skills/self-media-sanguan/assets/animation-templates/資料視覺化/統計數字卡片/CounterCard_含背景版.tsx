import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const CARDS = [
  { label: "總用戶數", value: 128450, unit: "人", trend: "+12.5%", color: "#3b82f6" },
  { label: "月收益", value: 892000, unit: "元", trend: "+8.3%", color: "#10b981" },
  { label: "轉換率", value: 3.7, unit: "%", trend: "+0.4%", color: "#8b5cf6", isDecimal: true },
];

interface CardProps {
  label: string;
  value: number;
  unit: string;
  trend: string;
  color: string;
  isDecimal?: boolean;
  frame: number;
  fps: number;
  startFrame: number;
}

const StatCard: React.FC<CardProps> = ({
  label,
  value,
  unit,
  trend,
  color,
  isDecimal,
  frame,
  fps,
  startFrame,
}) => {
  const slideProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 22, stiffness: 120 },
  });

  const y = interpolate(slideProgress, [0, 1], [80, 0]);
  const opacity = interpolate(slideProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const countProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentValue = isDecimal
    ? parseFloat((value * countProgress).toFixed(1))
    : Math.floor(value * countProgress);

  const displayValue = isDecimal
    ? currentValue.toFixed(1)
    : currentValue.toLocaleString("zh-TW");

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity,
        width: 480,
        background: "#1a1a1a",
        borderRadius: 16,
        borderTop: `4px solid ${color}`,
        padding: "48px 52px 44px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: "#9ca3af",
          fontFamily: "sans-serif",
          fontWeight: 500,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#d1d5db",
            fontFamily: "sans-serif",
            paddingBottom: 10,
          }}
        >
          {unit}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color,
            fontFamily: "sans-serif",
            background: `${color}22`,
            padding: "4px 14px",
            borderRadius: 20,
          }}
        >
          {trend}
        </span>
        <span
          style={{
            fontSize: 18,
            color: "#6b7280",
            fontFamily: "sans-serif",
          }}
        >
          較上月
        </span>
      </div>
    </div>
  );
};

export const CounterCard: React.FC = () => {
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
        gap: 0,
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
          marginBottom: 56,
          textTransform: "uppercase",
        }}
      >
        核心業績概覽
      </div>
      {/* 卡片列 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          alignItems: "stretch",
        }}
      >
        {CARDS.map((card, index) => (
          <StatCard
            key={card.label}
            {...card}
            frame={frame}
            fps={fps}
            startFrame={index * 20}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};