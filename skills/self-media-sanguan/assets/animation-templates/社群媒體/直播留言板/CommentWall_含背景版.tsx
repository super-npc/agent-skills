import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const COMMENTS = [
  { name: "工程師 Kai", color: "#3b82f6", text: "這個動畫超讚！🔥", avatar: "linear-gradient(135deg,#667eea,#764ba2)", liked: false },
  { name: "設計師 Mei", color: "#ec4899", text: "請問用什麼工具做的？", avatar: "linear-gradient(135deg,#f093fb,#f5576c)", liked: true },
  { name: "前端新手", color: "#10b981", text: "第一次看到用 React 做影片，太神奇了", avatar: "linear-gradient(135deg,#43e97b,#38f9d7)", liked: false },
  { name: "UI Designer", color: "#f59e0b", text: "顏色搭配很好看 👍", avatar: "linear-gradient(135deg,#fa709a,#fee140)", liked: true },
  { name: "開源愛好者", color: "#8b5cf6", text: "Open source 嗎？", avatar: "linear-gradient(135deg,#a18cd1,#fbc2eb)", liked: false },
  { name: "React 粉", color: "#06b6d4", text: "React + 影片 = 完美組合！", avatar: "linear-gradient(135deg,#4facfe,#00f2fe)", liked: true },
  { name: "創作者 Tim", color: "#ef4444", text: "馬上去 star 這個 repo ⭐", avatar: "linear-gradient(135deg,#ff9a9e,#fecfef)", liked: false },
  { name: "訂閱者", color: "#84cc16", text: "已訂閱！期待更多教學影片 🎬", avatar: "linear-gradient(135deg,#a1c4fd,#c2e9fb)", liked: true },
];

const CONTAINER-WIDTH = 800;
const CONTAINER-LEFT = (1920 - CONTAINER-WIDTH) / 2;
const COMMENT-HEIGHT = 72;
const COMMENT-GAP = 10;
const MAX-VISIBLE = 6;
const TOTAL-ITEM-H = COMMENT-HEIGHT + COMMENT-GAP;
const STACK-BOTTOM = 700;

export const CommentWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleCount = COMMENTS.reduce((acc, _, i) => {
    const startFrame = i * 15 + 5;
    return frame >= startFrame ? acc + 1 : acc;
  }, 0);

  const progressList = COMMENTS.map((_, i) => {
    const startFrame = i * 15 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 20, stiffness: 180 },
      durationInFrames: 18,
    });
  });

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overflow = Math.max(0, visibleCount - MAX-VISIBLE);

  return (
    <AbsoluteFill style={{ background: "#0f0f0f", fontFamily: "sans-serif" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: CONTAINER-LEFT,
          width: CONTAINER-WIDTH,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: headerOpacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ff0000",
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
            直播留言板
          </span>
        </div>
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 14,
            color: "#aaaaaa",
          }}
        >
          {visibleCount} 則留言
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: CONTAINER-LEFT,
          width: CONTAINER-WIDTH,
          bottom: 1080 - STACK-BOTTOM,
          top: 140,
          overflow: "hidden",
        }}
      >
        {COMMENTS.map((comment, i) => {
          const startFrame = i * 15 + 5;
          if (frame < startFrame) return null;

          const progress = progressList[i];
          const stackPos = i - overflow;
          const targetY = (MAX-VISIBLE - 1 - stackPos) * TOTAL-ITEM-H;

          const slideOffset = interpolate(progress, [0, 1], [COMMENT-HEIGHT + 20, 0], {
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(progress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          const isAboveFold = stackPos < 0;
          const finalOpacity = isAboveFold ? 0 : opacity;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: targetY + slideOffset,
                width: CONTAINER-WIDTH,
                height: COMMENT-HEIGHT,
                opacity: finalOpacity,
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                padding: "0 16px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: comment.avatar,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {comment.name[0]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: comment.color,
                    marginRight: 8,
                  }}
                >
                  {comment.name}
                </span>
                <span style={{ fontSize: 15, color: "#e0e0e0" }}>
                  {comment.text}
                </span>
              </div>

              <div
                style={{
                  fontSize: 18,
                  color: comment.liked ? "#ef4444" : "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                }}
              >
                {comment.liked ? "♥" : "♡"}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: CONTAINER-LEFT,
          width: CONTAINER-WIDTH,
          bottom: 1080 - STACK-BOTTOM,
          height: 60,
          background: "linear-gradient(to top, #0f0f0f 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: CONTAINER-LEFT,
          width: CONTAINER-WIDTH,
          top: 140,
          height: 60,
          background: "linear-gradient(to bottom, #0f0f0f 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};