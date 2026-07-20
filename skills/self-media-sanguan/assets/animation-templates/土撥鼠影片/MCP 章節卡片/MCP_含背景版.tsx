import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";

const colors = {
  background: "#0A0E14",
  text: "#FFFFFF",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const AUDIO = {
  whooshIn: staticFile("audio/connection/woosh.wav"),
  thump: staticFile("audio/connection/soft-impact.wav"),
};

export const MCP-CHAPTER-CARD-DURATION-FRAMES = 75;

const McpPlugIcon: React.FC<{ size: number; drawProgress: number }> = ({
  size,
  drawProgress,
}) => {
  const dashOffset = interpolate(drawProgress, [0, 1], [300, 0]);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect
        x="20"
        y="16"
        width="24"
        height="32"
        rx="6"
        stroke={colors.accent}
        strokeWidth={2.5}
        strokeDasharray={300}
        strokeDashoffset={dashOffset}
      />
      <line
        x1="28"
        y1="16"
        x2="28"
        y2="8"
        stroke={colors.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={30}
        strokeDashoffset={interpolate(drawProgress, [0.3, 0.7], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <line
        x1="36"
        y1="16"
        x2="36"
        y2="8"
        stroke={colors.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={30}
        strokeDashoffset={interpolate(drawProgress, [0.3, 0.7], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <circle
        cx="32"
        cy="32"
        r="4"
        fill={colors.accent}
        opacity={interpolate(drawProgress, [0.6, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </svg>
  );
};

const GitHubIcon: React.FC<{ size: number; opacity: number }> = ({
  size,
  opacity,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ opacity }}
  >
    <circle cx="24" cy="24" r="18" stroke={colors.accentSecondary} strokeWidth={2} />
    <path
      d="M20 36c-6 2-6-3-8-3m16 6v-5.3a4.6 4.6 0 00-1.3-3.6c4.4-.5 9-2.2 9-9.8a7.6 7.6 0 00-2-5.3 7.1 7.1 0 00-.2-5.2s-1.6-.5-5.3 2a18.4 18.4 0 00-9.8 0c-3.7-2.5-5.3-2-5.3-2a7.1 7.1 0 00-.2 5.2 7.6 7.6 0 00-2 5.3c0 7.6 4.6 9.3 9 9.8a4.6 4.6 0 00-1.3 3.6V36"
      stroke={colors.accentSecondary}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VercelIcon: React.FC<{ size: number; opacity: number }> = ({
  size,
  opacity,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ opacity }}
  >
    <circle cx="24" cy="24" r="18" stroke={colors.accentSecondary} strokeWidth={2} />
    <polygon
      points="24,12 38,36 10,36"
      fill="none"
      stroke={colors.accentSecondary}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </svg>
);

const ForkLines: React.FC<{ progress: number }> = ({ progress }) => {
  const lineLen = interpolate(progress, [0, 1], [0, 180]);
  const opacity = interpolate(progress, [0, 0.1], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={500}
      height={60}
      viewBox="0 0 500 60"
      fill="none"
      style={{ opacity }}
    >
      <line
        x1="250"
        y1="30"
        x2={250 - lineLen}
        y2="30"
        stroke={colors.accent}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <line
        x1="250"
        y1="30"
        x2={250 + lineLen}
        y2="30"
        stroke={colors.accent}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="250" cy="30" r="4" fill={colors.accent} />
    </svg>
  );
};

export const Scene09-McpChapterCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 160 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.95, 1]);
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconDrawProgress = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const forkProgress = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sideIconOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <Sequence from={0} durationInFrames={20}>
        <Audio src={AUDIO.whooshIn} volume={0.3} />
      </Sequence>
      <Sequence from={12} durationInFrames={20}>
        <Audio src={AUDIO.thump} volume={0.25} />
      </Sequence>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: colors.dimmed,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: labelOpacity,
            marginBottom: 24,
            fontFamily: fonts.main,
          }}
        >
          PHASE 3
        </div>

        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: colors.text,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: fonts.main,
            letterSpacing: 8,
            marginBottom: 40,
          }}
        >
          MCP
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            position: "relative",
          }}
        >
          <GitHubIcon size={56} opacity={sideIconOpacity} />

          <div style={{ width: 500, display: "flex", justifyContent: "center" }}>
            <ForkLines progress={forkProgress} />
          </div>

          <VercelIcon size={56} opacity={sideIconOpacity} />
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 10px)",
          }}
        >
          <McpPlugIcon size={80} drawProgress={iconDrawProgress} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};