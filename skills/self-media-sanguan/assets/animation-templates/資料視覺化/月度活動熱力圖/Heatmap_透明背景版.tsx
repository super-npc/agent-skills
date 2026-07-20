import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const ROW-LABELS = ["直播", "短片", "貼文", "Story", "廣告", "活動"];
const COL-LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月"];
const VALUES = [
  [45, 62, 78, 55, 88, 72, 95],
  [38, 45, 52, 68, 75, 58, 82],
  [72, 85, 78, 92, 88, 95, 90],
  [55, 48, 65, 70, 62, 78, 85],
  [28, 35, 42, 38, 55, 48, 62],
  [82, 78, 88, 75, 92, 85, 98],
];

const COLOR-STOPS = [
  { t: 0,   r: 30,  g: 58,  b: 95 },
  { t: 33,  r: 59,  g: 130, b: 246 },
  { t: 66,  r: 245, g: 158, b: 11 },
  { t: 100, r: 239, g: 68,  b: 68 },
];

function valueToColor(value: number): string {
  const t = Math.max(0, Math.min(100, value));
  let lo = COLOR-STOPS[0];
  let hi = COLOR-STOPS[COLOR-STOPS.length - 1];
  for (let i = 0; i < COLOR-STOPS.length - 1; i++) {
    if (t >= COLOR-STOPS[i].t && t <= COLOR-STOPS[i + 1].t) {
      lo = COLOR-STOPS[i];
      hi = COLOR-STOPS[i + 1];
      break;
    }
  }
  const range = hi.t - lo.t;
  const frac = range === 0 ? 0 : (t - lo.t) / range;
  const r = Math.round(lo.r + frac * (hi.r - lo.r));
  const g = Math.round(lo.g + frac * (hi.g - lo.g));
  const b = Math.round(lo.b + frac * (hi.b - lo.b));
  return `rgb(${r},${g},${b})`;
}

const ROWS = ROW-LABELS.length;
const COLS = COL-LABELS.length;

const CELL-SIZE = 120;
const CELL-GAP = 10;
const GRID-WIDTH = COLS * CELL-SIZE + (COLS - 1) * CELL-GAP;
const GRID-HEIGHT = ROWS * CELL-SIZE + (ROWS - 1) * CELL-GAP;

const GRID-LEFT = (1920 - GRID-WIDTH - 160) / 2;
const GRID-TOP = 200;

const LEGEND-LEFT = GRID-LEFT + GRID-WIDTH + 50;
const LEGEND-TOP = GRID-TOP + 40;
const LEGEND-HEIGHT = GRID-HEIGHT - 80;
const LEGEND-WIDTH = 26;

const LEGEND-STOPS = COLOR-STOPS.map((s) => ({
  pct: 100 - s.t,
  color: `rgb(${s.r},${s.g},${s.b})`,
}));

const LEGEND-GRADIENT = `linear-gradient(to bottom, ${LEGEND-STOPS.map((s) => `${s.color} ${s.pct}%`).join(", ")})`;

export const Heatmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 30, stiffness: 70 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em" }}>
          月度活動熱力圖
        </div>
        <div style={{ marginTop: 8, fontSize: 20, color: "#6b7280", letterSpacing: "0.08em" }}>
          各類型活動的月度互動強度分析
        </div>
      </div>

      {/* Column headers */}
      {COL-LABELS.map((label, col) => {
        const x = GRID-LEFT + col * (CELL-SIZE + CELL-GAP);
        const headerProgress = spring({
          frame: Math.max(0, frame - 5),
          fps,
          config: { damping: 30, stiffness: 80 },
        });
        const headerOpacity = interpolate(headerProgress, [0, 1], [0, 1]);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: x,
              top: GRID-TOP - 44,
              width: CELL-SIZE,
              textAlign: "center",
              fontSize: 20,
              color: "#9ca3af",
              fontWeight: 600,
              opacity: headerOpacity,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* Row labels */}
      {ROW-LABELS.map((label, row) => {
        const y = GRID-TOP + row * (CELL-SIZE + CELL-GAP);
        const rowProgress = spring({
          frame: Math.max(0, frame - 5),
          fps,
          config: { damping: 30, stiffness: 80 },
        });
        const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: GRID-LEFT - 80,
              top: y + CELL-SIZE / 2 - 14,
              width: 72,
              textAlign: "right",
              fontSize: 20,
              color: "#9ca3af",
              fontWeight: 500,
              opacity: rowOpacity,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* Cells */}
      {VALUES.map((rowVals, row) =>
        rowVals.map((val, col) => {
          const startFrame = (row * COLS + col) * 2 + 10;
          const cellProgress = spring({
            frame: Math.max(0, frame - startFrame),
            fps,
            config: { damping: 22, stiffness: 110 },
          });

          const scale = interpolate(cellProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const opacity = interpolate(cellProgress, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const x = GRID-LEFT + col * (CELL-SIZE + CELL-GAP);
          const y = GRID-TOP + row * (CELL-SIZE + CELL-GAP);
          const bgColor = valueToColor(val);

          return (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                left: x + CELL-SIZE / 2 - (CELL-SIZE * scale) / 2,
                top: y + CELL-SIZE / 2 - (CELL-SIZE * scale) / 2,
                width: CELL-SIZE * scale,
                height: CELL-SIZE * scale,
                background: bgColor,
                borderRadius: 8,
                opacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 16px ${bgColor}55`,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: val > 50 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                  opacity: scale > 0.5 ? 1 : 0,
                }}
              >
                {val}
              </span>
            </div>
          );
        })
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          left: LEGEND-LEFT,
          top: LEGEND-TOP,
          width: LEGEND-WIDTH,
          height: LEGEND-HEIGHT,
          background: LEGEND-GRADIENT,
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", left: LEGEND-LEFT + LEGEND-WIDTH + 10, top: LEGEND-TOP - 6, fontSize: 16, color: "#ef4444" }}>
        高
      </div>
      <div style={{ position: "absolute", left: LEGEND-LEFT + LEGEND-WIDTH + 10, top: LEGEND-TOP + LEGEND-HEIGHT - 10, fontSize: 16, color: "#3b82f6" }}>
        低
      </div>
      <div
        style={{
          position: "absolute",
          left: LEGEND-LEFT - 4,
          top: LEGEND-TOP - 32,
          fontSize: 16,
          color: "#6b7280",
          whiteSpace: "nowrap",
        }}
      >
        互動強度
      </div>
    </AbsoluteFill>
  );
};