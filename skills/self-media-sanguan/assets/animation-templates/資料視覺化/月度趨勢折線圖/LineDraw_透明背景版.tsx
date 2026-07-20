import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const LINE-A = [30, 45, 38, 62, 55, 78, 71, 88]; // 系列 A
const LINE-B = [20, 35, 48, 40, 65, 52, 80, 75]; // 系列 B
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"];

const CHART-LEFT = 100;
const CHART-TOP = 80;
const CHART-WIDTH = 900;
const CHART-HEIGHT = 480;
const MIN-VAL = 0;
const MAX-VAL = 100;
const GRID-VALUES = [0, 25, 50, 75, 100];

const COLOR-A = "#3b82f6";
const COLOR-B = "#f59e0b";

function dataToX(index: number): number {
  return CHART-LEFT + (index / (MONTHS.length - 1)) * CHART-WIDTH;
}

function dataToY(value: number): number {
  return (
    CHART-TOP +
    CHART-HEIGHT -
    ((value - MIN-VAL) / (MAX-VAL - MIN-VAL)) * CHART-HEIGHT
  );
}

function buildPath(data: number[]): string {
  return data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${dataToX(i)} ${dataToY(v)}`)
    .join(" ");
}

// Approximate path length by summing segment lengths
function approxPathLength(data: number[]): number {
  let len = 0;
  for (let i = 1; i < data.length; i++) {
    const dx = dataToX(i) - dataToX(i - 1);
    const dy = dataToY(data[i]) - dataToY(data[i - 1]);
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

// Cumulative distances for each point (for circle timing)
function cumulativeDistances(data: number[]): number[] {
  const dists = [0];
  for (let i = 1; i < data.length; i++) {
    const dx = dataToX(i) - dataToX(i - 1);
    const dy = dataToY(data[i]) - dataToY(data[i - 1]);
    dists.push(dists[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  return dists;
}

const PATH-A = buildPath(LINE-A);
const PATH-B = buildPath(LINE-B);
const LEN-A = approxPathLength(LINE-A);
const LEN-B = approxPathLength(LINE-B);
const DISTS-A = cumulativeDistances(LINE-A);
const DISTS-B = cumulativeDistances(LINE-B);

export const LineDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  // Line draw progress (starts at frame 10)
  const lineProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 40, stiffness: 50 },
  });

  const drawnLenA = interpolate(lineProgress, [0, 1], [0, LEN-A], {
    extrapolateRight: "clamp",
  });
  const drawnLenB = interpolate(lineProgress, [0, 1], [0, LEN-B], {
    extrapolateRight: "clamp",
  });

  const SVG-W = CHART-LEFT + CHART-WIDTH + 60;
  const SVG-H = CHART-TOP + CHART-HEIGHT + 60;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
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
          月度趨勢比較
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          系列 A 與系列 B 數據走勢
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: (1920 - SVG-W) / 2,
        }}
      >
        <svg
          width={SVG-W}
          height={SVG-H}
          viewBox={`0 0 ${SVG-W} ${SVG-H}`}
        >
          {/* Grid lines & Y-axis labels */}
          {GRID-VALUES.map((gv) => {
            const y = dataToY(gv);
            const gridProgress = spring({
              frame,
              fps,
              config: { damping: 40, stiffness: 60 },
            });
            const go = interpolate(gridProgress, [0, 1], [0, 1]);
            return (
              <g key={gv} opacity={go}>
                <line
                  x1={CHART-LEFT}
                  y1={y}
                  x2={CHART-LEFT + CHART-WIDTH}
                  y2={y}
                  stroke={gv === 0 ? "#4b5563" : "rgba(75,85,99,0.35)"}
                  strokeWidth={1}
                />
                <text
                  x={CHART-LEFT - 14}
                  y={y + 7}
                  fill="#6b7280"
                  fontSize={18}
                  textAnchor="end"
                >
                  {gv}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {MONTHS.map((m, i) => {
            const x = dataToX(i);
            const labelProgress = spring({
              frame: Math.max(0, frame - i * 6),
              fps,
              config: { damping: 30, stiffness: 80 },
            });
            const lo = interpolate(labelProgress, [0, 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });
            return (
              <text
                key={m}
                x={x}
                y={CHART-TOP + CHART-HEIGHT + 36}
                fill="#6b7280"
                fontSize={20}
                textAnchor="middle"
                opacity={lo}
              >
                {m}
              </text>
            );
          })}

          {/* Line A */}
          <path
            d={PATH-A}
            fill="none"
            stroke={COLOR-A}
            strokeWidth={3}
            strokeDasharray={LEN-A}
            strokeDashoffset={LEN-A - drawnLenA}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 8px ${COLOR-A}88)` }}
          />

          {/* Line B */}
          <path
            d={PATH-B}
            fill="none"
            stroke={COLOR-B}
            strokeWidth={3}
            strokeDasharray={LEN-B}
            strokeDashoffset={LEN-B - drawnLenB}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 8px ${COLOR-B}88)` }}
          />

          {/* Data point circles for Line A */}
          {LINE-A.map((v, i) => {
            const pointDist = DISTS-A[i];
            const ratio = LEN-A > 0 ? pointDist / LEN-A : 0;
            const circleProgress = spring({
              frame: Math.max(0, frame - 10 - ratio * 40),
              fps,
              config: { damping: 20, stiffness: 200 },
            });
            const cs = interpolate(circleProgress, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={dataToX(i)}
                cy={dataToY(v)}
                r={7 * cs}
                fill={COLOR-A}
                opacity={cs}
                style={{ filter: `drop-shadow(0 0 6px ${COLOR-A})` }}
              />
            );
          })}

          {/* Data point circles for Line B */}
          {LINE-B.map((v, i) => {
            const pointDist = DISTS-B[i];
            const ratio = LEN-B > 0 ? pointDist / LEN-B : 0;
            const circleProgress = spring({
              frame: Math.max(0, frame - 10 - ratio * 40),
              fps,
              config: { damping: 20, stiffness: 200 },
            });
            const cs = interpolate(circleProgress, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={dataToX(i)}
                cy={dataToY(v)}
                r={7 * cs}
                fill={COLOR-B}
                opacity={cs}
                style={{ filter: `drop-shadow(0 0 6px ${COLOR-B})` }}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {[
            { label: "系列 A", color: COLOR-A },
            { label: "系列 B", color: COLOR-B },
          ].map((item) => {
            const lp = spring({
              frame: Math.max(0, frame - 5),
              fps,
              config: { damping: 30, stiffness: 80 },
            });
            const lo = interpolate(lp, [0, 1], [0, 1]);
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: lo,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 4,
                    background: item.color,
                    borderRadius: 2,
                    boxShadow: `0 0 8px ${item.color}`,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    color: "#d1d5db",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};