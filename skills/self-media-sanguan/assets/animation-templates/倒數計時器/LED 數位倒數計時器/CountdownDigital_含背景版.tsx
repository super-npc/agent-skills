import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const TOTAL-SECONDS = 10;

const SEGMENTS: Record<string, boolean[]> = {
  "0": [true,  true,  true,  true,  true,  true,  false],
  "1": [false, true,  true,  false, false, false, false],
  "2": [true,  true,  false, true,  true,  false, true ],
  "3": [true,  true,  true,  true,  false, false, true ],
  "4": [false, true,  true,  false, false, true,  true ],
  "5": [true,  false, true,  true,  false, true,  true ],
  "6": [true,  false, true,  true,  true,  true,  true ],
  "7": [true,  true,  true,  false, false, false, false],
  "8": [true,  true,  true,  true,  true,  true,  true ],
  "9": [true,  true,  true,  true,  false, true,  true ],
};

interface SegmentDisplayProps {
  digit: string;
  glowIntensity: number;
}

const SegmentDisplay: React.FC<SegmentDisplayProps> = ({ digit, glowIntensity }) => {
  const segs = SEGMENTS[digit] ?? SEGMENTS["8"];
  const W = 80;
  const H = 140;
  const T = 12;
  const GAP = 4;
  const HALF = H / 2;

  const onColor = `rgba(255, 40, 40, ${glowIntensity})`;
  const offColor = "rgba(255,40,40,0.06)";
  const shadow = `0 0 ${16 * glowIntensity}px rgba(255,40,40,${glowIntensity * 0.9}), 0 0 ${32 * glowIntensity}px rgba(255,40,40,${glowIntensity * 0.4})`;

  const seg = (on: boolean) => ({
    background: on ? onColor : offColor,
    boxShadow: on ? shadow : "none",
    borderRadius: T / 2,
  });

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <div style={{ ...seg(segs[0]), position: "absolute", top: 0, left: GAP + T, width: W - (GAP + T) * 2, height: T }} />
      <div style={{ ...seg(segs[1]), position: "absolute", top: GAP + T, right: 0, width: T, height: HALF - GAP * 2 - T }} />
      <div style={{ ...seg(segs[2]), position: "absolute", top: HALF + GAP, right: 0, width: T, height: HALF - GAP * 2 - T }} />
      <div style={{ ...seg(segs[3]), position: "absolute", bottom: 0, left: GAP + T, width: W - (GAP + T) * 2, height: T }} />
      <div style={{ ...seg(segs[4]), position: "absolute", top: HALF + GAP, left: 0, width: T, height: HALF - GAP * 2 - T }} />
      <div style={{ ...seg(segs[5]), position: "absolute", top: GAP + T, left: 0, width: T, height: HALF - GAP * 2 - T }} />
      <div style={{ ...seg(segs[6]), position: "absolute", top: HALF - T / 2, left: GAP + T, width: W - (GAP + T) * 2, height: T }} />
    </div>
  );
};

export const CountdownDigital: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const totalFrames = durationInFrames;
  const elapsed = (frame / totalFrames) * TOTAL-SECONDS;
  const remaining = Math.max(0, TOTAL-SECONDS - Math.floor(elapsed));

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");

  const isLast3 = remaining <= 3;
  const blinkRate = isLast3 ? 0.3 : 0.15;
  const glowPulse = interpolate(
    Math.sin(frame * Math.PI * blinkRate),
    [-1, 1],
    [0.6, 1.0]
  );

  const scanY = (frame * 3) % 1080;

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: scanY,
          left: 0,
          width: "100%",
          height: 2,
          background: "rgba(255,40,40,0.04)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          background: "#0a0a0a",
          border: "3px solid #1a1a1a",
          borderRadius: 20,
          padding: "48px 64px",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,40,40,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,40,40,0.5)",
            fontFamily: "monospace",
            letterSpacing: 10,
            textTransform: "uppercase",
          }}
        >
          COUNTDOWN TIMER
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <SegmentDisplay digit={minStr[0]} glowIntensity={glowPulse} />
            <SegmentDisplay digit={minStr[1]} glowIntensity={glowPulse} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 8 }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: `rgba(255,40,40,${glowPulse})`,
                  boxShadow: `0 0 ${12 * glowPulse}px rgba(255,40,40,0.8)`,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <SegmentDisplay digit={secStr[0]} glowIntensity={glowPulse} />
            <SegmentDisplay digit={secStr[1]} glowIntensity={glowPulse} />
          </div>
        </div>

        <div
          style={{
            width: 400,
            height: 6,
            background: "#111",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((frame % Math.ceil(durationInFrames / TOTAL-SECONDS)) / Math.ceil(durationInFrames / TOTAL-SECONDS)) * 100}%`,
              background: `rgba(255,40,40,${glowPulse})`,
              boxShadow: `0 0 8px rgba(255,40,40,0.6)`,
              borderRadius: 3,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 18,
            color: "rgba(255,40,40,0.3)",
            fontFamily: "monospace",
            letterSpacing: 6,
          }}
        >
          {remaining === 0 ? "-- TIME UP --" : `${remaining} SEC REMAINING`}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(255,40,40,${0.03 * glowPulse}) 0%, transparent 60%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};