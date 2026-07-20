import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const BUBBLES = [
  // group A - 科技
  { x: 72, y: 88, size: 45, label: "AI",     color: "#3b82f6", group: "科技" },
  { x: 65, y: 72, size: 32, label: "雲端",   color: "#3b82f6", group: "科技" },
  { x: 80, y: 65, size: 28, label: "資安",   color: "#3b82f6", group: "科技" },
  { x: 55, y: 80, size: 18, label: "AR/VR",  color: "#3b82f6", group: "科技" },
  // group B - 消費
  { x: 35, y: 45, size: 55, label: "電商",   color: "#10b981", group: "消費" },
  { x: 42, y: 38, size: 38, label: "外送",   color: "#10b981", group: "消費" },
  { x: 28, y: 55, size: 22, label: "訂閱",   color: "#10b981", group: "消費" },
  { x: 48, y: 28, size: 15, label: "共享",   color: "#10b981", group: "消費" },
  // group C - 金融
  { x: 20, y: 62, size: 42, label: "支付",     color: "#f59e0b", group: "金融" },
  { x: 30, y: 75, size: 25, label: "加密貨幣", color: "#f59e0b", group: "金融" },
  { x: 15, y: 48, size: 35, label: "保險",     color: "#f59e0b", group: "金融" },
  { x: 22, y: 35, size: 20, label: "借貸",     color: "#f59e0b", group: "金融" },
];

const LEGEND-GROUPS = [
  { group: "科技", color: "#3b82f6" },
  { group: "消費", color: "#10b981" },
  { group: "金融", color: "#f59e0b" },
];

// Chart area layout
const CHART-LEFT   = 160;
const CHART-TOP    = 180;
const CHART-RIGHT  = 1760;
const CHART-BOTTOM = 960;
const CHART-W = CHART-RIGHT - CHART-LEFT;
const CHART-H = CHART-BOTTOM - CHART-TOP;

const GRID-COUNT = 4;

function bubbleRadius(size: number) {
  return (size / 55) * 60 + 15;
}

function chartX(xPct: number) {
  return CHART-LEFT + (xPct / 100) * CHART-W;
}

function chartY(yPct: number) {
  // y=0 at bottom, y=100 at top
  return CHART-BOTTOM - (yPct / 100) * CHART-H;
}

export const BubbleChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleProgress = spring({ frame, fps, config: { damping: 30, stiffness: 70 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  // Grid entrance
  const gridProgress = spring({ frame, fps, config: { damping: 40, stiffness: 60 } });
  const gridOpacity = interpolate(gridProgress, [0, 1], [0, 0.5]);

  // Axis label entrance
  const axisOpacity = interpolate(gridProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
          市場分析氣泡圖
        </div>
        <div style={{ marginTop: 8, fontSize: 22, color: "#6b7280", letterSpacing: "0.06em" }}>
          市場規模 × 成長率 × 市佔率
        </div>
      </div>

      {/* SVG chart */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox="0 0 1920 1080"
      >
        {/* Grid lines */}
        {Array.from({ length: GRID-COUNT + 1 }, (_, i) => {
          const frac = i / GRID-COUNT;
          const xPos = CHART-LEFT + frac * CHART-W;
          const yPos = CHART-TOP + frac * CHART-H;
          const label = Math.round(frac * 100);
          return (
            <g key={i} opacity={gridOpacity}>
              {/* vertical grid */}
              <line
                x1={xPos} y1={CHART-TOP}
                x2={xPos} y2={CHART-BOTTOM}
                stroke="#374151"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "none" : "6 4"}
              />
              {/* horizontal grid */}
              <line
                x1={CHART-LEFT} y1={yPos}
                x2={CHART-RIGHT} y2={yPos}
                stroke="#374151"
                strokeWidth={1}
                strokeDasharray={i === GRID-COUNT ? "none" : "6 4"}
              />
              {/* X axis labels */}
              <text
                x={xPos}
                y={CHART-BOTTOM + 36}
                textAnchor="middle"
                fill="#6b7280"
                fontSize={20}
                opacity={axisOpacity}
              >
                {label}
              </text>
              {/* Y axis labels */}
              <text
                x={CHART-LEFT - 16}
                y={CHART-BOTTOM - frac * CHART-H + 7}
                textAnchor="end"
                fill="#6b7280"
                fontSize={20}
                opacity={axisOpacity}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Axis titles */}
        <text
          x={CHART-LEFT + CHART-W / 2}
          y={CHART-BOTTOM + 76}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={24}
          opacity={axisOpacity}
        >
          市場規模（百分位）
        </text>
        <text
          x={CHART-LEFT - 80}
          y={CHART-TOP + CHART-H / 2}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={24}
          opacity={axisOpacity}
          transform={`rotate(-90, ${CHART-LEFT - 80}, ${CHART-TOP + CHART-H / 2})`}
        >
          成長率（百分位）
        </text>

        {/* Bubbles */}
        {BUBBLES.map((bubble, index) => {
          const startFrame = index * 8 + 15;
          const bubbleProgress = spring({
            frame: Math.max(0, frame - startFrame),
            fps,
            config: { damping: 18, stiffness: 100 },
          });

          const scale = interpolate(bubbleProgress, [0, 1], [0, 1]);
          const opacity = interpolate(bubbleProgress, [0, 0.3, 1], [0, 1, 1], {
            extrapolateRight: "clamp",
          });

          const cx = chartX(bubble.x);
          const cy = chartY(bubble.y);
          const r = bubbleRadius(bubble.size);

          // Determine label position (push label right for left-side bubbles, above for high bubbles)
          const labelOffsetX = bubble.x < 50 ? r + 12 : -(r + 12);
          const labelAnchor  = bubble.x < 50 ? "start" : "end";

          return (
            <g key={index} opacity={opacity}>
              {/* Glow filter via drop-shadow */}
              <circle
                cx={cx}
                cy={cy}
                r={r * scale}
                fill={bubble.color}
                fillOpacity={0.18}
                stroke={bubble.color}
                strokeWidth={2}
                style={{
                  filter: `drop-shadow(0 0 ${12 * scale}px ${bubble.color}aa)`,
                }}
              />
              {/* Label */}
              <text
                x={cx + labelOffsetX * scale}
                y={cy + 6}
                textAnchor={labelAnchor}
                fill={bubble.color}
                fontSize={r > 40 ? 22 : 18}
                fontWeight={600}
              >
                {bubble.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 80,
          display: "flex",
          gap: 36,
          opacity: axisOpacity,
        }}
      >
        {LEGEND-GROUPS.map(({ group, color }) => (
          <div key={group} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 8px ${color}88`,
              }}
            />
            <span style={{ color: "#d1d5db", fontSize: 22 }}>{group}</span>
          </div>
        ))}
        {/* Size legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16 }}>
          <svg width={36} height={36}>
            <circle cx={18} cy={18} r={14} fill="none" stroke="#6b7280" strokeWidth={2} />
            <circle cx={18} cy={18} r={6}  fill="none" stroke="#6b7280" strokeWidth={1.5} />
          </svg>
          <span style={{ color: "#6b7280", fontSize: 20 }}>圓圈大小 = 市佔率</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};