/**
 * Scene 4 — "Faith Compounds Like Interest"
 * Duration: 192 frames
 * Visual: 4-bar animated chart with count-up multipliers and growth labels
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background, COLORS } from "../components/Background";
import { spr, slideUp, countUp } from "../utils/springs";

const BARS = [
  { label: "Small\nStep",    color: COLORS.accent,  maxH: 200, maxVal: 1,  delay: 50 },
  { label: "Result",         color: "#818cf8",       maxH: 340, maxVal: 2,  delay: 68 },
  { label: "Stronger\nBelief",color: COLORS.green,  maxH: 520, maxVal: 5,  delay: 86 },
  { label: "Bigger\nLeap",   color: "#34d399",       maxH: 780, maxVal: 12, delay: 104 },
] as const;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagS  = spr(frame, fps, 0);
  const headS = spr(frame, fps, 8);
  const subS  = spr(frame, fps, 22);
  const axisS = spr(frame, fps, 42);

  // Bottom quote
  const quoteS = spr(frame, fps, 158);

  return (
    <Background>
      {/* Tag */}
      <div style={{ ...slideUp(tagS, 30), marginTop: 20, fontSize: 28, fontWeight: 600, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase" as const }}>
        The Growth Cycle
      </div>

      {/* Headline */}
      <div style={{ ...slideUp(headS, 50), marginTop: 24, fontSize: 64, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, textAlign: "center" as const }}>
        Faith Compounds{"\n"}
        <span style={{ color: COLORS.accent }}>Like Interest</span>
      </div>

      {/* Subtitle */}
      <div style={{ ...slideUp(subS, 40), marginTop: 24, fontSize: 36, fontWeight: 400, color: COLORS.muted, lineHeight: 1.5, textAlign: "center" as const }}>
        Each act of trust builds the capacity for a bigger one. The cycle compounds.
      </div>

      {/* Chart area */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 48,
          flex: 1,
          paddingBottom: 60,
          position: "relative",
        }}
      >
        {/* Y-axis */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 60,
            top: 0,
            width: 3,
            background: "rgba(255,255,255,0.15)",
            opacity: axisS,
            borderRadius: 4,
          }}
        />
        {/* X-axis */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(255,255,255,0.15)",
            opacity: axisS,
            borderRadius: 4,
          }}
        />

        {/* Bars */}
        {BARS.map((bar, idx) => {
          const s = spr(frame, fps, bar.delay);
          const barH = interpolate(s, [0, 1], [0, bar.maxH]);
          const endFrame = bar.delay + 40;
          const val = countUp(frame, bar.delay, endFrame, bar.maxVal);

          return (
            <div
              key={bar.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 0,
              }}
            >
              {/* Multiplier value */}
              <div
                style={{
                  opacity: s,
                  fontSize: 44,
                  fontWeight: 800,
                  color: bar.color,
                  fontVariantNumeric: "tabular-nums",
                  marginBottom: 10,
                  lineHeight: 1,
                }}
              >
                {val}×
              </div>

              {/* Bar */}
              <div
                style={{
                  width: "80%",
                  height: barH,
                  background: `linear-gradient(180deg, ${bar.color} 0%, rgba(${hexRgb(bar.color)},0.3) 100%)`,
                  borderRadius: "12px 12px 0 0",
                  border: `2px solid ${bar.color}`,
                  borderBottom: "none",
                  boxShadow: `0 -8px 30px rgba(${hexRgb(bar.color)},0.4)`,
                  position: "relative",
                }}
              >
                {/* Shine */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "15%",
                    width: "30%",
                    height: "40%",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "0 0 50% 50%",
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  opacity: s,
                  marginTop: 14,
                  fontSize: 28,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center" as const,
                  lineHeight: 1.3,
                  whiteSpace: "pre-line" as const,
                }}
              >
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote */}
      <div
        style={{
          ...slideUp(quoteS, 30),
          fontSize: 32,
          fontWeight: 600,
          color: COLORS.muted,
          textAlign: "center" as const,
          fontStyle: "italic",
          paddingBottom: 8,
        }}
      >
        "Each step of faith is an investment in the next."
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
