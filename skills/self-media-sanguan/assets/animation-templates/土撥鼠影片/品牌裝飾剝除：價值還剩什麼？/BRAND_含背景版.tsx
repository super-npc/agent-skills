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
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const decFade = (frame: number, startOut: number, endOut: number): number =>
  interpolate(frame, [startOut, endOut], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const BRAND-VALUE-LEFT-DURATION-FRAMES = 210;

export const Scene78-BrandValueLeft: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, mass: 0.6, stiffness: 100 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.25, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  const deco0 = decFade(frame, 65, 76);
  const deco1 = decFade(frame, 70, 80);
  const deco2 = decFade(frame, 74, 85);
  const deco3 = decFade(frame, 79, 90);
  const deco4 = decFade(frame, 83, 93);
  const deco5 = decFade(frame, 87, 98);
  const deco6 = decFade(frame, 91, 102);
  const deco7 = decFade(frame, 95, 106);
  const deco8 = decFade(frame, 99, 110);

  const phase12Opacity = interpolate(frame, [105, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coreOpacity = interpolate(frame, [108, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const qSpring = spring({ frame: Math.max(0, frame - 118), fps, config: { damping: 14, mass: 0.8, stiffness: 90 } });
  const qScale = interpolate(qSpring, [0, 1], [0, 1]);
  const qOpacity = interpolate(qSpring, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [148, 168], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qPulse = frame > 130 ? interpolate(Math.sin((frame - 130) * 0.05), [-1, 1], [0.88, 1.0]) : 1;
  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        {phase12Opacity > 0 && (
          <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", opacity: cardOpacity * phase12Opacity, transform: `scale(${cardScale})` }}>
            <svg width="840" height="600" viewBox="0 0 560 400">
              <defs>
                <linearGradient id="bvlCardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6B48FF" stopOpacity="0.55" />
                  <stop offset="50%" stopColor={colors.accentSecondary} stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF6BAA" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="bvlBorderGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6B48FF" />
                  <stop offset="50%" stopColor={colors.accentSecondary} />
                  <stop offset="100%" stopColor="#FF6BAA" />
                </linearGradient>
              </defs>
              <circle cx="280" cy="200" r="188" fill="none" stroke="url(#bvlBorderGrad)" strokeWidth="1.5" strokeDasharray="6 4" opacity={deco8 * 0.55} />
              <rect x="60" y="80" width="440" height="240" rx="20" fill="#0D1420" />
              <rect x="60" y="80" width="440" height="240" rx="20" fill="url(#bvlCardGrad)" opacity={deco1} />
              <rect x="60" y="80" width="440" height="240" rx="20" fill="none" stroke="url(#bvlBorderGrad)" strokeWidth="3" opacity={deco2} />
              <circle cx="280" cy="178" r="30" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
              <text x="280" y="188" fontSize="28" fontFamily={fonts.main} fill="rgba(255,255,255,0.75)" textAnchor="middle" fontWeight="700">B</text>
              <text x="280" y="230" fontSize="18" fontFamily={fonts.main} fill="rgba(255,255,255,0.55)" textAnchor="middle" fontWeight="400" letterSpacing="4">BRAND</text>
              {[{ cx: 60, cy: 80 }, { cx: 500, cy: 80 }, { cx: 60, cy: 320 }, { cx: 500, cy: 320 }].map((pos, i) => (
                <g key={i} transform={`translate(${pos.cx}, ${pos.cy})`} opacity={deco3}>
                  <rect x="-8" y="-8" width="16" height="16" rx="2" fill="none" stroke="url(#bvlBorderGrad)" strokeWidth="1.5" transform="rotate(45)" />
                  <circle cx="0" cy="0" r="2.5" fill={colors.accentSecondary} opacity={0.7} />
                </g>
              ))}
              <g opacity={deco5}>
                <rect x="86" y="252" width="110" height="22" rx="11" fill="rgba(107,72,255,0.35)" stroke="rgba(107,72,255,0.6)" strokeWidth="1" />
                <text x="141" y="267" fontSize="10" fontFamily={fonts.main} fill="rgba(255,255,255,0.85)" textAnchor="middle" fontWeight="600">PREMIUM</text>
              </g>
              <g opacity={deco7} transform={`translate(280, 340)`}>
                <circle cx="0" cy="0" r="4" fill={colors.accentSecondary} opacity={0.7} />
              </g>
            </svg>
          </div>
        )}

        {coreOpacity > 0 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, opacity: coreOpacity }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 270, height: 180, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", marginBottom: 72 }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 15 }}>
                <span style={{ fontSize: 33, fontWeight: 700, fontFamily: fonts.main, color: "rgba(255,255,255,0.55)" }}>B</span>
              </div>
              <span style={{ fontSize: 19, fontWeight: 400, fontFamily: fonts.main, color: "rgba(255,255,255,0.35)", letterSpacing: 4 }}>品牌</span>
            </div>

            {qOpacity > 0 && (
              <div style={{ opacity: qOpacity, transform: `scale(${qScale * qPulse})`, marginBottom: 42 }}>
                <span style={{ fontSize: 165, fontWeight: 300, fontFamily: fonts.main, color: "rgba(255,255,255,0.22)", lineHeight: 1, display: "block" }}>？</span>
              </div>
            )}

            {subtitleOpacity > 0 && (
              <div style={{ opacity: subtitleOpacity * 0.75, display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
                <span style={{ fontSize: 42, fontWeight: 400, fontFamily: fonts.main, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>價值還剩什麼？</span>
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};