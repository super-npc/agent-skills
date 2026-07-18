import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const STORIES = [
  { name: "你的限動", gradient: "linear-gradient(135deg,#667eea,#764ba2)", ring: "add", seen: false },
  { name: "design.tw", gradient: "linear-gradient(135deg,#f093fb,#f5576c)", ring: "unseen", seen: false },
  { name: "kai-dev", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)", ring: "unseen", seen: false },
  { name: "travel-mei", gradient: "linear-gradient(135deg,#43e97b,#38f9d7)", ring: "seen", seen: true },
  { name: "foodie.tw", gradient: "linear-gradient(135deg,#fa709a,#fee140)", ring: "unseen", seen: false },
  { name: "前端週報", gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)", ring: "seen", seen: true },
  { name: "oss-tw", gradient: "linear-gradient(135deg,#ffecd2,#fcb69f)", ring: "unseen", seen: false },
  { name: "react-tw", gradient: "linear-gradient(135deg,#a1c4fd,#c2e9fb)", ring: "unseen", seen: false },
];

const AVATAR-SIZE = 96;
const RING-SIZE = AVATAR-SIZE + 16;
const ITEM-WIDTH = 120;
const ITEM-GAP = 40;
const TOTAL-WIDTH = STORIES.length * ITEM-WIDTH + (STORIES.length - 1) * ITEM-GAP;
const START-X = (1920 - TOTAL-WIDTH) / 2;
const CENTER-Y = 540;

const UNSEEN-RING = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";
const LIVE-INDEX = 1;

export const StoriesRow: React.FC = () => {
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

  const storyProgressList = STORIES.map((_, i) => {
    const startFrame = i * 8 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 16, stiffness: 170 },
      durationInFrames: 20,
    });
  });

  const notifProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 16,
  });
  const notifScale = interpolate(notifProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });
  const notifOpacity = interpolate(notifProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pulseOpacity =
    frame >= 80
      ? interpolate(((frame - 80) % 20) / 20, [0, 0.5, 1], [1, 0.3, 1], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill style={{ background: "#0f0f0f", fontFamily: "sans-serif" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: START-X,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 4,
            height: 24,
            background: "linear-gradient(180deg,#f09433,#bc1888)",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 2,
          }}
        >
          限時動態
        </span>
      </div>

      {STORIES.map((story, i) => {
        const itemX = START-X + i * (ITEM-WIDTH + ITEM-GAP);
        const itemCenterX = itemX + ITEM-WIDTH / 2;
        const progress = storyProgressList[i];

        const scale = interpolate(progress, [0, 1], [0.2, 1], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(progress, [0, 0.25], [0, 1], {
          extrapolateRight: "clamp",
        });

        const ringGradient =
          story.ring === "seen" ? "#3a3a3a" : story.ring === "add" ? "linear-gradient(135deg,#667eea,#764ba2)" : UNSEEN-RING;

        const isLive = i === LIVE-INDEX;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: itemCenterX - ITEM-WIDTH / 2,
              top: CENTER-Y - 80,
              width: ITEM-WIDTH,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: RING-SIZE,
                height: RING-SIZE,
                borderRadius: "50%",
                padding: 3,
                background: ringGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: RING-SIZE - 6,
                  height: RING-SIZE - 6,
                  borderRadius: "50%",
                  background: "#0f0f0f",
                  padding: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: AVATAR-SIZE,
                    height: AVATAR-SIZE,
                    borderRadius: "50%",
                    background: story.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: story.ring === "add" ? 36 : 28,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {story.ring === "add" ? "+" : story.name[0]}
                </div>
              </div>

              {isLive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#ff0000",
                    border: "2px solid #0f0f0f",
                    opacity: pulseOpacity,
                  }}
                />
              )}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                color: story.seen ? "#777777" : "#eeeeee",
                fontWeight: story.ring === "add" ? 700 : 500,
                textAlign: "center",
                maxWidth: ITEM-WIDTH,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {story.name}
            </div>

            {isLive && frame >= 80 && (
              <div
                style={{
                  marginTop: 4,
                  background: "#ff0000",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: 1,
                  opacity: pulseOpacity,
                }}
              >
                直播中
              </div>
            )}
          </div>
        );
      })}

      {frame >= 80 && (
        <div
          style={{
            position: "absolute",
            left: START-X + 1 * (ITEM-WIDTH + ITEM-GAP) + ITEM-WIDTH / 2 + 50,
            top: CENTER-Y - 100,
            background: "rgba(30,30,30,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "10px 18px",
            opacity: notifOpacity,
            transform: `scale(${notifScale})`,
            transformOrigin: "left center",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
            🔴 design.tw 正在直播
          </div>
          <div style={{ fontSize: 11, color: "#aaaaaa", marginTop: 3 }}>
            點擊觀看限時直播
          </div>
          <div
            style={{
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "8px solid rgba(30,30,30,0.95)",
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};