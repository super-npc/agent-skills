import {
  AbsoluteFill,
  interpolate,
  spring,
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

export const CODE-CONTROLS-DURATION-FRAMES = 300;

const codeLines = [
  { text: "const video = compose({", indent: 0, color: "#C792EA" },
  { text: "  title:  <Title />",     indent: 0, color: "#82AAFF" },
  { text: "  chart:  <BarChart />",  indent: 0, color: "#82AAFF" },
  { text: "  image:  <Image />",     indent: 0, color: "#82AAFF" },
  { text: "  button: <Button />",    indent: 0, color: "#82AAFF" },
  { text: "  text:   <Caption />",   indent: 0, color: "#82AAFF" },
  { text: "  icon:   <Icon />",      indent: 0, color: "#82AAFF" },
  { text: "});",                     indent: 0, color: "#C792EA" },
];

const components = [
  { label: "Title",   icon: "T", color: "#4DA3FF", targetX: 1380, targetY: 180 },
  { label: "Chart",   icon: "▊", color: "#F59E0B", targetX: 1500, targetY: 320 },
  { label: "Image",   icon: "◻", color: "#10B981", targetX: 1340, targetY: 460 },
  { label: "Button",  icon: "▣", color: "#EF4444", targetX: 1520, targetY: 580 },
  { label: "Caption", icon: "≡", color: "#A78BFA", targetX: 1360, targetY: 700 },
  { label: "Icon",    icon: "★", color: "#EC4899", targetX: 1480, targetY: 840 },
];

const CODE-RIGHT-X = 620;
const CODE-TOP-Y = 230;
const CODE-LINE-HEIGHT = 42;

const CursorBlink: React.FC<{ frame: number }> = ({ frame }) => {
  const visible = Math.floor(frame / 15) % 2 === 0;
  return <div style={{ width: 2, height: 22, backgroundColor: colors.accent, opacity: visible ? 0.9 : 0, marginLeft: 4, display: "inline-block" }} />;
};

const AssembledScreen: React.FC<{ progress: number; assembleProgress: number }> = ({ progress, assembleProgress }) => {
  const screenOpacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{ position: "absolute", right: 100, top: 140, width: 560, height: 700, borderRadius: 20, border: `2px solid rgba(77, 163, 255, ${0.3 * screenOpacity})`, background: `rgba(255,255,255,${0.03 * screenOpacity})`, opacity: screenOpacity, overflow: "hidden" }}>
      <div style={{ height: 36, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
        {["#EF4444", "#F59E0B", "#10B981"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c, opacity: 0.7 }} />)}
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, opacity: assembleProgress }}>
        <div style={{ height: 48, borderRadius: 8, background: "linear-gradient(90deg, #4DA3FF33, #4DA3FF11)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#4DA3FF" }}>My Video Title</div>
        <div style={{ height: 140, borderRadius: 8, background: "rgba(245,158,11,0.08)", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, padding: "12px 20px" }}>
          {[60, 90, 45, 110, 75, 95].map((h, i) => <div key={i} style={{ width: 36, height: h * assembleProgress, borderRadius: "4px 4px 0 0", background: "linear-gradient(180deg, #F59E0B, #F59E0B88)", opacity: 0.8 }} />)}
        </div>
        <div style={{ height: 120, borderRadius: 8, background: "rgba(16,185,129,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 40, opacity: 0.5 }}>◻</span>
          <span style={{ fontSize: 18, color: "#10B981", opacity: 0.6 }}>Image</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, height: 52, borderRadius: 12, background: "linear-gradient(135deg, #EF4444, #EF444488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, color: "#fff" }}>Subscribe</div>
          <div style={{ flex: 2, height: 52, borderRadius: 12, background: "rgba(167,139,250,0.1)", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 16, color: "#A78BFA" }}>A caption goes here...</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 4 }}>
          {["★", "♥", "▶", "◆"].map((icon, i) => <span key={i} style={{ fontSize: 28, color: "#EC4899", opacity: 0.7 }}>{icon}</span>)}
        </div>
      </div>
    </div>
  );
};

export const CodeControlsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeBlockOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const codeBlockY = interpolate(frame, [0, 25], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const lineGrowProgress = (index: number) => {
    const start = 60 + index * 8;
    return interpolate(frame, [start, start + 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  };

  const componentAppear = (index: number) => {
    const start = 100 + index * 10;
    return spring({ frame: Math.max(0, frame - start), fps, config: { damping: 12, stiffness: 100 } });
  };

  const screenProgress = interpolate(frame, [170, 200], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const assembleProgress = interpolate(frame, [200, 250], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const questionOpacity = interpolate(frame, [240, 270], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const questionY = interpolate(frame, [240, 270], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const particles = Array.from({ length: 16 }, (_, i) => {
    const baseX = (i * 137) % 1920;
    const baseY = (i * 197) % 1080;
    const speed = 0.2 + (i % 5) * 0.1;
    const y = baseY + Math.sin((frame + i * 25) * speed * 0.03) * 20;
    const x = baseX + Math.cos((frame + i * 40) * speed * 0.02) * 15;
    const size = 1.5 + (i % 3);
    const opacity = interpolate(Math.sin((frame + i * 35) * 0.035), [-1, 1], [0.03, 0.15]);
    return { x, y, size, opacity };
  });

  const codeLineStartY = (index: number) => CODE-TOP-Y + 48 + index * CODE-LINE-HEIGHT;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: "'Noto Sans TC', 'Inter', sans-serif" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={colors.accent} opacity={p.opacity} />)}
      </svg>
      <div style={{ position: "absolute", left: 80, top: CODE-TOP-Y, width: 520, opacity: codeBlockOpacity, transform: `translateY(${codeBlockY}px)` }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px 16px 0 0", padding: "10px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          {["#EF4444", "#F59E0B", "#10B981"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c, opacity: 0.6 }} />)}
          <span style={{ marginLeft: 12, fontSize: 14, color: "rgba(255,255,255,0.3)" }}>animation.tsx</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "0 0 16px 16px", border: "1px solid rgba(77,163,255,0.15)", borderTop: "none", padding: "20px 24px" }}>
          {codeLines.map((line, i) => {
            const typeDelay = 5 + i * 7;
            const charCount = line.text.length;
            const charsVisible = Math.floor(interpolate(frame, [typeDelay, typeDelay + 15], [0, charCount], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
            const lineOpacity = interpolate(frame, [typeDelay, typeDelay + 5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const isCurrentlyTyping = charsVisible < charCount && charsVisible > 0;
            return (
              <div key={i} style={{ fontSize: 20, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", lineHeight: CODE-LINE-HEIGHT + "px", color: line.color, opacity: lineOpacity, display: "flex", alignItems: "center", whiteSpace: "pre" }}>
                <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 16, fontSize: 14, width: 20, textAlign: "right" }}>{i + 1}</span>
                {line.text.slice(0, charsVisible)}
                {isCurrentlyTyping && <CursorBlink frame={frame} />}
              </div>
            );
          })}
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <defs>
          {components.map((comp, i) => (
            <linearGradient key={i} id={`line-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.accent} stopOpacity={0.6} />
              <stop offset="100%" stopColor={comp.color} stopOpacity={0.8} />
            </linearGradient>
          ))}
        </defs>
        {components.map((comp, i) => {
          const progress = lineGrowProgress(i);
          if (progress <= 0) return null;
          const startX = CODE-RIGHT-X;
          const startY = codeLineStartY(i + 1);
          const endX = comp.targetX;
          const endY = comp.targetY;
          const lineOpacity = interpolate(assembleProgress, [0, 0.8], [1, 0.15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const cpX1 = startX + (endX - startX) * 0.4;
          const cpY1 = startY;
          const cpX2 = startX + (endX - startX) * 0.6;
          const cpY2 = endY;
          const pathData = `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;
          const approxLen = 800;
          const dashOffset = approxLen * (1 - progress);
          return <path key={i} d={pathData} fill="none" stroke={`url(#line-grad-${i})`} strokeWidth={2} strokeDasharray={approxLen} strokeDashoffset={dashOffset} strokeLinecap="round" opacity={lineOpacity} />;
        })}
      </svg>
      {components.map((comp, i) => {
        const appear = componentAppear(i);
        if (appear <= 0.01) return null;
        const nodeOpacity = interpolate(assembleProgress, [0.3, 0.8], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const glowPhase = Math.sin((frame + i * 20) * 0.06);
        const glowOpacity = interpolate(glowPhase, [-1, 1], [0.3, 0.7]);
        return (
          <div key={i} style={{ position: "absolute", left: comp.targetX - 40, top: comp.targetY - 40, width: 80, height: 80, opacity: appear * nodeOpacity, transform: `scale(${appear})` }}>
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: `radial-gradient(circle, ${comp.color}40, transparent 70%)`, opacity: glowOpacity }} />
            <div style={{ width: 80, height: 80, borderRadius: 16, background: `linear-gradient(135deg, ${comp.color}20, ${comp.color}08)`, border: `1.5px solid ${comp.color}60`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <span style={{ fontSize: 24 }}>{comp.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: comp.color, letterSpacing: 0.5 }}>{comp.label}</span>
            </div>
          </div>
        );
      })}
      <AssembledScreen progress={screenProgress} assembleProgress={assembleProgress} />
      {assembleProgress > 0.8 && (
        <div style={{ position: "absolute", right: 280, top: 440, opacity: interpolate(assembleProgress, [0.8, 1], [0, 0.6], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) }}>
          <svg width={80} height={80} viewBox="0 0 80 80">
            <circle cx={40} cy={40} r={38} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <polygon points="32,22 62,40 32,58" fill="rgba(255,255,255,0.8)" />
          </svg>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center", opacity: questionOpacity, transform: `translateY(${questionY}px)` }}>
        <div style={{ background: "rgba(77,163,255,0.08)", border: "1px solid rgba(77,163,255,0.2)", borderRadius: 16, padding: "16px 40px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28, color: colors.accent }}>?</span>
          <span style={{ fontSize: 28, fontWeight: 500, color: colors.text, lineHeight: 1.5 }}>
            有沒有其他套件，也是用<span style={{ color: colors.accent, fontWeight: 700 }}>程式碼</span>控制畫面的呢？
          </span>
        </div>
      </div>
      <AbsoluteFill style={{ backgroundColor: colors.background, opacity: interpolate(frame, [CODE-CONTROLS-DURATION-FRAMES - 15, CODE-CONTROLS-DURATION-FRAMES], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) }} />
    </AbsoluteFill>
  );
};