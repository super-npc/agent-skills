import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const Person: React.FC<{ x: number; y: number; color: string; opacity: number; scale: number }> = ({ x, y, color, opacity, scale }) => (
  <g opacity={opacity} transform={`translate(${x},${y}) scale(${scale}) translate(${-x},${-y})`}>
    <circle cx={x} cy={y - 18} r={10} fill={color} />
    <path d={`M ${x - 14} ${y + 18} Q ${x - 14} ${y - 4} ${x} ${y - 4} Q ${x + 14} ${y - 4} ${x + 14} ${y + 18}`} fill={color} />
  </g>
);

const Lightning: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <path
    d={`M ${x - 4} ${y - 12} L ${x + 2} ${y - 2} L ${x - 2} ${y - 2} L ${x + 4} ${y + 12} L ${x - 1} ${y + 1} L ${x + 3} ${y + 1} Z`}
    fill="#F59E0B"
    opacity={opacity}
  />
);

export const Scene140-ReachPainPoints: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const CX = 400;
  const CY = 540;
  const towerSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, stiffness: 80 } });

  const people = [
    { x: 900, y: 340, hasPain: true, delay: 15 },
    { x: 1050, y: 450, hasPain: false, delay: 18 },
    { x: 1200, y: 350, hasPain: true, delay: 20 },
    { x: 950, y: 600, hasPain: false, delay: 22 },
    { x: 1100, y: 700, hasPain: true, delay: 24 },
    { x: 1350, y: 550, hasPain: false, delay: 17 },
    { x: 1450, y: 400, hasPain: true, delay: 26 },
    { x: 1300, y: 720, hasPain: false, delay: 21 },
    { x: 1500, y: 620, hasPain: true, delay: 28 },
    { x: 1150, y: 540, hasPain: false, delay: 19 },
  ];

  const PULSE-START = 35;
  const PULSE-INTERVAL = 30;
  const NUM-PULSES = 5;

  const pulses = Array.from({ length: NUM-PULSES }, (_, i) => {
    const startFrame = PULSE-START + i * PULSE-INTERVAL;
    const t = Math.max(0, frame - startFrame);
    const r = interpolate(t, [0, 60], [0, 1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity = interpolate(t, [0, 10, 40, 60], [0, 0.25, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { r, opacity, active: t > 0 && t < 65 };
  });

  const connectionStart = 60;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", alignItems: "center", justifyContent: "center", opacity: masterOpacity }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <filter id="s140glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g opacity={towerSpring} filter="url(#s140glow)">
          <line x1={CX} y1={CY - 80} x2={CX} y2={CY + 60} stroke="#4DA3FF" strokeWidth={4} strokeLinecap="round" />
          <circle cx={CX} cy={CY - 85} r={8} fill="#4DA3FF" />
          <line x1={CX - 30} y1={CY + 60} x2={CX + 30} y2={CY + 60} stroke="#4DA3FF" strokeWidth={4} strokeLinecap="round" />
          <line x1={CX - 20} y1={CY - 50} x2={CX + 20} y2={CY - 50} stroke="#4DA3FF" strokeWidth={3} strokeLinecap="round" />
          <line x1={CX - 12} y1={CY - 20} x2={CX + 12} y2={CY - 20} stroke="#4DA3FF" strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {pulses.map((p, i) =>
          p.active ? (
            <circle key={i} cx={CX} cy={CY} r={p.r} fill="none" stroke="#4DA3FF" strokeWidth={2} opacity={p.opacity} />
          ) : null,
        )}

        {people.map((p, i) => {
          const pSpring = spring({ frame: Math.max(0, frame - p.delay), fps, config: { damping: 14, stiffness: 100 } });
          const dist = Math.sqrt((p.x - CX) ** 2 + (p.y - CY) ** 2);
          const isReached = pulses.some((pulse) => pulse.active && Math.abs(pulse.r - dist) < 60);
          const connProgress = p.hasPain ? interpolate(frame - connectionStart - i * 3, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const highlight = p.hasPain ? interpolate(frame - connectionStart - i * 3, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          const baseColor = p.hasPain ? "#F59E0B" : "rgba(255,255,255,0.25)";
          const litColor = highlight > 0.5 ? "#F59E0B" : baseColor;

          return (
            <g key={i}>
              {connProgress > 0 && p.hasPain && (
                <line x1={CX + 40} y1={CY} x2={CX + 40 + (p.x - CX - 55) * connProgress} y2={CY + (p.y - CY) * connProgress} stroke="#4DA3FF" strokeWidth={1.5} strokeDasharray="6 4" strokeDashoffset={-frame * 0.6} opacity={0.3 * connProgress} />
              )}
              {highlight > 0.5 && (
                <circle cx={p.x} cy={p.y} r={38} fill="none" stroke="#F59E0B" strokeWidth={1.5} opacity={0.25 * highlight} filter="url(#s140glow)" />
              )}
              <Person x={p.x} y={p.y} color={litColor} opacity={pSpring} scale={pSpring} />
              {p.hasPain && <Lightning x={p.x + 18} y={p.y - 35} opacity={pSpring * 0.7} />}
            </g>
          );
        })}

        {[1, 2, 3].map((n) => {
          const arcR = 30 + n * 25;
          return (
            <path key={n} d={`M ${CX + Math.cos(-0.6) * arcR} ${CY - 85 + Math.sin(-0.6) * arcR} A ${arcR} ${arcR} 0 0 1 ${CX + Math.cos(0.6) * arcR} ${CY - 85 + Math.sin(0.6) * arcR}`} fill="none" stroke="#4DA3FF" strokeWidth={2} strokeLinecap="round" opacity={0.2} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};