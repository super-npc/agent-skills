import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TRENDS = [
  { rank: 1,  category: "科技",   tag: "#Remotion",       count: "4.2萬", hot: true },
  { rank: 2,  category: "程式",   tag: "#TypeScript",     count: "3.8萬", hot: true },
  { rank: 3,  category: "設計",   tag: "#UIDesign",       count: "2.9萬", hot: false },
  { rank: 4,  category: "台灣",   tag: "#台北科技周",      count: "2.4萬", hot: true },
  { rank: 5,  category: "娛樂",   tag: "#動漫推薦",        count: "2.1萬", hot: false },
  { rank: 6,  category: "職涯",   tag: "#工程師求職",      count: "1.8萬", hot: false },
  { rank: 7,  category: "科技",   tag: "#AI工具",          count: "1.6萬", hot: true },
  { rank: 8,  category: "新聞",   tag: "#科技新聞",        count: "1.3萬", hot: false },
];

const RANK-COLORS = [
  "#fbbf24",
  "#9ca3af",
  "#cd7c2f",
  "#6b7280",
  "#6b7280",
  "#6b7280",
  "#6b7280",
  "#6b7280",
];

const CATEGORY-COLORS: Record<string, string> = {
  科技: "#3b82f6",
  程式: "#8b5cf6",
  設計: "#ec4899",
  台灣: "#10b981",
  娛樂: "#f59e0b",
  職涯: "#06b6d4",
  新聞: "#ef4444",
};

const COLS = 2;
const ROW-H = 88;
const ROW-GAP = 12;
const COL-GAP = 40;
const COL-W = 820;
const GRID-W = COLS * COL-W + COL-GAP;
const GRID-LEFT = (1920 - GRID-W) / 2;
const GRID-TOP = 160;

const ITEM-POSITIONS = TRENDS.map((_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

export const TrendingHashtags: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
    durationInFrames: 20,
  });
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rowProgressList = TRENDS.map((_, i) => {
    const startFrame = i * 10 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 22, stiffness: 160 },
      durationInFrames: 16,
    });
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0f",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#6b7280",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Trending
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#6b7280",
          }}
        />
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          今日熱門話題
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 14,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          即時更新
        </div>
      </div>

      {TRENDS.map((trend, i) => {
        const progress = rowProgressList[i];
        const { col, row } = ITEM-POSITIONS[i];

        const translateX = interpolate(progress, [0, 1], [-60, 0]);
        const opacity = interpolate(progress, [0, 0.35], [0, 1], {
          extrapolateRight: "clamp",
        });

        const left = GRID-LEFT + col * (COL-W + COL-GAP);
        const top = GRID-TOP + row * (ROW-H + ROW-GAP);
        const catColor = CATEGORY-COLORS[trend.category] ?? "#6b7280";

        const glowOpacity = trend.hot
          ? interpolate(
              frame,
              [0, 15, 30],
              [0.4, 0.8, 0.4],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: COL-W,
              height: ROW-H,
              transform: `translateX(${translateX}px)`,
              opacity,
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: trend.hot
                ? "rgba(251,191,36,0.04)"
                : "rgba(255,255,255,0.025)",
              borderRadius: 12,
              border: `1px solid ${trend.hot ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)"}`,
              padding: "0 22px",
              boxSizing: "border-box",
              boxShadow: trend.hot
                ? `0 0 30px rgba(251,191,36,${glowOpacity * 0.3})`
                : "none",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: RANK-COLORS[i],
                minWidth: 40,
                textAlign: "center",
                lineHeight: 1,
                textShadow:
                  i < 3 ? `0 0 20px ${RANK-COLORS[i]}88` : "none",
              }}
            >
              {trend.rank}
            </div>

            <div
              style={{
                background: `${catColor}22`,
                border: `1px solid ${catColor}55`,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: catColor,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {trend.category}
            </div>

            <div
              style={{
                flex: 1,
                fontSize: 22,
                fontWeight: 800,
                color: "#ffffff",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {trend.tag}
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#71717a",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {trend.count} 則貼文
            </div>

            <div
              style={{
                flexShrink: 0,
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              {trend.hot ? "🔥" : <span style={{ color: "#22c55e" }}>↑</span>}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};