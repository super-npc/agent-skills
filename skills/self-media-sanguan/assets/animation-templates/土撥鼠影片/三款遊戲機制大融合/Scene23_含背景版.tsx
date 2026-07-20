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
  text: "#FFFFFF",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  danger: "#FF6B6B",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const GAMES = [
  { label: "小朋友上樓梯", subLabel: "往上跳躍", color: "#2ECC71" },
  { label: "派對遊戲", subLabel: "多人歡樂", color: colors.warning },
  { label: "瑪利歐賽車", subLabel: "道具機制", color: "#FF6B6B" },
];

const StairsIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const drawP = interpolate(progress, [0, 1], [0, 1]);
  const bounce = Math.sin(frame * 0.1) * 2;
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const sx = -30 + i * 14;
        const sy = 20 - i * 12;
        const stepOpacity = interpolate(drawP, [i * 0.15, i * 0.15 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <rect key={i} x={sx} y={sy} width="16" height="8" rx="2" fill="#2ECC71" opacity={stepOpacity * 0.7} />;
      })}
      {drawP > 0.5 && (
        <g transform={`translate(${-30 + 14 * Math.min(4, Math.floor(drawP * 5))}, ${20 - 12 * Math.min(4, Math.floor(drawP * 5)) - 14 + bounce})`}>
          <circle cx="0" cy="-6" r="5" fill="#2ECC71" />
          <rect x="-4" y="-1" width="8" height="10" rx="2" fill="#2ECC71" opacity={0.8} />
        </g>
      )}
    </g>
  );
};

const PartyIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const drawP = interpolate(progress, [0, 1], [0, 1]);
  const confettiPhase = frame * 0.08;
  return (
    <g>
      <path d="M0,-25 L-16,10 L16,10Z" fill={`${colors.warning}40`} stroke={colors.warning} strokeWidth="2" strokeLinejoin="round" opacity={drawP} />
      <circle cx="0" cy="-25" r="4" fill={colors.warning} opacity={drawP} />
      <line x1="-8" y1="-5" x2="8" y2="-5" stroke={colors.warning} strokeWidth="1.5" opacity={drawP * 0.5} />
      <line x1="-12" y1="3" x2="12" y2="3" stroke={colors.warning} strokeWidth="1.5" opacity={drawP * 0.5} />
      {drawP > 0.6 && [
        { x: -20, y: -10, c: "#FF6B6B" },
        { x: 18, y: -15, c: colors.accent },
        { x: -12, y: 15, c: colors.accentSecondary },
        { x: 22, y: 8, c: colors.warning },
        { x: 5, y: -30, c: "#9B59B6" },
      ].map((conf, i) => (
        <rect key={i} x={conf.x + Math.sin(confettiPhase + i * 2) * 3} y={conf.y + Math.cos(confettiPhase + i * 1.5) * 3} width="4" height="4" rx="1" fill={conf.c} opacity={0.7} transform={`rotate(${frame * 2 + i * 45}, ${conf.x}, ${conf.y})`} />
      ))}
    </g>
  );
};

const KartIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const drawP = interpolate(progress, [0, 1], [0, 1]);
  const wheelSpin = frame * 5;
  return (
    <g>
      <rect x="-20" y="-8" width="40" height="16" rx="4" fill="#FF6B6B" opacity={drawP * 0.8} />
      <rect x="-14" y="-16" width="20" height="10" rx="3" fill="#FF6B6B" opacity={drawP * 0.6} />
      <g transform={`rotate(${wheelSpin}, -14, 12)`}>
        <circle cx="-14" cy="12" r="6" fill="#333" stroke="#555" strokeWidth="1.5" opacity={drawP} />
      </g>
      <g transform={`rotate(${wheelSpin}, 14, 12)`}>
        <circle cx="14" cy="12" r="6" fill="#333" stroke="#555" strokeWidth="1.5" opacity={drawP} />
      </g>
      {drawP > 0.5 && (
        <g transform="translate(24, -14)">
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill={`${colors.warning}60`} stroke={colors.warning} strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="15" fontWeight="800" fill={colors.warning}>?</text>
        </g>
      )}
    </g>
  );
};

export const Scene23-GameMashup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gameSprings = GAMES.map((_, i) =>
    spring({ frame: Math.max(0, frame - (10 + i * 22)), fps, config: { damping: 10, mass: 0.6, stiffness: 120 } })
  );
  const iconDrawProgress = GAMES.map((_, i) =>
    interpolate(frame, [20 + i * 22, 60 + i * 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const plus1 = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plus2 = interpolate(frame, [67, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const equalsProgress = interpolate(frame, [120, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultSpring = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const resultScale = interpolate(resultSpring, [0, 1], [0.4, 1]);
  const resultOpacity = interpolate(frame, [140, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  const cardW = 300;
  const gap = 75;
  const icons = [StairsIcon, PartyIcon, KartIcon];

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}08 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ display: "flex", alignItems: "center", gap }}>
          {GAMES.map((game, i) => {
            const s = interpolate(gameSprings[i], [0, 1], [0.5, 1]);
            const op = interpolate(gameSprings[i], [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const IconComponent = icons[i];
            return (
              <React.Fragment key={game.label}>
                {i > 0 && (
                  <div style={{ fontSize: 72, fontWeight: 300, color: colors.dimmed, opacity: i === 1 ? plus1 : plus2, marginLeft: -gap / 2 - 10, marginRight: -gap / 2 - 10 }}>+</div>
                )}
                <div style={{ width: cardW, opacity: op, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                  <div style={{ width: cardW, height: 210, borderRadius: 20, background: `${game.color}10`, border: `2px solid ${game.color}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="150" height="120" viewBox="-40 -35 80 70">
                      <IconComponent progress={iconDrawProgress[i]} frame={frame} />
                    </svg>
                  </div>
                  <div style={{ fontSize: 33, fontWeight: 700, fontFamily: fonts.main, color: game.color, textAlign: "center" }}>{game.label}</div>
                  <div style={{ fontSize: 22.5, fontWeight: 500, fontFamily: fonts.main, color: `${colors.dimmed}80`, textAlign: "center" }}>{game.subLabel}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ fontSize: 84, fontWeight: 300, color: colors.dimmed, opacity: equalsProgress }}>=</div>
        <div style={{ fontSize: 78, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 4, textAlign: "center", opacity: resultOpacity, transform: `scale(${resultScale})` }}>
          <span style={{ background: "linear-gradient(90deg, #2ECC71, #FFB547, #FF6B6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 0 20px ${colors.accent}30)` }}>
            我的全新遊戲
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};