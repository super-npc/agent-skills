import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const POSTS = [
  {
    sub: "r/webdev",
    user: "u/remotion-fan",
    time: "3小時前",
    votes: 4821,
    comments: 342,
    title: "用 React 寫影片？Remotion 讓這件事成真了，附完整教學",
  },
  {
    sub: "r/programming",
    user: "u/typescript-lover",
    time: "5小時前",
    votes: 2341,
    comments: 187,
    title: "TypeScript 5.0 新功能讓我的開發效率提升了 30%，心得分享",
  },
  {
    sub: "r/opensource",
    user: "u/oss-tw",
    time: "8小時前",
    votes: 1876,
    comments: 124,
    title: "分享一個用 React 做的開源動畫工具，GitHub 已破 20k ⭐",
  },
  {
    sub: "r/cscareerquestions",
    user: "u/junior-dev-tw",
    time: "12小時前",
    votes: 987,
    comments: 89,
    title: "台灣前端工程師薪資調查 2025 — 整理了 500 份問卷的結果",
  },
];

const SUB-COLORS = ["#ff4500", "#ff6534", "#ff6534", "#ff4500"];

const CARD-WIDTH = 900;
const CARD-HEIGHT = 150;
const CARD-GAP = 18;
const TOTAL-HEIGHT =
  POSTS.length * CARD-HEIGHT + (POSTS.length - 1) * CARD-GAP;
const CARDS-TOP = (1080 - TOTAL-HEIGHT) / 2;

function formatVotes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export const RedditFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgressList = POSTS.map((_, i) => {
    const startFrame = i * 18 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 22, stiffness: 150 },
      durationInFrames: 20,
    });
  });

  const voteProgressList = POSTS.map((_, i) => {
    const start = i * 18 + 5 + 20;
    return interpolate(frame, [start, start + 40], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        fontFamily: "sans-serif",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#ff4500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          👽
        </div>
        <span
          style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.15)" }}
        >
          reddit
        </span>
      </div>

      {POSTS.map((post, i) => {
        const progress = cardProgressList[i];
        const voteProgress = voteProgressList[i];

        const translateY = interpolate(progress, [0, 1], [50, 0]);
        const opacity = interpolate(progress, [0, 0.35], [0, 1], {
          extrapolateRight: "clamp",
        });

        const currentVotes = Math.round(voteProgress * post.votes);
        const cardTop = CARDS-TOP + i * (CARD-HEIGHT + CARD-GAP);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cardTop,
              width: CARD-WIDTH,
              background: "#0d1117",
              border: "1px solid #343536",
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              transform: `translateY(${translateY}px)`,
              opacity,
              boxSizing: "border-box",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 54,
                background: "#161617",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "12px 0",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 18, color: "#ff4500", lineHeight: 1 }}>
                ▲
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ff4500",
                  lineHeight: 1.2,
                  textAlign: "center",
                  minWidth: 40,
                }}
              >
                {formatVotes(currentVotes)}
              </span>
              <span style={{ fontSize: 18, color: "#818384", lineHeight: 1 }}>
                ▽
              </span>
            </div>

            <div
              style={{
                flex: 1,
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  flexWrap: "nowrap",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: SUB-COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#d7dadc",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.sub}
                </span>
                <span style={{ fontSize: 13, color: "#818384", whiteSpace: "nowrap" }}>
                  · {post.user} · {post.time}
                </span>
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#d7dadc",
                  lineHeight: 1.4,
                  marginBottom: 10,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.title}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                {[
                  { icon: "💬", label: `${post.comments} 則留言` },
                  { icon: "↗", label: "分享" },
                  { icon: "🔖", label: "儲存" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 10px",
                      borderRadius: 2,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#818384",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};