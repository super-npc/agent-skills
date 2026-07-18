import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const POSTS = [
  { gradient: "linear-gradient(135deg, #667eea, #764ba2)", likes: 1234, user: "@design.tw" },
  { gradient: "linear-gradient(135deg, #f093fb, #f5576c)", likes: 892, user: "@photo.art" },
  { gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", likes: 2341, user: "@travel.kai" },
  { gradient: "linear-gradient(135deg, #43e97b, #38f9d7)", likes: 567, user: "@nature.shots" },
  { gradient: "linear-gradient(135deg, #fa709a, #fee140)", likes: 3102, user: "@foodie.tw" },
  { gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)", likes: 445, user: "@lifestyle" },
  { gradient: "linear-gradient(135deg, #ffecd2, #fcb69f)", likes: 1876, user: "@sunset.pics" },
  { gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)", likes: 723, user: "@portrait.tw" },
  { gradient: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", likes: 2090, user: "@street.art" },
];

const TILE-SIZE = 550;
const TILE-GAP = 16;
const COLS = 3;
const ROWS = 3;

// Pre-compute grid positions at module scope
const GRID-POSITIONS = POSTS.map((_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

const GRID-TOTAL-W = COLS * TILE-SIZE + (COLS - 1) * TILE-GAP;
const GRID-TOTAL-H = ROWS * TILE-SIZE + (ROWS - 1) * TILE-GAP;
const GRID-LEFT = (1920 - GRID-TOTAL-W) / 2;
// Reserve top 120px for header bar
const GRID-TOP = 120 + (1080 - 120 - GRID-TOTAL-H) / 2;

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export const IgMasonryWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header bar fade in at frame 0
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Each tile springs in staggered
  const tileProgressList = POSTS.map((_, i) => {
    const startFrame = i * 8 + 5;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 18, stiffness: 160 },
      durationInFrames: 18,
    });
  });

  // Glow cycling after all tiles in (frame ~80)
  const glowIndex =
    frame >= 80 ? Math.floor((frame - 80) / 15) % POSTS.length : -1;

  return (
    <AbsoluteFill style={{ background: "#0f0f0f", fontFamily: "sans-serif" }}>
      {/* IG-style header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          display: "flex",
          alignItems: "center",
          paddingLeft: GRID-LEFT,
          paddingRight: GRID-LEFT,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          gap: 20,
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          Y
        </div>
        {/* Username + follower info */}
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>
            your-profile
          </div>
          <div style={{ fontSize: 16, color: "#a8a8a8", marginTop: 2 }}>
            追蹤者 12.4K · 追蹤中 892
          </div>
        </div>
      </div>

      {/* Grid of tiles */}
      {POSTS.map((post, i) => {
        const { col, row } = GRID-POSITIONS[i];
        const x = GRID-LEFT + col * (TILE-SIZE + TILE-GAP);
        const y = GRID-TOP + row * (TILE-SIZE + TILE-GAP);

        const progress = tileProgressList[i];
        const scale = interpolate(progress, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });

        const isGlowing = glowIndex === i;
        const glowOpacity = isGlowing ? 1 : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: TILE-SIZE,
              height: TILE-SIZE,
              borderRadius: 12,
              background: post.gradient,
              transform: `scale(${scale})`,
              opacity,
              overflow: "hidden",
              boxShadow: isGlowing
                ? "0 0 0 3px #ffffff, 0 0 32px rgba(255,255,255,0.4)"
                : "0 8px 32px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.1s",
            }}
          >
            {/* Subtle grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 60px)",
              }}
            />

            {/* Glow highlight border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                border: "3px solid rgba(255,255,255,0.9)",
                opacity: glowOpacity,
                pointerEvents: "none",
              }}
            />

            {/* Like count bottom-left */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,0,0,0.45)",
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>♡</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {formatLikes(post.likes)}
              </span>
            </div>

            {/* Username bottom-right */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                background: "rgba(0,0,0,0.45)",
                borderRadius: 16,
                padding: "5px 12px",
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {post.user}
              </span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};