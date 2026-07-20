import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const colors = {
  background: "#0A0E14",
  backgroundGradient: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  danger: "#FF6B6B",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const Scene63-CustomizeOwn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const siteSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const siteScale = interpolate(siteSpring, [0, 1], [0.4, 1]);
  const siteOpacity = interpolate(siteSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const sparkleProgress = interpolate(frame, [25, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const colorShift = interpolate(frame, [25, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heroColor1 = interpolate(colorShift, [0, 0.5, 1], [0.2, 0.5, 0.9]);
  const heroColor2 = interpolate(colorShift, [0, 0.5, 1], [0.1, 0.4, 0.8]);
  const flashOpacity = interpolate(frame, [68, 72, 78, 82], [0, 0.4, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const finalScale = interpolate(finalSpring, [0, 1], [0.5, 1]);
  const finalOpacity = interpolate(finalSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const siteGlow = frame > 100 ? interpolate(Math.sin((frame - 100) * 0.06), [-1, 1], [0, 15]) : 0;
  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);
  const showPhase1 = frame < 82;
  const showPhase3 = frame >= 75;

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      {flashOpacity > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle, ${colors.accent}40 0%, transparent 70%)`, opacity: flashOpacity }} />}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {showPhase1 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: siteOpacity * (1 - finalOpacity), transform: `scale(${siteScale})` }}>
            <svg width="660" height="450" viewBox="0 0 440 300">
              <defs>
                <linearGradient id="coMorphGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={`hsl(${170 + heroColor1 * 30}, 70%, 50%)`} />
                  <stop offset="100%" stopColor={`hsl(${210 + heroColor2 * 40}, 70%, 50%)`} />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="440" height="300" rx="12" fill="#0D1117" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <rect x="0" y="0" width="440" height="24" rx="12" fill="rgba(255,255,255,0.04)" />
              <circle cx="14" cy="12" r="4" fill="#FF5F57" opacity={0.6} />
              <circle cx="28" cy="12" r="4" fill="#FFBD2E" opacity={0.6} />
              <circle cx="42" cy="12" r="4" fill="#28CA41" opacity={0.6} />
              <rect x="0" y="24" width="440" height="80" fill="url(#coMorphGrad)" opacity={0.25} />
              <rect x="130" y="48" width="180" height="12" rx="4" fill="url(#coMorphGrad)" opacity={0.6} />
              <rect x="155" y="68" width="130" height="8" rx="3" fill="rgba(255,255,255,0.15)" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={20 + i * 140} y="118" width="125" height="80" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx={82 + i * 140} cy="145" r="10" fill="url(#coMorphGrad)" opacity={interpolate(colorShift, [0, 1], [0.2, 0.5])} />
                  <rect x={45 + i * 140} y="165" width="75" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
                </g>
              ))}
              {sparkleProgress > 0 && [
                { x: 80, y: 60, delay: 0 }, { x: 300, y: 90, delay: 0.15 }, { x: 200, y: 150, delay: 0.3 }, { x: 370, y: 180, delay: 0.45 }, { x: 120, y: 200, delay: 0.6 },
              ].map((s, i) => {
                const sOp = interpolate(sparkleProgress, [s.delay, Math.min(1, s.delay + 0.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const sPulse = Math.sin(frame * 0.15 + i * 2) * 0.4 + 0.6;
                return (
                  <g key={i} opacity={sOp * sPulse}>
                    <line x1={s.x - 6} y1={s.y} x2={s.x + 6} y2={s.y} stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
                    <line x1={s.x} y1={s.y - 6} x2={s.x} y2={s.y + 6} stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
                  </g>
                );
              })}
            </svg>
            <span style={{ fontSize: 42, fontWeight: 600, fontFamily: fonts.main, color: "rgba(255,255,255,0.5)" }}>客製化調整中...</span>
          </div>
        )}
        {showPhase3 && finalOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: finalOpacity, transform: `scale(${finalScale})` }}>
            <div style={{ borderRadius: 16, border: `2px solid ${colors.accent}30`, boxShadow: `0 0 ${siteGlow}px ${colors.accent}30`, padding: 4 }}>
              <svg width="720" height="465" viewBox="0 0 480 310">
                <defs>
                  <linearGradient id="coFinalHero" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={colors.accent} />
                    <stop offset="100%" stopColor={colors.accentSecondary} />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="480" height="310" rx="12" fill="#0D1117" stroke={`${colors.accent}25`} strokeWidth="1.5" />
                <rect x="0" y="0" width="480" height="24" rx="12" fill="rgba(255,255,255,0.04)" />
                <circle cx="14" cy="12" r="4" fill="#FF5F57" opacity={0.6} />
                <circle cx="28" cy="12" r="4" fill="#FFBD2E" opacity={0.6} />
                <circle cx="42" cy="12" r="4" fill="#28CA41" opacity={0.6} />
                <rect x="0" y="24" width="480" height="85" fill="url(#coFinalHero)" opacity={0.2} />
                <rect x="140" y="46" width="200" height="14" rx="5" fill="url(#coFinalHero)" opacity={0.7} />
                <rect x="165" y="70" width="150" height="8" rx="3" fill="rgba(255,255,255,0.2)" />
                <rect x="195" y="86" width="90" height="14" rx="7" fill="url(#coFinalHero)" opacity={0.6} />
                {[0, 1, 2].map((i) => {
                  const cardFloat = Math.sin(frame * 0.05 + i * 1.2) * 3;
                  const dotPulse = interpolate(Math.sin(frame * 0.06 + i), [-1, 1], [0.4, 0.7]);
                  return (
                    <g key={i}>
                      <rect x={22 + i * 150} y={125 + cardFloat} width="135" height="90" rx="10" fill="rgba(255,255,255,0.03)" stroke={`${colors.accent}15`} strokeWidth="1" />
                      <circle cx={89 + i * 150} cy={152 + cardFloat} r="12" fill={[colors.accent, colors.accentSecondary, colors.warning][i]} opacity={dotPulse} />
                      <rect x={50 + i * 150} y={175 + cardFloat} width="78" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                    </g>
                  );
                })}
                <rect x="16" y="30" width="60" height="14" rx="4" fill="url(#coFinalHero)" opacity={0.5} />
                <text x="240" y="260" textAnchor="middle" fontSize="11" fontFamily={fonts.main} fill={`${colors.accent}15`} fontWeight="700" letterSpacing="4">YOUR WEBSITE</text>
              </svg>
            </div>
            {badgeOpacity > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 21, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
                <svg width="54" height="54" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2.5" />
                  <path d="M12 18 L16 22 L25 13" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 51, fontWeight: 700, fontFamily: fonts.main, color: colors.accent, letterSpacing: 3 }}>專屬於我們的網站</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};