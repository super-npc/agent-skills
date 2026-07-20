import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const USERNAME = "username";
const REPO-NAME = "awesome-project";
const DESCRIPTION = "一個超棒的開源專案，讓開發者更高效地完成工作。歡迎 Star ⭐";
const TOPICS = ["TypeScript", "React", "Animation", "Open Source"];
const STARS = 2400;
const FORKS = 342;
const WATCHERS = 1800;
const LICENSE = "MIT";
const LAST-UPDATE = "3 小時前";
const LANGUAGE = "TypeScript";
const LANG-PERCENT = "94.2%";

export const GithubRepoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card scale + fade in: frames 0-18
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
    durationInFrames: 18,
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header (logo + url): fade in, frames 8-22
  const headerOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Repo name: slide from left, frames 18-32
  const repoNameProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 14,
  });
  const repoNameX = interpolate(repoNameProgress, [0, 1], [-40, 0]);
  const repoNameOpacity = interpolate(repoNameProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Description: fade in, frames 28-44
  const descOpacity = interpolate(frame, [28, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Topic tags: pop in one by one, frames 38-65 (stagger 5 frames)
  const tagScales = TOPICS.map((_, i) => {
    const p = spring({
      frame: frame - (38 + i * 5),
      fps,
      config: { damping: 16, stiffness: 220 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  });

  // Stats count up: frames 55-90
  const statsRaw = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentStars = Math.round(statsRaw * STARS);
  const currentForks = Math.round(statsRaw * FORKS);
  const currentWatchers = Math.round(statsRaw * WATCHERS);

  // Bottom bar: fade in, frames 75-88
  const bottomOpacity = interpolate(frame, [75, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  function formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          background: "#0d1117",
          border: "1px solid #30363d",
          borderRadius: 12,
          padding: "32px 40px",
          width: 860,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header: octocat + github.com */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            opacity: headerOpacity,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f0f6fc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ⑂
          </div>
          <span style={{ fontSize: 15, color: "#8b949e", fontWeight: 500 }}>
            github.com
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#21262d",
            marginBottom: 24,
            opacity: headerOpacity,
          }}
        />

        {/* Repo name */}
        <div
          style={{
            transform: `translateX(${repoNameX}px)`,
            opacity: repoNameOpacity,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 400, color: "#8b949e" }}>
            {USERNAME}
          </span>
          <span style={{ fontSize: 26, fontWeight: 400, color: "#8b949e" }}>
            {" / "}
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#f0f6fc" }}>
            {REPO-NAME}
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 16,
            color: "#8b949e",
            lineHeight: 1.6,
            marginBottom: 20,
            opacity: descOpacity,
          }}
        >
          {DESCRIPTION}
        </div>

        {/* Topic tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {TOPICS.map((topic, i) => (
            <div
              key={topic}
              style={{
                transform: `scale(${tagScales[i]})`,
                background: "transparent",
                border: "1px solid #30363d",
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 14,
                color: "#58a6ff",
                fontWeight: 500,
              }}
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#21262d",
            marginBottom: 20,
            opacity: statsRaw > 0 ? 1 : 0,
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 28,
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          {[
            { icon: "⭐", value: currentStars },
            { icon: "🍴", value: currentForks },
            { icon: "👁", value: currentWatchers },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#8b949e",
                fontSize: 15,
                opacity: statsRaw,
              }}
            >
              <span style={{ fontSize: 18 }}>{stat.icon}</span>
              <span style={{ fontWeight: 600, color: "#f0f6fc" }}>
                {formatCount(stat.value)}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#8b949e",
              fontSize: 15,
              opacity: statsRaw,
            }}
          >
            <span>📄 {LICENSE}</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: bottomOpacity,
          }}
        >
          <span style={{ fontSize: 14, color: "#8b949e" }}>
            上次更新：{LAST-UPDATE}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#3178c6",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 14, color: "#8b949e" }}>
              {LANGUAGE} {LANG-PERCENT}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};