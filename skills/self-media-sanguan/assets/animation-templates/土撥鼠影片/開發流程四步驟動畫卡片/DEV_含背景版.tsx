import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DEV-FLOW-STEPS-DURATION-FRAMES = 240;

const STEPS = [
  { label: "發想", icon: "💡", color: "#F59E0B" },
  { label: "規劃", icon: "📋", color: "#4DA3FF" },
  { label: "測試文件", icon: "🧪", color: "#10B981" },
  { label: "開發", icon: "⚙️", color: "#A78BFA" },
];

const StepIcon: React.FC<{ index: number; color: string; progress: number }> = ({ index, color, progress }) => {
  const strokeLen = 200;
  const dashOffset = strokeLen * (1 - progress);

  const icons: React.ReactNode[] = [
    <g key="bulb">
      <circle cx="40" cy="32" r="18" fill="none" stroke={color} strokeWidth={3} strokeDasharray={strokeLen} strokeDashoffset={dashOffset} strokeLinecap="round" />
      <line x1="33" y1="54" x2="47" y2="54" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={progress} />
      <line x1="35" y1="60" x2="45" y2="60" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={progress} />
      <line x1="40" y1="50" x2="40" y2="54" stroke={color} strokeWidth={2} opacity={progress} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + Math.cos(rad) * 24;
        const y1 = 32 + Math.sin(rad) * 24;
        const x2 = 40 + Math.cos(rad) * 28;
        const y2 = 32 + Math.sin(rad) * 28;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeLinecap="round" opacity={progress * 0.6} />;
      })}
    </g>,
    <g key="clipboard">
      <rect x="22" y="18" width="36" height="46" rx="4" fill="none" stroke={color} strokeWidth={3} strokeDasharray={strokeLen} strokeDashoffset={dashOffset} strokeLinecap="round" />
      <rect x="32" y="12" width="16" height="10" rx="3" fill="none" stroke={color} strokeWidth={2.5} opacity={progress} />
      <line x1="30" y1="34" x2="50" y2="34" stroke={color} strokeWidth={2} opacity={progress} strokeLinecap="round" />
      <line x1="30" y1="42" x2="46" y2="42" stroke={color} strokeWidth={2} opacity={progress} strokeLinecap="round" />
      <line x1="30" y1="50" x2="42" y2="50" stroke={color} strokeWidth={2} opacity={progress} strokeLinecap="round" />
    </g>,
    <g key="test">
      <circle cx="40" cy="38" r="22" fill="none" stroke={color} strokeWidth={3} strokeDasharray={strokeLen} strokeDashoffset={dashOffset} strokeLinecap="round" />
      <polyline points="30,38 37,46 52,30" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - progress)} />
    </g>,
    <g key="code">
      <polyline points="28,26 16,40 28,54" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeLen} strokeDashoffset={dashOffset} />
      <polyline points="52,26 64,40 52,54" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeLen} strokeDashoffset={dashOffset} />
      <line x1="44" y1="22" x2="36" y2="58" stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={progress} />
    </g>,
  ];

  return <svg width={80} height={80} viewBox="0 0 80 80">{icons[index]}</svg>;
};

const Arrow: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  const lineLen = 60;
  const drawn = lineLen * progress;
  return (
    <svg width={80} height={40} viewBox="0 0 80 40">
      <defs>
        <marker id={`arrowhead-${color.replace("#", "")}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={color} opacity={progress} />
        </marker>
      </defs>
      <line x1={10} y1={20} x2={10 + drawn} y2={20} stroke={color} strokeWidth={2.5} strokeLinecap="round" markerEnd={progress > 0.8 ? `url(#arrowhead-${color.replace("#", "")})` : undefined} />
    </svg>
  );
};

export const DevFlowStepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STEP-DELAY = 30;
  const FIRST-STEP-START = 30;

  const cardScale = spring({ frame, fps, config: { damping: 200 } });
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", fontFamily: "'Noto Sans TC', 'Inter', sans-serif", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "rgba(11, 15, 23, 0.92)", borderRadius: 32, padding: "60px 80px 50px", border: "1.5px solid rgba(77, 163, 255, 0.2)", boxShadow: "0 8px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(77, 163, 255, 0.08)", transform: `scale(${cardScale})`, opacity: cardOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STEPS.map((step, i) => {
            const stepStart = FIRST-STEP-START + i * STEP-DELAY;
            const iconProgress = interpolate(frame - stepStart, [0, 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const scaleSpring = spring({ frame: Math.max(0, frame - stepStart), fps, config: { damping: 12, stiffness: 100 } });
            const labelOpacity = interpolate(frame - stepStart, [10, 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const labelY = interpolate(frame - stepStart, [10, 25], [12, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const glowOpacity = interpolate(frame - stepStart, [0, 20], [0, 0.15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const arrowStart = stepStart + 15;
            const arrowProgress = i < STEPS.length - 1 ? interpolate(frame - arrowStart, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 0;
            const isActive = frame >= stepStart + 20;
            const activeRingOpacity = isActive ? interpolate(Math.sin((frame - stepStart) * 0.08), [-1, 1], [0.2, 0.5]) : 0;

            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scaleSpring})`, opacity: interpolate(frame - stepStart, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) }}>
                  <div style={{ position: "relative", width: 140, height: 140, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${step.color}60 0%, transparent 70%)`, opacity: glowOpacity }} />
                    <svg width={140} height={140} viewBox="0 0 140 140" style={{ position: "absolute" }}>
                      <circle cx={70} cy={70} r={64} fill="none" stroke={step.color} strokeWidth={2.5} strokeDasharray={402} strokeDashoffset={402 * (1 - iconProgress)} strokeLinecap="round" opacity={0.8} />
                      <circle cx={70} cy={70} r={66} fill="none" stroke={step.color} strokeWidth={1.5} opacity={activeRingOpacity} />
                    </svg>
                    <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: iconProgress }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <StepIcon index={i} color={step.color} progress={iconProgress} />
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: step.color, opacity: labelOpacity, marginTop: 12, letterSpacing: 2 }}>STEP {i + 1}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: "#FFFFFF", opacity: labelOpacity, transform: `translateY(${labelY}px)`, marginTop: 6, textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 0 20px ${step.color}40` }}>{step.label}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ margin: "0 8px", marginBottom: 80 }}>
                    <Arrow progress={arrowProgress} color={`${step.color}99`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};