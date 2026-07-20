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
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  dimmed: "rgba(255, 255, 255, 0.6)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const ELEMENTS = [
  { label: "線條", color: "#00D4AA" },
  { label: "顏色", color: "#FFB547" },
  { label: "文字", color: "#4DA3FF" },
];

const LineIcon: React.FC<{ color: string; progress: number; frame: number }> = ({ color, progress, frame }) => {
  const dashLen = interpolate(progress, [0, 1], [0, 300]);
  const wave = Math.sin(frame * 0.06) * 8;
  return (
    <svg width="270" height="270" viewBox="-90 -90 180 180">
      <circle cx={0} cy={0} r={80} fill={`${color}08`} stroke={`${color}25`} strokeWidth={2} />
      <path d={`M-50,${-20 + wave} Q-20,${-40 + wave} 0,${-15 + wave} T50,${-25 + wave}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 - dashLen} opacity={0.9} />
      <path d={`M-50,${10 - wave * 0.5} Q-10,${30 - wave * 0.5} 20,${5 - wave * 0.5} T50,${15 - wave * 0.5}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 - dashLen * 0.8} opacity={0.6} />
      <path d={`M-40,${35 + wave * 0.3} L0,${40 + wave * 0.3} L40,${30 + wave * 0.3}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 - dashLen * 0.6} opacity={0.4} />
    </svg>
  );
};

const ColorIcon: React.FC<{ color: string; progress: number; frame: number }> = ({ color, progress, frame }) => {
  const rot = interpolate(frame, [0, 180], [0, 360]);
  return (
    <svg width="270" height="270" viewBox="-90 -90 180 180">
      <circle cx={0} cy={0} r={80} fill={`${color}08`} stroke={`${color}25`} strokeWidth={2} />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const segColors = ["#FF6B6B", "#FFB547", "#2ECC71", "#4DA3FF", "#9B59B6", "#00D4AA"];
        const rad = ((angle + rot * 0.3) * Math.PI) / 180;
        const r = 38;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        const s = interpolate(progress, [0, 1], [0, 1]);
        return <circle key={i} cx={x} cy={y} r={interpolate(s, [0, 1], [0, 18])} fill={segColors[i]} opacity={interpolate(s, [0, 1], [0, 0.7])} />;
      })}
      <circle cx={0} cy={0} r={10 * progress} fill="#FFF" opacity={0.5 * progress} />
    </svg>
  );
};

const TextIcon: React.FC<{ color: string; progress: number; frame: number }> = ({ color, progress, frame }) => {
  const blink = Math.sin(frame * 0.15) > 0 ? 1 : 0.3;
  return (
    <svg width="270" height="270" viewBox="-90 -90 180 180">
      <circle cx={0} cy={0} r={80} fill={`${color}08`} stroke={`${color}25`} strokeWidth={2} />
      <text x={0} y={8} textAnchor="middle" fontSize={56} fontWeight={800} fontFamily={fonts.main} fill={color} opacity={interpolate(progress, [0, 1], [0, 0.85])}>Aa</text>
      <rect x={38} y={-18} width={4} height={48} rx={2} fill="#FFF" opacity={progress > 0.5 ? blink * 0.6 : 0} />
      <line x1={-35} y1={30} x2={interpolate(progress, [0, 1], [-35, 35])} y2={30} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.4} />
    </svg>
  );
};

const ICONS = [LineIcon, ColorIcon, TextIcon];

export const Scene47-AiReadsOnly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.5, 1]);
  const titleOp = interpolate(titleSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const iconSprings = ELEMENTS.map((_, i) => spring({ frame: Math.max(0, frame - (35 + i * 20)), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } }));
  const labelSprings = ELEMENTS.map((_, i) => spring({ frame: Math.max(0, frame - (50 + i * 20)), fps, config: { damping: 12, mass: 0.4, stiffness: 150 } }));
  const scanProgress = interpolate(frame, [80, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const allGlow = interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 1100, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accentSecondary}08 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: bgPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ fontSize: 108, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 6, opacity: titleOp, transform: `scale(${titleScale})`, textAlign: "center" }}>
          <span style={{ color: colors.accentSecondary }}>AI</span>
          <span style={{ color: "#FFFFFFcc" }}> 只能讀取</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {ELEMENTS.map((el, i) => {
            const iconScale = interpolate(iconSprings[i], [0, 1], [0.2, 1]);
            const iconOp = interpolate(iconSprings[i], [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const labelOp = interpolate(labelSprings[i], [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
            const floatY = Math.sin(frame * 0.05 + i * 2) * 5;
            const glowIntensity = allGlow > 0 ? Math.sin(frame * 0.08 + i * 1.2) * 0.3 + 0.7 : 0;
            const IconComponent = ICONS[i];
            return (
              <div key={el.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: iconOp, transform: `scale(${iconScale}) translateY(${floatY}px)` }}>
                <div style={{ position: "relative" }}>
                  {glowIntensity > 0 && <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `2px solid ${el.color}`, opacity: glowIntensity * 0.35 }} />}
                  <IconComponent color={el.color} progress={iconSprings[i]} frame={frame} />
                </div>
                <div style={{ fontSize: 63, fontWeight: 700, fontFamily: fonts.main, color: el.color, opacity: labelOp, letterSpacing: 4, filter: glowIntensity > 0 ? `drop-shadow(0 0 12px ${el.color}50)` : "none" }}>
                  {el.label}
                </div>
              </div>
            );
          })}
        </div>
        {scanProgress > 0 && scanProgress < 1 && (
          <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${colors.accentSecondary}60, transparent)`, top: `${interpolate(scanProgress, [0, 1], [20, 80])}%`, opacity: 0.6, boxShadow: `0 0 20px ${colors.accentSecondary}40` }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};