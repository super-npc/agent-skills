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
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const Scene60-ExtractTool: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const researchSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const researchScale = interpolate(researchSpring, [0, 1], [0.3, 1]);
  const researchOpacity = interpolate(researchSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const researchFade = interpolate(frame, [45, 65], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 8, mass: 0.4, stiffness: 140 } });
  const arrowOpacity = interpolate(arrowSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const arrowFade = interpolate(frame, [70, 85], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const toolSpring = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const toolScale = interpolate(toolSpring, [0, 1], [0.4, 1]);
  const toolOpacity = interpolate(toolSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const codeProgress = interpolate(frame, [90, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gearRotate = interpolate(frame, [75, 285], [0, 360], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  const codeLines = [
    { text: "$ python extract.py", color: colors.accent, y: 75 },
    { text: "  → Fetching website...", color: "rgba(255,255,255,0.5)", y: 110 },
    { text: "  → Extracting HTML/CSS...", color: "rgba(255,255,255,0.5)", y: 145 },
    { text: "  → Analyzing animations...", color: "rgba(255,255,255,0.5)", y: 180 },
    { text: "  → Generating components...", color: "rgba(255,255,255,0.5)", y: 215 },
    { text: "  ✓ Done!", color: colors.accent, y: 255 },
  ];

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.warning}08 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {researchFade > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: researchOpacity * researchFade, transform: `scale(${researchScale})` }}>
            <svg width="150" height="180" viewBox="0 0 100 120">
              <circle cx="50" cy="40" r="28" fill={`${colors.warning}20`} stroke={colors.warning} strokeWidth="2.5" />
              <path d="M38 60 L38 75 Q38 82 50 82 Q62 82 62 75 L62 60" fill="none" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M44 35 Q50 25 56 35 Q50 45 44 35" fill="none" stroke={colors.warning} strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const rayOp = interpolate(Math.sin(frame * 0.1 + angle * 0.02), [-1, 1], [0.2, 0.7]);
                return <line key={angle} x1={50 + Math.cos(rad) * 35} y1={40 + Math.sin(rad) * 35} x2={50 + Math.cos(rad) * 42} y2={40 + Math.sin(rad) * 42} stroke={colors.warning} strokeWidth="2" strokeLinecap="round" opacity={rayOp} />;
              })}
            </svg>
            <span style={{ fontSize: 48, fontWeight: 700, fontFamily: fonts.main, color: "rgba(255,255,255,0.6)" }}>參考了一些做法</span>
          </div>
        )}
        {arrowFade > 0 && arrowOpacity > 0 && (
          <div style={{ position: "absolute", opacity: arrowOpacity * arrowFade }}>
            <svg width="90" height="105" viewBox="0 0 60 70">
              <defs>
                <linearGradient id="etArrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.warning} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>
              <path d="M30 8 L30 48 M18 38 L30 52 L42 38" fill="none" stroke="url(#etArrowGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {toolOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: toolOpacity, transform: `scale(${toolScale})` }}>
            <svg width="930" height="480" viewBox="0 0 620 320">
              <defs>
                <linearGradient id="etCardGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="620" height="320" rx="20" fill="url(#etCardGrad)" stroke={`${colors.warning}30`} strokeWidth="2" />
              <rect x="0" y="0" width="620" height="40" rx="20" fill="rgba(255,255,255,0.03)" />
              <circle cx="22" cy="20" r="6" fill="#FF5F57" opacity={0.7} />
              <circle cx="42" cy="20" r="6" fill="#FFBD2E" opacity={0.7} />
              <circle cx="62" cy="20" r="6" fill="#28CA41" opacity={0.7} />
              <text x="310" y="25" textAnchor="middle" fontSize="14" fontFamily="'Courier New', monospace" fill="rgba(255,255,255,0.3)">extract.py</text>
              <g transform={`translate(540, 80) rotate(${gearRotate}, 0, 0)`}>
                <circle cx="0" cy="0" r="22" fill="none" stroke={`${colors.warning}40`} strokeWidth="2" />
                {[0, 60, 120, 180, 240, 300].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return <circle key={angle} cx={Math.cos(rad) * 22} cy={Math.sin(rad) * 22} r="5" fill={`${colors.warning}30`} stroke={`${colors.warning}50`} strokeWidth="1" />;
                })}
              </g>
              {codeLines.map((line, i) => {
                const lineProgress = interpolate(codeProgress, [i * 0.15, Math.min(1, i * 0.15 + 0.18)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const charsToShow = Math.floor(lineProgress * line.text.length);
                return <text key={i} x="35" y={line.y} fontSize="20" fontFamily="'Courier New', monospace" fill={line.color} fontWeight={i === 0 || i === 5 ? "700" : "400"}>{line.text.slice(0, charsToShow)}</text>;
              })}
              <rect x="35" y="285" width="550" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
              <rect x="35" y="285" width={550 * codeProgress} height="6" rx="3" fill={colors.warning} opacity={0.7} />
            </svg>
            {badgeOpacity > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
                <svg width="48" height="48" viewBox="0 0 32 32">
                  <path d="M8 24 L20 12 Q24 8 28 12 Q32 16 28 20 L16 8" fill="none" stroke={colors.warning} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 45, fontWeight: 700, fontFamily: fonts.main, color: colors.warning, letterSpacing: 2 }}>自製工具</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};