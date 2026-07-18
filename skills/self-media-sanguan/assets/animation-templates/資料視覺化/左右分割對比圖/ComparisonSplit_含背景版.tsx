import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const LEFT = {
  title: "2024 年",
  color: "#3b82f6",
  metrics: [
    { label: "總營收", value: 4850000, unit: "元" },
    { label: "新用戶", value: 23400, unit: "人" },
    { label: "訂單數", value: 18750, unit: "筆" },
    { label: "滿意度", value: 88, unit: "%" },
  ],
};

const RIGHT = {
  title: "2025 年",
  color: "#8b5cf6",
  metrics: [
    { label: "總營收", value: 6320000, unit: "元" },
    { label: "新用戶", value: 31800, unit: "人" },
    { label: "訂單數", value: 25400, unit: "筆" },
    { label: "滿意度", value: 94, unit: "%" },
  ],
};

// Maximum values across both sides for bar scaling
const MAX-VALUES = LEFT.metrics.map((m, i) =>
  Math.max(m.value, RIGHT.metrics[i].value)
);

function formatNumber(value: number, unit: string): string {
  if (unit === "%" ) return value.toFixed(0) + "%";
  if (value >= 1000000) return (value / 10000).toFixed(0) + " 萬元";
  if (value >= 10000) return (value / 10000).toFixed(1) + " 萬" + unit;
  return value.toLocaleString() + " " + unit;
}

const METRIC-FRAMES = [25, 35, 45, 55];

export const ComparisonSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Divider line scales in frames 0–20
  const dividerProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title fade in at frame 15
  const titleProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 26, stiffness: 100 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "#0f172a",
        }}
      />

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "#1a0533",
        }}
      />

      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 3,
          height: `${dividerProgress * 100}%`,
          background:
            "linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)",
          transform: "translateX(-50%)",
          boxShadow: "0 0 16px rgba(139,92,246,0.6)",
        }}
      />

      {/* Left title */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          width: "50%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: LEFT.color,
            letterSpacing: "0.04em",
          }}
        >
          {LEFT.title}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            color: "#64748b",
            letterSpacing: "0.06em",
          }}
        >
          年度業績總覽
        </div>
      </div>

      {/* Right title */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 0,
          width: "50%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: RIGHT.color,
            letterSpacing: "0.04em",
          }}
        >
          {RIGHT.title}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            color: "#6d28d9",
            letterSpacing: "0.06em",
          }}
        >
          年度業績總覽
        </div>
      </div>

      {/* Left metrics */}
      {LEFT.metrics.map((metric, index) => {
        const startFrame = METRIC-FRAMES[index];
        const metricProgress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 24, stiffness: 105 },
        });

        const slideX = interpolate(metricProgress, [0, 1], [-120, 0], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(metricProgress, [0, 0.5], [0, 1], {
          extrapolateRight: "clamp",
        });

        const countedValue = interpolate(
          frame,
          [30, 100],
          [0, metric.value],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const displayValue = Math.round(countedValue);
        const barWidth = (metric.value / MAX-VALUES[index]) * 280;

        return (
          <div
            key={metric.label}
            style={{
              position: "absolute",
              left: 80,
              top: 230 + index * 160,
              width: "calc(50% - 100px)",
              opacity,
              transform: `translateX(${slideX}px)`,
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: 22,
                color: "#94a3b8",
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.04em",
              }}
            >
              {metric.label}
            </div>

            {/* Animated number */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: LEFT.color,
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {formatNumber(displayValue, metric.unit)}
            </div>

            {/* Bar */}
            <div
              style={{
                height: 6,
                width: 320,
                background: "rgba(59,130,246,0.15)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: barWidth,
                  background: `linear-gradient(90deg, ${LEFT.color} 0%, ${LEFT.color}88 100%)`,
                  borderRadius: 3,
                  boxShadow: `0 0 8px ${LEFT.color}66`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Right metrics */}
      {RIGHT.metrics.map((metric, index) => {
        const startFrame = METRIC-FRAMES[index];
        const metricProgress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 24, stiffness: 105 },
        });

        const slideX = interpolate(metricProgress, [0, 1], [120, 0], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(metricProgress, [0, 0.5], [0, 1], {
          extrapolateRight: "clamp",
        });

        const countedValue = interpolate(
          frame,
          [30, 100],
          [0, metric.value],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const displayValue = Math.round(countedValue);
        const barWidth = (metric.value / MAX-VALUES[index]) * 280;

        return (
          <div
            key={metric.label}
            style={{
              position: "absolute",
              right: 80,
              top: 230 + index * 160,
              width: "calc(50% - 100px)",
              opacity,
              transform: `translateX(${slideX}px)`,
              textAlign: "right",
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: 22,
                color: "#a78bfa",
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.04em",
              }}
            >
              {metric.label}
            </div>

            {/* Animated number */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: RIGHT.color,
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {formatNumber(displayValue, metric.unit)}
            </div>

            {/* Bar (right-aligned) */}
            <div
              style={{
                height: 6,
                width: 320,
                background: "rgba(139,92,246,0.15)",
                borderRadius: 3,
                overflow: "hidden",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: barWidth,
                  background: `linear-gradient(270deg, ${RIGHT.color} 0%, ${RIGHT.color}88 100%)`,
                  borderRadius: 3,
                  marginLeft: "auto",
                  boxShadow: `0 0 8px ${RIGHT.color}66`,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};