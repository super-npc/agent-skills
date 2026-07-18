import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"];
const SERIES-A = [40, 55, 48, 72, 65, 88, 80, 95]; // 本年度
const SERIES-B = [30, 42, 38, 55, 50, 70, 65, 82]; // 去年同期

const COLOR-A = "#3b82f6";
const COLOR-B = "#8b5cf6";

const CHART-W = 1400;
const CHART-H = 600;
const PAD-LEFT = 80;
const PAD-RIGHT = 40;
const PAD-TOP = 20;
const PAD-BOTTOM = 60;

const PLOT-W = CHART-W - PAD-LEFT - PAD-RIGHT;
const PLOT-H = CHART-H - PAD-TOP - PAD-BOTTOM;

const MAX-VALUE = 100;
const GRID-VALUES = [0, 25, 50, 75, 100];

function buildPath(series: number[]): string {
  return series
    .map((val, i) => {
      const x = PAD-LEFT + (i / (series.length - 1)) * PLOT-W;
      const y = PAD-TOP + PLOT-H - (val / MAX-VALUE) * PLOT-H;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(series: number[]): string {
  const linePart = buildPath(series);
  const lastX = PAD-LEFT + PLOT-W;
  const firstX = PAD-LEFT;
  const baseline = PAD-TOP + PLOT-H;
  return `${linePart} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
}

function getPathLength(series: number[]): number {
  let length = 0;
  for (let i = 1; i < series.length; i++) {
    const x1 = PAD-LEFT + ((i - 1) / (series.length - 1)) * PLOT-W;
    const y1 = PAD-TOP + PLOT-H - (series[i - 1] / MAX-VALUE) * PLOT-H;
    const x2 = PAD-LEFT + (i / (series.length - 1)) * PLOT-W;
    const y2 = PAD-TOP + PLOT-H - (series[i] / MAX-VALUE) * PLOT-H;
    const dx = x2 - x1;
    const dy = y2 - y1;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

const PATH-LENGTH-A = getPathLength(SERIES-A);
const PATH-LENGTH-B = getPathLength(SERIES-B);

export const AreaChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 65 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-24, 0]);

  // Line draw: frames 20-80
  const lineRaw = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffsetA = PATH-LENGTH-A * (1 - lineRaw);
  const dashOffsetB = PATH-LENGTH-B * (1 - lineRaw);

  // Area fill: frames 70-100
  const areaOpacity = interpolate(frame, [70, 100], [0, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grid and axis fade in
  const gridOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Legend
  const legendOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const svgW = CHART-W;
  const svgH = CHART-H;

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
          月度趨勢分析
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          本年度 vs 去年同期
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 188,
          right: (1920 - CHART-W) / 2 + PAD-RIGHT,
          display: "flex",
          gap: 32,
          opacity: legendOpacity,
        }}
      >
        {[
          { color: COLOR-A, label: "本年度" },
          { color: COLOR-B, label: "去年同期" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
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
          bottom: 80,
          left: (1920 - CHART-W) / 2,
          width: CHART-W,
          height: CHART-H,
        }}
      >
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR-A} stopOpacity="1" />
              <stop offset="100%" stopColor={COLOR-A} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR-B} stopOpacity="1" />
              <stop offset="100%" stopColor={COLOR-B} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines + Y labels */}
          {GRID-VALUES.map((val) => {
            const y = PAD-TOP + PLOT-H - (val / MAX-VALUE) * PLOT-H;
            return (
              <g key={val} opacity={gridOpacity}>
                <line
                  x1={PAD-LEFT}
                  y1={y}
                  x2={PAD-LEFT + PLOT-W}
                  y2={y}
                  stroke={val === 0 ? "#4b5563" : "rgba(75,85,99,0.35)"}
                  strokeWidth={val === 0 ? 1.5 : 1}
                />
                <text
                  x={PAD-LEFT - 12}
                  y={y + 7}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize={20}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis month labels */}
          {MONTHS.map((month, i) => {
            const x = PAD-LEFT + (i / (MONTHS.length - 1)) * PLOT-W;
            return (
              <text
                key={month}
                x={x}
                y={PAD-TOP + PLOT-H + 40}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={22}
                opacity={gridOpacity}
              >
                {month}
              </text>
            );
          })}

          {/* Vertical tick lines */}
          {MONTHS.map((month, i) => {
            const x = PAD-LEFT + (i / (MONTHS.length - 1)) * PLOT-W;
            return (
              <line
                key={`tick-${month}`}
                x1={x}
                y1={PAD-TOP + PLOT-H}
                x2={x}
                y2={PAD-TOP + PLOT-H + 8}
                stroke="#4b5563"
                strokeWidth={1}
                opacity={gridOpacity}
              />
            );
          })}

          {/* Area fill B (behind) */}
          <path
            d={buildAreaPath(SERIES-B)}
            fill="url(#gradB)"
            opacity={areaOpacity}
          />

          {/* Area fill A */}
          <path
            d={buildAreaPath(SERIES-A)}
            fill="url(#gradA)"
            opacity={areaOpacity}
          />

          {/* Line B */}
          <path
            d={buildPath(SERIES-B)}
            fill="none"
            stroke={COLOR-B}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={PATH-LENGTH-B}
            strokeDashoffset={dashOffsetB}
          />

          {/* Line A */}
          <path
            d={buildPath(SERIES-A)}
            fill="none"
            stroke={COLOR-A}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={PATH-LENGTH-A}
            strokeDashoffset={dashOffsetA}
          />

          {/* Data point dots - A */}
          {SERIES-A.map((val, i) => {
            const x = PAD-LEFT + (i / (SERIES-A.length - 1)) * PLOT-W;
            const y = PAD-TOP + PLOT-H - (val / MAX-VALUE) * PLOT-H;
            const dotOpacity = interpolate(frame, [70 + i * 4, 85 + i * 4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={`dot-a-${i}`}
                cx={x}
                cy={y}
                r={6}
                fill={COLOR-A}
                stroke="#0f0f0f"
                strokeWidth={2}
                opacity={dotOpacity}
              />
            );
          })}

          {/* Data point dots - B */}
          {SERIES-B.map((val, i) => {
            const x = PAD-LEFT + (i / (SERIES-B.length - 1)) * PLOT-W;
            const y = PAD-TOP + PLOT-H - (val / MAX-VALUE) * PLOT-H;
            const dotOpacity = interpolate(frame, [72 + i * 4, 87 + i * 4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={`dot-b-${i}`}
                cx={x}
                cy={y}
                r={5}
                fill={COLOR-B}
                stroke="#0f0f0f"
                strokeWidth={2}
                opacity={dotOpacity}
              />
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};