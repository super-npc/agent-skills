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
  danger: "#FF6B6B",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const Scene65-No3DNeeded: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modelSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const modelScale = interpolate(modelSpring, [0, 1], [0.3, 1]);
  const modelOpacity = interpolate(modelSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const cubeRotate = interpolate(frame, [10, 60], [0, 35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const banSpring = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 6, mass: 0.3, stiffness: 200 } });
  const banScale = interpolate(banSpring, [0, 1], [1.8, 1]);
  const banOpacity = interpolate(banSpring, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const noLabelSpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const noLabelOp = interpolate(noLabelSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const phase1Fade = interpolate(frame, [80, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 8, mass: 0.4, stiffness: 140 } });
  const arrowOpacity = interpolate(arrowSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const arrowFade = interpolate(frame, [110, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fixedSpring = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const fixedScale = interpolate(fixedSpring, [0, 1], [0.4, 1]);
  const fixedOpacity = interpolate(fixedSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOp = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const playProgress = interpolate(frame, [120, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floatY1 = Math.sin(frame * 0.06) * 8;
  const floatY2 = Math.sin(frame * 0.06 + 2) * 6;
  const floatX1 = Math.sin(frame * 0.04) * 5;
  const screenGlow = frame > 125 ? interpolate(Math.sin((frame - 125) * 0.06), [-1, 1], [0, 15]) : 0;
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {phase1Fade > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: modelOpacity * phase1Fade, transform: `scale(${modelScale})` }}>
            <div style={{ position: "relative" }}>
              <svg width="330" height="330" viewBox="0 0 220 220">
                <g transform={`rotate(${cubeRotate * 0.3}, 110, 110)`}>
                  <polygon points="110,45 175,80 110,115 45,80" fill={`${colors.accentSecondary}15`} stroke={`${colors.accentSecondary}60`} strokeWidth="2" />
                  <polygon points="45,80 110,115 110,180 45,145" fill={`${colors.accentSecondary}10`} stroke={`${colors.accentSecondary}50`} strokeWidth="2" />
                  <polygon points="110,115 175,80 175,145 110,180" fill={`${colors.accentSecondary}20`} stroke={`${colors.accentSecondary}50`} strokeWidth="2" />
                </g>
                <g opacity={0.4}>
                  <path d="M30,110 A80,80 0 0,1 110,30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                  <polygon points="108,25 115,35 105,35" fill="rgba(255,255,255,0.3)" />
                  <path d="M190,110 A80,80 0 0,1 110,190" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                  <polygon points="112,195 105,185 115,185" fill="rgba(255,255,255,0.3)" />
                </g>
              </svg>
              {banOpacity > 0 && (
                <div style={{ position: "absolute", top: 0, left: 0, width: 330, height: 330, transform: `scale(${banScale})`, opacity: banOpacity }}>
                  <svg width="330" height="330" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="90" fill="none" stroke={colors.danger} strokeWidth="6" />
                    <line x1="46" y1="174" x2="174" y2="46" stroke={colors.danger} strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <span style={{ fontSize: 54, fontWeight: 800, fontFamily: fonts.main, color: colors.danger, letterSpacing: 3, opacity: noLabelOp }}>不需要建 3D 模型</span>
          </div>
        )}
        {arrowFade > 0 && arrowOpacity > 0 && (
          <div style={{ position: "absolute", opacity: arrowOpacity * arrowFade }}>
            <svg width="90" height="105" viewBox="0 0 60 70">
              <defs>
                <linearGradient id="n3dArrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.danger} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>
              <path d="M30 8 L30 48 M18 38 L30 52 L42 38" fill="none" stroke="url(#n3dArrowGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {fixedOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: fixedOpacity, transform: `scale(${fixedScale})` }}>
            <div style={{ borderRadius: 16, border: `2px solid ${colors.accent}30`, boxShadow: `0 0 ${screenGlow}px ${colors.accent}30`, padding: 4 }}>
              <svg width="690" height="420" viewBox="0 0 460 280">
                <rect x="0" y="0" width="460" height="260" rx="12" fill="#0D1117" stroke={`${colors.accent}25`} strokeWidth="1.5" />
                <rect x="190" y="260" width="80" height="8" rx="2" fill="rgba(255,255,255,0.06)" />
                <rect x="170" y="268" width="120" height="6" rx="3" fill="rgba(255,255,255,0.04)" />
                <rect x="0" y="0" width="460" height="24" rx="12" fill="rgba(255,255,255,0.03)" />
                <polygon points="20,9 20,17 27,13" fill={colors.accent} opacity={0.6} />
                <text x="35" y="16" fontSize="9" fontFamily={fonts.main} fill="rgba(255,255,255,0.3)" fontWeight="500">Animation.mp4</text>
                <circle cx={120 + floatX1 * 4} cy={100 + floatY1} r="22" fill={`${colors.accent}25`} stroke={`${colors.accent}50`} strokeWidth="2" />
                <rect x={260} y={80 + floatY2} width="60" height="40" rx="8" fill={`${colors.warning}20`} stroke={`${colors.warning}40`} strokeWidth="1.5" />
                <polygon points={`340,${130 + floatY1 * 0.5} 370,${170 + floatY1 * 0.5} 310,${170 + floatY1 * 0.5}`} fill={`${colors.accentSecondary}20`} stroke={`${colors.accentSecondary}40`} strokeWidth="1.5" />
                <line x1={95 + floatX1 * 3} y1={100 + floatY1} x2={80} y2={100 + floatY1 * 0.3} stroke={`${colors.accent}20`} strokeWidth="2" strokeLinecap="round" />
                {[{ x: 180, y: 70, d: 0 }, { x: 220, y: 150, d: 1.5 }, { x: 400, y: 90, d: 3 }, { x: 60, y: 180, d: 4.5 }].map((p, i) => {
                  const pFloat = Math.sin(frame * 0.08 + p.d) * 10;
                  const pOp = Math.sin(frame * 0.1 + p.d) * 0.3 + 0.4;
                  return <circle key={i} cx={p.x} cy={p.y + pFloat} r="3" fill={[colors.accent, colors.warning, colors.accentSecondary, colors.accent][i]} opacity={pOp} />;
                })}
                <rect x="20" y="235" width="420" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
                <rect x="20" y="235" width={420 * playProgress} height="4" rx="2" fill={colors.accent} opacity={0.6} />
                <circle cx={20 + 420 * playProgress} cy="237" r="6" fill={colors.accent} opacity={0.8} />
                <g opacity={0.4}>
                  <rect x="415" y="5" width="14" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M418,5 L418,2 A4,4 0 0,1 426,2 L426,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
            {badgeOp > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 21, opacity: badgeOp, transform: `scale(${badgeScale})` }}>
                <svg width="54" height="54" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2.5" />
                  <path d="M12 18 L16 22 L25 13" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 51, fontWeight: 700, fontFamily: fonts.main, color: colors.accent, letterSpacing: 3 }}>固定動畫就夠了</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};