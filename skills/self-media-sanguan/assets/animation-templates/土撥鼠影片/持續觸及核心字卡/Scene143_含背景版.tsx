import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

const ZH-LINE1 = "持續地觸及到想吃牛肉麵的人，";
const ZH-LINE2 = "讓他來吃、再來吃、還帶朋友來吃。";
const EN = "Continuously reach people who crave beef noodles — get them to come, come back, and bring friends.";
const CHARS-PER-FRAME = 0.6;

export const Scene143-CoreDistCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const typeStart = 12;
  const charsShown = Math.floor(Math.max(0, frame - typeStart) * CHARS-PER-FRAME);
  const allText = ZH-LINE1 + ZH-LINE2;
  const visibleText = allText.slice(0, charsShown);
  const l1End = ZH-LINE1.length;
  const vis1 = visibleText.slice(0, l1End);
  const vis2 = visibleText.slice(l1End);

  const zhDoneFrame = typeStart + allText.length / CHARS-PER-FRAME;
  const enOpacity = interpolate(frame, [zhDoneFrame + 5, zhDoneFrame + 20], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14, stiffness: 80 } });
  const cursorOn = Math.sin(frame * 0.3) > 0 && charsShown < allText.length;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", alignItems: "center", justifyContent: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 2100 }}>
        <div style={{ textAlign: "center", lineHeight: 1.6 }}>
          <div style={{ fontSize: 69, fontWeight: 700, color: "#FFFFFF", minHeight: 64 }}>
            {vis1}
            {charsShown > 0 && charsShown <= l1End && cursorOn && (
              <span style={{ color: "#4DA3FF", opacity: 0.6 }}>|</span>
            )}
          </div>
          {charsShown > l1End && (
            <div style={{ fontSize: 69, fontWeight: 700, color: "#FFFFFF", minHeight: 64, marginTop: 18 }}>
              {vis2}
              {charsShown > l1End && charsShown < allText.length && cursorOn && (
                <span style={{ color: "#4DA3FF", opacity: 0.6 }}>|</span>
              )}
            </div>
          )}
        </div>
        <div style={{ width: 600 * lineSpring, height: 3, background: "linear-gradient(90deg, #4DA3FF, #A78BFA)", borderRadius: 2, marginTop: 48, opacity: 0.4 }} />
        <div style={{ marginTop: 42, fontSize: 48, fontWeight: 400, color: "rgba(255,255,255,0.45)", textAlign: "center", maxWidth: 1800, lineHeight: 1.5, opacity: enOpacity, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          {EN}
        </div>
      </div>
    </AbsoluteFill>
  );
};