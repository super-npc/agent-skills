import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

// 投影函數
const GEO = { lngMin: 119.5, lngMax: 122.5, latMin: 21.7, latMax: 25.5 };
const MAP = { x: 80, y: 60, w: 560, h: 855 };

const project = (lat: number, lng: number) => ({
  x: MAP.x + ((lng - GEO.lngMin) / (GEO.lngMax - GEO.lngMin)) * MAP.w,
  y: MAP.y + ((GEO.latMax - lat) / (GEO.latMax - GEO.latMin)) * MAP.h,
});

// 台灣輪廓座標 [lat, lng]
const TAIWAN-OUTLINE: [number, number][] = [
  [25.3, 121.54],
  [25.13, 121.74],
  [25.0, 122.0],
  [24.87, 121.83],
  [24.72, 121.77],
  [24.6, 121.87],
  [23.98, 121.61],
  [23.55, 121.55],
  [23.09, 121.37],
  [22.75, 121.1],
  [22.3, 120.9],
  [21.9, 120.85],
  [22.17, 120.7],
  [22.38, 120.49],
  [22.62, 120.26],
  [23.05, 120.1],
  [23.42, 120.12],
  [23.71, 120.29],
  [23.96, 120.43],
  [24.2, 120.57],
  [24.56, 120.78],
  [24.85, 120.88],
  [25.0, 121.35],
  [25.17, 121.43],
  [25.3, 121.54],
];

const taiwanPath = TAIWAN-OUTLINE.map(([lat, lng], i) => {
  const p = project(lat, lng);
  return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(" ") + " Z";

// 5 個城市圖釘（台北、台中、台南、高雄、花蓮）
const PINS = [
  { name: "台北", lat: 25.033, lng: 121.565, delay: 0 },
  { name: "台中", lat: 24.148, lng: 120.674, delay: 18 },
  { name: "台南", lat: 23.0, lng: 120.227, delay: 36 },
  { name: "高雄", lat: 22.627, lng: 120.301, delay: 54 },
  { name: "花蓮", lat: 23.991, lng: 121.611, delay: 72 },
].map((p) => ({ ...p, ...project(p.lat, p.lng) }));

// SVG 淚滴形狀
const PIN-PATH =
  "M 0 -28 C -14 -28, -22 -18, -22 -7 C -22 7, 0 28, 0 28 C 0 28, 22 7, 22 -7 C 22 -18, 14 -28, 0 -28 Z";

export const MapPinDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 全部落地後脈衝（frame > 110）
  const allLanded = frame > 110;
  const pulseRipple = allLanded
    ? interpolate(frame - 110, [0, 40], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const rippleScale = interpolate(pulseRipple, [0, 1], [1, 3.5]);
  const rippleOpacity = interpolate(pulseRipple, [0, 0.6, 1], [0.7, 0.3, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern id="mapGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="none" stroke="#0e1e30" strokeWidth="1" />
          </pattern>
          <filter id="pinGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 背景格線 */}
        <rect width="1920" height="1080" fill="url(#mapGrid)" />

        {/* 台灣輪廓 */}
        <path
          d={taiwanPath}
          fill="#0f2040"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 圖釘 */}
        {PINS.map((pin, i) => {
          const sp = spring({
            frame: frame - pin.delay,
            fps,
            config: { damping: 14, stiffness: 200, mass: 0.8 },
          });

          const dropY = interpolate(sp, [0, 1], [-140, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const scaleY = interpolate(sp, [0, 0.7, 1, 1.2], [0.3, 1.2, 1.0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scaleX = interpolate(sp, [0, 0.7, 1, 1.2], [0.3, 0.85, 1.0, 1.1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const textOpacity = interpolate(frame - pin.delay - 10, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const landed = frame > pin.delay + 15;

          return (
            <g key={pin.name} transform={`translate(${pin.x}, ${pin.y})`}>
              {/* 脈衝漣漪 */}
              {allLanded && (
                <circle
                  cx="0"
                  cy="4"
                  r={22 * rippleScale}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity={rippleOpacity}
                />
              )}

              {/* 落地陰影 */}
              {landed && (
                <ellipse
                  cx="0"
                  cy="30"
                  rx={12 * scaleX}
                  ry={4}
                  fill="#000000"
                  opacity="0.4"
                />
              )}

              {/* 圖釘本體 */}
              <g transform={`translate(0, ${dropY}) scale(${scaleX}, ${scaleY})`}>
                <path
                  d={PIN-PATH}
                  fill="#ef4444"
                  stroke="#991b1b"
                  strokeWidth="2"
                  filter="url(#pinGlow)"
                />
                <circle cx="0" cy="-7" r="7" fill="#fca5a5" opacity="0.8" />
              </g>

              {/* 地名標籤 */}
              <text
                x="30"
                y="5"
                fill="#f1f5f9"
                fontSize="20"
                fontWeight="600"
                opacity={textOpacity}
              >
                {pin.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 右側資訊面板 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 300,
          background: "rgba(5, 13, 26, 0.92)",
          border: "1px solid #1e3a5f",
          borderRadius: 14,
          padding: "28px 32px",
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            color: "#3b82f6",
            fontSize: 13,
            letterSpacing: 3,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          台灣城市
        </div>
        <div
          style={{
            color: "#f1f5f9",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 24,
            borderBottom: "1px solid #1e3a5f",
            paddingBottom: 16,
          }}
        >
          標記地點
        </div>
        {PINS.map((pin) => (
          <div
            key={pin.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 16,
              opacity: interpolate(frame - pin.delay - 10, [0, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 6px #ef4444",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#e2e8f0", fontSize: 20 }}>{pin.name}</span>
          </div>
        ))}
      </div>

      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#f1f5f9",
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 6,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        城市圖釘落點
      </div>
    </AbsoluteFill>
  );
};