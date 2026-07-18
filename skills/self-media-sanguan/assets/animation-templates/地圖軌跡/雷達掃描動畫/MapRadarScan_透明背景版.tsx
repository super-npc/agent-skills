import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import React from "react";

// 投影函數
const GEO = { lngMin: 119.5, lngMax: 122.5, latMin: 21.7, latMax: 25.5 };

// 台灣中心作為雷達中心
const TAIWAN-CENTER = { lat: 23.7, lng: 120.9 };

// SVG 畫面中心
const SVG-CENTER-X = 760;
const SVG-CENTER-Y = 540;
const RADAR-RADIUS = 390;

// 從地理座標轉成相對於台灣中心的 SVG 偏移
// 約 1° 緯 = RADAR-RADIUS / ((GEO.latMax - GEO.latMin) / 2) 的比例
const LAT-SCALE = RADAR-RADIUS / ((GEO.latMax - GEO.latMin) / 2);
const LNG-SCALE = RADAR-RADIUS / ((GEO.lngMax - GEO.lngMin) / 2);

const projectToRadar = (lat: number, lng: number) => ({
  x: SVG-CENTER-X + (lng - TAIWAN-CENTER.lng) * LNG-SCALE,
  y: SVG-CENTER-Y - (lat - TAIWAN-CENTER.lat) * LAT-SCALE,
});

// 台灣輪廓（原始地理座標 → 雷達投影）
const TAIWAN-OUTLINE: [number, number][] = [
  [25.3, 121.54], [25.13, 121.74], [25.0, 122.0], [24.87, 121.83],
  [24.72, 121.77], [24.6, 121.87], [23.98, 121.61], [23.55, 121.55],
  [23.09, 121.37], [22.75, 121.1], [22.3, 120.9], [21.9, 120.85],
  [22.17, 120.7], [22.38, 120.49], [22.62, 120.26], [23.05, 120.1],
  [23.42, 120.12], [23.71, 120.29], [23.96, 120.43], [24.2, 120.57],
  [24.56, 120.78], [24.85, 120.88], [25.0, 121.35], [25.17, 121.43],
  [25.3, 121.54],
];

const taiwanRadarPath = TAIWAN-OUTLINE.map(([lat, lng], i) => {
  const p = projectToRadar(lat, lng);
  return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(" ") + " Z";

// 6 個主要城市（雷達上的目標點）
const RADAR-CITIES = [
  { name: "台北", lat: 25.033, lng: 121.565 },
  { name: "新竹", lat: 24.807, lng: 120.969 },
  { name: "台中", lat: 24.148, lng: 120.674 },
  { name: "台南", lat: 23.0, lng: 120.227 },
  { name: "高雄", lat: 22.627, lng: 120.301 },
  { name: "花蓮", lat: 23.991, lng: 121.611 },
].map((c) => {
  const p = projectToRadar(c.lat, c.lng);
  // 角度（從正北順時針，轉成 SVG 角度）
  const dx = p.x - SVG-CENTER-X;
  const dy = p.y - SVG-CENTER-Y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // 轉為從上方起
  return { ...c, x: p.x, y: p.y, angle: (angle + 360) % 360 };
});

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export const MapRadarScan: React.FC = () => {
  const frame = useCurrentFrame();

  // 掃描線角度（每幀旋轉 2°，180幀 = 1圈）
  const scanAngle = (frame * 2) % 360;
  const scanRad = toRad(scanAngle - 90);

  const TAIL-DEGREES = 70;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "monospace",
      }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 60,
          color: "#4ade80",
          fontSize: 15,
          letterSpacing: 4,
          opacity: 0.8,
        }}
      >
        ▌ 台灣雷達掃描系統 v2.4
      </div>
      <div
        style={{
          position: "absolute",
          top: 78,
          left: 60,
          color: "#166534",
          fontSize: 12,
          letterSpacing: 3,
        }}
      >
        TAIWAN RADAR SURVEILLANCE ACTIVE
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <clipPath id="radarClip">
            <circle cx={SVG-CENTER-X} cy={SVG-CENTER-Y} r={RADAR-RADIUS} />
          </clipPath>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 背景格線 */}
        <rect width="1920" height="1080" fill="#020b02" />
        {Array.from({ length: 31 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 64} y1={0} x2={i * 64} y2={1080} stroke="#061506" strokeWidth="1" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 64} x2={1920} y2={i * 64} stroke="#061506" strokeWidth="1" />
        ))}

        {/* 雷達圓形背景 */}
        <circle
          cx={SVG-CENTER-X}
          cy={SVG-CENTER-Y}
          r={RADAR-RADIUS}
          fill="#040f04"
          stroke="#15803d"
          strokeWidth="2"
        />

        {/* 同心圓 */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <circle
            key={i}
            cx={SVG-CENTER-X}
            cy={SVG-CENTER-Y}
            r={RADAR-RADIUS * r}
            fill="none"
            stroke="#14532d"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* 十字線 */}
        <line
          x1={SVG-CENTER-X - RADAR-RADIUS}
          y1={SVG-CENTER-Y}
          x2={SVG-CENTER-X + RADAR-RADIUS}
          y2={SVG-CENTER-Y}
          stroke="#14532d"
          strokeWidth="1"
        />
        <line
          x1={SVG-CENTER-X}
          y1={SVG-CENTER-Y - RADAR-RADIUS}
          x2={SVG-CENTER-X}
          y2={SVG-CENTER-Y + RADAR-RADIUS}
          stroke="#14532d"
          strokeWidth="1"
        />

        {/* 斜線 */}
        {[45, 135].map((deg) => {
          const r = toRad(deg);
          return (
            <line
              key={deg}
              x1={SVG-CENTER-X - Math.cos(r) * RADAR-RADIUS}
              y1={SVG-CENTER-Y - Math.sin(r) * RADAR-RADIUS}
              x2={SVG-CENTER-X + Math.cos(r) * RADAR-RADIUS}
              y2={SVG-CENTER-Y + Math.sin(r) * RADAR-RADIUS}
              stroke="#14532d"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          );
        })}

        {/* 台灣輪廓（裁剪在雷達圓內） */}
        <g clipPath="url(#radarClip)">
          <path
            d={taiwanRadarPath}
            fill="#083d08"
            stroke="#1a5e1a"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity={0.7}
          />
        </g>

        {/* 掃描尾跡（扇形） */}
        <g clipPath="url(#radarClip)">
          {Array.from({ length: TAIL-DEGREES }).map((_, i) => {
            const alpha = i / TAIL-DEGREES;
            const angle = toRad(scanAngle - 90 - i);
            return (
              <line
                key={i}
                x1={SVG-CENTER-X}
                y1={SVG-CENTER-Y}
                x2={SVG-CENTER-X + Math.cos(angle) * RADAR-RADIUS}
                y2={SVG-CENTER-Y + Math.sin(angle) * RADAR-RADIUS}
                stroke="#4ade80"
                strokeWidth="2"
                opacity={(1 - alpha) * 0.2}
              />
            );
          })}
        </g>

        {/* 掃描線（主線） */}
        <line
          x1={SVG-CENTER-X}
          y1={SVG-CENTER-Y}
          x2={SVG-CENTER-X + Math.cos(scanRad) * RADAR-RADIUS}
          y2={SVG-CENTER-Y + Math.sin(scanRad) * RADAR-RADIUS}
          stroke="#4ade80"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 5px #4ade80)" }}
          clipPath="url(#radarClip)"
        />

        {/* 城市目標點 */}
        {RADAR-CITIES.map((city) => {
          // SVG 角度（從右方 0° 逆時針，轉為從上方 0° 順時針）
          const dx = city.x - SVG-CENTER-X;
          const dy = city.y - SVG-CENTER-Y;
          const targetAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + 90) % 360;

          // 掃描線已掃過後閃爍
          const angleDiff = ((scanAngle - targetAngle) % 360 + 360) % 360;
          const isFresh = angleDiff < 45;
          const blinkIntensity = isFresh
            ? interpolate(angleDiff, [0, 45], [1, 0], { extrapolateRight: "clamp" })
            : 0;

          return (
            <g key={city.name} transform={`translate(${city.x}, ${city.y})`}>
              <circle
                r={18}
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                opacity={blinkIntensity * 0.7}
              />
              <circle
                r={5}
                fill="#4ade80"
                opacity={blinkIntensity}
                style={{ filter: blinkIntensity > 0.4 ? "drop-shadow(0 0 5px #4ade80)" : "none" }}
              />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#4ade80" strokeWidth="1.5" opacity={blinkIntensity * 0.6} />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#4ade80" strokeWidth="1.5" opacity={blinkIntensity * 0.6} />
              <text
                x="22"
                y="5"
                fill="#4ade80"
                fontSize="15"
                opacity={blinkIntensity * 0.9}
                fontFamily="monospace"
              >
                {city.name}
              </text>
            </g>
          );
        })}

        {/* 中心點 */}
        <circle
          cx={SVG-CENTER-X}
          cy={SVG-CENTER-Y}
          r={8}
          fill="#4ade80"
          style={{ filter: "drop-shadow(0 0 10px #4ade80)" }}
        />
        <circle cx={SVG-CENTER-X} cy={SVG-CENTER-Y} r={44} fill="url(#centerGlow)" />

        {/* 外圈刻度 */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = toRad(i * 10 - 90);
          const inner = i % 3 === 0 ? RADAR-RADIUS - 18 : RADAR-RADIUS - 10;
          return (
            <line
              key={i}
              x1={SVG-CENTER-X + Math.cos(a) * inner}
              y1={SVG-CENTER-Y + Math.sin(a) * inner}
              x2={SVG-CENTER-X + Math.cos(a) * RADAR-RADIUS}
              y2={SVG-CENTER-Y + Math.sin(a) * RADAR-RADIUS}
              stroke="#15803d"
              strokeWidth={i % 9 === 0 ? 2 : 1}
            />
          );
        })}
      </svg>

      {/* 右側狀態面板 */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 160,
          width: 260,
          color: "#4ade80",
          fontSize: 13,
          fontFamily: "monospace",
          lineHeight: 2,
        }}
      >
        <div style={{ color: "#166534", marginBottom: 8 }}>// 系統狀態</div>
        <div>掃描角度：{Math.round(scanAngle)}°</div>
        <div>目標數量：{RADAR-CITIES.length}</div>
        <div>掃描半徑：{RADAR-RADIUS} px</div>
        <div style={{ marginTop: 20, color: "#166534" }}>// 偵測城市</div>
        {RADAR-CITIES.map((city) => {
          const dx = city.x - SVG-CENTER-X;
          const dy = city.y - SVG-CENTER-Y;
          const targetAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + 90) % 360;
          const angleDiff = ((scanAngle - targetAngle) % 360 + 360) % 360;
          const active = angleDiff < 45;
          return (
            <div key={city.name} style={{ color: active ? "#4ade80" : "#166534" }}>
              {active ? "▶" : "○"} {city.name}
            </div>
          );
        })}
      </div>

      {/* 左下角角度顯示 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          color: "#166534",
          fontSize: 12,
          fontFamily: "monospace",
          letterSpacing: 2,
        }}
      >
        SCAN: {String(Math.round(scanAngle)).padStart(3, "0")}°　RANGE: {RADAR-RADIUS}m　MODE: ACTIVE
      </div>
    </AbsoluteFill>
  );
};