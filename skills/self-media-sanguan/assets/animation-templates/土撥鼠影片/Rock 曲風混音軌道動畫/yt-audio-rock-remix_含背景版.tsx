// 音軌資料（順序決定疊加順序）
const TRACKS = [
  { label: "Piano", color: "#FFFFFF",  iconComponent: "piano",  waveformSeed: 1, appearFrame: 0   },
  { label: "Guitar", color: "#FF6B6B", iconComponent: "guitar", waveformSeed: 2, appearFrame: 130 },
  { label: "Drums",  color: "#FFD93D", iconComponent: "drums",  waveformSeed: 3, appearFrame: 150 },
  { label: "Bass",   color: "#4DA3FF", iconComponent: "bass",   waveformSeed: 4, appearFrame: 170 },
];

// 速度計動畫（frame 75-110，針角從 -120° 到 -10°）
// 修改 needleAngle 上下限即可改變最終速度感
const needleAngle = interpolate(frame, [75, 110], [-120, -10], { ... });

// 頂部徽章（frame 205 出現）
// 修改文字與 colors.danger 顏色
<span style={{ fontSize: 64, color: colors.danger, letterSpacing: 12 }}>ROCK</span>