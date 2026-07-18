import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const PHASE-FRAMES = 40;
const PARTICLE-COUNT = 40;
const PARTICLE-COLORS = [
  "#ff4d4d", "#ff9500", "#ffdd00", "#44ff88",
  "#00cfff", "#a855f7", "#ff69b4", "#ffffff",
];

interface ParticleProps {
  index: number;
  frame: number;
  origin: { x: number; y: number };
}

const Particle: React.FC<ParticleProps> = ({ index, frame, origin }) => {
  const seed = (index * 137.508) % 1;
  const angle = (index / PARTICLE-COUNT) * 2 * Math.PI + seed * 0.5;
  const speed = 180 + seed * 220;
  const color = PARTICLE-COLORS[index % PARTICLE-COLORS.length];
  const size = 8 + seed * 14;

  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed - 200;
  const gravity = 400;

  const t = frame / 30;
  const x = origin.x + vx * t;
  const y = origin.y + vy * t + 0.5 * gravity * t * t;

  const opacity = interpolate(frame, [0, 10, 40], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 5, 40], [0, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <circle
      cx={x}
      cy={y}
      r={size * scale}
      fill={color}
      opacity={opacity}
      style={{ filter: `blur(${1 - scale}px)` }}
    />
  );
};

export const CountdownFirework: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const phase = Math.min(3, Math.floor(frame / PHASE-FRAMES));
  const phaseFrame = frame - phase * PHASE-FRAMES;

  const numbers = ["3", "2", "1", "GO!"];
  const bgColors = ["#0a0a1a", "#0a0a1a", "#0a0a1a", "#ff4d00"];
  const digitColors = ["#ffdd00", "#ff9500", "#ff4d4d", "#ffffff"];

  const currentNum = numbers[phase];
  const currentColor = digitColors[phase];
  const bgColor = bgColors[phase];

  const scaleSpring = spring({
    frame: phaseFrame,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.6 },
  });
  const scaleIn = interpolate(scaleSpring, [0, 1], [2.5, 1], {
    extrapolateRight: "clamp",
  });

  const exitScale = phaseFrame > PHASE-FRAMES - 10
    ? interpolate(phaseFrame, [PHASE-FRAMES - 10, PHASE-FRAMES], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 1;

  const finalScale = scaleIn * exitScale;

  const opacity = interpolate(
    phaseFrame,
    [0, 3, PHASE-FRAMES - 8, PHASE-FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isGoPhase = phase === 3;
  const fireworkFrame = isGoPhase ? phaseFrame : 0;

  const flashOpacity = isGoPhase
    ? interpolate(phaseFrame, [0, 5, 15], [0.8, 0.4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const shockwaves = [0, 8, 16];

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {isGoPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(255, 200, 0, ${flashOpacity})`,
            zIndex: 1,
          }}
        />
      )}

      {shockwaves.map((delay) => {
        const swFrame = Math.max(0, phaseFrame - delay);
        const swScale = interpolate(swFrame, [0, 30], [0, 3], {
          extrapolateRight: "clamp",
        });
        const swOpacity = interpolate(swFrame, [0, 5, 30], [0, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={delay}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `4px solid ${currentColor}`,
              transform: `scale(${swScale})`,
              opacity: swOpacity,
              zIndex: 2,
            }}
          />
        );
      })}

      {isGoPhase && (
        <svg
          style={{ position: "absolute", inset: 0, zIndex: 3 }}
          width={width}
          height={height}
        >
          {Array.from({ length: PARTICLE-COUNT }).map((_, i) => (
            <Particle key={i} index={i} frame={fireworkFrame} origin={{ x: width / 2, y: height / 2 }} />
          ))}
          {Array.from({ length: PARTICLE-COUNT }).map((_, i) => (
            <Particle key={`b${i}`} index={i + PARTICLE-COUNT} frame={Math.max(0, fireworkFrame - 8)} origin={{ x: width / 2 - 100, y: height / 2 - 80 }} />
          ))}
          {Array.from({ length: PARTICLE-COUNT }).map((_, i) => (
            <Particle key={`c${i}`} index={i + PARTICLE-COUNT * 2} frame={Math.max(0, fireworkFrame - 16)} origin={{ x: width / 2 + 100, y: height / 2 - 80 }} />
          ))}
        </svg>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          fontSize: phase === 3 ? 200 : 280,
          fontWeight: 900,
          color: currentColor,
          fontFamily: "sans-serif",
          textAlign: "center",
          opacity,
          transform: `scale(${finalScale})`,
          textShadow: `0 0 60px ${currentColor}, 0 0 120px ${currentColor}80`,
          lineHeight: 1,
        }}
      >
        {currentNum}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          display: "flex",
          gap: 20,
          zIndex: 10,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: i < phase ? digitColors[i] : "rgba(255,255,255,0.2)",
              boxShadow: i < phase ? `0 0 10px ${digitColors[i]}` : "none",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};