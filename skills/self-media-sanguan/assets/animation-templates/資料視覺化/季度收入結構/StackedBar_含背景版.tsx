import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Q5"];
const SERIES = [
  { name: "產品", color: "#3b82f6", values: [3200, 3800, 4100, 4600, 5200] },
  { name: "服務", color: "#10b981", values: [1800, 2100, 2400, 2200, 2800] },
  { name: "授權", color: "#8b5cf6", values: [800, 950, 880, 1100, 1300] },
];

// Precompute totals and max at module scope
const TOTALS = QUARTERS.map((_, qi) =>
  SERIES.reduce((sum, s) => sum + s.values[qi], 0)
);
const MAX-TOTAL = Math.max(...TOTALS); // 9300

const CHART-WIDTH = 1200;
const CHART-HEIGHT = 600;
const CHART-LEFT = (1920 - CHART-WIDTH) / 2;
const CHART-BOTTOM = 840;
const CHART-TOP = CHART-BOTTOM - CHART-HEIGHT;

const BAR-GAP = 48;
const BAR-WIDTH = (CHART-WIDTH - BAR-GAP * (QUARTERS.length + 1)) / QUARTERS.length;

const GRID-VALUES = [0, 2000, 4000, 6000, 8000, 10000];

function yPos(value: number): number {
  return CHART-TOP + CHART-HEIGHT - (value / MAX-TOTAL) * CHART-HEIGHT;
}

export const StackedBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });
  const legendProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 28, stiffness: 90 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);
  const legendOpacity = interpolate(legendProgress, [0, 1], [0, 1]);

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
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          季度收入結構
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          各季各業務線收入佔比分析
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 186,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 48,
          opacity: legendOpacity,
        }}
      >
        {SERIES.map((s) => (
          <div
            key={s.name}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: s.color,
              }}
            />
            <span style={{ fontSize: 24, color: "#e5e7eb", fontWeight: 600 }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      {/* Grid lines SVG */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox="0 0 1920 1080"
      >
        {GRID-VALUES.map((gv) => {
          const gy = yPos(gv);
          if (gy < CHART-TOP - 5) return null;
          return (
            <g key={gv}>
              <line
                x1={CHART-LEFT - 10}
                y1={gy}
                x2={CHART-LEFT + CHART-WIDTH}
                y2={gy}
                stroke={gv === 0 ? "rgba(156,163,175,0.5)" : "rgba(75,85,99,0.3)"}
                strokeWidth={gv === 0 ? 1.5 : 1}
              />
              <text
                x={CHART-LEFT - 18}
                y={gy + 6}
                textAnchor="end"
                fill="#6b7280"
                fontSize={18}
                fontFamily="sans-serif"
              >
                {gv === 0 ? "0" : `${(gv / 1000).toFixed(0)}K`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bars */}
      {QUARTERS.map((quarter, qi) => {
        const startFrame = qi * 15 + 10;
        const barProgress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 22, stiffness: 85 },
        });

        const total = TOTALS[qi];
        const totalBarHeight = interpolate(
          barProgress,
          [0, 1],
          [0, (total / MAX-TOTAL) * CHART-HEIGHT]
        );

        const x = CHART-LEFT + BAR-GAP + qi * (BAR-WIDTH + BAR-GAP);

        const labelOpacity = interpolate(barProgress, [0.4, 0.8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Build stacked segments bottom-up
        const segments: { color: string; name: string; heightPx: number; valuePx: number }[] = [];
        SERIES.forEach((s) => {
          const segRatio = s.values[qi] / total;
          segments.push({
            color: s.color,
            name: s.name,
            heightPx: segRatio * totalBarHeight,
            valuePx: s.values[qi],
          });
        });
        // Reverse so the first series is at bottom
        const segmentsBottomUp = [...segments].reverse();

        return (
          <div key={quarter}>
            {/* Stacked bar container — grows upward from CHART-BOTTOM */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: CHART-BOTTOM - totalBarHeight,
                width: BAR-WIDTH,
                height: totalBarHeight,
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "hidden",
                borderRadius: "5px 5px 0 0",
              }}
            >
              {segmentsBottomUp.map((seg, si) => (
                <div
                  key={si}
                  style={{
                    width: "100%",
                    height: seg.heightPx,
                    background: `linear-gradient(180deg, ${seg.color}ff 0%, ${seg.color}cc 100%)`,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTop: si > 0 ? "1px solid rgba(15,15,15,0.4)" : "none",
                    flexShrink: 0,
                  }}
                >
                  {seg.heightPx > 36 && (
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.9)",
                        textAlign: "center",
                        lineHeight: 1,
                      }}
                    >
                      {(seg.valuePx / 1000).toFixed(1)}K
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Total label above bar */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: CHART-BOTTOM - totalBarHeight - 38,
                width: BAR-WIDTH,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
                opacity: labelOpacity,
              }}
            >
              {(total / 1000).toFixed(1)}K
            </div>

            {/* Quarter label */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: CHART-BOTTOM + 14,
                width: BAR-WIDTH,
                textAlign: "center",
                fontSize: 26,
                fontWeight: 600,
                color: "#9ca3af",
                opacity: labelOpacity,
              }}
            >
              {quarter}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};