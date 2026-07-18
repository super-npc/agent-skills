import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TOTAL-SECONDS = 10;
const RADIUS = 200;
const STROKE-WIDTH = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CountdownCircle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalFrames = durationInFrames;
  const elapsedSeconds = Math.floor((frame / totalFrames) * TOTAL-SECONDS);
  const currentDisplay = Math.max(0, TOTAL-SECONDS - elapsedSeconds);

  const progress = frame / totalFrames;
  const dashOffset = CIRCUMFERENCE * progress;

  const isLast3 = currentDisplay <= 3 && currentDisplay > 0;
  const isZero = currentDisplay === 0;

  // 最後3秒抖動
  const shake = isLast3
    ? interpolate(
        Math.sin((frame * Math.PI * 8) / fps),
        [-1, 1],
        [-8, 8]
      )
    : 0;

  // 數字彈出 spring
  const digitSpring = spring({
    frame: frame % Math.ceil(totalFrames / TOTAL-SECONDS),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });
  const digitScale = interpolate(digitSpring, [0, 1], [1.4, 1], {
    extrapolateRight: "clamp",
  });

  const circleColor = isZero
    ? "#ffffff"
    : isLast3
    ? "#ef4444"
    : "#22d3ee";

  const bgColor = isLast3 ? "#1a0000" : "#0a0a1a";

  // 整體縮放入場
  const entrySpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        justifyContent: "center",
        alignItems: "center",
        transition: "background 0.3s",
      }}
    >
      {/* 背景光暈 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: isLast3
            ? "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          transform: `scale(${entryScale}) translateX(${shake}px)`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          width={500}
          height={500}
          viewBox="-250 -250 500 500"
          style={{ position: "absolute" }}
        >
          {/* 背景圓 */}
          <circle
            cx={0}
            cy={0}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE-WIDTH}
          />
          {/* 進度弧（從頂部開始，逆時針消耗） */}
          <circle
            cx={0}
            cy={0}
            r={RADIUS}
            fill="none"
            stroke={circleColor}
            strokeWidth={STROKE-WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90)"
            style={{
              filter: `drop-shadow(0 0 12px ${circleColor})`,
              transition: "stroke 0.2s",
            }}
          />
          {/* 刻度 */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * (RADIUS - 32)}
                y1={Math.sin(angle) * (RADIUS - 32)}
                x2={Math.cos(angle) * (RADIUS - 16)}
                y2={Math.sin(angle) * (RADIUS - 16)}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}
        </svg>

        {/* 中央數字 */}
        <div
          style={{
            width: 320,
            height: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isZero ? (
            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "sans-serif",
                letterSpacing: -4,
                textShadow: "0 0 40px rgba(255,255,255,0.8)",
                transform: `scale(${digitScale})`,
              }}
            >
              完成！
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 160,
                  fontWeight: 900,
                  color: circleColor,
                  fontFamily: "sans-serif",
                  lineHeight: 1,
                  letterSpacing: -6,
                  textShadow: `0 0 30px ${circleColor}`,
                  transform: `scale(${digitScale})`,
                }}
              >
                {currentDisplay}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "sans-serif",
                  marginTop: 8,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                }}
              >
                秒
              </div>
            </>
          )}
        </div>
      </div>

      {/* 底部標籤 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 28,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "sans-serif",
          letterSpacing: 8,
        }}
      >
        COUNTDOWN
      </div>
    </AbsoluteFill>
  );
};