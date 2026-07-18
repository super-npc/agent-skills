import { AbsoluteFill, useCurrentFrame } from "remotion";
import React from "react";

const TEXT = "Hello, Remotion.";
const CHARS-PER-FRAME = 2;
const FONT-SIZE = 72;
const TEXT-COLOR = "#ffffff";
const BG-COLOR = "#0f172a";
const CURSOR-COLOR = "#38bdf8";
const CURSOR-BLINK-INTERVAL = 15;

export const TypewriterTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const charsToShow = Math.min(
    Math.floor(frame * CHARS-PER-FRAME),
    TEXT.length,
  );
  const displayText = TEXT.slice(0, charsToShow);

  const isDoneTyping = charsToShow >= TEXT.length;
  const cursorOpacity = isDoneTyping
    ? Math.floor(frame / CURSOR-BLINK-INTERVAL) % 2 === 0
      ? 1
      : 0
    : 1;

  return (
    <AbsoluteFill
      style={{
        background: BG-COLOR,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: FONT-SIZE,
          fontWeight: 700,
          color: TEXT-COLOR,
          letterSpacing: "0.02em",
        }}
      >
        <span>{displayText}</span>
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: FONT-SIZE * 1.1,
            background: CURSOR-COLOR,
            marginLeft: 6,
            opacity: cursorOpacity,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};