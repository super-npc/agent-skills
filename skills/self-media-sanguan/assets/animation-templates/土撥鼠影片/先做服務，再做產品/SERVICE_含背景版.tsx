import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SERVICE-FIRST-DURATION-FRAMES = 450;

export const Scene169-ServiceFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [430, 450], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const phaseAOpacity = interpolate(frame, [0, 8, 220, 250], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase1Spring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 90 } });
  const callCount = Math.min(100, Math.round(interpolate(frame, [30, 100], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const phoneRing = frame > 25 && frame < 105 ? Math.sin(frame * 0.6) * 3 : 0;
  const arrow1Spring = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 10, stiffness: 100 } });
  const phase2Spring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 12, stiffness: 90 } });
  const insight1 = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 12, stiffness: 90 } });
  const insight2 = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 12, stiffness: 90 } });
  const insight3 = spring({ frame: Math.max(0, frame - 170), fps, config: { damping: 12, stiffness: 90 } });
  const arrow2Spring = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 10, stiffness: 100 } });
  const phase3Spring = spring({ frame: Math.max(0, frame - 200), fps, config: { damping: 12, stiffness: 90 } });
  const checkSpring = spring({ frame: Math.max(0, frame - 220), fps, config: { damping: 10, stiffness: 120 } });
  const phaseBOpacity = interpolate(frame, [240, 270, 430, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseBFrame = Math.max(0, frame - 250);
  const vsSpring = spring({ frame: Math.max(0, phaseBFrame - 5), fps, config: { damping: 10, stiffness: 80 } });
  const wrongSpring = spring({ frame: Math.max(0, phaseBFrame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const xSpring = spring({ frame: Math.max(0, phaseBFrame - 60), fps, config: { damping: 8, stiffness: 120 } });
  const gap1 = spring({ frame: Math.max(0, phaseBFrame - 80), fps, config: { damping: 12, stiffness: 90 } });
  const gap2 = spring({ frame: Math.max(0, phaseBFrame - 95), fps, config: { damping: 12, stiffness: 90 } });
  const gap3 = spring({ frame: Math.max(0, phaseBFrame - 110), fps, config: { damping: 12, stiffness: 90 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      {/* Phase A */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: phaseAOpacity }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 60, fontWeight: 700, color: "#FFFFFF", textAlign: "center" }}>
          先做<span style={{ color: "#4DA3FF" }}>服務</span>，再做<span style={{ color: "#10B981" }}>產品</span>
        </div>
        <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginTop: 9, marginBottom: 50 }}>
          Do the service first, then build the product
        </div>
        <svg width={1700} height={500} viewBox="0 0 1100 320">
          <g opacity={phase1Spring} transform={`translate(180, 150) scale(${phase1Spring})`}>
            <rect x={-145} y={-120} width={290} height={240} rx={18} fill="rgba(77,163,255,0.08)" stroke="rgba(77,163,255,0.3)" strokeWidth={2.5} />
            <g transform={`translate(0, -70) rotate(${phoneRing})`}>
              <rect x={-14} y={-22} width={28} height={44} rx={6} fill="#4DA3FF" opacity={0.8} />
              <rect x={-9} y={14} width={18} height={3} rx={1.5} fill="rgba(255,255,255,0.4)" />
            </g>
            <text x={0} y={10} textAnchor="middle" fontSize={60} fontWeight={900} fill="#4DA3FF" fontFamily="'Inter', sans-serif">{callCount}</text>
            <text x={0} y={38} textAnchor="middle" fontSize={20} fill="rgba(77,163,255,0.6)">通電話</text>
            <text x={0} y={80} textAnchor="middle" fontSize={24} fontWeight={700} fill="#4DA3FF">接聽 100 通電話</text>
            <text x={0} y={105} textAnchor="middle" fontSize={16} fill="rgba(77,163,255,0.5)" fontFamily="'Inter', sans-serif">Answer 100 calls</text>
          </g>
          <g opacity={arrow1Spring}>
            <line x1={335} y1={150} x2={335 + 55 * arrow1Spring} y2={150} stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} strokeLinecap="round" />
            {arrow1Spring > 0.8 && <polygon points="388,143 398,150 388,157" fill="rgba(255,255,255,0.3)" />}
          </g>
          <g opacity={phase2Spring} transform={`translate(550, 150) scale(${phase2Spring})`}>
            <rect x={-145} y={-120} width={290} height={240} rx={18} fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth={2.5} />
            <g opacity={insight1}><text x={0} y={-25} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.5)">• 客戶常見問題</text></g>
            <g opacity={insight2}><text x={0} y={5} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.5)">• 服務流程全貌</text></g>
            <g opacity={insight3}><text x={0} y={35} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.5)">• 真正的痛點</text></g>
            <text x={0} y={80} textAnchor="middle" fontSize={24} fontWeight={700} fill="#F59E0B">累積經驗洞察</text>
            <text x={0} y={105} textAnchor="middle" fontSize={16} fill="rgba(245,158,11,0.5)" fontFamily="'Inter', sans-serif">Gain insights</text>
          </g>
          <g opacity={arrow2Spring}>
            <line x1={705} y1={150} x2={705 + 55 * arrow2Spring} y2={150} stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} strokeLinecap="round" />
            {arrow2Spring > 0.8 && <polygon points="758,143 768,150 758,157" fill="rgba(255,255,255,0.3)" />}
          </g>
          <g opacity={phase3Spring} transform={`translate(920, 150) scale(${phase3Spring})`}>
            <rect x={-145} y={-120} width={290} height={240} rx={18} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth={2.5} />
            <text x={0} y={-15} textAnchor="middle" fontSize={26} fontWeight={700} fill="#10B981">針對性</text>
            <text x={0} y={12} textAnchor="middle" fontSize={20} fill="rgba(16,185,129,0.6)">客服機器人</text>
            <g opacity={checkSpring}>
              <path d="M -15 50 L -5 60 L 15 40" fill="none" stroke="#10B981" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              <text x={30} y={55} textAnchor="start" fontSize={20} fontWeight={600} fill="#10B981">能解決問題</text>
            </g>
            <text x={0} y={105} textAnchor="middle" fontSize={16} fill="rgba(16,185,129,0.5)" fontFamily="'Inter', sans-serif">Build targeted bot</text>
          </g>
        </svg>
      </AbsoluteFill>

      {/* Phase B */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: phaseBOpacity }}>
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})`, display: "flex", alignItems: "center", gap: 30, marginBottom: 50 }}>
          <div style={{ width: 500, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: 48, fontWeight: 900, color: "#EF4444", fontFamily: "'Inter', sans-serif" }}>VS</div>
          <div style={{ width: 500, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>
        <svg width={1700} height={520} viewBox="0 0 1100 340">
          <g opacity={wrongSpring} transform={`translate(280, 160) scale(${wrongSpring})`}>
            <rect x={-180} y={-130} width={360} height={260} rx={18} fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.3)" strokeWidth={2.5} />
            <text x={0} y={-20} textAnchor="middle" fontSize={30} fontWeight={700} fill="#EF4444">通用型客服機器人</text>
            <text x={0} y={10} textAnchor="middle" fontSize={20} fill="rgba(239,68,68,0.5)" fontFamily="'Inter', sans-serif">Generic chatbot</text>
            {xSpring > 0 && (
              <g opacity={xSpring * 0.6}>
                <line x1={-140} y1={-90} x2={140} y2={90} stroke="#EF4444" strokeWidth={6} strokeLinecap="round" />
                <line x1={140} y1={-90} x2={-140} y2={90} stroke="#EF4444" strokeWidth={6} strokeLinecap="round" />
              </g>
            )}
            <text x={0} y={90} textAnchor="middle" fontSize={22} fontWeight={600} fill="rgba(239,68,68,0.6)">沒有經驗就直接做</text>
          </g>
          <g opacity={gap1}><text x={550} y={165} textAnchor="middle" fontSize={48} fill="rgba(255,255,255,0.25)" fontFamily="'Inter', sans-serif">=</text></g>
          <g opacity={gap1} transform={`translate(820, 160)`}>
            <rect x={-200} y={-130} width={400} height={260} rx={18} fill="rgba(239,68,68,0.04)" stroke="rgba(239,68,68,0.2)" strokeWidth={2} />
            <text x={0} y={-80} textAnchor="middle" fontSize={30} fontWeight={700} fill="rgba(239,68,68,0.7)">什麼都缺了一點</text>
            <g opacity={gap1}><rect x={-155} y={-25} width={145} height={36} rx={10} fill="rgba(239,68,68,0.08)" /><text x={-82} y={0} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.45)">回答不精準</text></g>
            <g opacity={gap2}><rect x={10} y={-25} width={165} height={36} rx={10} fill="rgba(239,68,68,0.08)" /><text x={92} y={0} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.45)">流程不符合實際</text></g>
            <g opacity={gap3}><rect x={-100} y={30} width={200} height={36} rx={10} fill="rgba(239,68,68,0.08)" /><text x={0} y={55} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.45)">不能真正解決問題</text></g>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};