import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SUCCESS-PATH-DURATION-FRAMES = 210;

const STEPS = [
  { label: "先做服務", en: "Service First", color: "#4DA3FF" },
  { label: "建立自動化", en: "Automate", color: "#F59E0B" },
  { label: "產品化", en: "Productize", color: "#10B981" },
];

export const Scene168-SuccessPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });

  const stepSprings = STEPS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 30 - i * 25), fps, config: { damping: 12, stiffness: 90 } })
  );

  const arrowSprings = STEPS.slice(0, -1).map((_, i) =>
    spring({ frame: Math.max(0, frame - 45 - i * 25), fps, config: { damping: 10, stiffness: 100 } })
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          fontSize: 69,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        這套流程是比較容易<span style={{ color: "#10B981" }}>成功</span>的路
      </div>
      <div
        style={{
          opacity: titleSpring * 0.4,
          fontSize: 33,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Inter', sans-serif",
          fontStyle: "italic",
          marginBottom: 60,
        }}
      >
        This process is the path more likely to succeed
      </div>

      <svg width={1650} height={420} viewBox="0 0 1100 280">
        {STEPS.map((step, i) => {
          const x = 185 + i * 365;
          const sp = stepSprings[i];
          return (
            <g key={i} opacity={sp} transform={`translate(${x}, 120) scale(${sp})`}>
              <circle cx={0} cy={0} r={55} fill={`${step.color}12`} stroke={step.color} strokeWidth={3} />
              <text x={0} y={8} textAnchor="middle" fontSize={48} fontWeight={800} fill={step.color} fontFamily="'Inter', sans-serif">
                {i + 1}
              </text>
              <text x={0} y={100} textAnchor="middle" fontSize={36} fontWeight={700} fill={step.color}>
                {step.label}
              </text>
              <text x={0} y={130} textAnchor="middle" fontSize={21} fill={`${step.color}80`} fontFamily="'Inter', sans-serif">
                {step.en}
              </text>
            </g>
          );
        })}

        {arrowSprings.map((asp, i) => {
          const x1 = 185 + i * 365 + 62;
          const x2 = 185 + (i + 1) * 365 - 62;
          return (
            <g key={i} opacity={asp}>
              <line x1={x1} y1={120} x2={x1 + (x2 - x1) * asp} y2={120}
                stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} strokeLinecap="round"
              />
              {asp > 0.8 && (
                <polygon points={`${x2 - 8},113 ${x2},120 ${x2 - 8},127`} fill="rgba(255,255,255,0.3)" />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};