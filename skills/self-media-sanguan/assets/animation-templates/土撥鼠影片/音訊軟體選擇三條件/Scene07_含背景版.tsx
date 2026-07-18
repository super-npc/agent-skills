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
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  accentSecondary: "#00D4AA",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

const AUDIO = {
  softClick: staticFile("audio/connection/soft-click.wav"),
  whoushOut: staticFile("audio/connection/whoosh-out.mp3"),
  ding: staticFile("audio/connection/ding.mp3"),
  tinyPop: staticFile("audio/connection/tiny-pop.mp3"),
  tick: staticFile("audio/connection/tick.wav"),
};

const NumberBadge: React.FC<{
  num: number;
  scale?: number;
  glowIntensity?: number;
}> = ({ num, scale = 1, glowIntensity = 0 }) => (
  <div
    style={{
      width: 50,
      height: 50,
      borderRadius: "50%",
      border: `3px solid ${colors.accentSecondary}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      transform: `scale(${scale})`,
      boxShadow: glowIntensity > 0
        ? `0 0 ${8 + glowIntensity * 16}px ${colors.accentSecondary}80`
        : "none",
      background: `rgba(0, 212, 170, ${0.08 + glowIntensity * 0.12})`,
    }}
  >
    <span style={{ fontSize: 24, fontWeight: 800, color: colors.accentSecondary, fontFamily: "'Inter', 'Noto Sans TC', sans-serif", lineHeight: 1 }}>
      {num}
    </span>
  </div>
);

const CriteriaCard: React.FC<{
  num: number;
  text: string;
  icon: React.ReactNode;
  opacity: number;
  translateX: number;
  badgeScale: number;
  badgeGlow: number;
}> = ({ num, text, icon, opacity, translateX, badgeScale, badgeGlow }) => (
  <div
    style={{
      width: 1400,
      height: 120,
      borderRadius: 16,
      border: "1.5px solid rgba(0, 212, 170, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 28,
      paddingLeft: 32,
      paddingRight: 32,
      opacity,
      transform: `translateX(${translateX}px)`,
    }}
  >
    <NumberBadge num={num} scale={badgeScale} glowIntensity={badgeGlow} />
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, width: 70, height: 70 }}>
      {icon}
    </div>
    <span style={{ fontSize: 36, fontWeight: 500, color: colors.text, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", lineHeight: 1.4 }}>
      {text}
    </span>
  </div>
);

export const Scene07-SoftwareCriteria: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerSlideY = interpolate(frame, [5, 30], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardStartFrames = [40, 80, 120];
  const cardAnimations = cardStartFrames.map((startFrame) => {
    const cardSpring = spring({ frame: frame - startFrame, fps, config: { damping: 14, mass: 0.9, stiffness: 120 } });
    const translateX = interpolate(cardSpring, [0, 1], [-60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const strokeProgress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { translateX, opacity, strokeProgress };
  });

  const badgeGlowBurst = interpolate(frame, [150, 160, 170], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const idlePulse = frame > 170 && frame < 275 ? 0.04 * Math.sin(((frame - 170) / 30) * Math.PI * 2) : 0;
  const badgeIdleScale = 1 + idlePulse;
  const badgeIdleGlow = frame > 170 && frame < 275 ? 0.15 + 0.1 * Math.sin(((frame - 170) / 30) * Math.PI * 2) : 0;
  const combinedBadgeGlow = Math.max(badgeGlowBurst, badgeIdleGlow);
  const combinedBadgeScale = frame >= 150 && frame <= 170
    ? 1 + 0.08 * Math.sin(((frame - 150) / 20) * Math.PI * 2)
    : badgeIdleScale;

  const fadeOut = interpolate(frame, [275, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Simple placeholder icons (replace with your own SVGs)
  const makeIcon = (sp: number, color: string, shape: "file" | "plug" | "lock") => {
    const totalLen = 400;
    const dashOffset = totalLen * (1 - sp);
    if (shape === "file") return (
      <svg width={65} height={65} viewBox="0 0 80 80" fill="none">
        <path d="M22 10 L52 10 L62 22 L62 70 L22 70 Z" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M52 10 L52 22 L62 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M8 45 L32 45" stroke="#4DA3FF" strokeWidth="3" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M24 37 L32 45 L24 53" stroke="#4DA3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      </svg>
    );
    if (shape === "plug") return (
      <svg width={65} height={65} viewBox="0 0 80 80" fill="none">
        <path d="M12 28 L28 28" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M12 42 L28 42" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <rect x="28" y="22" width="10" height="26" rx="3" stroke={colors.accentSecondary} strokeWidth="2.5" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <rect x="42" y="22" width="10" height="26" rx="3" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M52 28 L68 28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M52 42 L68 42" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      </svg>
    );
    return (
      <svg width={65} height={65} viewBox="0 0 80 80" fill="none">
        <rect x="22" y="36" width="36" height="28" rx="5" stroke={color} strokeWidth="3" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M30 36 L30 24 Q30 12 40 12 Q50 12 50 24 L50 28" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M40 47 Q36 42 33 45 Q30 48 33 52 L40 58 L47 52 Q50 48 47 45 Q44 42 40 47 Z" fill="#FF6B6B" opacity={sp * 0.8} />
      </svg>
    );
  };

  const cards = [
    { num: 1, text: "軟體本身要能夠匯入音檔、編輯等基本功能", iconShape: "file" as const, iconColor: colors.accentSecondary },
    { num: 2, text: "希望要有 MCP 可以串接", iconShape: "plug" as const, iconColor: colors.accent },
    { num: 3, text: "如果是開源、免費的更好", iconShape: "lock" as const, iconColor: colors.accentSecondary },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, opacity: fadeOut }}>
      <Sequence from={5} durationInFrames={30}><Audio src={AUDIO.softClick} volume={0.5} /></Sequence>
      <Sequence from={40} durationInFrames={20}><Audio src={AUDIO.tick} volume={0.4} /></Sequence>
      <Sequence from={43} durationInFrames={20}><Audio src={AUDIO.tinyPop} volume={0.35} /></Sequence>
      <Sequence from={80} durationInFrames={20}><Audio src={AUDIO.tick} volume={0.4} /></Sequence>
      <Sequence from={83} durationInFrames={20}><Audio src={AUDIO.tinyPop} volume={0.35} /></Sequence>
      <Sequence from={120} durationInFrames={20}><Audio src={AUDIO.tick} volume={0.4} /></Sequence>
      <Sequence from={123} durationInFrames={20}><Audio src={AUDIO.tinyPop} volume={0.35} /></Sequence>
      <Sequence from={150} durationInFrames={30}><Audio src={AUDIO.ding} volume={0.5} /></Sequence>
      <Sequence from={275} durationInFrames={25}><Audio src={AUDIO.whoushOut} volume={0.4} /></Sequence>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 180 }}>
        <div style={{ opacity: headerOpacity, transform: `translateY(${headerSlideY}px)`, marginBottom: 60 }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: colors.text, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", letterSpacing: 2 }}>
            軟體選擇的<span style={{ color: colors.accentSecondary }}>三個條件</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}>
          {cards.map((card, idx) => (
            <CriteriaCard
              key={card.num}
              num={card.num}
              text={card.text}
              icon={makeIcon(cardAnimations[idx].strokeProgress, card.iconColor, card.iconShape)}
              opacity={cardAnimations[idx].opacity}
              translateX={cardAnimations[idx].translateX}
              badgeScale={combinedBadgeScale}
              badgeGlow={combinedBadgeGlow}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SOFTWARE-CRITERIA-DURATION-FRAMES = 300;