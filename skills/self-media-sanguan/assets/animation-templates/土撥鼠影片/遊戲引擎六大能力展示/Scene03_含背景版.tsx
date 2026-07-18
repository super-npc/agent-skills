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
  border: "rgba(0, 212, 170, 0.3)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const RunningFigure: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => {
  const runCycle = Math.sin(frame * 0.4) * 12;
  const armSwing = Math.sin(frame * 0.4 + Math.PI) * 20;
  const bobY = Math.abs(Math.sin(frame * 0.4)) * 5;
  const moveX = interpolate(progress, [0, 1], [-40, 40]);
  const opacity = interpolate(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0.8]);
  return (
    <g transform={`translate(${moveX}, ${-bobY})`} opacity={opacity}>
      <circle cx="0" cy="-30" r="8" fill={colors.accent} />
      <line x1="0" y1="-22" x2="0" y2="5" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="-15" x2={-12 + armSwing * 0.3} y2={-5 + Math.abs(armSwing) * 0.15} stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="-15" x2={12 - armSwing * 0.3} y2={-5 + Math.abs(armSwing) * 0.15} stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2={runCycle * 0.8} y2="25" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2={-runCycle * 0.8} y2="25" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={-20 - i * 6} y1={-20 + i * 12} x2={-28 - i * 6} y2={-20 + i * 12} stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" opacity={0.4 + Math.sin(frame * 0.3 + i) * 0.3} />
      ))}
    </g>
  );
};

const JumpingFigure: React.FC<{ progress: number }> = ({ progress }) => {
  const jumpY = interpolate(progress, [0, 0.15, 0.5, 0.85, 1], [0, 0, -45, -45, 0]);
  const squash = progress < 0.15 ? interpolate(progress, [0, 0.15], [1, 0.8]) : progress > 0.85 ? interpolate(progress, [0.85, 1], [0.8, 1]) : 1;
  const stretch = progress > 0.15 && progress < 0.5 ? interpolate(progress, [0.15, 0.35], [1, 1.2]) : progress >= 0.5 && progress < 0.85 ? interpolate(progress, [0.5, 0.85], [1.2, 1]) : 1;
  const armsUp = progress > 0.15 && progress < 0.85;
  const opacity = interpolate(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0.8]);
  return (
    <g transform={`translate(0, ${jumpY}) scale(${squash}, ${stretch})`} opacity={opacity}>
      <circle cx="0" cy="-30" r="8" fill={colors.warning} />
      <line x1="0" y1="-22" x2="0" y2="5" stroke={colors.warning} strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="-15" x2={armsUp ? -14 : -12} y2={armsUp ? -30 : -5} stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="-15" x2={armsUp ? 14 : 12} y2={armsUp ? -30 : -5} stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2={-8} y2={armsUp ? 15 : 25} stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2={8} y2={armsUp ? 15 : 25} stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
};

const PunchingFigure: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const punchExtend = progress > 0.3 && progress < 0.7 ? interpolate(progress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]) : 0;
  const opacity = interpolate(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0.8]);
  const impactFlash = punchExtend > 0.8;
  return (
    <g opacity={opacity}>
      <circle cx="0" cy="-30" r="8" fill={colors.danger} />
      <line x1="0" y1="-22" x2="0" y2="5" stroke={colors.danger} strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="-15" x2={12 + punchExtend * 25} y2={-15 + punchExtend * 2} stroke={colors.danger} strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="-15" x2="-12" y2="-5" stroke={colors.danger} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2="-8" y2="25" stroke={colors.danger} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="5" x2="10" y2="22" stroke={colors.danger} strokeWidth="2.5" strokeLinecap="round" />
      {impactFlash && (
        <g transform={`translate(40, -16)`}>
          {[0, 45, 90, 135].map((angle) => (
            <line key={angle} x1="0" y1="0" x2={Math.cos((angle * Math.PI) / 180) * 12} y2={Math.sin((angle * Math.PI) / 180) * 12} stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
      )}
    </g>
  );
};

const ButtonPress: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const pressed = progress > 0.3 && progress < 0.6;
  const btnY = pressed ? 4 : 0;
  const ripple = progress > 0.4 ? interpolate(progress, [0.4, 0.8], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.8]);
  return (
    <g opacity={opacity}>
      <rect x="-28" y="4" width="56" height="28" rx="8" fill="rgba(0,0,0,0.3)" />
      <rect x="-28" y={btnY} width="56" height="28" rx="8" fill={pressed ? colors.accent : colors.accentSecondary} stroke={colors.accent} strokeWidth="2" />
      <text x="0" y={16 + btnY} textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="monospace" fill="#fff">A</text>
      <g transform={`translate(0, ${pressed ? -16 : -22})`}>
        <circle cx="0" cy="0" r="6" fill={colors.dimmed} opacity={0.6} />
        <line x1="0" y1="-6" x2="0" y2="-18" stroke={colors.dimmed} strokeWidth="3" strokeLinecap="round" opacity={0.5} />
      </g>
      {ripple > 0 && (
        <>
          <circle cx="0" cy="14" r={20 + ripple * 30} stroke={colors.accent} strokeWidth="2" fill="none" opacity={(1 - ripple) * 0.6} />
          <circle cx="0" cy="14" r={10 + ripple * 20} stroke={colors.accent} strokeWidth="1.5" fill="none" opacity={(1 - ripple) * 0.4} />
        </>
      )}
    </g>
  );
};

const CollisionEffect: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const approach = interpolate(progress, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const bounce = progress > 0.35 ? interpolate(progress, [0.35, 0.7, 1], [0, 1, 1]) : 0;
  const leftX = interpolate(approach, [0, 1], [-50, -12]) + (bounce > 0 ? -bounce * 30 : 0);
  const rightX = interpolate(approach, [0, 1], [50, 12]) + (bounce > 0 ? bounce * 30 : 0);
  const impactFlash = progress > 0.33 && progress < 0.5;
  const opacity = interpolate(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0.8]);
  return (
    <g opacity={opacity}>
      <rect x={leftX - 12} y="-12" width="24" height="24" rx="4" fill={colors.accentSecondary} opacity={0.9} />
      <circle cx={rightX} cy="0" r="12" fill={colors.warning} opacity={0.9} />
      {impactFlash && (
        <g>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle key={angle} cx={Math.cos((angle * Math.PI) / 180) * 10} cy={Math.sin((angle * Math.PI) / 180) * 10} r="2.5" fill={colors.warning} opacity={0.8} />
          ))}
          <circle cx="0" cy="0" r="8" fill="#fff" opacity={0.4} />
        </g>
      )}
    </g>
  );
};

const ScreenRefresh: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const scanlineY = interpolate((frame * 3) % 60, [0, 60], [-30, 30]);
  const fpsCount = progress > 0.2 ? Math.floor(interpolate(progress, [0.2, 0.5], [0, 60], { extrapolateRight: "clamp" })) : 0;
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.8]);
  return (
    <g opacity={opacity}>
      <rect x="-35" y="-25" width="70" height="50" rx="4" fill="rgba(255,255,255,0.05)" stroke={colors.accent} strokeWidth="2" />
      <line x1="-33" y1={scanlineY} x2="33" y2={scanlineY} stroke={colors.accent} strokeWidth="1" opacity={0.3} />
      {[-15, -5, 5, 15].map((yPos, i) => (
        <rect key={i} x="-25" y={yPos - 2} width={interpolate(progress, [0.1 + i * 0.05, 0.3 + i * 0.05], [0, 50 - i * 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} height="4" rx="2" fill={i % 2 === 0 ? colors.accent : colors.accentSecondary} opacity={0.5} />
      ))}
      <g transform="translate(25, -18)">
        <rect x="-14" y="-8" width="28" height="16" rx="4" fill={colors.accent} opacity={0.9} />
        <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#000">{fpsCount}</text>
      </g>
    </g>
  );
};

const AbilityCard: React.FC<{ children: React.ReactNode; label: string; progress: number; color: string }> = ({ children, label, progress, color }) => {
  const scale = interpolate(progress, [0, 0.5, 1], [0, 1.1, 1]);
  const opacity = interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ transform: `scale(${scale})`, opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ width: 420, height: 330, borderRadius: 20, background: colors.cardBg, border: `1.5px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${color}15` }}>
        {children}
      </div>
      <div style={{ fontSize: 45, fontWeight: 700, fontFamily: fonts.main, color, letterSpacing: 3, textShadow: `0 0 12px ${color}40` }}>{label}</div>
    </div>
  );
};

export const Scene03-EngineAbilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const runProgress = interpolate(frame, [30, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jumpProgress = interpolate(frame, [55, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchProgress = interpolate(frame, [80, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const runCardSpring = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 12, stiffness: 100 } });
  const jumpCardSpring = spring({ frame: Math.max(0, frame - 53), fps, config: { damping: 12, stiffness: 100 } });
  const punchCardSpring = spring({ frame: Math.max(0, frame - 78), fps, config: { damping: 12, stiffness: 100 } });

  const buttonProgress = interpolate(frame, [110, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const collisionProgress = interpolate(frame, [135, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const refreshProgress = interpolate(frame, [160, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const buttonCardSpring = spring({ frame: Math.max(0, frame - 108), fps, config: { damping: 12, stiffness: 100 } });
  const collisionCardSpring = spring({ frame: Math.max(0, frame - 133), fps, config: { damping: 12, stiffness: 100 } });
  const refreshCardSpring = spring({ frame: Math.max(0, frame - 158), fps, config: { damping: 12, stiffness: 100 } });

  const fadeOut = interpolate(frame, [240, 270], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 420px)", gridTemplateRows: "repeat(2, auto)", gap: "75px 120px", justifyContent: "center", alignContent: "center" }}>
          <AbilityCard label="會跑" progress={runCardSpring} color={colors.accent}>
            <svg width="300" height="255" viewBox="-60 -45 120 90"><RunningFigure frame={frame} progress={runProgress} /></svg>
          </AbilityCard>
          <AbilityCard label="會跳" progress={jumpCardSpring} color={colors.warning}>
            <svg width="300" height="255" viewBox="-60 -50 120 100"><JumpingFigure progress={jumpProgress} /></svg>
          </AbilityCard>
          <AbilityCard label="會打人" progress={punchCardSpring} color={colors.danger}>
            <svg width="300" height="255" viewBox="-60 -45 120 90"><PunchingFigure progress={punchProgress} frame={frame} /></svg>
          </AbilityCard>
          <AbilityCard label="按鍵反應" progress={buttonCardSpring} color={colors.accentSecondary}>
            <svg width="300" height="255" viewBox="-60 -45 120 90"><ButtonPress progress={buttonProgress} frame={frame} /></svg>
          </AbilityCard>
          <AbilityCard label="碰撞偵測" progress={collisionCardSpring} color={colors.warning}>
            <svg width="300" height="255" viewBox="-60 -30 120 60"><CollisionEffect progress={collisionProgress} frame={frame} /></svg>
          </AbilityCard>
          <AbilityCard label="畫面更新" progress={refreshCardSpring} color={colors.accent}>
            <svg width="300" height="255" viewBox="-60 -35 120 70"><ScreenRefresh progress={refreshProgress} frame={frame} /></svg>
          </AbilityCard>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};