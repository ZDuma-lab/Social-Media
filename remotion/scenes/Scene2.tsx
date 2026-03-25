/**
 * Scene 2 — "3 Components That Activate Faith"
 * Duration: 192 frames
 * Visual: Three animated pillars (BELIEF → COMMITMENT → FAITHFULNESS) drawing in with staggered springs
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background, COLORS } from "../components/Background";
import { spr, slideUp, drawProgress } from "../utils/springs";

const PILLARS = [
  {
    label: "BELIEF",
    sub: "What you accept\nas true",
    color: COLORS.accent,
    icon: "◎",
    delay: 50,
  },
  {
    label: "COMMITMENT",
    sub: "Acting on\nwhat you trust",
    color: COLORS.green,
    icon: "◈",
    delay: 80,
  },
  {
    label: "FAITHFULNESS",
    sub: "Sustaining it\nover time",
    color: "#f59e0b",
    icon: "◉",
    delay: 110,
  },
] as const;

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagS  = spr(frame, fps, 0);
  const headS = spr(frame, fps, 8);
  const subS  = spr(frame, fps, 22);

  // Arrow draw-in between pillars
  const arr1P = drawProgress(frame, 78, 100);
  const arr2P = drawProgress(frame, 108, 130);

  // Bottom quote
  const quoteS = spr(frame, fps, 150);

  return (
    <Background>
      {/* Tag */}
      <div style={{ ...slideUp(tagS, 30), marginTop: 20, fontSize: 28, fontWeight: 600, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase" as const }}>
        The Anatomy of Faith
      </div>

      {/* Headline */}
      <div style={{ ...slideUp(headS, 50), marginTop: 24, fontSize: 64, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, textAlign: "center" as const }}>
        3 Components{"\n"}
        <span style={{ color: COLORS.accent }}>That Activate Faith</span>
      </div>

      {/* Subtitle */}
      <div style={{ ...slideUp(subS, 40), marginTop: 24, fontSize: 36, fontWeight: 400, color: COLORS.muted, lineHeight: 1.5, textAlign: "center" as const, maxWidth: 820 }}>
        The Greek word <em style={{ color: COLORS.white }}>pistis</em> — faith — means trust, loyalty, and relational commitment.
      </div>

      {/* Pillars row */}
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: 60, gap: 0, width: "100%" }}>
        {PILLARS.map((pillar, idx) => {
          const s = spr(frame, fps, pillar.delay);
          const height = 340 + idx * 60;
          return (
            <React.Fragment key={pillar.label}>
              {/* Arrow between pillars */}
              {idx > 0 && (
                <div style={{ display: "flex", alignItems: "center", paddingBottom: 40, flexShrink: 0 }}>
                  <svg width={40} height={36}>
                    <line
                      x1={2} y1={18} x2={30} y2={18}
                      stroke={idx === 1 ? COLORS.green : "#f59e0b"}
                      strokeWidth={3}
                      strokeDasharray={200}
                      strokeDashoffset={200 * (1 - (idx === 1 ? arr1P : arr2P))}
                      strokeLinecap="round"
                    />
                    <polygon
                      points="27,12 38,18 27,24"
                      fill={idx === 1 ? COLORS.green : "#f59e0b"}
                      opacity={idx === 1 ? arr1P : arr2P}
                    />
                  </svg>
                </div>
              )}

              {/* Pillar */}
              <div
                style={{
                  flex: 1,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
                }}
              >
                {/* Icon + label above bar */}
                <div style={{ textAlign: "center" as const, marginBottom: 16 }}>
                  <div style={{ fontSize: 48, color: pillar.color, lineHeight: 1 }}>{pillar.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: pillar.color, marginTop: 8, letterSpacing: 1 }}>
                    {pillar.label}
                  </div>
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: "100%",
                    height,
                    background: `linear-gradient(180deg, ${pillar.color} 0%, rgba(${hexRgb(pillar.color)},0.25) 100%)`,
                    borderRadius: "16px 16px 0 0",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 20,
                    border: `2px solid ${pillar.color}`,
                    borderBottom: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.85)",
                      textAlign: "center" as const,
                      lineHeight: 1.5,
                      padding: "0 12px",
                      whiteSpace: "pre-line" as const,
                    }}
                  >
                    {pillar.sub}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          ...slideUp(quoteS, 30),
          marginTop: "auto",
          paddingBottom: 16,
          fontSize: 32,
          fontWeight: 600,
          color: COLORS.muted,
          textAlign: "center" as const,
          fontStyle: "italic",
        }}
      >
        "Trust in action, sustained over time."
      </div>
    </Background>
  );
};

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
