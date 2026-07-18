import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
};

const AUDIO = {
  softClick: staticFile("audio/connection/soft-click.wav"),
  whoosh: staticFile("audio/connection/woosh.wav"),
  whooshOut: staticFile("audio/connection/whoosh-out.mp3"),
  ding: staticFile("audio/connection/ding.mp3"),
  tinyPop: staticFile("audio/connection/tiny-pop.mp3"),
  tick: staticFile("audio/connection/tick.wav"),
  satisfyingFill: staticFile("audio/connection/satisfying-fill.wav"),
};

const WORD-GROUPS = [
  { text: "請幫我", color: "#FFFFFF", startFrame: 50 },
  { text: "上網搜尋 ", color: "#FFFFFF", startFrame: 58 },
  { text: "sonic pi", color: "#FF6B6B", startFrame: 66 },
  { text: " 相關的文本、", color: "#FFFFFF", startFrame: 74 },
  { text: "教學、", color: "#FFFFFF", startFrame: 82 },
  { text: "並且幫我", color: "#FFFFFF", startFrame: 90 },
  { text: "生成 ", color: "#FFFFFF", startFrame: 98 },
  { text: "Skill", color: colors.accent, startFrame: 104 },
];

const ACTION-ITEMS = [
  { label: "搜尋文本", appearFrame: 130 },
  { label: "教學資料", appearFrame: 155 },
  { label: "生成 Skill", appearFrame: 175 },
];

export const Scene11-PromptSkill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: frame - 5, fps, config: { damping: 12, mass: 0.8, stiffness: 160 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const boxSpring = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 1, stiffness: 100 } });
  const boxSlideY = interpolate(boxSpring, [0, 1], [120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boxOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursorVisible = frame >= 40;
  const cursorBlink = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  const visibleGroups = WORD-GROUPS.filter((g) => frame >= g.startFrame);

  const actionAnimations = ACTION-ITEMS.map((item) => {
    const iconSpring = spring({ frame: frame - item.appearFrame, fps, config: { damping: 12, mass: 0.7, stiffness: 160 } });
    const scale = interpolate(iconSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity = interpolate(frame, [item.appearFrame, item.appearFrame + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const strokeProgress = interpolate(frame, [item.appearFrame, item.appearFrame + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { scale, opacity, strokeProgress };
  });

  const lineProgress = interpolate(frame, [195, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineGlow = interpolate(frame, [205, 215, 225], [0, 0.8, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const idlePulse = frame > 210 && frame < 275 ? 0.03 * Math.sin(((frame - 210) / 25) * Math.PI * 2) : 0;
  const fadeOut = interpolate(frame, [275, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ACTION-X_POSITIONS = [480, 960, 1440];
  const ACTION-Y = 720;

  // Simple icon shapes
  const renderIcon = (idx: number, sp: number) => {
    const totalLen = 400;
    const dashOffset = totalLen * (1 - sp);
    if (idx === 0) return (
      <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <circle cx="34" cy="34" r="18" stroke={colors.accent} strokeWidth="3.5" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <line x1="47" y1="47" x2="62" y2="62" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      </svg>
    );
    if (idx === 1) return (
      <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <path d="M40 20 L40 60 Q30 56 16 58 L16 18 Q30 16 40 20 Z" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
        <path d="M40 20 L40 60 Q50 56 64 58 L64 18 Q50 16 40 20 Z" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      </svg>
    );
    return (
      <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <path d="M46 8 L22 42 L36 42 L30 72 L58 34 L44 34 Z" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      </svg>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, opacity: fadeOut }}>
      <Sequence from={5} durationInFrames={25}><Audio src={AUDIO.softClick} volume={0.5} /></Sequence>
      <Sequence from={20} durationInFrames={30}><Audio src={AUDIO.whoosh} volume={0.45} /></Sequence>
      {[50, 58, 66, 74, 82, 90, 98].map((f, i) => (
        <Sequence key={i} from={f} durationInFrames={12}><Audio src={AUDIO.tick} volume={0.35} /></Sequence>
      ))}
      <Sequence from={104} durationInFrames={20}><Audio src={AUDIO.ding} volume={0.5} /></Sequence>
      {[130, 155, 175].map((f, i) => (
        <Sequence key={`pop-${i}`} from={f} durationInFrames={25}><Audio src={AUDIO.tinyPop} volume={0.4 + i * 0.02} /></Sequence>
      ))}
      <Sequence from={195} durationInFrames={30}><Audio src={AUDIO.satisfyingFill} volume={0.45} /></Sequence>
      <Sequence from={275} durationInFrames={25}><Audio src={AUDIO.whoushOut} volume={0.4} /></Sequence>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
        {/* Prompt badge */}
        <div style={{ position: "absolute", top: 180, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 28px", borderRadius: 50, border: `2px solid ${colors.accent}`, backgroundColor: `${colors.accent}15` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L4 5" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="19" x2="20" y2="19" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 28, fontWeight: 700, color: colors.accent, fontFamily: "'Inter', 'Noto Sans TC', sans-serif", letterSpacing: 2 }}>Prompt</span>
          </div>
        </div>

        {/* Terminal box */}
        <div style={{ position: "absolute", top: 310, opacity: boxOpacity, transform: `translateY(${boxSlideY}px) scale(${1 + idlePulse})` }}>
          <div style={{ width: 1400, borderRadius: 16, border: `1.5px solid ${colors.accent}40`, backgroundColor: "rgba(255, 255, 255, 0.04)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: `1px solid ${colors.accent}20`, backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c }} />)}
              <span style={{ fontSize: 14, color: colors.dimmed, fontFamily: "'Inter', sans-serif", marginLeft: 16, opacity: 0.6 }}>Claude Code</span>
            </div>
            <div style={{ padding: "36px 40px", minHeight: 160, display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
              <span style={{ fontSize: 42, fontWeight: 600, color: colors.accent, fontFamily: "'Inter', 'Noto Sans TC', sans-serif", marginRight: 16, lineHeight: 1.6 }}>&gt;</span>
              <div style={{ display: "inline", flex: 1, lineHeight: 1.6 }}>
                {visibleGroups.map((group, idx) => {
                  const groupFade = interpolate(frame, [group.startFrame, group.startFrame + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const isHighlighted = group.color !== "#FFFFFF";
                  return (
                    <span key={idx} style={{ fontSize: 42, fontWeight: isHighlighted ? 700 : 500, color: group.color, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", opacity: groupFade, textShadow: isHighlighted ? `0 0 12px ${group.color}60` : "none" }}>
                      {group.text}
                    </span>
                  );
                })}
                {cursorVisible && <span style={{ display: "inline-block", width: 3, height: 42, backgroundColor: colors.accent, marginLeft: 2, verticalAlign: "middle", opacity: cursorBlink }} />}
              </div>
            </div>
          </div>
        </div>

        {/* Action icons */}
        {frame >= 128 && (
          <>
            {lineProgress > 0 && (
              <svg style={{ position: "absolute", width: 1920, height: 1080, left: 0, top: 0, pointerEvents: "none" }}>
                <line x1={ACTION-X_POSITIONS[0]} y1={ACTION-Y} x2={ACTION-X_POSITIONS[0] + (ACTION-X_POSITIONS[2] - ACTION-X_POSITIONS[0]) * lineProgress} y2={ACTION-Y} stroke={colors.accent} strokeWidth="2" strokeLinecap="round" opacity={0.3 + lineGlow * 0.4} />
              </svg>
            )}
            {ACTION-ITEMS.map((item, idx) => {
              const anim = actionAnimations[idx];
              return (
                <div key={idx} style={{ position: "absolute", left: ACTION-X_POSITIONS[idx] - 60, top: ACTION-Y - 60, width: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: anim.opacity, transform: `scale(${anim.scale + idlePulse})` }}>
                  {renderIcon(idx, anim.strokeProgress)}
                  <span style={{ fontSize: 24, fontWeight: 500, color: colors.dimmed, fontFamily: "'Noto Sans TC', 'Inter', sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
                </div>
              );
            })}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PROMPT-SKILL-DURATION-FRAMES = 300;