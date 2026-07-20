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

export const SVG-CARDS-DURATION-FRAMES = 270;

const SFX = {
  woosh: staticFile("audio/connection/woosh.wav"),
  softImpact: staticFile("audio/connection/soft-impact.wav"),
  softClick: staticFile("audio/connection/soft-click.wav"),
};

const SvgTitle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const y = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const numStrokeLen = 320;
  const numDraw = interpolate(frame, [5, 35], [numStrokeLen, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const numFill = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const labelOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const labelX = interpolate(frame, [25, 40], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOpacity = interpolate(frame, [0, 18], [0, 0.6], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const lineProgress = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ position: "absolute", top: 260, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontSize: 26, fontWeight: 400, color: colors.text, opacity: subOpacity, letterSpacing: 4, marginBottom: 12 }}>
        看完這支影片你會獲得
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <svg width={100} height={100} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="numGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4DA3FF" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          <text x="50" y="82" textAnchor="middle" fontSize="96" fontWeight="800" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fill="none" stroke="url(#numGrad)" strokeWidth={2.5} strokeDasharray={numStrokeLen} strokeDashoffset={numDraw} strokeLinecap="round">2</text>
          <text x="50" y="82" textAnchor="middle" fontSize="96" fontWeight="800" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fill="url(#numGrad)" opacity={numFill}>2</text>
        </svg>
        <span style={{ fontSize: 56, fontWeight: 700, color: colors.text, opacity: labelOpacity, transform: `translateX(${labelX}px)`, display: "inline-block" }}>個答案</span>
      </div>
      <svg width={360} height={8} viewBox="0 0 360 8" style={{ marginTop: 10 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#4DA3FF" />
            <stop offset="70%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={180 - 180 * lineProgress} y1={4} x2={180 + 180 * lineProgress} y2={4} stroke="url(#lineGrad)" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  );
};

const cardData = [
  { text: "怎麼用 Claude Code\n+ Remotion 來做動畫", colors: { c1: "#4DA3FF", c2: "#A78BFA" } },
  { text: "怎麼優化動畫的品質\n讓它更有質感", colors: { c1: "#F59E0B", c2: "#EF4444" } },
];

const AnimatedBorder: React.FC<{ width: number; height: number; progress: number; gradientId: string; color1: string; color2: string }> = ({ width, height, progress, gradientId, color1, color2 }) => {
  const rx = 28;
  const perimeter = 2 * (width + height - 4 * rx) + 2 * Math.PI * rx;
  const dashOffset = perimeter * (1 - progress);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <rect x={2} y={2} width={width - 4} height={height - 4} rx={rx} ry={rx} fill="none" stroke={`url(#${gradientId})`} strokeWidth={3} strokeDasharray={perimeter} strokeDashoffset={dashOffset} strokeLinecap="round" />
    </svg>
  );
};

const GlowRing: React.FC<{ size: number; color: string; opacity: number; scale: number }> = ({ size, color, opacity, scale }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`, opacity, transform: `scale(${scale})`, top: "50%", left: "50%", marginTop: -size / 2, marginLeft: -size / 2, pointerEvents: "none" }} />
);

export const SvgCardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles = Array.from({ length: 12 }, (_, i) => {
    const baseX = (i * 173) % 1920;
    const baseY = (i * 241) % 1080;
    const speed = 0.3 + (i % 4) * 0.15;
    const y = baseY + Math.sin((frame + i * 30) * speed * 0.03) * 30;
    const x = baseX + Math.cos((frame + i * 50) * speed * 0.02) * 20;
    const size = 2 + (i % 3);
    const opacity = interpolate(Math.sin((frame + i * 40) * 0.04), [-1, 1], [0.05, 0.2]);
    return { x, y, size, opacity };
  });

  const CARD-W = 640;
  const CARD-H = 280;
  const TITLE-DELAY = 5;
  const CARD1-DELAY = 50;
  const CARD2-DELAY = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: "'Noto Sans TC', 'Inter', sans-serif" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={colors.accent} opacity={p.opacity} />)}
      </svg>
      <Sequence from={TITLE-DELAY}>
        <SvgTitle frame={Math.max(0, frame - TITLE-DELAY)} fps={fps} />
      </Sequence>
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 80, paddingTop: 280 }}>
        {cardData.map((card, index) => {
          const cardDelay = index === 0 ? CARD1-DELAY : CARD2-DELAY;
          const enterScale = spring({ frame: Math.max(0, frame - cardDelay), fps, config: { damping: 14, stiffness: 80 } });
          const enterOpacity = interpolate(frame - cardDelay, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const enterY = interpolate(frame - cardDelay, [0, 30], [60, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const borderProgress = interpolate(frame - cardDelay, [5, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const glowPulse = interpolate(Math.sin((frame - cardDelay) * 0.06), [-1, 1], [0.6, 1]);
          const glowScale = interpolate(Math.sin((frame - cardDelay) * 0.04), [-1, 1], [0.95, 1.1]);
          const textOpacity = interpolate(frame - cardDelay, [15, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={index} style={{ position: "relative", width: CARD-W, height: CARD-H, opacity: enterOpacity, transform: `scale(${enterScale}) translateY(${enterY}px)` }}>
              <GlowRing size={CARD-W + 100} color={card.colors.c1} opacity={enterOpacity * glowPulse * 0.4} scale={glowScale} />
              <div style={{ position: "relative", width: CARD-W, height: CARD-H, borderRadius: 28, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", backdropFilter: "blur(8px)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <AnimatedBorder width={CARD-W} height={CARD-H} progress={borderProgress} gradientId={`border-grad-${index}`} color1={card.colors.c1} color2={card.colors.c2} />
                <div style={{ position: "relative", fontSize: 38, fontWeight: 600, color: colors.text, textAlign: "center", lineHeight: 1.6, whiteSpace: "pre-line", opacity: textOpacity }}>{card.text}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Sequence from={TITLE-DELAY + 5}><Audio src={SFX.softClick} volume={0.2} /></Sequence>
      <Sequence from={CARD1-DELAY}><Audio src={SFX.woosh} volume={0.25} /></Sequence>
      <Sequence from={CARD1-DELAY + 12}><Audio src={SFX.softImpact} volume={0.18} /></Sequence>
      <Sequence from={CARD2-DELAY}><Audio src={SFX.woosh} volume={0.25} /></Sequence>
      <Sequence from={CARD2-DELAY + 12}><Audio src={SFX.softImpact} volume={0.18} /></Sequence>
    </AbsoluteFill>
  );
};