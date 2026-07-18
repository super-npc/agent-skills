import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const METRICS = [
  { label: "營收",     unit: "萬元", max: 1000, satisfactory: 700, target: 850, actual: 920, color: "#3b82f6" },
  { label: "用戶成長", unit: "%",   max: 50,   satisfactory: 30,  target: 38,  actual: 34,  color: "#10b981" },
  { label: "客戶滿意", unit: "分",  max: 100,  satisfactory: 75,  target: 85,  actual: 88,  color: "#8b5cf6" },
  { label: "轉換率",   unit: "%",   max: 15,   satisfactory: 8,   target: 11,  actual: 9.5, color: "#f59e0b" },
  { label: "留存率",   unit: "%",   max: 100,  satisfactory: 70,  target: 80,  actual: 76,  color: "#ec4899" },
];

const LABEL-W = 200;
const VALUE-W = 180;
const BAR-W = 1300;
const ROW-H = 120;
const BAR-TRACK-H = 36;
const CHART-LEFT = 210;
const CHART-TOP = 200;

export const BulletChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-24, 0]);

  const subtitleProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 30, stiffness: 60 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
        overflow: "hidden",
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
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          KPI 達成率
        </div>
      </div>

      {/* Subtitle / legend */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          opacity: subtitleOpacity,
        }}
      >
        {[
          { color: "#374151", label: "最大範圍" },
          { color: "#6b7280", label: "滿意範圍" },
          { color: "#ffffff", label: "目標線" },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: item.label === "目標線" ? 3 : 20,
                height: item.label === "目標線" ? 20 : 12,
                background: item.color,
                borderRadius: item.label === "目標線" ? 2 : 3,
              }}
            />
            <span style={{ fontSize: 18, color: "#9ca3af" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {METRICS.map((metric, index) => {
        const startFrame = index * 20 + 10;
        const actualProgress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 22, stiffness: 90 },
        });

        const rowProgress = spring({
          frame: Math.max(0, frame - startFrame + 5),
          fps,
          config: { damping: 35, stiffness: 60 },
        });

        const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);
        const rowX = interpolate(rowProgress, [0, 1], [-40, 0]);

        const actualBarW = interpolate(
          actualProgress,
          [0, 1],
          [0, (metric.actual / metric.max) * BAR-W]
        );

        const satisfactoryW = (metric.satisfactory / metric.max) * BAR-W;
        const targetX = (metric.target / metric.max) * BAR-W;

        const displayActual = interpolate(
          actualProgress,
          [0, 1],
          [0, metric.actual],
          { extrapolateRight: "clamp" }
        );

        const meetsTarget = metric.actual >= metric.target;
        const rowTop = CHART-TOP + index * ROW-H;
        const isEven = index % 2 === 0;

        return (
          <div
            key={metric.label}
            style={{
              position: "absolute",
              top: rowTop,
              left: CHART-LEFT,
              width: LABEL-W + BAR-W + VALUE-W + 40,
              height: ROW-H,
              opacity: rowOpacity,
              transform: `translateX(${rowX}px)`,
            }}
          >
            {/* Row background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isEven
                  ? "rgba(255,255,255,0.02)"
                  : "transparent",
                borderRadius: 4,
              }}
            />

            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: LABEL-W,
                height: ROW-H,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#e5e7eb",
                  letterSpacing: "0.02em",
                }}
              >
                {metric.label}
              </span>
            </div>

            {/* Bar track area */}
            <div
              style={{
                position: "absolute",
                left: LABEL-W,
                top: (ROW-H - BAR-TRACK-H) / 2,
                width: BAR-W,
                height: BAR-TRACK-H,
              }}
            >
              {/* Max range (background) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 4,
                  background: "#1f2937",
                }}
              />

              {/* Satisfactory range */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: satisfactoryW,
                  height: "100%",
                  borderRadius: "4px 0 0 4px",
                  background: "#374151",
                }}
              />

              {/* Actual bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: actualBarW,
                  height: BAR-TRACK-H * 0.55,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${metric.color}dd 0%, ${metric.color} 100%)`,
                  boxShadow: `0 0 16px ${metric.color}55`,
                }}
              />

              {/* Target line */}
              <div
                style={{
                  position: "absolute",
                  left: targetX - 2,
                  top: -4,
                  width: 3,
                  height: BAR-TRACK-H + 8,
                  background: "#ffffff",
                  borderRadius: 2,
                  boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                }}
              />
            </div>

            {/* Value label */}
            <div
              style={{
                position: "absolute",
                left: LABEL-W + BAR-W + 20,
                top: 0,
                width: VALUE-W,
                height: ROW-H,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: meetsTarget ? metric.color : "#f87171",
                  letterSpacing: "0.02em",
                }}
              >
                {metric.unit === "萬元"
                  ? Math.round(displayActual)
                  : displayActual < 10
                  ? displayActual.toFixed(1)
                  : Math.round(displayActual)}
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#6b7280",
                  marginTop: 2,
                }}
              >
                {metric.unit}
                {"　"}
                {meetsTarget ? "✓ 達標" : "✗ 未達標"}
              </span>
            </div>
          </div>
        );
      })}

      {/* Bottom axis labels */}
      <div
        style={{
          position: "absolute",
          top: CHART-TOP + METRICS.length * ROW-H + 8,
          left: CHART-LEFT + LABEL-W,
          width: BAR-W,
          display: "flex",
          justifyContent: "space-between",
          opacity: interpolate(
            spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 35, stiffness: 60 } }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            style={{ fontSize: 16, color: "#4b5563", textAlign: "center" }}
          >
            {pct}%
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};