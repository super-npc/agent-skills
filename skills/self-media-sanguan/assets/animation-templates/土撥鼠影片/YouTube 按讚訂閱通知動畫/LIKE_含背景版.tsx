import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

export const LIKE-SUBSCRIBE-BELL-DURATION-FRAMES = 300;

const ThumbsUpIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = "#FFF",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const BellIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = "#FFF",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const Particle: React.FC<{
  x: number;
  y: number;
  delay: number;
  size: number;
}> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const opacity = interpolate(t, [0, 20, 60], [0, 0.6, 0], {
    extrapolateRight: "clamp",
  });
  const yOffset = interpolate(t, [0, 60], [0, -40], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + yOffset,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: colors.accent,
        opacity,
      }}
    />
  );
};

export const LikeSubscribeBellScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickSrc = staticFile("click.mp3");
  const bellSrc = staticFile("bell-notification.mp3");

  const EX = {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  };

  const glowPulse = Math.sin(frame * 0.03) * 0.3 + 0.7;

  const barSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const barY = interpolate(barSpring, [0, 1], [100, 0]);
  const barOpacity = interpolate(frame, [15, 35], [0, 1], EX);

  const likeStart = 90;
  const likePressed = frame >= likeStart;
  const likeBounce = spring({
    frame: Math.max(0, frame - likeStart),
    fps,
    config: { damping: 5, stiffness: 200 },
  });
  const likeScale = likePressed ? 0.7 + likeBounce * 0.3 : 1;

  const likeRippleProgress = interpolate(frame - likeStart, [0, 25], [0, 1], EX);
  const likeRippleOpacity = likePressed
    ? interpolate(likeRippleProgress, [0, 1], [0.5, 0])
    : 0;
  const likeRippleScale = likePressed
    ? interpolate(likeRippleProgress, [0, 1], [0.8, 2.5])
    : 0;

  const subStart = 150;
  const subPressed = frame >= subStart;
  const subBounce = spring({
    frame: Math.max(0, frame - subStart),
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const subScale = subPressed ? 0.85 + subBounce * 0.15 : 1;
  const subWidth = subPressed
    ? interpolate(frame - subStart, [0, 15], [120, 160], EX)
    : 120;

  const bellStart = 210;
  const bellActive = frame >= bellStart;
  const bellBounce = spring({
    frame: Math.max(0, frame - bellStart),
    fps,
    config: { damping: 6, stiffness: 150 },
  });
  const bellShaking = frame >= bellStart + 8 && frame < bellStart + 50;
  const bellRotation = bellShaking
    ? Math.sin((frame - bellStart - 8) * 1.8) *
      interpolate(frame - bellStart - 8, [0, 42], [25, 0], EX)
    : 0;
  const bellScale = bellActive ? 0.75 + bellBounce * 0.25 : 1;

  const fadeOut = interpolate(frame, [275, 298], [1, 0], EX);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ opacity: fadeOut, width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: 1200,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${colors.accent}08 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${glowPulse})`,
          }}
        />
        {[
          { x: 300, y: 200, delay: 0, size: 4 },
          { x: 800, y: 150, delay: 15, size: 3 },
          { x: 1400, y: 300, delay: 30, size: 5 },
          { x: 1600, y: 180, delay: 45, size: 3 },
          { x: 500, y: 800, delay: 60, size: 4 },
          { x: 1200, y: 850, delay: 75, size: 3 },
        ].map((p, i) => (
          <Particle key={i} {...p} />
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${barY}px)`,
            opacity: barOpacity,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 24,
            padding: "32px 48px",
            display: "flex",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            alignItems: "center",
            gap: 36,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: "3px solid rgba(255,255,255,0.15)",
            }}
          >
            <Img
              src={staticFile("avatar-2.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: 2,
              marginRight: 16,
              flexShrink: 0,
            }}
          >
            Debug 土撥鼠
          </div>
          <div
            style={{
              width: 1,
              height: 52,
              backgroundColor: "rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          />
          <div style={{ position: "relative", flexShrink: 0 }}>
            {likePressed && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: colors.accent,
                  opacity: likeRippleOpacity,
                  transform: `translate(-50%, -50%) scale(${likeRippleScale})`,
                  pointerEvents: "none",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 28,
                backgroundColor: likePressed
                  ? "rgba(77, 163, 255, 0.2)"
                  : "rgba(255,255,255,0.08)",
                border: `1.5px solid ${likePressed ? colors.accent + "60" : "rgba(255,255,255,0.12)"}`,
                transform: `scale(${likeScale})`,
              }}
            >
              <ThumbsUpIcon
                size={30}
                color={likePressed ? colors.accent : "rgba(255,255,255,0.5)"}
              />
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: likePressed ? colors.accent : "rgba(255,255,255,0.5)",
                }}
              >
                按讚
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 28,
              backgroundColor: subPressed ? "rgba(255,255,255,0.12)" : "#CC0000",
              transform: `scale(${subScale})`,
              minWidth: subWidth,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", letterSpacing: 2 }}
            >
              {subPressed ? "已訂閱 ✓" : "訂閱"}
            </span>
          </div>
          <div
            style={{
              width: 58,
              height: 58,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: bellActive
                ? "rgba(255, 200, 0, 0.15)"
                : "rgba(255,255,255,0.08)",
              border: `1.5px solid ${bellActive ? "#FFC80060" : "rgba(255,255,255,0.12)"}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${bellScale}) rotate(${bellRotation}deg)`,
              transformOrigin: "50% 15%",
            }}
          >
            <BellIcon size={28} color={bellActive ? "#FFC800" : "rgba(255,255,255,0.5)"} />
          </div>
        </div>
      </div>
      <Sequence from={likeStart}>
        <Audio src={clickSrc} volume={0.8} />
      </Sequence>
      <Sequence from={subStart}>
        <Audio src={clickSrc} volume={0.8} />
      </Sequence>
      <Sequence from={bellStart}>
        <Audio src={bellSrc} volume={0.85} />
      </Sequence>
    </AbsoluteFill>
  );
};