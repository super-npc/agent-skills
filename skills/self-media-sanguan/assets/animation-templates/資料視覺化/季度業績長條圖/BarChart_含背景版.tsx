import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const DATA = [
  { label: "Q1", value: 68, color: "#3b82f6" },
  { label: "Q2", value: 85, color: "#8b5cf6" },
  { label: "Q3", value: 72, color: "#06b6d4" },
  { label: "Q4", value: 95, color: "#10b981" },
  { label: "Q5", value: 58, color: "#f59e0b" },
  { label: "Q6", value: 88, color: "#ec4899" },
];

const CHART-WIDTH = 1100;
const CHART-HEIGHT = 560;
const BAR-GAP = 40;
const MAX-VALUE = 100;
const GRID-LINES = [0, 25, 50, 75, 100];

const BAR-WIDTH = (CHART-WIDTH - BAR-GAP * (DATA.length + 1)) / DATA.length;

export const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

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
          季度業績
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          各季銷售表現概覽
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: (1920 - CHART-WIDTH) / 2,
          width: CHART-WIDTH,
          height: CHART-HEIGHT,
        }}
      >
        {/* Y-axis grid lines */}
        {GRID-LINES.map((gridVal) => {
          const yPos = CHART-HEIGHT - (gridVal / MAX-VALUE) * CHART-HEIGHT;
          const gridProgress = spring({
            frame,
            fps,
            config: { damping: 40, stiffness: 60 },
          });
          const gridOpacity = interpolate(gridProgress, [0, 1], [0, 1]);
          return (
            <div key={gridVal}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: yPos,
                  height: 1,
                  background:
                    gridVal === 0 ? "#4b5563" : "rgba(75,85,99,0.4)",
                  opacity: gridOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -52,
                  top: yPos - 12,
                  fontSize: 20,
                  color: "#6b7280",
                  opacity: gridOpacity,
                  textAlign: "right",
                  width: 44,
                }}
              >
                {gridVal}
              </div>
            </div>
          );
        })}

        {/* Bars */}
        {DATA.map((item, index) => {
          const startFrame = index * 12;
          const barProgress = spring({
            frame: Math.max(0, frame - startFrame),
            fps,
            config: { damping: 22, stiffness: 90 },
          });

          const barHeight = interpolate(
            barProgress,
            [0, 1],
            [0, (item.value / MAX-VALUE) * CHART-HEIGHT]
          );
          const labelOpacity = interpolate(barProgress, [0.3, 0.7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const displayValue = Math.round(
            interpolate(barProgress, [0, 1], [0, item.value], {
              extrapolateRight: "clamp",
            })
          );

          const x = BAR-GAP + index * (BAR-WIDTH + BAR-GAP);

          return (
            <div key={item.label}>
              {/* Bar */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  bottom: 0,
                  width: BAR-WIDTH,
                  height: barHeight,
                  background: `linear-gradient(180deg, ${item.color}ff 0%, ${item.color}99 100%)`,
                  borderRadius: "6px 6px 0 0",
                  boxShadow: `0 0 24px ${item.color}55`,
                }}
              />

              {/* Value label on top of bar */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  bottom: barHeight + 10,
                  width: BAR-WIDTH,
                  textAlign: "center",
                  fontSize: 26,
                  fontWeight: 700,
                  color: item.color,
                  opacity: labelOpacity,
                }}
              >
                {displayValue}
              </div>

              {/* X-axis category label */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  bottom: -38,
                  width: BAR-WIDTH,
                  textAlign: "center",
                  fontSize: 24,
                  color: "#9ca3af",
                  opacity: labelOpacity,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};