import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const AXES = ["技術", "溝通", "創意", "執行", "協作", "領導"];
const SERIES-A = { name: "候選人 A", values: [85, 72, 90, 78, 88, 65], color: "#3b82f6" };
const SERIES-B = { name: "候選人 B", values: [70, 88, 75, 92, 80, 85], color: "#f59e0b" };

const CX = 960;
const CY = 560;
const RADIUS = 300;
const GRID-LEVELS = [0.25, 0.5, 0.75, 1.0];
const N = AXES.length;

function axisAngle(i: number): number {
  return (i / N) * 2 * Math.PI - Math.PI / 2;
}

function getPoint(
  cx: number,
  cy: number,
  value: number,
  maxValue: number,
  radius: number,
  index: number
): { x: number; y: number } {
  const angle = axisAngle(index);
  const r = (value / maxValue) * radius;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function getGridPoint(
  cx: number,
  cy: number,
  level: number,
  radius: number,
  index: number
): { x: number; y: number } {
  const angle = axisAngle(index);
  return {
    x: cx + level * radius * Math.cos(angle),
    y: cy + level * radius * Math.sin(angle),
  };
}

function pointsToString(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function interpolatedPoints(
  cx: number,
  cy: number,
  values: number[],
  maxValue: number,
  radius: number,
  progress: number
): { x: number; y: number }[] {
  return values.map((v, i) => {
    const full = getPoint(cx, cy, v, maxValue, radius, i);
    return {
      x: cx + (full.x - cx) * progress,
      y: cy + (full.y - cy) * progress,
    };
  });
}

export const RadarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });

  const gridProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 40, stiffness: 60 },
  });

  const seriesAProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const seriesBProgress = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const legendProgress = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 28, stiffness: 90 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);
  const gridOpacity = interpolate(gridProgress, [0, 1], [0, 1]);
  const legendOpacity = interpolate(legendProgress, [0, 1], [0, 1]);

  const pointsA = interpolatedPoints(CX, CY, SERIES-A.values, 100, RADIUS, seriesAProgress);
  const pointsB = interpolatedPoints(CX, CY, SERIES-B.values, 100, RADIUS, seriesBProgress);

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        fontFamily: "sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          能力雷達圖
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          多維度能力比較分析
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox="0 0 1920 1080"
      >
        {/* Concentric hexagonal grid */}
        {GRID-LEVELS.map((level, li) => {
          const gridPoints = Array.from({ length: N }, (_, i) =>
            getGridPoint(CX, CY, level, RADIUS, i)
          );
          return (
            <polygon
              key={li}
              points={pointsToString(gridPoints)}
              fill="none"
              stroke={level === 1.0 ? "rgba(156,163,175,0.5)" : "rgba(75,85,99,0.35)"}
              strokeWidth={level === 1.0 ? 1.5 : 1}
              opacity={gridOpacity}
            />
          );
        })}

        {/* Axis lines */}
        {AXES.map((_, i) => {
          const end = getGridPoint(CX, CY, 1.0, RADIUS, i);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={end.x}
              y2={end.y}
              stroke="rgba(75,85,99,0.45)"
              strokeWidth={1}
              opacity={gridOpacity}
            />
          );
        })}

        {/* Grid level labels (25 / 50 / 75 / 100) */}
        {GRID-LEVELS.map((level, li) => {
          const labelY = CY - level * RADIUS - 8;
          return (
            <text
              key={li}
              x={CX + 6}
              y={labelY}
              fill="#4b5563"
              fontSize={16}
              fontFamily="sans-serif"
              opacity={gridOpacity}
            >
              {Math.round(level * 100)}
            </text>
          );
        })}

        {/* Series B polygon (drawn first so A is on top) */}
        <polygon
          points={pointsToString(pointsB)}
          fill={SERIES-B.color}
          fillOpacity={0.3}
          stroke={SERIES-B.color}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Series A polygon */}
        <polygon
          points={pointsToString(pointsA)}
          fill={SERIES-A.color}
          fillOpacity={0.3}
          stroke={SERIES-A.color}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data point dots — Series B */}
        {pointsB.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={SERIES-B.color}
            opacity={seriesBProgress}
          />
        ))}

        {/* Data point dots — Series A */}
        {pointsA.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={SERIES-A.color}
            opacity={seriesAProgress}
          />
        ))}

        {/* Axis labels */}
        {AXES.map((label, i) => {
          const angle = axisAngle(i);
          const labelR = RADIUS * 1.14;
          const lx = CX + labelR * Math.cos(angle);
          const ly = CY + labelR * Math.sin(angle);

          let anchor: "start" | "middle" | "end" = "middle";
          if (Math.cos(angle) > 0.2) anchor = "start";
          else if (Math.cos(angle) < -0.2) anchor = "end";

          let dy = 0;
          if (Math.sin(angle) < -0.5) dy = -8;
          else if (Math.sin(angle) > 0.5) dy = 18;

          return (
            <text
              key={i}
              x={lx}
              y={ly + dy}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#d1d5db"
              fontSize={26}
              fontWeight={600}
              fontFamily="sans-serif"
              opacity={gridOpacity}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: legendOpacity,
        }}
      >
        {[SERIES-A, SERIES-B].map((s) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                background: s.color,
                opacity: 0.85,
              }}
            />
            <span
              style={{
                fontSize: 26,
                color: "#e5e7eb",
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};