import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

// 從 01:00 倒數至 00:00，共 60 秒
const TOTAL-SECONDS = 60;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface FlipDigitProps {
  current: string;
  prev: string;
  isFlipping: boolean;
  flipProgress: number;
}

const FlipDigit: React.FC<FlipDigitProps> = ({
  current,
  prev,
  isFlipping,
  flipProgress,
}) => {
  const topFlipAngle = interpolate(flipProgress, [0, 0.5], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomFlipAngle = interpolate(flipProgress, [0.5, 1], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showNewTop = flipProgress >= 0.5;

  const cardW = 140;
  const cardH = 180;
  const halfH = cardH / 2;

  const cardStyle: React.CSSProperties = {
    width: cardW,
    height: cardH,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    background: "#1a1a2e",
  };

  const digitStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    fontSize: 120,
    fontWeight: 900,
    color: "#f5f5f0",
    fontFamily: "monospace",
    textAlign: "center",
    lineHeight: `${cardH}px`,
    userSelect: "none",
  };

  return (
    <div style={cardStyle}>
      {/* 靜態下半（當前數字底部） */}
      <div
        style={{
          position: "absolute",
          top: halfH,
          left: 0,
          width: cardW,
          height: halfH,
          overflow: "hidden",
          borderTop: "1px solid rgba(0,0,0,0.4)",
          background: "#16213e",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <div style={{ ...digitStyle, top: -halfH }}>{current}</div>
      </div>

      {/* 靜態上半 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: cardW,
          height: halfH,
          overflow: "hidden",
          background: "#1a1a2e",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div style={{ ...digitStyle, top: 0 }}>
          {showNewTop ? current : prev}
        </div>
      </div>

      {/* 翻轉牌片 — 上半翻下 */}
      {isFlipping && flipProgress < 0.5 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: cardW,
            height: halfH,
            overflow: "hidden",
            background: "#1a1a2e",
            borderRadius: "12px 12px 0 0",
            transformOrigin: "bottom center",
            transform: `perspective(600px) rotateX(${topFlipAngle}deg)`,
            zIndex: 10,
            backfaceVisibility: "hidden",
          }}
        >
          <div style={{ ...digitStyle, top: 0 }}>{prev}</div>
        </div>
      )}

      {/* 翻轉牌片 — 下半展開 */}
      {isFlipping && flipProgress >= 0.5 && (
        <div
          style={{
            position: "absolute",
            top: halfH,
            left: 0,
            width: cardW,
            height: halfH,
            overflow: "hidden",
            background: "#16213e",
            borderRadius: "0 0 12px 12px",
            transformOrigin: "top center",
            transform: `perspective(600px) rotateX(${bottomFlipAngle}deg)`,
            zIndex: 10,
            backfaceVisibility: "hidden",
          }}
        >
          <div style={{ ...digitStyle, top: -halfH }}>{current}</div>
        </div>
      )}

      {/* 中間分隔線 */}
      <div
        style={{
          position: "absolute",
          top: halfH - 1,
          left: 0,
          width: "100%",
          height: 2,
          background: "rgba(0,0,0,0.5)",
          zIndex: 20,
        }}
      />
    </div>
  );
};

interface FlipGroupProps {
  currentVal: string;
  prevVal: string;
  isFlipping: boolean;
  flipProgress: number;
}

const FlipGroup: React.FC<FlipGroupProps> = ({
  currentVal,
  prevVal,
  isFlipping,
  flipProgress,
}) => {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <FlipDigit
        current={currentVal[0]}
        prev={prevVal[0]}
        isFlipping={isFlipping && currentVal[0] !== prevVal[0]}
        flipProgress={flipProgress}
      />
      <FlipDigit
        current={currentVal[1]}
        prev={prevVal[1]}
        isFlipping={isFlipping && currentVal[1] !== prevVal[1]}
        flipProgress={flipProgress}
      />
    </div>
  );
};

export const CountdownFlipClock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalFrames = durationInFrames;
  const framesPerSecond = totalFrames / TOTAL-SECONDS;

  const elapsed = (frame / totalFrames) * TOTAL-SECONDS;
  const currentSecTotal = Math.max(0, TOTAL-SECONDS - Math.floor(elapsed));
  const prevSecTotal = Math.min(TOTAL-SECONDS, currentSecTotal + 1);

  const currentMin = Math.floor(currentSecTotal / 60);
  const currentSec = currentSecTotal % 60;
  const prevMin = Math.floor(prevSecTotal / 60);
  const prevSec = prevSecTotal % 60;

  const currentMinStr = pad(currentMin);
  const currentSecStr = pad(currentSec);
  const prevMinStr = pad(prevMin);
  const prevSecStr = pad(prevSec);

  const frameWithinSecond = frame % framesPerSecond;
  const flipDuration = framesPerSecond * 0.4;
  const isFlipping = frameWithinSecond < flipDuration && frame > 0;
  const flipProgress = isFlipping
    ? interpolate(frameWithinSecond, [0, flipDuration], [0, 1], {
        extrapolateRight: "clamp",
      })
    : frame === 0
    ? 0
    : 1;

  const secIsFlipping = isFlipping && currentSecStr !== prevSecStr;
  const minIsFlipping = isFlipping && currentMinStr !== prevMinStr;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0d0d1a 0%, #1a1030 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 裝飾光暈 */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          fontSize: 36,
          fontWeight: 300,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "sans-serif",
          letterSpacing: 12,
          textTransform: "uppercase",
        }}
      >
        倒數計時
      </div>

      {/* 翻頁時鐘主體 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* 分鐘 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <FlipGroup
            currentVal={currentMinStr}
            prevVal={prevMinStr}
            isFlipping={minIsFlipping}
            flipProgress={flipProgress}
          />
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "sans-serif",
              letterSpacing: 6,
            }}
          >
            分
          </div>
        </div>

        {/* 冒號分隔 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            paddingBottom: 32,
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: interpolate(
                  Math.sin(frame * 0.15),
                  [-1, 1],
                  [0.3, 1]
                ) > 0.6
                  ? "#6366f1"
                  : "rgba(99,102,241,0.3)",
                boxShadow: "0 0 8px rgba(99,102,241,0.6)",
              }}
            />
          ))}
        </div>

        {/* 秒 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <FlipGroup
            currentVal={currentSecStr}
            prevVal={prevSecStr}
            isFlipping={secIsFlipping}
            flipProgress={flipProgress}
          />
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "sans-serif",
              letterSpacing: 6,
            }}
          >
            秒
          </div>
        </div>
      </div>

      {/* 底部陰影裝飾 */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          display: "flex",
          gap: 32,
        }}
      >
        {["分", "秒"].map((label) => (
          <div
            key={label}
            style={{
              width: 296,
              height: 12,
              background: "rgba(0,0,0,0.4)",
              borderRadius: "50%",
              filter: "blur(6px)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};