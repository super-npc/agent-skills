import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const DEPLOY-CLOUDFLARE-211-DURATION-FRAMES = 210;

export const Scene211-DeployCloudflare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const frontendSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 80 } });
  const backendSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 80 } });
  const arrowProg = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cloudSpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 10, stiffness: 80 } });

  const deployItems = [
    { label: "Pages", zh: "前端靜態", delay: 70 },
    { label: "Workers", zh: "後端 API", delay: 85 },
    { label: "D1 Database", zh: "資料庫", delay: 100 },
  ];
  const deploySprings = deployItems.map((d) =>
    spring({ frame: Math.max(0, frame - d.delay), fps, config: { damping: 12, stiffness: 80 } })
  );

  const successSpring = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 10, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 12, lineHeight: 1.4 }}>
        部署到 <span style={{ color: "#F59E0B" }}>Cloudflare</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Deploy frontend & backend to Cloudflare
      </div>

      <svg width={1950} height={825} viewBox="0 0 1300 550">
        {/* Frontend Card */}
        <g transform="translate(285, 40)" opacity={frontendSpring}>
          <g transform={`scale(${frontendSpring})`}>
            <rect x={-190} y={0} width={380} height={160} rx={18} fill="rgba(77,163,255,0.05)" stroke="#4DA3FF" strokeWidth={3} />
            <text x={20} y={60} textAnchor="start" fontSize={26} fontWeight={800} fill="#4DA3FF">前端</text>
            <text x={20} y={88} textAnchor="start" fontSize={15} fill="rgba(77,163,255,0.5)" fontFamily="'Inter', sans-serif">Frontend (React / Next.js)</text>
            <text x={20} y={118} textAnchor="start" fontSize={14} fill="rgba(77,163,255,0.35)" fontFamily="'Inter', sans-serif">Landing Page + Dashboard</text>
          </g>
        </g>

        {/* Backend Card */}
        <g transform="translate(285, 230)" opacity={backendSpring}>
          <g transform={`scale(${backendSpring})`}>
            <rect x={-190} y={0} width={380} height={160} rx={18} fill="rgba(167,139,250,0.05)" stroke="#A78BFA" strokeWidth={3} />
            <text x={20} y={60} textAnchor="start" fontSize={26} fontWeight={800} fill="#A78BFA">後端</text>
            <text x={20} y={88} textAnchor="start" fontSize={15} fill="rgba(167,139,250,0.5)" fontFamily="'Inter', sans-serif">Backend (API / Workers)</text>
            <text x={20} y={118} textAnchor="start" fontSize={14} fill="rgba(167,139,250,0.35)" fontFamily="'Inter', sans-serif">Auth + Payment + DB</text>
          </g>
        </g>

        {/* Arrows */}
        <g opacity={arrowProg}>
          <line x1={495} y1={120} x2={495 + 100 * arrowProg} y2={120 + 80 * arrowProg} stroke="rgba(77,163,255,0.35)" strokeWidth={3} strokeDasharray="10 6" />
          <line x1={495} y1={310} x2={495 + 100 * arrowProg} y2={310 - 80 * arrowProg} stroke="rgba(167,139,250,0.35)" strokeWidth={3} strokeDasharray="10 6" />
          {arrowProg > 0.8 && <polygon points="598,196 612,202 598,208" fill="rgba(255,255,255,0.35)" />}
        </g>

        {/* Cloudflare Panel */}
        <g transform="translate(870, 30)" opacity={cloudSpring}>
          <g transform={`scale(${cloudSpring})`}>
            <rect x={-280} y={0} width={560} height={380} rx={24} fill="rgba(245,158,11,0.04)" stroke="#F59E0B" strokeWidth={3} />
            <text x={0} y={65} textAnchor="middle" fontSize={32} fontWeight={900} fill="#F59E0B" fontFamily="'Inter', sans-serif">☁ Cloudflare</text>
            {deployItems.map((item, i) => {
              const sp = deploySprings[i];
              return (
                <g key={i} opacity={sp} transform={`translate(0, ${140 + i * 75})`}>
                  <g transform={`translate(${(1 - sp) * 30}, 0)`}>
                    <rect x={-220} y={0} width={440} height={58} rx={14} fill="rgba(245,158,11,0.06)" stroke="#F59E0B" strokeWidth={2} strokeOpacity={0.5} />
                    <g transform="translate(-185, 29)">
                      <circle cx={0} cy={0} r={14} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={2} />
                      <polyline points="-5,0 -2,4 6,-4" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" />
                    </g>
                    <text x={-150} y={24} textAnchor="start" fontSize={18} fontWeight={700} fill="#F59E0B">{item.zh}</text>
                    <text x={-150} y={46} textAnchor="start" fontSize={13} fill="rgba(245,158,11,0.5)" fontFamily="'Inter', sans-serif">{item.label}</text>
                    <g transform="translate(175, 29)">
                      <rect x={-40} y={-12} width={80} height={24} rx={12} fill="rgba(16,185,129,0.12)" stroke="#10B981" strokeWidth={1.5} />
                      <text x={0} y={4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10B981" fontFamily="'Inter', sans-serif">Deployed</text>
                    </g>
                  </g>
                </g>
              );
            })}
          </g>
        </g>

        {/* Success Badge */}
        <g transform="translate(650, 480)" opacity={successSpring}>
          <g transform={`scale(${successSpring})`}>
            <rect x={-260} y={-20} width={520} height={56} rx={28} fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontSize={24} fontWeight={800} fill="#10B981">前後端部署完成 ✓</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};