import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const STATS = [
  {
    platform: "YouTube",
    icon: "▶",
    color: "#ff0000",
    bg: "#1a0000",
    main: 28400,
    mainLabel: "訂閱者",
    metrics: ["12萬 次觀看", "4.8% 互動率"],
  },
  {
    platform: "Instagram",
    icon: "◎",
    color: "#e1306c",
    bg: "#1a0010",
    main: 15200,
    mainLabel: "追蹤者",
    metrics: ["8.2% 觸及率", "342 平均按讚"],
  },
  {
    platform: "X (Twitter)",
    icon: "✕",
    color: "#1d9bf0",
    bg: "#001a2a",
    main: 9840,
    mainLabel: "追蹤者",
    metrics: ["2.1% 互動率", "187 平均轉推"],
  },
  {
    platform: "TikTok",
    icon: "♪",
    color: "#69c9d0",
    bg: "#001a1a",
    main: 42100,
    mainLabel: "粉絲",
    metrics: ["18.4萬 觀看", "12.3% 互動率"],
  },
  {
    platform: "LinkedIn",
    icon: "in",
    color: "#0a66c2",
    bg: "#001020",
    main: 6320,
    mainLabel: "連結",
    metrics: ["3.4萬 曝光", "5.2% 點擊率"],
  },
  {
    platform: "GitHub",
    icon: "⑂",
    color: "#6e40c9",
    bg: "#0d001a",
    main: 2840,
    mainLabel: "Stars",
    metrics: ["142 Forks", "28 貢獻者"],
  },
];

const COLS = 3;
const ROWS = 2;
const CARD-W = 560;
const CARD-H = 240;
const COL-GAP = 30;
const ROW-GAP = 28;
const GRID-W = COLS * CARD-W + (COLS - 1) * COL-GAP;
const GRID-H = ROWS * CARD-H + (ROWS - 1) * ROW-GAP;
const GRID-LEFT = (1920 - GRID-W) / 2;
const GRID-TOP = 80 + (1080 - 80 - GRID-H) / 2;

const GRID-POSITIONS = STATS.map((_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "萬";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export const SocialStatsWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardProgressList = STATS.map((_, i) => {
    const startFrame = i * 12 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 20, stiffness: 150 },
      durationInFrames: 18,
    });
  });

  const countProgressList = STATS.map((_, i) => {
    const start = i * 12 + 5 + 15;
    return interpolate(frame, [start, start + 60], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  return (
    <AbsoluteFill
      style={{
        background: "#080808",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: headerOpacity,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "rgba(255,255,255,0.18)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          社群媒體數據總覽
        </span>
      </div>

      {STATS.map((stat, i) => {
        const progress = cardProgressList[i];
        const countProgress = countProgressList[i];
        const { col, row } = GRID-POSITIONS[i];

        const scale = interpolate(progress, [0, 1], [0.88, 1]);
        const opacity = interpolate(progress, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        });

        const cardLeft = GRID-LEFT + col * (CARD-W + COL-GAP);
        const cardTop = GRID-TOP + row * (CARD-H + ROW-GAP);
        const currentMain = Math.round(countProgress * stat.main);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cardLeft,
              top: cardTop,
              width: CARD-W,
              height: CARD-H,
              background: stat.bg,
              borderRadius: 16,
              border: `1px solid ${stat.color}33`,
              boxSizing: "border-box",
              padding: "22px 24px",
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 4px 40px ${stat.color}22`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${stat.color}30 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${stat.color}22`,
                    border: `1px solid ${stat.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 900,
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {stat.platform}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#0d2e1a",
                  border: "1px solid #22c55e44",
                  borderRadius: 20,
                  padding: "4px 12px",
                }}
              >
                <span style={{ fontSize: 13, color: "#22c55e" }}>↑</span>
                <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                  成長中
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: 4,
                  letterSpacing: -1,
                }}
              >
                {formatCount(currentMain)}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 500,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {stat.mainLabel}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                borderTop: `1px solid ${stat.color}22`,
                paddingTop: 12,
              }}
            >
              {stat.metrics.map((m, mi) => (
                <div
                  key={mi}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontWeight: 500,
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};