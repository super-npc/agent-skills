import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SKILL-SHOWCASE-DURATION-FRAMES = 600;

const SKILLS = [
  { name: "Superpowers", number: "1", color: "#4DA3FF" },
  { name: "shadcn/ui Skills", number: "2", color: "#00D4AA" },
  { name: "OWASP Security", number: "3", color: "#FF6D2E" },
  { name: "Trail of Bits", number: "4", color: "#7C3AED" },
];

const COLS = 2;
const GAP = 16;
const CELL-W = (1920 - GAP * (COLS + 1)) / COLS;
const CELL-H = 460;
const GRID-W = COLS * CELL-W + (COLS - 1) * GAP;
const GRID-H = 2 * CELL-H + GAP;
const GRID-LEFT = (1920 - GRID-W) / 2;
const GRID-TOP = (1080 - GRID-H) / 2;

const getCellRect = (index: number) => {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: GRID-LEFT + col * (CELL-W + GAP),
    y: GRID-TOP + row * (CELL-H + GAP),
    w: CELL-W,
    h: CELL-H,
  };
};

const GRID-INTRO = 40;
const TOOL-DURATION = 130;
const ZOOM-IN = 25;
const HOLD = 75;
const ZOOM-OUT = 30;

export const Scene130-SkillShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(frame, [570, 600], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = frame < 570 ? globalFadeIn : globalFadeOut;

  const gridSpring = spring({ frame, fps, config: { damping: 14, mass: 0.6, stiffness: 120 } });
  const gridScale = interpolate(gridSpring, [0, 1], [0.88, 1]);
  const gridOpacity = interpolate(gridSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  let activeIndex = -1;
  let zoomProgress = 0;
  for (let i = 0; i < SKILLS.length; i++) {
    const toolStart = GRID-INTRO + i * TOOL-DURATION;
    const toolEnd = toolStart + TOOL-DURATION;
    if (frame >= toolStart && frame < toolEnd) {
      activeIndex = i;
      const localFrame = frame - toolStart;
      if (localFrame < ZOOM-IN) {
        zoomProgress = interpolate(localFrame, [0, ZOOM-IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      } else if (localFrame < ZOOM-IN + HOLD) {
        zoomProgress = 1;
      } else {
        zoomProgress = interpolate(localFrame, [ZOOM-IN + HOLD, ZOOM-IN + HOLD + ZOOM-OUT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      }
      break;
    }
  }

  let labelOpacity = 0;
  let labelScale = 0;
  if (activeIndex >= 0) {
    const toolStart = GRID-INTRO + activeIndex * TOOL-DURATION;
    const localFrame = frame - toolStart;
    const labelSpring = spring({ frame: Math.max(0, localFrame - ZOOM-IN - 5), fps, config: { damping: 10, mass: 0.4, stiffness: 200 } });
    labelScale = interpolate(labelSpring, [0, 1], [0.3, 1]);
    labelOpacity = interpolate(labelSpring, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    if (localFrame >= ZOOM-IN + HOLD) {
      labelOpacity *= interpolate(localFrame, [ZOOM-IN + HOLD, ZOOM-IN + HOLD + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
  }

  return (
    <AbsoluteFill style={{ background: "#0A0E14", opacity: masterOpacity }}>
      {/* Grid */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, width: 1920, height: 1080,
          transform: `scale(${gridScale})`, transformOrigin: "center center", opacity: gridOpacity,
        }}
      >
        {SKILLS.map((skill, i) => {
          const cell = getCellRect(i);
          const cellDelay = 5 + i * 5;
          const cellSpring = spring({ frame: Math.max(0, frame - cellDelay), fps, config: { damping: 12, mass: 0.4, stiffness: 180 } });
          const cellScale = interpolate(cellSpring, [0, 1], [0.8, 1]);
          const cellOpacity = interpolate(cellSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
          const isActive = i === activeIndex;
          const dimAmount = !isActive && zoomProgress > 0 ? interpolate(zoomProgress, [0, 1], [1, 0.15]) : 1;

          return (
            <div
              key={i}
              style={{
                position: "absolute", left: cell.x, top: cell.y, width: cell.w, height: cell.h,
                borderRadius: 12, overflow: "hidden", transform: `scale(${cellScale})`,
                opacity: cellOpacity * dimAmount, border: "1px solid rgba(255,255,255,0.1)",
                boxSizing: "border-box", background: `${skill.color}08`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
              }}
            >
              <div style={{ fontSize: 96, fontWeight: 900, color: skill.color, fontFamily: "'Inter', sans-serif" }}>
                {skill.number}
              </div>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#FFFFFF", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "0 20px" }}>
                {skill.name}
              </div>
              <div
                style={{
                  position: "absolute", top: 10, left: 10, width: 36, height: 36, borderRadius: "50%",
                  background: skill.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 800, color: "#FFFFFF",
                  opacity: zoomProgress > 0.3 && isActive ? 0 : 0.9,
                }}
              >
                {skill.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zoomed overlay */}
      {activeIndex >= 0 && zoomProgress > 0 && (() => {
        const cell = getCellRect(activeIndex);
        const x = interpolate(zoomProgress, [0, 1], [cell.x, 0]);
        const y = interpolate(zoomProgress, [0, 1], [cell.y, 0]);
        const w = interpolate(zoomProgress, [0, 1], [cell.w, 1920]);
        const h = interpolate(zoomProgress, [0, 1], [cell.h, 1080]);
        const borderRadius = interpolate(zoomProgress, [0, 1], [12, 0]);
        const skill = SKILLS[activeIndex];
        return (
          <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius, overflow: "hidden", zIndex: 10, background: `${skill.color}08`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 200, fontWeight: 900, color: skill.color, fontFamily: "'Inter', sans-serif" }}>{skill.number}</div>
            <div style={{ fontSize: 96, fontWeight: 800, color: "#FFFFFF", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>{skill.name}</div>
          </div>
        );
      })()}

      {/* Label overlay */}
      {activeIndex >= 0 && labelOpacity > 0 && (
        <div
          style={{
            position: "absolute", bottom: 50, left: "50%",
            transform: `translateX(-50%) scale(${labelScale})`, opacity: labelOpacity,
            display: "flex", alignItems: "center", gap: 24, background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)", borderRadius: 24, padding: "20px 44px",
            border: `2px solid ${SKILLS[activeIndex].color}50`,
            zIndex: 20,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 72, fontWeight: 800, color: SKILLS[activeIndex].color }}>
            {SKILLS[activeIndex].number}.
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 78, fontWeight: 700, color: "#FFFFFF" }}>
            {SKILLS[activeIndex].name}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};