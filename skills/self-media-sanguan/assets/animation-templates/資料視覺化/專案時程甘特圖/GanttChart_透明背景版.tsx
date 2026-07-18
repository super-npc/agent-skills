import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TASKS = [
  { name: "需求分析",   start: 0,  end: 2,  color: "#3b82f6" },
  { name: "系統設計",   start: 1,  end: 4,  color: "#8b5cf6" },
  { name: "前端開發",   start: 3,  end: 9,  color: "#10b981" },
  { name: "後端開發",   start: 3,  end: 10, color: "#06b6d4" },
  { name: "整合測試",   start: 8,  end: 12, color: "#f59e0b" },
  { name: "使用者測試", start: 11, end: 13, color: "#ec4899" },
  { name: "上線部署",   start: 13, end: 14, color: "#ef4444" },
];

const TOTAL-WEEKS = 14;
const WEEK-LABELS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13","W14"];
const TODAY-WEEK = 9;

// Layout constants
const LEFT-COL-W = 240;       // task name column width
const TIMELINE-LEFT = 300;    // x start of timeline area
const TIMELINE-RIGHT = 1860;  // x end of timeline area
const TIMELINE-W = TIMELINE-RIGHT - TIMELINE-LEFT;
const HEADER-H = 120;         // top header height
const ROW-H = 80;             // height per task row
const BAR-H = 40;             // bar height within row
const CHART-TOP = HEADER-H + 60; // y coordinate of first row

function weekX(week: number) {
  return TIMELINE-LEFT + (week / TOTAL-WEEKS) * TIMELINE-W;
}

export const GanttChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleProgress = spring({ frame, fps, config: { damping: 30, stiffness: 70 } });
  const titleOpacity  = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY        = interpolate(titleProgress, [0, 1], [-30, 0]);

  // Header / grid entrance
  const headerProgress = spring({ frame, fps, config: { damping: 40, stiffness: 60 } });
  const headerOpacity  = interpolate(headerProgress, [0, 1], [0, 1]);

  // Today line fade-in at frame 80
  const todayOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalRows = TASKS.length;
  const chartH = totalRows * ROW-H;

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
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
          專案時程甘特圖
        </div>
        <div style={{ marginTop: 8, fontSize: 22, color: "#6b7280", letterSpacing: "0.06em" }}>
          14 週開發週期總覽
        </div>
      </div>

      {/* SVG chart */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox="0 0 1920 1080"
      >
        {/* Alternating row backgrounds */}
        {TASKS.map((_, rowIdx) => {
          const ry = CHART-TOP + rowIdx * ROW-H;
          return (
            <rect
              key={rowIdx}
              x={0}
              y={ry}
              width={1920}
              height={ROW-H}
              fill={rowIdx % 2 === 0 ? "#111111" : "#0f0f0f"}
              opacity={headerOpacity}
            />
          );
        })}

        {/* Vertical week grid lines */}
        {WEEK-LABELS.map((label, i) => {
          const x = weekX(i + 1);
          return (
            <g key={label} opacity={headerOpacity}>
              <line
                x1={x} y1={CHART-TOP}
                x2={x} y2={CHART-TOP + chartH}
                stroke="#2d3748"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Left boundary line */}
        <line
          x1={TIMELINE-LEFT} y1={CHART-TOP}
          x2={TIMELINE-LEFT} y2={CHART-TOP + chartH}
          stroke="#374151"
          strokeWidth={1.5}
          opacity={headerOpacity}
        />

        {/* Bottom boundary line */}
        <line
          x1={TIMELINE-LEFT} y1={CHART-TOP + chartH}
          x2={TIMELINE-RIGHT} y2={CHART-TOP + chartH}
          stroke="#374151"
          strokeWidth={1.5}
          opacity={headerOpacity}
        />

        {/* Week header labels */}
        {WEEK-LABELS.map((label, i) => {
          const x = weekX(i) + (TIMELINE-W / TOTAL-WEEKS) / 2;
          return (
            <text
              key={label}
              x={x}
              y={CHART-TOP - 16}
              textAnchor="middle"
              fill={i + 1 === TODAY-WEEK ? "#ef4444" : "#6b7280"}
              fontSize={i + 1 === TODAY-WEEK ? 20 : 18}
              fontWeight={i + 1 === TODAY-WEEK ? 700 : 400}
              opacity={headerOpacity}
            >
              {label}
            </text>
          );
        })}

        {/* Header separator line */}
        <line
          x1={TIMELINE-LEFT} y1={CHART-TOP - 4}
          x2={TIMELINE-RIGHT} y2={CHART-TOP - 4}
          stroke="#374151"
          strokeWidth={1}
          opacity={headerOpacity}
        />

        {/* Task rows */}
        {TASKS.map((task, index) => {
          const startFrame = index * 15 + 10;
          const barProgress = spring({
            frame: Math.max(0, frame - startFrame),
            fps,
            config: { damping: 22, stiffness: 90 },
          });

          const fullBarW = ((task.end - task.start) / TOTAL-WEEKS) * TIMELINE-W;
          const barW = interpolate(barProgress, [0, 1], [0, fullBarW]);
          const barOpacity = interpolate(barProgress, [0, 0.1, 1], [0, 1, 1], {
            extrapolateRight: "clamp",
          });

          const rowY = CHART-TOP + index * ROW-H;
          const barX = weekX(task.start);
          const barY = rowY + (ROW-H - BAR-H) / 2;

          const nameOpacity = interpolate(barProgress, [0, 0.4, 1], [0, 1, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <g key={task.name}>
              {/* Task name */}
              <text
                x={LEFT-COL-W + 20}
                y={rowY + ROW-H / 2 + 7}
                textAnchor="end"
                fill="#d1d5db"
                fontSize={22}
                fontWeight={500}
                opacity={nameOpacity}
              >
                {task.name}
              </text>

              {/* Gantt bar background track */}
              <rect
                x={TIMELINE-LEFT}
                y={barY}
                width={TIMELINE-W}
                height={BAR-H}
                rx={6}
                fill="#1f2937"
                opacity={barOpacity * 0.5}
              />

              {/* Gantt bar */}
              <rect
                x={barX}
                y={barY}
                width={barW}
                height={BAR-H}
                rx={6}
                fill={task.color}
                fillOpacity={0.85}
                style={{ filter: `drop-shadow(0 0 8px ${task.color}66)` }}
                opacity={barOpacity}
              />

              {/* Bar label (duration text inside bar when wide enough) */}
              {fullBarW > 120 && (
                <text
                  x={barX + Math.min(barW, fullBarW) / 2}
                  y={barY + BAR-H / 2 + 7}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={18}
                  fontWeight={600}
                  opacity={interpolate(barProgress, [0.6, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                >
                  {task.end - task.start}W
                </text>
              )}
            </g>
          );
        })}

        {/* Today line */}
        <g opacity={todayOpacity}>
          <line
            x1={weekX(TODAY-WEEK - 1)}
            y1={CHART-TOP - 8}
            x2={weekX(TODAY-WEEK - 1)}
            y2={CHART-TOP + chartH + 8}
            stroke="#ef4444"
            strokeWidth={2.5}
            strokeDasharray="8 5"
          />
          <rect
            x={weekX(TODAY-WEEK - 1) - 36}
            y={CHART-TOP - 42}
            width={72}
            height={30}
            rx={6}
            fill="#ef4444"
          />
          <text
            x={weekX(TODAY-WEEK - 1)}
            y={CHART-TOP - 22}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={18}
            fontWeight={700}
          >
            今天
          </text>
        </g>
      </svg>

      {/* Legend - color dots per task */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: TIMELINE-LEFT,
          display: "flex",
          gap: 28,
          opacity: headerOpacity,
          flexWrap: "wrap",
        }}
      >
        {TASKS.map((task) => (
          <div key={task.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: task.color,
                boxShadow: `0 0 6px ${task.color}88`,
              }}
            />
            <span style={{ color: "#9ca3af", fontSize: 18 }}>{task.name}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};