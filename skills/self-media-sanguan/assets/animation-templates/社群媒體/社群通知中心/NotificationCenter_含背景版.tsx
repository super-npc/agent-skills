import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const NOTIFS = [
  { platform: "IG",  color: "#e1306c", icon: "📸", title: "design.tw 對你的貼文按讚", desc: "你上傳的照片獲得了新的互動", time: "剛剛" },
  { platform: "X",   color: "#1d9bf0", icon: "✕",  title: "你的推文被轉推了 47 次", desc: "工程師 Kai 等人轉推了你的推文", time: "2分鐘前" },
  { platform: "YT",  color: "#ff0000", icon: "▶",  title: "你的影片達到 1,000 次觀看！", desc: "恭喜！你的最新影片表現亮眼", time: "5分鐘前" },
  { platform: "GH",  color: "#6e40c9", icon: "⑂",  title: "awesome-project 獲得新的 Star", desc: "你的儲存庫累計達到 500 ⭐", time: "12分鐘前" },
  { platform: "LI",  color: "#0a66c2", icon: "in", title: "你的文章有 234 次瀏覽", desc: "本週 LinkedIn 貼文表現超過 95% 的用戶", time: "1小時前" },
  { platform: "TK",  color: "#69c9d0", icon: "♪",  title: "你的影片登上推薦頁", desc: "TikTok 演算法推薦了你的最新作品", time: "2小時前" },
];

const CARD-WIDTH = 750;
const CARD-HEIGHT = 90;
const CARD-GAP = 14;
const CARDS-LEFT = (1920 - CARD-WIDTH) / 2;
const TOTAL-H = NOTIFS.length * CARD-HEIGHT + (NOTIFS.length - 1) * CARD-GAP;
const CARDS-TOP = (1080 - TOTAL-H) / 2;
const BADGE-START = 95;

export const NotificationCenter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeProgress = spring({
    frame: frame - BADGE-START,
    fps,
    config: { damping: 12, stiffness: 220 },
    durationInFrames: 14,
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgePulse =
    frame >= BADGE-START
      ? interpolate(((frame - BADGE-START) % 24) / 24, [0, 0.5, 1], [1, 0.7, 1], {
          extrapolateRight: "clamp",
        })
      : 0;

  const cardProgressList = NOTIFS.map((_, i) => {
    const startFrame = i * 15 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 22, stiffness: 160 },
      durationInFrames: 20,
    });
  });

  return (
    <AbsoluteFill style={{ background: "#0f0f0f", fontFamily: "sans-serif" }}>
      <div
        style={{
          position: "absolute",
          top: CARDS-TOP - 70,
          left: CARDS-LEFT,
          width: CARD-WIDTH,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
          通知中心
        </span>

        <div style={{ position: "relative" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "6px 20px",
              fontSize: 14,
              color: "#aaaaaa",
            }}
          >
            今日通知
          </div>
          {frame >= BADGE-START && (
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                transform: `scale(${badgeScale * badgePulse})`,
                boxShadow: "0 0 12px rgba(239,68,68,0.6)",
              }}
            >
              6
            </div>
          )}
        </div>
      </div>

      {NOTIFS.map((notif, i) => {
        const startFrame = i * 15 + 5;
        if (frame < startFrame) return null;

        const progress = cardProgressList[i];
        const slideX = interpolate(progress, [0, 1], [300, 0], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(progress, [0, 0.25], [0, 1], {
          extrapolateRight: "clamp",
        });

        const cardY = CARDS-TOP + i * (CARD-HEIGHT + CARD-GAP);
        const glowOpacity = interpolate(progress, [0.6, 1], [0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CARDS-LEFT,
              top: cardY,
              width: CARD-WIDTH,
              height: CARD-HEIGHT,
              opacity,
              transform: `translateX(${slideX}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              borderLeft: `4px solid ${notif.color}`,
              padding: "0 20px 0 18px",
              boxShadow: `0 0 30px ${notif.color}${Math.round(glowOpacity * 60).toString(16).padStart(2, "0")}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: notif.color,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: notif.icon.length <= 2 ? 18 : 20,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {notif.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {notif.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#888888",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {notif.desc}
              </div>
            </div>

            <div
              style={{
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                color: notif.color,
                background: `${notif.color}22`,
                borderRadius: 6,
                padding: "3px 8px",
                letterSpacing: 1,
              }}
            >
              {notif.platform}
            </div>

            <div
              style={{
                flexShrink: 0,
                fontSize: 12,
                color: "#555555",
                minWidth: 70,
                textAlign: "right",
              }}
            >
              {notif.time}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};