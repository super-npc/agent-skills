import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TESTIMONIALS = [
  {
    name: "陳小明",
    role: "前端工程師",
    stars: 5,
    text: "用 Remotion 做動畫比 After Effects 快 5 倍！強烈推薦。",
    color: "#3b82f6",
  },
  {
    name: "林美華",
    role: "UI/UX 設計師",
    stars: 5,
    text: "終於可以用 code 控制每一幀，設計師的夢想！",
    color: "#ec4899",
  },
  {
    name: "王大偉",
    role: "影片創作者",
    stars: 4,
    text: "學習曲線不高，一週就能做出專業動畫。",
    color: "#10b981",
  },
  {
    name: "張志遠",
    role: "產品經理",
    stars: 5,
    text: "幫我們節省了大量的影片製作預算，非常值得。",
    color: "#f59e0b",
  },
  {
    name: "李雅婷",
    role: "行銷總監",
    stars: 5,
    text: "社群媒體的動態素材製作效率提升了 300%。",
    color: "#8b5cf6",
  },
  {
    name: "吳建國",
    role: "新創創辦人",
    stars: 4,
    text: "一個人就能完成以前需要整個團隊才能做的事。",
    color: "#06b6d4",
  },
];

const COLS = 3;
const ROWS = 2;
const CARD-W = 560;
const CARD-H = 200;
const COL-GAP = 30;
const ROW-GAP = 28;
const GRID-W = COLS * CARD-W + (COLS - 1) * COL-GAP;
const GRID-H = ROWS * CARD-H + (ROWS - 1) * ROW-GAP;
const GRID-LEFT = (1920 - GRID-W) / 2;
const GRID-TOP = 100 + (1080 - 100 - GRID-H) / 2;

const INITIALS = TESTIMONIALS.map((t) => t.name.slice(0, 1));

const GRID-POSITIONS = TESTIMONIALS.map((_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

export const TestimonialWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardProgressList = TESTIMONIALS.map((_, i) => {
    const startFrame = i * 12 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 20, stiffness: 160 },
      durationInFrames: 18,
    });
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 4,
              height: 32,
              background: "linear-gradient(180deg, #f59e0b, #ec4899)",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: 2,
            }}
          >
            使用者評價
          </span>
          <div
            style={{
              width: 4,
              height: 32,
              background: "linear-gradient(180deg, #3b82f6, #8b5cf6)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {TESTIMONIALS.map((t, i) => {
        const progress = cardProgressList[i];
        const { col, row } = GRID-POSITIONS[i];

        const scale = interpolate(progress, [0, 1], [0.85, 1]);
        const opacity = interpolate(progress, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        });

        const cardLeft = GRID-LEFT + col * (CARD-W + COL-GAP);
        const cardTop = GRID-TOP + row * (CARD-H + ROW-GAP);
        const starStartFrame = i * 12 + 5 + 15;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cardLeft,
              top: cardTop,
              width: CARD-W,
              height: CARD-H,
              background: "#1a1a1a",
              borderRadius: 16,
              border: `1px solid rgba(255,255,255,0.07)`,
              boxSizing: "border-box",
              padding: "20px 22px",
              transform: `scale(${scale})`,
              opacity,
              boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: t.color,
                borderRadius: "16px 16px 0 0",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: t.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#ffffff",
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${t.color}66`,
                }}
              >
                {INITIALS[i]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                    marginBottom: 3,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#71717a",
                    fontWeight: 400,
                  }}
                >
                  {t.role}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 2,
                  flexShrink: 0,
                }}
              >
                {Array.from({ length: 5 }).map((_, si) => {
                  const starFrame = starStartFrame + si * 5;
                  const starProgress = spring({
                    frame: frame - starFrame,
                    fps,
                    config: { damping: 14, stiffness: 300 },
                    durationInFrames: 10,
                  });
                  const starScale = interpolate(starProgress, [0, 1], [0, 1]);
                  const starOpacity = interpolate(
                    starProgress,
                    [0, 0.4],
                    [0, 1],
                    { extrapolateRight: "clamp" }
                  );
                  const filled = si < t.stars;
                  return (
                    <span
                      key={si}
                      style={{
                        fontSize: 16,
                        transform: `scale(${starScale})`,
                        display: "inline-block",
                        opacity: starOpacity,
                        color: filled ? "#fbbf24" : "#3f3f46",
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                fontSize: 15,
                color: "#a1a1aa",
                lineHeight: 1.55,
                fontStyle: "italic",
              }}
            >
              「{t.text}」
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};