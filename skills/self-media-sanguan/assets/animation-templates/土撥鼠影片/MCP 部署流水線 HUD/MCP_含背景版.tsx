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
  tick: staticFile("audio/connection/tick.wav"),
  ding: staticFile("audio/connection/ding.mp3"),
};

export const MCP-PIPELINE-DURATION-FRAMES = 600;

const STEPS = {
  COMMIT-DONE: 30,
  PUSH-DONE: 120,
  PR-DONE: 210,
  DEPLOY-DONE: 360,
  READY-DONE: 480,
};

const STEP-COLORS = {
  done: colors.accent,
  active: colors.accentSecondary,
  pending: "rgba(255, 255, 255, 0.2)",
};

const DEFAULT-STEPS = ["Commit", "Push", "PR", "Deploy", "Ready"];

const StepItem: React.FC<{
  label: string;
  isDone: boolean;
  isActive: boolean;
}> = ({ label, isDone, isActive }) => {
  const frame = useCurrentFrame();
  const pulse = isActive ? 0.5 + 0.5 * Math.sin(frame * 0.15) : 0;

  const bgColor = isDone
    ? STEP-COLORS.done
    : isActive
      ? STEP-COLORS.active
      : STEP-COLORS.pending;

  const textColor = isDone || isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 100,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: isDone ? bgColor : "transparent",
          border: `2px solid ${bgColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isActive
            ? `0 0 ${12 + pulse * 8}px ${bgColor}`
            : isDone
              ? `0 0 8px ${bgColor}40`
              : "none",
        }}
      >
        {isDone ? (
          <span style={{ fontSize: 20, color: "#000", fontWeight: 700 }}>✓</span>
        ) : isActive ? (
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: bgColor,
              opacity: 0.5 + pulse * 0.5,
            }}
          />
        ) : null}
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: isDone || isActive ? 600 : 400,
          color: textColor,
          fontFamily: fonts.main,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const StepConnector: React.FC<{ isDone: boolean }> = ({ isDone }) => (
  <div
    style={{
      width: 48,
      height: 2,
      backgroundColor: isDone ? colors.accent : "rgba(255, 255, 255, 0.12)",
      marginBottom: 28,
    }}
  />
);

const PipelineHUD: React.FC<{
  steps?: string[];
  activeIndex: number;
  doneIndices: number[];
  enterFrame?: number;
}> = ({ steps = DEFAULT-STEPS, activeIndex, doneIndices, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - enterFrame;

  if (f < 0) return null;

  const enterProgress = spring({
    frame: f,
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 140 },
  });
  const translateY = interpolate(enterProgress, [0, 1], [-80, 0]);
  const enterOpacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (enterOpacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity: enterOpacity,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "16px 32px",
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      {steps.map((step, i) => {
        const isDone = doneIndices.includes(i);
        const isActive = i === activeIndex;

        return (
          <React.Fragment key={i}>
            <StepItem label={step} isDone={isDone} isActive={isActive} />
            {i < steps.length - 1 && <StepConnector isDone={doneIndices.includes(i)} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const AnimatedPipeline: React.FC = () => {
  const frame = useCurrentFrame();

  const doneIndices: number[] = [];
  if (frame >= STEPS.COMMIT-DONE) doneIndices.push(0);
  if (frame >= STEPS.PUSH-DONE) doneIndices.push(1);
  if (frame >= STEPS.PR-DONE) doneIndices.push(2);
  if (frame >= STEPS.DEPLOY-DONE) doneIndices.push(3);
  if (frame >= STEPS.READY-DONE) doneIndices.push(4);

  let activeIndex = -1;
  if (frame < STEPS.COMMIT-DONE) activeIndex = 0;
  else if (frame < STEPS.PUSH-DONE) activeIndex = 1;
  else if (frame < STEPS.PR-DONE) activeIndex = 2;
  else if (frame < STEPS.DEPLOY-DONE) activeIndex = 3;
  else if (frame < STEPS.READY-DONE) activeIndex = 4;

  return (
    <PipelineHUD
      activeIndex={activeIndex}
      doneIndices={doneIndices}
      enterFrame={0}
    />
  );
};

const EvidenceLabel: React.FC<{
  text: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const f = frame - enterFrame;

  if (f < 0 || frame > exitFrame + 10) return null;

  const opacity = interpolate(f, [0, 8], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOp = interpolate(frame, [exitFrame, exitFrame + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 60,
        opacity: opacity * exitOp,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          borderRadius: 10,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export const Scene12-McpPipeline: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <Sequence from={0} durationInFrames={600}>
        <AnimatedPipeline />
      </Sequence>

      <Sequence from={STEPS.COMMIT-DONE} durationInFrames={10}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={STEPS.PUSH-DONE} durationInFrames={10}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={STEPS.PR-DONE} durationInFrames={10}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>
      <Sequence from={STEPS.DEPLOY-DONE} durationInFrames={10}>
        <Audio src={AUDIO.tick} volume={0.15} />
      </Sequence>

      <Sequence from={STEPS.READY-DONE} durationInFrames={20}>
        <Audio src={AUDIO.ding} volume={0.2} />
      </Sequence>

      <Sequence from={0} durationInFrames={600}>
        <EvidenceLabel text="GitHub PR" enterFrame={210} exitFrame={360} />
        <EvidenceLabel text="Vercel Deploy" enterFrame={360} exitFrame={480} />
      </Sequence>
    </AbsoluteFill>
  );
};