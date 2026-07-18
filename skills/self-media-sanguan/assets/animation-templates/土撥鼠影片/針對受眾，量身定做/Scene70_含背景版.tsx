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

const AUDIENCES = [
  { label: "企業客戶", color: "#00D4AA", delay: 10 },
  { label: "學生族群", color: "#FFB547", delay: 35 },
  { label: "消費者", color: "#4DA3FF", delay: 60 },
];

export const Scene70-TailorForAudience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOp = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 45, opacity: fadeOut }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 75 }}>
          {AUDIENCES.map((audience, idx) => {
            const aSpring = spring({ frame: Math.max(0, frame - audience.delay), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
            const aScale = interpolate(aSpring, [0, 1], [0.3, 1]);
            const aOp = interpolate(aSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
            const slideY = interpolate(aSpring, [0, 1], [40, 0]);
            const cardFloat = Math.sin(frame * 0.04 + idx * 1.5) * 3;

            return (
              <div key={audience.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: aOp, transform: `scale(${aScale}) translateY(${slideY + cardFloat}px)` }}>
                <svg width="120" height="120" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill={`${audience.color}15`} stroke={`${audience.color}50`} strokeWidth="2.5" />
                  <circle cx="40" cy="30" r="10" fill={audience.color} opacity={0.8} />
                  <rect x="30" y="43" width="20" height="16" rx="5" fill={audience.color} opacity={0.6} />
                  {idx === 0 && (
                    <>
                      <rect x="50" y="44" width="16" height="12" rx="3" fill={audience.color} opacity={0.7} />
                      <rect x="54" y="41" width="8" height="4" rx="2" fill="none" stroke={audience.color} strokeWidth="1.5" opacity={0.7} />
                    </>
                  )}
                  {idx === 1 && (
                    <>
                      <polygon points="40,16 26,24 40,28 54,24" fill={audience.color} opacity={0.8} />
                      <line x1="54" y1="24" x2="56" y2="33" stroke={audience.color} strokeWidth="1.5" opacity={0.6} />
                    </>
                  )}
                  {idx === 2 && (
                    <>
                      <rect x="50" y="44" width="15" height="14" rx="3" fill={audience.color} opacity={0.7} />
                      <path d="M53,44 Q57.5,36 62,44" fill="none" stroke={audience.color} strokeWidth="1.5" opacity={0.7} />
                    </>
                  )}
                </svg>
                <span style={{ fontSize: 33, fontWeight: 700, fontFamily: fonts.main, color: audience.color, letterSpacing: 2 }}>{audience.label}</span>
                <svg width="30" height="45" viewBox="0 0 20 30">
                  <path d="M10 2 L10 22 M4 17 L10 24 L16 17" fill="none" stroke={`${audience.color}60`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ borderRadius: 12, border: `2px solid ${audience.color}30`, boxShadow: `0 0 12px ${audience.color}15`, overflow: "hidden" }}>
                  <svg width="360" height="270" viewBox="0 0 240 180">
                    <defs>
                      <linearGradient id={`tfa-hero-${idx}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={audience.color} />
                        <stop offset="100%" stopColor={audience.color} stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="240" height="180" rx="8" fill="#0D1117" />
                    <rect x="0" y="0" width="240" height="18" rx="8" fill="rgba(255,255,255,0.04)" />
                    <circle cx="10" cy="9" r="2.5" fill="#FF5F57" opacity={0.5} />
                    <circle cx="20" cy="9" r="2.5" fill="#FFBD2E" opacity={0.5} />
                    <circle cx="30" cy="9" r="2.5" fill="#28CA41" opacity={0.5} />
                    {idx === 0 && (
                      <>
                        <rect x="0" y="18" width="240" height="50" fill={`${audience.color}15`} />
                        <rect x="60" y="28" width="120" height="10" rx="3" fill={`url(#tfa-hero-${idx})`} opacity={0.6} />
                        <rect x="75" y="44" width="90" height="6" rx="2" fill="rgba(255,255,255,0.12)" />
                        <rect x="90" y="55" width="60" height="10" rx="5" fill={`url(#tfa-hero-${idx})`} opacity={0.5} />
                        {[0, 1, 2].map((i) => (
                          <g key={i}>
                            <rect x={18 + i * 76} y="78" width="60" height="35" rx="6" fill="rgba(255,255,255,0.03)" stroke={`${audience.color}15`} strokeWidth="1" />
                            <text x={48 + i * 76} y="95" textAnchor="middle" fontSize="14" fontFamily={fonts.main} fill={audience.color} fontWeight="700" opacity={0.7}>{["99%", "500+", "24h"][i]}</text>
                            <rect x={28 + i * 76} y="102" width="40" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
                          </g>
                        ))}
                        <rect x="18" y="125" width="204" height="35" rx="6" fill="rgba(255,255,255,0.02)" stroke={`${audience.color}10`} strokeWidth="1" />
                        <rect x="30" y="134" width="100" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
                        <rect x="30" y="144" width="70" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
                      </>
                    )}
                    {idx === 1 && (
                      <>
                        <rect x="0" y="18" width="240" height="50" fill={`${audience.color}12`} />
                        <rect x="50" y="28" width="140" height="10" rx="3" fill={`url(#tfa-hero-${idx})`} opacity={0.5} />
                        <rect x="65" y="44" width="110" height="6" rx="2" fill="rgba(255,255,255,0.12)" />
                        {[0, 1].map((i) => (
                          <g key={i}>
                            <rect x={18 + i * 114} y="78" width="100" height="55" rx="8" fill="rgba(255,255,255,0.03)" stroke={`${audience.color}15`} strokeWidth="1" />
                            <rect x={28 + i * 114} y="88" width="50" height="20" rx="4" fill={`${audience.color}15`} />
                            <polygon points={`${46 + i * 114},95 ${46 + i * 114},103 ${52 + i * 114},99`} fill={audience.color} opacity={0.5} />
                            <rect x={28 + i * 114} y="115" width="70" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
                            <rect x={28 + i * 114} y="124" width="50" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
                          </g>
                        ))}
                        <rect x="18" y="148" width="204" height="18" rx="6" fill="rgba(255,255,255,0.02)" stroke={`${audience.color}10`} strokeWidth="1" />
                        <rect x="24" y="154" width={120} height="6" rx="3" fill={`url(#tfa-hero-${idx})`} opacity={0.4} />
                      </>
                    )}
                    {idx === 2 && (
                      <>
                        <rect x="0" y="18" width="240" height="45" fill={`${audience.color}12`} />
                        <rect x="55" y="26" width="130" height="10" rx="3" fill={`url(#tfa-hero-${idx})`} opacity={0.5} />
                        <rect x="80" y="42" width="80" height="10" rx="5" fill={`url(#tfa-hero-${idx})`} opacity={0.4} />
                        {[0, 1, 2].map((i) => (
                          <g key={i}>
                            <rect x={14 + i * 76} y="74" width="64" height="50" rx="6" fill="rgba(255,255,255,0.03)" stroke={`${audience.color}12`} strokeWidth="1" />
                            <rect x={18 + i * 76} y="78" width="56" height="24" rx="4" fill={`${audience.color}08`} />
                            <circle cx={46 + i * 76} cy="90" r="6" fill={audience.color} opacity={0.25} />
                            <rect x={22 + i * 76} y="108" width="40" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
                            <rect x={22 + i * 76} y="116" width="25" height="4" rx="2" fill={audience.color} opacity={0.3} />
                          </g>
                        ))}
                        <rect x="18" y="138" width="204" height="24" rx="8" fill={`${audience.color}10`} stroke={`${audience.color}20`} strokeWidth="1" />
                        <rect x="75" y="145" width="90" height="10" rx="5" fill={`url(#tfa-hero-${idx})`} opacity={0.4} />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
        {badgeOp > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 21, opacity: badgeOp, transform: `scale(${badgeScale})`, marginTop: 15 }}>
            <svg width="54" height="54" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2.5" />
              <path d="M12 18 L16 22 L25 13" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 54, fontWeight: 700, fontFamily: fonts.main, background: `linear-gradient(90deg, ${colors.accent}, ${colors.warning}, ${colors.accentSecondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 4 }}>針對受眾，量身定做</span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};