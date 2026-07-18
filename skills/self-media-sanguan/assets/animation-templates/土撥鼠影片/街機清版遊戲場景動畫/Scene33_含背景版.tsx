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
  dimmed: "rgba(255, 255, 255, 0.6)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const ENEMIES = [
  { x: 380, color: "#E74C3C", size: 28, delay: 60 },
  { x: 520, color: "#C0392B", size: 32, delay: 90 },
  { x: 600, color: "#E67E22", size: 26, delay: 100 },
  { x: 740, color: "#E74C3C", size: 30, delay: 130 },
  { x: 830, color: "#9B59B6", size: 36, delay: 150 },
  { x: 950, color: "#C0392B", size: 28, delay: 165 },
];

export const Scene33-ArcadeBeatEmUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleFade = interpolate(frame, [40, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stageOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heroProgress = interpolate(frame, [50, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heroX = interpolate(heroProgress, [0, 1], [80, 1020]);
  const heroOpacity = interpolate(frame, [45, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heroBob = frame >= 50 && frame < 220 ? Math.sin(frame * 0.3) * 4 : 0;

  const getHitFlash = (enemyDelay: number) => {
    const hitFrame = enemyDelay + 15;
    return interpolate(frame, [hitFrame, hitFrame + 4, hitFrame + 8], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  const fadeOut = interpolate(frame, [240, 270], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);
  const stageW = 1100;
  const stageH = 400;
  const groundY = 280;

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}08 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        <div style={{ position: "absolute", top: 120, fontSize: 78, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 6, opacity: titleOpacity * titleFade, transform: `scale(${titleScale})` }}>
          <span style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.warning})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>街機遊戲</span>
        </div>
        <svg width={stageW * 1.5} height={stageH * 1.5} viewBox={`0 0 ${stageW} ${stageH}`} style={{ opacity: stageOpacity }}>
          <rect x="60" y="120" width="80" height="160" rx="4" fill="#FFFFFF08" />
          <rect x="160" y="80" width="60" height="200" rx="4" fill="#FFFFFF06" />
          <rect x="250" y="140" width="90" height="140" rx="4" fill="#FFFFFF05" />
          <rect x="380" y="100" width="70" height="180" rx="4" fill="#FFFFFF07" />
          <rect x="500" y="130" width="100" height="150" rx="4" fill="#FFFFFF05" />
          <rect x="640" y="90" width="60" height="190" rx="4" fill="#FFFFFF06" />
          <rect x="730" y="150" width="80" height="130" rx="4" fill="#FFFFFF04" />
          <rect x="860" y="110" width="70" height="170" rx="4" fill="#FFFFFF07" />
          <rect x="960" y="140" width="90" height="140" rx="4" fill="#FFFFFF05" />
          <rect x="20" y={groundY} width={stageW - 40} height="8" rx="4" fill="#FFFFFF20" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect key={i} x={60 + i * 120} y={groundY + 15} width={60} height="3" rx="1.5" fill="#FFFFFF0a" />
          ))}
          <g opacity={interpolate(frame, [55, 70], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <line x1="80" y1={groundY + 35} x2="1020" y2={groundY + 35} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" opacity={0.15} />
            <polygon points="1025,35 1010,28 1010,42" fill="#FFFFFF" opacity={0.15} transform={`translate(0, ${groundY})`} />
          </g>
          {ENEMIES.map((enemy, i) => {
            const eSpring = spring({ frame: Math.max(0, frame - enemy.delay), fps, config: { damping: 10, mass: 0.5, stiffness: 130 } });
            const eScale = interpolate(eSpring, [0, 1], [0, 1]);
            const eOp = interpolate(eSpring, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
            const defeated = heroX > enemy.x - 20;
            const hitFlash = getHitFlash(enemy.delay);
            const defeatOp = defeated ? interpolate(frame, [enemy.delay + 15, enemy.delay + 25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
            const enemyBob = !defeated ? Math.sin(frame * 0.15 + i * 3) * 3 : 0;
            const r = enemy.size;
            return (
              <g key={i} transform={`translate(${enemy.x}, ${groundY - r - 8 + enemyBob}) scale(${eScale})`} opacity={eOp * defeatOp}>
                <rect x={-r * 0.6} y={-r * 0.4} width={r * 1.2} height={r * 1.4} rx={6} fill={enemy.color} opacity={0.8} />
                <circle cx={0} cy={-r * 0.7} r={r * 0.45} fill={enemy.color} opacity={0.9} />
                <circle cx={-r * 0.15} cy={-r * 0.75} r={3} fill="#FFFFFF" />
                <circle cx={r * 0.15} cy={-r * 0.75} r={3} fill="#FFFFFF" />
                {hitFlash > 0 && <circle cx={0} cy={-r * 0.3} r={r * 1.2} fill={colors.warning} opacity={hitFlash * 0.5} />}
              </g>
            );
          })}
          <g transform={`translate(${heroX}, ${groundY - 38 + heroBob})`} opacity={heroOpacity}>
            <rect x={-16} y={-10} width={32} height={40} rx={8} fill={colors.accent} opacity={0.9} />
            <circle cx={0} cy={-22} r={14} fill={colors.accent} />
            <circle cx={-5} cy={-24} r={2.5} fill="#FFFFFF" />
            <circle cx={5} cy={-24} r={2.5} fill="#FFFFFF" />
            {frame >= 50 && (
              <g>
                <line x1={18} y1={-5} x2={42} y2={-15} stroke={colors.warning} strokeWidth={4} strokeLinecap="round" />
                <circle cx={44} cy={-16} r={3} fill={colors.warning} opacity={0.8} />
              </g>
            )}
            <circle cx={0} cy={0} r={35} fill="none" stroke={colors.accent} strokeWidth="1.5" opacity={0.2 + Math.sin(frame * 0.08) * 0.1} />
          </g>
          <text x={80} y={groundY + 50} textAnchor="middle" fontSize="18" fontWeight="700" fontFamily={fonts.main} fill="#FFFFFF50" opacity={stageOpacity}>START</text>
          <g opacity={interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <line x1={1020} y1={groundY - 60} x2={1020} y2={groundY} stroke="#FFFFFFaa" strokeWidth="2" />
            <polygon points={`1022,${groundY - 58} 1055,${groundY - 48} 1022,${groundY - 38}`} fill={colors.warning} opacity={0.8} />
            <text x={1020} y={groundY + 50} textAnchor="middle" fontSize="18" fontWeight="700" fontFamily={fonts.main} fill={`${colors.warning}90`}>GOAL</text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};