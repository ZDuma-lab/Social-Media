/**
 * Scene 1 — "Faith Is Not Blind Belief"
 * Duration: 192 frames
 * Visual: animated eye (crossed-out → enlightened) + self-drawing flowchart
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background, COLORS } from "../components/Background";
import { spr, slideUp, drawProgress } from "../utils/springs";

const DASH = 340; // SVG path dash total

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Text entrances ────────────────────────────────────────────────────────
  const tagS   = spr(frame, fps, 0);
  const headS  = spr(frame, fps, 8);
  const subS   = spr(frame, fps, 22);

  // ── Eye phase: crossed-out (0-70), transforms (70-110) ───────────────────
  const crossOpacity = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rayOpacity   = interpolate(frame, [70, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eyeGlow      = interpolate(frame, [70, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eyeS         = spr(frame, fps, 35);

  // ── Flowchart draw-in (frames 105 → 192) ─────────────────────────────────
  const box1S  = spr(frame, fps, 105);
  const arr1P  = drawProgress(frame, 125, 148);
  const box2S  = spr(frame, fps, 145);
  const arr2P  = drawProgress(frame, 163, 184);
  const box3S  = spr(frame, fps, 180);

  return (
    <Background>
      {/* Tag */}
      <div
        style={{
          ...slideUp(tagS, 30),
          marginTop: 20,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.accent,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        How Faith Works
      </div>

      {/* Headline */}
      <div
        style={{
          ...slideUp(headS, 50),
          marginTop: 24,
          fontSize: 68,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        Faith Is Not{"\n"}
        <span style={{ color: COLORS.accent }}>Blind Belief</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          ...slideUp(subS, 40),
          marginTop: 28,
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.muted,
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: 820,
        }}
      >
        Real faith is confident trust built on experience, pattern, and relationship — not a leap into the dark.
      </div>

      {/* Eye SVG */}
      <div
        style={{
          opacity: eyeS,
          transform: `scale(${interpolate(eyeS, [0, 1], [0.8, 1])})`,
          marginTop: 48,
        }}
      >
        <svg width={340} height={200} viewBox="-170 -100 340 200">
          {/* Glow behind eye */}
          <ellipse
            cx={0}
            cy={0}
            rx={160}
            ry={72}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={2}
            opacity={eyeGlow * 0.35}
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Eye outline */}
          <path
            d="M -150,0 Q -75,-80 0,-80 Q 75,-80 150,0 Q 75,80 0,80 Q -75,80 -150,0 Z"
            fill="none"
            stroke={COLORS.white}
            strokeWidth={4}
          />

          {/* Iris */}
          <circle cx={0} cy={0} r={52} fill={COLORS.accent} opacity={0.9} />
          <circle cx={0} cy={0} r={30} fill="#1e1b4b" />
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} />
          {/* Highlight */}
          <circle cx={-18} cy={-18} r={9} fill="white" opacity={0.55} />

          {/* Light rays */}
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const r1 = 72, r2 = 72 + 28 + idx * 2;
            return (
              <line
                key={angle}
                x1={Math.cos(rad) * r1}
                y1={Math.sin(rad) * r1}
                x2={Math.cos(rad) * r2}
                y2={Math.sin(rad) * r2}
                stroke={COLORS.accent}
                strokeWidth={2.5}
                opacity={rayOpacity * (0.5 + idx * 0.05)}
              />
            );
          })}

          {/* Cross X (fades out) */}
          <line x1={-90} y1={-55} x2={90} y2={55} stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" opacity={crossOpacity} />
          <line x1={90} y1={-55} x2={-90} y2={55} stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" opacity={crossOpacity} />
        </svg>
      </div>

      {/* Flowchart: Evidence → Pattern → Trust */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 52,
          gap: 0,
        }}
      >
        {/* Box 1: Evidence */}
        <FlowBox label="Evidence" sub="What you observe" color={COLORS.accent} s={box1S} />

        {/* Arrow 1 */}
        <svg width={80} height={32} style={{ flexShrink: 0 }}>
          <line
            x1={4} y1={16} x2={66} y2={16}
            stroke={COLORS.accent}
            strokeWidth={3}
            strokeDasharray={DASH}
            strokeDashoffset={DASH * (1 - arr1P)}
            strokeLinecap="round"
          />
          <polygon
            points="62,10 76,16 62,22"
            fill={COLORS.accent}
            opacity={arr1P}
          />
        </svg>

        {/* Box 2: Pattern */}
        <FlowBox label="Pattern" sub="Recognition" color={COLORS.green} s={box2S} />

        {/* Arrow 2 */}
        <svg width={80} height={32} style={{ flexShrink: 0 }}>
          <line
            x1={4} y1={16} x2={66} y2={16}
            stroke={COLORS.green}
            strokeWidth={3}
            strokeDasharray={DASH}
            strokeDashoffset={DASH * (1 - arr2P)}
            strokeLinecap="round"
          />
          <polygon
            points="62,10 76,16 62,22"
            fill={COLORS.green}
            opacity={arr2P}
          />
        </svg>

        {/* Box 3: Trust */}
        <FlowBox label="Trust" sub="Faith activated" color="#f59e0b" s={box3S} />
      </div>
    </Background>
  );
};

const FlowBox: React.FC<{
  label: string;
  sub: string;
  color: string;
  s: number;
}> = ({ label, sub, color, s }) => (
  <div
    style={{
      opacity: s,
      transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
      background: `rgba(${hexToRgb(color)}, 0.12)`,
      border: `2px solid ${color}`,
      borderRadius: 16,
      padding: "18px 22px",
      textAlign: "center",
      minWidth: 180,
      flexShrink: 0,
    }}
  >
    <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{label}</div>
    <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{sub}</div>
  </div>
);

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
