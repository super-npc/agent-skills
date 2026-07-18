import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 假留言資料
const fakeComments = [
  { avatar: "#3b82f6", text: "這個教學真的很有幫助，謝謝分享！" },
  { avatar: "#10b981", text: "已訂閱！期待更多影片 🎉" },
  { avatar: "#f59e0b", text: "請問有更進階的教學嗎？" },
];

// 時間軸
const QUESTION-IN    = 0;   // 大問號進場
const MAIN-TEXT-IN   = 35;  // 主問題文字
const SUB-TEXT-IN    = 65;  // 副文字
const INPUT-IN       = 90;  // 留言框
const COMMENTS-START = 110; // 假留言依序滑入
const COMMENT-STAGGER = 13;

export const CommentCtaOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── 大問號：bounce 進場 ──
  const questionSpring = spring({
    frame: frame - QUESTION-IN,
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const questionY = interpolate(questionSpring, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionOpacity = interpolate(questionSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── 主問題文字：fade in + translateY ──
  const mainTextOpacity = interpolate(frame, [MAIN-TEXT-IN, MAIN-TEXT-IN + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainTextY = interpolate(frame, [MAIN-TEXT-IN, MAIN-TEXT-IN + 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 副文字 fade in ──
  const subTextOpacity = interpolate(frame, [SUB-TEXT-IN, SUB-TEXT-IN + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 留言框：scale 0.95→1 + opacity ──
  const inputSpring = spring({
    frame: frame - INPUT-IN,
    fps,
    config: { damping: 18, stiffness: 160 },
  });
  const inputScale = interpolate(inputSpring, [0, 1], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inputOpacity = interpolate(inputSpring, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── 游標閃爍（每 15 frames 切換）──
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 大問號光暈 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -200,
          marginTop: -350,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 大問號 */}
      <div
        style={{
          transform: `translateY(${questionY}px)`,
          opacity: questionOpacity,
          fontSize: 200,
          fontWeight: 900,
          color: "#3b82f6",
          lineHeight: 1,
          marginBottom: -20,
          userSelect: "none",
        }}
      >
        ?
      </div>

      {/* 主問題文字 */}
      <div
        style={{
          opacity: mainTextOpacity,
          transform: `translateY(${mainTextY}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.3,
          marginBottom: 16,
          maxWidth: 800,
        }}
      >
        你有什麼想法嗎？
      </div>

      {/* 副文字 */}
      <div
        style={{
          opacity: subTextOpacity,
          fontSize: 28,
          color: "#94a3b8",
          fontWeight: 400,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        在下方留言告訴我們吧！
      </div>

      {/* 留言輸入框 */}
      <div
        style={{
          transform: `scale(${inputScale})`,
          opacity: inputOpacity,
          width: 700,
          height: 80,
          borderRadius: 12,
          background: "#1e293b",
          border: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          marginBottom: 40,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: "#475569",
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          新增留言…
        </span>
        <span
          style={{
            fontSize: 24,
            color: "#3b82f6",
            fontWeight: 300,
            marginLeft: 4,
            opacity: cursorVisible ? 1 : 0,
          }}
        >
          |
        </span>
      </div>

      {/* 假留言列表 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: 700,
        }}
      >
        {fakeComments.map((comment, i) => {
          const commentSpring = spring({
            frame: frame - (COMMENTS-START + i * COMMENT-STAGGER),
            fps,
            config: { damping: 18, stiffness: 140 },
          });
          const commentY = interpolate(commentSpring, [0, 1], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const commentOpacity = interpolate(commentSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                transform: `translateY(${commentY}px)`,
                opacity: commentOpacity,
              }}
            >
              {/* 頭像 */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: comment.avatar,
                  flexShrink: 0,
                }}
              />
              {/* 文字條 */}
              <div
                style={{
                  flex: 1,
                  height: 18,
                  borderRadius: 9,
                  background: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    color: "#94a3b8",
                    fontWeight: 400,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {comment.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};