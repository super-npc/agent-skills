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

const SFX = {
  woosh: staticFile("audio/connection/woosh.wav"),
  softImpact: staticFile("audio/connection/soft-impact.wav"),
  softClick: staticFile("audio/connection/soft-click.wav"),
  tinyPop: staticFile("audio/connection/tiny-pop.mp3"),
  microRiser: staticFile("audio/connection/micro-riser.mp3"),
  ding: staticFile("audio/connection/ding.mp3"),
};

export const NOT-UNDERSTAND-DURATION-FRAMES = 240;

const EX = {
  extrapolateRight: "clamp" as const,
  extrapolateLeft: "clamp" as const,
};

const RobotIcon: React.FC<{ size: number; glitch: number }> = ({ size, glitch }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <line x1="60" y1="8" x2="60" y2="28" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="6" r="4" fill={colors.accent} />
    <rect x="28" y="28" width="64" height="48" rx="12" stroke={colors.accent} strokeWidth="3" transform={`translate(${glitch}, 0)`} />
    <circle cx="44" cy="52" r="7" fill={colors.accent} opacity="0.8" transform={`translate(${glitch * 1.5}, 0)`} />
    <circle cx="76" cy="52" r="7" fill={colors.accent} opacity="0.8" transform={`translate(${glitch * 1.5}, 0)`} />
    <path d="M44 66 Q52 72 60 66 Q68 60 76 66" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
    <rect x="34" y="80" width="52" height="30" rx="8" stroke={colors.accent} strokeWidth="3" />
    <line x1="48" y1="88" x2="72" y2="88" stroke={colors.accent} strokeWidth="2" opacity="0.4" />
    <line x1="48" y1="96" x2="66" y2="96" stroke={colors.accent} strokeWidth="2" opacity="0.3" />
  </svg>
);

const ImageIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="12" y="20" width="96" height="80" rx="10" stroke="#A78BFA" strokeWidth="3" />
    <path d="M22 84 L42 52 L56 68 L68 54 L98 84 Z" fill="#A78BFA" opacity="0.2" />
    <path d="M22 84 L42 52 L56 68 L68 54 L98 84" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.5" />
    <circle cx="82" cy="40" r="10" stroke="#A78BFA" strokeWidth="2.5" />
    <circle cx="82" cy="40" r="4" fill="#A78BFA" opacity="0.4" />
    <line x1="32" y1="84" x2="32" y2="74" stroke="#A78BFA" strokeWidth="2" opacity="0.4" />
    <circle cx="32" cy="72" r="5" fill="#A78BFA" opacity="0.2" />
  </svg>
);

const QuestionIcon: React.FC<{ size: number; pulse: number }> = ({ size, pulse }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="48" stroke="#F59E0B" strokeWidth="3" opacity={0.3 + pulse * 0.2} />
    <text x="60" y="78" textAnchor="middle" fontSize="72" fontWeight="800" fontFamily="'Inter', sans-serif" fill="#F59E0B" opacity={0.9}>?</text>
  </svg>
);

const FloatingQ: React.FC<{ x: number; y: number; size: number; opacity: number; rotation: number }> = ({ x, y, size, opacity, rotation }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="700" fontFamily="'Inter', sans-serif" fill="#F59E0B" opacity={opacity} transform={`rotate(${rotation}, ${x}, ${y})`}>?</text>
);

const AnimatedTitle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const text = "因為 Claude Code 並沒有真的理解這張圖上面的所有元素";
  const prefix = "因為 ";
  const claudeCode = "Claude Code";
  const containerOp = interpolate(frame, [0, 15], [0, 1], EX);
  const containerY = interpolate(frame, [0, 20], [20, 0], EX);
  const revealCount = interpolate(frame, [5, 50], [0, text.length], EX);
  const highlightOp = interpolate(frame, [55, 70], [0, 1], EX);
  const underlineProgress = interpolate(frame, [60, 90], [0, 1], EX);
  const chars = text.split("");

  return (
    <div style={{ position: "absolute", top: 160, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: containerOp, transform: `translateY(${containerY}px)` }}>
      <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.6, textAlign: "center", maxWidth: 1400 }}>
        {chars.map((char, i) => {
          const isClaudeCode = i >= prefix.length && i < prefix.length + claudeCode.length;
          const visible = i < revealCount;
          return (
            <span key={i} style={{ opacity: visible ? 1 : 0, color: isClaudeCode ? colors.accent : colors.text, textShadow: isClaudeCode && highlightOp > 0 ? `0 0 ${20 * highlightOp}px ${colors.accent}60` : "none", fontWeight: isClaudeCode ? 800 : 700, transition: "none" }}>
              {char}
            </span>
          );
        })}
      </div>
      <svg width={800} height={6} viewBox="0 0 800 6" style={{ marginTop: 16 }}>
        <defs>
          <linearGradient id="titleUnderline" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0" />
            <stop offset="30%" stopColor={colors.accent} />
            <stop offset="70%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={400 - 400 * underlineProgress} y1={3} x2={400 + 400 * underlineProgress} y2={3} stroke="url(#titleUnderline)" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const NotUnderstandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ROBOT-DELAY = 60;
  const IMAGE-DELAY = 90;
  const LINE-DELAY = 110;
  const QUESTION-DELAY = 145;
  const SCATTER-Q_DELAY = 170;

  const robotLocal = frame - ROBOT-DELAY;
  const robotOp = interpolate(robotLocal, [0, 20], [0, 1], EX);
  const robotScale = spring({ frame: Math.max(0, robotLocal), fps, config: { damping: 12, stiffness: 80 } });
  const robotY = interpolate(robotLocal, [0, 25], [40, 0], EX);
  const glitchPhase = robotLocal - 40;
  const glitch = glitchPhase > 0 && glitchPhase < 15 ? Math.sin(glitchPhase * 4) * interpolate(glitchPhase, [0, 15], [4, 0], EX) : 0;
  const robotFloat = robotLocal > 30 ? Math.sin(robotLocal * 0.06) * 4 : 0;

  const imageLocal = frame - IMAGE-DELAY;
  const imageOp = interpolate(imageLocal, [0, 20], [0, 1], EX);
  const imageScale = spring({ frame: Math.max(0, imageLocal), fps, config: { damping: 10, stiffness: 70 } });
  const imageY = interpolate(imageLocal, [0, 25], [40, 0], EX);
  const imageFloat = imageLocal > 30 ? Math.sin((imageLocal + 20) * 0.055) * 5 : 0;

  const lineLocal = frame - LINE-DELAY;
  const lineProgress = interpolate(lineLocal, [0, 25], [0, 1], EX);

  const qLocal = frame - QUESTION-DELAY;
  const qOp = interpolate(qLocal, [0, 15], [0, 1], EX);
  const qScale = spring({ frame: Math.max(0, qLocal), fps, config: { damping: 8, stiffness: 60 } });
  const qPulse = qLocal > 25 ? Math.sin(qLocal * 0.1) : 0;

  const scatterLocal = frame - SCATTER-Q_DELAY;
  const scatterPositions = [
    { x: 320, y: 480, size: 28, delay: 0, speed: 0.07, amp: 15, rot: -15 },
    { x: 1600, y: 520, size: 32, delay: 8, speed: 0.06, amp: 18, rot: 12 },
    { x: 480, y: 750, size: 22, delay: 15, speed: 0.08, amp: 12, rot: -8 },
    { x: 1440, y: 380, size: 26, delay: 5, speed: 0.065, amp: 16, rot: 20 },
    { x: 260, y: 350, size: 20, delay: 12, speed: 0.075, amp: 10, rot: -22 },
    { x: 1660, y: 720, size: 24, delay: 18, speed: 0.055, amp: 14, rot: 8 },
  ];

  const particles = Array.from({ length: 10 }, (_, i) => {
    const baseX = (i * 197) % 1920;
    const baseY = (i * 263) % 1080;
    const speed = 0.25 + (i % 3) * 0.12;
    const y = baseY + Math.sin((frame + i * 35) * speed * 0.03) * 25;
    const x = baseX + Math.cos((frame + i * 45) * speed * 0.02) * 18;
    const size = 1.5 + (i % 3);
    const opacity = interpolate(Math.sin((frame + i * 40) * 0.035), [-1, 1], [0.03, 0.12]);
    return { x, y, size, opacity };
  });

  const robotGlow = robotLocal > 30 ? 0.12 + Math.sin(robotLocal * 0.08) * 0.06 : 0;
  const imageGlow = imageLocal > 30 ? 0.12 + Math.sin((imageLocal + 15) * 0.08) * 0.06 : 0;
  const qGlow = qLocal > 30 ? 0.15 + Math.sin((qLocal + 30) * 0.08) * 0.08 : 0;

  const CENTER-Y = 480;
  const ICON-GAP = 500;
  const LEFT-X = 960 - ICON-GAP / 2;
  const RIGHT-X = 960 + ICON-GAP / 2;
  const MID-X = 960;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={colors.accent} opacity={p.opacity} />)}
      </svg>
      <AnimatedTitle frame={frame} fps={fps} />
      <div style={{ position: "absolute", left: LEFT-X - 96, top: CENTER-Y - 96, opacity: robotOp, transform: `scale(${robotScale}) translateY(${robotY + robotFloat}px)` }}>
        <div style={{ position: "absolute", inset: -50, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`, opacity: robotGlow }} />
        <RobotIcon size={192} glitch={glitch} />
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 24, fontWeight: 600, color: colors.accent, opacity: interpolate(robotLocal, [20, 35], [0, 0.8], EX) }}>AI</div>
      </div>
      <div style={{ position: "absolute", left: RIGHT-X - 96, top: CENTER-Y - 96, opacity: imageOp, transform: `scale(${imageScale}) translateY(${imageY + imageFloat}px)` }}>
        <div style={{ position: "absolute", inset: -50, borderRadius: "50%", background: `radial-gradient(circle, #A78BFA 0%, transparent 70%)`, opacity: imageGlow }} />
        <ImageIcon size={192} />
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 24, fontWeight: 600, color: "#A78BFA", opacity: interpolate(imageLocal, [20, 35], [0, 0.8], EX) }}>圖像</div>
      </div>
      {lineProgress > 0 && (() => {
        const lineX1 = LEFT-X + 110;
        const lineX2End = RIGHT-X - 110;
        const lineX2 = lineX1 + (lineX2End - lineX1) * lineProgress;
        const lineLen = lineX2 - lineX1;
        const dots = [0, 0.33, 0.66].map((offset) => {
          const t = ((lineLocal * 0.025 + offset) % 1);
          return { x: lineX1 + t * lineLen, opacity: lineProgress > 0.3 ? 0.9 * Math.sin(t * Math.PI) : 0 };
        });
        return (
          <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <defs>
              <linearGradient id="arrowGrad" x1={lineX1} y1="0" x2={lineX2End} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={colors.accent} />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
              <radialGradient id="dotGlow">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor={colors.accent} />
                <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
              </radialGradient>
            </defs>
            <line x1={lineX1} y1={CENTER-Y} x2={lineX2} y2={CENTER-Y} stroke="url(#arrowGrad)" strokeWidth={2.5} opacity={0.8} />
            {lineProgress > 0.9 && <path d={`M${lineX2 - 2},${CENTER-Y} L${lineX2 + 14},${CENTER-Y} M${lineX2 + 8},${CENTER-Y - 7} L${lineX2 + 14},${CENTER-Y} L${lineX2 + 8},${CENTER-Y + 7}`} stroke="#A78BFA" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
            {dots.map((dot, i) => (
              <g key={i}>
                <circle cx={dot.x} cy={CENTER-Y} r={12} fill="url(#dotGlow)" opacity={dot.opacity * 0.5} />
                <circle cx={dot.x} cy={CENTER-Y} r={3.5} fill="#FFFFFF" opacity={dot.opacity} />
              </g>
            ))}
          </svg>
        );
      })()}
      {qOp > 0 && (
        <div style={{ position: "absolute", left: MID-X - 60, top: CENTER-Y - 120, width: 120, display: "flex", flexDirection: "column", alignItems: "center", opacity: qOp, transform: `scale(${qScale})` }}>
          <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: `radial-gradient(circle, #F59E0B 0%, transparent 70%)`, opacity: qGlow }} />
          <QuestionIcon size={120} pulse={qPulse} />
        </div>
      )}
      {scatterLocal > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          {scatterPositions.map((q, i) => {
            const local = scatterLocal - q.delay;
            if (local < 0) return null;
            const op = interpolate(local, [0, 15], [0, 0.25], EX);
            const floatY = local > 15 ? Math.sin(local * q.speed) * q.amp : 0;
            return <FloatingQ key={i} x={q.x} y={q.y + floatY} size={q.size} opacity={op} rotation={q.rot + Math.sin(local * 0.04) * 5} />;
          })}
        </svg>
      )}
      <div style={{ position: "absolute", bottom: 80, width: "100%", textAlign: "center", fontSize: 28, fontWeight: 400, color: colors.dimmed, opacity: interpolate(frame, [180, 200], [0, 0.6], EX) }}>
        它看到的是像素，不是語意
      </div>
      <Sequence from={5}><Audio src={SFX.softClick} volume={0.2} /></Sequence>
      <Sequence from={ROBOT-DELAY}><Audio src={SFX.woosh} volume={0.25} /></Sequence>
      <Sequence from={ROBOT-DELAY + 12}><Audio src={SFX.softImpact} volume={0.18} /></Sequence>
      <Sequence from={IMAGE-DELAY}><Audio src={SFX.woosh} volume={0.2} /></Sequence>
      <Sequence from={IMAGE-DELAY + 12}><Audio src={SFX.softImpact} volume={0.15} /></Sequence>
      <Sequence from={LINE-DELAY}><Audio src={SFX.microRiser} volume={0.2} /></Sequence>
      <Sequence from={QUESTION-DELAY}><Audio src={SFX.ding} volume={0.3} /></Sequence>
      <Sequence from={SCATTER-Q_DELAY}><Audio src={SFX.tinyPop} volume={0.15} /></Sequence>
      <Sequence from={SCATTER-Q_DELAY + 15}><Audio src={SFX.tinyPop} volume={0.12} /></Sequence>
    </AbsoluteFill>
  );
};