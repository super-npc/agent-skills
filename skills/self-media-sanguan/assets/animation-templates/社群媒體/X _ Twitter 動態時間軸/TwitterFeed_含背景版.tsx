import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TWEETS = [
  {
    name: "工程師 Kai",
    handle: "@kai-dev",
    time: "2h",
    verified: true,
    text: "剛發現 Remotion 可以用 React 寫影片，這真的太酷了！整個開啟新世界的感覺 🚀",
    replies: 24,
    retweets: 187,
    likes: 1423,
    views: 28400,
  },
  {
    name: "設計師 Mei",
    handle: "@mei-design",
    time: "4h",
    verified: false,
    text: "今天做了一個動態資訊圖表，用 Remotion + React 大概花了 2 小時。以前 After Effects 要花 8 小時 😅",
    replies: 31,
    retweets: 256,
    likes: 2187,
    views: 41200,
  },
  {
    name: "前端週報",
    handle: "@frontend-weekly",
    time: "6h",
    verified: true,
    text: "本週熱門：#Remotion 3.0 正式發布！支援 Lambda 渲染、React 19、以及全新的 CLI 工具。",
    replies: 18,
    retweets: 423,
    likes: 3241,
    views: 89000,
  },
  {
    name: "Open Source TW",
    handle: "@opensource-tw",
    time: "8h",
    verified: false,
    text: "推薦給所有創作者：@remotion 讓影片製作變得像寫程式一樣。GitHub 已破 20k ⭐",
    replies: 12,
    retweets: 98,
    likes: 876,
    views: 15600,
  },
];

// Avatar gradient colours per tweet (module scope)
const AVATAR-GRADIENTS = [
  "linear-gradient(135deg, #1d9bf0, #0553a1)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

// Avatar initials (module scope)
const AVATAR-INITIALS = ["K", "M", "週", "O"];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

// Card layout constants
const CARD-WIDTH = 860;
const CARD-GAP = 14;
const CARD-HEIGHT = 178;
const TOTAL-HEIGHT =
  TWEETS.length * CARD-HEIGHT + (TWEETS.length - 1) * CARD-GAP;
const CARDS-TOP = (1080 - TOTAL-HEIGHT) / 2;

export const TwitterFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Per-card slide-up spring
  const cardProgressList = TWEETS.map((_, i) => {
    const startFrame = i * 18 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 22, stiffness: 150 },
      durationInFrames: 20,
    });
  });

  // Stats count-up after each card appears (starts ~18 frames after card slide-in)
  const statsProgressList = TWEETS.map((_, i) => {
    const start = i * 18 + 5 + 18;
    return interpolate(frame, [start, start + 35], [0, 1], {
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
      {/* X brand mark top-right */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 80,
          fontSize: 44,
          color: "rgba(255,255,255,0.15)",
          fontWeight: 900,
        }}
      >
        𝕏
      </div>

      {/* Tweet cards */}
      {TWEETS.map((tweet, i) => {
        const progress = cardProgressList[i];
        const statsProgress = statsProgressList[i];

        const translateY = interpolate(progress, [0, 1], [60, 0]);
        const opacity = interpolate(progress, [0, 0.35], [0, 1], {
          extrapolateRight: "clamp",
        });

        const cardTop = CARDS-TOP + i * (CARD-HEIGHT + CARD-GAP);

        const currentLikes = Math.round(statsProgress * tweet.likes);
        const currentRetweets = Math.round(statsProgress * tweet.retweets);
        const currentViews = Math.round(statsProgress * tweet.views);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cardTop,
              width: CARD-WIDTH,
              background: "#16181c",
              border: "1px solid #2f3336",
              borderRadius: 16,
              padding: "20px 28px",
              boxSizing: "border-box",
              transform: `translateY(${translateY}px)`,
              opacity,
            }}
          >
            {/* Header row: avatar + name + handle + timestamp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 12,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: AVATAR-GRADIENTS[i],
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {AVATAR-INITIALS[i]}
              </div>

              {/* Name + handle */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "nowrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#e7e9ea",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tweet.name}
                  </span>
                  {tweet.verified && (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#1d9bf0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#ffffff",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 15,
                      color: "#71767b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tweet.handle} · {tweet.time}
                  </span>
                </div>
              </div>

              {/* X logo */}
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                𝕏
              </div>
            </div>

            {/* Tweet text */}
            <div
              style={{
                fontSize: 17,
                color: "#e7e9ea",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              {tweet.text}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: 0,
                alignItems: "center",
                borderTop: "1px solid #2f3336",
                paddingTop: 12,
              }}
            >
              {[
                { icon: "💬", value: tweet.replies, label: "" },
                { icon: "🔁", value: currentRetweets, label: "" },
                { icon: "♡", value: currentLikes, label: "" },
                { icon: "📊", value: currentViews, label: "" },
              ].map(({ icon, value }, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#71767b",
                    fontSize: 14,
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontWeight: 600, color: "#8b949e" }}>
                    {formatCount(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};