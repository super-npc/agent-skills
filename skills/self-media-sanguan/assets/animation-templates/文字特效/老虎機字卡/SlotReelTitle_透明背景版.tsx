import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const FINAL-TEXT = "REWIND";
const REEL-PREFIXES = [
  ["K", "A", "M", "X"],
  ["B", "Z", "T", "E"],
  ["Q", "P", "V", "W"],
  ["Y", "N", "D", "I"],
  ["J", "H", "S", "N"],
  ["C", "L", "F", "G"],
];
const REELS = REEL-PREFIXES.map((prefix, i) => [...prefix, FINAL-TEXT[i]]);
const ITEM-HEIGHT = 110;
const CHAR-DELAY = 8;

export const SlotReelTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {FINAL-TEXT.split("").map((_, charIdx) => {
          const reel = REELS[charIdx];
          const delay = charIdx * CHAR-DELAY;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 25, stiffness: 70, mass: 1.2 },
          });
          const translateY = interpolate(
            progress,
            [0, 1],
            [0, -(reel.length - 1) * ITEM-HEIGHT]
          );

          return (
            <div
              key={charIdx}
              style={{ width: 85, height: ITEM-HEIGHT, overflow: "hidden" }}
            >
              <div style={{ transform: `translateY(${translateY}px)` }}>
                {reel.map((char, j) => (
                  <div
                    key={j}
                    style={{
                      height: ITEM-HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 96,
                      fontWeight: 900,
                      color:
                        j === reel.length - 1 ? "#fbbf24" : "#374151",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};