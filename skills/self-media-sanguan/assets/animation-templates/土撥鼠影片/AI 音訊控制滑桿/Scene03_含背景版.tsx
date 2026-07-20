import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

const AUDIO = {
  tick: staticFile("audio/connection/tick.wav"),
  whoosh: staticFile("audio/connection/woosh.wav"),
  whooshOut: staticFile("audio/connection/whoosh-out.mp3"),
  ding: staticFile("audio/connection/ding.mp3"),
  microRiser: staticFile("audio/connection/micro-riser.mp3"),
  tinyPop: staticFile("audio/connection/tiny-pop.mp3"),
  softClick: staticFile("audio/connection/soft-click.wav"),
  satisfyingFill: staticFile("audio/connection/satisfying-fill.wav"),
};

const SliderControl: React.FC<{
  x: number;
  y: number;
  height?: number;
  handlePosition: number;
  strokeProgress?: number;
  trackColor?: string;
  label?: string;
}> = ({
  x,
  y,
  height = 200,
  handlePosition = 0.5,
  strokeProgress = 1,
  trackColor = colors.accent,
  label,
}) => {
  const trackLen = height;
  const dashOffset = trackLen * (1 - strokeProgress);
  const handleY = y + height - handlePosition * height;

  return (
    <g>
      <line
        x1={x} y1={y} x2={x} y2={y + height}
        stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={trackLen} strokeDashoffset={dashOffset}
      />
      <line
        x1={x} y1={y + height} x2={x} y2={handleY}
        stroke={trackColor} strokeWidth="6" strokeLinecap="round"
        opacity={strokeProgress}
      />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={x - 10} y1={y + height - t * height}
          x2={x - 5} y2={y + height - t * height}
          stroke="rgba(255,255,255,0.3)" strokeWidth="2"
          opacity={strokeProgress}
        />
      ))}
      <circle cx={x} cy={handleY} r="14" fill={trackColor} opacity={strokeProgress} />
      <circle cx={x} cy={handleY} r="6" fill={colors.background} opacity={strokeProgress} />
      {label && (
        <text
          x={x} y={y + height + 35}
          fontSize="18" fontFamily="'Inter', 'Noto Sans TC', sans-serif"
          fontWeight="600" fill={colors.dimmed}
          textAnchor="middle" opacity={strokeProgress * 0.8}
        >
          {label}
        </text>
      )}
    </g>
  );
};

const ConnectionLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  progress: number; color?: string;
}> = ({ x1, y1, x2, y2, progress, color = "rgba(255,255,255,0.3)" }) => {
  const cpX1 = x1 + (x2 - x1) * 0.4;
  const cpX2 = x1 + (x2 - x1) * 0.6;
  const pathD = `M${x1},${y1} C${cpX1},${y1} ${cpX2},${y2} ${x2},${y2}`;
  const totalLen = 800;
  const dashOffset = totalLen * (1 - progress);

  return (
    <path
      d={pathD} stroke={color} strokeWidth="2.5" fill="none"
      strokeDasharray={totalLen} strokeDashoffset={dashOffset}
      strokeLinecap="round"
    />
  );
};

export const Scene03-Control: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const svgW = 1920;
  const svgH = 1080;
  const sliderBaseX = 420;
  const sliderSpacing = 120;
  const sliderTopY = 300;
  const sliderHeight = 380;
  const iconBaseX = 1350;
  const iconTopY = 260;
  const iconSpacing = 230;

  const sliderStroke1 = interpolate(frame, [0, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sliderStroke2 = interpolate(frame, [8, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sliderStroke3 = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const handle1Pos = interpolate(frame, [30, 55], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handle2Pos = interpolate(frame, [35, 58], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handle3Pos = interpolate(frame, [38, 60], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fineTune1 = interpolate(frame, [120, 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fineTune2 = interpolate(frame, [128, 158], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fineTune3 = interpolate(frame, [135, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const finalHandle1 = handle1Pos + fineTune1 * 0.15;
  const finalHandle2 = handle2Pos + fineTune2 * 0.3;
  const finalHandle3 = handle3Pos - fineTune3 * 0.2;

  const conn1Progress = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const conn2Progress = interpolate(frame, [58, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const conn3Progress = interpolate(frame, [65, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const icon1Stroke = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const icon2Stroke = interpolate(frame, [92, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const icon3Stroke = interpolate(frame, [104, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowIntensity = frame > 120
    ? interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const pulsePhase = frame > 160
    ? 0.3 + 0.15 * Math.sin(((frame - 160) / 25) * Math.PI * 2)
    : 0;

  const sliderGroupSlide = spring({ frame, fps, config: { damping: 18, mass: 1.2 } });
  const sliderGroupX = interpolate(sliderGroupSlide, [0, 1], [-120, 0]);

  const iconGroupSlide = spring({ frame: frame - 75, fps, config: { damping: 18, mass: 1.2 } });
  const iconGroupX = interpolate(iconGroupSlide, [0, 1], [120, 0]);

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const s1x = sliderBaseX;
  const s2x = sliderBaseX + sliderSpacing;
  const s3x = sliderBaseX + sliderSpacing * 2;
  const icon1Y = iconTopY;
  const icon2Y = iconTopY + iconSpacing;
  const icon3Y = iconTopY + iconSpacing * 2;
  const s1HandleY = sliderTopY + sliderHeight - finalHandle1 * sliderHeight;
  const s2HandleY = sliderTopY + sliderHeight - finalHandle2 * sliderHeight;
  const s3HandleY = sliderTopY + sliderHeight - finalHandle3 * sliderHeight;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, opacity: fadeOut }}>
      <Sequence from={0} durationInFrames={30}><Audio src={AUDIO.tick} volume={0.4} /></Sequence>
      <Sequence from={8} durationInFrames={30}><Audio src={AUDIO.tick} volume={0.35} /></Sequence>
      <Sequence from={15} durationInFrames={30}><Audio src={AUDIO.tick} volume={0.35} /></Sequence>
      <Sequence from={30} durationInFrames={40}><Audio src={AUDIO.satisfyingFill} volume={0.4} /></Sequence>
      <Sequence from={50} durationInFrames={40}><Audio src={AUDIO.whoosh} volume={0.4} /></Sequence>
      <Sequence from={80} durationInFrames={25}><Audio src={AUDIO.ding} volume={0.45} /></Sequence>
      <Sequence from={92} durationInFrames={25}><Audio src={AUDIO.tinyPop} volume={0.4} /></Sequence>
      <Sequence from={104} durationInFrames={25}><Audio src={AUDIO.softClick} volume={0.4} /></Sequence>
      <Sequence from={118} durationInFrames={50}><Audio src={AUDIO.microRiser} volume={0.4} /></Sequence>
      <Sequence from={durationInFrames - 25} durationInFrames={25}><Audio src={AUDIO.whooshOut} volume={0.4} /></Sequence>

      <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <g opacity={1}>
            <ConnectionLine x1={s1x + 20} y1={s1HandleY} x2={iconBaseX - 60} y2={icon1Y} progress={conn1Progress} color={`rgba(77, 163, 255, ${0.25 + pulsePhase * 0.3})`} />
            <ConnectionLine x1={s2x + 20} y1={s2HandleY} x2={iconBaseX - 60} y2={icon2Y} progress={conn2Progress} color={`rgba(255, 107, 107, ${0.25 + pulsePhase * 0.3})`} />
            <ConnectionLine x1={s3x + 20} y1={s3HandleY} x2={iconBaseX - 60} y2={icon3Y} progress={conn3Progress} color={`rgba(255, 217, 61, ${0.25 + pulsePhase * 0.3})`} />
          </g>

          <g transform={`translate(${sliderGroupX}, 0)`}>
            <rect x={sliderBaseX - 60} y={sliderTopY - 60} width={sliderSpacing * 2 + 120} height={sliderHeight + 150} rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" opacity={Math.min(sliderStroke1, 1)} />
            <text x={sliderBaseX + sliderSpacing} y={sliderTopY - 25} fontSize="22" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fontWeight="700" fill={colors.accent} textAnchor="middle" opacity={sliderStroke1 * 0.9} letterSpacing="3">CONTROL</text>
            <SliderControl x={s1x} y={sliderTopY} height={sliderHeight} handlePosition={finalHandle1} strokeProgress={sliderStroke1} trackColor={colors.accent} label="Tone" />
            <SliderControl x={s2x} y={sliderTopY} height={sliderHeight} handlePosition={finalHandle2} strokeProgress={sliderStroke2} trackColor="#FF6B6B" label="Speed" />
            <SliderControl x={s3x} y={sliderTopY} height={sliderHeight} handlePosition={finalHandle3} strokeProgress={sliderStroke3} trackColor="#FFD93D" label="Style" />
          </g>

          <g transform={`translate(${iconGroupX}, 0)`}>
            <rect x={iconBaseX - 80} y={iconTopY - 80} width="260" height={iconSpacing * 2 + 160} rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" opacity={icon1Stroke > 0 ? Math.min(icon1Stroke + 0.3, 1) : 0} />
            <text x={iconBaseX + 50} y={iconTopY - 45} fontSize="22" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fontWeight="700" fill={colors.dimmed} textAnchor="middle" opacity={icon1Stroke * 0.9} letterSpacing="3">SCENARIOS</text>
            {/* Film icon */}
            <rect x={iconBaseX + 10} y={icon1Y - 45} width={80} height={80} rx="10" stroke={colors.accent} strokeWidth="3.5" fill="none" opacity={icon1Stroke} />
            <polygon points={`${iconBaseX + 30},${icon1Y - 30} ${iconBaseX + 30},${icon1Y + 30} ${iconBaseX + 80},${icon1Y}`} fill={colors.accent} opacity={icon1Stroke} />
            <text x={iconBaseX + 50} y={icon1Y + 65} fontSize="17" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fontWeight="600" fill={colors.dimmed} textAnchor="middle" opacity={icon1Stroke * 0.8}>Video</text>
            {/* Mic icon */}
            <rect x={iconBaseX + 30} y={icon2Y - 40} width={40} height={55} rx="20" stroke="#FF6B6B" strokeWidth="3.5" fill="none" opacity={icon2Stroke} />
            <path d={`M${iconBaseX + 10},${icon2Y + 18} Q${iconBaseX + 10},${icon2Y + 45} ${iconBaseX + 50},${icon2Y + 45} Q${iconBaseX + 90},${icon2Y + 45} ${iconBaseX + 90},${icon2Y + 18}`} stroke="#FF6B6B" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={icon2Stroke} />
            <text x={iconBaseX + 50} y={icon2Y + 65} fontSize="17" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fontWeight="600" fill={colors.dimmed} textAnchor="middle" opacity={icon2Stroke * 0.8}>Podcast</text>
            {/* Storefront icon */}
            <rect x={iconBaseX + 10} y={icon3Y - 20} width={80} height={55} stroke="#FFD93D" strokeWidth="3.5" fill="none" opacity={icon3Stroke} />
            <rect x={iconBaseX + 35} y={icon3Y + 10} width={30} height={25} rx="3" stroke="#FFD93D" strokeWidth="2" fill="none" opacity={icon3Stroke} />
            <text x={iconBaseX + 50} y={icon3Y + 65} fontSize="17" fontFamily="'Inter', 'Noto Sans TC', sans-serif" fontWeight="600" fill={colors.dimmed} textAnchor="middle" opacity={icon3Stroke * 0.8}>Commerce</text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CONTROL-DURATION-FRAMES = 240;