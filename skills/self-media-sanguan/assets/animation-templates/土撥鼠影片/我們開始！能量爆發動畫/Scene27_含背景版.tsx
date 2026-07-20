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

const GREEN = "#00D4AA";
const BLUE = "#4DA3FF";
const TEXT-COLOR = "#FFFFFF";
const FONT-FAMILY = "'Noto Sans TC', 'Inter', sans-serif";
const BACKGROUND = "#0B0F17";

const AUDIO = {
  softClick: staticFile("audio/connection/soft-click.wav"),
  whooshOut: staticFile("audio/connection/whoosh-out.mp3"),
  ding: staticFile("audio/connection/ding.mp3"),
  microRiser: staticFile("audio/connection/micro-riser.mp3"),
  softImpact: staticFile("audio/connection/soft-impact.wav"),
  satisfyingFill: staticFile("audio/connection/satisfying-fill.wav"),
};

const PlayIcon: React.FC<{ size?: number; strokeProgress?: number; fillOpacity?: number; glowIntensity?: number }> = ({
  size = 120, strokeProgress = 1, fillOpacity = 0.15, glowIntensity = 0,
}) => {
  const totalLen = 400;
  const dashOffset = totalLen * (1 - strokeProgress);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ filter: glowIntensity > 0 ? `drop-shadow(0 0 ${8 + glowIntensity * 18}px ${GREEN}90)` : "none" }}>
      <circle cx="60" cy="60" r="52" stroke={GREEN} strokeWidth="3.5" fill={GREEN} fillOpacity={fillOpacity * strokeProgress} strokeLinecap="round" strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
      <path d="M46 34 L46 86 L90 60 Z" stroke={TEXT-COLOR} strokeWidth="3" strokeLinejoin="round" fill={TEXT-COLOR} fillOpacity={strokeProgress * 0.9} strokeDasharray={totalLen} strokeDashoffset={dashOffset} />
    </svg>
  );
};

const Sparkle: React.FC<{ x: number; y: number; size?: number; opacity?: number; rotation?: number; color?: string }> = ({
  x, y, size = 20, opacity = 1, rotation = 0, color = GREEN,
}) => (
  <svg style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `rotate(${rotation}deg)`, pointerEvents: "none" }} width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" fill={color} opacity={opacity} />
  </svg>
);

const EnergyRay: React.FC<{ angle: number; innerRadius: number; outerRadius: number; progress: number; color?: string; width?: number }> = ({
  angle, innerRadius, outerRadius, progress, color = GREEN, width = 2.5,
}) => {
  const rad = (angle * Math.PI) / 180;
  const cx = 960, cy = 540;
  const x1 = cx + Math.cos(rad) * innerRadius, y1 = cy + Math.sin(rad) * innerRadius;
  const x2 = cx + Math.cos(rad) * outerRadius, y2 = cy + Math.sin(rad) * outerRadius;
  const lineLen = outerRadius - innerRadius;
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - progress)} opacity={progress * 0.7} />;
};

export const Scene27-LetsStart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CENTER-X = 960, CENTER-Y = 540;

  const pulseRingRadius = interpolate(frame, [0, 15], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseRingOpacity = interpolate(frame, [0, 5, 12, 15], [0, 0.6, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseRing2Radius = interpolate(frame, [4, 18], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseRing2Opacity = interpolate(frame, [4, 8, 15, 18], [0, 0.4, 0.2, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const playSpring = spring({ frame: frame - 15, fps, config: { damping: 8, mass: 0.6, stiffness: 200 } });
  const playScale = interpolate(playSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const playOpacity = interpolate(frame, [15, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const playStroke = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textSpring = spring({ frame: frame - 20, fps, config: { damping: 9, mass: 0.7, stiffness: 180 } });
  const textScale = interpolate(textSpring, [0, 1], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(textSpring, [0, 1], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const burstProgress = interpolate(frame, [22, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burstFade = interpolate(frame, [35, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const energyRays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => ({
    angle, inner: 100 + (i % 3) * 5, outer: 200 + (i % 2) * 10,
  }));

  const impactRingRadius = interpolate(frame, [22, 50], [60, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const impactRingOpacity = interpolate(frame, [22, 30, 45, 50], [0, 0.5, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const revealSparkles = [
    { angle: -30, dist: 180, delay: 25, size: 24 },
    { angle: 45, dist: 200, delay: 30, size: 20 },
    { angle: 135, dist: 190, delay: 35, size: 22 },
    { angle: -135, dist: 175, delay: 28, size: 18 },
    { angle: 80, dist: 220, delay: 33, size: 16 },
    { angle: -80, dist: 210, delay: 38, size: 20 },
  ];

  const isHoldPhase = frame >= 60 && frame < 120;

  const textGlow = isHoldPhase ? 0.3 + 0.35 * Math.sin(((frame - 60) / 25) * Math.PI * 2) : 0;
  const playGlow = isHoldPhase ? 0.2 + 0.3 * Math.sin(((frame - 60 + 10) / 25) * Math.PI * 2) : 0;
  const playFloat = isHoldPhase ? Math.sin(((frame - 60) / 30) * Math.PI * 2) * 5 : 0;

  const ringRotation = frame >= 30 ? (frame - 30) * 0.8 : 0;
  const ringOpacity = isHoldPhase ? 0.15 + 0.1 * Math.sin(((frame - 60) / 35) * Math.PI * 2) : 0;

  const idleSparkles = [
    { angle: 0, dist: 250, phase: 0, size: 18 },
    { angle: 90, dist: 260, phase: 15, size: 14 },
    { angle: 180, dist: 240, phase: 30, size: 16 },
    { angle: 270, dist: 255, phase: 45, size: 12 },
  ];

  const globalFadeOut = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scaleOut = interpolate(frame, [120, 145], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const contentVisible = frame >= 15;

  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND, opacity: globalFadeOut }}>
      <Sequence from={0} durationInFrames={25}><Audio src={AUDIO.microRiser} volume={0.5} /></Sequence>
      <Sequence from={20} durationInFrames={40}><Audio src={AUDIO.ding} volume={0.55} /></Sequence>
      <Sequence from={15} durationInFrames={20}><Audio src={AUDIO.softImpact} volume={0.4} /></Sequence>
      <Sequence from={60} durationInFrames={40}><Audio src={AUDIO.satisfyingFill} volume={0.3} /></Sequence>
      <Sequence from={120} durationInFrames={30}><Audio src={AUDIO.whooshOut} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${scaleOut})` }}>
        {frame < 20 && (
          <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }} viewBox="0 0 1920 1080" fill="none">
            <circle cx={CENTER-X} cy={CENTER-Y} r={pulseRingRadius} stroke={GREEN} strokeWidth="3" fill="none" opacity={pulseRingOpacity} />
            <circle cx={CENTER-X} cy={CENTER-Y} r={pulseRing2Radius} stroke={BLUE} strokeWidth="2" fill="none" opacity={pulseRing2Opacity} />
          </svg>
        )}

        {contentVisible && (
          <>
            {frame >= 22 && frame < 55 && (
              <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }} viewBox="0 0 1920 1080" fill="none">
                <circle cx={CENTER-X} cy={CENTER-Y} r={impactRingRadius} stroke={GREEN} strokeWidth="2.5" fill="none" opacity={impactRingOpacity} />
              </svg>
            )}

            {frame >= 22 && frame < 58 && (
              <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }} viewBox="0 0 1920 1080" fill="none">
                {energyRays.map((ray, i) => (
                  <EnergyRay key={i} angle={ray.angle} innerRadius={ray.inner} outerRadius={ray.outer} progress={burstProgress * burstFade} color={i % 3 === 0 ? GREEN : i % 3 === 1 ? BLUE : TEXT-COLOR} width={i % 2 === 0 ? 2.5 : 1.5} />
                ))}
              </svg>
            )}

            {frame >= 30 && (
              <svg style={{ position: "absolute", left: CENTER-X - 200, top: CENTER-Y - 200, width: 400, height: 400, pointerEvents: "none", transform: `rotate(${ringRotation}deg)` }} viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="180" stroke={GREEN} strokeWidth="1.5" fill="none" opacity={ringOpacity} strokeDasharray="12 18" />
                <circle cx="200" cy="200" r="155" stroke={BLUE} strokeWidth="1" fill="none" opacity={ringOpacity * 0.6} strokeDasharray="8 24" />
              </svg>
            )}

            <div style={{ position: "absolute", left: CENTER-X - 50, top: CENTER-Y - 160 + playFloat, transform: `scale(${playScale})`, opacity: playOpacity }}>
              <PlayIcon size={100} strokeProgress={playStroke} fillOpacity={0.15} glowIntensity={playGlow} />
            </div>

            <div style={{ position: "absolute", left: 0, right: 0, top: CENTER-Y - 20, textAlign: "center", opacity: textOpacity, transform: `scale(${textScale}) translateY(${textY}px)` }}>
              <span style={{ fontSize: 88, fontWeight: 800, fontFamily: FONT-FAMILY, color: TEXT-COLOR, letterSpacing: 12, textShadow: textGlow > 0 ? `0 0 ${20 + textGlow * 40}px ${GREEN}80` : "none" }}>
                我們開始
              </span>
            </div>

            {revealSparkles.map((sp, i) => {
              if (frame < sp.delay) return null;
              const elapsed = frame - sp.delay;
              const spOpacity = interpolate(elapsed, [0, 5, 20, 35], [0, 1, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (spOpacity <= 0) return null;
              const rad = (sp.angle * Math.PI) / 180;
              const expandDist = sp.dist + elapsed * 1.5;
              return <Sparkle key={`reveal-${i}`} x={CENTER-X + Math.cos(rad) * expandDist} y={CENTER-Y + Math.sin(rad) * expandDist} size={sp.size} opacity={spOpacity} rotation={elapsed * 5} color={i % 2 === 0 ? GREEN : BLUE} />;
            })}

            {isHoldPhase && idleSparkles.map((sp, i) => {
              const elapsed = frame - 60;
              const currentAngle = sp.angle + elapsed * 1.2 + sp.phase;
              const rad = (currentAngle * Math.PI) / 180;
              const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(((elapsed + sp.phase) / 15) * Math.PI));
              return <Sparkle key={`idle-${i}`} x={CENTER-X + Math.cos(rad) * sp.dist} y={CENTER-Y + Math.sin(rad) * sp.dist} size={sp.size} opacity={twinkle} rotation={elapsed * 3 + i * 45} color={i % 2 === 0 ? GREEN : BLUE} />;
            })}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LETS-START-DURATION-FRAMES = 150;