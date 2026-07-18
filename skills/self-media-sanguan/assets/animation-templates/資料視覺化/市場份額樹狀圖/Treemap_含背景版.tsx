import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const CANVAS = { x: 80, y: 90, w: 1760, h: 900 };

const TOP-ROW-H = 540;
const BOT-ROW-H = 360;

const ITEMS = [
  // top row - 4 items, widths proportional to values (total = 100 units)
  { label: "電商", value: 32, color: "#3b82f6",  x: 80,   y: 90,  w: 563, h: TOP-ROW-H },
  { label: "社群", value: 24, color: "#8b5cf6",  x: 643,  y: 90,  w: 422, h: TOP-ROW-H },
  { label: "串流", value: 18, color: "#10b981",  x: 1065, y: 90,  w: 316, h: TOP-ROW-H },
  { label: "遊戲", value: 14, color: "#f59e0b",  x: 1381, y: 90,  w: 459, h: TOP-ROW-H },
  // bottom row - 6 items
  { label: "新聞", value: 5,   color: "#06b6d4",  x: 80,   y: 630, w: 293, h: BOT-ROW-H },
  { label: "教育", value: 4,   color: "#ec4899",  x: 373,  y: 630, w: 235, h: BOT-ROW-H },
  { label: "金融", value: 1,   color: "#ef4444",  x: 608,  y: 630, w: 176, h: BOT-ROW-H },
  { label: "旅遊", value: 1,   color: "#84cc16",  x: 784,  y: 630, w: 176, h: BOT-ROW-H },
  { label: "健康", value: 0.7, color: "#f97316",  x: 960,  y: 630, w: 147, h: BOT-ROW-H },
  { label: "其他", value: 0.3, color: "#a855f7",  x: 1107, y: 630, w: 733, h: BOT-ROW-H },
];

export const Treemap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 70 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 80,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          市場份額樹狀圖
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 18,
            color: "#6b7280",
            letterSpacing: "0.06em",
          }}
        >
          各產業市場佔比概覽
        </div>
      </div>

      {/* Treemap rectangles */}
      {ITEMS.map((item, index) => {
        const startFrame = index * 10 + 5;
        const progress = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 22, stiffness: 100 },
        });

        const scale = interpolate(progress, [0, 1], [0.7, 1]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);

        const centerX = item.x + item.w / 2;
        const centerY = item.y + item.h / 2;

        const labelOpacity = interpolate(progress, [0.4, 0.8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isLarge = item.h >= TOP-ROW-H;
        const labelFontSize = isLarge ? 32 : item.w > 200 ? 24 : 18;
        const valueFontSize = isLarge ? 22 : item.w > 200 ? 16 : 13;

        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: item.w,
              height: item.h,
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: `${centerX - item.x}px ${centerY - item.y}px`,
            }}
          >
            {/* Background fill */}
            <div
              style={{
                position: "absolute",
                inset: 1,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${item.color}33 0%, ${item.color}18 100%)`,
                border: `1px solid ${item.color}55`,
                boxShadow: `inset 0 0 40px ${item.color}10`,
              }}
            />

            {/* Color accent bar top */}
            <div
              style={{
                position: "absolute",
                top: 1,
                left: 1,
                right: 1,
                height: 4,
                borderRadius: "8px 8px 0 0",
                background: item.color,
                opacity: 0.8,
              }}
            />

            {/* Label + value centered */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: labelOpacity,
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: labelFontSize,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: valueFontSize,
                  fontWeight: 500,
                  color: item.color,
                  letterSpacing: "0.06em",
                }}
              >
                {item.value}%
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};