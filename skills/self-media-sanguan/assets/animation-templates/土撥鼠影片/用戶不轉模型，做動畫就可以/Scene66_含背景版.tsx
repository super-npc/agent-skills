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

export const Scene66-AnimationSuffice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1Spring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const phase1Scale = interpolate(phase1Spring, [0, 1], [0.3, 1]);
  const phase1Opacity = interpolate(phase1Spring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const cursorX = interpolate(frame, [15, 30, 45, 55], [0, 15, -10, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [15, 30, 45, 55], [0, -10, 8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xSpring = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 6, mass: 0.3, stiffness: 200 } });
  const xScale = interpolate(xSpring, [0, 1], [1.6, 1]);
  const xOpacity = interpolate(xSpring, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const phase1Fade = interpolate(frame, [75, 95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vsSpring = spring({ frame: Math.max(0, frame - 85), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const vsOpacity = interpolate(vsSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const vsFade = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase3Spring = spring({ frame: Math.max(0, frame - 105), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
  const phase3Scale = interpolate(phase3Spring, [0, 1], [0.4, 1]);
  const phase3Opacity = interpolate(phase3Spring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const loopAngle = interpolate(frame, [105, 240], [0, 720]);
  const loopBounce = Math.sin(frame * 0.07) * 15;
  const loopFloat = Math.sin(frame * 0.05 + 1) * 10;
  const playProgress = interpolate(frame, [115, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loopIconSpring = spring({ frame: Math.max(0, frame - 135), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const loopIconOp = interpolate(loopIconSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const badgeSpring = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOp = interpolate(badgeSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const screenGlow = frame > 120 ? interpolate(Math.sin((frame - 120) * 0.06), [-1, 1], [0, 14]) : 0;
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {phase1Fade > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: phase1Opacity * phase1Fade, transform: `scale(${phase1Scale})` }}>
            <div style={{ position: "relative", width: 390, height: 360 }}>
              <svg width="390" height="360" viewBox="0 0 260 240">
                <g>
                  <polygon points="130,40 200,75 130,110 60,75" fill={`${colors.accentSecondary}12`} stroke={`${colors.accentSecondary}50`} strokeWidth="2" />
                  <polygon points="60,75 130,110 130,175 60,140" fill={`${colors.accentSecondary}08`} stroke={`${colors.accentSecondary}40`} strokeWidth="2" />
                  <polygon points="130,110 200,75 200,140 130,175" fill={`${colors.accentSecondary}18`} stroke={`${colors.accentSecondary}40`} strokeWidth="2" />
                </g>
                <g transform={`translate(${155 + cursorX}, ${120 + cursorY})`}>
                  <path d="M0,0 L0,24 L6,18 L12,28 L16,26 L10,16 L18,16 Z" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="1" opacity={0.8} />
                </g>
                <path d="M90,190 A50,20 0 0,0 170,190" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5 4" />
                <polygon points="170,186 175,192 168,194" fill="rgba(255,255,255,0.15)" />
              </svg>
              {xOpacity > 0 && (
                <div style={{ position: "absolute", top: 20, left: 20, width: 330, height: 300, transform: `scale(${xScale})`, opacity: xOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="180" height="180" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill={`${colors.danger}10`} stroke={colors.danger} strokeWidth="4" />
                    <line x1="35" y1="35" x2="85" y2="85" stroke={colors.danger} strokeWidth="5" strokeLinecap="round" />
                    <line x1="85" y1="35" x2="35" y2="85" stroke={colors.danger} strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <span style={{ fontSize: 45, fontWeight: 700, fontFamily: fonts.main, color: "rgba(255,255,255,0.5)", letterSpacing: 2 }}>用戶不會轉動模型</span>
          </div>
        )}
        {vsFade > 0 && vsOpacity > 0 && (
          <div style={{ position: "absolute", opacity: vsOpacity * vsFade }}>
            <svg width="120" height="90" viewBox="0 0 80 60">
              <defs>
                <linearGradient id="asSuffArrow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colors.danger} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>
              <path d="M10 30 L55 30 M48 20 L60 30 L48 40" fill="none" stroke="url(#asSuffArrow)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {phase3Opacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: phase3Opacity, transform: `scale(${phase3Scale})` }}>
            <div style={{ borderRadius: 16, border: `2px solid ${colors.accent}30`, boxShadow: `0 0 ${screenGlow}px ${colors.accent}30`, padding: 4 }}>
              <svg width="630" height="450" viewBox="0 0 420 300">
                <rect x="0" y="0" width="420" height="300" rx="12" fill="#0D1117" stroke={`${colors.accent}20`} strokeWidth="1.5" />
                <rect x="0" y="0" width="420" height="28" rx="12" fill="rgba(255,255,255,0.03)" />
                <circle cx="14" cy="14" r="4" fill="#FF5F57" opacity={0.5} />
                <circle cx="28" cy="14" r="4" fill="#FFBD2E" opacity={0.5} />
                <circle cx="42" cy="14" r="4" fill="#28CA41" opacity={0.5} />
                <g transform="translate(375, 7)" opacity={loopIconOp * 0.7}>
                  <path d="M0,7 A7,7 0 1,1 10,0" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
                  <polygon points="10,-4 10,4 15,0" fill={colors.accent} />
                </g>
                <ellipse cx="210" cy={230} rx={30 + loopBounce * 0.3} ry={6} fill="rgba(255,255,255,0.04)" />
                <circle cx="210" cy={150 + loopBounce} r="35" fill={`${colors.accent}20`} stroke={`${colors.accent}50`} strokeWidth="2" />
                <circle cx="200" cy={140 + loopBounce} r="10" fill={`${colors.accent}20`} />
                {loopBounce < -5 && (
                  <>
                    <line x1="195" y1={190 + loopBounce} x2="195" y2={200 + loopBounce} stroke={`${colors.accent}25`} strokeWidth="2" strokeLinecap="round" />
                    <line x1="210" y1={192 + loopBounce} x2="210" y2={205 + loopBounce} stroke={`${colors.accent}20`} strokeWidth="2" strokeLinecap="round" />
                    <line x1="225" y1={190 + loopBounce} x2="225" y2={200 + loopBounce} stroke={`${colors.accent}25`} strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
                <g transform={`translate(80, ${140 + loopFloat})`}>
                  <rect x="-15" y="-15" width="30" height="30" rx="4" fill={`${colors.warning}15`} stroke={`${colors.warning}35`} strokeWidth="1.5" transform={`rotate(${loopAngle * 0.1})`} />
                </g>
                <g transform={`translate(340, ${155 + loopFloat * 0.7})`}>
                  <polygon points="0,-18 16,12 -16,12" fill={`${colors.accentSecondary}15`} stroke={`${colors.accentSecondary}35`} strokeWidth="1.5" />
                </g>
                <rect x="20" y="272" width="380" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
                <rect x="20" y="272" width={380 * playProgress} height="4" rx="2" fill={colors.accent} opacity={0.5} />
                <circle cx={20 + 380 * playProgress} cy="274" r="6" fill={colors.accent} opacity={0.7} />
                <text x="210" y="255" textAnchor="middle" fontSize="10" fontFamily={fonts.main} fill={`${colors.accent}10`} fontWeight="700" letterSpacing="6">ANIMATION</text>
              </svg>
            </div>
            {badgeOp > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 21, opacity: badgeOp, transform: `scale(${badgeScale})` }}>
                <svg width="54" height="54" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2.5" />
                  <path d="M12 18 L16 22 L25 13" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 51, fontWeight: 700, fontFamily: fonts.main, color: colors.accent, letterSpacing: 3 }}>做動畫就可以</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};