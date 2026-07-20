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
  warning: "#FFB547",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const NARRATIVE-REDESIGN-DURATION-FRAMES = 180;

export const Scene76-NarrativeRedesign: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bookSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 9, mass: 0.5, stiffness: 130 },
  });
  const bookScale = interpolate(bookSpring, [0, 1], [0.3, 1]);
  const bookOpacity = interpolate(bookSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textLineProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bookGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [6, 18]);

  const arrowProgress = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const siteSpring = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 110 },
  });
  const siteScale = interpolate(siteSpring, [0, 1], [0.5, 1]);
  const siteOpacity = interpolate(siteSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 8, mass: 0.4, stiffness: 150 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [155, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showBook = frame < 85;
  const showSite = frame >= 70;

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut,
        }}
      >
        {showBook && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
              opacity: bookOpacity * (frame >= 75 ? 1 - siteOpacity : 1),
              transform: `scale(${bookScale})`,
            }}
          >
            <div
              style={{
                borderRadius: 16,
                border: `2.5px solid ${colors.warning}50`,
                boxShadow: `0 0 ${bookGlow}px ${colors.warning}40`,
                padding: 6,
              }}
            >
              <svg width="390" height="330" viewBox="0 0 260 220">
                <defs>
                  <linearGradient id="nvBookGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={colors.warning} stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="240" height="200" rx="12" fill="url(#nvBookGrad)" stroke={`${colors.warning}30`} strokeWidth="1.5" />
                <rect x="125" y="10" width="10" height="200" rx="2" fill={colors.warning} opacity={0.5} />
                {[0, 1, 2, 3, 4].map((i) => {
                  const lineOpacity = interpolate(textLineProgress, [i * 0.18, Math.min(1, i * 0.18 + 0.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <rect key={i} x={22} y={35 + i * 30} width={i === 0 ? 80 * lineOpacity : 70} height={i === 0 ? 8 : 5} rx={i === 0 ? 3 : 2} fill={i === 0 ? colors.warning : "rgba(255,255,255,0.3)"} opacity={lineOpacity} />
                  );
                })}
                <circle cx="196" cy="170" r="24" fill={`${colors.warning}15`} stroke={`${colors.warning}40`} strokeWidth="1.5" />
                <path d="M185 180 Q196 158 207 162 Q200 172 196 182 Z" fill={colors.warning} opacity={0.7} />
              </svg>
            </div>
            <span style={{ fontSize: 45, fontWeight: 600, fontFamily: fonts.main, color: `${colors.warning}99`, letterSpacing: 2 }}>
              敘事邏輯
            </span>
          </div>
        )}

        {arrowProgress > 0 && arrowProgress < 1 && (
          <div style={{ position: "absolute", display: "flex", alignItems: "center", opacity: interpolate(arrowProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]) }}>
            <svg width="240" height="90" viewBox="0 0 160 60">
              <line x1="10" y1="30" x2={10 + arrowProgress * 120} y2="30" stroke={colors.warning} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
              {arrowProgress > 0.7 && <path d="M130 22 L148 30 L130 38" fill="none" stroke={colors.warning} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(arrowProgress, [0.7, 1], [0, 1])} />}
            </svg>
          </div>
        )}

        {showSite && siteOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 39,
              opacity: siteOpacity,
              transform: `scale(${siteScale})`,
            }}
          >
            <div style={{ borderRadius: 16, border: `2px solid ${colors.warning}35`, padding: 4 }}>
              <svg width="750" height="540" viewBox="0 0 500 360">
                <rect x="0" y="0" width="500" height="360" rx="12" fill="#0D1117" stroke={`${colors.warning}20`} strokeWidth="1.5" />
                <rect x="0" y="0" width="500" height="26" rx="12" fill="rgba(255,255,255,0.04)" />
                <circle cx="16" cy="13" r="4.5" fill="#FF5F57" opacity={0.6} />
                <circle cx="31" cy="13" r="4.5" fill="#FFBD2E" opacity={0.6} />
                <circle cx="46" cy="13" r="4.5" fill="#28CA41" opacity={0.6} />
                <rect x="70" y="7" width="360" height="12" rx="6" fill="rgba(255,255,255,0.05)" />
                <rect x="0" y="26" width="500" height="78" fill={colors.warning} opacity={0.08} />
                <rect x="130" y="50" width="240" height="16" rx="5" fill={colors.warning} opacity={0.6} />
                <rect x="160" y="72" width="180" height="9" rx="3" fill="rgba(255,255,255,0.18)" />
                <rect x="205" y="88" width="90" height="12" rx="6" fill={colors.warning} opacity={0.4} />
                <rect x="0" y="104" width="500" height="3" fill={`${colors.warning}20`} />
                <rect x="18" y="125" width="215" height="10" rx="3" fill="rgba(255,255,255,0.12)" />
                <rect x="18" y="141" width="195" height="7" rx="3" fill="rgba(255,255,255,0.07)" />
                <rect x="0" y="182" width="500" height="3" fill={`${colors.warning}20`} />
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <rect x={18 + i * 162} y={205} width="148" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke={`${colors.warning}18`} strokeWidth="1" />
                    <circle cx={42 + i * 162} cy={225} r="10" fill={colors.warning} opacity={0.35} />
                    <text x={42 + i * 162} y={229} textAnchor="middle" fontSize="9" fontFamily={fonts.main} fill={colors.warning} fontWeight="700">{i + 1}</text>
                  </g>
                ))}
              </svg>
            </div>

            {badgeOpacity > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 21, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
                <span style={{ fontSize: 54, fontWeight: 700, fontFamily: fonts.main, color: colors.warning, letterSpacing: 3 }}>
                  敘事式設計
                </span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};