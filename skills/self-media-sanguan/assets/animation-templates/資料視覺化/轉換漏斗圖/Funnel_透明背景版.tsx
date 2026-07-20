import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const STAGES = [
  { label: "曝光", value: 50000, color: "#3b82f6" },
  { label: "點擊", value: 28000, color: "#6366f1" },
  { label: "加入購物車", value: 12000, color: "#8b5cf6" },
  { label: "結帳", value: 5500, color: "#a855f7" },
  { label: "完成購買", value: 3200, color: "#c026d3" },
];

const MAX-VALUE = STAGES[0].value;
const STAGE-HEIGHT = 80;
const MAX-WIDTH = 900;
const MIN-WIDTH = 300;
const CANVAS-WIDTH = 1920;
const CANVAS-HEIGHT = 1080;

function formatValue(v: number): string {
  if (v >= 10000) return (v / 10000).toFixed(1) + " 萬";
  return v.toLocaleString();
}

export const Funnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  const totalHeight = STAGES.length * STAGE-HEIGHT + (STAGES.length - 1) * 16;
  const startY = (CANVAS-HEIGHT - totalHeight - 80) / 2 + 60;

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
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          轉換漏斗分析
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          電商全流程轉換率概覽
        </div>
      </div>

      {/* Funnel stages */}
      {STAGES.map((stage, index) => {
        const startFrame = index * 15 + 10;
        const stageProgress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 22, stiffness: 110 },
        });

        const opacity = interpolate(stageProgress, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        });
        const scale = interpolate(stageProgress, [0, 1], [0.8, 1], {
          extrapolateRight: "clamp",
        });

        const stageWidth =
          MIN-WIDTH +
          ((stage.value / MAX-VALUE) * (MAX-WIDTH - MIN-WIDTH));

        const nextStage = STAGES[index + 1];
        const nextWidth = nextStage
          ? MIN-WIDTH + ((nextStage.value / MAX-VALUE) * (MAX-WIDTH - MIN-WIDTH))
          : stageWidth * 0.85;

        const topInset = (MAX-WIDTH - stageWidth) / 2;
        const bottomInset = (MAX-WIDTH - nextWidth) / 2;

        const yPos = startY + index * (STAGE-HEIGHT + 16);
        const centerX = CANVAS-WIDTH / 2;

        const percentage =
          index === 0
            ? 100
            : Math.round((stage.value / STAGES[index - 1].value) * 100);

        // Conversion rate between stages
        const conversionProgress =
          index < STAGES.length - 1
            ? spring({
                frame: Math.max(0, frame - (startFrame + 15)),
                fps,
                config: { damping: 28, stiffness: 90 },
              })
            : 0;
        const conversionOpacity = interpolate(
          conversionProgress,
          [0, 0.6],
          [0, 1],
          { extrapolateRight: "clamp" }
        );
        const nextConvRate =
          nextStage
            ? Math.round((nextStage.value / stage.value) * 100)
            : null;

        return (
          <React.Fragment key={stage.label}>
            {/* Stage trapezoid + labels */}
            <div
              style={{
                position: "absolute",
                left: centerX - MAX-WIDTH / 2 - 220,
                top: yPos,
                width: MAX-WIDTH + 440,
                height: STAGE-HEIGHT,
                opacity,
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Left label */}
              <div
                style={{
                  width: 200,
                  textAlign: "right",
                  paddingRight: 20,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#e5e7eb",
                  }}
                >
                  {stage.label}
                </div>
                {index > 0 && (
                  <div
                    style={{
                      fontSize: 16,
                      color: stage.color,
                      marginTop: 2,
                    }}
                  >
                    {percentage}%
                  </div>
                )}
              </div>

              {/* Trapezoid */}
              <div
                style={{
                  width: MAX-WIDTH,
                  height: STAGE-HEIGHT,
                  clipPath: `polygon(${topInset}px 0%, ${stageWidth + topInset}px 0%, ${nextWidth + bottomInset}px 100%, ${bottomInset}px 100%)`,
                  background: `linear-gradient(135deg, ${stage.color}dd 0%, ${stage.color}88 100%)`,
                  boxShadow: `0 0 30px ${stage.color}44`,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {/* Stage label inside trapezoid */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {stage.label}
                  </div>
                </div>
              </div>

              {/* Right: value */}
              <div
                style={{
                  width: 220,
                  paddingLeft: 20,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {formatValue(stage.value)}
                </div>
              </div>
            </div>

            {/* Conversion rate between stages */}
            {nextConvRate !== null && (
              <div
                style={{
                  position: "absolute",
                  left: centerX + MAX-WIDTH / 2 + 20,
                  top: yPos + STAGE-HEIGHT,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  opacity: conversionOpacity,
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    color: "#9ca3af",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {nextConvRate}% →
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};