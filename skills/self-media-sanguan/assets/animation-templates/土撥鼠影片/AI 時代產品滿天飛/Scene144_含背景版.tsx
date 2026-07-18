import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type IconType = "chat" | "camera" | "music" | "code" | "star" | "heart" | "bolt" | "play" | "search" | "cloud" | "lock" | "cart" | "mail" | "pen" | "globe" | "bell";
const ICON-TYPES: IconType[] = ["chat", "camera", "music", "code", "star", "heart", "bolt", "play", "search", "cloud", "lock", "cart", "mail", "pen", "globe", "bell"];
const COLORS = ["#FF3B30","#FF9500","#FFCC00","#34C759","#00C7BE","#007AFF","#5856D6","#AF52DE","#FF2D55","#5AC8FA","#FF6B6B","#48DBFB","#0ABF53","#F368E0","#EE5A24","#6C5CE7"];

const ICON-SIZE = 80;
const GAP = 8;
const COLS = Math.ceil(1920 / (ICON-SIZE + GAP)) + 2;
const ROWS = Math.ceil(1080 / (ICON-SIZE + GAP)) + 2;

const seeded = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const PRODUCTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const r = seeded(i + 1), r2 = seeded(i * 7 + 3), r3 = seeded(i * 13 + 5);
  const x = -40 + col * (ICON-SIZE + GAP) + (r - 0.5) * 6;
  const y = -40 + row * (ICON-SIZE + GAP) + (r2 - 0.5) * 6;
  const dx = x - 960, dy = y - 540;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return { x, y, color: COLORS[Math.floor(r * COLORS.length)], icon: ICON-TYPES[Math.floor(r2 * ICON-TYPES.length)], rotation: (r3 - 0.5) * 16, delay: dist * 0.06 + r * 8, size: ICON-SIZE };
});

const renderIcon = (icon: IconType, cx: number, cy: number, s: number) => {
  const h = s * 0.3;
  switch (icon) {
    case "chat": return <path d={`M${cx-h} ${cy-h*0.6} Q${cx-h} ${cy-h} ${cx-h*0.5} ${cy-h} L${cx+h*0.5} ${cy-h} Q${cx+h} ${cy-h} ${cx+h} ${cy-h*0.6} L${cx+h} ${cy+h*0.3} Q${cx+h} ${cy+h*0.7} ${cx+h*0.5} ${cy+h*0.7} L${cx-h*0.2} ${cy+h*0.7} L${cx-h*0.6} ${cy+h} L${cx-h*0.5} ${cy+h*0.7} Q${cx-h} ${cy+h*0.7} ${cx-h} ${cy+h*0.3} Z`} fill="rgba(255,255,255,0.9)" />;
    case "camera": return <><rect x={cx-h} y={cy-h*0.5} width={h*2} height={h*1.4} rx={h*0.15} fill="rgba(255,255,255,0.9)" /><circle cx={cx} cy={cy+h*0.1} r={h*0.4} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.5} /></>;
    case "music": return <><line x1={cx+h*0.3} y1={cy-h} x2={cx+h*0.3} y2={cy+h*0.5} stroke="rgba(255,255,255,0.9)" strokeWidth={2} /><circle cx={cx-h*0.1} cy={cy+h*0.5} r={h*0.35} fill="rgba(255,255,255,0.9)" /></>;
    case "code": return <><path d={`M${cx-h*0.3} ${cy-h*0.6} L${cx-h*0.8} ${cy} L${cx-h*0.3} ${cy+h*0.6}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /><path d={`M${cx+h*0.3} ${cy-h*0.6} L${cx+h*0.8} ${cy} L${cx+h*0.3} ${cy+h*0.6}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></>;
    case "star": return <polygon points={[0,1,2,3,4].map(j => { const a=(j*72-90)*Math.PI/180; const r2=j%2===0?h:h*0.45; return `${cx+Math.cos(a)*r2},${cy+Math.sin(a)*r2}`; }).join(" ")} fill="rgba(255,255,255,0.9)" />;
    case "heart": return <path d={`M${cx} ${cy+h*0.6} C${cx-h*1.5} ${cy-h*0.3} ${cx-h*0.5} ${cy-h*1.2} ${cx} ${cy-h*0.3} C${cx+h*0.5} ${cy-h*1.2} ${cx+h*1.5} ${cy-h*0.3} ${cx} ${cy+h*0.6} Z`} fill="rgba(255,255,255,0.9)" />;
    case "bolt": return <polygon points={`${cx-h*0.1},${cy-h} ${cx-h*0.5},${cy+h*0.1} ${cx+h*0.05},${cy+h*0.1} ${cx+h*0.1},${cy+h} ${cx+h*0.5},${cy-h*0.1} ${cx-h*0.05},${cy-h*0.1}`} fill="rgba(255,255,255,0.9)" />;
    case "play": return <polygon points={`${cx-h*0.4},${cy-h*0.7} ${cx+h*0.7},${cy} ${cx-h*0.4},${cy+h*0.7}`} fill="rgba(255,255,255,0.9)" />;
    case "search": return <><circle cx={cx-h*0.15} cy={cy-h*0.15} r={h*0.5} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} /><line x1={cx+h*0.2} y1={cy+h*0.2} x2={cx+h*0.7} y2={cy+h*0.7} stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} strokeLinecap="round" /></>;
    case "cloud": return <path d={`M${cx-h*0.7} ${cy+h*0.3} Q${cx-h} ${cy+h*0.3} ${cx-h} ${cy} Q${cx-h} ${cy-h*0.5} ${cx-h*0.4} ${cy-h*0.5} Q${cx-h*0.2} ${cy-h} ${cx+h*0.2} ${cy-h*0.5} Q${cx+h*0.8} ${cy-h*0.7} ${cx+h*0.8} ${cy} Q${cx+h*0.8} ${cy+h*0.3} ${cx+h*0.5} ${cy+h*0.3} Z`} fill="rgba(255,255,255,0.9)" />;
    case "lock": return <><rect x={cx-h*0.5} y={cy-h*0.1} width={h} height={h*0.9} rx={h*0.1} fill="rgba(255,255,255,0.9)" /><path d={`M${cx-h*0.3} ${cy-h*0.1} L${cx-h*0.3} ${cy-h*0.5} Q${cx-h*0.3} ${cy-h} ${cx} ${cy-h} Q${cx+h*0.3} ${cy-h} ${cx+h*0.3} ${cy-h*0.5} L${cx+h*0.3} ${cy-h*0.1}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} /></>;
    case "mail": return <><rect x={cx-h*0.8} y={cy-h*0.5} width={h*1.6} height={h*1} rx={h*0.1} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} /><path d={`M${cx-h*0.8} ${cy-h*0.5} L${cx} ${cy+h*0.15} L${cx+h*0.8} ${cy-h*0.5}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></>;
    case "globe": return <><circle cx={cx} cy={cy} r={h*0.75} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} /><ellipse cx={cx} cy={cy} rx={h*0.35} ry={h*0.75} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} /><line x1={cx-h*0.75} y1={cy} x2={cx+h*0.75} y2={cy} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} /></>;
    default: return <circle cx={cx} cy={cy} r={h*0.5} fill="rgba(255,255,255,0.9)" />;
  }
};

export const Scene144-ProductOverflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [135, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);
  const overflowScale = interpolate(frame, [80, 130], [1, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0A0E14", display: "flex", alignItems: "center", justifyContent: "center", opacity: masterOpacity }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ transform: `scale(${overflowScale})` }}>
        {PRODUCTS.map((p, i) => {
          const popFrame = Math.max(0, frame - 5 - p.delay);
          if (popFrame <= 0) return null;
          const popSpring = spring({ frame: popFrame, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
          const scale = popSpring;
          const half = p.size / 2;
          const cx = p.x + half;
          const cy = p.y + half;
          const wobble = popSpring >= 0.95 ? Math.sin(frame * 0.05 + i * 1.7) * 1.5 : 0;
          return (
            <g key={i} transform={`translate(${cx + wobble},${cy}) scale(${scale}) translate(${-cx},${-cy}) rotate(${p.rotation * (1 - popSpring * 0.5)} ${cx} ${cy})`}>
              <rect x={p.x + 2} y={p.y + 2} width={p.size - 4} height={p.size - 4} rx={p.size * 0.22} fill={p.color} />
              <rect x={p.x + 4} y={p.y + 4} width={p.size - 8} height={(p.size - 8) * 0.45} rx={p.size * 0.18} fill="rgba(255,255,255,0.15)" />
              <g opacity={0.85}>{renderIcon(p.icon, cx, cy, p.size)}</g>
            </g>
          );
        })}
        {frame > 60 && (() => {
          const glowOp = interpolate(frame, [60, 90], [0, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const glowR = interpolate(frame, [60, 130], [100, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle cx={960} cy={540} r={glowR} fill="url(#s144centerGlow)" opacity={glowOp} />;
        })()}
        <defs>
          <radialGradient id="s144centerGlow">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};