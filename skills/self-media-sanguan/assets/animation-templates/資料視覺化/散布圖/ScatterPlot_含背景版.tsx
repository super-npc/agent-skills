import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const POINTS = [
  // Group A (blue) - x, y, size
  { x: 20, y: 65, size: 8, group: "A" },
  { x: 28, y: 72, size: 12, group: "A" },
  { x: 35, y: 58, size: 6, group: "A" },
  { x: 42, y: 80, size: 10, group: "A" },
  { x: 48, y: 68, size: 14, group: "A" },
  { x: 55, y: 75, size: 8, group: "A" },
  { x: 32, y: 85, size: 11, group: "A" },
  { x: 45, y: 90, size: 7, group: "A" },
  { x: 38, y: 62, size: 9, group: "A" },
  { x: 52, y: 78, size: 13, group: "A" },
  // Group B (orange)
  { x: 65, y: 35, size: 9, group: "B" },
  { x: 72, y: 28, size: 11, group: "B" },
  { x: 78, y: 42, size: 7, group: "B" },
  { x: 68, y: 22, size: 13, group: "B" },
  { x: 82, y: 38, size: 8, group: "B" },
  { x: 75, y: 48, size: 10, group: "B" },
  { x: 88, y: 32, size: 12, group: "B" },
  { x: 62, y: 45, size: 6, group: "B" },
  { x: 85, y: 25, size: 14, group: "B" },
  { x: 70, y: 55, size: 9, group: "B" },
];

const COLOR-A = "#3b82f6";
const COLOR-B = "#f59e0b";

const CHART-W = 1300;
const CHART-H = 700;
const PAD-LEFT = 90;
const PAD-RIGHT = 50;
const PAD-TOP = 40;
const PAD-BOTTOM = 80;

const PLOT-W = CHART-W - PAD-LEFT - PAD-RIGHT;
const PLOT-H = CHART-H - PAD-TOP - PAD-BOTTOM;

const GRID-TICKS = [0, 20, 40, 60, 80, 100];

function mapX(val: number): number {
  return PAD-LEFT + (val / 100) * PLOT-W;
}

function mapY(val: number): number {
  return PAD-TOP + PLOT-H - (val / 100) * PLOT-H;
}

export const ScatterPlot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 65 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-24, 0]);

  const gridOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const legendOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          用戶行為散布圖
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          轉換率與滿意度關聯分析
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 200,
          right: (1920 - CHART-W) / 2 + PAD-RIGHT,
          display: "flex",
          gap: 32,
          opacity: legendOpacity,
        }}
      >
        {[
          { color: COLOR-A, label: "A 群組" },
          { color: COLOR-B, label: "B 群組" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: color,
              }}
            />
            <span style={{ fontSize: 22, color: "#d1d5db" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart SVG */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: (1920 - CHART-W) / 2,
          width: CHART-W,
          height: CHART-H,
        }}
      >
        <svg
          width={CHART-W}
          height={CHART-H}
          viewBox={`0 0 ${CHART-W} ${CHART-H}`}
          style={{ overflow: "visible" }}
        >
          {/* Vertical grid lines */}
          {GRID-TICKS.map((val) => {
            const x = mapX(val);
            return (
              <g key={`vgrid-${val}`} opacity={gridOpacity}>
                <line
                  x1={x}
                  y1={PAD-TOP}
                  x2={x}
                  y2={PAD-TOP + PLOT-H}
                  stroke={val === 0 ? "#4b5563" : "rgba(75,85,99,0.3)"}
                  strokeWidth={val === 0 ? 1.5 : 1}
                />
                {val > 0 && (
                  <text
                    x={x}
                    y={PAD-TOP + PLOT-H + 36}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={20}
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Horizontal grid lines */}
          {GRID-TICKS.map((val) => {
            const y = mapY(val);
            return (
              <g key={`hgrid-${val}`} opacity={gridOpacity}>
                <line
                  x1={PAD-LEFT}
                  y1={y}
                  x2={PAD-LEFT + PLOT-W}
                  y2={y}
                  stroke={val === 0 ? "#4b5563" : "rgba(75,85,99,0.3)"}
                  strokeWidth={val === 0 ? 1.5 : 1}
                />
                <text
                  x={PAD-LEFT - 12}
                  y={y + 7}
                  textAnchor="end"
                  fill="#9ca3af"
                  fontSize={20}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis label */}
          <text
            x={PAD-LEFT + PLOT-W / 2}
            y={PAD-TOP + PLOT-H + 70}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={22}
            opacity={gridOpacity}
          >
            轉換率 (%)
          </text>

          {/* Y-axis label */}
          <text
            x={PAD-LEFT - 64}
            y={PAD-TOP + PLOT-H / 2}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={22}
            transform={`rotate(-90, ${PAD-LEFT - 64}, ${PAD-TOP + PLOT-H / 2})`}
            opacity={gridOpacity}
          >
            滿意度 (%)
          </text>

          {/* Scatter points */}
          {POINTS.map((pt, index) => {
            const startFrame = index * 5 + 10;
            const ptProgress = spring({
              frame: Math.max(0, frame - startFrame),
              fps,
              config: { damping: 18, stiffness: 120 },
            });

            const scale = interpolate(ptProgress, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const opacity = interpolate(ptProgress, [0, 0.4], [0, 1], {
              extrapolateRight: "clamp",
            });

            const cx = mapX(pt.x);
            const cy = mapY(pt.y);
            const r = pt.size;
            const color = pt.group === "A" ? COLOR-A : COLOR-B;

            return (
              <g key={index} transform={`translate(${cx}, ${cy})`} opacity={opacity}>
                {/* Glow ring */}
                <circle
                  cx={0}
                  cy={0}
                  r={r * scale * 2.2}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.25}
                />
                {/* Main dot */}
                <circle
                  cx={0}
                  cy={0}
                  r={r * scale}
                  fill={color}
                  fillOpacity={0.85}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};