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

export const FROM-SCRATCH-DURATION-FRAMES = 270;

const SFX = {
  woosh: staticFile("audio/connection/woosh.wav"),
  softImpact: staticFile("audio/connection/soft-impact.wav"),
  softClick: staticFile("audio/connection/soft-click.wav"),
  tinyPop: staticFile("audio/connection/tiny-pop.mp3"),
};

const EX = {
  extrapolateRight: "clamp" as const,
  extrapolateLeft: "clamp" as const,
};

const EmptyFileIcon: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pagePathLen = 1000;
  const pageDraw = interpolate(frame, [0, 50], [pagePathLen, 0], EX);
  const foldLen = 120;
  const foldDraw = interpolate(frame, [30, 50], [foldLen, 0], EX);
  const circlePerimeter = Math.PI * 2 * 50;
  const circleDraw = interpolate(frame, [40, 75], [circlePerimeter, 0], EX);
  const crossLen = 55;
  const cross1Draw = interpolate(frame, [65, 80], [crossLen, 0], EX);
  const cross2Draw = interpolate(frame, [70, 85], [crossLen, 0], EX);
  const cursorOpacity = frame > 25 ? (Math.floor(frame / 14) % 2 === 0 ? 0.7 : 0) : 0;
  const labelOpacity = interpolate(frame, [75, 90], [0, 1], EX);

  return (
    <svg width={260} height={360} viewBox="0 0 260 360">
      <defs>
        <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DA3FF" />
          <stop offset="100%" stopColor="#6BB8FF" />
        </linearGradient>
      </defs>
      <path d="M30 15 L180 15 L230 65 L230 295 Q230 310 215 310 L45 310 Q30 310 30 295 Z" fill="rgba(77,163,255,0.04)" stroke="url(#emptyGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pagePathLen} strokeDashoffset={pageDraw} />
      <path d="M180 15 L180 65 L230 65" fill="rgba(77,163,255,0.06)" stroke="url(#emptyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={foldLen} strokeDashoffset={foldDraw} />
      <rect x="55" y="90" width="3" height="24" rx="1.5" fill="#4DA3FF" opacity={cursorOpacity} />
      <circle cx="130" cy="185" r="50" fill="none" stroke="rgba(77,163,255,0.25)" strokeWidth="2" strokeDasharray="8 6" opacity={interpolate(frame, [40, 60], [0, 1], EX)} />
      <circle cx="130" cy="185" r="50" fill="none" stroke="url(#emptyGrad)" strokeWidth="1.5" strokeDasharray={circlePerimeter} strokeDashoffset={circleDraw} strokeLinecap="round" opacity="0.4" />
      <line x1="112" y1="167" x2="148" y2="203" stroke="rgba(77,163,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={crossLen} strokeDashoffset={cross1Draw} />
      <line x1="148" y1="167" x2="112" y2="203" stroke="rgba(77,163,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={crossLen} strokeDashoffset={cross2Draw} />
      <text x="130" y="345" textAnchor="middle" fontSize="22" fontWeight="600" fontFamily="'Noto Sans TC', 'Inter', sans-serif" fill="rgba(77,163,255,0.7)" opacity={labelOpacity}>空白檔案</text>
    </svg>
  );
};

const BigArrow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const shaftLen = 260;
  const shaftDraw = interpolate(frame, [0, 25], [shaftLen, 0], EX);
  const headLen = 90;
  const headDraw = interpolate(frame, [18, 35], [headLen, 0], EX);
  const glowOpacity = frame > 30 ? interpolate(Math.sin(frame * 0.07), [-1, 1], [0.25, 0.55]) : 0;
  const entranceScale = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const FLOW-COUNT = 8;
  const CYCLE = 40;
  const flowParticles = Array.from({ length: FLOW-COUNT }, (_, i) => {
    const offset = i * (CYCLE / FLOW-COUNT);
    const t = Math.max(0, frame - 10);
    const progress = ((t + offset) % CYCLE) / CYCLE;
    const px = progress * 280;
    const opacity = frame < 10 ? 0 : interpolate(progress, [0, 0.08, 0.85, 1], [0, 0.8, 0.8, 0]);
    const yOff = Math.sin(progress * Math.PI * 2 + i) * 6;
    const size = 3 + (i % 3);
    const color = i % 3 === 0 ? "#34D399" : i % 3 === 1 ? "#A78BFA" : "#4DA3FF";
    return { px, opacity, yOff, size, color };
  });
  const dashOffset = frame > 28 ? (frame - 28) * 4 : 0;
  const dashOpacity = frame > 28 ? 0.3 : 0;

  return (
    <div style={{ transform: `scale(${entranceScale})` }}>
      <svg width={320} height={120} viewBox="0 0 320 120">
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4DA3FF" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <filter id="arrowGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <line x1="30" y1="60" x2="270" y2="60" stroke="url(#arrowGrad)" strokeWidth="14" strokeLinecap="round" opacity={glowOpacity} filter="url(#arrowGlow)" />
        <line x1="30" y1="60" x2="270" y2="60" stroke="url(#arrowGrad)" strokeWidth="4.5" strokeLinecap="round" strokeDasharray={shaftLen} strokeDashoffset={shaftDraw} />
        <line x1="30" y1="60" x2="270" y2="60" stroke="url(#arrowGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 20" strokeDashoffset={-dashOffset} opacity={dashOpacity} />
        <path d="M255 35 L290 60 L255 85" fill="none" stroke="url(#arrowGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={headLen} strokeDashoffset={headDraw} />
        {flowParticles.map((p, i) => <circle key={i} cx={20 + p.px} cy={60 + p.yOff} r={p.size} fill={p.color} opacity={p.opacity} />)}
      </svg>
    </div>
  );
};

const MONO = "'JetBrains Mono', 'Courier New', monospace";

const codeTextLines: { text: string; x: number; color: string; delay: number }[] = [
  { text: "import React from",   x: 50,  color: "#C792EA", delay: 18 },
  { text: '  "react";',          x: 50,  color: "#C3E88D", delay: 22 },
  { text: "",                    x: 0,   color: "",        delay: 0 },
  { text: "const App = () => {", x: 50,  color: "#89DDFF", delay: 28 },
  { text: "  const [s, set]",    x: 50,  color: "#82AAFF", delay: 33 },
  { text: "    = useState(0);",  x: 50,  color: "#F78C6C", delay: 37 },
  { text: "",                    x: 0,   color: "",        delay: 0 },
  { text: "  return (",          x: 50,  color: "#89DDFF", delay: 43 },
  { text: '    <div className',  x: 50,  color: "#FFCB6B", delay: 48 },
  { text: '      ="main">',     x: 50,  color: "#C3E88D", delay: 52 },
  { text: "      {s}",           x: 50,  color: "#F07178", delay: 56 },
  { text: "    </div>",          x: 50,  color: "#89DDFF", delay: 60 },
  { text: "  );",                x: 50,  color: "#89DDFF", delay: 64 },
  { text: "};",                  x: 50,  color: "#89DDFF", delay: 68 },
];

const FullFileIcon: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pagePathLen = 1000;
  const pageDraw = interpolate(frame, [0, 45], [pagePathLen, 0], EX);
  const foldLen = 120;
  const foldDraw = interpolate(frame, [25, 45], [foldLen, 0], EX);
  const gutterOpacity = interpolate(frame, [15, 35], [0, 0.25], EX);
  const badgeCircleLen = Math.PI * 2 * 18;
  const badgeCircleDraw = interpolate(frame, [78, 92], [badgeCircleLen, 0], EX);
  const checkPathLen = 35;
  const checkDraw = interpolate(frame, [88, 100], [checkPathLen, 0], EX);
  const badgeScale = spring({ frame: Math.max(0, frame - 76), fps, config: { damping: 10, stiffness: 120 } });
  const glowOpacity = frame > 95 ? interpolate(Math.sin((frame - 95) * 0.06), [-1, 1], [0.12, 0.35]) : 0;
  const labelOpacity = interpolate(frame, [95, 110], [0, 1], EX);
  let lineNum = 0;

  return (
    <svg width={260} height={360} viewBox="0 0 260 360">
      <defs>
        <linearGradient id="fullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#4DA3FF" />
        </linearGradient>
        <linearGradient id="checkGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="170" rx="120" ry="140" fill="rgba(52,211,153,0.06)" opacity={glowOpacity} />
      <path d="M30 15 L180 15 L230 65 L230 295 Q230 310 215 310 L45 310 Q30 310 30 295 Z" fill="rgba(52,211,153,0.05)" stroke="url(#fullGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pagePathLen} strokeDashoffset={pageDraw} />
      <path d="M180 15 L180 65 L230 65" fill="rgba(52,211,153,0.08)" stroke="url(#fullGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={foldLen} strokeDashoffset={foldDraw} />
      <line x1="44" y1="72" x2="44" y2="290" stroke="rgba(255,255,255,0.1)" strokeWidth="1" opacity={gutterOpacity} />
      {codeTextLines.map((line, i) => {
        if (line.text === "") return null;
        lineNum++;
        const y = 84 + i * 16;
        const opacity = interpolate(frame, [line.delay, line.delay + 10], [0, 1], EX);
        return (
          <g key={i} opacity={opacity}>
            <text x="40" y={y} textAnchor="end" fontSize="9" fontFamily={MONO} fill="rgba(255,255,255,0.2)">{lineNum}</text>
            <text x={line.x} y={y} fontSize="11" fontFamily={MONO} fontWeight="500" fill={line.color} opacity="0.85">{line.text}</text>
          </g>
        );
      })}
      <g transform={`translate(205, 280) scale(${badgeScale})`} style={{ transformOrigin: "0 0" }}>
        <circle cx="0" cy="0" r="18" fill="rgba(52,211,153,0.2)" stroke="url(#checkGrad2)" strokeWidth="2.5" strokeDasharray={badgeCircleLen} strokeDashoffset={badgeCircleDraw} strokeLinecap="round" />
        <path d="M-8 0 L-2 7 L10 -6" fill="none" stroke="url(#checkGrad2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={checkPathLen} strokeDashoffset={checkDraw} />
      </g>
      <text x="130" y="345" textAnchor="middle" fontSize="22" fontWeight="600" fontFamily="'Noto Sans TC', 'Inter', sans-serif" fill="rgba(52,211,153,0.8)" opacity={labelOpacity}>完整程式碼</text>
    </svg>
  );
};

const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const baseX = (i * 157) % 1920;
    const baseY = (i * 193) % 1080;
    const x = baseX + Math.cos((frame + i * 50) * 0.02) * 20;
    const y = baseY + Math.sin((frame + i * 35) * 0.025) * 25;
    const size = 2 + (i % 3);
    const opacity = interpolate(Math.sin((frame + i * 40) * 0.035), [-1, 1], [0.03, 0.12]);
    return { x, y, size, opacity };
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.size} fill={i % 3 === 0 ? "#34D399" : "#4DA3FF"} opacity={d.opacity} />)}
    </svg>
  );
};

export const FromScratchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vignetteOpacity = interpolate(frame, [0, 30], [0, 1], EX);
  const EMPTY-START = 10;
  const ARROW-START = 75;
  const COMPLETE-START = 120;

  const emptyScale = spring({ frame: Math.max(0, frame - EMPTY-START), fps, config: { damping: 14, stiffness: 80 } });
  const completeScale = spring({ frame: Math.max(0, frame - COMPLETE-START), fps, config: { damping: 12, stiffness: 70 } });
  const emptyOpacity = interpolate(frame, [EMPTY-START, EMPTY-START + 15], [0, 1], EX);
  const arrowOpacity = interpolate(frame, [ARROW-START, ARROW-START + 10], [0, 1], EX);
  const completeOpacity = interpolate(frame, [COMPLETE-START, COMPLETE-START + 15], [0, 1], EX);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", overflow: "hidden" }}>
      <Particles frame={frame} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)", opacity: vignetteOpacity, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 50, paddingBottom: 80 }}>
        <div style={{ opacity: emptyOpacity, transform: `scale(${emptyScale})` }}>
          <EmptyFileIcon frame={Math.max(0, frame - EMPTY-START)} fps={fps} />
        </div>
        <div style={{ opacity: arrowOpacity }}>
          <BigArrow frame={Math.max(0, frame - ARROW-START)} fps={fps} />
        </div>
        <div style={{ opacity: completeOpacity, transform: `scale(${completeScale})` }}>
          <FullFileIcon frame={Math.max(0, frame - COMPLETE-START)} fps={fps} />
        </div>
      </div>
      <Sequence from={EMPTY-START}><Audio src={SFX.softClick} volume={0.2} /></Sequence>
      {[35, 42, 49].map((f) => <Sequence from={f} key={`pop-${f}`}><Audio src={SFX.tinyPop} volume={0.12} /></Sequence>)}
      <Sequence from={ARROW-START}><Audio src={SFX.woosh} volume={0.35} /></Sequence>
      <Sequence from={COMPLETE-START}><Audio src={SFX.softImpact} volume={0.25} /></Sequence>
      <Sequence from={COMPLETE-START + 20}><Audio src={SFX.softClick} volume={0.15} /></Sequence>
    </AbsoluteFill>
  );
};