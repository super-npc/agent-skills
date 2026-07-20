import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };
const warmAccent = "#FFB547";
const warmDeep = "#E8943A";
const warmDim = "rgba(255,181,71,0.15)";

export const MAGAZINE-STYLE-DURATION-FRAMES = 180;

export const Scene77-MagazineStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, mass: 0.6, stiffness: 100 } });
  const browserScale = interpolate(browserSpring, [0, 1], [0.4, 1]);
  const browserOpacity = interpolate(browserSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const makeStagger = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const leftHeroOpacity = makeStagger(60);
  const leftTitleOpacity = makeStagger(72);
  const leftBodyOpacity = makeStagger(82);
  const rightHeadOpacity = makeStagger(70);
  const rightPullOpacity = makeStagger(86);
  const rightBodyOpacity = makeStagger(105);

  const badgeSpring = spring({ frame: Math.max(0, frame - 132), fps, config: { damping: 10, mass: 0.5, stiffness: 130 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [155, 178], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          opacity: fadeOut,
        }}
      >
        <div style={{ opacity: browserOpacity, transform: `scale(${browserScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="1290" height="810" viewBox="0 0 860 540">
            <defs>
              <linearGradient id="msPageLeft" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F5EDD8" />
                <stop offset="100%" stopColor="#EDE0C4" />
              </linearGradient>
              <linearGradient id="msPageRight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EDE0C4" />
                <stop offset="100%" stopColor="#E8D9B8" />
              </linearGradient>
              <linearGradient id="msSpineFold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
                <stop offset="50%" stopColor="rgba(0,0,0,0.06)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="860" height="540" rx="14" fill="#1A1E28" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <rect x="0" y="0" width="860" height="28" rx="14" fill="#252931" />
            <circle cx="20" cy="14" r="5" fill="#FF5F57" opacity={0.8} />
            <circle cx="36" cy="14" r="5" fill="#FFBD2E" opacity={0.8} />
            <circle cx="52" cy="14" r="5" fill="#28CA41" opacity={0.8} />
            <rect x="60" y="44" width="360" height="480" fill="url(#msPageLeft)" />
            <rect x="420" y="44" width="360" height="480" fill="url(#msPageRight)" />
            <rect x="416" y="44" width="8" height="480" fill="url(#msSpineFold)" />
            <rect x="419" y="44" width="2" height="480" fill="rgba(255,255,255,0.25)" />
            <rect x="80" y="54" width="320" height="18" fill={warmAccent} opacity={0.9} />
            <text x="240" y="67" textAnchor="middle" fontSize="9" fontFamily={fonts.main} fill="#2A1A00" fontWeight="700" letterSpacing="4">DESIGN QUARTERLY · ISSUE 12</text>
            <rect x="80" y="82" width="320" height="180" fill="rgba(255,181,71,0.15)" stroke={`${warmAccent}40`} strokeWidth="1" opacity={leftHeroOpacity} />
            <text x="240" y="180" textAnchor="middle" fontSize="13" fontFamily={fonts.main} fill={`${warmAccent}60`} fontWeight="600" opacity={leftHeroOpacity}>HERO IMAGE</text>
            <text x="80" y="292" fontSize="18" fontFamily={fonts.main} fill="#1A0F00" fontWeight="800" opacity={leftTitleOpacity}>設計的藝術</text>
            <text x="80" y="312" fontSize="13" fontFamily={fonts.main} fill={warmDeep} fontWeight="600" opacity={leftTitleOpacity}>The Art of Web Design</text>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x="80" y={338 + i * 14} width={i % 3 === 2 ? 240 : 310} height="5" rx="2" fill="rgba(0,0,0,0.18)" opacity={leftBodyOpacity * (1 - i * 0.04)} />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x="440" y={82 + i * 15} width={i % 4 === 3 ? 260 : 310} height="6" rx="2" fill="rgba(0,0,0,0.18)" opacity={rightHeadOpacity * (1 - i * 0.03)} />
            ))}
            <rect x="440" y="180" width="320" height="80" fill={warmDim} stroke={`${warmAccent}50`} strokeWidth="1.5" rx="4" opacity={rightPullOpacity} />
            <text x="458" y="210" fontSize="12" fontFamily={fonts.main} fill={warmDeep} fontWeight="700" fontStyle="italic" opacity={rightPullOpacity}>「像翻書一樣的瀏覽體驗」</text>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="440" y={398 + i * 14} width={i % 3 === 1 ? 280 : 310} height="5" rx="2" fill="rgba(0,0,0,0.16)" opacity={rightBodyOpacity * (1 - i * 0.04)} />
            ))}
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 90, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              right: -200,
              top: "50%",
              transform: `translateY(-50%) scale(${badgeScale})`,
              opacity: badgeOpacity,
              background: `linear-gradient(135deg, ${warmDeep}, ${warmAccent})`,
              borderRadius: 40,
              padding: "12px 28px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: `0 4px 24px ${warmAccent}40`,
            }}
          >
            <span style={{ fontSize: 39, fontWeight: 800, fontFamily: fonts.main, color: "#1A0F00", letterSpacing: 2, whiteSpace: "nowrap" }}>
              閱讀式體驗
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};