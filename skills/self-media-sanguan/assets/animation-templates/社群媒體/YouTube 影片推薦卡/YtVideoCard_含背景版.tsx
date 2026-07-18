import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const VIDEO-TITLE = "用 Remotion 製作專業影片動畫\n完整教學從入門到進階";
const CHANNEL-NAME = "Remotion 中文頻道";
const VIEWS-TARGET = 12000;
const DURATION-LABEL = "10:42";

export const YtVideoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card scale + fade: frames 0-15
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
    durationInFrames: 15,
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Thumbnail fade: frames 5-20
  const thumbOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Play button bounce: frames 18-32
  const playProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 220 },
    durationInFrames: 14,
  });
  const playScale = interpolate(playProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Duration badge fade: frames 25-35
  const durationOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title slide up: frames 28-42
  const titleProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 14,
  });
  const titleY = interpolate(titleProgress, [0, 1], [20, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Channel + metadata fade: frames 38-55
  const metaOpacity = interpolate(frame, [38, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // View count up: frames 45-80
  const viewRaw = interpolate(frame, [45, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentViews = Math.round(viewRaw * VIEWS-TARGET);

  function formatViews(n: number): string {
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "萬";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  const titleLines = VIDEO-TITLE.split("\n");

  return (
    <AbsoluteFill
      style={{
        background: "#111111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          background: "#1f1f1f",
          borderRadius: 12,
          width: 900,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: 900,
            height: 506,
            background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 35%, #0f3460 65%, #533483 100%)",
            opacity: thumbOpacity,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Subtle noise/pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(99,179,237,0.12) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(183,121,255,0.12) 0%, transparent 50%)",
            }}
          />

          {/* HD badge top-left */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(0,0,0,0.7)",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: 4,
              letterSpacing: 0.5,
            }}
          >
            HD
          </div>

          {/* Play button */}
          <div
            style={{
              transform: `scale(${playScale})`,
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderLeft: "24px solid #1f1f1f",
                marginLeft: 6,
              }}
            />
          </div>

          {/* Duration badge */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              background: "rgba(0,0,0,0.85)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: 4,
              opacity: durationOpacity,
              letterSpacing: 0.5,
            }}
          >
            {DURATION-LABEL}
          </div>
        </div>

        {/* Info row */}
        <div
          style={{
            display: "flex",
            padding: "14px 16px 18px",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          {/* Channel avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff0000, #cc0000)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              color: "#ffffff",
              opacity: metaOpacity,
              marginTop: 2,
            }}
          >
            R
          </div>

          {/* Text info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <div
              style={{
                transform: `translateY(${titleY}px)`,
                opacity: titleOpacity,
              }}
            >
              {titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#f1f1f1",
                    lineHeight: 1.4,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Channel name */}
            <div
              style={{
                fontSize: 14,
                color: "#aaaaaa",
                marginTop: 6,
                opacity: metaOpacity,
              }}
            >
              {CHANNEL-NAME}
            </div>

            {/* Metadata */}
            <div
              style={{
                fontSize: 14,
                color: "#aaaaaa",
                marginTop: 2,
                opacity: metaOpacity,
              }}
            >
              {formatViews(currentViews)} 次觀看 · 3 天前
            </div>
          </div>

          {/* Menu dots */}
          <div
            style={{
              fontSize: 22,
              color: "#aaaaaa",
              fontWeight: 700,
              letterSpacing: 1,
              opacity: metaOpacity,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            ⋮
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};