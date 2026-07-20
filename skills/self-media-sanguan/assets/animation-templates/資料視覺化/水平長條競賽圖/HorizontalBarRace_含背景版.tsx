import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const ITEMS = [
  { name: "台灣", value: 9420, color: "#3b82f6" },
  { name: "日本", value: 8150, color: "#8b5cf6" },
  { name: "韓國", value: 7380, color: "#06b6d4" },
  { name: "香港", value: 6240, color: "#10b981" },
  { name: "新加坡", value: 5690, color: "#f59e0b" },
  { name: "泰國", value: 4320, color: "#ec4899" },
];

const MAX-VALUE = ITEMS[0].value;
const BAR-MAX-WIDTH-PERCENT = 70;

interface BarProps {
  name: string;
  value: number;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  rank: number;
}

const Bar: React.FC<BarProps> = ({
  name,
  value,
  color,
  frame,
  fps,
  startFrame,
  rank,
}) => {
  const growProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 24, stiffness: 100 },
  });

  const appearProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 28, stiffness: 140 },
  });

  const targetWidthPercent = (value / MAX-VALUE) * BAR-MAX-WIDTH-PERCENT;
  const currentWidthPercent = interpolate(
    growProgress,
    [0, 1],
    [0, targetWidthPercent],
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(appearProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const x = interpolate(appearProgress, [0, 1], [-40, 0], {
    extrapolateRight: "clamp",
  });

  const displayValue = Math.floor(
    interpolate(growProgress, [0, 1], [0, value], { extrapolateRight: "clamp" })
  ).toLocaleString("zh-TW");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        height: 64,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      {/* 排名 */}
      <div
        style={{
          width: 48,
          fontSize: 22,
          fontWeight: 700,
          color: "#4b5563",
          fontFamily: "sans-serif",
          textAlign: "right",
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        {rank}
      </div>
      {/* 地區名稱 */}
      <div
        style={{
          width: 100,
          fontSize: 24,
          fontWeight: 700,
          color: "#e5e7eb",
          fontFamily: "sans-serif",
          textAlign: "right",
          paddingRight: 24,
          flexShrink: 0,
        }}
      >
        {name}
      </div>
      {/* 長條 + 數值 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          position: "relative",
          height: 44,
        }}
      >
        <div
          style={{
            width: `${currentWidthPercent}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            borderRadius: 8,
            flexShrink: 0,
            minWidth: 4,
            boxShadow: `0 0 16px ${color}55`,
            transition: "none",
          }}
        />
        <span
          style={{
            marginLeft: 16,
            fontSize: 22,
            fontWeight: 700,
            color: "#9ca3af",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
};

export const HorizontalBarRace: React.FC = () => {
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
        padding: "0 120px",
        boxSizing: "border-box",
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
          marginBottom: 60,
          alignSelf: "flex-start",
          paddingLeft: 148,
        }}
      >
        各地區用戶數排行
      </div>
      {/* 長條圖 */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {ITEMS.map((item, index) => (
          <Bar
            key={item.name}
            {...item}
            frame={frame}
            fps={fps}
            startFrame={index * 10}
            rank={index + 1}
          />
        ))}
      </div>
      {/* 單位標注 */}
      <div
        style={{
          alignSelf: "flex-end",
          marginTop: 32,
          fontSize: 18,
          color: "#374151",
          fontFamily: "sans-serif",
          letterSpacing: 1,
        }}
      >
        單位：人
      </div>
    </AbsoluteFill>
  );
};