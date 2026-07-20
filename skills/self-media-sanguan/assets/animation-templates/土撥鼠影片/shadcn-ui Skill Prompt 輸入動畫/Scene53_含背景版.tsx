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

const LINE1 = "請利用 shadcn-ui skill";
const LINE2 = "幫我重新設計這個網站";
const TOTAL-CHARS = LINE1.length + LINE2.length;
const HIGHLIGHT-KEYWORD = "shadcn-ui skill";
const PREFIX = "請利用 ";

const estimateTextWidth = (text: string, fontSize: number): number => {
  let width = 0;
  for (const ch of text) {
    if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(ch)) width += fontSize * 1.0;
    else if (ch === " ") width += fontSize * 0.28;
    else if (ch === "-") width += fontSize * 0.4;
    else width += fontSize * 0.55;
  }
  return width;
};

export const Scene53-ShadcnPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, mass: 0.5, stiffness: 110 } });
  const boxScale = interpolate(boxSpring, [0, 1], [0.6, 1]);
  const boxOpacity = interpolate(boxSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const typeStart = 30, typeEnd = 105;
  const charsVisible = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, TOTAL-CHARS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const line1Visible = Math.min(charsVisible, LINE1.length);
  const line2Visible = Math.max(0, charsVisible - LINE1.length);
  const displayLine1 = LINE1.slice(0, line1Visible);
  const displayLine2 = LINE2.slice(0, line2Visible);
  const onLine2 = charsVisible > LINE1.length;
  const typingDone = charsVisible >= TOTAL-CHARS;
  const cursorVisible = !typingDone || Math.floor(frame * 0.06) % 2 === 0;

  const highlightOpacity = interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sendSpring = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const sendScale = interpolate(sendSpring, [0, 1], [0.5, 1]);
  const sendOpacity = interpolate(sendSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const sendPulse = frame > 125 ? interpolate(Math.sin((frame - 125) * 0.12), [-1, 1], [0.85, 1.05]) : 1;
  const fadeOut = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);
  const skillGlow = highlightOpacity > 0 ? interpolate(Math.sin(frame * 0.08), [-1, 1], [0.6, 1]) : 0;

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accentSecondary}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        <div style={{ opacity: boxOpacity, transform: `scale(${boxScale})` }}>
          <svg width="1500" height="420" viewBox="0 0 1000 280">
            <defs>
              <linearGradient id="s3BoxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
              <linearGradient id="s3SendGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colors.accent} />
                <stop offset="100%" stopColor={colors.accentSecondary} />
              </linearGradient>
              <filter id="s3Glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="s3SkillGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x="0" y="0" width="1000" height="280" rx="24" fill="url(#s3BoxGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <rect x="30" y="65" width="940" height="145" rx="16" fill="rgba(0,0,0,0.3)" stroke={`${colors.accent}30`} strokeWidth="1.5" />
            <text x="55" y="50" fontSize="22" fontFamily={fonts.main} fill={colors.accent} fontWeight="700" letterSpacing="2" opacity={labelOpacity}>Prompt:</text>
            {line1Visible > 0 && (
              <g>
                {highlightOpacity > 0 && line1Visible === LINE1.length ? (
                  <>
                    <text x="60" y="120" fontSize="36" fontFamily={fonts.main} fill="rgba(255,255,255,0.9)" fontWeight="600">{PREFIX}</text>
                    {(() => {
                      const prefixW = estimateTextWidth(PREFIX, 36);
                      const hlW = estimateTextWidth(HIGHLIGHT-KEYWORD, 36);
                      return (
                        <>
                          <rect x={60 + prefixW - 6} y="92" width={hlW + 12} height="42" rx="8" fill={`${colors.accentSecondary}15`} stroke={colors.accentSecondary} strokeWidth="2" opacity={highlightOpacity * skillGlow} filter="url(#s3SkillGlow)" />
                          <text x={60 + prefixW} y="120" fontSize="36" fontFamily={fonts.main} fill={colors.accentSecondary} fontWeight="700" opacity={Math.max(0.9, highlightOpacity)}>{HIGHLIGHT-KEYWORD}</text>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <text x="60" y="120" fontSize="36" fontFamily={fonts.main} fill="rgba(255,255,255,0.9)" fontWeight="600">{displayLine1}</text>
                )}
              </g>
            )}
            {line2Visible > 0 && <text x="60" y="175" fontSize="36" fontFamily={fonts.main} fill="rgba(255,255,255,0.9)" fontWeight="600">{displayLine2}</text>}
            {cursorVisible && !typingDone && <rect x={onLine2 ? 60 + estimateTextWidth(displayLine2, 36) : 60 + estimateTextWidth(displayLine1, 36)} y={onLine2 ? 147 : 92} width="3" height="38" rx="1.5" fill={colors.accent} />}
            {sendOpacity > 0 && (
              <g transform={`translate(880, 115) scale(${sendScale * sendPulse})`} opacity={sendOpacity}>
                <circle cx="20" cy="20" r="22" fill="url(#s3SendGrad)" filter="url(#s3Glow)" />
                <path d="M12 20 L28 20 M22 14 L28 20 L22 26" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
            <circle cx="50" cy="255" r="3" fill={`${colors.accent}30`} />
            <circle cx="65" cy="255" r="3" fill={`${colors.accentSecondary}30`} />
            <circle cx="80" cy="255" r="3" fill={`${colors.warning}30`} />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};