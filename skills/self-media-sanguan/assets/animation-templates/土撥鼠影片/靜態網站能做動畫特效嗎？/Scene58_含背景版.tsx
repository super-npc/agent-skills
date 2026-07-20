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
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const Scene58-CanDoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const staticSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const staticScale = interpolate(staticSpring, [0, 1], [0.3, 1]);
  const staticOpacity = interpolate(staticSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const staticFade = interpolate(frame, [55, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const checkSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const checkScale = interpolate(checkSpring, [0, 1], [0.3, 1]);
  const questionSpring = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const questionScale = interpolate(questionSpring, [0, 1], [0.4, 1]);
  const questionOpacity = interpolate(questionSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const wave1 = Math.sin(frame * 0.08) * 8;
  const wave2 = Math.sin(frame * 0.1 + 1) * 6;
  const wave3 = Math.sin(frame * 0.12 + 2) * 10;
  const particleY1 = (frame * 1.5) % 80;
  const particleY2 = (frame * 1.2 + 20) % 80;
  const pulseScale = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.9, 1.1]);
  const rotateAngle = interpolate(frame, [75, 285], [0, 360], { extrapolateRight: "clamp" });
  const questionBounce = frame > 95 ? Math.sin((frame - 95) * 0.08) * 6 : 0;
  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accentSecondary}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {staticFade > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: staticOpacity * staticFade, transform: `scale(${staticScale})` }}>
            <svg width="420" height="300" viewBox="0 0 280 200">
              <rect x="0" y="0" width="280" height="200" rx="12" fill="#0D1117" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <rect x="0" y="0" width="280" height="22" rx="12" fill="rgba(255,255,255,0.04)" />
              <circle cx="14" cy="11" r="4" fill="#FF5F57" opacity={0.6} />
              <circle cx="28" cy="11" r="4" fill="#FFBD2E" opacity={0.6} />
              <circle cx="42" cy="11" r="4" fill="#28CA41" opacity={0.6} />
              <rect x="20" y="35" width="240" height="35" rx="4" fill="rgba(255,255,255,0.04)" />
              <rect x="80" y="45" width="120" height="8" rx="3" fill="rgba(255,255,255,0.12)" />
              <rect x="100" y="57" width="80" height="5" rx="2" fill="rgba(255,255,255,0.06)" />
              {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 85} y="82" width="75" height="55" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
              <rect x="90" y="160" width="100" height="4" rx="2" fill="rgba(255,255,255,0.04)" />
              <text x="140" y="115" textAnchor="middle" fontSize="14" fontFamily={fonts.main} fill="rgba(255,255,255,0.08)" fontWeight="700">STATIC</text>
            </svg>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ fontSize: 54, fontWeight: 700, fontFamily: fonts.main, color: "rgba(255,255,255,0.7)" }}>靜態網站</span>
              <svg width="54" height="54" viewBox="0 0 36 36" style={{ transform: `scale(${checkScale})` }}>
                <circle cx="18" cy="18" r="16" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2" />
                <path d="M10 18 L15 23 L26 12" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
        {questionOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 42, opacity: questionOpacity, transform: `scale(${questionScale})` }}>
            <svg width="570" height="390" viewBox="0 0 380 260">
              <defs>
                <linearGradient id="cdaHeroGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="380" height="260" rx="12" fill="#0D1117" stroke={`${colors.accentSecondary}30`} strokeWidth="1.5" />
              <rect x="0" y="0" width="380" height="22" rx="12" fill="rgba(255,255,255,0.04)" />
              <circle cx="14" cy="11" r="4" fill="#FF5F57" opacity={0.6} />
              <circle cx="28" cy="11" r="4" fill="#FFBD2E" opacity={0.6} />
              <circle cx="42" cy="11" r="4" fill="#28CA41" opacity={0.6} />
              <rect x="0" y="22" width="380" height="70" fill="url(#cdaHeroGrad)" opacity={0.2} />
              <circle cx={190} cy={55 + wave1} r="8" fill="#8B5CF6" opacity={0.7} />
              <rect x={130 + wave2} y="48" width="40" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
              <rect x={210} y={50 + wave3 * 0.5} width="60" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
              {[0, 1, 2].map((i) => {
                const cardWave = Math.sin(frame * 0.06 + i * 1.2) * 5;
                return (
                  <g key={i}>
                    <rect x={25 + i * 118} y={105 + cardWave} width="105" height="70" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <circle cx={77 + i * 118} cy={128 + cardWave} r={8 * pulseScale} fill={["#8B5CF6", "#EC4899", "#F59E0B"][i]} opacity={0.6} />
                    <rect x={47 + i * 118} y={148 + cardWave} width="60" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
                  </g>
                );
              })}
              <circle cx="60" cy={200 - particleY1} r="2.5" fill={colors.accent} opacity={0.4} />
              <circle cx="150" cy={220 - particleY2} r="2" fill="#EC4899" opacity={0.35} />
              <circle cx="280" cy={210 - particleY1 * 0.8} r="3" fill="#8B5CF6" opacity={0.3} />
              <g transform={`translate(320, 210) rotate(${rotateAngle}, 0, 0)`}>
                <rect x="-8" y="-8" width="16" height="16" rx="3" fill="none" stroke={colors.accent} strokeWidth="1.5" opacity={0.3} />
              </g>
              <text x="190" y="250" textAnchor="middle" fontSize="10" fontFamily={fonts.main} fill="rgba(255,255,255,0.15)" fontWeight="600" letterSpacing="3">ANIMATIONS · TRANSITIONS · EFFECTS</text>
            </svg>
            <div style={{ display: "flex", alignItems: "center", gap: 21, transform: `translateY(${questionBounce}px)` }}>
              <span style={{ fontSize: 66, fontWeight: 700, fontFamily: fonts.main, color: "rgba(255,255,255,0.85)", letterSpacing: 3 }}>動畫特效</span>
              <span style={{ fontSize: 84, fontWeight: 800, fontFamily: fonts.main, color: colors.warning }}>?</span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};