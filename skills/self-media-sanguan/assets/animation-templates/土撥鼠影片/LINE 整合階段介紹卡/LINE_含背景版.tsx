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
  warning: "#FFB547",
  danger: "#FF6B6B",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(0, 212, 170, 0.3)",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const AUDIO = {
  whooshIn: staticFile("audio/connection/woosh.wav"),
  thumpSoft: staticFile("audio/connection/soft-impact.wav"),
  tick: staticFile("audio/connection/tick.wav"),
};

export const LINE-PHASE-INTRO-DURATION-FRAMES = 180;

const CHECKLIST-ITEMS = [
  { label: "Provider", startFrame: 12 },
  { label: "Messaging API", startFrame: 30 },
  { label: "Secret / Token / User ID", startFrame: 48 },
  { label: "Webhook Verify", startFrame: 66 },
];

const CheckMark: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 24,
}) => {
  const checkDashOffset = interpolate(progress, [0, 1], [30, 0]);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={colors.accent}
        strokeWidth={2}
        opacity={0.3 + 0.7 * progress}
      />
      <polyline
        points="7,12 10.5,15.5 17,9"
        fill="none"
        stroke={colors.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={30}
        strokeDashoffset={checkDashOffset}
      />
    </svg>
  );
};

const EmptyCircle: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth={2}
    />
  </svg>
);

const ChecklistRow: React.FC<{
  label: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ label, startFrame, frame, fps }) => {
  const progress = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isActive = frame >= startFrame;
  const textOpacity = interpolate(progress, [0, 1], [0.4, 1]);
  const bgOpacity = interpolate(progress, [0, 1], [0, 0.1]);

  const popCurve = isActive
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 10, mass: 0.4, stiffness: 200 },
      })
    : 0;
  const scaleY = 1 + 0.02 * interpolate(popCurve, [0, 0.5, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const borderOpacity = interpolate(progress, [0, 1], [0.05, 0.2]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 24px",
        borderRadius: 14,
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
        border: `1.5px solid rgba(0, 212, 170, ${borderOpacity})`,
        transform: `scaleY(${scaleY})`,
        minWidth: 420,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {isActive ? <CheckMark progress={progress} /> : <EmptyCircle />}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: `rgba(255, 255, 255, ${textOpacity})`,
          fontFamily: fonts.main,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const LineLogoIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 4C12 4 2 12.5 2 23c0 5.5 2.5 10.5 6.5 14L6 44l10-5c2.5.7 5.2 1 8 1 12 0 22-8.5 22-19S36 4 24 4z"
      stroke="#00B900"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Scene07-LinePhaseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftY = interpolate(frame, [0, 8], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftScale = interpolate(frame, [0, 12], [0.98, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightX = interpolate(frame, [0, 12], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0F" }}>
      <Sequence from={0} durationInFrames={15}>
        <Audio src={AUDIO.whooshIn} volume={0.25} />
      </Sequence>
      <Sequence from={8} durationInFrames={20}>
        <Audio src={AUDIO.thumpSoft} volume={0.25} />
      </Sequence>
      <Sequence from={12} durationInFrames={12}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={30} durationInFrames={12}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={48} durationInFrames={12}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={66} durationInFrames={12}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 35% 45%, rgba(255,255,255,0.07), rgba(0,0,0,0) 60%)",
          opacity: glowOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 120px",
          gap: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
            opacity: leftOpacity,
            transform: `translateY(${leftY}px) scale(${leftScale})`,
            flex: "0 0 auto",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: colors.dimmed,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: fonts.main,
            }}
          >
            PHASE 2
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: colors.text,
                fontFamily: fonts.main,
                lineHeight: 1,
              }}
            >
              LINE
            </div>
            <LineLogoIcon size={64} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: rightOpacity,
            transform: `translateX(${rightX}px)`,
          }}
        >
          {CHECKLIST-ITEMS.map((item, idx) => (
            <ChecklistRow
              key={idx}
              label={item.label}
              startFrame={item.startFrame}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};