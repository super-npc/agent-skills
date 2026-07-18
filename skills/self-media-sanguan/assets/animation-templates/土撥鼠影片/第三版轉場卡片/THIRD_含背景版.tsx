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
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

export const THIRD-VERSION-DURATION-FRAMES = 120;

export const Scene75-ThirdVersion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 130 },
  });
  const numberScale = interpolate(numberSpring, [0, 1], [0.2, 1]);
  const numberOpacity = interpolate(numberSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ringSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 90 },
  });
  const ringScale = interpolate(ringSpring, [0, 1], [0.4, 1]);
  const ringOpacity = interpolate(ringSpring, [0, 0.5], [0, 0.35], {
    extrapolateRight: "clamp",
  });

  const textSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 120 },
  });
  const textTranslateY = interpolate(textSpring, [0, 1], [30, 0]);
  const textOpacity = interpolate(textSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const eyeSpring = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 140 },
  });
  const eyeScale = interpolate(eyeSpring, [0, 1], [0, 1]);
  const eyeOpacity = interpolate(eyeSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const sparkleBase = frame > 50 ? frame - 50 : 0;

  const fadeOut = interpolate(frame, [95, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.04, 0.1]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accentSecondary}18 0%, transparent 65%)`,
          transform: "translate(-50%, -50%)",
          opacity: glowPulse * fadeOut * 10,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut,
          gap: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: ringOpacity * fadeOut,
            transform: `scale(${ringScale})`,
          }}
        >
          <svg width="510" height="510" viewBox="0 0 340 340">
            <defs>
              <linearGradient id="s75RingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors.accentSecondary} stopOpacity={0.6} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <circle cx="170" cy="170" r="155" fill="none" stroke="url(#s75RingGrad)" strokeWidth="2" strokeDasharray="12 8" />
            <circle cx="170" cy="170" r="138" fill="none" stroke={colors.accentSecondary} strokeWidth="1" opacity={0.15} />
          </svg>
        </div>

        <div
          style={{
            transform: `scale(${numberScale})`,
            opacity: numberOpacity,
            marginBottom: 0,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 420,
              fontWeight: 900,
              fontFamily: fonts.main,
              background: `linear-gradient(135deg, ${colors.accentSecondary} 0%, #8B5CF6 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 40px ${colors.accentSecondary}60)`,
              display: "block",
              lineHeight: 1,
            }}
          >
            3
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginTop: 12,
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 78,
              fontWeight: 700,
              fontFamily: fonts.main,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: 6,
            }}
          >
            第三版
          </span>

          <div
            style={{
              transform: `scale(${eyeScale})`,
              opacity: eyeOpacity,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="72" height="72" viewBox="0 0 48 48">
              <defs>
                <linearGradient id="s75EyeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={colors.accentSecondary} />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path d="M4 24 C10 12, 38 12, 44 24 C38 36, 10 36, 4 24 Z" fill="none" stroke="url(#s75EyeGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="24" r="7" fill="url(#s75EyeGrad)" opacity={0.9} />
              <circle cx="24" cy="24" r="3.5" fill={colors.background} />
              <circle cx="27" cy="21" r="1.5" fill="white" opacity={0.7} />
            </svg>
          </div>
        </div>

        {sparkleBase > 0 && (
          <div style={{ marginTop: 42, opacity: textOpacity * 0.7 }}>
            <svg width="360" height="30" viewBox="0 0 240 20">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const sparkleOp = interpolate(
                  Math.sin(sparkleBase * 0.1 + i * 1.1),
                  [-1, 1],
                  [0.15, 0.75]
                );
                const isAccent = i % 2 === 0;
                return (
                  <circle
                    key={i}
                    cx={20 + i * 40}
                    cy={10}
                    r={isAccent ? 3 : 2}
                    fill={isAccent ? colors.accentSecondary : "#8B5CF6"}
                    opacity={sparkleOp}
                  />
                );
              })}
            </svg>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};