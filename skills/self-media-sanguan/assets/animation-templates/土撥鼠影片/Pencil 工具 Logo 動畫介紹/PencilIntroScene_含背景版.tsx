import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from "remotion";
import { useEffect, useState } from "react";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

const EX = {
  extrapolateRight: "clamp" as const,
  extrapolateLeft: "clamp" as const,
};

function writeStr(v: DataView, o: number, s: string) {
  for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
}

function bufferToWavUrl(ab: AudioBuffer): string {
  const nc = ab.numberOfChannels;
  const sr = ab.sampleRate;
  const ba = nc * 2;
  const dl = ab.length * ba;
  const buf = new ArrayBuffer(44 + dl);
  const v = new DataView(buf);
  writeStr(v, 0, "RIFF");
  v.setUint32(4, 36 + dl, true);
  writeStr(v, 8, "WAVE");
  writeStr(v, 12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, nc, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * ba, true);
  v.setUint16(32, ba, true);
  v.setUint16(34, 16, true);
  writeStr(v, 36, "data");
  v.setUint32(40, dl, true);
  const chs: Float32Array[] = [];
  for (let i = 0; i < nc; i++) chs.push(ab.getChannelData(i));
  let off = 44;
  for (let s = 0; s < ab.length; s++) {
    for (let c = 0; c < nc; c++) {
      const val = Math.max(-1, Math.min(1, chs[c][s]));
      v.setInt16(off, val < 0 ? val * 0x8000 : val * 0x7fff, true);
      off += 2;
    }
  }
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return "data:audio/wav;base64," + btoa(bin);
}

async function makePop(): Promise<string> {
  const sr = 44100;
  const dur = 0.12;
  const ctx = new OfflineAudioContext(1, Math.ceil(sr * dur), sr);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, 0);
  osc.frequency.exponentialRampToValueAtTime(150, dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, 0);
  g.gain.exponentialRampToValueAtTime(0.001, dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(0);
  osc.stop(dur);
  return bufferToWavUrl(await ctx.startRendering());
}

async function makeShimmer(): Promise<string> {
  const sr = 44100;
  const dur = 0.08;
  const ctx = new OfflineAudioContext(1, Math.ceil(sr * dur), sr);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, 0);
  osc.frequency.exponentialRampToValueAtTime(800, dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.2, 0);
  g.gain.exponentialRampToValueAtTime(0.001, dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(0);
  osc.stop(dur);
  return bufferToWavUrl(await ctx.startRendering());
}

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path
      d="M20 2 l3 14 l14 3 l-14 3 l-3 14 l-3 -14 l-14 -3 l14 -3 z"
      fill={color}
    />
  </svg>
);

const sparkles = [
  { x: -120, y: -80, size: 28, delay: 20 },
  { x: 130, y: -60, size: 22, delay: 28 },
  { x: -90, y: 90, size: 18, delay: 35 },
  { x: 110, y: 80, size: 24, delay: 32 },
];

export const PencilIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [audio, setAudio] = useState<{ pop: string; shimmer: string } | null>(null);
  const [handle] = useState(() => delayRender("Generating sound effects"));

  useEffect(() => {
    Promise.all([makePop(), makeShimmer()])
      .then(([pop, shimmer]) => {
        setAudio({ pop, shimmer });
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  const logoScale = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const logoOp = interpolate(frame, [8, 22], [0, 1], EX);
  const floatY = frame > 30 ? Math.sin((frame - 30) * 0.06) * 5 : 0;

  const glowOp =
    frame > 30
      ? 0.12 + Math.sin((frame - 30) * 0.1) * 0.06
      : interpolate(frame, [20, 30], [0, 0.12], EX);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale}) translateY(${floatY}px)`,
          opacity: logoOp,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
            opacity: glowOp,
          }}
        />
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 32,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("pencil-logo.jpeg")}
            style={{
              width: 140,
              height: 140,
              objectFit: "contain",
              borderRadius: 16,
            }}
          />
        </div>
        {sparkles.map((sp, i) => {
          const local = frame - sp.delay;
          if (local < 0) return null;
          const sc = spring({
            frame: local,
            fps,
            config: { damping: 8, stiffness: 120 },
          });
          const rotate = local * 1.5;
          const op = interpolate(local, [0, 10], [0, 0.7], EX);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${sp.x}px)`,
                top: `calc(50% + ${sp.y}px)`,
                transform: `translate(-50%, -50%) scale(${sc}) rotate(${rotate}deg)`,
                opacity: op,
              }}
            >
              <Sparkle size={sp.size} color={colors.accent} />
            </div>
          );
        })}
      </div>
      {audio && (
        <Sequence from={8}>
          <Audio src={audio.pop} volume={0.5} />
        </Sequence>
      )}
      {audio &&
        sparkles.map((sp, i) => (
          <Sequence from={sp.delay} key={`sh-${i}`}>
            <Audio src={audio.shimmer} volume={0.3} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};