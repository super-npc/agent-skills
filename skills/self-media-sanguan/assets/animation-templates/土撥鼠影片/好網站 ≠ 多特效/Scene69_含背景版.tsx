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

export const Scene69-NotJustEffects: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chaosSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const chaosScale = interpolate(chaosSpring, [0, 1], [0.3, 1]);
  const chaosOpacity = interpolate(chaosSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const spin1 = interpolate(frame, [5, 70], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spin2 = interpolate(frame, [5, 70], [0, -540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spin3 = interpolate(frame, [10, 70], [0, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bounce1 = Math.abs(Math.sin(frame * 0.18)) * 30;
  const bounce2 = Math.abs(Math.sin(frame * 0.22 + 1)) * 25;
  const flash1 = Math.sin(frame * 0.35) > 0 ? 1 : 0.2;
  const flash2 = Math.sin(frame * 0.45 + 1.5) > 0 ? 1 : 0.15;
  const flash3 = Math.sin(frame * 0.28 + 0.8) > 0 ? 1 : 0.3;
  const phase1Fade = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warnSpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 6, mass: 0.3, stiffness: 200 } });
  const warnScale = interpolate(warnSpring, [0, 1], [2.0, 1]);
  const warnOpacity = interpolate(warnSpring, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const warnFade = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cleanSpring = spring({ frame: Math.max(0, frame - 85), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const cleanScale = interpolate(cleanSpring, [0, 1], [0.4, 1]);
  const cleanOpacity = interpolate(cleanSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOp = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const floatY = Math.sin(frame * 0.05) * 4;
  const cleanGlow = frame > 100 ? interpolate(Math.sin((frame - 100) * 0.06), [-1, 1], [0, 18]) : 0;
  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);
  const chaosBg1 = `hsl(${(frame * 8) % 360}, 80%, 50%)`;
  const chaosBg2 = `hsl(${(frame * 12 + 120) % 360}, 75%, 55%)`;
  const chaosBg3 = `hsl(${(frame * 6 + 240) % 360}, 85%, 45%)`;

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.danger}06 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {phase1Fade > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 27, opacity: chaosOpacity * phase1Fade, transform: `scale(${chaosScale})` }}>
            <div style={{ borderRadius: 14, border: `2px solid ${colors.danger}50`, boxShadow: `0 0 30px ${colors.danger}25, 0 0 60px ${colors.danger}10`, overflow: "hidden" }}>
              <svg width="750" height="465" viewBox="0 0 500 310">
                <rect x="0" y="0" width="500" height="310" rx="12" fill="#0D1117" />
                <rect x="0" y="0" width="500" height="32" rx="0" fill="rgba(255,80,80,0.12)" />
                <rect x="60" y="9" width="360" height="14" rx="7" fill="rgba(255,255,255,0.07)" />
                <circle cx="18" cy="16" r="5" fill={colors.danger} opacity={0.7} />
                <circle cx="35" cy="16" r="5" fill={colors.warning} opacity={0.7} />
                <circle cx="52" cy="16" r="5" fill={colors.accent} opacity={0.7} />
                <rect x="0" y="32" width="500" height="278" fill="#080C10" />
                <rect x="0" y="32" width="500" height="50" fill={chaosBg1} opacity={flash1 * 0.25} />
                <rect x="0" y="150" width="500" height="50" fill={chaosBg2} opacity={flash2 * 0.22} />
                <rect x="0" y="240" width="500" height="70" fill={chaosBg3} opacity={flash3 * 0.2} />
                <g transform={`translate(80, 100) rotate(${spin1})`}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line key={i} x1="0" y1="0" x2={Math.cos((angle * Math.PI) / 180) * 28} y2={Math.sin((angle * Math.PI) / 180) * 28} stroke={chaosBg1} strokeWidth="4" strokeLinecap="round" opacity={0.85} />
                  ))}
                  <circle cx="0" cy="0" r="8" fill={chaosBg1} opacity={0.9} />
                </g>
                <g transform={`translate(420, 80) rotate(${spin2})`}>
                  <rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke={chaosBg2} strokeWidth="4" opacity={0.9} />
                  <rect x="-12" y="-12" width="24" height="24" rx="2" fill={chaosBg2} opacity={flash2 * 0.7} />
                </g>
                <g transform={`translate(250, 75) rotate(${spin3})`}>
                  <polygon points="0,-30 26,15 -26,15" fill="none" stroke={chaosBg3} strokeWidth="4" opacity={0.85} />
                  <polygon points="0,-15 13,7 -13,7" fill={chaosBg3} opacity={flash3 * 0.75} />
                </g>
                <circle cx="150" cy={175 - bounce1} r="20" fill={chaosBg2} opacity={flash2 * 0.8} />
                <ellipse cx="150" cy="240" rx={10 + bounce1 * 0.3} ry="5" fill="rgba(0,0,0,0.3)" opacity={0.5 - bounce1 * 0.012} />
                <rect x="330" y={160 - bounce2} width="50" height="30" rx="6" fill={chaosBg3} opacity={flash3 * 0.75} />
                <rect x="180" y="140" width="130" height="22" rx="4" fill={colors.danger} opacity={flash1 * 0.7} />
                <text x="245" y="156" fontSize="11" fontFamily={fonts.main} fill="white" textAnchor="middle" fontWeight="700" opacity={flash1}>CLICK HERE NOW!!!</text>
                <rect x="30" y="220" width="100" height="20" rx="4" fill={colors.warning} opacity={flash2 * 0.8} />
                <text x="80" y="234" fontSize="10" fontFamily={fonts.main} fill="white" textAnchor="middle" fontWeight="700" opacity={flash2}>BUY NOW!</text>
                <rect x="350" y="210" width="120" height="20" rx="4" fill={chaosBg1} opacity={flash3 * 0.7} />
                <text x="410" y="224" fontSize="10" fontFamily={fonts.main} fill="white" textAnchor="middle" fontWeight="700" opacity={flash3}>SUBSCRIBE!!!</text>
                <rect x="0" y="265" width="500" height="20" fill="rgba(255,200,0,0.08)" />
                <text x={500 - ((frame - 5) * 4) % 700} y="279" fontSize="11" fontFamily={fonts.main} fill={colors.warning} opacity={0.7} fontWeight="600">★ SPECIAL OFFER ★ LIMITED TIME ★ CLICK NOW ★ AMAZING DEAL ★</text>
                {[{ x: 60, y: 190, d: 0 }, { x: 440, y: 150, d: 1.2 }, { x: 200, y: 250, d: 2.4 }, { x: 350, y: 120, d: 3.6 }, { x: 130, y: 240, d: 4.8 }, { x: 460, y: 240, d: 0.6 }].map((p, i) => {
                  const sparkOp = Math.sin(frame * 0.15 + p.d) * 0.5 + 0.5;
                  const sparkSize = Math.sin(frame * 0.12 + p.d) * 2 + 4;
                  return (
                    <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${spin1 * (i % 2 === 0 ? 1 : -1) * 0.5})`}>
                      {[0, 72, 144, 216, 288].map((a, j) => (
                        <line key={j} x1="0" y1="0" x2={Math.cos((a * Math.PI) / 180) * sparkSize} y2={Math.sin((a * Math.PI) / 180) * sparkSize} stroke={[chaosBg1, chaosBg2, chaosBg3, colors.warning, colors.danger, chaosBg1][i]} strokeWidth="2" strokeLinecap="round" opacity={sparkOp} />
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>
            <span style={{ fontSize: 42, fontWeight: 700, fontFamily: fonts.main, color: colors.danger, letterSpacing: 2, opacity: 0.85 }}>雜亂！眼花撩亂！</span>
          </div>
        )}
        {warnFade > 0 && warnOpacity > 0 && (
          <div style={{ position: "absolute", opacity: warnOpacity * warnFade, transform: `scale(${warnScale})` }}>
            <svg width="180" height="165" viewBox="0 0 120 110">
              <defs>
                <linearGradient id="njeWarnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.warning} />
                  <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
              </defs>
              <polygon points="60,8 112,98 8,98" fill={`${colors.warning}18`} stroke="url(#njeWarnGrad)" strokeWidth="5" strokeLinejoin="round" />
              <text x="60" y="82" fontSize="44" fontFamily={fonts.main} fill={colors.warning} textAnchor="middle" fontWeight="900">!</text>
            </svg>
          </div>
        )}
        {cleanOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: cleanOpacity, transform: `scale(${cleanScale})` }}>
            <div style={{ borderRadius: 14, border: `2px solid ${colors.accent}35`, boxShadow: `0 0 ${cleanGlow}px ${colors.accent}25`, overflow: "hidden" }}>
              <svg width="750" height="465" viewBox="0 0 500 310">
                <rect x="0" y="0" width="500" height="310" rx="12" fill="#0D1117" />
                <rect x="0" y="0" width="500" height="32" fill="rgba(0,212,170,0.06)" />
                <circle cx="18" cy="16" r="5" fill={colors.danger} opacity={0.5} />
                <circle cx="35" cy="16" r="5" fill={colors.warning} opacity={0.5} />
                <circle cx="52" cy="16" r="5" fill={colors.accent} opacity={0.5} />
                <rect x="60" y="9" width="360" height="14" rx="7" fill="rgba(255,255,255,0.06)" />
                <text x="240" y="20" fontSize="9" fontFamily={fonts.main} fill="rgba(255,255,255,0.3)" textAnchor="middle">cleansite.com</text>
                <rect x="0" y="32" width="500" height="278" fill="#080C10" />
                <rect x="80" y="55" width="340" height="8" rx="4" fill={`${colors.accent}20`} />
                <rect x="80" y="55" width={340 * Math.min(1, Math.max(0, (frame - 95) / 60))} height="8" rx="4" fill={colors.accent} opacity={0.5} />
                <rect x="120" y="75" width="260" height="16" rx="4" fill="rgba(255,255,255,0.12)" />
                <rect x="150" y="100" width="200" height="10" rx="3" fill="rgba(255,255,255,0.06)" />
                <rect x="185" y="122" width="130" height="32" rx="16" fill={`${colors.accent}25`} stroke={`${colors.accent}60`} strokeWidth="1.5" />
                <text x="250" y="143" fontSize="11" fontFamily={fonts.main} fill={colors.accent} textAnchor="middle" fontWeight="600">Get Started</text>
                <line x1="60" y1="175" x2="440" y2="175" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                {[0, 1, 2].map((i) => {
                  const cardX = 60 + i * 140;
                  const cardY = 188 + floatY * (i % 2 === 0 ? 1 : -0.5);
                  const cardOp = Math.min(1, Math.max(0, (frame - 110 - i * 8) / 20));
                  return (
                    <g key={i} opacity={cardOp}>
                      <rect x={cardX} y={cardY} width="120" height="70" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                      <circle cx={cardX + 20} cy={cardY + 22} r="8" fill={[colors.accent, colors.accentSecondary, colors.warning][i]} opacity={0.6} />
                      <rect x={cardX + 35} y={cardY + 15} width="70" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                      <rect x={cardX + 35} y={cardY + 28} width="55" height="5" rx="2.5" fill="rgba(255,255,255,0.06)" />
                      <rect x={cardX + 10} y={cardY + 46} width="100" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
                      <rect x={cardX + 10} y={cardY + 55} width="80" height="4" rx="2" fill="rgba(255,255,255,0.04)" />
                    </g>
                  );
                })}
                <circle cx={400} cy={70 + floatY} r="3" fill={colors.accent} opacity={0.25} />
              </svg>
            </div>
            {badgeOp > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: badgeOp, transform: `scale(${badgeScale})`, background: `linear-gradient(90deg, ${colors.accent}12, ${colors.accentSecondary}10)`, border: `1.5px solid ${colors.accent}35`, borderRadius: 16, padding: "12px 28px" }}>
                <svg width="57" height="57" viewBox="0 0 38 38">
                  <circle cx="19" cy="19" r="17" fill={`${colors.accent}18`} stroke={colors.accent} strokeWidth="2.5" />
                  <path d="M12 19 L16.5 23.5 L27 13" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 54, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentSecondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>好網站 ≠ 多特效</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};