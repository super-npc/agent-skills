import { AbsoluteFill, useCurrentFrame } from "remotion";
import React from "react";

const TARGET = "DECODED";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const STAGGER = 6;
const SCRAMBLE-FRAMES = 8;

export const ScrambleTitle: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 110,
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        {TARGET.split("").map((correctChar, i) => {
          const resolveAt = i * STAGGER + SCRAMBLE-FRAMES;
          const isResolved = frame >= resolveAt;
          const displayChar = isResolved
            ? correctChar
            : CHARS[(frame * 7 + i * 13 + 3) % CHARS.length];

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: "0.72em",
                textAlign: "center",
                color: isResolved ? "#00ff41" : "#007a20",
              }}
            >
              {displayChar}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};