import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const SEGMENTS = [
  { label: "產品銷售", value: 42, color: "#3b82f6" },
  { label: "服務收入", value: 28, color: "#8b5cf6" },
  { label: "廣告收益", value: 18, color: "#f59e0b" },
  { label: "其他", value: 12, color: "#10b981" },
];

const RADIUS = 200;
const STROKE-WIDTH = 70;
const CENTER = 300;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Precompute cumulative rotations (in degrees) for each segment
const SEGMENT-ROTATIONS: number[] = [];
let cumulative = 0;
for (const seg of SEGMENTS) {
  SEGMENT-ROTATIONS.push(cumulative * 3.6 - 90); // degrees, starting from top
  cumulative += seg.value;
}

export const PieDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  const centerProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 28, stiffness: 60 },
  });
  const centerScale = interpolate(centerProgress, [0, 1], [0.4, 1], {
    extrapolateRight: "clamp",
  });
  const centerOpacity = interpolate(centerProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Compute total displayed percentage
  const totalPercent = Math.round(
    interpolate(centerProgress, [0, 1], [0, 100], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
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
          收入結構分析
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 22,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          各類別佔比分布
        </div>
      </div>

      {/* Main layout: donut + legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 100,
          marginTop: 40,
        }}
      >
        {/* SVG Donut */}
        <div style={{ position: "relative", width: CENTER * 2, height: CENTER * 2 }}>
          <svg
            width={CENTER * 2}
            height={CENTER * 2}
            viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
          >
            {/* Background track */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#1f2937"
              strokeWidth={STROKE-WIDTH}
            />

            {SEGMENTS.map((seg, index) => {
              const startFrame = index * 10;
              const segProgress = spring({
                frame: Math.max(0, frame - startFrame),
                fps,
                config: { damping: 26, stiffness: 70 },
              });
              const filledLength = interpolate(
                segProgress,
                [0, 1],
                [0, (seg.value / 100) * CIRCUMFERENCE],
                { extrapolateRight: "clamp" }
              );
              const dashArray = `${filledLength} ${CIRCUMFERENCE}`;
              const rotation = SEGMENT-ROTATIONS[index];

              return (
                <circle
                  key={seg.label}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={STROKE-WIDTH}
                  strokeDasharray={dashArray}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: `${CENTER}px ${CENTER}px`,
                    filter: `drop-shadow(0 0 12px ${seg.color}88)`,
                  }}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: centerOpacity,
              transform: `scale(${centerScale})`,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              {totalPercent}%
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 22,
                color: "#9ca3af",
                letterSpacing: "0.04em",
              }}
            >
              總佔比
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {SEGMENTS.map((seg, index) => {
            const startFrame = index * 10 + 15;
            const legendProgress = spring({
              frame: Math.max(0, frame - startFrame),
              fps,
              config: { damping: 30, stiffness: 80 },
            });
            const legendOpacity = interpolate(legendProgress, [0, 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });
            const legendX = interpolate(legendProgress, [0, 1], [40, 0]);

            return (
              <div
                key={seg.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: legendOpacity,
                  transform: `translateX(${legendX}px)`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: seg.color,
                    boxShadow: `0 0 12px ${seg.color}88`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    {seg.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: seg.color,
                      marginTop: 2,
                    }}
                  >
                    {seg.value}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};