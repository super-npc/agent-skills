import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

export const EXPERIMENT1-DURATION-FRAMES = 240;

const SFX = {
  woosh: staticFile("audio/connection/woosh.wav"),
  softImpact: staticFile("audio/connection/soft-impact.wav"),
  softClick: staticFile("audio/connection/soft-click.wav"),
};

const CX = 960;
const CY = 500;
const ORBIT-R = 300;

const MODULE-ANGLES-DEG = [-90, -18, 54, 126, 198];
const modulePositions = MODULE-ANGLES-DEG.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + ORBIT-R * Math.cos(rad), y: CY + ORBIT-R * Math.sin(rad) };
});

const modules = [
  { path: "M-8,-16 L8,-16 L8,-8 C8,-8 14,-8 14,-2 C14,4 8,4 8,4 L8,12 L-2,12 C-2,12 -2,6 -8,6 C-14,6 -14,12 -14,12 L-22,12 L-22,4 C-22,4 -16,4 -16,-2 C-16,-8 -22,-8 -22,-8 L-22,-16 Z", pathLen: 220, color1: "#4DA3FF", color2: "#60C4FF" },
  { path: "M-3,-18 L3,-18 L5,-12 L11,-10 L16,-14 L20,-10 L16,-4 L18,2 L24,4 L24,8 L18,10 L16,16 L20,20 L16,24 L11,20 L5,22 L3,28 L-3,28 L-5,22 L-11,20 L-16,24 L-20,20 L-16,16 L-18,10 L-24,8 L-24,4 L-18,2 L-16,-4 L-20,-10 L-16,-14 L-11,-10 L-5,-12 Z", pathLen: 300, color1: "#A78BFA", color2: "#C4B5FD" },
  { path: "M-10,-16 L-22,0 L-10,16 M10,-16 L22,0 L10,16 M4,-20 L-4,20", pathLen: 150, color1: "#F59E0B", color2: "#FBBF24" },
  { path: "M2,-20 L-14,2 L-2,2 L-6,20 L14,-4 L2,-4 Z", pathLen: 140, color1: "#34D399", color2: "#6EE7B7" },
  { path: "M-6,-18 C-14,-18 -20,-12 -20,-4 C-20,2 -16,6 -10,8 L8,24 L16,16 L0,-2 C4,-6 4,-12 0,-16 C-2,-17 -4,-18 -6,-18 Z M-12,-10 A6,6 0 1,0 -6,-4", pathLen: 200, color1: "#FB7185", color2: "#FDA4AF" },
];

const hexPath = (cx: number, cy: number, r: number): string => {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 30) * Math.PI) / 180;
    return `${i === 0 ? "M" : "L"}${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ") + " Z";
};

const brainPath =
  "M0,-26 C10,-26 20,-20 22,-10 C24,-2 20,6 16,12 C14,18 10,24 0,26 " +
  "C-10,24 -14,18 -16,12 C-20,6 -24,-2 -22,-10 C-20,-20 -10,-26 0,-26 Z " +
  "M0,-26 L0,26 " +
  "M-20,-4 C-12,-8 12,-8 20,-4 " +
  "M-18,10 C-10,6 10,6 18,10";
const brainPathLen = 380;

export const Experiment1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const EX = { extrapolateRight: "clamp" as const, extrapolateLeft: "clamp" as const };

  const fadeIn = interpolate(frame, [0, 15], [0, 1], EX);
  const fadeOut = interpolate(frame, [EXPERIMENT1-DURATION-FRAMES - 20, EXPERIMENT1-DURATION-FRAMES], [1, 0], EX);

  const outerHexPerim = 6 * 70;
  const innerHexPerim = 6 * 45;
  const outerHexDraw = interpolate(frame, [5, 50], [0, 1], EX);
  const innerHexDraw = interpolate(frame, [15, 55], [0, 1], EX);
  const brainStroke = interpolate(frame, [25, 65], [brainPathLen, 0], EX);
  const brainFill = interpolate(frame, [60, 80], [0, 0.25], EX);

  const baseGlow = interpolate(frame, [30, 70], [0, 0.12], EX);
  const connGlow = interpolate(frame, [140, 210], [0, 0.45], EX);
  const centerGlow = baseGlow + connGlow;
  const glowPulse = frame > 210 ? interpolate(Math.sin((frame - 210) * 0.07), [-1, 1], [0.9, 1.12]) : 1;

  const MODULE-DELAYS = [50, 66, 82, 98, 114];
  const CONN-BASE = 132;
  const CONN-STAGGER = 10;

  const actLocal = Math.max(0, frame - 200);
  const pulse1R = interpolate(actLocal, [0, 35], [60, 480], { extrapolateRight: "clamp" });
  const pulse1O = interpolate(actLocal, [0, 8, 35], [0, 0.35, 0], { extrapolateRight: "clamp" });
  const pulse2R = interpolate(Math.max(0, actLocal - 8), [0, 35], [60, 420], { extrapolateRight: "clamp" });
  const pulse2O = interpolate(Math.max(0, actLocal - 8), [0, 8, 35], [0, 0.25, 0], { extrapolateRight: "clamp" });

  const particles = Array.from({ length: 18 }, (_, i) => {
    const bx = (i * 113 + 40) % 1920;
    const by = (i * 181 + 30) % 1080;
    const spd = 0.2 + (i % 4) * 0.1;
    const y = by + Math.sin((frame + i * 25) * spd * 0.03) * 25;
    const x = bx + Math.cos((frame + i * 40) * spd * 0.02) * 18;
    const r = 1.5 + (i % 3);
    const o = interpolate(Math.sin((frame + i * 35) * 0.04), [-1, 1], [0.02, 0.1]);
    return { x, y, r, o, color: i % 3 === 0 ? "#A78BFA" : "#4DA3FF" };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, opacity: fadeIn * fadeOut }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4DA3FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
          {modules.map((m, i) => (
            <linearGradient key={i} id={`mg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={m.color1} />
              <stop offset="100%" stopColor={m.color2} />
            </linearGradient>
          ))}
        </defs>
        {particles.map((p, i) => <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.o} />)}
        <circle cx={CX} cy={CY} r={200} fill="url(#cg)" opacity={centerGlow} transform={`translate(${CX},${CY}) scale(${glowPulse}) translate(${-CX},${-CY})`} />
        {frame > 205 && modules.map((mod, i) => {
          const pos = modulePositions[i];
          const steadyO = interpolate(frame, [205, 225], [0, 1], EX);
          const breathe = interpolate(Math.sin((frame + i * 20) * 0.06), [-1, 1], [0.12, 0.28]);
          return <line key={`sl${i}`} x1={pos.x} y1={pos.y} x2={CX} y2={CY} stroke={mod.color1} strokeWidth={2} opacity={steadyO * breathe} strokeLinecap="round" />;
        })}
        {modules.map((mod, i) => {
          const pos = modulePositions[i];
          const cl = Math.max(0, frame - (CONN-BASE + i * CONN-STAGGER));
          const lp = interpolate(cl, [0, 30], [0, 1], EX);
          const lo = interpolate(cl, [0, 10], [0, 0.35], EX);
          const fadeLineO = frame > 205 ? lo * interpolate(frame, [205, 225], [1, 0], EX) : lo;
          const ex = pos.x + (CX - pos.x) * lp;
          const ey = pos.y + (CY - pos.y) * lp;
          const d1p = interpolate(cl, [12, 42], [0, 1], EX);
          const d1o = interpolate(cl, [12, 17, 37, 45], [0, 0.9, 0.9, 0], EX);
          const d1x = pos.x + (CX - pos.x) * d1p;
          const d1y = pos.y + (CY - pos.y) * d1p;
          const d2l = Math.max(0, cl - 28);
          const d2p = interpolate(d2l, [0, 30], [0, 1], EX);
          const d2o = cl > 28 ? interpolate(d2l, [0, 5, 25, 33], [0, 0.7, 0.7, 0], EX) : 0;
          const d2x = pos.x + (CX - pos.x) * d2p;
          const d2y = pos.y + (CY - pos.y) * d2p;
          return (
            <g key={`c${i}`}>
              <line x1={pos.x} y1={pos.y} x2={ex} y2={ey} stroke={mod.color1} strokeWidth={1.5} strokeDasharray="8 6" opacity={fadeLineO} strokeLinecap="round" />
              <circle cx={d1x} cy={d1y} r={5} fill={mod.color1} opacity={d1o} />
              <circle cx={d1x} cy={d1y} r={12} fill={mod.color1} opacity={d1o * 0.25} />
              <circle cx={d2x} cy={d2y} r={4} fill={mod.color2} opacity={d2o} />
            </g>
          );
        })}
        <path d={hexPath(CX, CY, 70)} fill="none" stroke="url(#mg)" strokeWidth={2.5} strokeDasharray={outerHexPerim} strokeDashoffset={outerHexPerim * (1 - outerHexDraw)} strokeLinecap="round" strokeLinejoin="round" />
        <path d={hexPath(CX, CY, 45)} fill="none" stroke="url(#mg)" strokeWidth={1.5} strokeDasharray={innerHexPerim} strokeDashoffset={innerHexPerim * (1 - innerHexDraw)} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        <g transform={`translate(${CX},${CY})`}>
          <path d={brainPath} fill="none" stroke="url(#mg)" strokeWidth={1.8} strokeDasharray={brainPathLen} strokeDashoffset={brainStroke} strokeLinecap="round" strokeLinejoin="round" />
          <path d={brainPath} fill="url(#mg)" opacity={brainFill} />
        </g>
        {modules.map((mod, i) => {
          const pos = modulePositions[i];
          const ml = Math.max(0, frame - MODULE-DELAYS[i]);
          const angleRad = (MODULE-ANGLES-DEG[i] * Math.PI) / 180;
          const flyP = interpolate(ml, [0, 28], [0, 1], EX);
          const startD = ORBIT-R + 280;
          const curD = startD + (ORBIT-R - startD) * flyP;
          const cx = CX + curD * Math.cos(angleRad);
          const cy = CY + curD * Math.sin(angleRad);
          const sc = spring({ frame: ml, fps, config: { damping: 12, stiffness: 80 } });
          const nO = interpolate(ml, [0, 15], [0, 1], EX);
          const hPerim = 6 * 62;
          const hDraw = interpolate(ml, [3, 35], [0, 1], EX);
          const iStroke = interpolate(ml, [8, 45], [mod.pathLen, 0], EX);
          const iFill = interpolate(ml, [40, 55], [0, 0.8], EX);
          const floatY = ml > 30 ? Math.sin((frame + i * 50) * 0.04) * 4 : 0;
          return (
            <g key={`m${i}`} transform={`translate(${cx},${cy + floatY}) scale(${sc})`} opacity={nO}>
              <path d={hexPath(0, 0, 62)} fill={`${mod.color1}10`} stroke={`url(#mg${i})`} strokeWidth={2} strokeDasharray={hPerim} strokeDashoffset={hPerim * (1 - hDraw)} strokeLinecap="round" strokeLinejoin="round" />
              <g transform="scale(1.5)">
                <path d={mod.path} fill="none" stroke={`url(#mg${i})`} strokeWidth={1.8} strokeDasharray={mod.pathLen} strokeDashoffset={iStroke} strokeLinecap="round" strokeLinejoin="round" />
                <path d={mod.path} fill={`url(#mg${i})`} opacity={iFill} />
              </g>
              <circle r={74} fill="none" stroke={mod.color1} strokeWidth={1} opacity={iFill * 0.2} />
            </g>
          );
        })}
        {(() => {
          const labelLocal = Math.max(0, frame - 80);
          const labelO = interpolate(labelLocal, [0, 25], [0, 1], EX);
          const labelY = interpolate(labelLocal, [0, 25], [18, 0], EX);
          const labelFadeOut = interpolate(frame, [EXPERIMENT1-DURATION-FRAMES - 25, EXPERIMENT1-DURATION-FRAMES - 8], [1, 0], EX);
          return <text x={CX} y={920 + labelY} textAnchor="middle" fontSize="52" fontWeight="600" fontFamily="'Noto Sans TC', 'Inter', sans-serif" fill="url(#mg)" opacity={labelO * labelFadeOut} letterSpacing="6">新增 Skill</text>;
        })()}
        <circle cx={CX} cy={CY} r={pulse1R} fill="none" stroke="url(#mg)" strokeWidth={2} opacity={pulse1O} />
        <circle cx={CX} cy={CY} r={pulse2R} fill="none" stroke="#A78BFA" strokeWidth={1.5} opacity={pulse2O} />
      </svg>
      <Sequence from={5}><Audio src={SFX.softClick} volume={0.2} /></Sequence>
      {MODULE-DELAYS.map((d, i) => <Sequence key={`sfx-m${i}`} from={d}><Audio src={SFX.woosh} volume={0.18} /></Sequence>)}
      <Sequence from={CONN-BASE}><Audio src={SFX.softClick} volume={0.15} /></Sequence>
      <Sequence from={200}><Audio src={SFX.softImpact} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};