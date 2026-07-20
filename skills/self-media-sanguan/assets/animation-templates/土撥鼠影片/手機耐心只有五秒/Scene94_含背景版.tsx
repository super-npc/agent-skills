import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const colors = {
  backgroundGradient: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  danger: "#FF6B6B",
  dimmed: "rgba(255,255,255,0.6)",
  text: "#FFFFFF",
  cardBg: "rgba(255,255,255,0.05)",
  border: "rgba(0,212,170,0.3)",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const PHASE1-START = 0;
const PHASE2-START = 55;
const PHASE3-START = 140;
const PHASE4-START = 195;
const FADE-OUT-START = 220;
const DURATION = 240;

const PhoneSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker1 = Math.sin(frame * 0.8) > 0.1 ? 1 : 0.15;
  const flicker2 = Math.sin(frame * 1.2 + 1) > 0.4 ? 1 : 0.15;
  const flicker3 = Math.sin(frame * 0.6 + 2) > 0.7 ? 1 : 0.1;
  const spinnerAngle = (frame * 8) % 360;

  return (
    <svg width="420" height="660" viewBox="0 0 280 440">
      <rect x="20" y="10" width="240" height="420" rx="30" ry="30" fill="#1A1F2E" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <rect x="35" y="55" width="210" height="330" rx="6" fill="#0D1117" />
      <rect x="100" y="20" width="80" height="8" rx="4" fill="#0D1117" />
      <g transform="translate(200, 35)">
        <rect x="0" y="10" width="6" height="6" rx="1" fill={colors.accent} opacity={flicker1} />
        <rect x="9" y="5" width="6" height="11" rx="1" fill={colors.warning} opacity={flicker2} />
        <rect x="18" y="0" width="6" height="16" rx="1" fill={colors.danger} opacity={flicker3} />
      </g>
      <g transform={`translate(140, 220) rotate(${spinnerAngle})`}>
        <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <path d="M 0 -28 A 28 28 0 0 1 28 0" fill="none" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" />
      </g>
      <text x="140" y="275" textAnchor="middle" fill={colors.dimmed} fontSize="16" fontFamily={fonts.main}>載入中...</text>
      <rect x="105" y="400" width="70" height="5" rx="3" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
};

const CountdownNumber: React.FC<{ num: number; fps: number; localFrame: number }> = ({ num, fps, localFrame }) => {
  const tickDuration = 14;
  const tickIndex = 5 - num;
  const tickStart = tickIndex * tickDuration;
  const tickFrame = localFrame - tickStart;

  if (tickFrame < 0 || tickFrame > tickDuration + 4) return null;

  const scale = spring({ frame: tickFrame, fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });
  const opacity = interpolate(tickFrame, [0, 3, tickDuration - 2, tickDuration + 4], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const isZero = num === 0;
  const color = isZero ? colors.danger : num <= 2 ? colors.warning : colors.text;

  return (
    <div
      style={{
        position: "absolute",
        fontSize: isZero ? 330 : 270,
        fontWeight: 900,
        fontFamily: fonts.main,
        color,
        transform: `scale(${scale})`,
        opacity,
        textShadow: isZero ? `0 0 40px ${colors.danger}, 0 0 80px rgba(255,107,107,0.4)` : `0 0 20px rgba(255,255,255,0.2)`,
      }}
    >
      {num}
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; delay: number; frame: number; fps: number }> = ({ icon, label, delay, frame, fps }) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const checkScale = spring({ frame: frame - delay - 12, fps, config: { damping: 10, stiffness: 200, mass: 0.4 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
        padding: "48px 56px",
        background: colors.cardBg,
        border: `2px solid ${colors.border}`,
        borderRadius: 24,
        transform: `scale(${appear}) translateY(${interpolate(appear, [0, 1], [40, 0])}px)`,
        opacity: appear,
        minWidth: 510,
      }}
    >
      {icon}
      <div style={{ fontSize: 54, fontWeight: 700, fontFamily: fonts.main, color: colors.text, textAlign: "center" }}>
        {label}
      </div>
      <svg width="84" height="84" viewBox="0 0 56 56" style={{ transform: `scale(${checkScale})`, opacity: checkScale }}>
        <circle cx="28" cy="28" r="26" fill="none" stroke={colors.accent} strokeWidth="3" />
        <path d="M 16 28 L 24 36 L 40 20" fill="none" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Scene94-MobilePatience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [FADE-OUT-START, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phoneScale = spring({ frame: frame - PHASE1-START, fps, config: { damping: 14, stiffness: 100, mass: 0.8 } });
  const phoneExit = interpolate(frame, [PHASE2-START + 10, PHASE2-START + 25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const countdownOpacity = interpolate(frame, [PHASE2-START, PHASE2-START + 5, PHASE3-START - 10, PHASE3-START], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardsOpacity = interpolate(frame, [PHASE3-START, PHASE3-START + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const badgeScale = spring({ frame: frame - PHASE4-START, fps, config: { damping: 12, stiffness: 150, mass: 0.6 } });

  const warningFrame = PHASE2-START + 5 * 14;
  const warningFlash = interpolate(frame, [warningFrame, warningFrame + 4, warningFrame + 10, warningFrame + 20], [0, 0.3, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient, fontFamily: fonts.main, opacity: fadeOut }}>
      <AbsoluteFill style={{ background: colors.danger, opacity: warningFlash, pointerEvents: "none" }} />

      <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", opacity: phoneExit, transform: `scale(${phoneScale})` }}>
        <PhoneSVG frame={frame} />
        {frame >= 20 && (
          <div style={{ position: "absolute", bottom: 200, fontSize: 48, color: colors.warning, fontWeight: 600, opacity: interpolate(frame, [20, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            網路不穩定
          </div>
        )}
      </AbsoluteFill>

      <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30, opacity: countdownOpacity }}>
        <div style={{ fontSize: 60, fontWeight: 600, color: colors.dimmed, marginBottom: 15, opacity: interpolate(frame, [PHASE2-START, PHASE2-START + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          耐心只有
        </div>
        <div style={{ position: "relative", width: 240, height: 240, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {[5, 4, 3, 2, 1, 0].map((num) => (
            <CountdownNumber key={num} num={num} fps={fps} localFrame={frame - PHASE2-START} />
          ))}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: colors.text, opacity: interpolate(frame, [PHASE2-START + 8, PHASE2-START + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          秒
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 90, opacity: cardsOpacity }}>
        <MetricCard
          icon={
            <svg width="108" height="108" viewBox="0 0 72 72">
              <rect x="18" y="6" width="36" height="60" rx="8" fill="none" stroke={colors.accentSecondary} strokeWidth="3" />
              <rect x="24" y="16" width="24" height="32" rx="3" fill="rgba(77,163,255,0.15)" />
              <circle cx="36" cy="32" r="10" fill="none" stroke={colors.accentSecondary} strokeWidth="2" />
              <ellipse cx="36" cy="32" rx="5" ry="10" fill="none" stroke={colors.accentSecondary} strokeWidth="1.5" />
              <line x1="26" y1="32" x2="46" y2="32" stroke={colors.accentSecondary} strokeWidth="1.5" />
            </svg>
          }
          label="打得開網站"
          delay={PHASE3-START}
          frame={frame}
          fps={fps}
        />
        <MetricCard
          icon={
            <svg width="108" height="108" viewBox="0 0 72 72">
              <circle cx="36" cy="22" r="12" fill="none" stroke={colors.accentSecondary} strokeWidth="3" />
              <path d="M 14 58 C 14 44 24 36 36 36 C 48 36 58 44 58 58" fill="none" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" />
              <rect x="44" y="10" width="20" height="14" rx="4" fill="rgba(77,163,255,0.2)" stroke={colors.accentSecondary} strokeWidth="1.5" />
              <circle cx="50" cy="17" r="1.5" fill={colors.accentSecondary} />
              <circle cx="54" cy="17" r="1.5" fill={colors.accentSecondary} />
              <circle cx="58" cy="17" r="1.5" fill={colors.accentSecondary} />
            </svg>
          }
          label="聯絡到人"
          delay={PHASE3-START + 10}
          frame={frame}
          fps={fps}
        />
      </AbsoluteFill>

      {frame >= PHASE4-START && (
        <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 140 }}>
          <div
            style={{
              padding: "16px 48px",
              borderRadius: 40,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
              fontSize: 63,
              fontWeight: 800,
              color: "#fff",
              transform: `scale(${badgeScale})`,
              opacity: badgeScale,
              boxShadow: `0 0 30px rgba(0,212,170,0.3), 0 0 60px rgba(77,163,255,0.2)`,
            }}
          >
            重要指標
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};